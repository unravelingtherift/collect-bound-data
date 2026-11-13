-- The mat-photo pictures of these Unleashed Nexus Night cards looked wrong: back to the original Chinese pictures.
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/soul-sword-ch-item-10136.webp') where id = 'item-10720';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/mutated-mouser-ch-item-10137.webp') where id = 'item-10721';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/scorchclaw-ch-item-10135.webp') where id = 'item-10722';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/upstage-comedy-ch-item-10134.webp') where id = 'item-10723';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/arena-kingpin-ch-item-10133.webp') where id = 'item-10724';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/downstage-dramatics-ch-item-10139.webp') where id = 'item-10730';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/undying-loyalty-ch-item-10150.webp') where id = 'item-10731';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/loyal-poro-ch-item-10148.webp') where id = 'item-10732';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/ultrasoft-poro-ch-item-10149.webp') where id = 'item-10733';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/sinister-poro-ch-item-10147.webp') where id = 'item-10734';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/mister-root-ch-item-10146.webp') where id = 'item-10735';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/lunar-boon-ch-item-10145.webp') where id = 'item-10736';
