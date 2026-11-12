-- Sharper Chinese pictures from eBay listing photos (cards cut out on white).
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/blazing-scorcher-nexus-night-ch-item-103-lg.webp') where id = 'item-103';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/consult-the-past-nexus-night-ch-item-97-lg.webp') where id = 'item-97';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/garen-rugged-foil-ch-item-330-lg.webp') where id = 'item-330';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/lux-crownguard-foil-ch-item-326-lg.webp') where id = 'item-326';
