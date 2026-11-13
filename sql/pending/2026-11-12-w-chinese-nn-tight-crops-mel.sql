-- Blazing Scorcher + Consult the Past (Chinese Nexus Night): tighter crops. Mel: number is 069b.
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/blazing-scorcher-nexus-night-ch-item-103-lg-v2.webp') where id='item-103';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/consult-the-past-nexus-night-ch-item-97-lg-v2.webp') where id='item-97';
update promo_items set data = data || jsonb_build_object('cn','069b') where id='item-10708';
