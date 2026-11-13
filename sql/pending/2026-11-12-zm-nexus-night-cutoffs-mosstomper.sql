-- Five Chinese Unleashed Nexus Night cards were cut off at the top or bottom in the mat photo: use the complete Chinese pictures already in the tracker.
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/stare-down-ch-item-10144.webp') where id = 'item-10725';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/voracious-gromp-ch-item-10143.webp') where id = 'item-10726';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/dragonsoul-sage-ch-item-10142.webp') where id = 'item-10727';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/gustwalker-ch-item-10141.webp') where id = 'item-10728';
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/icevale-archer-ch-item-10140.webp') where id = 'item-10729';
-- Mosstomper (Unleashed Nexus Night): corner missing in the photo, so no picture until a complete one is found.
update promo_items set data = data || '{"img": ""}'::jsonb where id = 'item-10719';
