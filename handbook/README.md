# Riftbound Starter Handbook

The live Starter Handbook on unravelingtherift.com loads from this folder.

| File | What it is |
| --- | --- |
| `riftbound-starter-handbook.html` | The handbook itself. Edit this to change the live page. |
| `squarespace-loader.html` | The small snippet pasted into the Starter Handbook's Page Settings → Advanced → Page Header Code Injection in Squarespace. It fetches the handbook from here, so it never needs to change. |
| `riot-posts-reviewed.json` | Riot news posts already reviewed for the handbook, so the weekly update doesn't repeat them. |
| `data/riot-top-decks.json` | Every decklist Riot published in its "Top Decks" / "Best-of" posts. The Legend Finder is built from it. |
| `data/china-results.json` | Official China event results (from 符文战场 graphics the owner sends as screenshots), used by the Legend Finder. |
| `tools/build_legend_finder.py` | Rebuilds the Legend Finder table inside the handbook from the two data files, the card files and the handbook's ban list: `python3 handbook/tools/build_legend_finder.py` |
| `tools/validate.mjs` | Safety check run before any update is proposed: `node handbook/tools/validate.mjs` |

## How updates go live

1. A weekly scheduled task reads Riot's news on playriftbound.com. If a new post affects the handbook, it edits the handbook on a new branch and opens a pull request with a plain-English summary and a preview link.
2. Open the preview link to see the change on the real page (a gold bar at the bottom marks it as a preview).
3. Merge the pull request to publish, or close it to discard. A merged change shows on the live page within a few minutes, after the "Refresh handbook on CDN" workflow clears the CDN copy. Each browser also keeps its own copy of the handbook so return visits open instantly; if the fresh copy is slow to arrive, that visitor sees the update on their next visit.

## Previewing any branch

Add `?preview=BRANCH-NAME` to the Starter Handbook address, for example
`https://unravelingtherift.squarespace.com/starter-handbook?preview=handbook-update-2026-10-19`.

## If the live page doesn't show a merged change

Go to **Actions → Refresh handbook on CDN → Run workflow**, then reload the page.

## Legend Finder

The "Find your Legend" section (quiz and ban helper) is built only from Riot data:

- **Playstyle bars** compare each Legend's Riot-posted lists: average card cost, share of cheap cards, units vs. spells, and Reaction cards.
- **"Right now"** uses Riot's 4 most recent posted events (Top 8s and wins).
- **Ban impact** lists banned cards that the Legend's most recent Riot lists still played. **Suggested swaps** are cards that fill the same slot (same card type, cost within 1, legal in the Legend's domains) in other Riot-posted lists. They're labelled on the page as suggestions, not guaranteed winners.
- **Prices** on suggested swaps are the free English TCGplayer price from the tracker's price function. Card names link to the card in Collection-Bound (`#card=SET-NUMBER`), and each Legend links to Riot's latest list in the tracker's Decks tab (`#deck=`).

When Riot posts a new Top Decks article or the ban list changes, add the decks to `data/riot-top-decks.json`, run the build script, then `node handbook/tools/validate.mjs`. A twice-daily scheduled task does this and opens a pull request.
