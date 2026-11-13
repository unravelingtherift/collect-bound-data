-- Chinese Hand of Noxus, Loose Cannon, Volibear, The Boss: crop the white margin so they match the other Chinese OGN promo tiles.
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/hand-of-noxus-v2-ch-item-33.webp') where id = 'item-33';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/loose-cannon-v2-ch-item-34.webp') where id = 'item-34';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/volibear-relentless-storm-v2-ch-item-35.webp') where id = 'item-35';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/the-boss-v2-ch-item-37.webp') where id = 'item-37';
