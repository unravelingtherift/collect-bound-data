"""Find larger promo pictures on eBay (Browse API, read-only public listings).

Reads tracker-data/need-larger-pictures.json, searches eBay for each promo and
saves up to 4 listing photos per promo in ebay-candidates/<item-id>/, plus
ebay-candidates/index.json. Nothing is changed in the tracker: the photos are
reviewed by hand first.
"""
import base64, json, os, re, sys, time, urllib.parse, urllib.request

CID, SEC = os.environ['EBAY_CLIENT_ID'], os.environ['EBAY_CLIENT_SECRET']
LIMIT = int(os.environ.get('LIMIT') or 0)

def token():
    req = urllib.request.Request('https://api.ebay.com/identity/v1/oauth2/token',
        data=urllib.parse.urlencode({'grant_type': 'client_credentials',
                                     'scope': 'https://api.ebay.com/oauth/api_scope'}).encode(),
        headers={'Content-Type': 'application/x-www-form-urlencoded',
                 'Authorization': 'Basic ' + base64.b64encode(f'{CID}:{SEC}'.encode()).decode()})
    return json.load(urllib.request.urlopen(req, timeout=30))['access_token']

def words(item):
    n = re.sub(r'\[[^\]]*\]|\([^)]*\)', ' ', item['name'] or '')
    n = re.sub(r'\s+-\s+', ' ', n); n = re.sub(r'\s+', ' ', n).strip()
    extra = []
    low = (item['name'] or '').lower()
    for w in ['nexus night', 'judge', 'plated', 'metal', 'launch', 'oversized', 'regional']:
        if w in low and w not in n.lower(): extra.append(w)
    if item.get('nn') and 'nexus night' not in n.lower(): extra.append('nexus night')
    lang = {'Chinese': 'chinese', 'French': 'french', 'Korean': 'korean'}.get(item['language'], '')
    return ' '.join([n, 'riftbound', 'promo', *extra, lang]).strip()

def search(tok, q):
    url = 'https://api.ebay.com/buy/browse/v1/item_summary/search?' + urllib.parse.urlencode({'q': q, 'limit': 8})
    req = urllib.request.Request(url, headers={'Authorization': 'Bearer ' + tok, 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'})
    return json.load(urllib.request.urlopen(req, timeout=30)).get('itemSummaries', [])

def big(u): return re.sub(r's-l\d+\.(jpg|webp|png)', r's-l1600.\1', u)

items = json.load(open('tracker-data/need-larger-pictures.json'))
if LIMIT: items = items[:LIMIT]
tok = token(); print('eBay token OK')
os.makedirs('ebay-candidates', exist_ok=True)
index = {}
for it in items:
    qs = it.get('qs') or [words(it)]
    q = ' | '.join(qs)
    res = []
    for qq in qs:
        try: res += search(tok, qq)[:5]
        except Exception as e: print('search failed', it['id'], e)
    out = []; seen = set()
    for r in res:
        u = (r.get('image') or {}).get('imageUrl')
        if not u or u in seen: continue
        seen.add(u)
        out.append({'title': r.get('title'), 'url': big(u), 'listing': r.get('itemWebUrl'), 'price': (r.get('price') or {}).get('value')})
        if len(out) == 8: break
    d = f"ebay-candidates/{it['id']}"; os.makedirs(d, exist_ok=True)
    for k, c in enumerate(out):
        try:
            urllib.request.urlretrieve(c['url'], f'{d}/{k}.jpg'); c['file'] = f'{k}.jpg'
        except Exception as e: c['file'] = None
    index[it['id']] = {'name': it['name'], 'language': it['language'], 'query': q, 'candidates': out}
    print(it['id'], len(out), q)
    time.sleep(0.3)
json.dump(index, open('ebay-candidates/index.json', 'w'), ensure_ascii=False, indent=1)
print('done', len(index))
