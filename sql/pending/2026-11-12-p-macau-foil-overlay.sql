-- Rainbow foil effect on the Macau Viktor, Volibear and Yasuo pictures (the online photos made them look non-foil).
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/machine-herald-macau-foil-ch-item-13.webp') where id = 'item-13';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/immortal-madness-macau-foil-ch-item-14.webp') where id = 'item-14';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/gale-swordsman-macau-foil-ch-item-16.webp') where id = 'item-16';
