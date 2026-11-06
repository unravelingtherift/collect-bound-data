# Collection-Bound app

This folder is the Collection-Bound tracker as a standalone, installable app. It's served at
`app.unravelingtherift.com` and is the one source for the website-installed app, the Google
Play app and the Apple App Store app.

| File | What it does |
| --- | --- |
| `index.html` | The app page. The tracker code goes between `CB-TRACKER-START` and `CB-TRACKER-END`. |
| `manifest.webmanifest` | Name, colors and icons phones use when the app is installed. |
| `sw.js` | Offline support. Caches set lists and card images. Never caches Supabase, Stripe, PayPal or Patreon. |
| `offline.html` | Shown if the app is opened with no connection before it's ever loaded. |
| `icons/` | App icons. These are stand-ins made from the wordmark; swap in a square icon before store submission. |
| `_headers` | Cloudflare Pages headers (keeps `sw.js` and the manifest fresh). |
| `.well-known/assetlinks.json` | Proves to Android that the Play app and this site belong together. The fingerprint is filled in at the Google Play step. |

## Stage 1: put the app online

1. Paste the tracker code into `index.html` (Claude can do this once it has the code).
2. Cloudflare (free plan) → Workers & Pages → Create → Pages → Connect to Git →
   `unravelingtherift/collect-bound-data`.
   - Framework preset: None
   - Build command: leave empty
   - Build output directory: `app`
3. Pages project → Custom domains → add `app.unravelingtherift.com`. Cloudflare shows a CNAME
   record; add it in Squarespace → Domains → unravelingtherift.com → DNS.
4. Supabase → Authentication → URL Configuration → add
   `https://app.unravelingtherift.com/**` to Redirect URLs so sign-up and password reset
   emails can send people back to the app.
5. If any Edge Function only allows `unravelingtherift.com` as an origin
   (`get-promos`, `convert-tcg-price`), add `https://app.unravelingtherift.com`.
6. Open `app.unravelingtherift.com` on a phone, then use Add to Home Screen. It should open
   full screen with the Collection-Bound icon.

## Stage 2: Google Play

1. Google Play Console account ($25 one-time). New personal accounts must run a closed test
   with at least 12 testers for 14 days before going public, so line testers up early.
2. pwabuilder.com → enter `https://app.unravelingtherift.com` → Package for stores → Android.
   - Package ID: `com.unravelingtherift.collectionbound`
   - Download the package and keep the signing key file and its passwords somewhere safe.
     Losing them means you can't update the app.
3. Put the SHA-256 fingerprint PWABuilder gives you (and later the one in Play Console → App
   integrity) into `.well-known/assetlinks.json`. Without it the app shows a browser bar.
4. Play Console: upload the `.aab`, store listing, screenshots, privacy policy URL, Data Safety
   form, content rating.

## Stage 3: Apple App Store

1. Apple Developer Program ($99/year) and a Mac with Xcode (a rented cloud Mac works).
2. Wrap the same site with Capacitor, pointed at `https://app.unravelingtherift.com`.
3. Add at least one native feature so review doesn't reject it as "just a website"
   (guideline 4.2). Push alerts for new promos are the natural one.

## Memberships inside the store apps

Store rules for linking out to your own checkout (Stripe) changed in the US in 2025–2026 and
are still moving. As built, the app sends membership buttons to the website membership page in
the phone's browser and sells nothing inside the app. Check Apple guideline 3.1.1(a) and Google
Play's US external-links program on the day you submit.
