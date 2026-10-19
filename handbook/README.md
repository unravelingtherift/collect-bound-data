# Riftbound Starter Handbook

The live Starter Handbook on unravelingtherift.com loads from this folder.

| File | What it is |
| --- | --- |
| `riftbound-starter-handbook.html` | The handbook itself. Edit this to change the live page. |
| `squarespace-loader.html` | The small snippet pasted into the Starter Handbook's Page Settings → Advanced → Page Header Code Injection in Squarespace. It fetches the handbook from here, so it never needs to change. |
| `riot-posts-reviewed.json` | Riot news posts already reviewed for the handbook, so the weekly update doesn't repeat them. |
| `tools/validate.mjs` | Safety check run before any update is proposed: `node handbook/tools/validate.mjs` |

## How updates go live

1. A weekly scheduled task reads Riot's news on playriftbound.com. If a new post affects the handbook, it edits the handbook on a new branch and opens a pull request with a plain-English summary and a preview link.
2. Open the preview link to see the change on the real page (a gold bar at the bottom marks it as a preview).
3. Merge the pull request to publish, or close it to discard. The loader asks GitHub for the exact latest version on every visit, so a merged change shows up on the next page load.

## Previewing any branch

Add `?preview=BRANCH-NAME` to the Starter Handbook address, for example
`https://unravelingtherift.squarespace.com/starter-handbook?preview=handbook-update-2026-10-19`.

## If the live page doesn't show a merged change

Go to **Actions → Refresh handbook on CDN → Run workflow**, then reload the page.
