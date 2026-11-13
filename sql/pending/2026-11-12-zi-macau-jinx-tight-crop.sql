-- Macau Loose Cannon (Jinx): crop the white margin so it matches the other three Macau tiles.
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/loose-cannon-macau-holo-v3-ch-item-15.webp') where id = 'item-15';
