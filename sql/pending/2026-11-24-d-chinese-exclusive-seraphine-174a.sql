-- Simplified Chinese exclusive Seraphine legend art "Starry Night Diva" (RAD 174a*), revealed at the
-- Season 4 Chengdu National Open. Copies the Chinese 174* row. Safe to run more than once.
insert into cards (r, nm, se, ty, tg, en, mi, po, mb, dom, ra, cn, img, la, pr, ext_id, ba)
select 71239, 'Starry-Eyed Songstress (Simplified Chinese Exclusive)', se, ty, tg, en, mi, po, mb, dom, ra, '174a*',
       'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/card-images/rad-zh-174as.webp', la, pr, 'card-71239', ba
from cards where r = 71198 and la = 'Chinese'
and not exists (select 1 from cards where r = 71239 or (se = 'RAD' and cn = '174a*' and la = 'Chinese'));
