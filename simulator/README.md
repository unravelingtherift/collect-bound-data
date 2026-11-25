# Riftbound Play Simulator

The Play Simulator on unravelingtherift.com (the riftbound-play-tutorial-simulator page) loads from this folder.

| File | What it is |
| --- | --- |
| `riftbound-play-simulator.html` | The simulator itself: styles, card data, rules engine, lessons and the game screen. Edit this to change the live page. |
| `squarespace-loader.html` | The small snippet that goes in the Code Block on the Play Simulator page in Squarespace. It fetches the simulator from here, so it never needs to change. |

## How updates go live

1. Changes are proposed as a pull request with a preview link.
2. Open the preview link to try the change on the real page (a gold bar at the bottom marks it as a preview).
3. Merge the pull request to publish, or close it to discard. The "Refresh simulator on CDN" workflow clears the CDN copy after each merge, so the live page updates within a few minutes. Each browser also keeps its own copy so return visits open instantly; if the fresh copy is slow, that visitor sees the update on their next visit.

## Previewing any branch

Add `?preview=BRANCH-NAME` to the Play Simulator address, for example
`https://unravelingtherift.squarespace.com/riftbound-play-tutorial-simulator?preview=simulator-on-github`.

## If the live page doesn't show a merged change

Go to **Actions → Refresh simulator on CDN → Run workflow**, then reload the page.
