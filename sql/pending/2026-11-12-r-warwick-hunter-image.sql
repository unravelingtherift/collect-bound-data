-- Warwick - Hunter (English, ARC 159b): point at a fresh copy of the picture so it shows.
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/warwick-hunter-promo-en-item-78.webp') where id = 'item-78';
