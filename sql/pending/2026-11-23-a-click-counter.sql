-- Anonymous click counter for the join buttons, pop-ups and checkout.
-- Stores only which button and when. No user id, email, IP address or cookie.
-- The site can add rows but nobody outside the dashboard can read them.

create table if not exists public.click_events (
  id          bigint generated always as identity primary key,
  event       text not null check (event ~ '^[a-z0-9_]{1,40}$'),
  source      text not null default '' check (source ~ '^[a-z0-9/_-]{0,60}$'),
  created_at  timestamptz not null default now()
);

create index if not exists click_events_created_at_idx on public.click_events (created_at);

alter table public.click_events enable row level security;

revoke all on public.click_events from anon, authenticated;
grant insert (event, source) on public.click_events to anon, authenticated;

drop policy if exists "Site can add anonymous clicks" on public.click_events;
create policy "Site can add anonymous clicks"
  on public.click_events for insert
  to anon, authenticated
  with check (true);

-- Totals per button, newest activity first. Open it in Table Editor.
create or replace view public.click_totals
with (security_invoker = true) as
select
  event,
  source,
  count(*)                                                        as all_time,
  count(*) filter (where created_at >= now() - interval '7 days') as last_7_days,
  count(*) filter (where created_at >= date_trunc('day', now() at time zone 'America/Los_Angeles') at time zone 'America/Los_Angeles') as today,
  max(created_at)                                                 as last_click
from public.click_events
group by event, source
order by max(created_at) desc;

-- One row per day per button (Pacific time), for spotting trends.
create or replace view public.click_daily
with (security_invoker = true) as
select
  (created_at at time zone 'America/Los_Angeles')::date as day,
  event,
  source,
  count(*) as clicks
from public.click_events
group by 1, 2, 3
order by 1 desc, 4 desc;

revoke all on public.click_totals from anon, authenticated;
revoke all on public.click_daily  from anon, authenticated;
