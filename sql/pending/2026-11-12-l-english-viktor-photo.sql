-- Larger photo for the English Viktor trial-deck card. Safe to run more than once.
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/machine-herald-project-k-trial-deck-sample-en-v2-item-10671.webp') where id = 'item-10671';
