"""Turn pictures dropped in add-card-pictures/ into tracker pictures.

  process <out_dir> <files...>   clean each picture (white corners/edges removed,
                                 shrunk, saved as .webp) and write manifest.json
  sql <out_dir> <commit>         write update.sql that points each card at its picture

File names: SET-NUMBER-LANGUAGE, for example OGN-006-zh.png, OGN-112a-en.jpg,
SFD-233star-zh.webp ("star" = the * on signature cards).
"""
import json, os, re, sys
from PIL import Image, ImageDraw

LANGS = {'en': 'English', 'zh': 'Chinese', 'cn': 'Chinese', 'fr': 'French',
         'ko': 'Korean', 'kr': 'Korean'}
NAME = re.compile(r'^([A-Za-z]{2,4})-(\d{1,3}[a-z]?(?:star)?)-([a-z]{2})$', re.I)
REPO = 'unravelingtherift/collect-bound-data'


def parse(path):
    stem = os.path.splitext(os.path.basename(path))[0].strip()
    m = NAME.match(stem)
    if not m or m.group(3).lower() not in LANGS:
        return None
    se, num, lang = m.group(1).upper(), m.group(2).lower(), m.group(3).lower()
    cn = num.replace('star', '*').lstrip('0') or '0'
    return {'se': se, 'cn': cn, 'la': LANGS[lang],
            'out': f"{se.lower()}-{num}-{lang}.webp", 'src': os.path.basename(path)}


def clean(path, out):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    mark = (255, 0, 255)
    near_white = lambda p: min(p) >= 215
    border = [(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)] + \
             [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)]
    for xy in border:
        if near_white(im.getpixel(xy)):
            ImageDraw.floodfill(im, xy, mark, thresh=40)
    rgba = im.convert('RGBA')
    px = rgba.load()
    for y in range(h):
        for x in range(w):
            if px[x, y][:3] == mark:
                px[x, y] = (0, 0, 0, 0)
    box = rgba.getbbox()
    if box:
        rgba = rgba.crop(box)
    if rgba.width > 745:
        rgba = rgba.resize((745, round(rgba.height * 745 / rgba.width)), Image.LANCZOS)
    rgba.save(out, 'WEBP', quality=88)


def main():
    mode, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    man_path = os.path.join(out_dir, 'manifest.json')
    if mode == 'process':
        items, bad = [], []
        for f in sys.argv[3:]:
            if not os.path.isfile(f) or os.path.basename(f).lower() == 'readme.md':
                continue
            it = parse(f)
            if not it:
                bad.append(os.path.basename(f)); continue
            clean(f, os.path.join(out_dir, it['out']))
            items.append(it)
        json.dump({'items': items, 'bad_names': bad}, open(man_path, 'w'), indent=1)
        print(json.dumps({'items': len(items), 'bad_names': bad}))
    elif mode == 'sql':
        sha = sys.argv[3]
        man = json.load(open(man_path))
        lines = []
        for it in man['items']:
            url = f"https://cdn.jsdelivr.net/gh/{REPO}@{sha}/{it['out']}"
            q = lambda s: s.replace("'", "''")
            lines.append(
                f"with u as (update public.cards set img = '{q(url)}' "
                f"where upper(se) = '{q(it['se'])}' and la = '{q(it['la'])}' "
                f"and ltrim(lower(cn), '0') = '{q(it['cn'])}' returning 1) "
                f"select '{q(it['src'])}|' || count(*) from u;")
        open(os.path.join(out_dir, 'update.sql'), 'w').write('\n'.join(lines) + '\n')


if __name__ == '__main__':
    main()
