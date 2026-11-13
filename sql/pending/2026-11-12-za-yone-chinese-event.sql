-- Chinese Yone, Blademaster: event and details.
update promo_items set data = data || jsonb_build_object(
  'ev', 'Spiritforged Pre-Rift events - China',
  'inf', 'Chinese Pre-Rift promo of Yone - Blademaster (SFD 116/221, promo stamp, Simplified Chinese), the same card as the English Pre-Rift Player Kit promo. Handed out in Pre-Rift Player Kits at participating local hobby shops during the Set 2 Chinese Pre-Release Sealed Events in early December 2025, ahead of the December 12 Chinese launch.')
where id = 'item-10675';
