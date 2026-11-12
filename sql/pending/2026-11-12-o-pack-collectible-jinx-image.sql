-- Replacement pack is a collectible (not a promo) and shows the whole pack; Korean Jinx uses the card picture.
update promo_items set data = data || jsonb_build_object('cat','COLLECTIBLE','img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/replacement-card-pack-silver-en-item-10668-v2.webp') where id = 'item-10668';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/jinx-demolitionist-korea-launch-kr-item-10662-v2.webp') where id = 'item-10662';
