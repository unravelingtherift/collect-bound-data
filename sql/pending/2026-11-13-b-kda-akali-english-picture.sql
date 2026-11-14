-- English Akali - Rogue Assassin (K/DA) was showing the Year of the Rift Akali card (VEN 139a). Remove that wrong picture so the tile reads "Image coming soon" until the real K/DA English card photo is added.
update promo_items
set data = data - 'img'
where data->>'nm' = 'Akali - Rogue Assassin (Riftbound x K/DA: Couture Collection)'
  and data->>'la' = 'English'
  and data->>'img' like '%akali-rogue-assassin-en.webp%';
