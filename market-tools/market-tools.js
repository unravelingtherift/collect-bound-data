/*!
 * Collection-Bound market tools — market comparison + landed cost calculator
 * (c) Unraveling the Rift. All rights reserved. See LICENSE.
 *
 * Usage (inside the tracker):
 *   CBMarketTools.mount(element, {
 *     card:   { name, set, number, image },          // what's being priced
 *     markets: [                                      // one entry per language market
 *       { lang: "en", price: 289.99, source: "TCGplayer", updated: "2026-10-23" },
 *       { lang: "zh", price: 1450 },                  // price in that market's currency
 *       { lang: "ko", price: null },                  // null = no price yet
 *       { lang: "fr", price: 240 }
 *     ],
 *     rates: { USD: 1, CNY: 0.14, KRW: 0.00072, EUR: 1.08 },  // USD per 1 unit
 *     ratesUpdated: "2026-10-24",
 *     home: "en",                                     // the buyer's own market
 *     flagUrl: function (code) { return "..."; }      // optional: your own flag images
 *   });
 *
 * Also exported: CBMarketTools.mountComparison(el, opts) and
 * CBMarketTools.mountLandedCost(el, opts) to place the two parts separately.
 */
(function (global) {
  "use strict";

  var MARKETS = {
    en: { label: "English", region: "United States", currency: "USD", flag: "us", locale: "en-US" },
    zh: { label: "Chinese", region: "China", currency: "CNY", flag: "cn", locale: "zh-CN" },
    ko: { label: "Korean", region: "South Korea", currency: "KRW", flag: "kr", locale: "ko-KR" },
    fr: { label: "French", region: "France", currency: "EUR", flag: "fr", locale: "fr-FR" }
  };

  var STORE_KEY = "cbmt-landed-v1";
  var STYLE_ID = "cbmt-style";

  var CSS = [
    ".cbmt{--cbmt-ink:#16120d;--cbmt-panel:#1f1912;--cbmt-line:#3a2f20;--cbmt-text:#ebe2cc;--cbmt-dim:#a99a7c;",
    "--cbmt-gold:#c9a24a;--cbmt-gold-hi:#e8c873;--cbmt-save:#6fb59a;--cbmt-cost:#d17a5a;",
    "--cbmt-en:#5b7fbf;--cbmt-zh:#c4483e;--cbmt-ko:#3f93ad;--cbmt-fr:#8a74c2;",
    "font-family:Spectral,Georgia,serif;color:var(--cbmt-text);background:var(--cbmt-ink);",
    "border:1px solid var(--cbmt-line);border-radius:14px;padding:20px;line-height:1.55;font-size:16px;",
    "font-variant-numeric:lining-nums tabular-nums;box-sizing:border-box;max-width:880px}",
    ".cbmt *,.cbmt *::before,.cbmt *::after{box-sizing:border-box}",
    ".cbmt h3,.cbmt h4{font-family:Cinzel,'Times New Roman',serif;font-weight:600;color:var(--cbmt-gold-hi);margin:0;letter-spacing:.02em}",
    ".cbmt h3{font-size:1.35rem;line-height:1.25}",
    ".cbmt h4{font-size:1.05rem;margin-bottom:4px}",
    ".cbmt p{margin:0}",
    ".cbmt .cbmt-sub{color:var(--cbmt-dim);font-size:.92rem}",

    /* card header */
    ".cbmt-head{display:flex;gap:16px;align-items:center;margin-bottom:18px}",
    ".cbmt-thumb{width:64px;aspect-ratio:744/1039;border-radius:5px;object-fit:cover;border:1px solid var(--cbmt-line);flex:none;background:var(--cbmt-panel)}",
    ".cbmt-verdict{margin-top:6px;font-size:.98rem}",
    ".cbmt-verdict b{color:var(--cbmt-gold-hi);font-weight:600}",

    /* market rows: the price scale */
    ".cbmt-scale{list-style:none;margin:0;padding:0;border-top:1px solid var(--cbmt-line)}",
    ".cbmt-row{display:grid;grid-template-columns:minmax(150px,1.1fr) 2fr auto;gap:6px 16px;align-items:center;",
    "padding:12px 2px;border-bottom:1px solid var(--cbmt-line)}",
    ".cbmt-who{display:flex;align-items:center;gap:8px;min-width:0}",
    ".cbmt-flag{width:22px;height:15px;border-radius:2px;object-fit:cover;flex:none;box-shadow:0 0 0 1px rgba(255,255,255,.12)}",
    ".cbmt-lang{display:inline-block;padding:1px 9px;border-radius:999px;font-size:.8rem;font-weight:600;color:#fff;white-space:nowrap}",
    ".cbmt-lang[data-l=en]{background:var(--cbmt-en)}.cbmt-lang[data-l=zh]{background:var(--cbmt-zh)}",
    ".cbmt-lang[data-l=ko]{background:var(--cbmt-ko)}.cbmt-lang[data-l=fr]{background:var(--cbmt-fr)}",
    ".cbmt-src{display:block;color:var(--cbmt-dim);font-size:.8rem;line-height:1.3}",
    ".cbmt-bar{position:relative;height:10px;border-radius:5px;background:rgba(201,162,74,.12);overflow:hidden}",
    ".cbmt-fill{position:absolute;inset:0 auto 0 0;border-radius:5px;background:linear-gradient(90deg,#8a6d2c,var(--cbmt-gold))}",
    ".cbmt-row.is-best .cbmt-fill{background:linear-gradient(90deg,#3f7d67,var(--cbmt-save))}",
    ".cbmt-amt{text-align:right;min-width:128px}",
    ".cbmt-usd{font-size:1.08rem;font-weight:600}",
    ".cbmt-local{display:block;color:var(--cbmt-dim);font-size:.82rem}",
    ".cbmt-note{grid-column:2/4;display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;font-size:.85rem}",
    ".cbmt-tag{padding:0 8px;border-radius:999px;border:1px solid currentColor;font-size:.78rem;font-weight:600}",
    ".cbmt-tag.save{color:var(--cbmt-save)}.cbmt-tag.cost{color:var(--cbmt-cost)}.cbmt-tag.home{color:var(--cbmt-dim)}",
    ".cbmt-none{color:var(--cbmt-dim);font-style:italic}",
    ".cbmt-link{appearance:none;background:none;border:0;padding:2px 0;color:var(--cbmt-gold);font:inherit;font-size:.85rem;",
    "text-decoration:underline;text-underline-offset:3px;cursor:pointer}",
    ".cbmt-link:hover{color:var(--cbmt-gold-hi)}",
    ".cbmt-rates{margin-top:10px;color:var(--cbmt-dim);font-size:.8rem}",

    /* landed cost */
    ".cbmt-lc{margin-top:26px;padding-top:20px;border-top:1px solid var(--cbmt-gold);",
    "border-top-color:rgba(201,162,74,.45)}",
    ".cbmt-lc-grid{display:grid;grid-template-columns:1.15fr 1fr;gap:22px;margin-top:14px}",
    ".cbmt-fs{border:0;margin:0 0 14px;padding:0}",
    ".cbmt-fs legend{padding:0;margin-bottom:6px;color:var(--cbmt-gold);font-size:.9rem;font-weight:600}",
    ".cbmt-field{display:grid;grid-template-columns:1fr 128px;gap:10px;align-items:center;margin-bottom:6px}",
    ".cbmt-field label{font-size:.92rem}",
    ".cbmt-field small{display:block;color:var(--cbmt-dim);font-size:.76rem;line-height:1.3}",
    ".cbmt-in{display:flex;align-items:center;border:1px solid var(--cbmt-line);border-radius:7px;background:var(--cbmt-panel)}",
    ".cbmt-in span{padding:0 0 0 8px;color:var(--cbmt-dim);font-size:.8rem;white-space:nowrap}",
    ".cbmt-in input,.cbmt-in select{width:100%;min-width:0;background:transparent;border:0;color:var(--cbmt-text);",
    "font:inherit;font-size:.95rem;padding:6px 8px;text-align:right}",
    ".cbmt-in select{text-align:left;cursor:pointer}",
    ".cbmt-in input{-moz-appearance:textfield}",
    ".cbmt-in input::-webkit-outer-spin-button,.cbmt-in input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}",
    ".cbmt-in select option{background:var(--cbmt-panel)}",
    ".cbmt-in:focus-within{border-color:var(--cbmt-gold);box-shadow:0 0 0 2px rgba(201,162,74,.25)}",
    ".cbmt-field.wide{grid-template-columns:1fr 1.4fr}",

    /* receipt */
    ".cbmt-receipt{background:var(--cbmt-panel);border:1px solid var(--cbmt-line);border-radius:10px;padding:16px;align-self:start;position:sticky;top:12px}",
    ".cbmt-receipt table{width:100%;border-collapse:collapse;font-size:.92rem}",
    ".cbmt-receipt td{padding:4px 0;vertical-align:top}",
    ".cbmt-receipt td:last-child{text-align:right;white-space:nowrap;padding-left:10px}",
    ".cbmt-receipt tr.zero td{color:var(--cbmt-dim)}",
    ".cbmt-receipt tr.total td{border-top:1px solid var(--cbmt-gold);padding-top:8px;font-weight:600;font-size:1.05rem;color:var(--cbmt-gold-hi)}",
    ".cbmt-each{margin-top:2px;text-align:right;color:var(--cbmt-dim);font-size:.85rem}",
    ".cbmt-compare{margin-top:14px;padding:10px 12px;border-radius:8px;font-size:.95rem;line-height:1.45}",
    ".cbmt-compare.save{background:rgba(111,181,154,.12);border:1px solid rgba(111,181,154,.45)}",
    ".cbmt-compare.cost{background:rgba(209,122,90,.12);border:1px solid rgba(209,122,90,.45)}",
    ".cbmt-compare.none{border:1px dashed var(--cbmt-line);color:var(--cbmt-dim)}",
    ".cbmt-fine{margin-top:10px;color:var(--cbmt-dim);font-size:.76rem;line-height:1.4}",

    "@media (max-width:640px){.cbmt{padding:14px}.cbmt-row{grid-template-columns:1fr auto}",
    ".cbmt-bar{grid-column:1/3;grid-row:2}.cbmt-note{grid-column:1/3}",
    ".cbmt-lc-grid{grid-template-columns:1fr}.cbmt-receipt{position:static}.cbmt-field{grid-template-columns:1fr 118px}}",
    "@media (prefers-reduced-motion:no-preference){.cbmt-fill{transition:width .5s ease}.cbmt-row.flash{animation:cbmt-flash 1.2s ease}}",
    "@keyframes cbmt-flash{0%{background:rgba(201,162,74,.22)}100%{background:transparent}}"
  ].join("");

  /* ---------- helpers ---------- */

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function num(v) {
    var n = typeof v === "number" ? v : parseFloat(String(v).replace(/,/g, ""));
    return isFinite(n) ? n : 0;
  }

  function money(amount, currency) {
    var digits = currency === "KRW" ? 0 : 2;
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency", currency: currency,
        minimumFractionDigits: digits, maximumFractionDigits: digits
      }).format(amount);
    } catch (e) {
      return currency + " " + amount.toFixed(digits);
    }
  }

  function usd(amount) { return money(amount, "USD"); }

  function pct(n) { return Math.round(Math.abs(n) * 100) + "%"; }

  function toUSD(amount, currency, rates) {
    var r = rates && rates[currency];
    return typeof r === "number" && r > 0 ? amount * r : null;
  }

  // Flags load from flagcdn by default. Pass opts.flagUrl (a function of the
  // country code) to use your own flag images, or opts.flags = false to hide them.
  var flagOpts = {};
  function flagImg(code, label) {
    if (flagOpts.flags === false) return "";
    var src = typeof flagOpts.flagUrl === "function" ? flagOpts.flagUrl(code) : "https://flagcdn.com/w40/" + code + ".png";
    return '<img class="cbmt-flag" src="' + esc(src) + '" alt="' + esc(label) +
      ' flag" width="22" height="15" loading="lazy" onerror="this.remove()">';
  }

  function langBubble(lang) {
    var m = MARKETS[lang];
    return '<span class="cbmt-lang" data-l="' + lang + '">' + esc(m ? m.label : lang) + "</span>";
  }

  function loadSaved() {
    try { return JSON.parse(global.localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }

  function save(all) {
    try { global.localStorage.setItem(STORE_KEY, JSON.stringify(all)); } catch (e) { /* storage off: fine */ }
  }

  /* Normalise the markets list into rows with USD values. */
  function priced(opts) {
    return (opts.markets || []).filter(function (m) { return MARKETS[m.lang]; }).map(function (m) {
      var meta = MARKETS[m.lang];
      var has = m.price != null && m.price !== "" && num(m.price) > 0;
      var local = has ? num(m.price) : null;
      return {
        lang: m.lang, meta: meta, local: local, source: m.source || "",
        updated: m.updated || "", usd: has ? toUSD(local, meta.currency, opts.rates) : null
      };
    });
  }

  /* ---------- market comparison ---------- */

  function mountComparison(el, opts) {
    injectStyle();
    opts = opts || {};
    flagOpts = opts;
    var home = opts.home || "en";
    var rows = priced(opts);
    var withUSD = rows.filter(function (r) { return r.usd != null; });
    var max = withUSD.reduce(function (a, r) { return Math.max(a, r.usd); }, 0);
    var best = withUSD.slice().sort(function (a, b) { return a.usd - b.usd; })[0] || null;
    var homeRow = rows.filter(function (r) { return r.lang === home; })[0];
    var homeUSD = homeRow && homeRow.usd;
    var card = opts.card || {};

    rows.sort(function (a, b) {
      if (a.usd == null) return 1;
      if (b.usd == null) return -1;
      return a.usd - b.usd;
    });

    var verdict;
    if (!best) {
      verdict = "No market prices yet for this card.";
    } else if (withUSD.length === 1) {
      verdict = "Only the " + best.meta.label + " market has a price so far.";
    } else if (homeUSD != null && best.lang !== home) {
      verdict = "<b>" + best.meta.label + "</b> copies are the cheapest, " + pct(1 - best.usd / homeUSD) +
        " below the " + MARKETS[home].label + " price before import costs.";
    } else {
      verdict = "<b>" + best.meta.label + "</b> copies are the cheapest right now.";
    }

    var html = '<div class="cbmt-head">' +
      (card.image ? '<img class="cbmt-thumb" src="' + esc(card.image) + '" alt="' + esc(card.name) + '">' : "") +
      "<div><h3>" + esc(card.name || "Market comparison") + "</h3>" +
      (card.set || card.number ? '<p class="cbmt-sub">' + esc([card.set, card.number].filter(Boolean).join(" ")) + "</p>" : "") +
      '<p class="cbmt-verdict">' + verdict + "</p></div></div>";

    html += '<ul class="cbmt-scale">';
    rows.forEach(function (r) {
      var isBest = best && r === best && withUSD.length > 1;
      var w = r.usd != null && max > 0 ? Math.max(4, (r.usd / max) * 100) : 0;
      var note = "";
      if (r.usd != null) {
        if (r.lang === home) note += '<span class="cbmt-tag home">Your market</span>';
        else if (homeUSD != null) {
          var d = r.usd / homeUSD - 1;
          note += d < 0
            ? '<span class="cbmt-tag save">' + pct(d) + " less than " + MARKETS[home].label + "</span>"
            : '<span class="cbmt-tag cost">' + pct(d) + " more than " + MARKETS[home].label + "</span>";
        }
        if (isBest) note += '<span class="cbmt-tag save">Lowest price</span>';
        if (r.lang !== home) {
          note += '<button type="button" class="cbmt-link" data-cbmt-import="' + r.lang + '">Work out import cost</button>';
        }
      }
      html += '<li class="cbmt-row' + (isBest ? " is-best" : "") + '">' +
        '<div class="cbmt-who">' + flagImg(r.meta.flag, r.meta.region) +
        "<div>" + langBubble(r.lang) +
        '<span class="cbmt-src">' + esc(r.source || r.meta.region) + (r.updated ? ", " + esc(r.updated) : "") + "</span></div></div>" +
        '<div class="cbmt-bar" role="presentation"><div class="cbmt-fill" style="width:' + w.toFixed(1) + '%"></div></div>' +
        '<div class="cbmt-amt">' + (r.local == null
          ? '<span class="cbmt-none">No price yet</span>'
          : '<span class="cbmt-usd">' + (r.usd != null ? usd(r.usd) : "—") + "</span>" +
            (r.meta.currency !== "USD" ? '<span class="cbmt-local">' + money(r.local, r.meta.currency) + "</span>" : "")) +
        "</div>" +
        (note ? '<div class="cbmt-note">' + note + "</div>" : "") +
        "</li>";
    });
    html += "</ul>";
    html += '<p class="cbmt-rates">US dollar amounts are converted at ' +
      (opts.ratesUpdated ? "rates from " + esc(opts.ratesUpdated) : "the latest synced rates") +
      " and don't include shipping, fees or import duty.</p>";

    el.innerHTML = html;

    el.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-cbmt-import]");
      if (!b || typeof opts.onImportCost !== "function") return;
      var lang = b.getAttribute("data-cbmt-import");
      var row = rows.filter(function (r) { return r.lang === lang; })[0];
      opts.onImportCost(lang, row ? row.local : null);
    });
  }

  /* ---------- landed cost calculator ---------- */

  var FIELDS = [
    // key, label, help, unit ("local" = source currency, "usd", "pct", "qty"), group
    ["price", "Card price", "Each, in the seller's currency", "local", "buy"],
    ["qty", "How many", "", "qty", "buy"],
    ["sellerShip", "Seller's shipping", "To you or to your proxy, in their currency", "local", "buy"],
    ["proxyPct", "Proxy service fee", "Percent of the order, if you use a proxy", "pct", "proxy"],
    ["proxyFlat", "Proxy flat fee", "Per order, in the proxy's currency", "local", "proxy"],
    ["intlShip", "International shipping", "From the proxy or seller to you", "usd", "ship"],
    ["insurance", "Shipping insurance", "", "usd", "ship"],
    ["payPct", "Payment or currency fee", "What your card or PayPal adds on foreign purchases", "pct", "pay"],
    ["dutyPct", "Import duty", "Percent of the cards' value. Check the current rate for your country", "pct", "pay"],
    ["brokerFee", "Customs or carrier fee", "Clearance, brokerage or handling charge", "usd", "pay"]
  ];
  var GROUPS = { buy: "The cards", proxy: "Proxy (optional)", ship: "Shipping", pay: "Fees and duty" };
  var DEFAULTS = { price: 0, qty: 1, sellerShip: 0, proxyPct: 0, proxyFlat: 0, intlShip: 0, insurance: 0, payPct: 3, dutyPct: 0, brokerFee: 0 };

  function compute(v, lang, rates) {
    var cur = MARKETS[lang].currency;
    var r = toUSD(1, cur, rates);
    if (r == null) return null;
    var items = v.price * Math.max(1, v.qty) * r;
    var sellerShip = v.sellerShip * r;
    var proxy = (items * v.proxyPct) / 100 + v.proxyFlat * r;
    var paidAbroad = items + sellerShip + proxy;
    var payFee = cur === "USD" ? 0 : (paidAbroad * v.payPct) / 100;
    var duty = (items * v.dutyPct) / 100;
    var lines = [
      ["Cards", items],
      ["Seller's shipping", sellerShip],
      ["Proxy fees", proxy],
      ["Payment or currency fee", payFee],
      ["International shipping", v.intlShip],
      ["Insurance", v.insurance],
      ["Import duty", duty],
      ["Customs or carrier fee", v.brokerFee]
    ];
    var total = lines.reduce(function (a, l) { return a + l[1]; }, 0);
    return { lines: lines, total: total, each: total / Math.max(1, v.qty) };
  }

  function mountLandedCost(el, opts) {
    injectStyle();
    opts = opts || {};
    var home = opts.home || "en";
    var rows = priced(opts);
    var sources = rows.filter(function (r) { return r.lang !== home && toUSD(1, r.meta.currency, opts.rates) != null; });
    var homeRow = rows.filter(function (r) { return r.lang === home; })[0];
    var saved = loadSaved();
    var state = { lang: (sources[0] && sources[0].lang) || null, values: {} };

    function valuesFor(lang) {
      // Remember fee settings per market; the card price always comes from the market row.
      var s = saved[lang] || {};
      var v = {};
      Object.keys(DEFAULTS).forEach(function (k) { v[k] = s[k] != null ? num(s[k]) : DEFAULTS[k]; });
      var row = rows.filter(function (r) { return r.lang === lang; })[0];
      v.price = row && row.local != null ? row.local : 0;
      v.qty = 1;
      return v;
    }

    if (!state.lang) {
      el.innerHTML = '<div class="cbmt-lc"><h4>Import cost</h4><p class="cbmt-sub">Import costs appear here once another language market has a price for this card.</p></div>';
      return { prefill: function () {} };
    }
    state.values = valuesFor(state.lang);

    function fieldHTML(f) {
      var key = f[0], unit = f[3];
      var cur = MARKETS[state.lang].currency;
      var pre = unit === "local" ? cur : unit === "usd" ? "USD" : unit === "pct" ? "%" : "";
      var step = unit === "qty" ? "1" : unit === "local" && cur === "KRW" ? "100" : "0.01";
      var id = "cbmt-" + key + "-" + uid;
      return '<div class="cbmt-field"><label for="' + id + '">' + esc(f[1]) +
        (f[2] ? "<small>" + esc(f[2]) + "</small>" : "") + "</label>" +
        '<div class="cbmt-in">' + (pre ? "<span>" + pre + "</span>" : "") +
        '<input id="' + id + '" type="number" inputmode="decimal" min="' + (unit === "qty" ? 1 : 0) + '" step="' + step +
        '" data-k="' + key + '" value="' + esc(state.values[key]) + '"></div></div>';
    }

    var uid = Math.random().toString(36).slice(2, 7);

    function render() {
      var html = '<div class="cbmt-lc"><h4>Import cost</h4>' +
        '<p class="cbmt-sub">What the card really costs once it reaches you, compared with buying it in the ' +
        MARKETS[home].label + " market.</p>" +
        '<div class="cbmt-lc-grid"><form class="cbmt-form" novalidate>' +
        '<div class="cbmt-field wide"><label for="cbmt-src-' + uid + '">Buying from</label><div class="cbmt-in"><select id="cbmt-src-' + uid + '" data-src>' +
        sources.map(function (r) {
          return '<option value="' + r.lang + '"' + (r.lang === state.lang ? " selected" : "") + ">" +
            esc(r.meta.label + " market (" + r.meta.currency + ")") + "</option>";
        }).join("") + "</select></div></div>";
      Object.keys(GROUPS).forEach(function (g) {
        html += '<fieldset class="cbmt-fs"><legend>' + GROUPS[g] + "</legend>" +
          FIELDS.filter(function (f) { return f[4] === g; }).map(fieldHTML).join("") + "</fieldset>";
      });
      html += '</form><div class="cbmt-receipt" aria-live="polite"></div></div></div>';
      el.innerHTML = html;
      update();
    }

    function update() {
      var box = el.querySelector(".cbmt-receipt");
      var res = compute(state.values, state.lang, opts.rates);
      if (!res) { box.innerHTML = '<p class="cbmt-sub">No exchange rate for this currency yet.</p>'; return; }
      var qty = Math.max(1, state.values.qty);
      var html = "<table><tbody>" + res.lines.map(function (l) {
        return '<tr class="' + (l[1] > 0 ? "" : "zero") + '"><td>' + esc(l[0]) + "</td><td>" + usd(l[1]) + "</td></tr>";
      }).join("") +
        '<tr class="total"><td>Total delivered</td><td>' + usd(res.total) + "</td></tr></tbody></table>" +
        (qty > 1 ? '<p class="cbmt-each">' + usd(res.each) + " per card</p>" : "");

      var homeUSD = homeRow && homeRow.usd;
      if (homeUSD != null) {
        var homeTotal = homeUSD * qty;
        var diff = homeTotal - res.total;
        var src = MARKETS[state.lang].label;
        html += diff >= 0
          ? '<div class="cbmt-compare save">Importing ' + (qty > 1 ? "these" : "this card") + " saves <b>" + usd(diff) +
            "</b> (" + pct(diff / homeTotal) + ") against " + usd(homeTotal) + " in the " + MARKETS[home].label + " market.</div>"
          : '<div class="cbmt-compare cost">Buying in the ' + MARKETS[home].label + " market is <b>" + usd(-diff) +
            "</b> cheaper. Once fees and shipping are added, the " + src + " copy costs " + pct(-diff / homeTotal) + " more.</div>";
      } else {
        html += '<div class="cbmt-compare none">There\'s no ' + MARKETS[home].label + " market price to compare against yet.</div>";
      }
      html += '<p class="cbmt-fine">An estimate from the amounts entered and the latest exchange rates. ' +
        "Duty and customs fees depend on your country's current rules and the carrier, so check them before you buy.</p>";
      box.innerHTML = html;
    }

    el.addEventListener("input", function (e) {
      var k = e.target.getAttribute && e.target.getAttribute("data-k");
      if (!k) return;
      state.values[k] = num(e.target.value);
      if (k !== "price" && k !== "qty") {
        saved[state.lang] = saved[state.lang] || {};
        saved[state.lang][k] = state.values[k];
        save(saved);
      }
      update();
    });
    el.addEventListener("change", function (e) {
      if (!e.target.hasAttribute || !e.target.hasAttribute("data-src")) return;
      state.lang = e.target.value;
      state.values = valuesFor(state.lang);
      render();
    });

    render();

    return {
      prefill: function (lang, price) {
        if (!sources.some(function (r) { return r.lang === lang; })) return;
        state.lang = lang;
        state.values = valuesFor(lang);
        if (price != null) state.values.price = num(price);
        render();
        var first = el.querySelector("[data-k=sellerShip]");
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (first) first.focus({ preventScroll: true });
      }
    };
  }

  /* ---------- both together ---------- */

  function mount(el, opts) {
    injectStyle();
    opts = opts || {};
    el.classList.add("cbmt");
    var top = document.createElement("div");
    var bottom = document.createElement("div");
    el.innerHTML = "";
    el.appendChild(top);
    el.appendChild(bottom);
    var calc = mountLandedCost(bottom, opts);
    mountComparison(top, Object.assign({}, opts, {
      onImportCost: function (lang, price) {
        calc.prefill(lang, price);
        if (typeof opts.onImportCost === "function") opts.onImportCost(lang, price);
      }
    }));
    return calc;
  }

  global.CBMarketTools = {
    mount: mount,
    mountComparison: function (el, o) { el.classList.add("cbmt"); return mountComparison(el, o); },
    mountLandedCost: function (el, o) { el.classList.add("cbmt"); return mountLandedCost(el, o); },
    markets: MARKETS,
    _compute: compute
  };
})(typeof window !== "undefined" ? window : this);
