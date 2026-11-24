-- Per-button counts for the daily click email (days are Pacific time).
with t as (select (now() at time zone 'America/Los_Angeles')::date as today),
d as (
  select (created_at at time zone 'America/Los_Angeles')::date as day, event, source
  from public.click_events
)
select coalesce(json_agg(r order by r.yesterday desc, r.week desc, r.all_time desc), '[]')
from (
  select event, source,
         count(*) filter (where day = t.today - 1)                    as yesterday,
         count(*) filter (where day >= t.today - 7 and day < t.today) as week,
         count(*)                                                     as all_time
  from d, t
  group by event, source
) r;
