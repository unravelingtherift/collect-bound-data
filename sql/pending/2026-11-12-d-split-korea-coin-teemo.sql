-- Split the Korea launch coin and the Teemo card into two entries. Safe to run more than once.
update promo_items set data = data || jsonb_build_object(
  'nm', 'Riftbound Coin (Korea Launch)',
  'ty', 'Coin',
  'tg', 'Coin' || chr(10) || 'Korea Launch',
  'img', 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/korea-launch-riftbound-coin-kr-item-10644.webp',
  'inf', 'Gold Riftbound coin handed out at the Korea launch events in September 2026, together with the Korean Teemo card (listed separately). The extra photo shows the front and back of the coin.')
where id = 'item-10644';
insert into promo_items (id, r, data)
select 'item-10653', 10653, $j${"r": 10653, "id": "item-10653", "cat": "PROMO", "nm": "Teemo - Swift Scout [Korea Launch Exclusive]", "la": "Korean", "ev": "Korea Launch - Gen.G GGX, Seoul\nKorea Launch - Yongsan IPark Dopamine Station, Seoul", "se": "OGN", "ty": "Card", "cn": "N/A", "ra": "Promo", "do": "Mind\nChaos", "tg": "Legend\nTeemo\nKorea Exclusive\nLaunch\nStamp Card", "fo": false, "tn": false, "me": false, "nn": false, "bm": false, "pw": false, "pt": "Clear plastic bag (with the Riftbound coin)", "img": "https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/promo-images/teemo-swift-scout-korea-launch-kr-item-10653.webp", "inf": "Korea-exclusive Teemo card handed out at the Korean launch events in Seoul in September 2026, together with the Riftbound coin (listed separately). The numbered circles along the bottom are stamp spots for the launch activities."}$j$::jsonb || jsonb_build_object('st', coalesce((select data->>'st' from promo_items where upper(data->>'st')='NEED' limit 1),'NEED'))
where not exists (select 1 from promo_items where id = 'item-10653');
