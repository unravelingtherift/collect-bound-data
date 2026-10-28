/* Unraveling the Rift · Lore Codex · Music tab
   Usage: <div id="utr-music-mount"></div>
          <script src="https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/codex/music/music-tab.js"></script>
   Add data-bleed="true" on the mount to stretch it edge to edge (for a standalone page). */
(function(){
  var mount=document.getElementById('utr-music-mount');
  if(!mount||mount.dataset.loaded) return; mount.dataset.loaded='1';
  var BASE='https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/codex/';
  if(!document.getElementById('utrm-fonts')){
    var f=document.createElement('div'); f.id='utrm-fonts'; f.style.display='none'; f.innerHTML="<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Sora:wght@300;400;600;700&display=swap\" rel=\"stylesheet\">";
    [].slice.call(f.children).forEach(function(n){document.head.appendChild(n);});
    var st=document.createElement('style'); st.id='utrm-style'; st.textContent="\n#utr-music{\n  --utrm-bg:#0b0912; --utrm-panel:rgba(21,17,31,.9); --utrm-panel2:rgba(29,23,41,.92);\n  --utrm-gold:#d9b25f; --utrm-gold2:#f3d58c; --utrm-ink:#efe8f7; --utrm-dim:#b9b0ca;\n  --utrm-line:rgba(217,178,95,.28);\n  --utrm-accent:#ff4fa3; --utrm-accent2:#8a5cff;\n  --utrm-fury:#e5484d; --utrm-calm:#3fb27f; --utrm-mind:#3d8bfd; --utrm-body:#f08a24; --utrm-chaos:#a45cf0; --utrm-order:#e8c547;\n  background:radial-gradient(1200px 600px at 50% -200px, rgba(138,92,255,.18), transparent 70%), var(--utrm-bg);\n  color:var(--utrm-ink); font-family:'Sora',system-ui,sans-serif; font-size:15px; line-height:1.6;\n  border-radius:0; overflow:hidden; overflow:clip; position:relative;\n}\n#utr-music.utrm-bleed{width:calc(100vw - var(--utrm-sbw,0px)); max-width:none; margin-left:calc(50% - (100vw - var(--utrm-sbw,0px)) / 2)}\n#utr-music .utrm-hero,#utr-music .utrm-wrap{max-width:1200px;margin-left:auto;margin-right:auto}\n#utr-music .utrm-bg{position:sticky;top:0;height:100vh;margin-bottom:-100vh;z-index:0;pointer-events:none;\n  background:linear-gradient(180deg,rgba(11,9,18,.72),rgba(11,9,18,.82) 60%,rgba(11,9,18,.9)),var(--utrm-bgimg) center/cover no-repeat}\n#utr-music .utrm-hero,#utr-music .utrm-ticker,#utr-music .utrm-wrap{position:relative;z-index:1}\n#utr-music .utrm-sub,#utr-music .utrm-tagline,#utr-music .utrm-lede{text-shadow:0 1px 3px rgba(0,0,0,.9)}\n#utr-music *{box-sizing:border-box}\n#utr-music a{color:var(--utrm-gold2)}\n#utr-music .utrm-serif{font-family:'Friz Quadrata','Friz Quadrata Std','Cinzel',serif}\n\n/* ---------- hero ---------- */\n#utr-music .utrm-hero{padding:44px 20px 26px;text-align:center;position:relative}\n#utr-music .utrm-kicker{letter-spacing:.32em;text-transform:uppercase;font-size:11px;color:var(--utrm-gold);margin:0 0 6px}\n#utr-music .utrm-title{font-family:'Friz Quadrata','Friz Quadrata Std','Cinzel',serif;font-weight:900;font-size:clamp(44px,10vw,92px);line-height:1;margin:0;\n  background:linear-gradient(100deg,var(--utrm-gold2),#fff 30%,var(--utrm-accent) 55%,var(--utrm-accent2) 80%,var(--utrm-gold2));\n  -webkit-background-clip:text;background-clip:text;color:transparent;background-size:200% 100%;animation:utrmShine 9s linear infinite}\n@keyframes utrmShine{to{background-position:200% 0}}\n#utr-music .utrm-sub{max-width:640px;margin:14px auto 0;color:var(--utrm-dim)}\n#utr-music .utrm-eq{display:flex;gap:4px;justify-content:center;align-items:flex-end;height:34px;margin:18px auto 0}\n#utr-music .utrm-eq span{width:6px;border-radius:3px;background:linear-gradient(var(--utrm-accent),var(--utrm-accent2));animation:utrmEq 1.1s ease-in-out infinite}\n#utr-music .utrm-eq span:nth-child(2n){animation-duration:.8s;background:linear-gradient(var(--utrm-gold2),var(--utrm-gold))}\n#utr-music .utrm-eq span:nth-child(3n){animation-duration:1.4s}\n#utr-music .utrm-eq span:nth-child(5n){animation-duration:.95s}\n@keyframes utrmEq{0%,100%{height:6px}50%{height:34px}}\n\n/* ---------- ticker ---------- */\n#utr-music .utrm-ticker{border-top:1px solid var(--utrm-line);border-bottom:1px solid var(--utrm-line);overflow:hidden;white-space:nowrap;background:rgba(0,0,0,.25)}\n#utr-music .utrm-ticker-track{display:inline-block;padding:9px 0;animation:utrmTick 40s linear infinite;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--utrm-gold2)}\n#utr-music .utrm-ticker-track span{margin:0 18px;opacity:.9}\n#utr-music .utrm-ticker-track i{font-style:normal;color:var(--utrm-accent)}\n@keyframes utrmTick{to{transform:translateX(-50%)}}\n\n/* ---------- notice ---------- */\n#utr-music .utrm-wrap{padding:22px 16px 40px}\n#utr-music .utrm-notice{display:flex;gap:12px;align-items:flex-start;background:var(--utrm-panel);border:1px solid var(--utrm-line);border-radius:14px;padding:14px 16px;margin:0 auto 22px;max-width:900px;font-size:14px}\n#utr-music .utrm-notice-ico{flex:0 0 34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(217,178,95,.14);font-size:18px}\n#utr-music .utrm-notice p{margin:0;color:var(--utrm-dim)}\n#utr-music .utrm-notice strong{color:var(--utrm-ink)}\n\n/* ---------- band tabs ---------- */\n#utr-music .utrm-tabs{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:6px 0 26px}\n#utr-music .utrm-tab{appearance:none;border:1px solid var(--utrm-line);background:var(--utrm-panel);color:var(--utrm-ink);border-radius:999px;padding:11px 20px;font:700 14px 'Sora',sans-serif;letter-spacing:.06em;cursor:pointer;transition:transform .15s,box-shadow .2s,background .2s}\n#utr-music .utrm-tab:hover{transform:translateY(-2px)}\n#utr-music .utrm-tab[aria-selected=\"true\"]{background:linear-gradient(120deg,var(--b1),var(--b2));border-color:transparent;color:#fff;box-shadow:0 6px 24px -6px var(--b1)}\n#utr-music .utrm-tab small{display:block;font-weight:400;font-size:10px;letter-spacing:.14em;opacity:.8;text-transform:uppercase}\n\n/* ---------- band panel ---------- */\n#utr-music .utrm-band{display:none;--b1:#ff4fa3;--b2:#8a5cff}\n#utr-music .utrm-band.utrm-on{display:block;animation:utrmIn .45s ease}\n@keyframes utrmIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n#utr-music .utrm-banner{border-radius:18px;padding:26px 20px;position:relative;overflow:hidden;background:linear-gradient(135deg,color-mix(in srgb,var(--b1) 38%,#120d1b),color-mix(in srgb,var(--b2) 30%,#0d0a14));border:1px solid rgba(255,255,255,.08)}\n#utr-music .utrm-banner:after{content:\"\";position:absolute;inset:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.04) 0 2px,transparent 2px 14px);pointer-events:none}\n#utr-music .utrm-band-name{font-family:'Friz Quadrata','Friz Quadrata Std','Cinzel',serif;font-size:clamp(34px,7vw,58px);font-weight:900;margin:0;line-height:1.05;letter-spacing:.02em}\n#utr-music .utrm-tagline{margin:8px 0 14px;font-size:16px;max-width:720px}\n#utr-music .utrm-chips{display:flex;flex-wrap:wrap;gap:8px;position:relative;z-index:1}\n#utr-music .utrm-chip{font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:6px 11px;border-radius:999px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.14)}\n#utr-music .utrm-chip.gold{border-color:var(--utrm-line);color:var(--utrm-gold2)}\n\n#utr-music .utrm-h{font-family:'Friz Quadrata','Friz Quadrata Std','Cinzel',serif;color:var(--utrm-gold2);font-size:22px;letter-spacing:.04em;margin:34px 0 14px;display:flex;align-items:center;gap:10px}\n#utr-music .utrm-h:before{content:\"\";width:22px;height:2px;background:linear-gradient(90deg,var(--b1),var(--b2));border-radius:2px}\n#utr-music .utrm-lede{color:var(--utrm-dim);margin:-6px 0 14px;font-size:14px}\n\n/* ---------- timeline ---------- */\n#utr-music .utrm-timeline{position:relative;padding-left:22px;border-left:2px solid rgba(255,255,255,.08)}\n#utr-music .utrm-era{position:relative;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);margin:0 0 20px;background:var(--utrm-panel);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:14px 16px}\n#utr-music .utrm-era:before{content:\"\";position:absolute;left:-31px;top:18px;width:14px;height:14px;border-radius:50%;background:linear-gradient(var(--b1),var(--b2));box-shadow:0 0 0 4px var(--utrm-bg),0 0 14px var(--b1)}\n#utr-music .utrm-era-year{font-weight:700;font-size:12px;letter-spacing:.2em;color:var(--b1);filter:brightness(1.3)}\n#utr-music .utrm-era h4{margin:2px 0 6px;font-size:17px;font-family:'Friz Quadrata','Friz Quadrata Std','Cinzel',serif;color:#fff}\n#utr-music .utrm-era p{margin:0;color:#d6cde4;font-size:14px}\n\n/* ---------- videos ---------- */\n#utr-music .utrm-vids{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}\n#utr-music .utrm-vid{background:var(--utrm-panel);border:1px solid rgba(255,255,255,.07);border-radius:14px;overflow:hidden}\n#utr-music .utrm-vid-frame{position:relative;aspect-ratio:16/9;background:#000;cursor:pointer;display:block;width:100%;border:0;padding:0;color:#fff;text-decoration:none}\n#utr-music .utrm-vid-frame img{width:100%;height:100%;object-fit:cover;display:block;opacity:.85;transition:opacity .2s,transform .4s}\n#utr-music .utrm-vid-frame:hover img{opacity:1;transform:scale(1.03)}\n#utr-music .utrm-vid-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}\n#utr-music .utrm-play{position:absolute;inset:0;display:grid;place-items:center}\n#utr-music .utrm-play b{width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,var(--b1),var(--b2));display:grid;place-items:center;box-shadow:0 8px 28px rgba(0,0,0,.5);font-size:22px;padding-left:4px}\n#utr-music .utrm-vid-poster{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:16px;background:linear-gradient(135deg,color-mix(in srgb,var(--b1) 45%,#000),color-mix(in srgb,var(--b2) 45%,#000))}\n#utr-music .utrm-vid-poster strong{font-family:'Friz Quadrata','Friz Quadrata Std','Cinzel',serif;font-size:24px;letter-spacing:.04em}\n#utr-music .utrm-vid-poster em{font-style:normal;font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.85;margin-top:6px}\n#utr-music .utrm-vid-frame .utrm-prev{position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none}\n#utr-music .utrm-badge{position:absolute;left:10px;top:10px;z-index:2;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;background:rgba(0,0,0,.72);padding:5px 9px;border-radius:999px;color:#fff;pointer-events:none}\n#utr-music .utrm-vid-meta{padding:11px 14px}\n#utr-music .utrm-vid-meta a{font-size:12px;display:inline-block;margin-top:6px}\n#utr-music .utrm-vid-meta h5{margin:0;font-size:15px;color:#fff}\n#utr-music .utrm-vid-meta p{margin:3px 0 0;font-size:12.5px;color:var(--utrm-dim)}\n\n/* ---------- skin closet ---------- */\n#utr-music .utrm-skins{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}\n#utr-music .utrm-skin{background:var(--utrm-panel2);border:1px solid rgba(255,255,255,.07);border-left:3px solid var(--b1);border-radius:12px;padding:12px 14px}\n#utr-music .utrm-skin h5{margin:0 0 2px;font-size:14.5px;color:#fff}\n#utr-music .utrm-skin span{font-size:11px;letter-spacing:.14em;color:var(--utrm-gold);text-transform:uppercase}\n#utr-music .utrm-skin p{margin:6px 0 0;font-size:13px;color:#cfc6dd}\n#utr-music .utrm-wiki{display:inline-block;margin-top:12px;font-size:13px}\n\n/* ---------- callout ---------- */\n#utr-music .utrm-callout{margin-top:16px;border-radius:14px;padding:14px 16px;background:linear-gradient(120deg,rgba(217,178,95,.12),rgba(255,255,255,.02));border:1px dashed var(--utrm-line);font-size:14px;color:#e6dcf3}\n#utr-music .utrm-callout b{color:var(--utrm-gold2)}\n\n/* ---------- members ---------- */\n#utr-music .utrm-members{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px}\n#utr-music .utrm-mem{background:var(--utrm-panel);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:14px;display:flex;flex-direction:column}\n#utr-music .utrm-flip{perspective:1200px;width:100%;aspect-ratio:744/1039;cursor:pointer;background:none;border:0;padding:0;display:block}\n#utr-music .utrm-flip-in{position:relative;width:100%;height:100%;transition:transform .7s cubic-bezier(.2,.8,.2,1);transform-style:preserve-3d}\n#utr-music .utrm-flip.utrm-flipped .utrm-flip-in{transform:rotateY(180deg)}\n#utr-music .utrm-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:12px;overflow:hidden}\n#utr-music .utrm-front{background:linear-gradient(160deg,color-mix(in srgb,var(--b1) 40%,#120d1b),color-mix(in srgb,var(--b2) 35%,#0d0a14))}\n#utr-music .utrm-front .utrm-alt{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:16px;font-family:'Friz Quadrata','Friz Quadrata Std','Cinzel',serif;font-size:18px;color:#fff}\n#utr-music .utrm-front.utrm-noimg img{display:none}\n#utr-music .utrm-front.utrm-noimg .utrm-alt{display:flex}\n#utr-music .utrm-front img{width:100%;height:100%;object-fit:cover;display:block;border-radius:12px;box-shadow:0 10px 30px -10px rgba(0,0,0,.8)}\n#utr-music .utrm-front .utrm-hint{position:absolute;right:8px;bottom:8px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;background:rgba(0,0,0,.65);padding:4px 8px;border-radius:999px;color:#fff}\n#utr-music .utrm-back{transform:rotateY(180deg);background:linear-gradient(160deg,#1c1530,#0f0b17);border:1px solid var(--dom,#888);padding:14px;display:flex;flex-direction:column;gap:8px;text-align:left;color:var(--utrm-ink);overflow:auto}\n#utr-music .utrm-back h6{margin:0;font-family:'Friz Quadrata','Friz Quadrata Std','Cinzel',serif;font-size:16px;color:#fff;line-height:1.2}\n#utr-music .utrm-stats{display:flex;gap:6px;flex-wrap:wrap}\n#utr-music .utrm-stat{font-size:11px;padding:4px 8px;border-radius:8px;background:rgba(255,255,255,.07);letter-spacing:.04em}\n#utr-music .utrm-stat.dom{background:var(--dom);color:#111;font-weight:700}\n#utr-music .utrm-rules{font-size:13px;line-height:1.55;background:rgba(0,0,0,.3);border-radius:10px;padding:10px;color:#f1eafa}\n#utr-music .utrm-kw{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.04em;padding:1px 7px;border-radius:6px;background:rgba(217,178,95,.2);color:var(--utrm-gold2);border:1px solid rgba(217,178,95,.4);margin:0 1px}\n#utr-music .utrm-sym{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 4px;border-radius:9px;font-size:10.5px;font-weight:700;vertical-align:1px;margin:0 1px}\n#utr-music .utrm-sym.en{background:#e9e4f2;color:#1a1424}\n#utr-music .utrm-sym.pw{background:var(--dom,#999);color:#111}\n#utr-music .utrm-sym.any{background:conic-gradient(var(--utrm-fury),var(--utrm-order),var(--utrm-calm),var(--utrm-mind),var(--utrm-chaos),var(--utrm-body),var(--utrm-fury));color:#111}\n#utr-music .utrm-sym.mt{background:none;color:var(--utrm-gold2);font-size:13px}\n#utr-music .utrm-sym.ex{background:rgba(255,255,255,.12);color:#fff}\n#utr-music .utrm-flavor{font-style:italic;font-size:12.5px;color:var(--utrm-dim)}\n#utr-music .utrm-num{font-size:11px;color:var(--utrm-dim);margin-top:auto}\n#utr-music .utrm-mem-body{padding-top:12px}\n#utr-music .utrm-mem-name{font-family:'Friz Quadrata','Friz Quadrata Std','Cinzel',serif;font-size:20px;margin:0;color:#fff}\n#utr-music .utrm-role{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--b1);filter:brightness(1.35);margin:2px 0 8px}\n#utr-music .utrm-mem-body ul{margin:0;padding-left:18px;font-size:13.5px;color:#d9d0e6}\n#utr-music .utrm-mem-body li{margin:0 0 5px}\n#utr-music .utrm-voice{font-size:12.5px;color:var(--utrm-dim);margin:8px 0 0}\n#utr-music .utrm-artnote{font-size:11px;color:var(--utrm-dim);margin-top:6px;text-align:center}\n#utr-music .utrm-ghost{aspect-ratio:744/1039;border-radius:12px;border:2px dashed rgba(255,255,255,.16);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:18px;background:repeating-linear-gradient(135deg,rgba(255,255,255,.02) 0 10px,transparent 10px 20px)}\n#utr-music .utrm-ghost b{font-family:'Friz Quadrata','Friz Quadrata Std','Cinzel',serif;font-size:22px;color:#fff}\n#utr-music .utrm-ghost span{font-size:12px;color:var(--utrm-dim);margin-top:8px}\n\n#utr-music .utrm-tabhint{text-align:center;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--utrm-gold);margin:0 0 10px}\n/* ---------- more music ---------- */\n#utr-music .utrm-extra{--b1:#f3d58c;--b2:#ff4fa3;margin-top:56px;padding-top:30px;border-top:1px solid var(--utrm-line)}\n#utr-music .utrm-extra-title{font-family:'Friz Quadrata','Friz Quadrata Std','Cinzel',serif;font-size:clamp(28px,6vw,44px);margin:0;text-align:center;color:#fff}\n#utr-music .utrm-extra-sub{text-align:center;color:var(--utrm-dim);max-width:680px;margin:8px auto 22px;text-shadow:0 1px 3px rgba(0,0,0,.9)}\n#utr-music .utrm-stage{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:20px;align-items:center;background:var(--utrm-panel);border:1px solid var(--utrm-line);border-radius:18px;padding:18px;margin-bottom:24px}\n#utr-music .utrm-stage h4{font-family:'Friz Quadrata','Friz Quadrata Std','Cinzel',serif;color:var(--utrm-gold2);font-size:24px;margin:0 0 4px}\n#utr-music .utrm-stage .utrm-role{margin-bottom:10px}\n#utr-music .utrm-stage p{margin:0 0 10px;font-size:14px;color:#ddd4ea}\n#utr-music .utrm-flip.utrm-wide{aspect-ratio:1039/744;max-width:none}\n#utr-music .utrm-tag{display:inline-block;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;padding:3px 8px;border-radius:999px;background:rgba(243,213,140,.14);color:var(--utrm-gold2);border:1px solid var(--utrm-line);margin:0 6px 6px 0}\n@media (max-width:760px){#utr-music .utrm-stage{grid-template-columns:1fr}}\n\n/* ---------- footer ---------- */\n#utr-music .utrm-foot{margin-top:40px;padding-top:18px;border-top:1px solid var(--utrm-line);font-size:12px;color:var(--utrm-dim);text-align:center}\n#utr-music .utrm-foot p{margin:4px 0}\n\n@media (max-width:560px){\n  #utr-music{font-size:14.5px}\n  #utr-music .utrm-wrap{padding:18px 12px 32px}\n  #utr-music .utrm-members{grid-template-columns:1fr;gap:16px}\n  #utr-music .utrm-flip,#utr-music .utrm-ghost{max-width:300px;margin:0 auto}\n  #utr-music .utrm-mem-name{font-size:17px}\n  #utr-music .utrm-tab{padding:10px 14px;font-size:13px}\n}\n@media (prefers-reduced-motion:reduce){\n  #utr-music *{animation:none!important;transition:none!important}\n}\n"; document.head.appendChild(st);
  }
  mount.innerHTML="<div id=\"utr-music\">\n  <div class=\"utrm-bg\" aria-hidden=\"true\"></div>\n  <header class=\"utrm-hero\">\n    <p class=\"utrm-kicker\">Lore Codex \u00b7 Radiance</p>\n    <h2 class=\"utrm-title\">MUSIC</h2>\n    <p class=\"utrm-sub\">Radiance turned the Rift into a concert hall. These are the bands that crashed the set: who they are, where they came from, and every card they walked onstage with.</p>\n    <div class=\"utrm-eq\" aria-hidden=\"true\"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>\n  </header>\n\n  <div class=\"utrm-ticker\" aria-hidden=\"true\">\n    <div class=\"utrm-ticker-track\" id=\"utrm-ticker\"></div>\n  </div>\n\n  <div class=\"utrm-wrap\">\n    <div class=\"utrm-notice\">\n      <div class=\"utrm-notice-ico\">\ud83c\udfb8</div>\n      <p><strong>Wait, where's Pentakill?</strong> Riot Games Music has more acts than the three you'll find here. This codex is Riftbound lore, so a band only gets a stage once it's actually printed in Riftbound. Pentakill and friends will get their own section the moment Riot puts them on cards. We're holding their seats.</p>\n    </div>\n\n    <p class=\"utrm-tabhint\">Pick a band. Each one has its own story, videos and cards.</p>\n    <div class=\"utrm-tabs\" role=\"tablist\" id=\"utrm-tabs\"></div>\n    <div id=\"utrm-bands\"></div>\n    <section class=\"utrm-extra\" id=\"utrm-extra\"></section>\n\n    <footer class=\"utrm-foot\">\n      <p>Card text and numbers are from Riot's official Radiance card gallery. Release dates and voice credits come from Riot announcements and launch coverage.</p>\n      <p>Music videos are Riot's own uploads on the official League of Legends YouTube channel, shared here for fan and educational use.</p>\n      <p>Unraveling the Rift was created under Riot Games' \"Legal Jibber Jabber\" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.</p>\n    </footer>\n  </div>\n</div>";
  var el=document.getElementById('utr-music');
  el.style.setProperty('--utrm-bgimg','url("'+BASE+'img/music/music-bg.webp")');
  if(mount.dataset.bleed==='true') el.classList.add('utrm-bleed');

(function(){
  var root = document.getElementById('utr-music');
  if(!root) return;
  /* full-bleed: stretch edge to edge so no white page border shows */
  function sbw(){ root.style.setProperty('--utrm-sbw',(window.innerWidth-document.documentElement.clientWidth)+'px'); }
  sbw(); window.addEventListener('resize',sbw);

  var RIOT = 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/';
  var RQ = '-744x1039.png?accountingTag=RB&fm=webp&q=80&w=481';
  var JD = 'https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/codex/img/music/';
  var WIKI = 'https://wiki.leagueoflegends.com/en-us/images/thumb/';
  var HOVER = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  /* YouTube refuses to play embeds (Error 153) when the page sends no referrer.
     Some site setups strip it, so make sure this page sends the browser-default policy. */
  (function(){
    var m=document.querySelector('meta[name="referrer"]');
    if(!m){ m=document.createElement('meta'); m.name='referrer'; document.head.appendChild(m); }
    m.setAttribute('content','strict-origin-when-cross-origin');
  })();
  function canSound(){ return !!(navigator.userActivation && navigator.userActivation.hasBeenActive); }
  function yt(id,o){
    var q='rel=0&playsinline=1';
    return 'https://www.youtube.com/embed/'+id+'?'+q+o;
  }
  function frame(src,cls){return '<iframe class="'+cls+'" src="'+src+'" title="Music video" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';}
  var DOM = {Fury:'var(--utrm-fury)',Calm:'var(--utrm-calm)',Mind:'var(--utrm-mind)',Body:'var(--utrm-body)',Chaos:'var(--utrm-chaos)',Order:'var(--utrm-order)'};

  /* =========================== BANDS =========================== */
  var BANDS = [
  {
    key:'kda', name:'K/DA', tab:'K/DA', tabSub:'Pop', b1:'#ff4fa3', b2:'#8a5cff',
    tagline:`The pop act that broke the internet in 2018 and never really left. Four champions, one stage, and a fanbase that still knows every dance break.`,
    chips:[['Debut · 2018'],['Genre · K-pop / Pop'],['Radiance · Special Alt Art SP1–SP5','gold']],
    eras:[
      {y:'2018',t:'POP/STARS',p:`K/DA hit the stage at the Worlds 2018 finals in South Korea as an AR performance, then the Fortiche-animated music video dropped and did a hundred million views in about a month. Ahri, Akali, Evelynn and Kai'Sa were sung by Miyeon and Soyeon of (G)I-DLE, Madison Beer and Jaira Burns.`},
      {y:'2020',t:'THE BADDEST, MORE & ALL OUT',p:`Two years later the girls came back louder. THE BADDEST teed things up, MORE brought Seraphine into the fold with Lexie Liu on the track, and the ALL OUT EP landed in November with a TWICE collab on I'LL SHOW YOU and a whole new wardrobe.`},
      {y:'2026',t:'FIRESTARTER',p:`Six years of silence, then FIRESTARTER on October 19 with Fortiche back behind the animation. Miyeon and Soyeon return as Ahri and Akali, while Sophie Powers takes Evelynn and Mimi Webb takes Kai'Sa. A four-track EP follows on October 30, and K/DA plays the Worlds 2026 Opening Ceremony at Barclays Center on November 14.`},
      {y:'Radiance',t:'All five, finally',p:`Ahri and Kai'Sa have been in Riftbound since Origins and Akali showed up in Vendetta. Evelynn and Seraphine debut in Radiance, each with her own Legend, so this is the first set where you can finish the whole group in one binder page.`}
    ],
    videos:[
      {title:'POP/STARS',year:'2018',id:'UOxkGD8qRB4',clip:40,note:'The one that started it all.'},
      {title:'MORE',year:'2020',id:'3VTkBuxU4yk',clip:40,note:'Seraphine joins the party.'},
      {title:'FIRESTARTER',year:'2026',id:'Mmw-PpWhKFg',clip:40,note:'Fortiche is back. So are we.'}
    ],
    skins:[
      {n:'K/DA',y:'2018',p:`Ahri, Akali, Evelynn and Kai'Sa in the looks from the POP/STARS debut.`},
      {n:'K/DA ALL OUT',y:'2020',p:`Ahri, Akali, Evelynn and Kai'Sa, plus Seraphine's Ultimate skin that levels from Indie to Rising Star to Superstar as you finish her missions.`},
      {n:'Prestige K/DA',y:'Over the years',p:`Gold-trimmed Prestige Editions have rolled out for the crew across both eras.`},
      {n:'K/DA FIRESTARTER',y:'2026',p:`Brand new looks for the comeback, including Mythic skins for Evelynn and Akali.`}
    ],
    wiki:'https://wiki.leagueoflegends.com/en-us/KDA_(Universe)',
    callout:`<b>Heads up, collectors:</b> Riot also announced the Riftbound x K/DA Couture Collection, a $150 bundle with four new K/DA Legend cards, sold by drawing starting October 27. Those cards aren't in booster packs, so they'll get their own entry once we've seen them in hand.`,
    lede:`The five K/DA Special Alt Arts are numbered SP1 to SP5 of 005. Each one is a K/DA-art printing of a Radiance Champion Unit, so the regular print plays exactly the same. Tap a card to flip it.`,
    members:[
      {name:'Ahri',role:'Lead vocals',card:'Ahri, Confident',num:'RAD SP1/005',dom:'Calm',en:4,mt:4,
       img:RIOT+'e4be56cd7dc8075298567c5b28ecc3e46b87bc57'+RQ,
       fb:WIKI+'RB_card_RAD-038.png/240px-RB_card_RAD-038.png',
       text:`[Disarm] When you reduce the Might of an enemy unit here by 1 or more, give me +1 [S] this turn.`,
       voice:`Voiced by Miyeon of (G)I-DLE, from POP/STARS all the way to FIRESTARTER.`,
       notes:[`The face of the group and the fox who sells out arenas.`,`On the table she punishes shrinking. Her own Disarm knocks the defender down a point, which pumps her up a point. Any other Might cut at her battlefield triggers her again.`,`Regular print: RAD 038/167. Ahri's been in Riftbound since Origins.`]},
      {name:'Akali',role:'Rapper',card:'Akali, Brash',num:'RAD SP2/005',dom:'Fury',en:5,mt:5,
       img:RIOT+'f19416576af7d609b525d72884ca42cf8795bf74'+RQ,
       fb:WIKI+'RB_card_RAD-015.png/240px-RB_card_RAD-015.png',
       text:`The first time I move each turn, [Add] [1][A]. The second time I move each turn, banish the top card of your Main Deck. Until your next Ending Phase, you may play that card.`,
       voice:`Voiced by Soyeon of (G)I-DLE in K/DA and in True Damage.`,
       notes:[`The only member with two bands on her résumé. She left the K/DA spotlight long enough to start True Damage, then came right back.`,`On the table she wants to keep moving. First move pays her back with resources, second move steals a card off the top of your deck to play later.`,`Regular print: RAD 015/167. Akali arrived in Riftbound with Vendetta.`]},
      {name:'Evelynn',role:'Vocals',card:'Evelynn, In Control',num:'RAD SP3/005',dom:'Chaos',en:4,mt:4,
       img:RIOT+'f79b82a0a56c2e4af641beb84762abcd6b058195'+RQ,
       fb:WIKI+'RB_card_RAD-109.png/240px-RB_card_RAD-109.png',
       text:`[Disarm] (When I attack, give an enemy unit here -1 [S] this turn.) When I hold, if you control a facedown card here, score 1 point.`,
       voice:`Madison Beer sang her on POP/STARS and MORE. Sophie Powers takes the mic for FIRESTARTER.`,
       notes:[`The diva who discovered Seraphine, at least according to Seraphine's skin story.`,`On the table she turns a hidden card into a point. Hold a battlefield where you've got something facedown and the scoreboard ticks up.`,`Radiance is her Riftbound debut. She also gets a Legend, Agony's Embrace, plus Evelynn, Consuming and the spell Last Caress. Regular print: RAD 109/167.`]},
      {name:"Kai'Sa",role:'Vocals',card:"Kai'Sa, Rebel",num:'RAD SP4/005',dom:'Mind',en:5,mt:5,
       img:RIOT+'1c1bc3c006b5acf9013e98072a135ae411b2ccac'+RQ,
       fb:'https://riftdecks.com/img/cards/riftbound/RAD/rad-sp4-005_full.png|'+WIKI+'RB_card_RAD-063.png/240px-RB_card_RAD-063.png',
       text:`[Disarm] While I'm in a showdown, your spells have [Reaction].`,
       voice:`Jaira Burns sang her on POP/STARS and MORE. Mimi Webb joins as her voice on FIRESTARTER.`,
       notes:[`The dancer. Half the POP/STARS choreography fan covers are basically Kai'Sa tributes.`,`On the table she turns a spell-heavy hand into a trap. Once she's in a showdown, everything you're holding becomes instant speed.`,`Regular print: RAD 063/167. Kai'Sa's been around since Origins.`]},
      {name:'Seraphine',role:'The newcomer',card:'Seraphine, Not Alone',num:'RAD SP5/005',dom:'Order',en:5,mt:1,
       img:RIOT+'ef6f277389bbb6361ef29a0332cd2cb34d4905aa'+RQ,
       fb:'https://riftdecks.com/img/cards/riftbound/RAD/rad-sp5-005_full.png|'+WIKI+'RB_card_RAD-138.png/240px-RB_card_RAD-138.png',
       text:`When you play me or when I become exhausted, play a 1 [S] Recruit unit token to your base. I have +1 [S] for each other exhausted unit you control.`,
       voice:`Lexie Liu sang alongside her on MORE. Seraphine is credited as an artist on the ALL OUT era tracks.`,
       notes:[`Went from bedroom streamer to K/DA collaborator during the ALL OUT era. Her Ultimate skin literally tells that story.`,`On the table she's a 1-Might card that never shows up alone. She spits out Recruit tokens and grows for every other exhausted unit you've got.`,`Radiance is her Riftbound debut and she's the set's headliner, with the Legend Starry-Eyed Songstress and the spell Encore. Regular print: RAD 138/167.`]}
    ]
  },
  {
    key:'td', name:'TRUE DAMAGE', tab:'True Damage', tabSub:'Hip-hop', b1:'#19d3c5', b2:'#e8b33a',
    tagline:`The hip-hop crew Akali built when pop wasn't enough. Graffiti, gold chains, and the first Riot band ever trusted with a Worlds anthem.`,
    chips:[['Debut · 2019'],['Genre · Hip-hop'],['Radiance · Ekko Overnumber 177/167','gold']],
    eras:[
      {y:'2019',t:'GIANTS',p:`True Damage debuted live at the Worlds 2019 finals in Paris on November 10, and the GIANTS video, animated by The Line, landed on the League channel the same day and pulled about six million views in its first day. Becky G, Keke Palmer, Soyeon, Duckwrth and Thutmose brought Qiyana, Senna, Akali and Ekko to life, with Yasuo on the decks.`},
      {y:'2019–2020',t:'Couture mode',p:`Qiyana and Senna got Prestige skins designed with Louis Vuitton's Nicolas Ghesquière, and Yasuo got his own Prestige look through an AAPE collab. Streetwear and League have been best friends ever since.`},
      {y:'2023',t:'Breakout Ekko',p:`Ekko got a Mythic glow-up with Breakout True Damage Ekko, a fresh model and effects pass over his original True Damage look.`},
      {y:'2026',t:'KNOW MY NAME',p:`Seven years after GIANTS, True Damage came back to perform the Worlds 2026 anthem, the first time one of Riot's virtual bands has done it. SOYEON returns, joined by Coco Jones, Vic Mensa and Sofía Reyes, and the video follows Faker and T1's run to a three-peat. They're performing it live at the Worlds Final Opening Ceremony at Barclays Center on November 14.`}
    ],
    videos:[
      {title:'GIANTS',year:'2019',id:'sVZpHFXcFJw',clip:40,note:'The debut. Still slaps.'},
      {title:'KNOW MY NAME',year:'2026',q:'True Damage Know My Name Worlds 2026 music video',note:'The Worlds 2026 anthem.'}
    ],
    skins:[
      {n:'True Damage',y:'2019',p:`Ekko, Akali, Qiyana, Yasuo and Senna, all launched alongside GIANTS.`},
      {n:'Prestige True Damage',y:'2019–2020',p:`Qiyana and Senna in Louis Vuitton–designed looks, plus Yasuo's AAPE Prestige Edition.`},
      {n:'Breakout True Damage Ekko',y:'2023',p:`A Mythic variant of Ekko's original True Damage skin.`}
    ],
    wiki:'https://wiki.leagueoflegends.com/en-us/True_Damage_(Universe)',
    callout:`<b>Just one card so far.</b> Radiance gives True Damage a single Overnumber: Ekko, Revolutionary at 177/167. It's also the only overnumbered unit in the set outside HEARTSTEEL. The rest of the crew is waiting backstage until Riot prints their True Damage looks.`,
    lede:`One overnumbered Ekko, one crossover star, and three members who haven't gotten a True Damage card yet. Tap a card to flip it.`,
    members:[
      {name:'Ekko',role:'Rapper',card:'Ekko, Revolutionary',num:'RAD 177/167 · Overnumber',dom:'Fury',en:5,mt:4,
       img:JD+'rad-177-ekko-revolutionary.webp',
       fb:RIOT+'fb1dc5301c1dd9054e5da6d9735b8ad27ce200c4'+RQ+'|https://riftdecks.com/img/cards/riftbound/RAD/rad-177-167_full.png|'+WIKI+'RB_card_RAD-021.png/240px-RB_card_RAD-021.png',
       artist:'Grafit Studio',
       text:`I enter ready. [Assault] [Action][>] Discard 1, [1][C]: Banish me, then play me to your base, ignoring my cost.`,
       voice:`Thutmose and Duckwrth handled Ekko's verses on GIANTS.`,
       notes:[`The kid from Zaun who rewinds time between bars. He's also one of Radiance's two poster champions.`,`On the table he hits the board ready to swing, and when things go sideways he can pitch a card, banish himself and come right back to your base for free.`,`Regular print: RAD 021/167. His Legend in Radiance is Boy Who Shattered Time.`]},
      {name:'Akali',role:'Founder · Rapper',crossover:true,card:'Akali, Brash',num:'K/DA art · RAD SP2/005',dom:'Fury',en:5,mt:5,
       img:RIOT+'f19416576af7d609b525d72884ca42cf8795bf74'+RQ,
       fb:WIKI+'RB_card_RAD-015.png/240px-RB_card_RAD-015.png',
       text:`The first time I move each turn, [Add] [1][A]. The second time I move each turn, banish the top card of your Main Deck. Until your next Ending Phase, you may play that card.`,
       voice:`Soyeon voices her in both groups.`,
       notes:[`She started True Damage. Radiance dressed her in her K/DA outfit instead, so that's the art you'll see here.`,`Same card as in the K/DA tab. If Riot ever prints a True Damage Akali, it goes right here.`]},
      {name:'Qiyana',role:'Vocals',ghost:true,voice:`Voiced by Becky G on GIANTS.`,notes:[`Empress of the elements and the crew's loudest fashion statement, with that Ghesquière Prestige look.`,`No True Damage card in Radiance.`]},
      {name:'Senna',role:'Vocals',ghost:true,voice:`Voiced by Keke Palmer on GIANTS.`,notes:[`She debuted as a champion the same week True Damage did.`,`No True Damage card in Radiance.`]},
      {name:'Yasuo',role:'DJ · Producer',ghost:true,voice:`No vocalist. He's running the decks.`,notes:[`Behind the beats on GIANTS. Fans think the mystery call Yone takes in HEARTSTEEL's Live My Life video is from him.`,`No True Damage card in Radiance.`]}
    ]
  },
  {
    key:'hs', name:'HEARTSTEEL', tab:'HEARTSTEEL', tabSub:'Boy band', b1:'#ff6fae', b2:'#5c7cff',
    tagline:`Six chaotic pretty boys, one shared group chat, and a debut that went straight to Worlds. HEARTSTEEL is the newest Riot band and the best-dressed sheet in Radiance.`,
    chips:[['Debut · 2023'],['Genre · Genre-bending pop'],['Radiance · Overnumbers 178–183/167','gold']],
    eras:[
      {y:'2023',t:'PARANOIA',p:`HEARTSTEEL dropped PARANOIA on October 23, 2023 with a video from Sauvage.TV that mixes 3D animation with 2D sketches. BAEKHYUN of EXO sang Ezreal, Cal Scruby took Kayn, ØZI took Sett and tobi lou took K'Sante, while Yone produced and Aphelios wrote and played. Alune, Aphelios's sister, even pops up in the video. They took it to the Worlds 2023 opening ceremony a few weeks later.`},
      {y:'2026',t:'LIVE MY LIFE',p:`The comeback landed September 18, written and produced by Jon Bellion. BAEKHYUN is back as Ezreal, Anderson .Paak steps in as K'Sante, Connor Price as Sett and Nic D as Kayn. The video is all pickup basketball, laundry day and hanging out with the boys.`},
      {y:'Radiance',t:'The photocard sheet',p:`All six members got overnumbered cards, 178 to 183 of 167, painted by Luscinia Studio like a pack of K-pop photocards, stickers and doodles included. The Signature versions are signed with the members' own names instead of the artist's.`}
    ],
    videos:[
      {title:'PARANOIA',year:'2023',id:'MDErQ1KTzaI',clip:40,note:'The debut with the doodles.'},
      {title:'LIVE MY LIFE',year:'2026',id:'gMkuV5hh7-s',clip:40,note:'Laundry day, but make it a comeback.'}
    ],
    skins:[
      {n:'HEARTSTEEL',y:'2023',p:`Ezreal, Kayn, Aphelios, Yone, K'Sante and Sett. Kayn's is the Legendary of the set.`},
      {n:'HEARTSTEEL Live My Life',y:'2026',p:`A new Epic look for the crew, with Sett's showing up as a Battle Pass Prestige skin instead.`}
    ],
    wiki:'https://wiki.leagueoflegends.com/en-us/HEARTSTEEL_(Universe)',
    callout:`<b>Collector tip:</b> five of these six are reprints with new art, so check the collector number before you pay. "HEARTSTEEL Kayn" is RAD 182/167, while plain Kayn, Unleashed is Origins 189/298. K'Sante, Courageous is the one brand-new card, and it also has a regular print at RAD 086/167.`,
    lede:`Six Champion Units, RAD 178 to 183 of 167, all art by Luscinia Studio. Tap a card to flip it.`,
    members:[
      {name:"K'Sante",role:'Co-leader · Lead vocals',card:"K'Sante, Courageous",num:'RAD 178/167 · Overnumber',dom:'Body',en:5,mt:4,
       img:JD+'rad-178-ksante-courageous.webp', artist:'Luscinia Studio',
       fb:RIOT+'299741933964a0953312d7c2cc0919501d28bc98'+RQ+'|'+WIKI+'RB_card_RAD-086.png/240px-RB_card_RAD-086.png',
       text:`[Accelerate] [Shield 2] When I hold, channel 1 rune.`,
       voice:`tobi lou on PARANOIA, Anderson .Paak on Live My Life.`,
       notes:[`The responsible one. Somebody has to be.`,`On the table he's a wall that pays rent. Shield 2 makes him tough on defense, and every time he holds you get an extra rune.`,`This is K'Sante's first Champion Unit, and the only new card on the HEARTSTEEL sheet. Pair him with his Legend, Pride of Nazumah.`]},
      {name:'Aphelios',role:'Instrumentalist · Songwriter',card:'Aphelios, Exalted',num:'RAD 179/167 · Overnumber',dom:'Calm',en:4,mt:4,
       img:JD+'rad-179-aphelios-exalted.webp', artist:'Luscinia Studio',
       fb:RIOT+'d1ffd27d5777e08178ab9a9aad0943b8d72af98b'+RQ,
       text:`When you attach an Equipment to me, choose one that hasn't been chosen this turn — • Ready 2 runes. • Channel 1 rune exhausted. • [Buff] a friendly unit.`,
       flavor:`(ding ding ding)`,
       voice:`No vocalist. He lets the instruments talk.`,
       notes:[`The quiet genius. His sister Alune shows up in the PARANOIA video.`,`On the table every Equipment you strap on him picks a bonus: ready runes, channel a rune, or buff a friend.`,`Reprint of Spiritforged 049/221 with new art.`]},
      {name:'Ezreal',role:'Lead vocals',card:'Ezreal, Dashing',num:'RAD 180/167 · Overnumber',dom:'Mind',en:4,mt:3,
       img:JD+'rad-180-ezreal-dashing.webp', artist:'Luscinia Studio',
       fb:RIOT+'262da39c80211046e27a839c50d210d19592267c'+RQ,
       text:`When I attack or defend, deal damage equal to my Might to an enemy unit here. I don't deal combat damage. [C]: [Action] — Move me to your base.`,
       voice:`BAEKHYUN of EXO on both PARANOIA and Live My Life.`,
       notes:[`Golden boy, golden voice. His Signature has a doodled cat next to the autograph.`,`On the table he snipes instead of brawling, then dashes home before anyone can hit back.`,`Reprint of Spiritforged 082/221. Dashing, not Prodigy, got the band treatment.`]},
      {name:'Yone',role:'Producer',card:'Yone, Blademaster',num:'RAD 181/167 · Overnumber',dom:'Body',en:5,mt:5,
       img:JD+'rad-181-yone-blademaster.webp', artist:'Luscinia Studio',
       fb:RIOT+'1b40d15346ef3770703148402e875d24f5feef5b'+RQ,
       text:`[Weaponmaster] When I conquer a battlefield that was uncontrolled, deal damage equal to my Might to an enemy unit in a base.`,
       flavor:`With his passion for music now reignited, Yone is determined to take this band straight to the top.`,
       voice:`No vocalist. He's in the booth producing.`,
       notes:[`The big brother of the group, in more ways than one.`,`On the table he takes empty ground and immediately hits somebody back at their base.`,`Reprint of Spiritforged 116/221, with one line reworded from "an open battlefield" to "a battlefield that was uncontrolled."`]},
      {name:'Kayn',role:'Rapper',card:'Kayn, Unleashed',num:'RAD 182/167 · Overnumber',dom:'Chaos',en:6,mt:6,
       img:JD+'rad-182-kayn-unleashed.webp', artist:'Luscinia Studio',
       fb:RIOT+'df2fbb56c0d56c6c4e310edb17f0c2ae7a9d9e97'+RQ,
       text:`[Ganking] If I have moved twice this turn, I don't take damage.`,
       voice:`Cal Scruby on PARANOIA, Nic D on Live My Life.`,
       notes:[`The edgy one, and he has Rhaast in his head to prove it. Kayn opens PARANOIA with the first verse.`,`On the table he's a 6-Might menace that can't be touched once he's moved twice.`,`Reprint of Origins 189/298, and Kayn, Unleashed's first ever alternate printing.`]},
      {name:'Sett',role:'Co-leader · Rapper',card:'Sett, Kingpin',num:'RAD 183/167 · Overnumber',dom:'Order',en:4,mt:5,
       img:JD+'rad-183-sett-kingpin.webp', artist:'Luscinia Studio',
       fb:RIOT+'fbc2c6a0a0ea33b58c9cfbdc91c6c229b02a90da'+RQ,
       text:`[Tank] I get +1 [S] for each buffed friendly unit at my battlefield.`,
       voice:`ØZI on PARANOIA, Connor Price on Live My Life.`,
       notes:[`The Boss. His card has a #BOSS speech bubble and he would like you to notice.`,`On the table he gets bigger for every buffed friend standing next to him.`,`Reprint of Origins 240/298. Watch out for listings that mix him up with Sett, Brawler.`]}
    ]
  }
  ];

  /* ======================= helpers ======================= */
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function rules(t,dom){
    var s = esc(t).replace(/ • /g,'<br>• ');
    s = s.replace(/\[S\]/g,'<span class="utrm-sym mt" title="Might">⚔</span>')
         .replace(/\[1\]/g,'<span class="utrm-sym en" title="1 Energy">1</span>')
         .replace(/\[A\]/g,'<span class="utrm-sym any" title="Power of any domain">A</span>')
         .replace(/\[C\]/g,'<span class="utrm-sym pw" title="'+dom+' power">'+(dom.charAt(0)||'C')+'</span>')
         .replace(/\[&gt;\]/g,' <span class="utrm-sym ex" title="Exhaust">⟳</span> ')
         .replace(/\[([A-Za-z][A-Za-z ]*\d?)\]/g,'<span class="utrm-kw">$1</span>');
    return s;
  }

  function cardHTML(m){
    var doms=(m.dom||'').split('/'), dc=DOM[doms[0]]||'#9aa0a6', h='';
    h+='<button class="utrm-flip'+(m.wide?' utrm-wide':'')+'" aria-label="Flip '+esc(m.card)+'" style="--dom:'+dc+'"><div class="utrm-flip-in">';
    h+='<div class="utrm-face utrm-front"><img loading="lazy" alt="'+esc(m.card)+' card art" src="'+m.img+'"'+(m.fb?' data-fb="'+m.fb+'"':'')+'>';
    h+='<span class="utrm-alt">'+esc(m.card)+'<small style="font:400 11px Sora,sans-serif;opacity:.8;margin-top:6px">'+esc(m.num)+'</small></span><span class="utrm-hint">Tap to flip</span></div>';
    h+='<div class="utrm-face utrm-back"><h6>'+esc(m.card)+'</h6><div class="utrm-stats">';
    doms.forEach(function(d){ if(d) h+='<span class="utrm-stat dom" style="background:'+(DOM[d]||'#9aa0a6')+'">'+esc(d)+'</span>'; });
    if(m.en!=null) h+='<span class="utrm-stat">Energy '+m.en+'</span>';
    if(m.mt!=null) h+='<span class="utrm-stat">Might '+m.mt+'</span>';
    h+='<span class="utrm-stat">'+esc(m.type||'Champion Unit')+'</span></div>';
    h+='<div class="utrm-rules">'+rules(m.text,doms[0]||'')+'</div>';
    if(m.flavor) h+='<div class="utrm-flavor">'+esc(m.flavor)+'</div>';
    h+='<div class="utrm-num">'+esc(m.num)+(m.artist?' · Art: '+esc(m.artist):'')+'</div></div>';
    h+='</div></button>';
    return h;
  }

  /* ======================= ticker ======================= */
  var songs=['POP/STARS','THE BADDEST','MORE','ALL OUT','FIRESTARTER','GIANTS','KNOW MY NAME','PARANOIA','LIVE MY LIFE'];
  var tk='';for(var r=0;r<2;r++){songs.forEach(function(s){tk+='<span>'+s+'</span><i>♪</i>';});}
  document.getElementById('utrm-ticker').innerHTML=tk;

  /* ===================== MORE MUSIC IN RADIANCE ===================== */
  var STAGE = {card:'Packed Amphitheater',num:'RAD 184/167 · Ultimate Rare',type:'Battlefield',dom:'',
    img:JD+'rad-184-packed-amphitheater.webp',fb:RIOT+'a6d9ad1a2a165e5e6b5cb1e7d8133e544cf9b0b1-1039x744.png?accountingTag=RB&fm=webp&q=80&w=490',
    wide:true,artist:'Fish Art Studio',text:`Champion units here have +1 [S].`};
  var EXTRA = [
    {card:'Starry-Eyed Songstress',num:'RAD 151/167 · Rare',type:'Legend',dom:'Mind/Order',artist:'Naifan Zhang',
     img:JD+'rad-151-starry-eyed-songstress.webp',fb:RIOT+'399262205b15aa3b6306eb1d80a308791dcbe2ca'+RQ,
     text:`As an additional cost to play a spell, you may exhaust me and three friendly units to reduce the cost of that spell by 2.`,
     tags:['Seraphine','Legend'],blurb:`Seraphine's Legend and the face of the set. The whole deck is about getting the crowd up on its feet, then cashing that in for cheap spells. The overnumber is 174/167, and there are two signed versions, 174* in English and a China-only 174a* with completely different art.`},
    {card:'Encore',num:'RAD 152/167 · Epic',type:'Signature Spell',dom:'Mind/Order',en:3,artist:'Luscinia Studio',
     img:JD+'rad-152-encore.webp',fb:RIOT+'0200aeca5d0a1cca4b8ab5b3f3910207118ee4e4-744x1040.png?accountingTag=RB&fm=webp&q=80&w=481',
     text:`Choose two — • Deal 2 to a unit. • Play two 1 [S] Recruit unit tokens. • Give up to two units each +1 [S] this turn. • Look at the top 2 cards of your Main Deck, draw 1 and recycle the other.`,
     tags:['Seraphine','Signature'],blurb:`One more song! Seraphine's signature spell is a pick-two menu, and the art is her mid-note with the mic.`},
    {card:'Seraphine, Inspiring',num:'RAD 065/167 · Rare',dom:'Mind',en:4,mt:3,artist:'Luscinia Studio',
     img:JD+'rad-065-seraphine-inspiring.webp',fb:RIOT+'60e0711c64958cc3a59a3bd3bf4c013758b1b92b'+RQ,
     text:`[Disarm 2] (When I attack, give an enemy unit here -2 [S] this turn.) Once each turn, when you exhaust three or more friendly units at the same time, you may draw 1.`,
     flavor:`"Hello, world! I'm Seraphine, and you are beautiful!"`,
     tags:['Seraphine','Bedroom era'],blurb:`Back before the big stages: Seraphine in her room with a lyre and a Poro watching. Very ALL OUT "Indie" form energy. There's also a showcase alt art at 065a.`},
    {card:'Seraphine, Not Alone',num:'RAD 138/167 · Epic',dom:'Order',en:5,mt:1,artist:'Pixelverse',
     img:JD+'rad-138-seraphine-not-alone.webp',fb:RIOT+'756f0d5d9e83ba0ebcfaf1b69055fdc29458b084'+RQ,
     text:`When you play me or when I become exhausted, play a 1 [S] Recruit unit token to your base. I have +1 [S] for each other exhausted unit you control.`,
     flavor:`"I sing to help them find themselves. The stage just makes it easier."`,
     tags:['Seraphine','Same card as K/DA SP5'],blurb:`The regular print of the card that also got the K/DA treatment at SP5. Here she's in full concert mode with fireworks behind her.`},
    {card:'Seraphine, Not Alone',num:'RAD 138a/167 · Alt Art',dom:'Order',en:5,mt:1,artist:'J1nyuu',
     img:JD+'rad-138a-seraphine-not-alone.webp',fb:RIOT+'c2e2bcf79a41ff7e524dfcb4b4a1304a77b87711'+RQ,
     text:`When you play me or when I become exhausted, play a 1 [S] Recruit unit token to your base. I have +1 [S] for each other exhausted unit you control.`,
     flavor:`She's going to listen to her audience and let the musical current take her.`,
     tags:['Seraphine','Alt art'],blurb:`The beach-show version: sunglasses up, mic in hand, a treble clef and a crab cameo. Three ways to own one Seraphine card.`},
    {card:'High Note',num:'RAD 048/167 · Common',type:'Spell',dom:'Mind',en:3,artist:'Kudos Productions',
     img:JD+'rad-048-high-note.webp',fb:RIOT+'afba3669ea1063dafb0e4c2c766694e00540eb13'+RQ,
     text:`[Reaction] (Play any time, even before spells and abilities resolve.) Give a unit -[S] this turn equal to the number of exhausted units you control.`,
     flavor:`"This one's for you!" —Seraphine`,
     tags:['Seraphine on stage'],blurb:`Seraphine hitting the big note with the crowd's hands up. The more of your team that's tapped out, the harder it hits.`},
    {card:'Raucous Anthem',num:'RAD 134/167 · Rare',type:'Spell',dom:'Order',en:7,artist:'Kudos Productions',
     img:JD+'rad-134-raucous-anthem.webp',fb:RIOT+'0c307d5f4785efc4f0a4c8e486b53735f8cf04aa'+RQ,
     text:`Ready your units and give them +3 [S] this turn.`,flavor:`Make them remember you.`,
     tags:['Drum solo'],blurb:`A goggled drummer going full arena rock in green light. Seven energy to ready the whole team and send everyone in at +3.`},
    {card:'Concert Poster',num:'RAD 116/167 · Common',type:'Gear',dom:'Order',en:1,artist:'Yeon Art Studio / Anna Nikonova',
     img:JD+'rad-116-concert-poster.webp',fb:RIOT+'0e80322dac6065e3ee726f5f9a2650a88195a44c'+RQ,
     text:`[Deploy] (Play this only to a battlefield. When an opponent holds here, kill this.) When you play this or when you conquer here, you may pay [1] to play a 1 [S] Recruit unit token to your base.`,
     flavor:`Nothing draws a crowd like a crowd.`,
     tags:['Seraphine merch'],blurb:`Fans crowding around a framed Seraphine poster. In play it's a Gear that keeps turning into more fans for your board.`},
    {card:'Ziggs, Short-Fused',num:'RAD 023a/167 · Alt Art',dom:'Fury',en:5,mt:5,artist:'Ziyan Lin',
     img:JD+'rad-023a-ziggs-short-fused.webp',fb:RIOT+'2a3e03a41522fde7f458fae1fdb72c6224cf4202'+RQ,
     text:`When you play me, play a Bomb gear token to a battlefield. Abilities of friendly gear deal 1 Bonus Damage.`,
     flavor:`Dropping the bass so hard it blows the gate.`,
     tags:['Not in a band','DJ Ziggs'],blurb:`No band, no problem. Ziggs got a headphones-and-mic alt art and is clearly the opening act nobody booked.`}
  ];

  function renderExtra(){
    var x=document.getElementById('utrm-extra'); if(!x) return;
    var h='<h3 class="utrm-extra-title">More Music in Radiance</h3>';
    h+='<p class="utrm-extra-sub">Not every music card in the set belongs to a band. Here are the rest of the songs, stages and fan moments Radiance printed.</p>';
    h+='<div class="utrm-stage"><div>'+cardHTML(STAGE)+'</div><div>';
    h+='<h4>Packed Amphitheater</h4><div class="utrm-role">Ultimate Rare · Battlefield</div>';
    h+='<p>This is the venue, and it\'s only the second Ultimate Rare Riftbound has ever printed. Riot says it shows up in about 0.025% of Radiance packs on average, so roughly one in four thousand. The regular version is the Uncommon at 164/167, and the Ultimate at 184/167 gets a full iridescent finish.</p>';
    h+='<p>The art reads like someone filming the show on a camera: a timecode, a battery meter and focus marks over a sold-out amphitheater with light shards blasting off the stage.</p>';
    h+='<p><b style="color:var(--utrm-gold2)">So whose concert is it?</b> Nobody can tell you for sure. Riot hasn\'t said who\'s on that stage, and the card doesn\'t name a band. Some fans call it "the K/DA amphitheater" and others swear it\'s somebody else, but there\'s nothing official either way. Until Riot says something, it\'s every band\'s show.</p>';
    h+='<span class="utrm-tag">Battlefield</span><span class="utrm-tag">Ultimate Rare</span><span class="utrm-tag">Mystery headliner</span></div></div>';
    h+='<div class="utrm-members">';
    EXTRA.forEach(function(m){
      h+='<article class="utrm-mem">'+cardHTML(m)+'<div class="utrm-mem-body"><h5 class="utrm-mem-name">'+esc(m.card)+'</h5><div class="utrm-role">'+esc(m.num)+'</div><div>';
      (m.tags||[]).forEach(function(t){h+='<span class="utrm-tag">'+esc(t)+'</span>';});
      h+='</div><p style="margin:4px 0 0;font-size:13.5px;color:#d9d0e6">'+esc(m.blurb)+'</p></div></article>';
    });
    h+='</div>';
    x.innerHTML=h;
  }

  /* ======================= render ======================= */
  var tabs=document.getElementById('utrm-tabs'), wrap=document.getElementById('utrm-bands');
  BANDS.forEach(function(b,i){
    var bt=document.createElement('button');
    bt.className='utrm-tab'; bt.setAttribute('role','tab'); bt.setAttribute('aria-selected',i===0?'true':'false');
    bt.style.setProperty('--b1',b.b1); bt.style.setProperty('--b2',b.b2);
    bt.innerHTML=esc(b.tab)+'<small>'+esc(b.tabSub)+'</small>';
    bt.addEventListener('click',function(){show(b.key);});
    bt.dataset.key=b.key; tabs.appendChild(bt);

    var sec=document.createElement('section');
    sec.className='utrm-band'+(i===0?' utrm-on':''); sec.id='utrm-'+b.key;
    sec.style.setProperty('--b1',b.b1); sec.style.setProperty('--b2',b.b2);

    var h='';
    h+='<div class="utrm-banner"><h3 class="utrm-band-name">'+esc(b.name)+'</h3><p class="utrm-tagline">'+esc(b.tagline)+'</p><div class="utrm-chips">';
    b.chips.forEach(function(c){h+='<span class="utrm-chip '+(c[1]||'')+'">'+esc(c[0])+'</span>';});
    h+='</div></div>';

    h+='<h4 class="utrm-h">The Story So Far</h4><div class="utrm-timeline">';
    b.eras.forEach(function(e){h+='<div class="utrm-era"><div class="utrm-era-year">'+esc(e.y)+'</div><h4>'+esc(e.t)+'</h4><p>'+esc(e.p)+'</p></div>';});
    h+='</div>';

    h+='<h4 class="utrm-h">Music Videos</h4>'+(HOVER?'<p class="utrm-lede">Hover a video for a 20-second clip. Browsers keep clips silent until you\'ve clicked somewhere on the page, so tap a band tab first and the clips play with sound. Click a video to watch the whole thing.</p>':'')+'<div class="utrm-vids">';
    b.videos.forEach(function(v){
      if(v.id){
        h+='<div class="utrm-vid"><div class="utrm-vid-frame" role="button" tabindex="0" data-yt="'+v.id+'" data-clip="'+(v.clip||30)+'" aria-label="Play '+esc(v.title)+'"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg"><span class="utrm-play"><b>▶</b></span><span class="utrm-badge">'+(HOVER?'Hover for a clip':'Tap to play')+'</span></div>';
      } else {
        h+='<div class="utrm-vid"><a class="utrm-vid-frame" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query='+encodeURIComponent(v.q)+'"><span class="utrm-vid-poster"><strong>'+esc(v.title)+'</strong><em>Watch on YouTube ↗</em></span></a>';
      }
      h+='<div class="utrm-vid-meta"><h5>'+esc(v.title)+' · '+esc(v.year)+'</h5><p>'+esc(v.note)+'</p>'+(v.id?'<a target="_blank" rel="noopener" href="https://www.youtube.com/watch?v='+v.id+'">Open on YouTube ↗</a>':'')+'</div></div>';
    });
    h+='</div>';

    h+='<h4 class="utrm-h">Skin Closet</h4><div class="utrm-skins">';
    b.skins.forEach(function(s){h+='<div class="utrm-skin"><span>'+esc(s.y)+'</span><h5>'+esc(s.n)+'</h5><p>'+esc(s.p)+'</p></div>';});
    h+='</div><a class="utrm-wiki" target="_blank" rel="noopener" href="'+b.wiki+'">See every splash on the League of Legends Wiki ↗</a>';

    h+='<div class="utrm-callout">'+b.callout+'</div>';

    h+='<h4 class="utrm-h">The Members</h4><p class="utrm-lede">'+esc(b.lede)+'</p><div class="utrm-members">';
    b.members.forEach(function(m){
      h+='<article class="utrm-mem">';
      if(m.ghost){
        h+='<div class="utrm-ghost"><b>'+esc(m.name)+'</b><span>Waiting backstage. No True Damage card in Radiance yet.</span></div>';
      } else {
        h+=cardHTML(m);
      }
      h+='<div class="utrm-mem-body"><h5 class="utrm-mem-name">'+esc(m.name)+'</h5><div class="utrm-role">'+esc(m.role)+'</div><ul>';
      m.notes.forEach(function(n){h+='<li>'+esc(n)+'</li>';});
      h+='</ul><p class="utrm-voice">🎤 '+esc(m.voice)+'</p></div></article>';
    });
    h+='</div>';

    sec.innerHTML=h; wrap.appendChild(sec);
  });

  renderExtra();

  function show(k){
    [].forEach.call(tabs.children,function(t){t.setAttribute('aria-selected',t.dataset.key===k?'true':'false');});
    [].forEach.call(wrap.children,function(s){s.classList.toggle('utrm-on',s.id==='utrm-'+k);});
  }

  /* flip cards */
  root.addEventListener('click',function(e){
    var f=e.target.closest('.utrm-flip'); if(f){f.classList.toggle('utrm-flipped');return;}
    var v=e.target.closest('.utrm-vid-frame[data-yt]');
    if(v && !v.dataset.full){
      v.dataset.full='1';
      v.innerHTML=frame(yt(v.dataset.yt,'&autoplay=1'),'utrm-full');
    }
  });

  root.addEventListener('keydown',function(e){ var v=e.target.closest&&e.target.closest('.utrm-vid-frame[data-yt]'); if(v&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); v.click(); } });

  /* hover preview: a muted clip from partway into the song (browsers block sound until you click) */
  if(HOVER){
    [].forEach.call(root.querySelectorAll('.utrm-vid-frame[data-yt]'),function(v){
      var t;
      v.addEventListener('mouseenter',function(){
        if(v.dataset.full) return;
        t=setTimeout(function(){
          if(v.dataset.full||v.querySelector('.utrm-prev')) return;
          var c=+v.dataset.clip||30;
          v.insertAdjacentHTML('beforeend',frame(yt(v.dataset.yt,'&autoplay=1&mute='+(canSound()?0:1)+'&controls=0&start='+c+'&end='+(c+20)),'utrm-prev'));
        },250);
      });
      v.addEventListener('mouseleave',function(){
        clearTimeout(t);
        var p=v.querySelector('.utrm-prev'); if(p) p.remove();
      });
    });
  }

  /* image fallback: if band art fails, show main-set art and say so */
  [].forEach.call(root.querySelectorAll('.utrm-front img'),function(img){
    function fail(){
      var list=(img.dataset.fb||'').split('|').filter(Boolean), i=+(img.dataset.step||0);
      if(i<list.length){ img.dataset.step=i+1; img.src=list[i]; }
      else { img.parentNode.classList.add('utrm-noimg'); }
    }
    img.addEventListener('error',fail);
    if(img.complete && img.naturalWidth===0 && img.getAttribute('src')) fail();
  });
})();

})();
