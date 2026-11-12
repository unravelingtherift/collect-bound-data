-- Nov 12 2026 fixes. Safe to run more than once.
-- 1) Jinx figure: one product sold under two names in China -> one entry, both names, every event.
-- 2) Bonjour Jinx: one card -> one entry, both events.
-- 3) Chinese Garen, Rugged foils: one is the Legend foil, the other the Rare foil.
create temp table m(keep text, dup text) on commit drop;
insert into m values ('item-194','item-212'), ('item-65','item-355');

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

update promo_items set data = data || jsonb_build_object('nm', 'Twin Cities Battle Jinx Figure (Arcane Jinx Figure)',
  'inf', (data->>'inf') || ' Chinese listings sell this same figure under two names, Twin Cities Battle Jinx Figure and Arcane Jinx Figure.')
where id = 'item-194' and data->>'nm' not like '%(Arcane Jinx Figure)%';

update promo_items set data = data || jsonb_build_object(
  'inf', 'Commemorative, non-playable art card handed out at the official French-language preview and launch events in France for the Riftbound French launch ("La Première", May 29, 2026). There is only one version of this card.')
where id = 'item-65';

update promo_items set data = data || jsonb_build_object('nm', 'Garen - Rugged (Legend FOIL)', 'ra', 'Legend') where id = 'item-330';
update promo_items set data = data || jsonb_build_object('nm', 'Garen - Rugged (Rare FOIL)', 'ra', 'Rare') where id = 'item-336';
