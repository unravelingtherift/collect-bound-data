-- Cache for the get-ebay-price function (eBay asking prices, refreshed every 12 hours).
create table if not exists public.ebay_price_cache (id text primary key, data jsonb not null, at timestamptz not null default now());
alter table public.ebay_price_cache enable row level security;
revoke all on public.ebay_price_cache from anon, authenticated;
