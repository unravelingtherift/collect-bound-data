-- English Akali - Rogue Assassin (K/DA) was showing the Year of the Rift Akali card (VEN 139a). Use the real K/DA English card (KDA 004*/005 EN).
update promo_items
set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/akali-rogue-assassin-kda-en.webp')
where data->>'nm' = 'Akali - Rogue Assassin (Riftbound x K/DA: Couture Collection)'
  and data->>'la' = 'English';
