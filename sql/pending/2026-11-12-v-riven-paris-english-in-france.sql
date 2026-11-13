-- Riven - Brisée (Paris Games Week 2026): the English card was handed out at the
-- French event, not a French-language card. Half-French / half-English flag + note.
update promo_items
set data = data
  || jsonb_build_object('lf', 'English')
  || jsonb_build_object('inf',
       case when coalesce(data->>'inf','') like '%English version%' then data->>'inf'
            else trim(both E'\n' from coalesce(data->>'inf','') || E'\n\n' ||
              'Note: the English-language card was given out at this event in France, not a French-language version.') end)
where data->>'la' = 'French'
  and data->>'nm' like 'Riven - Bris%Paris Games Week%';
