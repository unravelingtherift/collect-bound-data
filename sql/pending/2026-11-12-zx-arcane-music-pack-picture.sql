-- Arcane Immersive Music Experience Pack (Chinese): clean picture under a new file name.
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/arcane-immersive-music-pink-pack-ch-item-10607-v2.webp') where id = 'item-10607';
update product_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/arcane-immersive-music-pink-pack-ch-item-10607-v2.webp') where id = 'prod-141-ch';
