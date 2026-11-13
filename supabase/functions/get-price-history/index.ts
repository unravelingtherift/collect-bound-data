// get-price-history — Collection-Bound prices from saved daily data (Supabase Edge Function)
//
// Who can use what:
//   everyone (no login needed): 'current' (today's TCGplayer price for one English card)
//                               'binder'  (value of a binder; free gets English cards + products)
//   Collector Club and VIP:     'card' price history charts; binder adds other languages + weekly change
//   everyone also:              'trends' (cards, promos and products rising / cooling over 7 days, for badges)
//   VIP only:                   'cardtrader', 'movers', 'rates', 'international'; binder adds value-over-time and per-item detail
// Modes:
//   { mode: 'card', set_code, collector_number, card_name, printing, days }
//       -> that card's daily TCGplayer market price history (English cards)
//   { mode: 'movers', days, set_code? }
//       -> biggest price risers and fallers over the last `days` days
//   { mode: 'cardtrader', set_code, collector_number, card_name, card_language, printing, foil_only, days }
//       -> that card's daily lowest CardTrader listing in that language (French, Chinese, Korean...)
// Data comes from the price_history / tcg_products tables filled daily by
// snapshot-prices. Matching uses the same rules as convert-tcg-price: set +
// collector number + card name must all agree, so a wrong card is never shown.
// Deploy via Editor with "Verify JWT" OFF (this function checks membership itself).

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

// @ts-ignore Deno global
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
// @ts-ignore Deno global
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const DB = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` };

// Collection-Bound set code -> TCGplayer groupId (same list as convert-tcg-price)
const GROUPS: Record<string, number> = {
  OGN: 24344, OGS: 24439, SFD: 24519, UNL: 24560, VEN: 24698, RAD: 24819, LGC: 24832,
};
const SET_FOR_GROUP: Record<number, string> = Object.fromEntries(Object.entries(GROUPS).map(([k, v]) => [v, k]));

const normName = (s: string) =>
  s.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s+aa\s*$/, '').replace(/[^a-z0-9]/g, '');
const normNumber = (s: string) =>
  s.split('/')[0].trim().toLowerCase().replace(/^([a-z]*)0+(?=\d)/, '$1');

// 'free' for visitors and free accounts, 'tier1' Collector Club, 'tier2' VIP.
async function callerTier(req: Request): Promise<string> {
  const auth = req.headers.get('Authorization') || '';
  if (!auth.toLowerCase().startsWith('bearer ')) return 'free';
  try {
    const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SERVICE_KEY, Authorization: auth } });
    if (!u.ok) return 'free';
    const user = await u.json();
    if (!user?.id) return 'free';
    const r = await fetch(`${SUPABASE_URL}/rest/v1/user_collections?user_id=eq.${encodeURIComponent(user.id)}&select=tier`, { headers: DB });
    if (!r.ok) return 'free';
    const tier = (await r.json())?.[0]?.tier;
    return tier === 'tier2' || tier === 'tier1' ? tier : 'free';
  } catch (_e) { return 'free'; }
}
const RANK: Record<string, number> = { free: 0, tier1: 1, tier2: 2 };

// Products per group, cached for 6 hours.
const productCache = new Map<number, { at: number; rows: { product_id: number; name: string; card_number: string }[] }>();
async function groupProducts(groupId: number) {
  const c = productCache.get(groupId);
  if (c && Date.now() - c.at < 6 * 3600 * 1000) return c.rows;
  const rows: any[] = [];
  for (let from = 0; ; from += 1000) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/tcg_products?group_id=eq.${groupId}&card_number=not.is.null&select=product_id,name,card_number`,
      { headers: { ...DB, Range: `${from}-${from + 999}` } });
    if (!r.ok) throw new Error(`tcg_products ${r.status}`);
    const page = await r.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  productCache.set(groupId, { at: Date.now(), rows });
  return rows;
}

// Find the TCGplayer product for an English card: set + number + name must all agree.
async function matchProductId(c: any): Promise<number | null> {
  if (String(c.card_language || 'English') !== 'English') return null;
  const groupId = GROUPS[String(c.set_code || '').toUpperCase()];
  if (!groupId) return null;
  const key = normNumber(String(c.collector_number || ''));
  if (!key || key.includes('*')) return null;
  const idx = await groupIndex(groupId);
  const m = idx.get(`${key}|${normName(String(c.card_name || ''))}`);
  return m && m.length === 1 ? m[0] : null;
}

// number|name -> product ids, built once per group (fast lookups for big binders)
const indexCache = new Map<number, { at: number; idx: Map<string, number[]> }>();
async function groupIndex(groupId: number) {
  const c = indexCache.get(groupId);
  if (c && Date.now() - c.at < 6 * 3600 * 1000) return c.idx;
  const idx = new Map<string, number[]>();
  for (const p of await groupProducts(groupId)) {
    const k = `${normNumber(String(p.card_number))}|${normName(String(p.name))}`;
    idx.set(k, [...(idx.get(k) || []), p.product_id]);
  }
  indexCache.set(groupId, { at: Date.now(), idx });
  return idx;
}

// Today's price for one English card (the newest saved day).
async function currentPrice(body: any) {
  const pid = await matchProductId(body);
  if (!pid) return { status: 'no_match' };
  const printing = String(body.printing || 'Normal').replace(/[^A-Za-z ]/g, '');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/price_history?product_id=eq.${pid}&sub_type=ilike.${encodeURIComponent(printing)}` +
    `&order=day.desc&limit=1&select=day,market_price,low_price,high_price`, { headers: DB });
  if (!r.ok) throw new Error(`price_history ${r.status}`);
  const x = (await r.json())[0];
  if (!x) return { status: 'no_price' };
  return { status: 'ok', currency: 'USD', source: 'TCGplayer (via TCGCSV)', day: x.day, market: x.market_price, low: x.low_price, high: x.high_price };
}

async function cardHistory(body: any) {
  if (String(body.card_language || 'English') !== 'English') return { history: [], status: 'english_only' };
  const pid = await matchProductId(body);
  if (!pid) return { history: [], status: 'no_match' };
  const matches = [{ product_id: pid }];

  const days = Math.min(365, Math.max(7, parseInt(body.days, 10) || 30));
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const printing = String(body.printing || 'Normal').replace(/[^A-Za-z ]/g, '');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/price_history?product_id=eq.${matches[0].product_id}` +
    `&sub_type=ilike.${encodeURIComponent(printing)}&day=gte.${since}&order=day.asc&select=day,market_price,low_price,high_price`, { headers: DB });
  if (!r.ok) throw new Error(`price_history ${r.status}`);
  const rows = await r.json();
  return {
    status: 'ok',
    currency: 'USD',
    source: 'TCGplayer (via TCGCSV)',
    history: rows.map((x: any) => ({ day: x.day, market: x.market_price, low: x.low_price, high: x.high_price })),
  };
}

// CardTrader: Collection-Bound language -> CardTrader's Riftbound language code
const CT_LANG: Record<string, string> = { English: 'en', French: 'fr', Chinese: 'zh-cn', Korean: 'kr' };

async function cardTraderHistory(body: any) {
  const lang = CT_LANG[String(body.card_language || '')];
  const set = String(body.set_code || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const key = normNumber(String(body.collector_number || ''));
  if (!lang || !set || !key || key.includes('*')) return { history: [], status: 'no_match' };

  // Find the card: same set + same collector number (CardTrader uses 003, 007a ...).
  // Ask only for this number (CardTrader pads to 3 digits: 7 -> 007, 39a -> 039a).
  const m = key.match(/^(\d+)(.*)$/);
  const variants = m ? [...new Set([key, m[1].padStart(3, '0') + m[2], m[1].padStart(2, '0') + m[2]])] : [key];
  const inList = variants.map((v) => `"${v}"`).join(',');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/ct_blueprints?expansion_code=eq.${set}&collector_number=in.(${encodeURIComponent(inList)})&select=blueprint_id,name,collector_number`, { headers: DB });
  if (!r.ok) throw new Error(`ct_blueprints ${r.status}`);
  let matches = (await r.json()).filter((b: any) => b.collector_number && normNumber(String(b.collector_number)) === key);
  if (matches.length > 1) {
    const want = normName(String(body.card_name || ''));
    matches = matches.filter((b: any) => normName(String(b.name)) === want);
  }
  if (matches.length !== 1) return { history: [], status: 'no_match' };
  const bp = matches[0];

  const days = Math.min(365, Math.max(7, parseInt(body.days, 10) || 30));
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const wantFoil = String(body.printing || 'Normal') === 'Foil';
  // A foil-only card has a single version, so listings count whether or not the seller ticked "foil".
  const foilFilter = body.foil_only ? '' : `&foil=eq.${wantFoil}`;
  const h = await fetch(`${SUPABASE_URL}/rest/v1/ct_price_history?blueprint_id=eq.${bp.blueprint_id}&language=eq.${encodeURIComponent(lang)}` +
    `${foilFilter}&day=gte.${since}&order=day.asc&select=day,foil,low_cents,median_cents,listings,currency`, { headers: DB });
  if (!h.ok) throw new Error(`ct_price_history ${h.status}`);
  const rows = await h.json();
  // One point per day; for foil-only cards prefer the foil row when both exist.
  const byDay = new Map<string, any>();
  for (const x of rows) {
    const cur = byDay.get(x.day);
    if (!cur || (x.foil === wantFoil && cur.foil !== wantFoil)) byDay.set(x.day, x);
  }
  const history = [...byDay.values()].map((x: any) => ({
    day: x.day, low: x.low_cents / 100, median: x.median_cents == null ? null : x.median_cents / 100, listings: x.listings,
  }));
  return {
    status: 'ok', source: 'CardTrader', currency: rows[0]?.currency || 'USD',
    card: bp.name, history, latest: history[history.length - 1] || null,
  };
}

// ---------------------------------------------------------------- binder value
// body.cards:    [{ k, set_code, collector_number, card_name, card_language, printing, qty }]
// body.products: [{ k, tp (TCGplayer product id), qty }]
// Returns today's unit price per item (USD) and, for members, value over time.
async function fetchAll(url: string) {
  const out: any[] = [];
  for (let from = 0; ; from += 1000) {
    const r = await fetch(url, { headers: { ...DB, Range: `${from}-${from + 999}` } });
    if (!r.ok) throw new Error(`${url.split('?')[0].split('/').pop()} ${r.status}`);
    const page = await r.json();
    out.push(...page);
    if (page.length < 1000) break;
  }
  return out;
}
const chunks = <T,>(a: T[], n: number) => { const o: T[][] = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; };

async function binderValue(body: any, tier: string) {
  const cards: any[] = Array.isArray(body.cards) ? body.cards.slice(0, 4000) : [];
  const products: any[] = Array.isArray(body.products) ? body.products.slice(0, 1000) : [];
  const items: Record<string, any> = {};

  // 1) English cards + sealed products -> TCGplayer product ids
  const want: { k: string; pid: number; sub: string; qty: number }[] = [];
  for (const c of cards) {
    if (String(c.card_language || 'English') !== 'English') continue;
    const pid = await matchProductId(c);
    if (pid) want.push({ k: String(c.k), pid, sub: String(c.printing || 'Normal').toLowerCase(), qty: Math.max(1, Number(c.qty) || 1) });
  }
  for (const p of products) {
    const pid = parseInt(p.tp, 10);
    if (pid > 0) want.push({ k: String(p.k), pid, sub: 'normal', qty: Math.max(1, Number(p.qty) || 1) });
  }
  const latestR = await fetch(`${SUPABASE_URL}/rest/v1/price_history?order=day.desc&limit=1&select=day`, { headers: DB });
  const latest = (await latestR.json())?.[0]?.day || null;
  const ids = [...new Set(want.map((w) => w.pid))];
  const priceOf = new Map<string, number>();
  if (latest && ids.length) {
    for (const part of chunks(ids, 150)) {
      const rows = await fetchAll(`${SUPABASE_URL}/rest/v1/price_history?day=eq.${latest}&product_id=in.(${part.join(',')})&select=product_id,sub_type,market_price`);
      for (const x of rows) if (x.market_price != null) priceOf.set(`${x.product_id}|${String(x.sub_type).toLowerCase()}`, Number(x.market_price));
    }
  }
  for (const w of want) {
    // sealed products are listed as "Normal"; fall back to the only printing if needed
    const v = priceOf.get(`${w.pid}|${w.sub}`);
    if (v != null) items[w.k] = { unit: v, qty: w.qty, source: 'tcgplayer' };
  }

  // 2) Other languages (Club and VIP): lowest CardTrader listing, same language + foil
  const ctNeed: { k: string; bp: number; lang: string; foil: boolean; foilOnly: boolean; qty: number }[] = [];
  if (RANK[tier] >= 1) {
    const other = cards.filter((c) => CT_LANG[String(c.card_language)] && String(c.card_language) !== 'English');
    if (other.length) {
      const sets = [...new Set(other.map((c) => String(c.set_code || '').toLowerCase().replace(/[^a-z0-9-]/g, '')).filter(Boolean))];
      const bps = sets.length ? await fetchAll(`${SUPABASE_URL}/rest/v1/ct_blueprints?expansion_code=in.(${sets.join(',')})&select=blueprint_id,expansion_code,collector_number`) : [];
      const bpByKey = new Map<string, number[]>();
      for (const b of bps) {
        const key = `${b.expansion_code}|${normNumber(String(b.collector_number || ''))}`;
        bpByKey.set(key, [...(bpByKey.get(key) || []), b.blueprint_id]);
      }
      const need: { k: string; bp: number; lang: string; foil: boolean; foilOnly: boolean; qty: number }[] = [];
      for (const c of other) {
        const list = bpByKey.get(`${String(c.set_code).toLowerCase()}|${normNumber(String(c.collector_number || ''))}`);
        if (!list || list.length !== 1) continue;
        need.push({ k: String(c.k), bp: list[0], lang: CT_LANG[String(c.card_language)], foil: String(c.printing) === 'Foil', foilOnly: !!c.foil_only, qty: Math.max(1, Number(c.qty) || 1) });
      }
      ctNeed.push(...need);
      const ctLatestR = await fetch(`${SUPABASE_URL}/rest/v1/ct_price_history?order=day.desc&limit=1&select=day`, { headers: DB });
      const ctLatest = (await ctLatestR.json())?.[0]?.day || null;
      if (ctLatest && need.length) {
        const low = new Map<string, number>();
        for (const part of chunks([...new Set(need.map((n) => n.bp))], 150)) {
          const rows = await fetchAll(`${SUPABASE_URL}/rest/v1/ct_price_history?day=eq.${ctLatest}&blueprint_id=in.(${part.join(',')})&select=blueprint_id,language,foil,low_cents`);
          for (const x of rows) if (x.low_cents != null) low.set(`${x.blueprint_id}|${x.language}|${x.foil}`, x.low_cents / 100);
        }
        for (const n of need) {
          const v = low.get(`${n.bp}|${n.lang}|${n.foil}`) ?? (n.foilOnly ? low.get(`${n.bp}|${n.lang}|${!n.foil}`) : undefined);
          if (v != null) items[n.k] = { unit: v, qty: n.qty, source: 'cardtrader' };
        }
      }
    }
  }

  // 2b) Promos (VIP) and products with no TCGplayer price: lowest eBay asking price (asking, not sold).
  const ebayWant: any[] = Array.isArray(body.ebay) ? body.ebay.slice(0, 80) : [];
  if (ebayWant.length) {
    const list = ebayWant
      .filter((e) => !items[String(e.k)] && (e.kind === 'prod' || (e.kind === 'promo' && RANK[tier] >= 2)))
      .map((e) => ({ k: String(e.k), kind: String(e.kind), id: String(e.id), qty: Math.max(1, Number(e.qty) || 1) }));
    if (list.length) {
      try {
        const r = await fetch(`${SUPABASE_URL}/functions/v1/get-ebay-price`, {
          method: 'POST', headers: { ...DB, 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: list.map((e) => ({ kind: e.kind, id: e.id })) }),
        });
        const prices = r.ok ? (await r.json())?.prices || {} : {};
        for (const e of list) {
          const p = prices[`${e.kind}:${e.id}`];
          if (p && p.low > 0) items[e.k] = { unit: p.low, qty: e.qty, source: 'ebay' };
        }
      } catch (_e) { /* eBay unavailable: those items simply stay unpriced */ }
    }
  }

  // 3) Value over time from TCGplayer prices: Club gets 8 days (weekly change), VIP up to 90.
  let history: { day: string; value: number }[] = [];
  if (RANK[tier] >= 1 && ids.length) {
    const days = RANK[tier] >= 2 ? Math.min(90, Math.max(7, parseInt(body.days, 10) || 30)) : 8;
    const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    const qtyBy = new Map<string, number>();
    for (const w of want) qtyBy.set(`${w.pid}|${w.sub}`, (qtyBy.get(`${w.pid}|${w.sub}`) || 0) + w.qty);
    const perDay = new Map<string, number>();
    for (const part of chunks(ids, 60)) {
      const rows = await fetchAll(`${SUPABASE_URL}/rest/v1/price_history?day=gte.${since}&product_id=in.(${part.join(',')})&select=day,product_id,sub_type,market_price`);
      for (const x of rows) {
        const q = qtyBy.get(`${x.product_id}|${String(x.sub_type).toLowerCase()}`);
        if (q && x.market_price != null) perDay.set(x.day, (perDay.get(x.day) || 0) + q * Number(x.market_price));
      }
    }
    history = [...perDay.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([day, value]) => ({ day, value: Math.round(value * 100) / 100 }));
  }

  // 4) Value over time for French, Chinese and Korean cards (lowest CardTrader listing per day).
  //    Same windows as English: Club 8 days, VIP up to 90.
  const historyByLang: Record<string, { day: string; value: number }[]> = {};
  if (RANK[tier] >= 1 && ctNeed.length) {
    const days = RANK[tier] >= 2 ? Math.min(90, Math.max(7, parseInt(body.days, 10) || 30)) : 8;
    const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    const NAME: Record<string, string> = { fr: 'French', 'zh-cn': 'Chinese', kr: 'Korean' };
    const byDay = new Map<string, Map<string, number>>(); // day -> "bp|lang|foil" -> low
    for (const part of chunks([...new Set(ctNeed.map((n) => n.bp))], 60)) {
      const rows = await fetchAll(`${SUPABASE_URL}/rest/v1/ct_price_history?day=gte.${since}&blueprint_id=in.(${part.join(',')})&select=day,blueprint_id,language,foil,low_cents`);
      for (const x of rows) {
        if (x.low_cents == null) continue;
        if (!byDay.has(x.day)) byDay.set(x.day, new Map());
        byDay.get(x.day)!.set(`${x.blueprint_id}|${x.language}|${x.foil}`, x.low_cents / 100);
      }
    }
    for (const [day, low] of [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      const sum: Record<string, number> = {};
      for (const n of ctNeed) {
        const v = low.get(`${n.bp}|${n.lang}|${n.foil}`) ?? (n.foilOnly ? low.get(`${n.bp}|${n.lang}|${!n.foil}`) : undefined);
        if (v != null) sum[n.lang] = (sum[n.lang] || 0) + v * n.qty;
      }
      for (const [lang, v] of Object.entries(sum)) {
        const name = NAME[lang]; if (!name) continue;
        (historyByLang[name] ||= []).push({ day, value: Math.round(v * 100) / 100 });
      }
    }
  }

  return { status: 'ok', currency: 'USD', day: latest, tier, items, history, history_by_lang: historyByLang };
}

// ---------------------------------------------------------------- trends
// Public: which English cards are rising or cooling over the last 7 days
// (TCGplayer market price, cards $1 and up). Used for the tracker's 🔥 / ❄️ badges.
// Price momentum only: TCGCSV has no sales counts, so this isn't sales volume.
let trendCache: { at: number; data: any } | null = null;
async function trends() {
  if (trendCache && Date.now() - trendCache.at < 60 * 60 * 1000) return trendCache.data;
  // Everything on TCGplayer that moved 15%+ in 7 days: cards, promos and sealed products.
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/price_trends`, {
    method: 'POST', headers: { ...DB, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_days: 7, p_min_pct: 15 }),
  });
  if (!r.ok) throw new Error(`price_trends ${r.status}`);
  const rows = await r.json();
  // Cards in the main sets, keyed by set|number|printing (what the Card Sets tab uses).
  const pick = (dir: string) => rows
    .filter((x: any) => x.direction === dir && SET_FOR_GROUP[x.group_id] && x.card_number)
    .map((x: any) => ({ k: `${SET_FOR_GROUP[x.group_id]}|${normNumber(String(x.card_number || ''))}|${String(x.sub_type || '').toLowerCase()}`, pct: Math.round(Number(x.pct) * 10) / 10 }));
  // Every item by TCGplayer product id (promos and sealed products use this);
  // when an item has several printings, the biggest move wins.
  const byId = new Map<number, { p: number; d: string; pct: number }>();
  for (const x of rows) {
    const pct = Math.round(Number(x.pct) * 10) / 10;
    const cur = byId.get(Number(x.product_id));
    if (!cur || Math.abs(pct) > Math.abs(cur.pct)) byId.set(Number(x.product_id), { p: Number(x.product_id), d: x.direction, pct });
  }
  const data = {
    status: 'ok', days: 7, base_day: rows[0]?.base_day ?? null, latest_day: rows[0]?.latest_day ?? null,
    rising: pick('up'),
    cooling: pick('down'),
    items: [...byId.values()],
  };
  trendCache = { at: Date.now(), data };
  return data;
}

// ----------------------------------------------------------- international
// VIP: the same card's lowest CardTrader listing in every language (newest day),
// so collectors can compare before paying the US price.
async function international(body: any) {
  const set = String(body.set_code || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const key = normNumber(String(body.collector_number || ''));
  if (!set || !key || key.includes('*')) return { status: 'no_match' };
  const m = key.match(/^(\d+)(.*)$/);
  const variants = m ? [...new Set([key, m[1].padStart(3, '0') + m[2], m[1].padStart(2, '0') + m[2]])] : [key];
  const r = await fetch(`${SUPABASE_URL}/rest/v1/ct_blueprints?expansion_code=eq.${set}&collector_number=in.(${encodeURIComponent(variants.map((v) => `"${v}"`).join(','))})&select=blueprint_id`, { headers: DB });
  const bps = r.ok ? await r.json() : [];
  if (bps.length !== 1) return { status: 'no_match' };
  const d = await fetch(`${SUPABASE_URL}/rest/v1/ct_price_history?blueprint_id=eq.${bps[0].blueprint_id}&order=day.desc&limit=1&select=day`, { headers: DB });
  const day = d.ok ? (await d.json())?.[0]?.day : null;
  if (!day) return { status: 'no_price' };
  const h = await fetch(`${SUPABASE_URL}/rest/v1/ct_price_history?blueprint_id=eq.${bps[0].blueprint_id}&day=eq.${day}&select=language,foil,low_cents,listings,currency`, { headers: DB });
  const rows = h.ok ? await h.json() : [];
  return { status: 'ok', day, source: 'CardTrader', currency: rows[0]?.currency || 'USD',
    prices: rows.map((x: any) => ({ language: x.language, foil: x.foil, low: x.low_cents / 100, listings: x.listings })) };
}

// ------------------------------------------------------------------ rates
// USD -> other currencies for the VIP "Show prices in" picker. Shares the
// exchange_rates_cache table with convert-tcg-price. When any rate is older
// than a day, ONE call to exchangerate-api refreshes all of them.
const FX = ['EUR', 'GBP', 'CAD', 'AUD', 'CNY', 'KRW', 'JPY'];
async function exchangeRates() {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/exchange_rates_cache?id=in.(${FX.join(',')})&select=id,conversion_rate,updated_at`, { headers: DB });
  const rows = r.ok ? await r.json() : [];
  const rates: Record<string, number> = { USD: 1 };
  let fresh = true;
  for (const c of FX) {
    const row = rows.find((x: any) => x.id === c);
    const v = row ? Number(row.conversion_rate) : NaN;
    if (isFinite(v) && v > 0) rates[c] = v;
    if (!row || Date.now() - new Date(row.updated_at).getTime() > 24 * 3600 * 1000) fresh = false;
  }
  // @ts-ignore Deno global
  const key = Deno.env.get('EXCHANGE_RATE_API_KEY') || '';
  if (!fresh && key) {
    try {
      const x = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
      const d = x.ok ? await x.json() : null;
      if (d?.result === 'success' && d.conversion_rates) {
        const now = new Date().toISOString();
        const up = FX.filter((c) => Number(d.conversion_rates[c]) > 0).map((c) => ({ id: c, conversion_rate: Number(d.conversion_rates[c]), updated_at: now }));
        for (const u of up) rates[u.id] = u.conversion_rate;
        await fetch(`${SUPABASE_URL}/rest/v1/exchange_rates_cache?on_conflict=id`, {
          method: 'POST', headers: { ...DB, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' }, body: JSON.stringify(up),
        });
      }
    } catch (_e) { /* keep the cached rates */ }
  }
  return { base: 'USD', rates };
}

async function movers(body: any) {
  const days = Math.min(90, Math.max(1, parseInt(body.days, 10) || 7));
  const group = body.set_code ? GROUPS[String(body.set_code).toUpperCase()] ?? -1 : null;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/price_movers`, {
    method: 'POST', headers: { ...DB, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_days: days, p_limit: 10, p_group: group }),
  });
  if (!r.ok) throw new Error(`price_movers ${r.status}`);
  const rows = await r.json();
  const shape = (x: any) => ({
    set_code: SET_FOR_GROUP[x.group_id] || null,
    collector_number: normNumber(String(x.card_number || '')),
    name: x.name, printing: x.sub_type,
    old_price: x.old_price, new_price: x.new_price, change: x.change, pct: x.pct,
  });
  return {
    status: 'ok', currency: 'USD', source: 'TCGplayer (via TCGCSV)',
    base_day: rows[0]?.base_day ?? null, latest_day: rows[0]?.latest_day ?? null,
    up: rows.filter((x: any) => x.direction === 'up').map(shape),
    down: rows.filter((x: any) => x.direction === 'down').map(shape),
  };
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
    const tier = await callerTier(req);
    const body = await req.json().catch(() => ({}));
    const mode = String(body.mode || 'card');
    if (mode === 'current') return json(await currentPrice(body));
    if (mode === 'binder') return json(await binderValue(body, tier));
    if (mode === 'trends') return json(await trends());
    if (mode === 'card') {
      if (RANK[tier] < 1) return json({ error: 'Collector Club membership required' }, 403);
      return json(await cardHistory(body));
    }
    if (RANK[tier] < 2) return json({ error: 'VIP membership required' }, 403);
    if (mode === 'movers') return json(await movers(body));
    if (mode === 'rates') return json(await exchangeRates());
    if (mode === 'international') return json(await international(body));
    if (mode === 'cardtrader') return json(await cardTraderHistory(body));
    return json({ error: 'Unknown mode' }, 400);
  } catch (err) {
    console.error('get-price-history error:', (err as Error).message);
    return json({ error: (err as Error).message }, 500);
  }
});
