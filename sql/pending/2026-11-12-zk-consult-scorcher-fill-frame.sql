-- Chinese Consult the Past and Blazing Scorcher: card fills the tile like the rest of the Nexus Night set.
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/consult-the-past-nexus-night-ch-item-97-v4.webp') where id = 'item-97';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/blazing-scorcher-nexus-night-ch-item-103-v4.webp') where id = 'item-103';
