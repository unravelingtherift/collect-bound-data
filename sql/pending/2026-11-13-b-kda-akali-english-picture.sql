-- English Akali - Rogue Assassin (K/DA) was showing the Year of the Rift Akali card (VEN 139a). Use the real K/DA English card (KDA 004*/005 EN).
update promo_items
set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/akali-rogue-assassin-kda-en.webp')
where data->>'nm' = 'Akali - Rogue Assassin (Riftbound x K/DA: Couture Collection)'
  and data->>'la' = 'English';
-- English Ahri - Nine-Tailed Fox (K/DA): clearer card picture (KDA 001*/005 EN).
update promo_items
set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/ahri-nine-tailed-fox-kda-en.webp')
where data->>'nm' = 'Ahri - Nine-Tailed Fox (Riftbound x K/DA: Couture Collection)'
  and data->>'la' = 'English';
-- English Kai'Sa - Daughter of the Void (K/DA): clearer card picture (KDA 003*/005 EN).
update promo_items
set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/kaisa-daughter-of-the-void-kda-en.webp')
where data->>'nm' like 'Kai%Sa - Daughter of the Void (Riftbound x K/DA: Couture Collection)'
  and data->>'la' = 'English';
-- English Evelynn - Agony's Embrace (K/DA): clearer card picture (KDA 002*/005 EN).
update promo_items
set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/evelynn-agonys-embrace-kda-en.webp')
where data->>'nm' like 'Evelynn - Agony%s Embrace (Riftbound x K/DA: Couture Collection)'
  and data->>'la' = 'English';
