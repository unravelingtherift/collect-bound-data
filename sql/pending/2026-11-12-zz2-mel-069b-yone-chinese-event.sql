-- Mel, Newly Awakened (Chinese Nexus Night) is collector number 069b, not 69a.
update promo_items set data = data || jsonb_build_object('cn','069b') where id = 'item-10708';
-- Chinese Yone (Pre-Rift): handed out in Pre-Rift Player Kits at the Set 2 Chinese Pre-Release Sealed Events (early December 2025).
update promo_items set data = data || jsonb_build_object(
  'ev','Set 2 Chinese Pre-Release Sealed Events',
  'inf','Chinese Pre-Rift promo of Yone - Blademaster (SFD 116/221, promo stamp), the same card as the English Pre-Rift Player Kit promo. It came in Simplified Chinese inside Pre-Rift Player Kits at participating local hobby shops during the Set 2 Chinese Pre-Release Sealed Events in early December 2025, ahead of the December 12 Chinese launch. The language links connect the versions.')
where id = 'item-10675';
