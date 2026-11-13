// get-products — sealed product list for the Collection-Bound tracker (Supabase Edge Function)
//
// Returns 200 products per call ({ total, data }), oldest row first. The list lives in the
// product_items table, which browsers cannot read directly. Only unravelingtherift.com (and
// Squarespace's own preview sites) may call it, and each visitor is rate limited.
// Deployed automatically by .github/workflows/deploy-functions.yml (Verify JWT off).

const PAGE = 200;
const ALLOWED = [
  /^https:\/\/(www\.)?unravelingtherift\.com$/,
  /^https:\/\/[a-z0-9-]+\.squarespace\.com$/,
];
const originAllowed = (o: string | null) => !!o && ALLOWED.some((r) => r.test(o));

// @ts-ignore Deno global
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
// @ts-ignore Deno global
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const DB = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` };

// Simple per-visitor limit (best effort: each running copy of the function keeps its own count).
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 30;
}

function headers(origin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin && originAllowed(origin) ? origin : 'https://www.unravelingtherift.com',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
    'Content-Type': 'application/json',
  };
}

// @ts-ignore Deno global
Deno.serve(async (req: Request) => {
  const origin = req.headers.get('Origin');
  if (req.method === 'OPTIONS') return new Response('ok', { headers: headers(origin) });
  if (!originAllowed(origin)) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: headers(origin) });
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return new Response(JSON.stringify({ error: 'slow down' }), { status: 429, headers: headers(origin) });

  const offset = Math.max(0, parseInt(new URL(req.url).searchParams.get('offset') || '0', 10) || 0);
  const r = await fetch(`${SUPABASE_URL}/rest/v1/product_items?select=data&order=r.asc&limit=${PAGE}&offset=${offset}`, {
    headers: { ...DB, Prefer: 'count=exact' },
  });
  if (!r.ok) return new Response(JSON.stringify({ error: 'unavailable' }), { status: 502, headers: headers(origin) });
  const total = parseInt((r.headers.get('content-range') || '').split('/')[1] || '0', 10) || 0;
  const rows = await r.json();
  return new Response(JSON.stringify({ total, data: rows.map((x: { data: unknown }) => x.data) }), { headers: headers(origin) });
});
