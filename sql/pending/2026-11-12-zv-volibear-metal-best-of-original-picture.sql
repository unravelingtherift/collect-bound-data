-- Volibear - Relentless Storm (Metal - BEST OF): the larger version has stretched, glitched edges; use the clean original.
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/volibear-relentless-storm-metal-best-of-en-item-281.webp') where id = 'item-281';
