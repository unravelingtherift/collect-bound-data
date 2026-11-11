-- Worlds 2025: keep ONE Playmat, Deckbox and Sleeves (item-294/295/296).
-- The second set (item-304/305/306) was the Riot Merch Store English bundle,
-- which is the same items. The tracker moves anyone who marked those to the
-- kept entries and asks if they own two. Safe to run more than once.
delete from promo_items where id in ('item-304','item-305','item-306');
update promo_items set data = data || jsonb_build_object('inf',
  coalesce(data->>'inf','') || E'\n\nRiot Merch Store: the same bundle was also sold in English through the Riot Merch Store. The playmat, deckbox and sleeves are identical in both, so they are listed once.')
 where id in ('item-294','item-295','item-296') and coalesce(data->>'inf','') not like '%Riot Merch Store: the same bundle%';
select id, data->>'nm' as name from promo_items where id in ('item-294','item-295','item-296','item-304','item-305','item-306') order by r;
