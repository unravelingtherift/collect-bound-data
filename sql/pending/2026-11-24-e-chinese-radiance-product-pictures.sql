-- Chinese Radiance product pictures from the official pre-sale announcement. Only fills empty pictures.
update public.product_items set data = data || jsonb_build_object('img', 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/product-images/radiance-evelynn-vs-seraphine-showdown-decks-zh.webp')
 where id = 'prod-85-ch' and coalesce(data->>'img','') = '';
update public.product_items set data = data || jsonb_build_object('img', 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/product-images/radiance-booster-pack-zh.webp')
 where id = 'prod-81-ch' and coalesce(data->>'img','') = '';
