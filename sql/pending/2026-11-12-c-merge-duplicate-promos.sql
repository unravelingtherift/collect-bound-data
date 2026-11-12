-- One entry per identical promo: duplicates merged, every event listed under the kept entry.
-- Also: white-background Korea launch coin photo. Safe to run more than once.
create temp table m(keep text, dup text) on commit drop;
insert into m values
  ('item-62', 'item-109'),
  ('item-10000', 'item-10127'),
  ('item-10001', 'item-10128'),
  ('item-10002', 'item-10129'),
  ('item-10003', 'item-10130'),
  ('item-10004', 'item-10131'),
  ('item-10005', 'item-10132'),
  ('item-10024', 'item-10156'),
  ('item-10025', 'item-10154'),
  ('item-10026', 'item-10152'),
  ('item-10027', 'item-10157'),
  ('item-10028', 'item-10153'),
  ('item-10029', 'item-10155'),
  ('item-10074', 'item-10079'),
  ('item-10074', 'item-10110'),
  ('item-10074', 'item-10115'),
  ('item-10076', 'item-10081'),
  ('item-10076', 'item-10112'),
  ('item-10076', 'item-10117'),
  ('item-10077', 'item-10082'),
  ('item-10077', 'item-10113'),
  ('item-10077', 'item-10118'),
  ('item-10195', 'item-10202'),
  ('item-10195', 'item-10234'),
  ('item-10195', 'item-10239'),
  ('item-10196', 'item-10203'),
  ('item-10196', 'item-10235'),
  ('item-10196', 'item-10240'),
  ('item-10197', 'item-10204'),
  ('item-10197', 'item-10236'),
  ('item-10197', 'item-10241'),
  ('item-10198', 'item-10205'),
  ('item-10198', 'item-10237'),
  ('item-10198', 'item-10242'),
  ('item-10199', 'item-10238'),
  ('item-10199', 'item-10243'),
  ('item-69', 'item-357'),
  ('item-68', 'item-356');

update promo_items k set data = k.data || jsonb_build_object('ev', (
  select string_agg(e, chr(10) order by min_ord) from (
    select e, min(ord) as min_ord from (
      select e, ord from unnest(string_to_array(k.data->>'ev', chr(10))) with ordinality as t(e, ord)
      union all
      select e, 1000 + row_number() over () from m join promo_items d on d.id = m.dup,
        unnest(string_to_array(d.data->>'ev', chr(10))) as e
      where m.keep = k.id
    ) x where trim(e) <> '' group by e
  ) y))
where k.id in (select keep from m) and exists (select 1 from m join promo_items d on d.id = m.dup where m.keep = k.id);

delete from promo_items where id in (select dup from m);

update promo_items set data = data || '{"img":"https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/korea-launch-coin-teemo-card-kr-item-10644-w.webp"}'::jsonb
where id = 'item-10644';
