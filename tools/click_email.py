"""Builds and sends the daily click count email.
Run by .github/workflows/daily-click-email.yml. Reads the counts as JSON on stdin.
The address it sends to comes from the REPORT_EMAIL repository secret."""
import json, os, sys, urllib.request, urllib.error, html, datetime

rows = json.loads(sys.stdin.read() or '[]')
to = os.environ.get('REPORT_EMAIL', '')
key = os.environ.get('RESEND_API_KEY', '')

NAMES = {
  'popup_shown': 'Holiday pop-up shown', 'popup_close': 'Holiday pop-up closed',
  'popup_compare': 'Pop-up: "Compare the memberships first"',
  'popup_club': 'Pop-up: Join the Club', 'popup_vip': 'Pop-up: Go VIP',
  'join_chase_button': 'Tracker: Join the Chase button', 'signup_button': 'Tracker: Sign Up button',
  'arrive_join_club': 'Arrived at tracker to join Club', 'arrive_join_vip': 'Arrived at tracker to join VIP',
  'arrive_join': 'Arrived at tracker to join', 'arrive_signup': 'Arrived at tracker to sign up',
  'checkout_club_month': 'Started checkout: Club monthly', 'checkout_club_year': 'Started checkout: Club yearly',
  'checkout_vip_month': 'Started checkout: VIP monthly', 'checkout_vip_year': 'Started checkout: VIP yearly',
}
WHERE = {
  'membership-popup': 'membership page pop-up', 'membership-table': 'membership page table',
  'tracker-popup': 'tracker pop-up', 'home-banner': 'homepage banner',
  'direct': 'typed in / bookmark', 'external': 'another website', '/': 'homepage',
  '/membership-page': 'membership page',
}
def where(s): return WHERE.get(s, s or '-')

pacific = datetime.timezone(datetime.timedelta(hours=-8))
day = (datetime.datetime.now(pacific) - datetime.timedelta(days=1)).strftime('%a %b %d').replace(' 0', ' ')
yest = sum(r['yesterday'] for r in rows)
checkouts_y = sum(r['yesterday'] for r in rows if r['event'].startswith('checkout_'))
checkouts_w = sum(r['week'] for r in rows if r['event'].startswith('checkout_'))

cell = 'padding:6px 10px;border-bottom:1px solid #eee;'
body_rows = ''.join(
  f"<tr><td style='{cell}'>{html.escape(NAMES.get(r['event'], r['event']))}</td>"
  f"<td style='{cell}color:#666'>{html.escape(where(r['source']))}</td>"
  f"<td style='{cell}text-align:right;font-weight:bold'>{r['yesterday']}</td>"
  f"<td style='{cell}text-align:right'>{r['week']}</td>"
  f"<td style='{cell}text-align:right;color:#666'>{r['all_time']}</td></tr>"
  for r in rows if r['week'] or r['yesterday'])
table = (f"<table style='border-collapse:collapse;font-size:14px'><tr style='text-align:left;color:#666'>"
         f"<th style='{cell}'>Button</th><th style='{cell}'>From</th><th style='{cell}text-align:right'>Yesterday</th>"
         f"<th style='{cell}text-align:right'>Last 7 days</th><th style='{cell}text-align:right'>All time</th></tr>{body_rows}</table>"
         if body_rows else "<p>No clicks in the last 7 days.</p>")
page = (f"<div style='font-family:Arial,sans-serif;color:#222'>"
        f"<h2 style='margin:0 0 6px'>Collection-Bound clicks for {day}</h2>"
        f"<p style='margin:0 0 16px'>{yest} clicks yesterday. Checkouts started: {checkouts_y} yesterday, "
        f"{checkouts_w} in the last 7 days. Finished payments are in Stripe.</p>{table}"
        f"<p style='color:#999;font-size:12px;margin-top:18px'>Sent every morning by your GitHub "
        f"(Daily click email). Counts are anonymous.</p></div>")

if not key or not to:
    missing = ', '.join(n for n, v in (('RESEND_API_KEY', key), ('REPORT_EMAIL', to)) if not v)
    print(f'::warning title=No email sent::Missing secret(s): {missing}')
    print('Preview:\n')
    print(page)
    sys.exit(0)

req = urllib.request.Request(
  'https://api.resend.com/emails', method='POST',
  data=json.dumps({'from': 'Collection-Bound <updates@unravelingtherift.com>', 'to': [to],
                   'subject': f'Collection-Bound clicks: {yest} yesterday, {checkouts_y} checkouts started',
                   'html': page}).encode(),
  headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json',
           'User-Agent': 'collection-bound-click-email'})
try:
    with urllib.request.urlopen(req) as r:
        print('Sent:', r.status, r.read().decode())
except urllib.error.HTTPError as e:
    detail = e.read().decode(errors='replace')[:300].replace('\n', ' ')
    print(f'::error title=Resend refused the email::HTTP {e.code}: {detail}')
    sys.exit(1)
except Exception as e:
    print(f'::error title=Could not reach Resend::{type(e).__name__}: {e}')
    sys.exit(1)
