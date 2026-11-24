"""Turns a newsletter file (newsletter/*.md) into an email and sends it with Resend.
Run by .github/workflows/newsletter.yml.

  python3 tools/newsletter.py test newsletter/2026-11-23-poro-tab.md
      -> sends a [TEST] copy to REPORT_EMAIL only (used on pull requests)
  python3 tools/newsletter.py send newsletter/2026-11-23-poro-tab.md
      -> sends the real newsletter to the Collection-Bound Updates segment
         (used when the pull request is merged)

Repository secrets it uses:
  RESEND_API_KEY     a FULL ACCESS key from the Resend account that owns
                     unravelingtherift.com (sending-only keys can't make broadcasts)
  REPORT_EMAIL       where test copies go (falls back to customerservice@)
  RESEND_SEGMENT_ID  optional; defaults to the Collection-Bound Updates segment

File format (see newsletter/_example.md):
  subject: ...
  preview: ...
  topic: New Features        (New Sets & Cards | New Features | New Videos)
  ---
  Email body. Blank lines between paragraphs, "- " for bullets,
  **bold**, [link text](https://...). Bare https:// links become links.
"""
import html, json, os, re, sys, urllib.error, urllib.parse, urllib.request

FROM = 'Unraveling the Rift <updates@unravelingtherift.com>'
REPLY_TO = 'customerservice@unravelingtherift.com'
DEFAULT_SEGMENT = 'fd3d9bab-9f85-427a-8a00-eae69eb2f1b9'  # Collection-Bound Updates
TOPICS = ['New Sets & Cards', 'New Features', 'New Videos']
ADDRESS = 'Unraveling the Rift, 600 1st Ave, Ste 102 PMB 1142, Seattle, WA 98104'
UNSUB = '{{{RESEND_UNSUBSCRIBE_URL}}}'

KEY = os.environ.get('RESEND_API_KEY', '').strip()
REPORT = os.environ.get('REPORT_EMAIL', '').strip() or 'customerservice@unravelingtherift.com'
SEGMENT = os.environ.get('RESEND_SEGMENT_ID', '').strip() or DEFAULT_SEGMENT


def fail(title, msg):
    print(f'::error title={title}::{msg}')
    sys.exit(1)


def parse(path):
    raw = open(path, encoding='utf-8').read().replace('\r\n', '\n')
    if '\n---\n' not in raw:
        fail('Newsletter file format', f'{path} needs subject/preview/topic lines, then a line with ---, then the body.')
    head, body = raw.split('\n---\n', 1)
    meta = {}
    for line in head.split('\n'):
        if ':' in line:
            k, v = line.split(':', 1)
            meta[k.strip().lower()] = v.strip()
    for k in ('subject', 'topic'):
        if not meta.get(k):
            fail('Newsletter file format', f'{path} is missing a "{k}:" line.')
    if meta['topic'] not in TOPICS:
        fail('Newsletter topic', f'{path}: topic must be one of {", ".join(TOPICS)} (it says "{meta["topic"]}").')
    return meta, body.strip()


def inline(text):
    """Escape, then turn **bold**, [text](url) and bare links into HTML."""
    out, pos = [], 0
    pattern = re.compile(r'\[([^\]]+)\]\((https?://[^\s)]+)\)|(https?://[^\s<]+[^\s<.,!?)])|\*\*(.+?)\*\*')
    for m in pattern.finditer(text):
        out.append(html.escape(text[pos:m.start()]))
        a = "style='color:#7a4fd0'"
        if m.group(1):
            out.append(f"<a href='{html.escape(m.group(2))}' {a}>{html.escape(m.group(1))}</a>")
        elif m.group(3):
            out.append(f"<a href='{html.escape(m.group(3))}' {a}>{html.escape(m.group(3))}</a>")
        else:
            out.append(f'<strong>{html.escape(m.group(4))}</strong>')
        pos = m.end()
    out.append(html.escape(text[pos:]))
    return ''.join(out)


def to_html(meta, body):
    p = "style='margin:0 0 14px;line-height:1.55'"
    blocks = []
    for block in re.split(r'\n\s*\n', body):
        lines = [l.rstrip() for l in block.split('\n') if l.strip()]
        # Split the block into runs of bullet lines and plain lines, so a
        # heading line like "What's new:" can sit right above its bullets.
        runs = []
        for l in lines:
            is_bullet = bool(re.match(r'\s*[-•*]\s+', l))
            if runs and runs[-1][0] == is_bullet:
                runs[-1][1].append(l)
            else:
                runs.append((is_bullet, [l]))
        for is_bullet, group in runs:
            if is_bullet:
                items = ''.join(f"<li style='margin:0 0 6px'>{inline(re.sub(r'^\s*[-•*]\s+', '', l))}</li>" for l in group)
                blocks.append(f"<ul style='margin:0 0 14px;padding-left:22px;line-height:1.5'>{items}</ul>")
            else:
                blocks.append(f"<p {p}>{'<br>'.join(inline(l) for l in group)}</p>")
    preview = meta.get('preview', '')
    preheader = (f"<div style='display:none;max-height:0;overflow:hidden;opacity:0'>{html.escape(preview)}"
                 + '&#847;&zwnj;&nbsp;' * 40 + '</div>') if preview else ''
    foot = "style='margin:0 0 8px;color:#777;font-size:12px;line-height:1.5'"
    footer = (f"<hr style='border:none;border-top:1px solid #ddd;margin:22px 0 14px'>"
              f"<p {foot}>This email has no tracking pixels or tracked links. We don't know if you opened it, "
              f"and that's how we like it.<br>You're getting this because you signed up at "
              f"<a href='https://unravelingtherift.com' style='color:#777'>unravelingtherift.com</a>.</p>"
              f"<p {foot}>{html.escape(ADDRESS)}</p>"
              f"<p {foot}><a href='{UNSUB}' style='color:#777'>Unsubscribe</a></p>")
    return (f"<div style='font-family:Arial,Helvetica,sans-serif;color:#222;font-size:15px;max-width:600px;"
            f"margin:0 auto;padding:8px'>{preheader}{''.join(blocks)}{footer}</div>")


def to_text(body):
    clean = re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+)\)', r'\1 (\2)', body).replace('**', '')
    return (f"{clean}\n\n---\nThis email has no tracking pixels or tracked links. We don't know if you opened it, "
            f"and that's how we like it.\nYou're getting this because you signed up at unravelingtherift.com.\n"
            f"{ADDRESS}\nUnsubscribe: {UNSUB}\n")


def resend(method, path, payload=None):
    req = urllib.request.Request(
        'https://api.resend.com' + path, method=method,
        data=json.dumps(payload).encode() if payload is not None else None,
        headers={'Authorization': f'Bearer {KEY}', 'Content-Type': 'application/json',
                 'User-Agent': 'collection-bound-newsletter'})
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read().decode() or '{}')
    except urllib.error.HTTPError as e:
        detail = e.read().decode(errors='replace')[:400].replace('\n', ' ')
        hint = ''
        if 'not verified' in detail:
            hint = (' This key belongs to a Resend account where unravelingtherift.com is not set up. '
                    'Log in to Resend as customerservice@unravelingtherift.com, make a Full access key there, '
                    'and put it in the RESEND_API_KEY repository secret.')
        elif e.code in (401, 403):
            hint = ' The RESEND_API_KEY secret may be a sending-only key; newsletters need a Full access key.'
        fail('Resend refused the request', f'HTTP {e.code}: {detail}{hint}')
    except Exception as e:
        fail('Could not reach Resend', f'{type(e).__name__}: {e}')


def topic_id(name):
    after = ''
    while True:
        res = resend('GET', '/topics?limit=100' + (f'&after={urllib.parse.quote(after)}' if after else ''))
        data = res.get('data') or []
        for t in data:
            if (t.get('name') or '').strip().lower() == name.lower():
                return t['id']
        if not res.get('has_more') or not data:
            break
        after = data[-1]['id']
    fail('Topic not found', f'No Resend topic called "{name}". Check the Topics tab in Resend.')


def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ('test', 'send'):
        fail('Usage', 'newsletter.py test|send FILE...')
    mode, files = sys.argv[1], sys.argv[2:]
    for path in files:
        meta, body = parse(path)
        page, text = to_html(meta, body), to_text(body)
        print(f'--- {path}\nSubject: {meta["subject"]}\nPreview: {meta.get("preview", "")}\nTopic: {meta["topic"]}\n\n{text}')
        if not KEY:
            print('::warning title=Nothing sent::The RESEND_API_KEY repository secret is not set.')
            continue
        if mode == 'test':
            res = resend('POST', '/emails', {
                'from': FROM, 'to': [REPORT], 'reply_to': REPLY_TO,
                'subject': f'[TEST] {meta["subject"]}',
                'html': page.replace(UNSUB, 'https://unravelingtherift.com'),
                'text': text.replace(UNSUB, '(unsubscribe link goes here)')})
            print(f'::notice title=Test email sent::"{meta["subject"]}" sent to {REPORT} ({res.get("id", "")}).')
        else:
            res = resend('POST', '/broadcasts', {
                'segment_id': SEGMENT, 'topic_id': topic_id(meta['topic']),
                'from': FROM, 'reply_to': REPLY_TO, 'subject': meta['subject'],
                'name': os.path.basename(path)[:-3], 'html': page, 'text': text, 'send': True})
            print(f'::notice title=Newsletter sent::"{meta["subject"]}" sent to Collection-Bound Updates '
                  f'({meta["topic"]}). Broadcast {res.get("id", "")}.')


if __name__ == '__main__':
    main()
