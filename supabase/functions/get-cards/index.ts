// get-cards Edge Function
//
// Serves Collect-Bound card data from Postgres instead of a static public
// JSON file. Stays anonymous-friendly (no login required, same as today),
// but:
//   1. Never returns more than MAX_LIMIT rows in one call, so a single
//      request can't dump a whole set.
//   2. Rate-limits by requester IP, so pulling the FULL catalog quickly
//      (every set, every page) requires many requests and will get
//      throttled -- a real visitor's browsing pattern never comes close.
//
// Deploy with:
//   supabase functions deploy get-cards --no-verify-jwt
//
// (--no-verify-jwt because this is called by anonymous visitors, not only
// logged-in users. The anon key is still sent and required -- see below --
// it's just not tied to a specific signed-in session.)

import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// --- tune these two numbers as the catalog grows ---
// At today's size (~2,800 cards across 5 sets), a full page load needs
// roughly 15 requests (2,800 / 200-per-page). 60/minute gives real visitors
// (including several sharing one IP, or a couple of page refreshes) plenty
// of headroom, while still meaning a full-catalog scrape takes real,
// logged, throttleable traffic instead of one instant request.
const MAX_LIMIT = 200;            // hard cap on rows per request, regardless of what's asked for
const RATE_LIMIT_PER_MINUTE = 60; // max requests per IP per rolling minute
// -----------------------------------------------------

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}


// Only unravelingtherift.com (and Squarespace's own preview sites) may call this function.
const ALLOWED_ORIGINS = [
  /^https:\/\/(www\.)?unravelingtherift\.com$/,
  /^https:\/\/[a-z0-9-]+\.squarespace\.com$/,
];
const originAllowed = (o: string | null) => !!o && ALLOWED_ORIGINS.some((r) => r.test(o));

Deno.serve(async (req) => {
  if (!originAllowed(req.headers.get('Origin'))) {
    return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Require the public anon key (same key already embedded in the app for
  // Supabase Auth). This isn't a login check -- it just means the endpoint
  // can't be hit with zero context, the same bar Supabase Auth calls already
  // sit behind. Legitimate visitors never notice this; it's sent automatically.
  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.includes(ANON_KEY)) {
    return jsonResponse({ error: "Missing or invalid API key" }, 401);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Identify the caller by IP for rate limiting.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  // Housekeeping: drop log rows older than 10 minutes so the table stays small.
  await admin
    .from("api_request_log")
    .delete()
    .lt("ts", new Date(Date.now() - 10 * 60 * 1000).toISOString());

  // Count this IP's requests in the last 60 seconds.
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
  const { count, error: countError } = await admin
    .from("api_request_log")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .gt("ts", oneMinuteAgo);

  if (countError) {
    console.error("rate limit count error", countError);
  } else if ((count ?? 0) >= RATE_LIMIT_PER_MINUTE) {
    return jsonResponse(
      { error: "Too many requests. Please slow down and try again shortly." },
      429
    );
  }

  // Log this request (best-effort; don't block the response on it failing).
  admin.from("api_request_log").insert({ ip }).then(({ error }) => {
    if (error) console.error("rate limit log insert error", error);
  });

  // --- Parse query params ---
  const url = new URL(req.url);
  const set = url.searchParams.get("set"); // e.g. 'OGN' - optional
  const offset = Math.max(0, parseInt(url.searchParams.get("offset") || "0", 10) || 0);
  const requestedLimit = parseInt(url.searchParams.get("limit") || String(MAX_LIMIT), 10);
  const limit = Math.min(MAX_LIMIT, Math.max(1, requestedLimit || MAX_LIMIT));

  let query = admin
    .from("cards")
    .select("r, nm, se, ty, tg, en, mi, po, mb, dom, ra, cn, img, la, pr, ext_id, ba", {
      count: "exact",
    })
    .order("r", { ascending: true })
    .range(offset, offset + limit - 1);

  if (set) {
    query = query.eq("se", set.toUpperCase());
  }

  const { data, error, count: totalCount } = await query;

  if (error) {
    console.error("query error", error);
    return jsonResponse({ error: "Failed to load card data" }, 500);
  }

  // Map back to the short-key shape the client already expects
  // (r, nm, se, ty, tg, en, mi, po, mb, do, ra, cn, img, la, pr, id, ba)
  const mapped = (data || []).map((row) => ({
    r: row.r,
    nm: row.nm,
    se: row.se,
    ty: row.ty,
    tg: row.tg,
    en: row.en,
    mi: row.mi,
    po: row.po,
    mb: row.mb,
    do: row.dom,
    ra: row.ra,
    cn: row.cn,
    img: row.img,
    la: row.la,
    pr: row.pr,
    id: row.ext_id,
    ba: row.ba,
  }));

  const nextOffset = offset + mapped.length < (totalCount ?? 0) ? offset + mapped.length : null;

  return jsonResponse({
    data: mapped,
    total: totalCount ?? 0,
    offset,
    limit,
    nextOffset,
  });
});
