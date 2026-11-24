/* Collection-Bound app: top bar for moving between sections.
 *
 * In the app:   Tracker (index.html), Handbook (handbook.html)
 * On the site:  Lore Codex, Play Simulator (open in the phone's browser until
 *               their code lives in the repo like the tracker and handbook)
 *
 * Height is exposed as --cb-appbar-h so pages can leave room for it.
 */
(function () {
  var SITE = 'https://www.unravelingtherift.com';
  var ITEMS = [
    { label: 'Tracker',   href: '/',               page: 'tracker'  },
    { label: 'Handbook',  href: '/handbook.html',  page: 'handbook' },
    { label: 'Lore',      href: SITE + '/lore',    external: true },
    { label: 'Simulator', href: SITE + '/riftbound-play-simulator', external: true }
  ];

  var current = /handbook/.test(location.pathname) ? 'handbook' : 'tracker';

  var css = document.createElement('style');
  css.textContent =
    ':root{--cb-appbar-h:calc(46px + env(safe-area-inset-top));}' +
    'body{padding-top:var(--cb-appbar-h) !important;}' +
    '#cb-appbar{position:fixed;top:0;left:0;right:0;z-index:90;height:var(--cb-appbar-h);' +
      'padding:env(safe-area-inset-top) env(safe-area-inset-right) 0 env(safe-area-inset-left);box-sizing:border-box;' +
      'display:flex;align-items:stretch;background:rgba(10,13,24,.96);border-bottom:1px solid rgba(212,175,95,.35);' +
      'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);font-family:Cinzel,Georgia,serif;}' +
    '#cb-appbar a{flex:1;display:flex;align-items:center;justify-content:center;gap:3px;text-decoration:none;' +
      'color:#bdb6a4;font-size:13px;font-weight:700;letter-spacing:.04em;border-bottom:2px solid transparent;}' +
    '#cb-appbar a.on{color:#f0cd72;border-bottom-color:#f0cd72;}' +
    '#cb-appbar a .ext{font-size:10px;opacity:.7;}';
  document.head.appendChild(css);

  function build() {
    if (document.getElementById('cb-appbar')) return;
    var bar = document.createElement('nav');
    bar.id = 'cb-appbar';
    bar.setAttribute('aria-label', 'Sections');
    ITEMS.forEach(function (it) {
      var a = document.createElement('a');
      a.href = it.href;
      a.textContent = it.label;
      if (it.external) {
        a.target = '_blank';
        a.rel = 'noopener';
        var e = document.createElement('span');
        e.className = 'ext';
        e.textContent = '↗';
        a.appendChild(e);
      }
      if (it.page === current) { a.className = 'on'; a.setAttribute('aria-current', 'page'); }
      bar.appendChild(a);
    });
    document.body.insertBefore(bar, document.body.firstChild);
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
