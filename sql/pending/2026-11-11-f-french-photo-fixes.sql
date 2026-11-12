-- Fixes to the French card photos from 2026-11-11-e:
-- overnumbered (*) Origins cards had shared a picture with the regular card, a sticker cropped off
-- Evelynn, a date stamp (Clou du spectacle) and 2 English cards (Curtain Call, Thrill of the Hunt) removed,
-- Poppy 178a and Rengar 183 added.
update cards c set img = v.img
from (values
  (22334, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/ogn-fr-302-p2.webp'),
  (22335, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/ogn-fr-302star-p.webp'),
  (22338, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/ogn-fr-304-p2.webp'),
  (22339, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/ogn-fr-304star-p.webp'),
  (22342, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/ogn-fr-306-p2.webp'),
  (22343, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/ogn-fr-306star-p.webp'),
  (22344, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/ogn-fr-307-p2.webp'),
  (22345, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/ogn-fr-307star-p.webp'),
  (22346, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/ogn-fr-308-p2.webp'),
  (22347, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/ogn-fr-308star-p.webp'),
  (43125, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/unl-fr-111-p2.webp'),
  (43206, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/unl-fr-178a-p.webp'),
  (43212, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/unl-fr-183-p.webp'),
  (22299, ''),
  (43211, 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/fr/unl-fr-182.webp'),
  (43213, '')
) as v(r, img)
where c.r = v.r and c.la = 'French';
