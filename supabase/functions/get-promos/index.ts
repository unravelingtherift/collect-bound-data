// get-promos — Collection-Bound Promos & Collectibles catalog (Supabase Edge Function)
//
// Same pattern as get-cards:
//  * Reads public.promo_items with the service role key. The table has
//    row-level security on and no policies, so browsers can't read it directly.
//  * Returns 200 promos per call: GET ?offset=0, ?offset=200, ...
//    Response: { data: [...], total: 615, offset: 0, full: true|false }
//  * Rate-limits each IP address. Normal visitors load the whole catalog in a
//    handful of calls; a scraper hammering it gets 429 "slow down".
//  * Members only get the research: visitors and free accounts receive just
//    the basics (picture, name, set, type, tags, rarity, language, domain, packaging,
//    collector number, event for the filter). Event, notes and distribution details are
//    left out of the response entirely, so they can't be pulled from the
//    browser's network tab. Collector Club (tier1) gets the research; the list
//    of specific events behind "Multiple Events/Cons ..." (evl) is VIP (tier2) only.
//
// Deploy with "Verify JWT" turned OFF (like get-cards), because visitors call
// it with the publishable key. Signed-in members send their login token, which
// this function checks itself. Free accounts get the event only for Nexus
// Night promos; other events and locations are for Club and VIP.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const PAGE_SIZE = 200;
const RATE_WINDOW_MS = 60 * 1000; // per minute...
const RATE_MAX = 30;              // ...this many calls per IP (a full load is ~4)

// Fields free visitors may see. Everything else stays members-only.
// ev + the special flags let free visitors use the Event filter and the Metal /
// Nexus Night / Tournament chips; the promo window still shows Event / Location as
// members-only, and notes, distribution details and event lists stay members-only.
const PUBLIC_KEYS = ['r', 'id', 'st', 'cat', 'nm', 'se', 'ty', 'tg', 'do', 'ra', 'la', 'img', 'fo', 'pt', 'pi', 'cn', 'ev', 'nn', 'tn', 'me', 'bm', 'pw'];

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', ...extra },
  });

// Simple per-IP counter. It lives in this function instance's memory, so it
// resets when Supabase restarts the instance — enough to slow bulk scraping.
const hits = new Map<string, { start: number; count: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.start > RATE_WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    if (hits.size > 5000) { // keep memory small
      for (const [k, v] of hits) if (now - v.start > RATE_WINDOW_MS) hits.delete(k);
    }
    return false;
  }
  h.count++;
  return h.count > RATE_MAX;
}

// Is the caller a paying member? The publishable key isn't a user login, so
// visitors fail the /auth/v1/user check and count as free.
// A member's answer is remembered for 5 minutes so the 4 page calls of one
// catalog load don't each look the account up again.
const memberCache = new Map<string, { at: number; tier: string }>();
async function callerTier(req: Request, supabaseUrl: string, serviceKey: string): Promise<string> {
  const auth = req.headers.get('Authorization') || '';
  if (!auth.toLowerCase().startsWith('bearer ')) return 'free';
  const token = auth.slice(7).trim();
  const c = memberCache.get(token);
  if (c && Date.now() - c.at < 5 * 60 * 1000) return c.tier;
  let paid = 'free';
  try {
    const u = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: serviceKey, Authorization: auth } });
    if (u.ok) {
      const user = await u.json();
      if (user?.id) {
        const r = await fetch(`${supabaseUrl}/rest/v1/user_collections?user_id=eq.${encodeURIComponent(user.id)}&select=tier`, {
          headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        });
        const tier = r.ok ? (await r.json())?.[0]?.tier : null;
        paid = tier === 'tier1' || tier === 'tier2' ? tier : 'free';
      }
    }
  } catch (_e) { paid = 'free'; }
  if (memberCache.size > 2000) memberCache.clear();
  memberCache.set(token, { at: Date.now(), tier: paid });
  return paid;
}

// Collector Club: everything except the VIP-only event list.
function clubView(item: any) {
  if (!item || item.evl === undefined) return item;
  const { evl: _evl, ...rest } = item;
  return rest;
}

function publicView(item: any) {
  const out: Record<string, unknown> = {};
  for (const k of PUBLIC_KEYS) if (item && item[k] !== undefined) out[k] = item[k];
  // Free accounts only learn about Nexus Night (a public event). Every other
  // event and location stays with Club and VIP.
  if (typeof out.ev === 'string') {
    const nn = out.ev.split('\n').map((x) => x.trim()).filter((x) => /^NN[\s-]/i.test(x));
    if (nn.length) out.ev = nn.join('\n'); else delete out.ev;
  }
  // Say THAT there are notes (so the tracker can show a blurred teaser) without sending them.
  if (item && typeof item.inf === 'string' && item.inf.trim()) out.hn = 1;
  return out;
}


// Only unravelingtherift.com (and Squarespace's own preview sites) may call this function.
const ALLOWED_ORIGINS = [
  /^https:\/\/(www\.)?unravelingtherift\.com$/,
  /^https:\/\/[a-z0-9-]+\.squarespace\.com$/,
];
const originAllowed = (o: string | null) => !!o && ALLOWED_ORIGINS.some((r) => r.test(o));

// @ts-ignore Deno global
Deno.serve(async (req: Request) => {
  if (!originAllowed(req.headers.get('Origin'))) {
    return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'GET') return json({ error: 'Use GET' }, 405);

  const ip =
    (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    req.headers.get('cf-connecting-ip') ||
    'unknown';

  if (rateLimited(ip)) {
    console.warn('get-promos: rate limited', ip);
    return json({ error: 'Too many requests, slow down' }, 429, { 'Retry-After': '60' });
  }

  try {
    const url = new URL(req.url);
    const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10) || 0);

    // @ts-ignore Deno global
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    // @ts-ignore Deno global
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const [r, tier] = await Promise.all([
      fetch(
        `${supabaseUrl}/rest/v1/promo_items?select=data&order=r.asc,id.asc&offset=${offset}&limit=${PAGE_SIZE}`,
        {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            Prefer: 'count=exact',
          },
        },
      ),
      callerTier(req, supabaseUrl, serviceKey),
    ]);
    if (!r.ok) {
      console.error('get-promos: database error', r.status, (await r.text()).slice(0, 200));
      return json({ error: 'Could not load promos' }, 500);
    }

    const rows: { data: unknown }[] = await r.json();
    // Content-Range looks like "0-199/615"; the number after "/" is the total.
    const total = parseInt((r.headers.get('content-range') || '').split('/')[1] || '', 10);
    const member = tier === 'tier1' || tier === 'tier2';
    const data = tier === 'tier2' ? rows.map((x) => x.data)
      : tier === 'tier1' ? rows.map((x) => clubView(x.data))
      : rows.map((x) => publicView(x.data));

    return json(
      { data, total: isFinite(total) ? total : rows.length, offset, full: member },
      200,
      // The answer depends on who's asking, so browsers and caches must not share it.
      { 'Cache-Control': 'private, no-cache', Vary: 'Authorization' },
    );
  } catch (err) {
    console.error('get-promos error:', (err as Error).message);
    return json({ error: 'Could not load promos' }, 500);
  }
});