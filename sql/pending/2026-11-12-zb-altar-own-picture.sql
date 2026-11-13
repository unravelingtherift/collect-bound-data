-- Altar to Unity [Autel d'unite] (French): back to Jessica's own picture (the eBay one had glare).
update promo_items set data = data || jsonb_build_object('img','https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/altar-to-unity-autel-d-unite-fr-item-63-mine.webp') where id='item-63';
