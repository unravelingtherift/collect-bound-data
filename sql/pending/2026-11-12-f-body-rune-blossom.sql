-- English Blossom runes are Unleashed promos (UNL R01b-R06b), not Spiritforged; new Body Rune scan.
update promo_items set data = data || '{"se":"UNL"}'::jsonb
where id in ('item-10024','item-10025','item-10026','item-10027','item-10028','item-10029') and data->>'se' <> 'UNL';
update promo_items set data = data || '{"img":"https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/body-rune-blossom-unl-r04b-en-item-10029.webp"}'::jsonb
where id = 'item-10029';
