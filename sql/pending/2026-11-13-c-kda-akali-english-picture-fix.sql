-- The English K/DA Akali still showed the Year of the Rift Akali card (VEN 139a). Match it more loosely this time.
update promo_items
set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/akali-rogue-assassin-kda-en.webp')
where data->>'la' = 'English'
  and data->>'nm' ilike '%akali%rogue assassin%'
  and data->>'nm' ilike '%k/da%';
-- Anything else on a K/DA tile that still points at the Year of the Rift Akali file: drop it.
update promo_items
set data = data - 'img'
where data->>'nm' ilike '%k/da%'
  and data->>'img' like '%akali-rogue-assassin-en.webp%';
