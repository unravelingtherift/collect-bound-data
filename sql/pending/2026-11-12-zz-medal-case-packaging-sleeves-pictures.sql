-- Stuttgart medal case becomes the packaging of the Gold, Silver and Bronze medals (separate tile removed).
update promo_items set data = data || jsonb_build_object('pi','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/rc-stuttgart-nation-clash-medal-case-packaging.webp','pt','Black hard case','inf', replace(data->>'inf',' The medals came in a black hard case (listed separately).',' The medals came in a black hard case, shown under Packaging.')) where id in ('item-10339','item-10340','item-10341');
delete from promo_items where id = 'item-10677';
-- League of Legends sleeves: pictures under new file names.
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/league-of-legends-sleeves-white-item-10647-v2.webp') where id = 'item-10647';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/league-of-legends-sleeves-black-item-10648-v2.webp') where id = 'item-10648';
