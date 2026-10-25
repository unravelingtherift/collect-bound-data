# Tracker data

Extra data for Collection-Bound, kept separate from the card set files.

| File | What it is |
| --- | --- |
| `codex-links.json` | Which Lore Codex entry each Legend and Champion Unit card opens. Keyed by set and card number (`OGN-66`), so every language printing of a card shares one link. |
| `events.json` | Dated events and drops for the promo timeline (pre-releases, store championships, regional opens). `announced` means the organizer published the dates and they may still change. |

The tracker doesn't read these files yet. They're ready for when the tracker code is updated.
| `collab-groups.json` | Collab Groups tab: Wild Rift Crystal Rose (VEN), Vendetta connecting-art Champion Unit pairs (VEN 167–188), Unleashed Poro Overnumbers (UNL 220–225). |
| `poros.json` | Poro tab: every set card with Poro in its name or tags, plus poro promos and collectibles from the master promo list. |

## Rounded card corners

Card images are loaded from Riot, Google Drive and retailer links, so the images themselves can't be edited. Round them in the tracker's CSS instead. The radius matches a real trading card (about 4.5% of the card's width), and `object-fit: contain` keeps the top and bottom text fully visible:

```css
#collection-bound img.card-img {
  border-radius: 4.5% / 3.2%;
  object-fit: contain;
}
```

Use whatever class the tracker already gives its card images in place of `card-img`.
