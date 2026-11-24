#!/usr/bin/env python3
"""Build the Legend Finder table for the Starter Handbook.

Everything in the table is worked out from Riot's own data, not opinion:
  - handbook/data/riot-top-decks.json  decklists from Riot's "Top Decks" / "Best-of" posts
  - ogn/ogs/sfd/unl/ven/rad.json       card cost, type and domain
  - cardtext.json                       card text (to count Reaction cards)
  - tracker-data/decks.json             Riot's ready-made decks (Champion Decks, Pre-Rift kits...)
  - the ban list already in the handbook (RIFT.errataData.*.banned)

It rewrites the block between LEGEND-FINDER:START and LEGEND-FINDER:END in
handbook/riftbound-starter-handbook.html.

Usage: python3 handbook/tools/build_legend_finder.py
"""
import datetime
import json
import os
import re
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
HANDBOOK = os.path.join(ROOT, 'handbook', 'riftbound-starter-handbook.html')
DECKS = os.path.join(ROOT, 'handbook', 'data', 'riot-top-decks.json')
SETS = ['ogn', 'ogs', 'sfd', 'unl', 'ven', 'rad']
SET_ORDER = {s.upper(): i for i, s in enumerate(['ogn', 'ogs', 'sfd', 'unl', 'ven', 'rad'])}
RECENT_EVENTS = 4          # "right now" = Riot's 4 most recent posted events
START, END = '/* LEGEND-FINDER:START */', '/* LEGEND-FINDER:END */'


def norm(s):
    return re.sub(r'[^a-z0-9]', '', str(s).lower().replace('’', "'").replace('the ', ''))


def load(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


# ---------------------------------------------------------------- cards
cards = {}      # norm(name) -> card info (first regular English printing)
legends = {}    # "Champion, Title" -> legend info
for s in SETS:
    for c in load(os.path.join(ROOT, s + '.json')):
        if c.get('la', 'English') != 'English':
            continue
        cn = str(c.get('cn', ''))
        showcase = 'Showcase' in (c.get('ra') or '') or not cn.isdigit() or c['nm'].endswith(' AA')
        if c.get('ty') == 'Legend':
            if showcase:
                continue
            title = re.sub(r' AA$', '', c['nm'].replace(' - Starter', ''))
            legends[f"{c['tg']}, {title}"] = {
                'champ': c['tg'], 'title': title, 'set': c['se'], 'cn': cn,
                'dom': [d.strip() for d in (c.get('do') or '').split(',') if d.strip()],
            }
            continue
        name = re.sub(r' AA$', '', c['nm'])
        k = norm(name)
        info = {
            'n': name, 'set': c['se'], 'cn': cn, 'ty': c.get('ty') or '',
            'en': c.get('en') if isinstance(c.get('en'), (int, float)) else None,
            'dom': [d.strip() for d in (c.get('do') or '').split(',') if d.strip() and d.strip() != 'Colorless'],
            'tg': c.get('tg') or '', 'showcase': showcase,
        }
        old = cards.get(k)
        if old is None or (old['showcase'] and not showcase):
            cards[k] = info

text = load(os.path.join(ROOT, 'cardtext.json'))


def card_text(c):
    try:
        return text.get(f"{c['set']}-{int(c['cn']):03d}", {}).get('text', '')
    except ValueError:
        return ''


def group(ty):
    t = ty.lower()
    if 'battlefield' in t:
        return 'battlefield'
    if 'spell' in t:
        return 'spell'
    if 'gear' in t and 'unit' not in t:
        return 'gear'
    return 'unit'


# ---------------------------------------------------------------- bans (from the handbook itself)
JS = r"""
const fs=require('fs'),vm=require('vm');
const h=fs.readFileSync(process.argv[1],'utf8');
const s=[...h.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script[^>]*>/gi)][0][1];
const sb={};sb.window=sb;vm.createContext(sb);vm.runInContext(s,sb);
const out=[];for(const k in sb.RIFT.errataData){(sb.RIFT.errataData[k].banned||[]).forEach(b=>out.push({name:b.name,date:b.date,type:b.type||''}));}
console.log(JSON.stringify(out));
"""
bans = json.loads(subprocess.check_output(['node', '-e', JS, HANDBOOK], text=True))
for b in bans:
    b['k'] = norm(b['name'])
    b['iso'] = datetime.datetime.strptime(b['date'], '%B %d, %Y').date().isoformat()
banned = {b['k']: b for b in bans}

# ---------------------------------------------------------------- Riot ready-made decks
precons = {}
for d in load(os.path.join(ROOT, 'tracker-data', 'decks.json'))['decks']:
    for l in d.get('legend', []):
        title = l['n'].replace(' - Starter', '')
        for key, lg in legends.items():
            if norm(lg['title']) == norm(title):
                precons.setdefault(key, [])
                if d['product'] not in precons[key]:
                    precons[key].append(d['product'])

# ---------------------------------------------------------------- decks
data = load(DECKS)
events = sorted(data['events'], key=lambda e: e['published'])
recent_ids = {e['id'] for e in events[-RECENT_EVENTS:]}
unmatched = {}

per = {}  # legend -> list of (event, deck)
for e in events:
    for d in e['decks']:
        if d['legend'] not in legends:
            sys.exit(f"Unknown legend in {e['id']}: {d['legend']}")
        per.setdefault(d['legend'], []).append((e, d))


def deck_stats(d):
    tot = cost = cost_n = cheap = units = spells = reacts = 0
    for q, n in d['main']:
        c = cards.get(norm(n))
        if not c:
            unmatched[n] = unmatched.get(n, 0) + q
            continue
        tot += q
        g = group(c['ty'])
        if c['en'] is not None:
            cost += c['en'] * q
            cost_n += q
            if c['en'] <= 2:
                cheap += q
        if g == 'unit':
            units += q
        elif g == 'spell':
            spells += q
        if re.search(r'\bReaction\b', card_text(c)):
            reacts += q
    if not tot:
        return None
    return {'avg': cost / cost_n if cost_n else 0, 'cheap': cheap / tot, 'units': units / tot,
            'spells': spells / tot, 'reacts': reacts / tot}


raw = {}
for key, lst in per.items():
    st = [s for s in (deck_stats(d) for _, d in lst) if s]
    if not st:
        continue
    raw[key] = {k: sum(s[k] for s in st) / len(st) for k in st[0]}


def pct(values, v):
    lo = sum(1 for x in values if x < v)
    eq = sum(1 for x in values if x == v)
    return round(100 * (lo + 0.5 * eq) / len(values))


axes = {}
keys = list(raw)
pace_raw = {k: -raw[k]['avg'] + 4 * raw[k]['cheap'] for k in keys}
board_raw = {k: raw[k]['units'] for k in keys}
cx_raw = {k: raw[k]['reacts'] + 0.5 * raw[k]['spells'] for k in keys}
for k in keys:
    axes[k] = {'pace': pct(list(pace_raw.values()), pace_raw[k]),
               'board': pct(list(board_raw.values()), board_raw[k]),
               'cx': pct(list(cx_raw.values()), cx_raw[k])}


def card_ref(c):
    return {'n': c['n'], 's': c['set'], 'c': c['cn']}


def legal_for(c, lg):
    if c['ty'].startswith('Signature') and norm(c['tg']).find(norm(lg['champ'])) < 0:
        return False
    return all(dm in lg['dom'] for dm in c['dom'])


all_decks = [(e, d) for e in events for d in e['decks']]
out = []
for key, lg in sorted(legends.items(), key=lambda kv: kv[0]):
    lst = per.get(key, [])
    entry = {
        'k': norm(key), 'name': key, 'champ': lg['champ'], 'title': lg['title'], 'set': lg['set'], 'cn': lg['cn'],
        'dom': lg['dom'], 'precon': precons.get(key, []),
    }
    if not lst:
        entry['tier'] = 'none'
        out.append(entry)
        continue
    evs = {}
    for e, d in lst:
        x = evs.setdefault(e['id'], {'e': e['id'], 'top8': 0, 'win': False, 'players': None})
        if d['top8']:
            x['top8'] += 1
        if e.get('winner_legend') == key:
            x['win'] = True
        if d.get('legend_players'):
            x['players'] = max(x['players'] or 0, d['legend_players'])
    top8_events = [e for e in events if evs.get(e['id'], {}).get('top8')]
    wins = [e for e in events if evs.get(e['id'], {}).get('win')]
    recent_top8 = [e for e in top8_events if e['id'] in recent_ids]
    recent_wins = [e for e in wins if e['id'] in recent_ids]
    if recent_wins or len(recent_top8) >= 2:
        tier = 'winning'
    elif recent_top8:
        tier = 'contender'
    elif top8_events:
        tier = 'earlier'
    else:
        tier = 'bestof'

    # ban impact: banned cards this legend's most recent Riot lists still relied on
    # (its last 2 posted events; older bans are already worked out of newer lists)
    def names_of(d):
        return set([n for _, n in d['main']] + list(d.get('battlefields') or []) + ([d['champion']] if d.get('champion') else []))
    leg_events = sorted({e['id']: e for e, _ in lst}.values(), key=lambda e: e['published'])[-2:]
    recent_lst = [(e, d) for e, d in lst if e['id'] in {x['id'] for x in leg_events}]
    ban_hits = {}
    for e, d in recent_lst:
        for n in names_of(d):
            b = banned.get(norm(n))
            if b and b['iso'] > e['published']:
                ban_hits.setdefault(b['k'], set()).add((e['id'], d['player']))
    ban_list = []
    for bk, hit in ban_hits.items():
        b = banned[bk]
        ban_list.append({'card': b['name'], 'date': b['date'], 'iso': b['iso'], 'type': b['type'],
                         'n': len(hit), 'of': len(recent_lst),
                         'champ': b['type'] == 'Champion Unit' and norm(b['name']).startswith(norm(lg['champ']))})
    ban_list.sort(key=lambda b: (not b['champ'], -b['n'], b['iso'], b['card']))
    legal_now = sum(1 for _, d in lst if not any(norm(n) in banned for n in names_of(d)))

    # replacements: legal cards that fill the same slot in Riot's posted lists
    repl = {}
    for b in ban_list:
        bc = cards.get(norm(b['card']))
        if not bc:
            continue
        g = group(bc['ty'])
        score = {}
        for e, d in all_decks:
            same = d['legend'] == key
            shares = bool(set(legends[d['legend']]['dom']) & set(lg['dom']))
            if not (same or shares):
                continue
            pool = [(1, n) for n in (d.get('battlefields') or [])] if g == 'battlefield' else d['main']
            for q, n in pool:
                c = cards.get(norm(n))
                if not c or norm(n) == norm(b['card']) or norm(n) in banned:
                    continue
                if group(c['ty']) != g or not legal_for(c, lg):
                    continue
                if g != 'battlefield' and (c['en'] is None or bc['en'] is None or abs(c['en'] - bc['en']) > 1):
                    continue
                if c['ty'] == 'Champion Unit' and not norm(c['n']).startswith(norm(lg['champ'])) and b['champ']:
                    continue
                s = score.setdefault(norm(n), {'card': c, 'same': 0, 'other': 0})
                s['same' if same else 'other'] += 1
        if b['champ']:
            # the chosen champion itself was banned: the only replacement is another
            # Champion Unit of the same champion (Riot rules: it must match your Legend)
            score = {k2: score.get(k2, {'card': c, 'same': 0, 'other': 0}) for k2, c in cards.items()
                     if c['ty'] == 'Champion Unit' and k2 not in banned and k2 != norm(b['card'])
                     and norm(c['n']).startswith(norm(lg['champ']))}
        ranked = sorted(score.values(), key=lambda s: (-(3 * s['same'] + s['other']), s['card']['n']))[:3]
        repl[b['card']] = [dict(card_ref(s['card']), ty=s['card']['ty'], en=s['card']['en'],
                                same=s['same'], other=s['other']) for s in ranked]

    # the most recent Riot list for this legend (for "open in tracker")
    e_last, d_last = sorted(lst, key=lambda ed: (ed[0]['published'], ed[1]['top8'], ed[1]['winner']))[-1]
    deck_cards = {}
    for q, n in d_last['main']:
        c = cards.get(norm(n))
        if c:
            k2 = f"{c['set']}|{str(c['cn']).lstrip('0') or '0'}"
            deck_cards[k2] = deck_cards.get(k2, 0) + q
    for n in d_last.get('battlefields') or []:
        c = cards.get(norm(n))
        if c:
            deck_cards[f"{c['set']}|{str(c['cn']).lstrip('0') or '0'}"] = 1
    entry['list'] = {'e': e_last['id'], 'cards': deck_cards}

    entry.update({
        'tier': tier, 'axes': axes.get(key), 'decks': len(lst),
        'stats': {k: round(v, 3) for k, v in raw.get(key, {}).items()},
        'events': [evs[e['id']] for e in events if e['id'] in evs],
        'top8': sum(x['top8'] for x in evs.values()), 'wins': [e['id'] for e in wins],
        'bans': ban_list, 'repl': repl, 'legal': legal_now, 'recent_events': [e['id'] for e in leg_events],
    })
    out.append(entry)

# similar legends (same feel, still legal champion, shares a domain)
champ_banned = {e['k'] for e in out if any(b['champ'] for b in e.get('bans', []))}
for e in out:
    if not e.get('axes'):
        continue
    cand = []
    for o in out:
        if o is e or not o.get('axes') or o['k'] in champ_banned:
            continue
        dist = sum((e['axes'][a] - o['axes'][a]) ** 2 for a in ('pace', 'board', 'cx')) ** 0.5
        dist -= 15 * len(set(e['dom']) & set(o['dom']))
        cand.append((dist, o['k']))
    e['similar'] = [k for _, k in sorted(cand)[:3]]

# official China results entered from screenshots (handbook/data/china-results.json)
china_path = os.path.join(ROOT, 'handbook', 'data', 'china-results.json')
china = load(china_path)['events'] if os.path.exists(china_path) else []
by_name = {e['name']: e for e in out}
for ce in china:
    for row in ce['legends']:
        if row['legend'] not in by_name:
            sys.exit(f"Unknown legend in china-results.json: {row['legend']}")
        by_name[row['legend']].setdefault('china', []).append(
            {'e': ce['id'], 'players': row['players'], 'adv': row['advanced'], 'total': ce['total_players']})

table = {
    'updated': datetime.date.today().isoformat(),
    'recent': [e['id'] for e in events[-RECENT_EVENTS:]],
    'events': [{'id': e['id'], 'event': e['event'], 'title': e['title'], 'url': e['url'], 'published': e['published'],
                'winner': e['winner_legend'], 'decks': len(e['decks']), 'note': e.get('top8_note')} for e in events],
    'china': [{'id': c['id'], 'event': c['event'], 'date': c.get('date'), 'source': c['source'],
               'total': c['total_players']} for c in china],
    'bans': [{'card': b['name'], 'date': b['date'], 'iso': b['iso']} for b in bans],
    'legends': out,
}
block = START + '\nRIFT.legendFinder = ' + json.dumps(table, ensure_ascii=False, separators=(',', ':')) + ';\n' + END

with open(HANDBOOK, encoding='utf-8') as f:
    html = f.read()
if START in html:
    html = re.sub(re.escape(START) + r'[\s\S]*?' + re.escape(END), lambda m: block, html, count=1)
else:
    sys.exit('LEGEND-FINDER:START marker not found in the handbook')
with open(HANDBOOK, 'w', encoding='utf-8') as f:
    f.write(html)

with_data = [e for e in out if e.get('axes')]
print(f"Legend Finder: {len(out)} legends, {len(with_data)} with Riot tournament lists, "
      f"{sum(len(e['decks']) for e in events)} decks from {len(events)} events, {len(bans)} banned cards.")
if unmatched:
    print('Card names not found in the card files (left out of the numbers):',
          ', '.join(f'{n} x{q}' for n, q in sorted(unmatched.items(), key=lambda x: -x[1])))
