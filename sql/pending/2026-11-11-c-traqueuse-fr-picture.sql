-- Straightened, centred French picture for Traqueuse de Bilgewater (RAD 003).
update cards set img = 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/rad-fr-3-v2.webp'
where la = 'French' and se = 'RAD' and img like '%/card-images/fr/rad-fr-3.webp';
