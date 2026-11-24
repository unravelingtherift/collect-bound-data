"""Weekly eBay search for missing or poor tracker pictures.

Reads /tmp/cards.json and /tmp/promos.json (from the database), /tmp/skip.json
(eBay listings already suggested or rejected, and items with an open suggestion),
and writes up to MAX suggestions to /tmp/proposals/ (picture + proposals.json).

A picture is only suggested when:
  - the item has no picture (or a broken / square placeholder), or
  - the eBay picture is clearly bigger AND sharper than the current one.
Jessica approves each one by merging its pull request.
"""
import base64, io, json, os, re, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageFilter, ImageStat

CID, SEC = os.environ['EBAY_CLIENT_ID'], os.environ['EBAY_CLIENT_SECRET']
MAX = int(os.environ.get('MAX') or 10)
MAX_SEARCHES = 150
OUT = '/tmp/proposals'
LANG_CODE = {'English': 'en', 'Chinese': 'zh', 'French': 'fr', 'Korean': 'ko'}
LANG_WORDS = {'Chinese': ['chinese', 'simplified', ' cn ', 'china'], 'French': ['french', 'français', 'francais', ' fr '],
              'Korean': ['korean', ' kr ', 'korea']}
BAD_WORDS = ['proxy', 'custom', 'fan made', 'fanmade', 'orica', 'replica', 'fake', 'digital', 'sleeve', 'playmat', 'empty']
UA = {'User-Agent': 'Mozilla/5.0 (collect-bound picture check)'}


def get(url, timeout=20):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout).read()


def measure(data):
    """(width, height, sharpness) — sharpness compared at the same size."""
    im = Image.open(io.BytesIO(data)).convert('L')
    w, h = im.size
    small = im.resize((400, max(1, round(h * 400 / w))))
    sharp = ImageStat.Stat(small.filter(ImageFilter.FIND_EDGES)).var[0]
    return w, h, sharp


def check_existing(t):
    if not t['img']:
        t['state'] = 'missing'; return t
    try:
        try:
            data = get(t['img'])
        except Exception:
            time.sleep(1.5); data = get(t['img'])
        w, h, s = measure(data)
        t['w'], t['sharp'] = w, s
        r = w / h if h else 0
        if t['kind'] == 'card' and 0.85 < r < 1.18:
            t['state'] = 'missing'
        else:
            t['state'] = 'has'
    except Exception:
        # Could not download it (busy, timeout): do not claim it is missing.
        t['state'] = 'unknown'
    return t


def token():
    req = urllib.request.Request('https://api.ebay.com/identity/v1/oauth2/token',
        data=urllib.parse.urlencode({'grant_type': 'client_credentials',
                                     'scope': 'https://api.ebay.com/oauth/api_scope'}).encode(),
        headers={'Content-Type': 'application/x-www-form-urlencoded',
                 'Authorization': 'Basic ' + base64.b64encode(f'{CID}:{SEC}'.encode()).decode()})
    return json.load(urllib.request.urlopen(req, timeout=30))['access_token']


def search(tok, q):
    url = 'https://api.ebay.com/buy/browse/v1/item_summary/search?' + urllib.parse.urlencode({'q': q, 'limit': 20})
    req = urllib.request.Request(url, headers={'Authorization': 'Bearer ' + tok, 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'})
    return json.load(urllib.request.urlopen(req, timeout=30)).get('itemSummaries', [])


def clean_name(n):
    n = re.sub(r'\[[^\]]*\]|\([^)]*\)', ' ', n or '')
    return re.sub(r'\s+', ' ', re.sub(r'\s+-\s+', ' ', n)).strip()


def query(t):
    lang = t['la'] if t['la'] != 'English' else ''
    if t['kind'] == 'card':
        cn = t['cn'].lower()
        hint = ' signature' if '*' in cn else (' alt art' if re.search(r'[a-z]$', cn) else '')
        return f"riftbound {clean_name(t['nm'])} {t['se']} {t['cn'].replace('*', '')}{hint} {lang}".strip()
    ev = (t.get('ev') or '').strip()
    extra = ' nexus night' if ('nexus' in ev.lower() or ev.upper().startswith('NN')) and 'nexus' not in t['nm'].lower() else ''
    return f"riftbound {clean_name(t['nm'])} promo{extra} {lang}".strip()


def title_ok(t, title):
    low = f" {title.lower()} "
    if 'riftbound' not in low and 'rift bound' not in low:
        return False
    if any(b in low for b in BAD_WORDS):
        return False
    if not variant_ok(t, title):
        return False
    for w in re.findall(r"[a-z0-9']{3,}", clean_name(t['nm']).lower()):
        if w not in low:
            return False
    if t['la'] == 'English':
        if any(any(x in low for x in ws) for ws in LANG_WORDS.values()) or 'japanese' in low:
            return False
    elif not any(x in low for x in LANG_WORDS.get(t['la'], [])):
        return False
    return True


ALT_RE = re.compile(r'alt(?:ernate)?[ .-]*art|showcase')
SIG_RE = re.compile(r'signature|over-?numbered')


def variant_ok(t, title):
    """The listing must be the same version as the tracker card: plain, alt art ("a") or signature ("*")."""
    if t['kind'] != 'card':
        return True
    m = re.match(r'^0*(\d{1,3})([a-z]?)(\*?)$', (t.get('cn') or '').lower())
    if not m:
        return True
    num, suf = int(m.group(1)), (m.group(2) or m.group(3))
    low = title.lower()
    alt, sig = bool(ALT_RE.search(low)), bool(SIG_RE.search(low))
    found = re.search(r'(?<![\d/])0*(\d{1,3})\s*([a-z]|\*)?\s*/\s*0*\d{2,3}(?!\d)', low)
    tnum, tsuf = (int(found.group(1)), found.group(2) or '') if found else (None, '')
    if tnum is not None and tnum != num:
        return False
    if not suf:                      # plain card: reject any alt-art / signature listing
        return not alt and not sig and not tsuf
    if suf == '*':
        return tsuf == '*' or sig
    return (tsuf == suf or alt) and tsuf != '*' and not sig


def file_name(t):
    if t['kind'] == 'promo':
        return f"{t['id']}.jpg"
    num = re.sub(r'^0+(?=\d)', '', t['cn'].lower()).replace('*', 'star')
    num = num.zfill(3) if num[:1].isdigit() and len(re.match(r'\d+', num).group()) < 3 else num
    return f"{t['se'].upper()}-{num}-{LANG_CODE.get(t['la'], 'en')}.jpg"


def main():
    cards = json.load(open('/tmp/cards.json')) or []
    promos = json.load(open('/tmp/promos.json')) or []
    skip = json.load(open('/tmp/skip.json'))
    skip_listings, skip_targets = set(skip['listings']), set(skip['targets'])
    targets = []
    for c in cards:
        if not c.get('cn') or not re.match(r'^\d{1,3}[a-z]?\*?$', c['cn'].lower()):
            continue
        # English set cards come from the official gallery; only look at them if missing.
        targets.append({'kind': 'card', 'key': f"card-{c['se']}-{c['cn']}-{c['la']}", 'id': c['id'], 'nm': c['nm'],
                        'se': c['se'], 'cn': c['cn'], 'la': c['la'] or 'English', 'img': c.get('img') or '',
                        'check': (c['la'] or 'English') != 'English' or not c.get('img')})
    for p in promos:
        targets.append({'kind': 'promo', 'key': f"promo-{p['id']}", 'id': p['id'], 'nm': p.get('nm') or '',
                        'la': p.get('la') or 'English', 'ev': p.get('ev') or '', 'img': p.get('img') or '', 'check': True})
    seen, uniq = set(), []
    for t in targets:
        if t['key'] in seen or t['key'] in skip_targets or not t['nm']:
            continue
        seen.add(t['key']); uniq.append(t)
    with ThreadPoolExecutor(16) as ex:
        uniq = list(ex.map(lambda t: check_existing(t) if t['check'] else dict(t, state='has', w=9999, sharp=1e9), uniq))
    missing = [t for t in uniq if t['state'] == 'missing']
    weak = sorted([t for t in uniq if t['state'] == 'has' and t.get('w', 9999) < 9999], key=lambda t: t['w'])
    print(f"{len(uniq)} items, {len(missing)} without a picture, {len(weak)} with a picture to compare")
    os.makedirs(OUT, exist_ok=True)
    tok = token()
    proposals, searches = [], 0
    for t in missing + weak:
        if len(proposals) >= MAX or searches >= MAX_SEARCHES:
            break
        searches += 1
        try:
            res = search(tok, query(t))
        except Exception as e:
            print('search failed', t['key'], e); continue
        for r in res:
            lid = re.sub(r'\D', '', r.get('itemId', ''))[:20]
            u = (r.get('image') or {}).get('imageUrl')
            if not u or not lid or lid in skip_listings or not title_ok(t, r.get('title', '')):
                continue
            u = re.sub(r's-l\d+\.(jpg|webp|png)', r's-l1600.\1', u)
            try:
                data = get(u); w, h, s = measure(data)
            except Exception:
                continue
            if t['kind'] == 'card' and not (0.55 < w / h < 0.85 or 1.2 < w / h < 1.6):
                continue  # not a single card photo
            if t['state'] == 'has':
                if not (w >= t['w'] * 1.6 and s >= t['sharp'] * 1.3):
                    continue
                reason = f"Current picture is {t['w']}px wide; this one is {w}px and sharper."
            else:
                reason = 'No picture on the tracker yet.'
            fn = file_name(t)
            open(os.path.join(OUT, fn), 'wb').write(data)
            proposals.append({'key': t['key'], 'listing_id': lid, 'file': fn, 'name': t['nm'], 'lang': t['la'],
                              'what': f"{t['se']} {t['cn']}" if t['kind'] == 'card' else t['id'],
                              'title': r.get('title'), 'listing': r.get('itemWebUrl'), 'current': t['img'], 'reason': reason})
            print('suggest', t['key'], lid)
            break
        time.sleep(0.3)
    json.dump(proposals, open(os.path.join(OUT, 'proposals.json'), 'w'), ensure_ascii=False, indent=1)
    print(f"{len(proposals)} suggestions from {searches} searches")


if __name__ == '__main__':
    main()
