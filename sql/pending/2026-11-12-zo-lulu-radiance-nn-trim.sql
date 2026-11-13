-- Lulu - Whimsical (Radiance Nexus Night): trim the white edge and corners.
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/lulu-whimsical-radiance-nexus-night-en-v2.webp') where data->>'nm' = 'Lulu - Whimsical (Radiance Nexus Night)';
