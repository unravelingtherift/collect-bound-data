/* Unraveling the Rift - quiz + membership hooks. Everything is namespaced utrq-. */
(function(){
'use strict';
if(window.__utrq) return; window.__utrq=true;
var RAW='https://raw.githubusercontent.com/unravelingtherift/collect-bound-data/main/';
var LINKS={patreon:'https://www.patreon.com/c/UnravelingtheRift',tracker:'/collection-bound/tracker',member:'/membership-page'};
var STD=['Ionia','Demacia','Zaun','Noxus','Freljord','Shurima','Piltover','Mount Targon','Bilgewater','The Void','Ixtal','Bandle City','Shadow Isles'];
var css='\
.utrq-ov{position:fixed;inset:0;z-index:2147482500;background:rgba(5,4,10,.82);display:none;align-items:center;justify-content:center;padding:16px;font-family:Sora,Inter,system-ui,sans-serif}\
.utrq-ov.utrq-on{display:flex}\
.utrq-box{position:relative;width:min(640px,100%);max-height:calc(100vh - 32px);overflow:auto;background:linear-gradient(180deg,#171428,#0e0c1a);border:1px solid rgba(233,196,106,.55);border-radius:18px;padding:26px 24px 22px;color:#f3efe3;box-shadow:0 24px 70px rgba(0,0,0,.7)}\
.utrq-x{position:absolute;right:12px;top:10px;background:none;border:0;color:#cfc8b5;font-size:1.6rem;cursor:pointer;line-height:1;padding:6px 10px}\
.utrq-eyebrow{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:#e9c46a}\
.utrq-h{font-family:Georgia,serif;font-size:1.5rem;margin:6px 0 10px;color:#fff3d1}\
.utrq-bar{height:5px;border-radius:5px;background:rgba(255,255,255,.1);margin:10px 0 18px;overflow:hidden}\
.utrq-bar i{display:block;height:100%;background:linear-gradient(90deg,#e9c46a,#5bbfae);width:0;transition:width .3s}\
.utrq-q{font-size:1.12rem;line-height:1.5;margin:0 0 16px}\
.utrq-opts{display:grid;gap:10px}\
.utrq-opt{text-align:left;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.16);color:#f3efe3;border-radius:12px;padding:13px 16px;font:inherit;font-size:1rem;cursor:pointer;transition:background .15s,border-color .15s}\
.utrq-opt:hover:not(:disabled){border-color:#e9c46a;background:rgba(233,196,106,.1)}\
.utrq-opt:disabled{cursor:default}\
.utrq-opt.utrq-right{border-color:#5bd6a0;background:rgba(91,214,160,.16)}\
.utrq-opt.utrq-wrong{border-color:#e5655f;background:rgba(229,101,95,.16)}\
.utrq-fb{margin:14px 0 0;font-size:.95rem;color:#dcd6c4;line-height:1.5;min-height:1.4em}\
.utrq-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;align-items:center}\
.utrq-btn{background:#e9c46a;color:#1a1408 !important;border:0;border-radius:999px;padding:11px 22px;font:inherit;font-weight:700;font-size:.95rem;cursor:pointer;text-decoration:none;display:inline-block}\
.utrq-btn.utrq-ghost{background:transparent;color:#fff3d1 !important;border:1px solid rgba(233,196,106,.7)}\
.utrq-score{font-size:2.6rem;font-family:Georgia,serif;color:#e9c46a;margin:2px 0}\
.utrq-cta{margin-top:18px;padding:16px;border-radius:14px;border:1px solid rgba(233,196,106,.4);background:rgba(233,196,106,.07);line-height:1.55;font-size:.96rem}\
.utrq-cta b{color:#fff3d1}\
.utrq-pop{position:fixed;left:50%;bottom:84px;transform:translate(-50%,20px);width:min(460px,calc(100vw - 24px));z-index:2147482400;background:linear-gradient(180deg,#1a1630,#0e0c1a);border:1px solid rgba(233,196,106,.65);border-radius:16px;padding:18px 18px 16px;color:#f3efe3;font-family:Sora,Inter,system-ui,sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.65);opacity:0;pointer-events:none;transition:opacity .3s,transform .3s}\
.utrq-pop.utrq-on{opacity:1;pointer-events:auto;transform:translate(-50%,0)}\
.utrq-pop h4{margin:0 0 6px;font-family:Georgia,serif;font-size:1.15rem;color:#fff3d1}\
.utrq-pop p{margin:0 0 12px;font-size:.93rem;line-height:1.55}\
.utrq-open{background:transparent;color:#fff3d1;border:1px solid rgba(233,196,106,.7);border-radius:999px;padding:9px 18px;font:inherit;font-weight:600;cursor:pointer}\
.utrq-open:hover{background:rgba(233,196,106,.12)}\
#urtr-cta{box-sizing:border-box;margin:0 auto;max-width:1100px;padding:26px 30px;display:flex;align-items:center;justify-content:space-between;gap:26px 40px;background:#150C26;border:1px solid rgba(243,212,136,.28);border-left:4px solid #F3D488;border-radius:8px;color:#F4EBDD;font-family:\'Spectral\',Georgia,serif}\
#urtr-cta *{box-sizing:border-box}\
#urtr-cta .urtr-cta-title{margin:0;font-family:\'Cinzel\',Georgia,serif;font-weight:700;font-size:1.35rem;line-height:1.25;color:#F3D488}\
#urtr-cta .urtr-cta-text{margin:8px 0 0;font-size:1.05rem;line-height:1.6}\
#urtr-cta .urtr-cta-btns{display:flex;flex-wrap:wrap;gap:12px;flex-shrink:0}\
#urtr-cta a.urtr-btn{display:inline-block;padding:14px 22px;border-radius:4px;font-family:\'Cinzel\',Georgia,serif;font-weight:700;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;text-align:center}\
#urtr-cta a.urtr-btn-gold{background:#F3D488;color:#1A1030;border:1px solid #F3D488}\
#urtr-cta a.urtr-btn-gold:hover{background:#FBE5AD}\
#urtr-cta a.urtr-btn-ghost{background:transparent;color:#F4EBDD;border:1px solid rgba(244,235,221,.5)}\
#urtr-cta a.urtr-btn-ghost:hover{border-color:#F3D488;color:#F3D488}\
.utrq-bwrap{padding:0 16px;margin:34px 0}\
@media (max-width:760px){#urtr-cta{flex-direction:column;align-items:stretch;padding:22px 20px}#urtr-cta .urtr-cta-btns{flex-direction:column}}\
@media(max-width:520px){.utrq-box{padding:22px 16px 18px}.utrq-pop{bottom:76px}}\
@media(prefers-reduced-motion:reduce){.utrq-bar i,.utrq-pop{transition:none}}';
var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

function el(t,c,h){var e=document.createElement(t); if(c) e.className=c; if(h!=null) e.innerHTML=h; return e;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function shuf(a){a=a.slice(); for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;} return a;}
function jget(u){return fetch(u).then(function(r){ if(!r.ok) throw new Error(u); return r.json(); });}

/* ---------- question builders ---------- */
/* Return visitors lean toward questions they have not seen, but older ones still come back now and then. */
function seenGet(mode){ try{ return JSON.parse(localStorage.getItem('utrq-seen-'+mode)||'{}')||{}; }catch(e){ return {}; } }
function seenSave(mode,m){ try{ var k=Object.keys(m); if(k.length>1500){ k.sort(function(x,y){return m[x]-m[y];}).slice(0,k.length-1500).forEach(function(x){delete m[x];}); } localStorage.setItem('utrq-seen-'+mode,JSON.stringify(m)); }catch(e){} }
function lean(list,seen){
  var a=list.map(function(q){return {q:q,t:seen[q.id]||0,r:Math.random()};}).sort(function(p,q){return p.t-q.t||p.r-q.r;});
  var n=Math.max(1,a.length); a.forEach(function(o,i){ o.k=i/n+Math.random()*.7; });
  return a.sort(function(p,q){return p.k-q.k;}).map(function(o){return o.q;});
}
/* groups = {type:[questions]}: pick n, rotating through the types so a quiz always mixes them. */
function pickMixed(groups,n,mode){
  var seen=seenGet(mode), types=shuf(Object.keys(groups)), order={};
  types.forEach(function(t){ order[t]=lean(groups[t],seen); });
  var out=[], guard=0;
  while(out.length<n && guard++<500){
    var progressed=false;
    for(var i=0;i<types.length&&out.length<n;i++){ var q=order[types[i]].shift(); if(q){ out.push(q); progressed=true; } }
    if(!progressed) break;
  }
  var now=Date.now(); out.forEach(function(q){ seen[q.id]=now; }); seenSave(mode,seen);
  return shuf(out);
}
function opts4(right,pool,n){ var w=shuf(pool.filter(function(x){return x!==right;})).slice(0,(n||4)-1), o=shuf([right].concat(w)); return {o:o,c:o.indexOf(right)}; }
function nameMask(text,name){ var nm=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); return text.replace(new RegExp(nm,'gi'),'this Legend'); }

function buildLore(champs){
  var G={region:[],title:[],clue:[],from:[],story:[]};
  var names=champs.map(function(c){return c.name;});
  champs.forEach(function(c){
    var std=STD.indexOf(c.region)>-1, o;
    if(std){
      o=opts4(c.region,STD);
      G.region.push({id:'region:'+c.id,q:'Which region is <b>'+esc(c.name)+'</b> from?',a:o.o,c:o.c,note:esc(c.name)+', '+esc(c.title||'')+', is from '+esc(c.region)+'.',img:c.img});
      var same=champs.filter(function(x){return x.region===c.region;}).map(function(x){return x.name;});
      var other=champs.filter(function(x){return x.region!==c.region&&STD.indexOf(x.region)>-1;}).map(function(x){return x.name;});
      o=opts4(c.name,other.concat([c.name]));
      G.from.push({id:'from:'+c.id,q:'Which of these Legends is from <b>'+esc(c.region)+'</b>?',a:o.o,c:o.c,note:esc(c.name)+' is from '+esc(c.region)+'.',img:c.img});
    }
    if(c.title){
      o=opts4(c.name,names);
      G.title.push({id:'title:'+c.id,q:'Which Legend is known as <b>“'+esc(c.title)+'”</b>?',a:o.o,c:o.c,note:esc(c.name)+' is '+esc(c.title)+'.',img:c.img});
    }
    if(c.cliffnote){
      o=opts4(c.name,names);
      G.clue.push({id:'clue:'+c.id,q:'Who is this? <i>'+esc(nameMask(c.cliffnote,c.name))+'</i>',a:o.o,c:o.c,note:'That is '+esc(c.name)+(c.title?', '+esc(c.title):'')+'.',img:c.img});
    }
    if(c.lore){
      var first=String(c.lore).split(/(?<=[.!?])\s+/)[0]||'';
      if(first.length>40&&first.length<260){
        o=opts4(c.name,names);
        G.story.push({id:'story:'+c.id,q:'Whose story starts like this? <i>'+esc(nameMask(first,c.name))+'</i>',a:o.o,c:o.c,note:'That is '+esc(c.name)+(c.title?', '+esc(c.title):'')+'.',img:c.img});
      }
    }
  });
  Object.keys(G).forEach(function(k){ if(!G[k].length) delete G[k]; });
  return pickMixed(G,10,'lore');
}

/* The Music quiz is built from the live Music tab data, so new bands, members, songs and cards
   show up as questions on their own. If that data can't be read it falls back to music-quiz.json. */
function readBands(js){
  var a=js.indexOf('var BANDS = ['); if(a<0) throw new Error('no bands');
  var b=js.indexOf('\n  ];',a); if(b<0) throw new Error('no end');
  var code=js.slice(a,b+5)+'\nreturn BANDS;';
  return (new Function('RIOT','RQ','WIKI','JD',code))('','','','');
}
function buildMusicFromBands(bands){
  var G={band:[],role:[],song:[],year:[],domain:[],card:[],cost:[]};
  var DOMS=['Fury','Calm','Mind','Body','Chaos','Order'];
  var allMembers=[], cardsSeen={}, songs=[], years={};
  bands.forEach(function(b){ (b.members||[]).forEach(function(m){ allMembers.push(m.name); }); (b.videos||[]).forEach(function(v){ songs.push({t:v.title,y:String(v.year),b:b.name}); years[v.year]=1; }); });
  var bandNames=bands.map(function(b){return b.name;}), yearList=Object.keys(years), o;
  bands.forEach(function(b){
    var mine=(b.members||[]);
    mine.forEach(function(m){
      var inBands=bands.filter(function(x){return (x.members||[]).some(function(y){return y.name===m.name;});});
      if(inBands.length===1){ o=opts4(b.name,bandNames,Math.min(4,bandNames.length)); G.band.push({id:'band:'+m.name,q:'Which group is <b>'+esc(m.name)+'</b> in?',a:o.o,c:o.c,note:esc(m.name)+' is in '+esc(b.name)+'.'}); }
      var sameRole=mine.filter(function(y){return y.role===m.role;}).length;
      if(m.role&&sameRole===1&&mine.length>2){ o=opts4(m.name,allMembers.filter(function(n,i,a){return a.indexOf(n)===i;})); G.role.push({id:'role:'+b.name+':'+m.name,q:'In <b>'+esc(b.name)+'</b>, who is the <b>'+esc(String(m.role).toLowerCase())+'</b>?',a:o.o,c:o.c,note:esc(m.name)+' is the '+esc(String(m.role).toLowerCase())+' in '+esc(b.name)+'.'}); }
      if(m.card&&!cardsSeen[m.card]){
        cardsSeen[m.card]=1;
        if(m.dom&&DOMS.indexOf(m.dom)>-1){ o=opts4(m.dom,DOMS); G.domain.push({id:'domain:'+m.card,q:'Which domain is <b>'+esc(m.card)+'</b> in Riftbound?',a:o.o,c:o.c,note:esc(m.card)+' is a '+esc(m.dom)+' card.'}); }
        if(m.text&&m.text.length>25){ o=opts4(m.name,allMembers.filter(function(n,i,a){return a.indexOf(n)===i;})); G.card.push({id:'card:'+m.card,q:'Which member’s card says: <i>“'+esc(m.text.replace(new RegExp(m.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'),'this member'))+'”</i>',a:o.o,c:o.c,note:'That is '+esc(m.card)+'.'}); }
        if(typeof m.en==='number'){ var nums=['1','2','3','4','5','6','7']; o=opts4(String(m.en),nums); G.cost.push({id:'cost:'+m.card,q:'What is the Energy cost of <b>'+esc(m.card)+'</b>?',a:o.o,c:o.c,note:esc(m.card)+' costs '+m.en+' Energy.'}); }
      }
    });
  });
  songs.forEach(function(sg){
    o=opts4(sg.b,bandNames,Math.min(4,bandNames.length)); G.song.push({id:'song:'+sg.t,q:'Which group released <b>'+esc(sg.t)+'</b>?',a:o.o,c:o.c,note:esc(sg.t)+' is a '+esc(sg.b)+' song ('+esc(sg.y)+').'});
    if(yearList.length>=3){ var yo=opts4(sg.y,yearList); G.year.push({id:'year:'+sg.t,q:'What year did <b>'+esc(sg.b)+'</b> put out <b>'+esc(sg.t)+'</b>?',a:yo.o,c:yo.c,note:esc(sg.t)+' came out in '+esc(sg.y)+'.'}); }
  });
  Object.keys(G).forEach(function(k){ if(!G[k].length) delete G[k]; });
  return G;
}
function buildMusic(d){
  /* fallback bank (music-quiz.json): shuffled, with the same "lean toward unseen" rule */
  var qs=d.questions.map(function(x,i){ var right=x.a[x.c], opts=shuf(x.a); return {id:'bank:'+i,q:esc(x.q),a:opts,c:opts.indexOf(right),note:esc(x.note||'')}; });
  return pickMixed({bank:qs},10,'music');
}
function loadMusic(){
  return fetch(RAW+'codex/music/music-tab.js').then(function(r){ if(!r.ok) throw new Error('music'); return r.text(); })
    .then(function(js){ var G=buildMusicFromBands(readBands(js)); var total=0; Object.keys(G).forEach(function(k){total+=G[k].length;}); if(total<12) throw new Error('thin'); return pickMixed(G,10,'music'); })
    .catch(function(){ return jget(RAW+'codex/quiz/music-quiz.json').then(buildMusic); });
}

/* ---------- membership pieces ---------- */
function ctaHTML(){
  if(window.UTRQ_NOMEMBER) return '';
  return '<div class="utrq-cta"><b>Enjoying the lore?</b> Patreon backers get sneak peeks at what’s coming next. '
   +'<b>Collecting?</b> The tracker is free to start, with paid tiers if you want promos and regional variants.'
   +'<div class="utrq-row"><a class="utrq-btn" href="'+LINKS.patreon+'" target="_blank" rel="noopener">Join on Patreon</a>'
   +'<a class="utrq-btn utrq-ghost" href="'+LINKS.tracker+'">Start tracking</a>'
   +'<a class="utrq-btn utrq-ghost" href="'+LINKS.member+'">Membership options</a></div></div>';
}

/* ---------- quiz overlay ---------- */
var ov=null, box=null, state=null, cache={};
function ensureOv(){
  if(ov) return;
  ov=el('div','utrq-ov'); ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
  box=el('div','utrq-box'); ov.appendChild(box); document.body.appendChild(ov);
  ov.addEventListener('click',function(e){ if(e.target===ov) closeQ(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&ov.classList.contains('utrq-on')) closeQ(); });
}
function closeQ(){ ov.classList.remove('utrq-on'); document.body.style.overflow=state&&state.prevOv||''; if(state&&state.opener) try{state.opener.focus();}catch(e){} }
function load(mode){
  if(cache[mode]) return Promise.resolve(cache[mode]);
  var p=mode==='lore'?jget(RAW+'codex/champs.json').then(buildLore):loadMusic();
  return p;
}
function openQ(mode,opener){
  ensureOv();
  var meta=mode==='lore'?{t:'Lore quiz',i:'Ten questions on Legends, their titles and where they come from.'}:{t:'Music quiz',i:'K/DA, True Damage and HEARTSTEEL.'};
  state={mode:mode,i:0,score:0,qs:null,opener:opener,prevOv:document.body.style.overflow};
  document.body.style.overflow='hidden';
  box.innerHTML='<button class="utrq-x" aria-label="Close">&times;</button><div class="utrq-eyebrow">'+meta.t+'</div><h3 class="utrq-h">Loading questions…</h3>';
  box.querySelector('.utrq-x').onclick=closeQ; ov.classList.add('utrq-on');
  load(mode).then(function(qs){ state.qs=qs; state.meta=meta; showQ(); }).catch(function(){
    box.innerHTML='<button class="utrq-x" aria-label="Close">&times;</button><h3 class="utrq-h">Could not load the quiz</h3><p>Check your connection and try again.</p>';
    box.querySelector('.utrq-x').onclick=closeQ;
  });
}
function showQ(){
  var s=state, q=s.qs[s.i], n=s.qs.length;
  box.innerHTML='<button class="utrq-x" aria-label="Close">&times;</button><div class="utrq-eyebrow">'+s.meta.t+' · '+(s.i+1)+' of '+n+'</div>'
   +'<div class="utrq-bar"><i style="width:'+(s.i/n*100)+'%"></i></div><p class="utrq-q">'+q.q+'</p><div class="utrq-opts"></div><p class="utrq-fb" aria-live="polite"></p><div class="utrq-row"></div>';
  box.querySelector('.utrq-x').onclick=closeQ;
  var wrap=box.querySelector('.utrq-opts');
  q.a.forEach(function(txt,idx){
    var b=el('button','utrq-opt',esc(txt)); b.type='button';
    b.onclick=function(){ answer(idx); }; wrap.appendChild(b);
  });
  var first=wrap.firstChild; if(first) first.focus({preventScroll:true});
}
function answer(idx){
  var s=state, q=s.qs[s.i], btns=box.querySelectorAll('.utrq-opt'), ok=idx===q.c;
  btns.forEach(function(b,i){ b.disabled=true; if(i===q.c) b.classList.add('utrq-right'); else if(i===idx) b.classList.add('utrq-wrong'); });
  if(ok) s.score++;
  box.querySelector('.utrq-fb').innerHTML=(ok?'Right. ':'Not quite. ')+(q.note||'');
  var last=s.i===s.qs.length-1, nb=el('button','utrq-btn',last?'See my score':'Next question'); nb.type='button';
  nb.onclick=function(){ if(last) showEnd(); else { s.i++; showQ(); } };
  box.querySelector('.utrq-row').appendChild(nb); nb.focus({preventScroll:true});
}
function showEnd(){
  var s=state, n=s.qs.length, r=s.score/n, msg;
  msg= r>=.9?'You really know your stuff.' : r>=.7?'Strong run.' : r>=.4?'Decent start. Plenty left to learn.' : 'Rough one. The codex is a good place to start.';
  box.innerHTML='<button class="utrq-x" aria-label="Close">&times;</button><div class="utrq-eyebrow">'+s.meta.t+'</div><div class="utrq-score">'+s.score+' / '+n+'</div><p class="utrq-q">'+msg+'</p>'
   +'<div class="utrq-row"><button type="button" class="utrq-btn" data-again>Play again</button><button type="button" class="utrq-btn utrq-ghost" data-close>Close</button></div>'+ctaHTML();
  box.querySelector('.utrq-x').onclick=closeQ; box.querySelector('[data-close]').onclick=closeQ;
  box.querySelector('[data-again]').onclick=function(){ openQ(s.mode,s.opener); };
  box.scrollTop=0;
}

/* ---------- mounting ---------- */
function mount(){
  document.querySelectorAll('[data-utrq-open]').forEach(function(b){
    if(b.__utrq) return; b.__utrq=1;
    b.addEventListener('click',function(){ openQ(b.getAttribute('data-utrq-open'),b); });
  });
  document.querySelectorAll('[data-utrq="banner"]').forEach(function(m){
    if(window.UTRQ_NOMEMBER) return;
    if(m.__utrq||document.getElementById('urtr-cta')) return; m.__utrq=1; m.className=(m.className?m.className+' ':'')+'utrq-bwrap';
    if(!document.getElementById('utrq-fonts')){var l=document.createElement('link');l.id='utrq-fonts';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Spectral:wght@400;600&display=swap';document.head.appendChild(l);}
    m.innerHTML='<div id="urtr-cta"><div><p class="urtr-cta-title">Collecting Riftbound?</p><p class="urtr-cta-text">Track what you own in the Collection-Bound tracker. A free account saves up to 75 items, and Collector Club and VIP add your whole collection and the price tools.</p></div><div class="urtr-cta-btns"><a class="urtr-btn urtr-btn-gold" href="'+LINKS.tracker+'">Make a free account</a><a class="urtr-btn urtr-btn-ghost" href="'+LINKS.member+'">See memberships</a></div></div>';
  });
}

/* ---------- timed popup (once every few days, only after real time on the page) ---------- */
function popup(){
  if(window.UTRQ_POPUP===false||window.UTRQ_NOMEMBER) return;
  var KEY='utrq-pop-v1', now=Date.now();
  try{ var t=+localStorage.getItem(KEY)||0; if(now-t<3*864e5) return; }catch(e){}
  var secs=0, shown=false, pop=el('div','utrq-pop');
  pop.setAttribute('role','dialog'); pop.setAttribute('aria-label','Support Unraveling the Rift');
  pop.innerHTML='<h4>Enjoying the lore?</h4><p>Back us on Patreon and you get sneak peeks at what’s coming next. Collecting? Come join the tracker, it’s free to start.</p>'
   +'<div class="utrq-row" style="margin-top:0"><a class="utrq-btn" href="'+LINKS.patreon+'" target="_blank" rel="noopener">Join on Patreon</a><a class="utrq-btn utrq-ghost" href="'+LINKS.tracker+'">Open the tracker</a><button type="button" class="utrq-btn utrq-ghost" data-no>Maybe later</button></div>';
  document.body.appendChild(pop);
  function remember(){ try{ localStorage.setItem(KEY,String(Date.now())); }catch(e){} }
  pop.querySelector('[data-no]').onclick=function(){ pop.classList.remove('utrq-on'); remember(); };
  pop.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',remember); });
  var iv=setInterval(function(){
    if(document.hidden||shown) return;
    if(ov&&ov.classList.contains('utrq-on')) return;   /* never interrupt a quiz */
    if(document.querySelector('.utrr-tip.utrr-show')) { return; } /* or an open region scroll */
    secs++; if(secs>=(window.UTRQ_POPUP_SECS||75)){ shown=true; clearInterval(iv); pop.classList.add('utrq-on'); setTimeout(function(){ if(pop.classList.contains('utrq-on')){ pop.classList.remove('utrq-on'); remember(); } },20000); }
  },1000);
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){mount();popup();}); else {mount();popup();}
window.UTRQ={mount:mount,open:openQ};
})();
