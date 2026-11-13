// get-ebay-price — lowest current eBay asking price for a product or promo (Supabase Edge Function)
//
// Every product and promo gets this automatically (the search comes from its own name), so new
// items need nothing extra. Optional per-item fields in the item's data: "eq" = a custom eBay
// search, "nb" = true to switch eBay prices off for that item.
//
// Rules (Jessica's pricing rule): real listings only, nothing guessed.
//  * ASKING prices from eBay's Browse API (eBay does not open sold-price data to new accounts).
//  * A listing only counts if its title has every word of the item name, and is not a lot,
//    proxy, custom, reprint, digital code, etc. Fewer than 3 matching listings = no price.
//  * English items only (a French/Chinese/Korean item would match the wrong listings).
//  * Sealed products: any signed-in or anonymous visitor on the site. Promos: VIP (tier2) only,
//    same as the other promo values.
// Secrets (Supabase → Edge Functions → Secrets): EBAY_APP_ID, EBAY_CERT_ID. Never put them in chat or code.
// Deployed automatically by .github/workflows/deploy-functions.yml (Verify JWT off).

const ALLOWED = [
  /^https:\/\/(www\.)?unravelingtherift\.com$/,
  /^https:\/\/[a-z0-9-]+\.squarespace\.com$/,
];
const originAllowed = (o: string | null) => !!o && ALLOWED.some((r) => r.test(o));

// @ts-ignore Deno global
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
// @ts-ignore Deno global
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
// @ts-ignore Deno global
const EBAY_APP_ID = Deno.env.get('EBAY_APP_ID') || '';
// @ts-ignore Deno global
const EBAY_CERT_ID = Deno.env.get('EBAY_CERT_ID') || '';
const DB = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` };
const CACHE_MS = 12 * 60 * 60 * 1000;
const MIN_LISTINGS = 3;

function headers(origin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin && originAllowed(origin) ? origin : 'https://www.unravelingtherift.com',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
    'Content-Type': 'application/json',
  };
}

const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 20;
}

async function isVip(req: Request): Promise<boolean> {
  const auth = req.headers.get('Authorization') || '';
  if (!auth.toLowerCase().startsWith('bearer ')) return false;
  try {
    const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SERVICE_KEY, Authorization: auth } });
    if (!u.ok) return false;
    const user = await u.json();
    if (!user?.id) return false;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/user_collections?user_id=eq.${encodeURIComponent(user.id)}&select=tier`, { headers: DB });
    return r.ok && (await r.json())?.[0]?.tier === 'tier2';
  } catch (_e) { return false; }
}

let tokenCache: { v: string; exp: number } | null = null;
async function ebayToken(): Promise<string | null> {
  if (tokenCache && tokenCache.exp > Date.now() + 60_000) return tokenCache.v;
  const r = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: 'Basic ' + btoa(`${EBAY_APP_ID}:${EBAY_CERT_ID}`) },
    body: 'grant_type=client_credentials&scope=' + encodeURIComponent('https://api.ebay.com/oauth/api_scope'),
  });
  if (!r.ok) return null;
  const j = await r.json();
  tokenCache = { v: j.access_token, exp: Date.now() + (j.expires_in || 7200) * 1000 };
  return tokenCache.v;
}

// Search words: our own labels in (...) and [...] are dropped, like the shop links on the tracker.
function searchName(name: string): string {
  return String(name || '').replace(/\[[^\]]*\]|\([^)]*\)/g, ' ').replace(/\s+-\s+/g, ' ').replace(/\s+/g, ' ').trim();
}
const STOP = new Set(['the', 'of', 'and', 'a', 'an', 'in', 'to', 'for']);
const fold = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const tokens = (s: string) => fold(s).replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w && !STOP.has(w));
// Words that don't tell two versions of a card apart (how we label promos, not how sellers do).
const GENERIC = new Set(['promo', 'exclusive', 'event', 'events', 'release', 'launch', 'korea', 'korean', 'france', 'french', 'china', 'chinese', 'english', 'set', 'card', 'version', 'prize', 'collection']);
// Words in the item name's (...) and [...] that tell this version from the regular card, e.g. "GG EZ".
function distinguishing(name: string): string[] {
  const bits = [...String(name || '').matchAll(/\[([^\]]*)\]|\(([^)]*)\)/g)].map((m) => m[1] || m[2] || '');
  const out = new Set<string>();
  for (const b of bits) {
    if (/[^\x00-\x7f]/.test(b)) continue; // local-language names are skipped
    for (const w of tokens(b)) if (w.length > 1 && !GENERIC.has(w)) out.add(w);
  }
  return [...out];
}
const LANG_WORDS: Record<string, string[]> = { Korean: ['korean', 'korea', 'kr'], French: ['french', 'france', 'fr'], Chinese: ['chinese', 'china', 'cn', 'simplified'] };
const BAD = /\b(lot|lots|bundle of|proxy|proxies|custom|reprint|replica|fake|digital|code only|empty|box only|read desc)\b/i;

async function ebaySearch(query: string, sealed: boolean, must: string[] = [], anyOf: string[] = []) {
  const tok = await ebayToken();
  if (!tok) return { error: true };
  const filter = ['buyingOptions:{FIXED_PRICE}', 'priceCurrency:USD', 'deliveryCountry:US'];
  if (sealed) filter.push('conditions:{NEW}');
  const u = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=100&sort=price&filter=${encodeURIComponent(filter.join(','))}`;
  const r = await fetch(u, { headers: { Authorization: `Bearer ${tok}`, 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US' } });
  if (!r.ok) return { error: true };
  const j = await r.json();
  const need = tokens(query);
  const prices: number[] = [];
  for (const it of j.itemSummaries || []) {
    const t = String(it.title || '');
    if (BAD.test(t)) continue;
    const have = new Set(tokens(t));
    if (!need.every((w) => have.has(w)) || !must.every((w) => have.has(w))) continue;
    if (anyOf.length && !anyOf.some((w) => have.has(w))) continue;
    const v = parseFloat(it.price?.value);
    if (it.price?.currency === 'USD' && v > 0) prices.push(v);
  }
  prices.sort((a, b) => a - b);
  if (prices.length < MIN_LISTINGS) return { none: true };
  const median = prices[Math.floor(prices.length / 2)];
  const sane = prices.filter((p) => p >= median * 0.4); // drops partial/parts listings far under the pack
  return { low: sane[0], median, count: prices.length, currency: 'USD' };
}

// One item: cached answer if fresh, otherwise a live eBay search (and cache it). Returns null when nothing usable.
async function lookup(kind: string, id: string, allowFetch = true): Promise<Record<string, unknown> | null> {
  const cacheId = `${kind}:${id}:v2`;
  const c = await fetch(`${SUPABASE_URL}/rest/v1/ebay_price_cache?id=eq.${encodeURIComponent(cacheId)}&select=data,at`, { headers: DB });
  if (c.ok) {
    const row = (await c.json())?.[0];
    if (row && Date.now() - new Date(row.at).getTime() < CACHE_MS) return row.data;
  }
  if (!allowFetch) return null;
  const t = await fetch(`${SUPABASE_URL}/rest/v1/${kind === 'promo' ? 'promo_items' : 'product_items'}?id=eq.${encodeURIComponent(id)}&select=data`, { headers: DB });
  const item = t.ok ? (await t.json())?.[0]?.data : null;
  if (!item) return { none: true };
  if (item.nb || (kind === 'prod' && item.la && item.la !== 'English')) return { none: true };
  const query = String(item.eq || searchName(item.nm));
  if (!query) return { none: true };
  // Promo cards share a name with the regular card, so a listing only counts when its title also has the
  // promo's distinguishing words. No distinguishing words (and no custom search "eq") = can't verify = no price.
  let must: string[] = [];
  if (kind === 'promo' && !item.eq && String(item.ty || 'Card') === 'Card') {
    must = distinguishing(item.nm);
    // Alternate-art / promo numbers like 076b are printed on the card and sellers often repeat them.
    if (!must.length && /^\d+[a-z]$/i.test(String(item.cn || ''))) must = [String(item.cn).toLowerCase()];
    if (!must.length) return { none: true };
  }
  const anyOf = kind === 'promo' && item.la && item.la !== 'English' ? (LANG_WORDS[item.la] || []) : [];
  if (kind === 'promo' && item.la && item.la !== 'English' && !anyOf.length) return { none: true };
  const res: Record<string, unknown> = await ebaySearch(query + (anyOf.length ? ' ' + anyOf[0] : ''), kind === 'prod', must, anyOf);
  if (res.error) return null; // eBay hiccup: nothing is cached, nothing is shown
  const data = { ...res, query, at: new Date().toISOString() };
  await fetch(`${SUPABASE_URL}/rest/v1/ebay_price_cache`, {
    method: 'POST', headers: { ...DB, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ id: cacheId, data, at: new Date().toISOString() }),
  });
  return data;
}

// @ts-ignore Deno global
Deno.serve(async (req: Request) => {
  const origin = req.headers.get('Origin');
  if (req.method === 'OPTIONS') return new Response('ok', { headers: headers(origin) });
  const out = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: headers(origin) });

  // Internal batch call from get-price-history (binder value), proven by the service key. No browser can send it.
  if (SERVICE_KEY && req.headers.get('Authorization') === `Bearer ${SERVICE_KEY}`) {
    if (!EBAY_APP_ID || !EBAY_CERT_ID) return out({ prices: {} });
    let b: { items?: { kind: string; id: string }[] } = {};
    try { b = await req.json(); } catch (_e) { return out({ prices: {} }); }
    const list = (b.items || []).filter((x) => (x.kind === 'promo' || x.kind === 'prod') && /^[a-z0-9-]{1,60}$/i.test(String(x.id))).slice(0, 80);
    const prices: Record<string, { low: number; count: number }> = {};
    let fetched = 0;
    for (let i = 0; i < list.length; i += 4) {
      await Promise.all(list.slice(i, i + 4).map(async (x) => {
        const key = `${x.kind}:${x.id}`;
        let d = await lookup(x.kind, x.id, false);
        if (!d && fetched < 24) { fetched++; d = await lookup(x.kind, x.id, true); }
        if (d && (d as { low?: number }).low) prices[key] = { low: (d as { low: number }).low, count: (d as { count: number }).count };
      }));
    }
    return out({ prices });
  }

  if (!originAllowed(origin)) return out({ error: 'forbidden' }, 403);
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return out({ error: 'slow down' }, 429);
  if (!EBAY_APP_ID || !EBAY_CERT_ID) return out({ none: true });

  let body: { kind?: string; id?: string } = {};
  try { body = await req.json(); } catch (_e) { return out({ error: 'bad request' }, 400); }
  const kind = body.kind === 'promo' ? 'promo' : body.kind === 'prod' ? 'prod' : '';
  const id = String(body.id || '');
  if (!kind || !/^[a-z0-9-]{1,60}$/i.test(id)) return out({ error: 'bad request' }, 400);
  if (kind === 'promo' && !(await isVip(req))) return out({ error: 'vip only' }, 403);
  return out((await lookup(kind, id)) || { none: true });
});
