// convert-tcg-price — Collection-Bound price service (Supabase Edge Function)
//
// What this version does:
//  * Reads the exact fields the Collection-Bound tracker sends (card_id, card_name,
//    set_code, collector_number, language, currency, printing, condition ...).
//  * ENGLISH cards: looks up the daily TCGplayer price list published by TCGCSV
//    (https://tcgcsv.com, Riftbound = category 89), matched by set + collector number
//    + card name. USD figures; converted to the requested currency if needed.
//  * Chinese / Korean / French cards, and anything it can't match with certainty:
//    answers "no price" (the tracker then shows "price unavailable" and its
//    "Find this card" links). It NEVER invents or estimates a price.
//  * TCGCSV has no per-condition prices, so only Near Mint (NM) is answered.
//  * Live exchange rate (cached 24h in exchange_rates_cache) for currency conversion.
//  * Only signed-in VIP (tier2) members can call it; everyone else gets 403.
//
// Swap lookupNativePrice() for a different real source later (TCGplayer API,
// Scrydex, ...) — conversion, USD comparison, caching and response shape stay as is.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATE_TTL_MS = 24 * 60 * 60 * 1000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

type PriceQuery = {
  cardId: string;
  cardName: string;
  setCode: string;
  collectorNumber: string;
  cardLanguage: string; // 'English' | 'Chinese' | 'Korean' | 'French'
  printing: string;     // 'Normal' | 'Foil'
  condition: string;    // 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
};

type Quote = {
  market: number | null;
  low: number | null;
  high: number | null;
  currency: string;     // the currency these numbers are in
  source: string;       // e.g. 'TCGplayer'
  updatedAt?: string;
};

// ---------------------------------------------------------------------------
// PRICE SOURCE — TCGCSV (daily TCGplayer prices, USD). English cards only.
// ---------------------------------------------------------------------------
const TCGCSV = 'https://tcgcsv.com/tcgplayer/89';
// Identify ourselves politely so TCGCSV's firewall doesn't mistake us for an anonymous bot.
const TCGCSV_HEADERS = {
  'User-Agent': 'Collection-Bound/1.0 (+https://unravelingtherift.com)',
  Accept: 'application/json',
};
const GROUP_CACHE_MS = 6 * 60 * 60 * 1000; // data only changes once a day

// Collection-Bound set code -> TCGplayer groupId (from tcgcsv.com/tcgplayer/89/groups)
const GROUPS: Record<string, number> = {
  OGN: 24344, // Origins
  OGS: 24439, // Origins: Proving Grounds
  SFD: 24519, // Spiritforged
  UNL: 24560, // Unleashed
  VEN: 24698, // Vendetta
  RAD: 24819, // Radiance
  LGC: 24832, // Legacy
};

type GroupData = {
  at: number;
  byNumber: Map<string, { productId: number; name: string }[]>;
  prices: Map<string, { low: number | null; mid: number | null; market: number | null; high: number | null }>;
  updatedAt?: string;
};
const groupCache = new Map<number, GroupData>();

// Collection-Bound writes alternate arts as "Teemo, Scout AA"; TCGplayer writes
// "Teemo, Scout (Alternate Art)". Both normalise to "teemoscout" — the collector
// number (197 vs 197a) is what tells the two printings apart.
const normName = (s: string) =>
  s.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s+aa\s*$/, '').replace(/[^a-z0-9]/g, '');

// "001/298" -> "1", "007a/298" -> "7a", "R01a/R12" -> "r1a", "299*" -> "299*"
const normNumber = (s: string) =>
  s.split('/')[0].trim().toLowerCase().replace(/^([a-z]*)0+(?=\d)/, '$1');

const numOrNull = (v: unknown) => (typeof v === 'number' && isFinite(v) ? v : null);

async function loadGroup(groupId: number): Promise<GroupData> {
  const cached = groupCache.get(groupId);
  if (cached && Date.now() - cached.at < GROUP_CACHE_MS) return cached;

  const [pr, pc] = await Promise.all([
    fetch(`${TCGCSV}/${groupId}/products`, { headers: TCGCSV_HEADERS }),
    fetch(`${TCGCSV}/${groupId}/prices`, { headers: TCGCSV_HEADERS }),
  ]);
  if (!pr.ok || !pc.ok) {
    const snippet = (await (pr.ok ? pc : pr).text().catch(() => '')).slice(0, 200).replace(/\s+/g, ' ');
    throw new Error(`TCGCSV unavailable (products ${pr.status}, prices ${pc.status}) ${snippet}`);
  }
  const products = (await pr.json()).results ?? [];
  const prices = (await pc.json()).results ?? [];

  const byNumber: GroupData['byNumber'] = new Map();
  for (const p of products) {
    const num = (p.extendedData ?? []).find((e: { name: string }) => e.name === 'Number')?.value;
    if (!num) continue; // sealed product, not a card
    const key = normNumber(String(num));
    const list = byNumber.get(key) ?? [];
    list.push({ productId: p.productId, name: normName(String(p.name ?? '')) });
    byNumber.set(key, list);
  }

  const priceMap: GroupData['prices'] = new Map();
  for (const r of prices) {
    priceMap.set(`${r.productId}|${String(r.subTypeName ?? '').toLowerCase()}`, {
      low: numOrNull(r.lowPrice),
      mid: numOrNull(r.midPrice),
      market: numOrNull(r.marketPrice),
      high: numOrNull(r.highPrice),
    });
  }

  let updatedAt: string | undefined;
  try {
    const lu = await fetch('https://tcgcsv.com/last-updated.txt', { headers: TCGCSV_HEADERS });
    if (lu.ok) {
      const d = new Date((await lu.text()).trim());
      if (!isNaN(d.getTime())) updatedAt = d.toISOString();
    }
  } catch (_e) { /* optional */ }

  const data: GroupData = { at: Date.now(), byNumber, prices: priceMap, updatedAt };
  groupCache.set(groupId, data);
  return data;
}

// Returns a REAL quote, or null when there isn't one we can stand behind.
async function lookupNativePrice(q: PriceQuery): Promise<Quote | null> {
  if (q.cardLanguage !== 'English') return null;       // other markets: no source yet
  if (q.condition.toUpperCase() !== 'NM') return null; // TCGCSV has no per-condition prices
  const groupId = GROUPS[q.setCode.toUpperCase()];
  if (!groupId) return null;

  const key = normNumber(q.collectorNumber);
  if (!key || key.includes('*')) return null;          // unsure how signatures are numbered

  let group: GroupData;
  try {
    group = await loadGroup(groupId);
  } catch (e) {
    // Price list unreachable: log the reason (Supabase -> Logs) and answer "no price"
    // so the page shows "unavailable" plus the Find-this-card links instead of an error.
    console.error('TCGCSV lookup failed:', (e as Error).message);
    return null;
  }
  const wantName = normName(q.cardName);
  // Number AND name must both agree, so a wrong card is never priced.
  const matches = (group.byNumber.get(key) ?? []).filter((p) => p.name === wantName);
  if (matches.length !== 1) return null;

  const price = group.prices.get(`${matches[0].productId}|${q.printing.toLowerCase()}`);
  if (!price) return null;
  const market = price.market ?? price.mid;
  if (market === null && price.low === null && price.high === null) return null;

  return {
    market,
    low: price.low,
    high: price.high,
    currency: 'USD',
    source: 'TCGplayer (via TCGCSV)',
    updatedAt: group.updatedAt,
  };
}

// ---------------------------------------------------------------------------
// Exchange rates: USD -> currency, cached in public.exchange_rates_cache
// ---------------------------------------------------------------------------
async function getUsdRate(currency: string): Promise<number | null> {
  if (currency === 'USD') return 1;

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const apiKey = Deno.env.get('EXCHANGE_RATE_API_KEY') || '';
  const dbHeaders = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };

  let staleRate: number | null = null;

  // 1. Cache
  try {
    const r = await fetch(
      `${supabaseUrl}/rest/v1/exchange_rates_cache?id=eq.${currency}&select=conversion_rate,updated_at`,
      { headers: dbHeaders },
    );
    if (r.ok) {
      const row = (await r.json())[0];
      const rate = row ? Number(row.conversion_rate) : NaN;
      if (isFinite(rate) && rate > 0) {
        staleRate = rate;
        if (Date.now() - new Date(row.updated_at).getTime() < RATE_TTL_MS) return rate;
      }
    }
  } catch (_e) { /* fall through to live lookup */ }

  // 2. Live lookup, then save to the cache
  if (apiKey) {
    try {
      const r = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/USD/${currency}`);
      if (r.ok) {
        const d = await r.json();
        const rate = Number(d.conversion_rate);
        if (d.result === 'success' && isFinite(rate) && rate > 0) {
          try {
            await fetch(`${supabaseUrl}/rest/v1/exchange_rates_cache?on_conflict=id`, {
              method: 'POST',
              headers: { ...dbHeaders, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
              body: JSON.stringify({ id: currency, conversion_rate: rate, updated_at: new Date().toISOString() }),
            });
          } catch (_e) { /* caching is best-effort */ }
          return rate;
        }
      }
    } catch (_e) { /* use stale below */ }
  }

  return staleRate; // may be null — callers must handle that
}

// ---------------------------------------------------------------------------
// VIP check — only signed-in VIP members (tier2) may use price lookup, so nobody
// can call this function directly and burn your exchange-rate / data credits.
// The anon key alone is NOT enough: the caller must be a real signed-in user.
// ---------------------------------------------------------------------------
async function callerIsVip(req: Request): Promise<boolean> {
  const auth = req.headers.get('Authorization') || '';
  if (!auth.toLowerCase().startsWith('bearer ')) return false;

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  try {
    const u = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: serviceKey, Authorization: auth },
    });
    if (!u.ok) return false;
    const user = await u.json();
    if (!user?.id) return false;

    const r = await fetch(
      `${supabaseUrl}/rest/v1/user_collections?user_id=eq.${encodeURIComponent(user.id)}&select=tier`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
    );
    if (!r.ok) return false;
    const rows = await r.json();
    return rows?.[0]?.tier === 'tier2';
  } catch (_e) {
    return false;
  }
}

const round2 = (n: number | null) => (n === null ? null : Math.round(n * 100) / 100);

// Convert an amount between currencies via USD. Returns null if a rate is missing.
function convertAmount(
  amount: number | null,
  from: string,
  to: string,
  rates: Record<string, number | null>,
): number | null {
  if (amount === null) return null;
  if (from === to) return amount;
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate) return null;
  return (amount / fromRate) * toRate;
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

  try {
    if (!(await callerIsVip(req))) {
      console.warn('convert-tcg-price: caller is not a signed-in VIP');
      return json({ error: 'VIP membership required' }, 403);
    }

    const body = await req.json().catch(() => ({}));

    // Field names the tracker sends (older names still accepted)
    const q: PriceQuery = {
      cardId: String(body.card_id ?? body.productId ?? ''),
      cardName: String(body.card_name ?? body.cardName ?? ''),
      setCode: String(body.set_code ?? ''),
      collectorNumber: String(body.collector_number ?? ''),
      cardLanguage: String(body.card_language ?? ''),
      printing: String(body.printing ?? 'Normal'),
      condition: String(body.condition ?? 'NM'),
    };

    if (!q.cardId && !q.cardName) return json({ error: 'Missing card_id or card_name' }, 400);

    // Currency the caller wants the answer in (tracker sends the card's market currency,
    // or USD for the comparison line).
    const wanted = String(body.currency ?? body.targetCurrency ?? 'USD').toUpperCase();
    const target = /^[A-Z]{3}$/.test(wanted) ? wanted : 'USD';

    const quote = await lookupNativePrice(q);

    if (!quote) {
      // No real price available — say so honestly (HTTP 200, so the page shows
      // "price unavailable" instead of an error).
      return json({ price: null, currency: target, source: null, status: 'no_price_source' });
    }

    const rates: Record<string, number | null> = {
      USD: 1,
      [target]: await getUsdRate(target),
      [quote.currency]: await getUsdRate(quote.currency),
    };

    const market = convertAmount(quote.market, quote.currency, target, rates);
    const low = convertAmount(quote.low, quote.currency, target, rates);
    const high = convertAmount(quote.high, quote.currency, target, rates);

    if (market === null && low === null && high === null) {
      // A price existed but we couldn't convert it (no exchange rate) — don't guess.
      return json({ price: null, currency: target, source: quote.source, status: 'no_exchange_rate' });
    }

    return json({
      price: round2(market),
      market: round2(market),
      low: round2(low),
      high: round2(high),
      currency: target,
      source: quote.source,
      updated_at: quote.updatedAt ?? new Date().toISOString(),
      status: 'ok',
    });
  } catch (err) {
    console.error('convert-tcg-price error:', (err as Error).message);
    return json({ error: (err as Error).message }, 500);
  }
});