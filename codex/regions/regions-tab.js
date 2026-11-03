/* Unraveling the Rift · Lore Codex · Regions & Locations tab
   Usage: <div id="utr-regions-mount" data-bleed="true"></div>
          <script src="https://cdn.jsdelivr.net/gh/unravelingtherift/collect-bound-data@main/codex/regions/regions-tab.js"></script>
   Region text is built in (and can be overridden by codex/regions/regions.json). Cards load live from the
   same set files as the Lore Codex, so new cards appear here automatically. */
(function(){
'use strict';
var mount=document.getElementById('utr-regions-mount');
if(!mount||mount.dataset.loaded) return; mount.dataset.loaded='1';
var BASE='https://raw.githubusercontent.com/unravelingtherift/collect-bound-data/main/';
var SETS=['ogn','ogs','sfd','unl','ven','rad'];
var SET_NAME={OGN:'Origins',OGS:'Proving Grounds',SFD:'Spiritforged',UNL:'Unleashed',VEN:'Vendetta',RAD:'Radiance'};
var SET_TOTAL={OGN:298,OGS:24,SFD:221,UNL:219,VEN:166,RAD:167};
var DOM_COL={Fury:'#e5484d',Calm:'#46b96a',Mind:'#3d8fe0',Body:'#f0902f',Chaos:'#9b5de5',Order:'#e8c24a',Colorless:'#9d9cae'};
var TYPE_ORDER=['Legend','Champion','Unit','Spell','Gear','Battlefield'];
var TYPE_LABEL={Legend:'Legends',Champion:'Champions',Unit:'Units',Spell:'Spells',Gear:'Gear',Battlefield:'Battlefields'};
var TAG_FIX={'Moiunt Targon':'Mount Targon','Demncia':'Demacia','Feljord':'Freljord'};
var REG_DATA={"updated": "2026-11-02", "note": "Region write-ups are original summaries based on the League of Legends universe (Riot Universe + wiki). Card links come from the card data automatically; 'places' lists battlefield cards that are named after a place in that region. Add a battlefield name to a region's 'places' to link it.", "regions": [{"id": "demacia", "name": "Demacia", "tag": "Demacia", "color": "#7fa7e6", "where": "The far west edge of Valoran", "tagline": "The kingdom of justice, honor and duty", "blurb": "A walled, proud kingdom of soldiers and ideals. Demacians value law, duty and loyalty above almost everything, and for generations they treated magic as a danger to be locked away.", "facts": ["Demacia's army is famous for its armored cavalry and its sworn Dauntless Vanguard.", "For a long time, mages were hunted here by the Mageseekers. The kingdom is only now learning to live with magic.", "Garen and Lux Crownguard are siblings from one of Demacia's great noble houses."], "clues": ["A walled western kingdom that feared magic for generations", "Home of the Crownguard family and the Dauntless Vanguard"], "book": "Realms of Runeterra short story: \"The Weight of Expectations\"", "places": []}, {"id": "noxus", "name": "Noxus", "tag": "Noxus", "color": "#d4505a", "where": "The heart of Valoran, east of Demacia", "tagline": "The empire that rewards strength", "blurb": "A huge, hungry empire that swallows its neighbors. Noxus looks brutal, but it truly believes that anyone with talent can rise, whatever their birth. Strength earns respect, and failure is rarely forgiven.", "facts": ["The Noxian army is split into legions, and the Trifarian Legion is one of its most feared.", "Noxus is ruled by a Grand General, and the title can be won by merit rather than blood.", "Darius, Draven, Swain and Ambessa Medarda all call the empire home."], "clues": ["An expansionist empire where anyone strong enough can rise", "Home of the Trifarian Legion and its Grand General"], "book": "Realms of Runeterra short story: \"As Stone\"", "places": ["Trifarian War Camp"]}, {"id": "freljord", "name": "Freljord", "tag": "Freljord", "color": "#8fd8f0", "where": "The frozen north of Valoran", "tagline": "A land of ice, tribes and old spirits", "blurb": "A brutal frozen realm where survival is a daily fight. Rival tribes raid one another, ancient spirits watch from the storms, and legends such as Ashe, Sejuani and Lissandra grew up here.", "facts": ["The Freljord is the only place where True Ice can be found.", "Three great tribes, the Avarosans, the Winter's Claw and the Frostguard, have long fought over the land.", "Ornn the forge-god and the storm-spirit Volibear both belong to its legends."], "clues": ["Frozen northern lands ruled by warring tribes and True Ice", "Home of Ashe, Sejuani, Lissandra and the forge-god Ornn"], "book": "Realms of Runeterra short story: \"A Good Day\"", "places": ["Ornn's Forge", "Frozen Fortress"]}, {"id": "piltover", "name": "Piltover", "tag": "Piltover", "color": "#e0b050", "where": "Valoran's eastern coast, high above Zaun", "tagline": "The city of progress", "blurb": "A gleaming coastal city-state of inventors, merchants and artists. Piltover grew rich on trade and on hextech, the blend of magic and machinery that has changed how people live and fight.", "facts": ["Hextech was developed here by inventors working with gemstones called Hextech crystals.", "Piltover is run by a Council of its most powerful figures.", "Jayce, Caitlyn, Vi and Heimerdinger have all worked for Piltover at one time or another."], "clues": ["A glittering city-state that built hextech", "Its Council rules the city of progress, high above a toxic undercity"], "book": "Realms of Runeterra short story: \"The Jubilee Job\" (Piltover & Zaun chapter)", "places": ["Piltovan Forge"]}, {"id": "zaun", "name": "Zaun", "tag": "Zaun", "color": "#6ee0a0", "where": "The valley beneath Piltover", "tagline": "The undercity that never sleeps", "blurb": "A smoky, chemical-lit maze built in the deep valley beneath Piltover. Zaun is rough and crowded, but it is also inventive and fiercely loyal, and its chem-barons control much of what flows through it.", "facts": ["Zaun sits in a deep valley, with smog and chemical runoff drifting through its streets.", "Shimmer, a glowing and dangerous chemical, comes from Zaun's underworld.", "Jinx, Ekko, Viktor, Singed and Blitzcrank are among its best known people."], "clues": ["A smoky undercity below a shining city, ruled by chem-barons", "The valley home of Jinx, Ekko and Viktor"], "book": "Realms of Runeterra short story: \"The Jubilee Job\" (Piltover & Zaun chapter)", "places": ["Zaun Warrens"]}, {"id": "ionia", "name": "Ionia", "tag": "Ionia", "color": "#f08ac0", "where": "An island chain off Valoran's eastern shore", "tagline": "A magical archipelago in search of balance", "blurb": "A chain of lush, spiritual islands where magic and nature are closely linked. Ionia prizes balance and harmony, but it has been scarred by invasion, and its people are still learning how to protect it.", "facts": ["Ionia has a close link to the Spirit Realm, and spirits often wander into the mortal world.", "The Kinkou order, the Navori Conclave and monasteries like Hirana are all Ionian.", "Ahri, Yasuo, Irelia, Lee Sin, Master Yi and Zed were all shaped by life on these islands."], "clues": ["A spiritual island chain home to Ahri, Yasuo and Lee Sin", "Noxus once invaded these islands, so they value harmony and balance"], "book": "Realms of Runeterra short story: \"Orchid's Bloom\"", "places": ["Monastery of Hirana", "Grove of the God-Willow", "Navori Fighting Pit", "Kinkou Temple"]}, {"id": "bilgewater", "name": "Bilgewater", "tag": "Bilgewater", "color": "#e8825a", "where": "The Serpent Isles, southeast of Valoran", "tagline": "Pirates, gangs and the open sea", "blurb": "A lawless harbor town on the Serpent Isles, where sailors, smugglers and monster hunters trade away their problems. Almost anything has a price, and almost everyone owes someone.", "facts": ["Bilgewater lies in the Serpent Isles, where sea monsters rise from the waters.", "Its people honor a sea-goddess, Nagakabouros.", "Miss Fortune and Gangplank are pirates who still shape the city."], "clues": ["A pirate port city on the Serpent Isles", "The harbor where Miss Fortune and Gangplank fight for power"], "book": "Realms of Runeterra short story: \"All Kindred Eve\"", "places": []}, {"id": "shadow", "name": "Shadow Isles", "tag": "Shadow Isles", "color": "#5fd0a8", "where": "A cursed archipelago in the western sea", "tagline": "Where the Black Mist drowns the living", "blurb": "The Shadow Isles were once the Blessed Isles, a gleaming haven. A catastrophe called the Ruination twisted them, and the Black Mist now drags the dead to rise as wraiths and keeps the living trapped.", "facts": ["The Black Mist spreads from the Isles and can tear souls from those who die near it.", "Ships that sail near the Isles sometimes never return.", "Viego, Thresh, Hecarim, Kalista and Mordekaiser are all tied to the Mist."], "clues": ["A cursed island chain hidden behind the Black Mist", "Once the Blessed Isles, it became a place the dead cannot leave"], "book": "Realms of Runeterra short story: \"The Daring Darling\"", "places": []}, {"id": "targon", "name": "Mount Targon", "tag": "Mount Targon", "color": "#b59cf0", "where": "A great peak in the south, west of Shurima", "tagline": "A mountain that touches the heavens", "blurb": "The tallest mountain in Runeterra, rising so high that its peak seems to brush the stars. A few climbers reach the summit and are touched by celestial power. Most never come back.", "facts": ["Climbers who reach the top may be chosen as Aspects, hosts of cosmic beings.", "The mountain hosts the Solari and Lunari, orders devoted to the Sun and the Moon.", "Leona, Diana, Soraka, Taric and Pantheon are all linked to Targon."], "clues": ["The tallest mountain in the world, where climbers may be touched by the stars", "Home of the Solari and the Lunari"], "book": "Realms of Runeterra: Mount Targon chapter", "places": ["Targon's Peak", "Aspirant's Climb"]}, {"id": "shurima", "name": "Shurima", "tag": "Shurima", "color": "#f2c14e", "where": "The great southern desert", "tagline": "The sun-scorched empire that rose again", "blurb": "A vast desert that once ruled a golden empire. Ruins and buried cities sit under the dunes, and the ancient Ascended are walking the land again, trying to bring the old empire back.", "facts": ["The old empire was ruled by Ascended beings, who gained power from the Sun Disc.", "Azir, Nasus, Renekton and Sivir all trace their stories to Shurima.", "Shurima's deserts hide Void creatures such as Rek'Sai, who burrow beneath the sands."], "clues": ["A desert empire ruled by Ascended beings and the Sun Disc", "Azir, Nasus and Renekton walk its sands"], "book": "Realms of Runeterra short story: \"Water and Shade To You\"", "places": ["Emperor's Dais", "Sandswept Tomb"]}, {"id": "ixtal", "name": "Ixtal", "tag": "Ixtal", "color": "#4ed96b", "where": "The jungles of eastern Shurima", "tagline": "The hidden land of elemental magic", "blurb": "A secretive jungle nation that has kept outsiders away for centuries. Ixtal's people practice elemental magic, and their hidden cities are among the most carefully guarded places in the world.", "facts": ["Ixtal's people weave the elements into everyday life and into their wars.", "Its famed hidden city is called Ixaocan.", "Qiyana, Neeko and Zyra are linked to this jungle."], "clues": ["A secretive jungle nation that practices elemental magic", "The home of Qiyana and the hidden city of Ixaocan"], "book": "Realms of Runeterra: Ixtal chapter", "places": []}, {"id": "icathia", "name": "Icathia", "tag": "Icathia", "color": "#a35ad8", "where": "A ruined land by Shurima's southern coast", "tagline": "A kingdom swallowed by the Void", "blurb": "Once a kingdom that rebelled against Shurima, Icathia was torn apart when a rupture to the Void opened beneath it. What remains is a wasteland still crawling with corrupted creatures.", "facts": ["Icathia's ruin is the reason many Runeterrans fear the Void.", "Malzahar's story is tied to Icathia's ruins.", "Many of the Void creatures seen in Runeterra first poured out of the Icathian rupture."], "clues": ["A rebel kingdom destroyed by a Void rupture", "A corrupted wasteland near Shurima"], "book": "Realms of Runeterra: Void section", "places": []}, {"id": "bandle", "name": "Bandle City", "tag": "Bandle City", "color": "#f07fd0", "where": "A hidden realm, reached through gateways", "tagline": "The magical home of the yordles", "blurb": "A tiny, timeless city tucked away from the mortal world. Yordles live and play here among strange magic and whimsy, and they rarely let outsiders in. It is reachable only through special gateways.", "facts": ["Yordles are small, furry beings who love invention, mischief and tea.", "The great Bandle Tree sits at the heart of the city.", "Teemo, Tristana, Lulu and Veigar are among its famous residents."], "clues": ["A hidden magical city of yordles, reached through gateways", "Home of the Bandle Tree and the Bandle Scouts"], "book": "Realms of Runeterra: Bandle City section", "places": ["Bandle Tree", "Bandle Scouts' Academy"]}, {"id": "void", "name": "The Void", "tag": "The Void", "color": "#8f5be8", "where": "Beyond the world, through rifts", "tagline": "A hunger that eats everything", "blurb": "A realm of nothing, beyond the world we know. It hungers for everything that exists, and it sends its twisted creatures through rifts to feed. It is not so much a place as a force.", "facts": ["The Void has no sun, no sky and no ground, only an endless hunger.", "Void creatures such as Kog'Maw and Rek'Sai have crossed into Runeterra, and Kai'Sa wears Void armor.", "Rifts to the Void have opened in places like Icathia and Shurima."], "clues": ["A realm of nothingness that tries to devour the world", "Source of Kog'Maw and Rek'Sai, and of the Void armor Kai'Sa wears"], "book": "Realms of Runeterra: Void section", "places": ["Void Gate"]}]};

/* ---------- original illustrated map (drawn for this site, not Riot art) ---------- */
function rng(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; var t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function hashStr(s){ var h=2166136261; for(var i=0;i<s.length;i++){ h=Math.imul(h^s.charCodeAt(i),16777619); } return h>>>0; }
function edgePts(a,b,amp,depth){
 var rev=(a[0]>b[0])||(a[0]===b[0]&&a[1]>b[1]); var p=rev?b:a, q=rev?a:b;
 var r=rng(hashStr(p.join(',')+'|'+q.join(',')+'|'+amp)), pts=[p,q];
 for(var d=0;d<depth;d++){
  var np=[pts[0]];
  for(var i=0;i<pts.length-1;i++){
   var x1=pts[i][0],y1=pts[i][1],x2=pts[i+1][0],y2=pts[i+1][1], dx=x2-x1, dy=y2-y1, len=Math.sqrt(dx*dx+dy*dy)||1, o=(r()-.5)*len*amp;
   np.push([(x1+x2)/2-dy/len*o,(y1+y2)/2+dx/len*o],pts[i+1]);
  }
  pts=np;
 }
 return rev?pts.reverse():pts;
}
function ring(poly,amp,depth){ var out=[],n=poly.length; for(var i=0;i<n;i++){ out=out.concat(edgePts(poly[i],poly[(i+1)%n],amp,depth).slice(0,-1)); } return out; }
function pathOf(pts){ return 'M'+pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1);}).join('L')+'Z'; }
function inPoly(x,y,pts){ var c=false; for(var i=0,j=pts.length-1;i<pts.length;j=i++){ if(((pts[i][1]>y)!==(pts[j][1]>y))&&(x<(pts[j][0]-pts[i][0])*(y-pts[i][1])/(pts[j][1]-pts[i][1])+pts[i][0])) c=!c; } return c; }
/* two continents + islands. Regions that share a continent share exact border points, so they fit together. */
var CONTS={
 valoran:[[40,120],[70,70],[130,40],[190,54],[250,22],[330,8],[420,22],[500,12],[580,30],[640,70],[700,92],[740,150],[722,210],[760,262],[772,330],[742,360],[700,338],[668,360],[640,390],[580,378],[520,394],[470,380],[410,386],[350,370],[300,394],[230,388],[170,370],[110,364],[70,326],[84,270],[48,210]],
 shurima:[[236,530],[262,500],[320,490],[372,474],[440,488],[500,472],[560,486],[622,474],[684,490],[736,514],[764,556],[748,596],[706,614],[660,608],[628,628],[592,624],[560,602],[500,616],[440,626],[380,612],[324,622],[270,594],[240,562]]
};
var MAPDEF={
 freljord:{c:'valoran',poly:[[20,0],[820,0],[820,130],[620,130],[520,108],[430,155],[330,150],[250,165],[160,140],[20,150]],lab:[330,92],ter:'#b9d0dc',deco:'snow'},
 demacia:{c:'valoran',poly:[[20,150],[160,140],[250,165],[330,150],[345,230],[335,330],[300,460],[20,460]],lab:[190,290],ter:'#4f8a5a',deco:'wall'},
 noxus:{c:'valoran',poly:[[330,150],[430,155],[520,108],[620,130],[640,200],[660,270],[600,330],[600,460],[300,460],[335,330],[345,230]],lab:[470,290],ter:'#8d6c46',deco:'spikes'},
 piltover:{c:'valoran',poly:[[620,130],[820,130],[820,270],[660,270],[640,200]],lab:[690,196],ter:'#b79656',deco:'gears'},
 zaun:{c:'valoran',poly:[[660,270],[820,270],[820,460],[600,460],[600,330]],lab:[662,356],ter:'#4c7f6d',deco:'mist'},
 targon:{c:'shurima',poly:[[200,420],[340,420],[345,500],[335,640],[200,640]],lab:[286,560],ter:'#8a7fb0',deco:'peaks'},
 shurima:{c:'shurima',poly:[[340,420],[660,420],[650,500],[640,640],[335,640],[345,500]],lab:[490,548],ter:'#cba45c',deco:'dunes'},
 ixtal:{c:'shurima',poly:[[660,420],[800,420],[800,640],[640,640],[650,500]],lab:[704,552],ter:'#2f7d45',deco:'jungle'},
 ionia:{isl:[[[770,90],[830,70],[880,95],[886,150],[840,186],[780,170],[760,130]],[[795,212],[838,205],[852,240],[816,260],[792,242]],[[872,204],[906,214],[904,246],[874,244]]],lab:[826,130],ter:'#5f9a6e',deco:'leaves'},
 bilgewater:{isl:[[[770,362],[826,346],[872,370],[866,416],[816,436],[772,410]],[[880,430],[916,440],[912,472],[880,466]],[[736,424],[766,432],[758,462],[734,454]]],lab:[820,392],ter:'#9a7a52',deco:'waves'},
 shadow:{isl:[[[830,500],[880,486],[926,506],[930,546],[890,572],[842,556]],[[796,542],[822,550],[816,576],[790,568]],[[942,584],[966,592],[956,616],[934,606]]],lab:[880,528],ter:'#3f5e58',deco:'mistdark'},
 icathia:{isl:[[[414,420],[460,414],[494,426],[484,446],[446,452],[410,438]]],lab:[452,434],ter:'#836399',deco:'crack',fs:10},
 bandle:{circle:[922,300,38],lab:[922,300],ter:'#cf8fc4',deco:'sparkle',fs:11},
 void:{circle:[124,540,48],lab:[124,540],ter:'#5d3d9c',deco:'swirl',fs:12}
};
var DRAW_ORDER=['freljord','demacia','noxus','piltover','zaun','ionia','bandle','bilgewater','icathia','targon','shurima','ixtal','shadow','void'];
var SHAPES={}, CPTS={}, CPATH={};
Object.keys(CONTS).forEach(function(k){ CPTS[k]=ring(CONTS[k],.34,4); CPATH[k]=pathOf(CPTS[k]); });
Object.keys(MAPDEF).forEach(function(id){
 var d=MAPDEF[id], s={paths:[],pts:[]};
 if(d.poly){ var p=ring(d.poly,.2,3); s.pts.push(p); s.paths.push(pathOf(p)); }
 else if(d.isl){ d.isl.forEach(function(poly){ var p=ring(poly,.3,3); s.pts.push(p); s.paths.push(pathOf(p)); }); }
 else { var c=d.circle, p=[]; for(var a=0;a<48;a++){ var an=a/48*Math.PI*2, rr=c[2]*(1+(rng(hashStr(id+a))()-.5)*.14); p.push([c[0]+Math.cos(an)*rr,c[1]+Math.sin(an)*rr]); } s.pts.push(p); s.paths.push(pathOf(p)); }
 SHAPES[id]=s;
});
function landPoint(id,r){
 var d=MAPDEF[id], s=SHAPES[id];
 for(var t=0;t<40;t++){
  var x=r()*1000,y=r()*640, ok=false;
  for(var i=0;i<s.pts.length;i++){ if(inPoly(x,y,s.pts[i])) ok=true; }
  if(ok&&d.c&&!inPoly(x,y,CPTS[d.c])) ok=false;
  if(ok) return [x,y];
 }
 return null;
}
function icon(kind,x,y,r){
 var s=.7+r()*.7, o='';
 var tri=function(w,h,c,c2){ return '<path d="M'+(x-w)+','+y+' L'+x+','+(y-h)+' L'+(x+w)+','+y+'Z" fill="'+c+'"/><path d="M'+x+','+(y-h)+' L'+(x+w)+','+y+' L'+(x+w*.1)+','+y+'Z" fill="'+c2+'"/>'; };
 var tree=function(c){ return '<circle cx="'+x+'" cy="'+(y-3*s)+'" r="'+(3.4*s)+'" fill="'+c+'"/><rect x="'+(x-.5)+'" y="'+(y-1)+'" width="1" height="3" fill="#2a3a22"/>'; };
 if(kind==='snow'){ o=r()<.55?'<path d="M'+x+','+(y-9*s)+' l'+(4*s)+','+(9*s)+' h'+(-8*s)+'z" fill="#e9f4fa" opacity=".85"/><path d="M'+x+','+(y-9*s)+' l'+(4*s)+','+(9*s)+' h'+(-3*s)+'z" fill="#a9c4d6" opacity=".9"/>':tri(7*s,9*s,'#c8dbe6','#eef7fb'); }
 else if(kind==='wall'){ o=r()<.7?tree('#4f8a63'):'<rect x="'+(x-3)+'" y="'+(y-9)+'" width="6" height="9" fill="#c9d6e4" opacity=".92"/><path d="M'+(x-3)+','+(y-9)+' h2 v-2 h2 v2 h2" fill="none" stroke="#c9d6e4"/><rect x="'+(x-1)+'" y="'+(y-5)+'" width="2" height="4" fill="#4a6fa8"/>'; }
 else if(kind==='spikes'){ o=r()<.6?tri(7*s,12*s,'#6b3f33','#8c5645'):'<path d="M'+(x-3)+','+y+' v-11 l3,-4 l3,4 v11z" fill="#3b2a2e"/><path d="M'+x+','+(y-15)+' v-6" stroke="#c0464f" stroke-width="1.4"/>'; }
 else if(kind==='gears'){ o=r()<.5?'<rect x="'+(x-3)+'" y="'+(y-7)+'" width="6" height="7" fill="#e3c57e"/><rect x="'+(x-1)+'" y="'+(y-11)+'" width="2" height="4" fill="#e3c57e"/>':'<circle cx="'+x+'" cy="'+(y-3)+'" r="'+(4*s)+'" fill="none" stroke="#f0d48a" stroke-width="1.4" stroke-dasharray="2 1.5"/>'; }
 else if(kind==='mist'){ o='<rect x="'+(x-2)+'" y="'+(y-8)+'" width="4" height="8" fill="#355f56"/><circle cx="'+(x+2)+'" cy="'+(y-11)+'" r="'+(3*s)+'" fill="#8ff0c0" opacity=".28"/>'; }
 else if(kind==='leaves'){ o=r()<.7?'<circle cx="'+x+'" cy="'+(y-3*s)+'" r="'+(3.6*s)+'" fill="#f4a8cf" opacity=".92"/><rect x="'+(x-.5)+'" y="'+(y-1)+'" width="1" height="3" fill="#4a3a30"/>':tree('#5c9a6a'); }
 else if(kind==='waves'){ o=r()<.6?tree('#6aa87a'):'<path d="M'+(x-4)+','+y+' q4,-4 8,0" fill="none" stroke="#ffe3c0" stroke-width="1.2"/>'; }
 else if(kind==='mistdark'){ o='<path d="M'+x+','+y+' v-8 m0,3 l-3,-3 m3,5 l3,-3" stroke="#14231f" stroke-width="1.2" fill="none"/>'; }
 else if(kind==='peaks'){ o=tri(9*s,16*s,'#7d78a8','#bdb6e0')+'<path d="M'+(x-2*s)+','+(y-12*s)+' l'+(2*s)+','+(-4*s)+' l'+(2*s)+','+(4*s)+'z" fill="#fff" opacity=".9"/>'; }
 else if(kind==='dunes'){ o=r()<.75?'<path d="M'+(x-8*s)+','+y+' q'+(4*s)+','+(-6*s)+' '+(8*s)+',0 t'+(8*s)+',0" fill="none" stroke="#a97f3c" stroke-width="1.3" opacity=".8"/>':'<path d="M'+(x-5)+','+y+' l5,-9 l5,9z" fill="#e8cf96"/><path d="M'+x+','+(y-9)+' l5,9 h-2z" fill="#b48a46"/>'; }
 else if(kind==='jungle'){ o='<circle cx="'+x+'" cy="'+(y-3*s)+'" r="'+(4.4*s)+'" fill="#2f7d45" opacity=".95"/><circle cx="'+(x+2)+'" cy="'+(y-5*s)+'" r="'+(2.6*s)+'" fill="#58b36e"/>'; }
 else if(kind==='crack'){ o='<path d="M'+x+','+y+' l3,-4 l-2,-3" stroke="#d6aaff" stroke-width="1.2" fill="none" opacity=".9"/>'; }
 else if(kind==='sparkle'){ o='<path d="M'+x+','+(y-4)+' l1,3 l3,1 l-3,1 l-1,3 l-1,-3 l-3,-1 l3,-1z" fill="#ffe1f6" opacity=".9"/>'; }
 return o;
}
function baseSVG(){
 var s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 640" width="2000" height="1280">';
 s+='<defs>'
  +'<radialGradient id="sea" cx="52%" cy="48%" r="75%"><stop offset="0" stop-color="#1b4a5e"/><stop offset=".6" stop-color="#112c40"/><stop offset="1" stop-color="#08121f"/></radialGradient>'
  +'<filter id="terr" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB">'
   +'<feTurbulence type="fractalNoise" baseFrequency=".011 .017" numOctaves="5" seed="11" result="n"/>'
   +'<feDiffuseLighting in="n" lighting-color="#fff" surfaceScale="9" diffuseConstant="1.5" result="d"><feDistantLight azimuth="235" elevation="55"/></feDiffuseLighting>'
   +'<feBlend in="d" in2="SourceGraphic" mode="multiply" result="m"/>'
   +'<feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="b"/>'
   +'<feSpecularLighting in="b" surfaceScale="4" specularConstant=".7" specularExponent="18" lighting-color="#fff4d6" result="sp"><feDistantLight azimuth="235" elevation="38"/></feSpecularLighting>'
   +'<feComposite in="sp" in2="SourceAlpha" operator="in" result="spc"/>'
   +'<feComposite in="m" in2="spc" operator="arithmetic" k1="0" k2="1" k3=".55" k4="0" result="out"/>'
   +'<feComposite in="out" in2="SourceAlpha" operator="in"/></filter>'
  +'<filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="9"/></filter><filter id="blur12" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="13"/></filter>'
  +'<radialGradient id="vig" cx="50%" cy="50%" r="72%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient>';
 Object.keys(CPATH).forEach(function(k){ s+='<clipPath id="cc-'+k+'"><path d="'+CPATH[k]+'"/></clipPath>'; });
 Object.keys(SHAPES).forEach(function(id){ s+='<clipPath id="cr-'+id+'">'+SHAPES[id].paths.map(function(d){return '<path d="'+d+'"/>';}).join('')+'</clipPath>'; });
 s+='</defs><rect width="1000" height="640" fill="url(#sea)"/>';
 /* sea: depth rings + chart grid + waves */
 for(var gx=0;gx<=1000;gx+=100) s+='<path d="M'+gx+',0V640" stroke="#6fc3d4" stroke-opacity=".07"/>';
 for(var gy=0;gy<=640;gy+=80) s+='<path d="M0,'+gy+'H1000" stroke="#6fc3d4" stroke-opacity=".07"/>';
 var wr=rng(5); for(var i=0;i<90;i++){ var wx=wr()*1000, wy=wr()*640; s+='<path d="M'+wx.toFixed(0)+','+wy.toFixed(0)+' q6,-5 12,0 t12,0" fill="none" stroke="#9fe0ec" stroke-opacity=".16" stroke-width="1"/>'; }
 /* shallows glow + thickness (extrusion) */
 var lands=[]; Object.keys(CONTS).forEach(function(k){ lands.push({p:CPATH[k]}); });
 ['ionia','bilgewater','shadow','icathia'].forEach(function(id){ SHAPES[id].paths.forEach(function(d){ lands.push({p:d}); }); });
 lands.forEach(function(l){ s+='<path d="'+l.p+'" fill="none" stroke="#58c4cf" stroke-opacity=".5" stroke-width="12" filter="url(#soft)"/>'; });
 for(var k=9;k>=1;k--){ lands.forEach(function(l){ s+='<path d="'+l.p+'" transform="translate(0,'+k+')" fill="'+(k>6?'#0a141b':k>3?'#16222a':'#2a3a40')+'"/>'; }); }
 /* land with terrain relief */
 s+='<g filter="url(#terr)">';
 Object.keys(CONTS).forEach(function(k){ s+='<path d="'+CPATH[k]+'" fill="#6f7f6f"/>'; });
 Object.keys(CONTS).forEach(function(k){
  s+='<g clip-path="url(#cc-'+k+')"><g filter="url(#blur12)">';
  DRAW_ORDER.forEach(function(id){ var d=MAPDEF[id]; if(d.c===k){ s+=SHAPES[id].paths.map(function(p){return '<path d="'+p+'" fill="'+d.ter+'"/>';}).join(''); } });
  s+='</g></g>';
 });
 DRAW_ORDER.forEach(function(id){ var d=MAPDEF[id]; if(!d.c){ SHAPES[id].paths.forEach(function(p){ s+='<path d="'+p+'" fill="'+d.ter+'"/>'; }); } });
 s+='</g>';
 /* borders */
 DRAW_ORDER.forEach(function(id){ var d=MAPDEF[id]; if(d.c){ s+='<g clip-path="url(#cc-'+d.c+')">'+SHAPES[id].paths.map(function(p){return '<path d="'+p+'" fill="none" stroke="#fff6dc" stroke-opacity=".55" stroke-width="1.4" stroke-dasharray="5 4"/>';}).join('')+'</g>'; } });
 /* coast line */
 Object.keys(CPATH).forEach(function(k){ s+='<path d="'+CPATH[k]+'" fill="none" stroke="#e6f6f2" stroke-opacity=".55" stroke-width="1.6"/>'; });
 ['ionia','bilgewater','shadow','icathia'].forEach(function(id){ SHAPES[id].paths.forEach(function(p){ s+='<path d="'+p+'" fill="none" stroke="#e6f6f2" stroke-opacity=".55" stroke-width="1.4"/>'; }); });
 /* round realms (hidden / beyond the map) */
 var b=MAPDEF.bandle.circle, v=MAPDEF.void.circle;
 s+='<circle cx="'+b[0]+'" cy="'+b[1]+'" r="'+(b[2]+14)+'" fill="#ffb8ea" opacity=".14" filter="url(#soft)"/><path d="'+SHAPES.bandle.paths[0]+'" fill="#d99cd0" fill-opacity=".8" filter="url(#terr)"/><path d="'+SHAPES.bandle.paths[0]+'" fill="none" stroke="#ffe3f7" stroke-dasharray="3 4" stroke-opacity=".8"/>';
 s+='<circle cx="'+v[0]+'" cy="'+v[1]+'" r="'+(v[2]+16)+'" fill="#7a3df0" opacity=".28" filter="url(#soft)"/><path d="'+SHAPES.void.paths[0]+'" fill="#1b0b3a" stroke="#b98cff" stroke-opacity=".7"/>';
 /* terrain icons */
 DRAW_ORDER.forEach(function(id){
  var d=MAPDEF[id], r=rng(hashStr('ico'+id)), n=d.circle?0:({freljord:70,demacia:60,noxus:56,piltover:20,zaun:24,ionia:26,bilgewater:18,shadow:16,targon:16,shurima:64,ixtal:50,icathia:6})[id]||12, pts=[];
  var prev=null; for(var i=0;i<n;i++){ var p=null; if(prev&&r()<.68){ for(var t=0;t<8&&!p;t++){ var q=[prev[0]+(r()-.5)*34,prev[1]+(r()-.5)*24]; var ok=false; for(var m=0;m<SHAPES[id].pts.length;m++){ if(inPoly(q[0],q[1],SHAPES[id].pts[m])) ok=true; } if(ok&&MAPDEF[id].c&&!inPoly(q[0],q[1],CPTS[MAPDEF[id].c])) ok=false; if(ok) p=q; } } if(!p) p=landPoint(id,r); if(p){ pts.push(p); prev=p; } }
  pts.sort(function(a,b){return a[1]-b[1];});
  pts.forEach(function(p){ s+=icon(d.deco,p[0].toFixed(1)*1,p[1].toFixed(1)*1,r); });
 });
 /* compass */
 s+='<g transform="translate(54,52)" opacity=".8"><circle r="22" fill="none" stroke="#ecd9a0" stroke-opacity=".6"/><path d="M0,-30 L5,0 L0,30 L-5,0Z M-30,0 L0,-5 L30,0 L0,5Z" fill="#ecd9a0" fill-opacity=".55"/></g>';
 s+='<rect width="1000" height="640" fill="url(#vig)"/></svg>';
 return s;
}

/* ---------- styles ---------- */
var st=document.createElement('style'); st.id='utrr-style';
st.textContent="#utr-regions{--void:#0a0b12;--panel:#161826;--panel2:#1c1f32;--line:#2a2d42;--gold:#c9a35c;--gold2:#eecd8d;--ink:#eae7dc;--dim:#9d9cae;--cyan:#4fd8d1;--rc:#c9a35c;\n background:radial-gradient(1200px 600px at 50% -200px,rgba(79,216,209,.1),transparent 70%),#0a0b12;color:var(--ink);font-family:'Sora',system-ui,sans-serif;font-size:15px;line-height:1.6;position:relative;overflow:hidden;overflow:clip;padding:0 0 60px}\n#utr-regions *{box-sizing:border-box}\n#utr-regions.utrr-bleed{width:calc(100vw - var(--utrr-sbw,0px));max-width:none;margin-left:calc(50% - (100vw - var(--utrr-sbw,0px)) / 2)}\n#utr-regions button{font-family:inherit}\n.utrr-hero,.utrr-mapwrap,.utrr-panel{max-width:1180px;margin:0 auto;padding-left:16px;padding-right:16px;position:relative}\n.utrr-hero{padding-top:44px;text-align:center}\n.utrr-kicker{margin:0;color:var(--gold);letter-spacing:.24em;text-transform:uppercase;font-size:.72rem}\n.utrr-title{font-family:'Friz Quadrata','Cinzel',serif;font-weight:600;font-size:clamp(1.9rem,5vw,3.2rem);margin:8px 0 6px;color:var(--gold2);letter-spacing:.06em}\n.utrr-sub{max-width:700px;margin:0 auto;color:var(--dim)}\n.utrr-tools{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;align-items:center;margin-top:22px}\n.utrr-btn{background:var(--gold);color:#221a08;border:1px solid var(--gold);border-radius:999px;padding:10px 20px;font-weight:600;font-size:.86rem;cursor:pointer;transition:transform .15s,filter .15s}\n.utrr-btn:hover{filter:brightness(1.1);transform:translateY(-1px)}\n.utrr-btn-alt{background:var(--panel);color:var(--gold2);border-color:var(--gold)}\n.utrr-btn-sm{padding:6px 14px;font-size:.78rem}\n.utrr-prog{min-width:270px;text-align:left;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:8px 14px}\n.utrr-prog-top{display:flex;justify-content:space-between;gap:16px;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dim)}\n.utrr-prog-top b{color:var(--gold2)}\n.utrr-prog-track{height:6px;background:#0a0b12;border-radius:6px;margin:6px 0 4px;overflow:hidden}\n.utrr-prog-track i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--gold),var(--cyan));transition:width .5s}\n.utrr-prog small{font-size:.7rem;color:var(--dim)}\n.utrr-mapwrap{margin-top:26px}\n.utrr-reg{cursor:pointer;outline:none;--rc:#c9a35c}\n.utrr-reg.utrr-on .utrr-reg.utrr-right .utrr-reg.utrr-wrong .utrr-quizmode .utrr-quizmode .utrr-reg.utrr-right .utrr-lab,.utrr-quizmode .utrr-reg.utrr-wrong .utrr-ping .utrr-spin{transform-box:fill-box;transform-origin:center;animation:utrr-spin 16s linear infinite}\n@keyframes utrr-spin{to{transform:rotate(360deg)}}\n.utrr-drift{animation:utrr-drift 7s ease-in-out infinite alternate}\n.utrr-drift2{animation:utrr-drift 9s ease-in-out infinite alternate-reverse}\n@keyframes utrr-drift{from{transform:translateX(-8px)}to{transform:translateX(8px)}}\n.utrr-twinkle{animation:utrr-tw 2.4s ease-in-out infinite}\n@keyframes utrr-tw{0%,100%{opacity:.35}50%{opacity:1}}\n.utrr-tip.utrr-show{opacity:1}\n\n\n\n\n.utrr-hint{font-size:.72rem;color:var(--dim);margin:8px 2px 12px;text-align:center}\n.utrr-chiprow{display:flex;gap:8px;flex-wrap:wrap}\n.utrr-chips{justify-content:center}\n.utrr-chip{border:1px solid var(--line);background:var(--panel);color:var(--dim);padding:8px 14px;border-radius:999px;font-size:.8rem;cursor:pointer;transition:all .18s;display:inline-flex;align-items:center;gap:7px}\n.utrr-chip:hover{border-color:var(--gold);color:var(--ink)}\n.utrr-chip.utrr-active{background:var(--gold);border-color:var(--gold);color:#221a08;font-weight:600}\n.utrr-chip em{font-style:normal;font-size:.7rem;opacity:.75}\n.utrr-chip-reg i,.utrr-chip-sm i{width:9px;height:9px;border-radius:50%;background:var(--rc);display:inline-block}\n.utrr-chip-reg.utrr-seen{border-color:var(--rc)}\n.utrr-chip-reg.utrr-active i{box-shadow:0 0 0 2px #221a08}\n.utrr-chip-sm{padding:5px 11px;font-size:.74rem}\n.utrr-quiz{background:var(--panel);border:1px solid var(--gold);border-radius:14px;padding:14px 18px;margin-bottom:12px;text-align:center}\n.utrr-qtop{display:flex;justify-content:space-between;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}\n.utrr-qclue{font-family:'Friz Quadrata','Cinzel',serif;font-size:clamp(1.05rem,2.6vw,1.4rem);color:var(--gold2);margin:8px 0}\n#utrr-qfb{min-height:1.4em;margin:0 0 8px;color:var(--dim);font-size:.85rem}\n#utrr-qfb.utrr-ok{color:#7dffa7}#utrr-qfb.utrr-bad{color:#ff8a8f}\n.utrr-qbtns{display:flex;gap:10px;justify-content:center}\n.utrr-panel{margin-top:30px;scroll-margin-top:90px;animation:utrr-in .4s ease both}\n@keyframes utrr-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}\n.utrr-phead{display:flex;justify-content:space-between;gap:12px;align-items:flex-end;flex-wrap:wrap;border-bottom:2px solid var(--rc);padding-bottom:12px;margin-bottom:18px}\n.utrr-where{margin:0;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--rc)}\n.utrr-panel h3{font-family:'Friz Quadrata','Cinzel',serif;font-size:clamp(1.7rem,4vw,2.5rem);margin:2px 0;color:#fff;font-weight:600}\n.utrr-tag{margin:0;color:var(--gold2);font-style:italic}\n.utrr-pinstate{font-size:.72rem;color:var(--dim);border:1px solid var(--line);border-radius:999px;padding:4px 12px}\n.utrr-pgrid{display:grid;grid-template-columns:1.1fr 1fr;gap:28px}\n@media(max-width:820px){.utrr-pgrid{grid-template-columns:1fr}}\n.utrr-blurb{margin:0 0 14px;font-size:.98rem}\n.utrr-fact{background:rgba(79,216,209,.07);border-left:3px solid var(--cyan);padding:10px 14px;border-radius:0 10px 10px 0;font-size:.9rem}\n.utrr-fact b{color:var(--cyan)}\n.utrr-linkbtn{background:none;border:0;color:var(--gold2);cursor:pointer;font-size:.78rem;display:block;margin-top:6px;padding:0}\n.utrr-linkbtn:hover{text-decoration:underline}\n.utrr-book{font-size:.78rem;color:var(--dim);margin:12px 0 0;font-style:italic}\n.utrr-lbl{margin:16px 0 8px;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}\n.utrr-lbl:first-child{margin-top:0}\n.utrr-dim{color:var(--dim);font-size:.8rem}\n.utrr-legends{display:flex;gap:8px;flex-wrap:wrap;max-height:176px;overflow:auto;padding:2px}\n.utrr-lg{display:flex;align-items:center;gap:7px;background:var(--panel);border:1px solid var(--line);color:var(--ink);padding:3px 11px 3px 3px;border-radius:999px;font-size:.76rem;cursor:pointer;transition:border-color .15s}\n.utrr-lg img{width:26px;height:26px;border-radius:50%;object-fit:cover}\n.utrr-lg:hover{border-color:var(--gold)}.utrr-lg.utrr-active{background:var(--gold);color:#221a08;border-color:var(--gold)}\n.utrr-place{background:var(--panel);border:1px solid var(--line);color:var(--ink);padding:6px 12px;border-radius:999px;font-size:.78rem;cursor:pointer}\n.utrr-place:hover{border-color:var(--gold)}\n.utrr-bar{display:flex;height:10px;border-radius:6px;overflow:hidden;background:#0a0b12}\n.utrr-bar i{display:block;height:100%}\n.utrr-leg{display:flex;gap:12px;flex-wrap:wrap;font-size:.72rem;color:var(--dim);margin-top:6px}\n.utrr-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px}\n.utrr-cardshead{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;margin:30px 0 12px}\n.utrr-cardshead h4{font-family:'Friz Quadrata','Cinzel',serif;font-size:1.25rem;margin:0;color:var(--gold2);font-weight:600}\n.utrr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(188px,1fr));gap:20px;margin-top:16px}\n@media(max-width:520px){.utrr-grid{grid-template-columns:repeat(2,1fr);gap:14px}}\n.utrr-grid.utrr-fade{animation:utrr-in .35s ease both}\n.utrr-ctile{background:none;border:0;padding:0;cursor:pointer;text-align:left;color:inherit;display:block;transition:transform .2s ease}\n.utrr-ctile:hover{transform:translateY(-4px)}\n.utrr-cimg{position:relative;border-radius:12px;overflow:hidden;aspect-ratio:5/7;background:linear-gradient(160deg,var(--panel2),var(--panel));border:1px solid var(--line);box-shadow:0 10px 26px rgba(0,0,0,.4)}\n.utrr-cimg img{width:100%;height:100%;object-fit:cover;display:block}\n.utrr-cname{margin-top:8px;font-size:.86rem;font-weight:600;color:var(--ink)}\n.utrr-csnip{font-size:.68rem;color:var(--dim);line-height:1.35;margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n.utrr-cmeta{font-size:.7rem;color:var(--dim);letter-spacing:.06em;text-transform:uppercase;margin-top:2px}\n.utrr-ban{position:absolute;top:8px;right:8px;background:#c0464f;color:#fff;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;padding:3px 7px;border-radius:6px;font-weight:700}\n.utrr-ctile.utrr-land{grid-column:span 2}.utrr-ctile.utrr-land .utrr-cimg{aspect-ratio:518/371}\n.utrr-empty{grid-column:1/-1;text-align:center;color:var(--dim);padding:40px 0}\n.utrr-morerow{text-align:center;margin-top:26px}\n.utrr-foot{font-size:.74rem;color:var(--dim);line-height:1.6;max-width:760px;margin:20px 0 0}\n.utrr-modal{position:fixed;inset:0;background:rgba(6,6,12,.8);backdrop-filter:blur(6px);display:none;align-items:flex-start;justify-content:center;z-index:2147483000;padding:40px 16px;overflow-y:auto}\n.utrr-modal.utrr-open{display:flex}\n.utrr-mbox{background:var(--panel);border:1px solid var(--line);border-radius:18px;max-width:760px;width:100%;position:relative;animation:utrr-in .3s ease both}\n.utrr-mclose{position:absolute;top:10px;right:12px;width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:var(--void);color:var(--ink);font-size:1.3rem;cursor:pointer;z-index:2}\n.utrr-cm{display:grid;grid-template-columns:230px 1fr;gap:26px;padding:30px 32px 32px}\n@media(max-width:640px){.utrr-cm{grid-template-columns:1fr;padding:24px 20px}.utrr-cm-img{max-width:210px}}\n.utrr-cm-img img{width:100%;border-radius:12px;display:block;box-shadow:0 14px 34px rgba(0,0,0,.55)}\n.utrr-cm-body h3{font-family:'Friz Quadrata','Cinzel',serif;margin:6px 0 4px;font-size:1.7rem;font-weight:600;color:#fff}\n.utrr-cm-stats{color:var(--dim);font-size:.84rem;margin-bottom:4px}\n.utrr-printed{border-left:2px solid var(--gold);padding:6px 0 6px 14px;background:rgba(201,163,92,.06);margin:0 0 10px;font-size:.9rem}\n.utrr-flav{margin:0;font-style:italic;color:var(--dim);font-size:.9rem}\n.utrr-ico{display:inline-block;font-size:.68rem;font-weight:700;padding:0 6px;margin:0 1px;border-radius:6px;background:var(--panel2);border:1px solid var(--gold);color:var(--gold2)}\n.utrr-ico.utrr-en{border-radius:50%;min-width:18px;text-align:center;padding:0 4px;background:#111;color:#fff;border-color:#555}\nhtml.utrr-lock{overflow:hidden}\n#utr-regions :focus-visible{outline:2px solid var(--cyan);outline-offset:2px}\n.utrr-reg:focus-visible{outline:none}\n@media(prefers-reduced-motion:reduce){#utr-regions *{animation:none!important;transition:none!important}}\n\n#utr-regions.utrr-embed{background:transparent;overflow:visible}\n#utr-regions.utrr-embed .utrr-bg{display:none}\n#utr-regions.utrr-embed .utrr-hero{padding-top:28px}\n#utr-regions.utrr-embed .utrr-title{font-size:clamp(1.6rem,4vw,2.4rem)}\n\n.utrr-map{position:relative;border:1px solid var(--line);border-radius:18px;overflow:hidden;background:#07101b;box-shadow:0 18px 50px rgba(0,0,0,.5);perspective:1500px;aspect-ratio:1000/640}\n.utrr-stage{width:100%;height:100%;transform-origin:50% 54%;transform:rotateX(var(--utrr-rx,0deg)) rotateY(var(--utrr-ry,0deg)) scale(var(--utrr-sc,1));transition:transform .3s ease-out;will-change:transform}\n.utrr-map.utrr-3d{--utrr-rx:24deg;--utrr-sc:.9}\n.utrr-map.utrr-3d .utrr-stage{--utrr-sc:.9}\n#utrr-svg{display:block;width:100%;height:100%}\n.utrr-3dbtn{position:absolute;top:12px;right:12px;z-index:4}\n.utrr-reg{cursor:pointer;outline:none;--rc:#c9a35c}\n.utrr-lift{transition:transform .22s ease,filter .22s ease}\n.utrr-side{fill:#4a3b2a;fill:color-mix(in srgb,var(--rc) 30%,#1d140a);transition:transform .22s ease}\n.utrr-shape{fill:var(--rc);fill-opacity:.06;stroke:var(--rc);stroke-width:1.6;stroke-opacity:.0;vector-effect:non-scaling-stroke;transition:fill-opacity .2s,stroke-opacity .2s}\n.utrr-reg.utrr-seen .utrr-shape{stroke-opacity:.35}\n.utrr-reg:hover .utrr-lift,.utrr-reg.utrr-on .utrr-lift,.utrr-reg:focus-visible .utrr-lift{transform:translateY(-6px);filter:drop-shadow(0 12px 8px rgba(0,0,0,.55)) drop-shadow(0 0 10px var(--rc))}\n.utrr-reg:hover .utrr-side,.utrr-reg.utrr-on .utrr-side,.utrr-reg:focus-visible .utrr-side{fill:#4a3b2a;fill:color-mix(in srgb,var(--rc) 30%,#1d140a);transition:transform .22s ease}\n.utrr-reg:hover .utrr-shape,.utrr-reg.utrr-on .utrr-shape,.utrr-reg:focus-visible .utrr-shape{fill-opacity:.3;stroke-opacity:1;stroke-width:2.4}\n.utrr-reg.utrr-pin .utrr-shape{fill-opacity:.4}\n.utrr-lab{fill:#fff8e6;font-weight:700;letter-spacing:.14em;font-family:'Friz Quadrata','Cinzel',serif;paint-order:stroke;stroke:#06121c;stroke-width:3.6px;stroke-linejoin:round;pointer-events:none}\n.utrr-quizmode .utrr-lab{opacity:.0}\n.utrr-quizmode .utrr-reg.utrr-right .utrr-lab,.utrr-quizmode .utrr-reg.utrr-wrong .utrr-lab{opacity:1}\n.utrr-reg.utrr-right .utrr-shape{fill:#46b96a;fill-opacity:.55;stroke:#7dffa7;stroke-opacity:1}\n.utrr-reg.utrr-wrong .utrr-shape{fill:#e5484d;fill-opacity:.55;stroke:#ff8a8f;stroke-opacity:1}\n.utrr-reg.utrr-ping .utrr-lift{animation:utrr-hop .9s ease 2}\n@keyframes utrr-hop{0%,100%{transform:translateY(0)}40%{transform:translateY(-12px)}}\n.utrr-tip{position:absolute;left:0;top:0;width:276px;pointer-events:none;opacity:0;transition:opacity .15s;z-index:3;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55)) drop-shadow(0 0 16px rgba(255,214,120,.28))}\n.utrr-tip.utrr-show{opacity:1}\n\n\n\n\n.utrr-top{position:fixed;right:136px;bottom:26px;z-index:2147482000;background:rgba(14,12,26,.92);color:#eae7dc;border:1px solid rgba(201,163,92,.45);border-radius:10px;padding:10px 16px;font-size:.74rem;letter-spacing:.14em;font-weight:600;cursor:pointer;opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity .2s,transform .2s;font-family:'Sora',sans-serif}\n.utrr-top.utrr-show{opacity:1;pointer-events:auto;transform:none}\n.utrr-top:hover{border-color:var(--gold);color:var(--gold2)}\n@media(max-width:700px){.utrr-top{right:112px;bottom:18px}.utrr-map{aspect-ratio:1000/760}}\n\n.utrr-disc{max-width:760px;margin:0 auto 14px;text-align:center;font-size:.72rem;line-height:1.5;color:var(--dim);border:1px solid var(--line);border-radius:10px;padding:8px 14px;background:rgba(22,24,38,.6)}\n.utrr-disc b{color:var(--gold2)}\n\n.utrr-tip-in{position:relative;transform:rotate(-1.4deg);transform-origin:50% 100%}\n.utrr-scroll{position:relative;margin:-5px 13px;padding:26px 22px 24px;text-align:center;color:#3b2a14;line-height:1.42;z-index:0;\n background:\n  linear-gradient(180deg,rgba(60,30,5,.55),rgba(60,30,5,0) 11%,rgba(0,0,0,0) 86%,rgba(60,30,5,.5)),\n  radial-gradient(130% 90% at 50% 38%,rgba(255,246,214,.9),rgba(255,246,214,0) 62%),\n  linear-gradient(90deg,rgba(110,64,16,.55),rgba(110,64,16,0) 11%,rgba(110,64,16,0) 89%,rgba(110,64,16,.55)),\n  url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .22 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\"),\n  linear-gradient(180deg,#ecd49a,#dcbd7e 50%,#c9a35f);\n clip-path:polygon(0 0,100% 0,99.2% 9%,100% 19%,98.8% 30%,100% 42%,99.1% 55%,100% 68%,98.9% 80%,100% 91%,99% 100%,0 100%,1% 91%,0 80%,1.2% 68%,0 55%,.9% 42%,0 30%,1.1% 19%,0 9%)}\n.utrr-scroll::before{content:\"\";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 18% 72%,rgba(120,70,20,.22),transparent 22%),radial-gradient(circle at 84% 30%,rgba(120,70,20,.18),transparent 20%),radial-gradient(circle at 70% 88%,rgba(120,70,20,.16),transparent 18%)}\n.utrr-scroll b{display:block;font-family:'Friz Quadrata','Cinzel',serif;font-size:1.18rem;color:#4e2409;letter-spacing:.05em;text-shadow:0 1px 0 rgba(255,244,210,.7)}\n.utrr-scroll em{display:block;font-size:.72rem;color:#7a4a1c;font-style:italic;margin:1px 0 8px}\n.utrr-scroll em::after{content:\"\\2766\";display:block;color:#9b6a2c;font-style:normal;font-size:.8rem;margin-top:3px;opacity:.85}\n.utrr-scroll p{margin:0 0 9px;font-size:.77rem;color:#3b2a14}\n.utrr-tipgo{display:block;font-size:.72rem;font-weight:700;color:#8a2a1a;border-top:1px solid rgba(90,45,12,.38);padding-top:8px}\n.utrr-roll{display:block;height:24px;margin:0;border-radius:12px;position:relative;z-index:2;\n background:linear-gradient(180deg,#6a4318 0%,#c9a05a 14%,#f6e6b4 34%,#e6c886 54%,#b98a45 80%,#6f4619 100%)}\n.utrr-roll-t{box-shadow:0 7px 9px -2px rgba(40,20,4,.55)}\n.utrr-roll-b{box-shadow:0 -7px 9px -2px rgba(40,20,4,.5)}\n.utrr-roll::before,.utrr-roll::after{content:\"\";position:absolute;top:1px;bottom:1px;width:22px;border-radius:50%;\n background:radial-gradient(circle at 50% 50%,#5a3512 0 12%,#e8cf93 13% 24%,#8a5c26 25% 33%,#f1dca4 34% 46%,#9a6a2e 47% 58%,#d9b772 59% 100%);box-shadow:0 1px 3px rgba(40,20,4,.6)}\n.utrr-roll::before{left:-9px}.utrr-roll::after{right:-9px}\n.utrr-seal{position:absolute;right:12px;bottom:-9px;width:30px;height:30px;border-radius:50%;z-index:3;\n background:radial-gradient(circle at 35% 30%,#d9594c,#9c2a20 55%,#661710);box-shadow:0 3px 5px rgba(40,10,4,.55),inset 0 0 0 3px rgba(255,160,140,.18);\n display:flex;align-items:center;justify-content:center;color:rgba(255,220,200,.85);font-size:.8rem;line-height:1}\n.utrr-tip.utrr-unroll .utrr-scroll{animation:utrr-unroll .34s cubic-bezier(.2,.9,.3,1) both;transform-origin:50% 0}\n@keyframes utrr-unroll{from{transform:scaleY(.1);opacity:.3}to{transform:none;opacity:1}}\n/* Legend bubbles that float above the scroll */\n.utrr-bubs{display:flex;justify-content:center;flex-wrap:wrap-reverse;gap:6px;padding:0 6px 8px;min-height:0;position:relative;z-index:4}\n.utrr-bub{position:relative;width:46px;height:46px;border-radius:50%;padding:0;border:2px solid #e9c46a;background:#1a1426 center/cover no-repeat;cursor:pointer;pointer-events:auto;\n box-shadow:0 6px 12px rgba(0,0,0,.6),0 0 0 3px rgba(18,12,30,.55),0 0 14px rgba(233,196,106,.35);animation:utrr-bob 3.2s ease-in-out infinite;transition:transform .18s,box-shadow .18s}\n.utrr-bub:nth-child(2n){animation-delay:-1.1s}.utrr-bub:nth-child(3n){animation-delay:-2.1s}\n@keyframes utrr-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}\n.utrr-bub img{width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:50% 18%;display:block}\n.utrr-bub:hover,.utrr-bub:focus-visible{animation-play-state:paused;transform:translateY(-12px) scale(1.18);z-index:6;box-shadow:0 12px 20px rgba(0,0,0,.65),0 0 20px rgba(255,214,120,.8);outline:none}\n.utrr-bub span{position:absolute;left:50%;bottom:calc(100% + 8px);transform:translate(-50%,4px);white-space:nowrap;background:#1b1530;color:#f5e3b0;border:1px solid rgba(233,196,106,.65);border-radius:8px;padding:3px 9px;font-size:.7rem;font-weight:600;opacity:0;pointer-events:none;transition:opacity .15s,transform .15s}\n.utrr-bub:hover span,.utrr-bub:focus-visible span{opacity:1;transform:translate(-50%,0)}\n.utrr-bub-more{display:flex;align-items:center;justify-content:center;color:#f5e3b0;font-size:.74rem;font-weight:700;cursor:default}\n@media (prefers-reduced-motion:reduce){.utrr-bub{animation:none}}\n\n.utrr-prog-top b{margin-left:14px;white-space:nowrap}\n.utrr-prog-top span{white-space:nowrap}";
document.head.appendChild(st);
try{
 if(!document.querySelector('link[href*="family=Sora"]')){
  var fl=document.createElement('link'); fl.rel='stylesheet'; fl.href='https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Sora:wght@300;400;500;600;700&display=swap'; document.head.appendChild(fl);
 }
}catch(e){}

mount.innerHTML="<div id=\"utr-regions\">\n <div class=\"utrr-bg\" aria-hidden=\"true\"></div>\n <header class=\"utrr-hero\">\n  <p class=\"utrr-kicker\">Lore Codex \u00b7 Regions &amp; Locations</p>\n  <h2 class=\"utrr-title\">REGIONS OF RUNETERRA</h2>\n  <p class=\"utrr-sub\">Every region and place that shows up on Riftbound cards, and where it sits in the League of Legends world. Hover a region to see its cards. Click to pin it.</p>\n  <div class=\"utrr-tools\">\n   <button type=\"button\" id=\"utrr-surprise\" class=\"utrr-btn\">\ud83e\udded Surprise me</button>\n   <button type=\"button\" id=\"utrr-quizbtn\" class=\"utrr-btn utrr-btn-alt\">Region quiz</button>\n   <div class=\"utrr-prog\" aria-live=\"polite\"><div class=\"utrr-prog-top\"><span>Explorer's passport</span><b id=\"utrr-prog-n\">0 / 14</b></div><div class=\"utrr-prog-track\"><i id=\"utrr-prog-bar\"></i></div><small id=\"utrr-prog-msg\"></small></div>\n  </div>\n </header>\n <section class=\"utrr-mapwrap\" aria-label=\"Interactive map of Runeterra\">\n  <div id=\"utrr-quiz\" class=\"utrr-quiz\" hidden>\n   <div id=\"utrr-qplay\">\n    <div class=\"utrr-qtop\"><span id=\"utrr-qn\"></span><span id=\"utrr-qs\"></span></div>\n    <p class=\"utrr-qclue\" id=\"utrr-qclue\"></p>\n    <p id=\"utrr-qfb\" aria-live=\"polite\"></p>\n    <div class=\"utrr-qbtns\"><button type=\"button\" class=\"utrr-btn utrr-btn-sm\" id=\"utrr-qskip\">Skip</button><button type=\"button\" class=\"utrr-btn utrr-btn-sm utrr-btn-alt\" id=\"utrr-qquit\">Quit</button></div>\n   </div>\n   <div id=\"utrr-qresult\" hidden><p class=\"utrr-qclue\" id=\"utrr-qres\"></p><div class=\"utrr-qbtns\"><button type=\"button\" class=\"utrr-btn utrr-btn-sm\" id=\"utrr-qagain\">Play again</button><button type=\"button\" class=\"utrr-btn utrr-btn-sm utrr-btn-alt\" onclick=\"document.getElementById('utrr-qquit').click()\">Back to the map</button></div></div>\n  </div>\n  <div class=\"utrr-map\">\n   <div class=\"utrr-stage\" id=\"utrr-stage\"><svg id=\"utrr-svg\" viewBox=\"0 0 1000 640\" role=\"group\" aria-label=\"Map of Runeterra regions\" preserveAspectRatio=\"xMidYMid meet\"></svg></div>\n   <button type=\"button\" id=\"utrr-3dbtn\" class=\"utrr-btn utrr-btn-sm utrr-btn-alt utrr-3dbtn\" aria-pressed=\"true\">Flat map</button>\n   <div id=\"utrr-tip\" class=\"utrr-tip\" aria-hidden=\"true\"></div>\n  </div>\n  <p class=\"utrr-hint\">Illustrated map drawn for this site (not Riot artwork, not to scale). Region chips below do the same thing as the map, for keyboards and phones.</p>\n  <p class=\"utrr-disc\"><b>Fan-made and unofficial.</b> Region names, lore and card art belong to Riot Games, Inc. This page is not affiliated with or endorsed by Riot Games, and is for learning and fan enjoyment only.</p>\n  <div class=\"utrr-chiprow utrr-chips\" id=\"utrr-chips\" role=\"group\" aria-label=\"Choose a region\"></div>\n </section>\n <section id=\"utrr-panel\" class=\"utrr-panel\" hidden aria-live=\"polite\">\n  <div class=\"utrr-phead\">\n   <div><p class=\"utrr-where\" id=\"utrr-rwhere\"></p><h3 id=\"utrr-rname\"></h3><p class=\"utrr-tag\" id=\"utrr-rtag\"></p></div>\n   <span class=\"utrr-pinstate\" id=\"utrr-pinstate\"></span>\n  </div>\n  <div class=\"utrr-pgrid\">\n   <div>\n    <p class=\"utrr-blurb\" id=\"utrr-rblurb\"></p>\n    <div class=\"utrr-fact\"><span id=\"utrr-fact\"></span><button type=\"button\" id=\"utrr-factbtn\" class=\"utrr-linkbtn\">Another fact \u2192</button></div>\n    <p class=\"utrr-book\" id=\"utrr-book\"></p>\n   </div>\n   <div>\n    <div class=\"utrr-lbl\">Legends from here <small class=\"utrr-dim\">(tap to filter cards)</small></div>\n    <div class=\"utrr-legends\" id=\"utrr-legends\"></div>\n    <div class=\"utrr-lbl\">Locations on cards</div>\n    <div class=\"utrr-chiprow\" id=\"utrr-places\"></div>\n    <div class=\"utrr-lbl\">Domains in this region</div>\n    <div id=\"utrr-dom\"></div>\n   </div>\n  </div>\n  <div class=\"utrr-cardshead\"><h4>Riftbound cards from this region</h4><span id=\"utrr-count\" class=\"utrr-dim\"></span></div>\n  <div class=\"utrr-chiprow\" id=\"utrr-types\"></div>\n  <div class=\"utrr-grid\" id=\"utrr-grid\"></div>\n  <div class=\"utrr-morerow\"><button type=\"button\" class=\"utrr-btn utrr-btn-alt\" id=\"utrr-more\" hidden>Show more cards</button></div>\n  <p class=\"utrr-foot\" id=\"utrr-stat\">Loading the cards\u2026</p>\n  <p class=\"utrr-foot\">Region summaries are original write-ups based on the League of Legends universe (universe.leagueoflegends.com, including the <i>Realms of Runeterra</i> book) and the League of Legends wiki. Cards are matched by their region tags and by the region of each Legend. Card art and names belong to Riot Games. Unofficial fan project, not affiliated with or endorsed by Riot Games.</p>\n </section>\n <button type=\"button\" id=\"utrr-top\" class=\"utrr-top\" aria-label=\"Back to top\">&uarr; TOP</button>\n <div id=\"utrr-modal\" class=\"utrr-modal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"utrr-mtitle\">\n  <div class=\"utrr-mbox\"><button type=\"button\" id=\"utrr-mclose\" class=\"utrr-mclose\" aria-label=\"Close\">\u00d7</button><div id=\"utrr-mbody\"></div></div>\n </div>\n</div>";
var root=document.getElementById('utr-regions');
if(mount.dataset.bleed==='true') root.classList.add('utrr-bleed');
if(mount.dataset.embed==='true') root.classList.add('utrr-embed');
function sbw(){ root.style.setProperty('--utrr-sbw',(window.innerWidth-document.documentElement.clientWidth)+'px'); }
sbw(); window.addEventListener('resize',sbw);

var $=function(s,r){return (r||root).querySelector(s);};
var $$=function(s,r){return Array.prototype.slice.call((r||root).querySelectorAll(s));};
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtText(s){ return esc(s).replace(/\[(\d+)\]/g,'<span class="utrr-ico utrr-en">$1</span>').replace(/\[([A-Za-z]+)\]/g,'<span class="utrr-ico">$1</span>').replace(/\n/g,'<br>'); }

/* ---------- state ---------- */
var REGIONS=REG_DATA.regions, REG={}, TAGMAP={};
REGIONS.forEach(function(r){ REG[r.id]=r; TAGMAP[r.tag.toLowerCase()]=r.id; r.cards=[]; r.legends=[]; });
var CARDS=[], CHAMPS=[], TEXT={}, LOADED=false;
var cur=null, pinned=false, filterType='All', filterChamp=null, shown=24, hoverT=null;
var visited={}; var STORE_KEY='utrr-visited-v1';
try{ var sv=JSON.parse(localStorage.getItem(STORE_KEY)||'{}'); if(sv&&typeof sv==='object') visited=sv; }catch(e){}
function saveVisited(){ try{ localStorage.setItem(STORE_KEY,JSON.stringify(visited)); }catch(e){} }

/* ---------- map ---------- */
var BASE_URL='';
try{ BASE_URL=URL.createObjectURL(new Blob([baseSVG()],{type:'image/svg+xml'})); }catch(e){ BASE_URL=''; }
function clipDefs(){
 var s=''; Object.keys(CPATH).forEach(function(k){ s+='<clipPath id="cc-'+k+'"><path d="'+CPATH[k]+'"/></clipPath>'; });
 Object.keys(SHAPES).forEach(function(id){ s+='<clipPath id="cr-'+id+'">'+SHAPES[id].paths.map(function(d){return '<path d="'+d+'"/>';}).join('')+'</clipPath>'; });
 return s;
}
function animDeco(id){
 var d=MAPDEF[id], x=d.lab[0], y=d.lab[1];
 if(id==='piltover') return '<circle cx="'+(x-30)+'" cy="'+(y+34)+'" r="14" fill="none" stroke="#f6dc98" stroke-width="1.4" stroke-dasharray="4 4" class="utrr-spin"/>';
 if(id==='zaun') return '<ellipse cx="'+(x+14)+'" cy="'+(y-36)+'" rx="34" ry="11" fill="#8ff0c0" opacity=".2" class="utrr-drift"/>';
 if(id==='shadow') return '<ellipse cx="'+x+'" cy="'+(y+10)+'" rx="62" ry="22" fill="#b6ffe6" opacity=".16" class="utrr-drift"/><ellipse cx="'+(x-8)+'" cy="'+(y-22)+'" rx="40" ry="12" fill="#b6ffe6" opacity=".14" class="utrr-drift2"/>';
 if(id==='targon') return '<circle cx="'+(x+4)+'" cy="'+(y-82)+'" r="3.2" fill="#fff" class="utrr-twinkle"/><circle cx="'+(x-26)+'" cy="'+(y-60)+'" r="2" fill="#fff" class="utrr-twinkle"/>';
 if(id==='icathia') return '<path d="M'+(x-8)+','+(y-12)+' l6,8 l-5,5 l8,9" stroke="#e2b8ff" stroke-width="1.6" fill="none" class="utrr-twinkle"/>';
 if(id==='bandle') return '<circle cx="'+x+'" cy="'+y+'" r="46" fill="none" stroke="#ffe3f7" stroke-opacity=".8" stroke-dasharray="3 6" class="utrr-spin"/><path d="M'+(x-14)+','+(y-12)+' l3,-9 l3,9 l9,3 l-9,3 l-3,9 l-3,-9 l-9,-3z" fill="#fff0fb" class="utrr-twinkle"/>';
 if(id==='void') return '<g class="utrr-spin"><path d="M'+x+','+(y-8)+' a8,8 0 1 1 -8,8 a16,16 0 1 1 16,16 a26,26 0 1 1 -26,-26 a38,38 0 1 1 38,38" stroke="#d2b4ff" stroke-width="1.6" fill="none" opacity=".85"/></g><circle cx="'+x+'" cy="'+y+'" r="6" fill="#07030f"/>';
 return '';
}
var svgParts=[];
DRAW_ORDER.forEach(function(id){
 var r=REG[id], d=MAPDEF[id]; if(!r||!d) return;
 var sh=SHAPES[id].paths.map(function(p){return '<path class="utrr-shape" d="'+p+'"/>';}).join('');
 var side=SHAPES[id].paths.map(function(p){return '<path class="utrr-side" d="'+p+'"/>';}).join('');
 var tex=BASE_URL?'<use href="#utrr-base"/>':'';
 var inner='<g clip-path="url(#cr-'+id+')">'+tex+sh+'</g>';
 var face=d.c?'<g clip-path="url(#cc-'+d.c+')">'+inner+'</g>':inner;
 var sideG=d.c?'<g clip-path="url(#cc-'+d.c+')">'+side+'</g>':side;
 var lines=r.name.length>11&&r.name.indexOf(' ')>0?r.name.split(' '):[r.name];
 var fs=d.fs||14;
 var lab='<text class="utrr-lab" style="font-size:'+fs+'px" x="'+d.lab[0]+'" y="'+d.lab[1]+'" text-anchor="middle">'+lines.map(function(t,i){return '<tspan x="'+d.lab[0]+'" dy="'+(i?'1.1em':(lines.length>1?'-.35em':'.35em'))+'">'+esc(t.toUpperCase())+'</tspan>';}).join('')+'</text>';
 svgParts.push('<g class="utrr-reg" id="utrr-reg-'+id+'" data-id="'+id+'" tabindex="0" role="button" aria-label="'+esc(r.name)+'" style="--rc:'+r.color+'"><g class="utrr-lift">'+sideG+face+'<g pointer-events="none">'+animDeco(id)+'</g>'+lab+'<circle class="utrr-anchor" cx="'+d.lab[0]+'" cy="'+(d.lab[1]-4)+'" r="1" fill="none" pointer-events="none"/></g></g>');
});
$('#utrr-svg').innerHTML='<defs>'+clipDefs()+(BASE_URL?'<image id="utrr-base" href="'+BASE_URL+'" x="0" y="0" width="1000" height="640" preserveAspectRatio="none"/>':'')+'</defs>'
 +(BASE_URL?'<use href="#utrr-base"/>':'<rect width="1000" height="640" fill="#0e2233"/>')+svgParts.join('');

/* 3D view: gentle tilt that follows the pointer; toggle for a flat map */
var stage=$('#utrr-stage'), mapEl=$('.utrr-map'), tiltRaf=0, is3d=true;
try{ if(window.matchMedia&&(matchMedia('(pointer:coarse)').matches||matchMedia('(max-width:700px)').matches)) is3d=false; }catch(e){}
function apply3d(){ cancelAnimationFrame(tiltRaf); mapEl.classList.toggle('utrr-3d',is3d); $('#utrr-3dbtn').textContent=is3d?'Flat map':'3D map'; $('#utrr-3dbtn').setAttribute('aria-pressed',is3d); if(!is3d){ stage.style.setProperty('--utrr-ry','0deg'); stage.style.setProperty('--utrr-rx','0deg'); } else { stage.style.removeProperty('--utrr-rx'); } }
$('#utrr-3dbtn').addEventListener('click',function(){ is3d=!is3d; apply3d(); if(cur) placeTip(cur); });
mapEl.addEventListener('pointermove',function(e){
 if(e.pointerType!=='touch'){ lastPtr={x:e.clientX,y:e.clientY,t:Date.now()}; }
 if(!is3d||e.pointerType==='touch') return;
 var b=mapEl.getBoundingClientRect(), px=(e.clientX-b.left)/b.width-.5, py=(e.clientY-b.top)/b.height-.5;
 cancelAnimationFrame(tiltRaf); tiltRaf=requestAnimationFrame(function(){ if(!is3d) return; stage.style.setProperty('--utrr-ry',(px*9).toFixed(2)+'deg'); stage.style.setProperty('--utrr-rx',(24-py*5).toFixed(2)+'deg'); });
});
mapEl.addEventListener('pointerleave',function(){ if(is3d){ stage.style.setProperty('--utrr-ry','0deg'); stage.style.removeProperty('--utrr-rx'); setTimeout(function(){ if(cur) placeTip(cur); },280); } });
apply3d();

/* tooltip sits on the hovered region (measured on screen, so it stays right in 3D) */
var lastPtr={x:0,y:0,t:0};
function posTip(px,py){
 var tip=$('#utrr-tip'), mr=mapEl.getBoundingClientRect(), w=tip.offsetWidth, h=tip.offsetHeight;
 var x=px-mr.left, y=py-mr.top, left=x+26;
 var flip=left+w>mr.width-8;
 if(flip) left=x-26-w;
 left=Math.max(8,Math.min(mr.width-w-8,left));
 var top=Math.max(8,Math.min(mr.height-h-8,y-h/2));
 tip.style.left=left+'px'; tip.style.top=top+'px';
 tip.classList.toggle('utrr-left',flip);
}
function placeTip(id,mode){
 if(typeof quiz!=='undefined'&&quiz.on){ hideTip(); return; }
 var tip=$('#utrr-tip'), r=REG[id], g=$('#utrr-reg-'+id); if(!r||!g) return;
 var first=String(r.blurb||'').split(/(?<=\.)\s/)[0];
 var n=r.cards.length;
 var lg=r.legends||[], MAXB=6;
 var bubs=lg.slice(0,MAXB).map(function(c){ return '<button type="button" class="utrr-bub" data-champ="'+esc(c.name)+'" aria-label="'+esc(c.name)+' cards"><img src="'+esc(c.img)+'" alt=""><span>'+esc(c.name)+'</span></button>'; }).join('')+(lg.length>MAXB?'<span class="utrr-bub utrr-bub-more">+'+(lg.length-MAXB)+'</span>':'');
 if(tip.matches(':hover')&&tip.dataset.id===id&&mode!=='switch') return;
 tip.innerHTML=(bubs?'<div class="utrr-bubs">'+bubs+'</div>':'')+'<div class="utrr-tip-in"><i class="utrr-roll utrr-roll-t"></i><div class="utrr-scroll"><b>'+esc(r.name)+'</b><em>'+esc(r.tagline||'')+'</em><p>'+esc(first)+'</p><span class="utrr-tipgo">'+(mode==='switch'?'Click to switch to '+esc(r.name):(LOADED?'See '+n+' card'+(n===1?'':'s')+' from this region \u2193':'Loading cards\u2026'))+'</span></div><i class="utrr-roll utrr-roll-b"></i><i class="utrr-seal">\u2726</i></div>';
 var wasShown=tip.classList.contains('utrr-show');
 tip.classList.add('utrr-show');
 if(!wasShown||tip.dataset.id!==id){ tip.classList.remove('utrr-unroll'); void tip.offsetWidth; tip.classList.add('utrr-unroll'); }
 tip.dataset.id=id;
 if(Date.now()-lastPtr.t<700){ posTip(lastPtr.x,lastPtr.y); }
 else { var br=g.querySelector('.utrr-anchor').getBoundingClientRect(); posTip(br.left+30,br.top); }
}

/* ---------- selecting regions ---------- */
function updateProgress(){
 var n=Object.keys(visited).filter(function(k){return REG[k];}).length, t=REGIONS.length;
 $('#utrr-prog-n').textContent=n+' / '+t; $('#utrr-prog-bar').style.width=(n/t*100)+'%';
 $('#utrr-prog-msg').textContent=n>=t?'Cartographer of Runeterra! You have explored every region.':(n===0?'Hover or tap a region to begin your journey.':'Keep exploring: '+(t-n)+' region'+((t-n)===1?'':'s')+' to go.');
 $$('.utrr-chip-reg').forEach(function(b){ b.classList.toggle('utrr-seen',!!visited[b.dataset.id]); });
 $$('.utrr-reg').forEach(function(g){ g.classList.toggle('utrr-seen',!!visited[g.dataset.id]); });
}
function setRegion(id,pin,auto){
 if(quiz.on) return;
 var changed=(cur!==id);
 cur=id; if(pin!==undefined) pinned=pin;
 $$('.utrr-reg').forEach(function(g){ g.classList.toggle('utrr-on',g.dataset.id===id); g.classList.toggle('utrr-pin',pinned&&g.dataset.id===id); });
 $$('.utrr-chip-reg').forEach(function(b){ b.classList.toggle('utrr-active',b.dataset.id===id); b.setAttribute('aria-pressed',b.dataset.id===id); });
 placeTip(id);
 if(!auto&&!visited[id]){ visited[id]=1; saveVisited(); }
 updateProgress();
 if(changed){ filterType='All'; filterChamp=null; shown=24; renderPanel(); }
 else { $('#utrr-pinstate').textContent=pinned?'Pinned: click the region again to unpin':'Hovering: click to pin'; }
}
$('#utrr-tip').addEventListener('click',function(e){
 var b=e.target.closest&&e.target.closest('.utrr-bub[data-champ]'); if(!b) return;
 var id=this.dataset.id; if(!id) return;
 setRegion(id,true); filterChamp=b.dataset.champ; shown=24; renderPanel();
 var p=$('#utrr-grid'); if(p) p.scrollIntoView({behavior:'smooth',block:'nearest'});
});
function hideTip(){ $('#utrr-tip').classList.remove('utrr-show'); }

$('#utrr-svg').addEventListener('pointerover',function(e){
 var g=e.target.closest&&e.target.closest('.utrr-reg'); if(!g||quiz.on) return;
 if(e.pointerType==='touch') return;
 if(pinned) { showTipOnly(g.dataset.id); return; }
 clearTimeout(hoverT); hoverT=setTimeout(function(){ setRegion(g.dataset.id); },(cur&&cur!==g.dataset.id)?220:70);
});
function showTipOnly(id){ placeTip(id,'switch'); }
$('#utrr-svg').addEventListener('pointerout',function(e){
 clearTimeout(hoverT);
 var to=e.relatedTarget; if(to&&to.closest&&to.closest('.utrr-reg')) return;
 if(pinned&&cur){ setTipBack(); } else if(!quiz.on&&!cur){ hideTip(); }
});
function setTipBack(){ placeTip(cur); }
$('#utrr-svg').addEventListener('click',function(e){
 var g=e.target.closest&&e.target.closest('.utrr-reg');
 if(!g){ if(!quiz.on&&pinned){ pinned=false; setRegion(cur,false); } return; }
 var id=g.dataset.id;
 if(quiz.on){ answerQuiz(id); return; }
 if(pinned&&cur===id){ pinned=false; setRegion(id,false); return; }
 setRegion(id,true);
 if(window.matchMedia&&matchMedia('(max-width:900px)').matches){ setTimeout(function(){ var p=$('#utrr-panel'); if(p&&p.getBoundingClientRect().top>window.innerHeight*.8) p.scrollIntoView({behavior:'smooth',block:'start'}); },60); }
});
$('#utrr-svg').addEventListener('keydown',function(e){
 var g=e.target.closest&&e.target.closest('.utrr-reg'); if(!g) return;
 if(e.key==='Enter'||e.key===' '){ e.preventDefault(); if(quiz.on) answerQuiz(g.dataset.id); else setRegion(g.dataset.id,true); }
});
$('#utrr-svg').addEventListener('focusin',function(e){ var g=e.target.closest&&e.target.closest('.utrr-reg'); if(g&&!quiz.on&&!pinned) setRegion(g.dataset.id); });

/* region chips under the map */
$('#utrr-chips').innerHTML=REGIONS.map(function(r){ return '<button type="button" class="utrr-chip utrr-chip-reg" data-id="'+r.id+'" aria-pressed="false" style="--rc:'+r.color+'"><i></i>'+esc(r.name)+'<em class="utrr-cnt" data-cnt="'+r.id+'"></em></button>'; }).join('');
$('#utrr-chips').addEventListener('click',function(e){
 var b=e.target.closest('.utrr-chip-reg'); if(!b) return;
 if(quiz.on){ answerQuiz(b.dataset.id); return; }
 setRegion(b.dataset.id,true);
});

/* ---------- panel ---------- */
function champsOf(id){ return REG[id].legends; }
function visibleCards(){
 var r=REG[cur]; if(!r) return [];
 return r.cards.filter(function(c){
  if(filterType!=='All'&&c.type!==filterType) return false;
  if(filterChamp&&!(c.tags.indexOf(filterChamp)>-1||c.name.toLowerCase().indexOf(filterChamp.toLowerCase())===0)) return false;
  return true;
 });
}
function tileHTML(c){
 return '<button type="button" class="utrr-ctile'+(c.type==='Battlefield'?' utrr-land':'')+'" data-card="'+esc(c.id)+'" aria-label="'+esc(c.name)+'">'
  +'<div class="utrr-cimg"><img src="'+esc(c.img)+'" alt="'+esc(c.name)+'" loading="lazy">'+(c.banned?'<span class="utrr-ban">Banned</span>':'')+'</div>'
  +'<div class="utrr-cname">'+esc(c.name)+'</div>'
  +(c.text?'<div class="utrr-csnip">'+esc(String(c.text).replace(/\[(\d+)\]/g,'($1)').replace(/\[([A-Za-z]+)\]/g,'$1').replace(/\n/g,' '))+'</div>':'')
  +'<div class="utrr-cmeta">'+c.domain.map(function(d){return '<span class="utrr-dot" style="background:'+(DOM_COL[d]||'#999')+'"></span>';}).join('')+(c.signature?'Signature ':'')+esc(c.type==='Champion'?'Champion unit':c.type)+' · '+esc(c.set)+'</div></button>';
}
function renderGrid(){
 var list=visibleCards(), grid=$('#utrr-grid');
 grid.innerHTML=list.length?list.slice(0,shown).map(tileHTML).join(''):'<div class="utrr-empty">'+(LOADED?'No cards match these filters.':'Loading the cards…')+'</div>';
 grid.classList.remove('utrr-fade'); void grid.offsetWidth; grid.classList.add('utrr-fade');
 var more=$('#utrr-more'); more.hidden=list.length<=shown; more.textContent='Show more cards ('+(list.length-shown)+' left)';
 $('#utrr-count').textContent='Showing '+Math.min(shown,list.length)+' of '+list.length+' cards';
}
function renderFilters(){
 var r=REG[cur], counts={All:r.cards.length};
 r.cards.forEach(function(c){ counts[c.type]=(counts[c.type]||0)+1; });
 $('#utrr-types').innerHTML=['All'].concat(TYPE_ORDER.filter(function(t){return counts[t];})).map(function(t){
  return '<button type="button" class="utrr-chip'+(filterType===t?' utrr-active':'')+'" data-type="'+t+'">'+(t==='All'?'All':TYPE_LABEL[t])+' <em>'+counts[t]+'</em></button>';
 }).join('');
}
function renderPanel(){
 var r=REG[cur]; if(!r) return;
 var p=$('#utrr-panel'); p.style.setProperty('--rc',r.color); p.hidden=false;
 $('#utrr-rname').textContent=r.name;
 $('#utrr-rtag').textContent=r.tagline;
 $('#utrr-rwhere').textContent=r.where;
 $('#utrr-pinstate').textContent=pinned?'Pinned: click the region again to unpin':'Hovering: click to pin';
 $('#utrr-rblurb').textContent=r.blurb;
 var fi=Math.floor(Math.random()*r.facts.length);
 $('#utrr-fact').innerHTML='<b>Did you know?</b> '+esc(r.facts[fi]); $('#utrr-fact').dataset.i=fi;
 $('#utrr-book').textContent=r.book||'';
 /* legends of this region */
 var lg=r.legends;
 $('#utrr-legends').innerHTML=lg.length?lg.map(function(c){ return '<button type="button" class="utrr-lg'+(filterChamp===c.name?' utrr-active':'')+'" data-champ="'+esc(c.name)+'" title="Show only '+esc(c.name)+' cards"><img src="'+esc(c.img)+'" alt="" loading="lazy"><span>'+esc(c.name)+'</span></button>'; }).join(''):'<span class="utrr-dim">No Legends from here are in the card data yet.</span>';
 /* places */
 var places=r.cards.filter(function(c){ return c.type==='Battlefield'; });
 $('#utrr-places').innerHTML=places.length?places.map(function(c){ return '<button type="button" class="utrr-place" data-card="'+esc(c.id)+'">📍 '+esc(c.name)+'</button>'; }).join(''):'<span class="utrr-dim">No battlefield card is named after a place here yet.</span>';
 /* domain bar */
 var dc={},tot=0; r.cards.forEach(function(c){ c.domain.forEach(function(d){ dc[d]=(dc[d]||0)+1; tot++; }); });
 var ds=Object.keys(dc).sort(function(a,b){return dc[b]-dc[a];});
 $('#utrr-dom').innerHTML=tot?'<div class="utrr-bar">'+ds.map(function(d){return '<i style="width:'+(dc[d]/tot*100)+'%;background:'+(DOM_COL[d]||'#999')+'" title="'+d+': '+dc[d]+'"></i>';}).join('')+'</div><div class="utrr-leg">'+ds.map(function(d){return '<span><span class="utrr-dot" style="background:'+(DOM_COL[d]||'#999')+'"></span>'+d+' '+dc[d]+'</span>';}).join('')+'</div>':'<span class="utrr-dim">'+(LOADED?'No cards yet.':'Loading…')+'</span>';
 renderFilters(); renderGrid();
}
$('#utrr-types').addEventListener('click',function(e){ var b=e.target.closest('[data-type]'); if(!b) return; filterType=b.dataset.type; shown=24; renderFilters(); renderGrid(); });
$('#utrr-legends').addEventListener('click',function(e){ var b=e.target.closest('[data-champ]'); if(!b) return; filterChamp=(filterChamp===b.dataset.champ)?null:b.dataset.champ; shown=24; $$('.utrr-lg').forEach(function(x){x.classList.toggle('utrr-active',x.dataset.champ===filterChamp);}); renderGrid(); $('#utrr-grid').scrollIntoView({behavior:'smooth',block:'nearest'}); });
$('#utrr-more').addEventListener('click',function(){ shown+=24; renderGrid(); });
$('#utrr-factbtn').addEventListener('click',function(){ var r=REG[cur]; if(!r) return; var i=(parseInt($('#utrr-fact').dataset.i||0,10)+1)%r.facts.length; $('#utrr-fact').dataset.i=i; $('#utrr-fact').innerHTML='<b>Did you know?</b> '+esc(r.facts[i]); });
$('#utrr-places').addEventListener('click',function(e){ var b=e.target.closest('[data-card]'); if(b) openCard(b.dataset.card); });
$('#utrr-grid').addEventListener('click',function(e){ var b=e.target.closest('[data-card]'); if(b) openCard(b.dataset.card); });

/* ---------- card modal ---------- */
var CARD_BY_ID={};
function textKey(c){ var m=String(c.cn||'').match(/^([A-Za-z]*)(\d+)/); if(!m) return (c.setCode||'')+'-'; return (c.setCode||'')+'-'+m[1].toUpperCase()+m[2].padStart(m[1]?2:3,'0'); }
var lastFocus=null;
function openCard(id){
 var c=CARD_BY_ID[id]; if(!c) return;
 lastFocus=document.activeElement;
 var t=TEXT[textKey(c).toUpperCase()]||TEXT[String(c.id).toUpperCase()]||{};
 var txt=c.text||t.text, regs=c.regions.map(function(k){ return '<button type="button" class="utrr-chip utrr-chip-sm" data-goto="'+k+'" style="--rc:'+REG[k].color+'"><i></i>'+esc(REG[k].name)+'</button>'; }).join('');
 var stats=[]; if(c.cost!=null) stats.push(c.cost+' energy'); if(c.might!=null) stats.push(c.might+' might'); if(c.power!=null) stats.push(c.power+' power');
 $('#utrr-mbody').innerHTML='<div class="utrr-cm"><div class="utrr-cm-img"><img src="'+esc(c.img)+'" alt="'+esc(c.name)+'"></div><div class="utrr-cm-body">'
  +'<h3 id="utrr-mtitle">'+esc(c.name)+'</h3>'
  +'<div class="utrr-cm-stats">'+esc((c.signature?'Signature ':'')+(c.type==='Champion'?'Champion unit':c.type))+' · '+esc(c.set)+(c.number?' · #'+esc(c.number):'')+(c.rarity?' · '+esc(c.rarity):'')+'</div>'
  +'<div class="utrr-cm-stats">'+c.domain.map(function(d){return '<span class="utrr-dot" style="background:'+(DOM_COL[d]||'#999')+'"></span>'+esc(d);}).join(' &nbsp; ')+(stats.length?' &nbsp;·&nbsp; '+esc(stats.join(' · ')):'')+'</div>'
  +(txt?'<div class="utrr-lbl">Card text</div><p class="utrr-printed">'+fmtText(txt)+'</p>':'')
  +(t.lore?'<div class="utrr-lbl">Flavor</div><p class="utrr-flav">'+esc(t.lore)+'</p>':'')
  +'<div class="utrr-lbl">Connected regions</div><div class="utrr-chiprow">'+regs+'</div>'
  +(c.type==='Battlefield'?'<p class="utrr-dim" style="margin-top:12px">A battlefield card named after a place in the world.</p>':'')
  +'</div></div>';
 var ov=$('#utrr-modal'); ov.classList.add('utrr-open'); document.documentElement.classList.add('utrr-lock');
 $('#utrr-mclose').focus();
}
function closeCard(){ $('#utrr-modal').classList.remove('utrr-open'); document.documentElement.classList.remove('utrr-lock'); if(lastFocus&&lastFocus.focus) try{lastFocus.focus();}catch(e){} }
$('#utrr-modal').addEventListener('click',function(e){
 if(e.target.id==='utrr-modal'||e.target.id==='utrr-mclose'||e.target.closest('#utrr-mclose')){ closeCard(); return; }
 var g=e.target.closest('[data-goto]'); if(g){ closeCard(); setRegion(g.dataset.goto,true); $('#utrr-svg').scrollIntoView({behavior:'smooth',block:'center'}); }
});
document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&$('#utrr-modal').classList.contains('utrr-open')) closeCard(); });

/* ---------- surprise + quiz ---------- */
$('#utrr-surprise').addEventListener('click',function(){
 if(quiz.on) return;
 var pool=REGIONS.filter(function(r){return !visited[r.id]&&r.id!==cur;}); if(!pool.length) pool=REGIONS.filter(function(r){return r.id!==cur;});
 var r=pool[Math.floor(Math.random()*pool.length)]; setRegion(r.id,true);
 var g=$('#utrr-reg-'+r.id); if(g){ g.classList.remove('utrr-ping'); void g.getBoundingClientRect(); g.classList.add('utrr-ping'); }
});
var quiz={on:false,i:0,score:0,order:[],clue:'',lock:false};
var ROUNDS=6;
function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
$('#utrr-quizbtn').addEventListener('click',function(){ if(quiz.on) endQuiz(true); else startQuiz(); });
$('#utrr-qquit').addEventListener('click',function(){ endQuiz(true); });
$('#utrr-qskip').addEventListener('click',function(){ if(quiz.lock) return; nextRound(); });
function startQuiz(){
 quiz.on=true; quiz.i=0; quiz.score=0; quiz.order=shuffle(REGIONS.map(function(r){return r.id;})).slice(0,ROUNDS);
 clearTimeout(hoverT); hideTip(); $$('.utrr-reg').forEach(function(g){ g.classList.remove('utrr-on','utrr-pin'); });
 root.classList.add('utrr-quizmode'); $('#utrr-quizbtn').textContent='Stop quiz'; $('#utrr-quiz').hidden=false; $('#utrr-qresult').hidden=true; $('#utrr-qplay').hidden=false;
 showRound();
}
function showRound(){
 var id=quiz.order[quiz.i], r=REG[id]; quiz.lock=false;
 quiz.clue=r.clues[Math.floor(Math.random()*r.clues.length)];
 $('#utrr-qn').textContent='Question '+(quiz.i+1)+' of '+quiz.order.length;
 $('#utrr-qs').textContent='Score '+quiz.score; hideTip();
 $('#utrr-qclue').textContent=quiz.clue;
 $('#utrr-qfb').textContent='Click the region on the map (or use the buttons under it).'; $('#utrr-qfb').className='';
 $$('.utrr-reg').forEach(function(g){ g.classList.remove('utrr-right','utrr-wrong'); });
}
function answerQuiz(id){
 if(!quiz.on||quiz.lock) return; quiz.lock=true;
 var want=quiz.order[quiz.i], fb=$('#utrr-qfb');
 var gw=$('#utrr-reg-'+want), gi=$('#utrr-reg-'+id);
 if(id===want){ quiz.score++; gw.classList.add('utrr-right'); fb.textContent='Correct! That is '+REG[want].name+'.'; fb.className='utrr-ok'; }
 else { gi.classList.add('utrr-wrong'); gw.classList.add('utrr-right'); fb.textContent='Not quite. That is '+REG[id].name+'; the answer is '+REG[want].name+'.'; fb.className='utrr-bad'; }
 visited[want]=1; saveVisited(); updateProgress();
 $('#utrr-qs').textContent='Score '+quiz.score;
 setTimeout(function(){ if(quiz.on) nextRound(); },1700);
}
function nextRound(){
 quiz.i++;
 if(quiz.i>=quiz.order.length){ finishQuiz(); return; }
 showRound();
}
function finishQuiz(){
 var n=quiz.order.length, s=quiz.score;
 var rank=s===n?'Master Cartographer':s>=n-1?'Seasoned Wayfinder':s>=Math.ceil(n/2)?'Road-weary Traveler':'Fresh Recruit';
 $('#utrr-qplay').hidden=true; $('#utrr-qresult').hidden=false;
 $('#utrr-qres').innerHTML='<b>'+s+' / '+n+'</b> · '+rank;
 $$('.utrr-reg').forEach(function(g){ g.classList.remove('utrr-right','utrr-wrong'); });
}
$('#utrr-qagain').addEventListener('click',function(){ startQuiz(); });
function endQuiz(){
 quiz.on=false; root.classList.remove('utrr-quizmode'); $('#utrr-quizbtn').textContent='Region quiz'; $('#utrr-quiz').hidden=true;
 $$('.utrr-reg').forEach(function(g){ g.classList.remove('utrr-right','utrr-wrong'); });
 if(cur) setRegion(cur,pinned);
}

/* ---------- data ---------- */
function getJSON(u){ return fetch(u).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); }); }
function regionOfTag(t){ t=TAG_FIX[t]||t; return TAGMAP[String(t).toLowerCase()]||null; }
function buildCards(rowsBySet){
 var groups={};
 rowsBySet.forEach(function(rows){
  (rows||[]).forEach(function(x){
   if(!x||(x.la&&x.la!=='English')) return;
   var ty=String(x.ty||''); if(/rune|token/i.test(ty)||!ty) return;
   var sig=/^Signature/.test(ty);
   var type=/^Legend/i.test(ty)?'Legend':/Champion/i.test(ty)?'Champion':/Battlefield/i.test(ty)?'Battlefield':/Spell/.test(ty)?'Spell':/Gear/.test(ty)?'Gear':'Unit';
   var rawTags=String(x.tg||'').split(',').map(function(s){return s.trim();}).filter(Boolean);
   var cn=String(x.cn||'');
   var c={id:x.id,name:x.nm,setCode:x.se,set:SET_NAME[x.se]||x.se,cn:cn,number:cn+(SET_TOTAL[x.se]&&/^\d/.test(cn)?'/'+SET_TOTAL[x.se]:''),type:type,signature:sig,
    domain:String(x.do||'').split(',').map(function(s){return s.trim();}).filter(Boolean),cost:x.en===''?null:x.en,might:x.mi===''?null:x.mi,power:x.po===''?null:x.po,
    tags:rawTags.filter(function(s){return s!=='BANNED';}).map(function(s){return TAG_FIX[s]||s;}),banned:rawTags.indexOf('BANNED')>-1,rarity:x.ra||'',img:x.img,regions:[]};
   var isAA=/\s+AA$/i.test(c.name); var alt=isAA||/[a-z*]$/i.test(cn)||/showcase|overnumber|alternate/i.test(c.rarity);
   var k=c.setCode+'|'+c.name.replace(/\s+AA$/i,'').toLowerCase(), g=groups[k]||(groups[k]=[]); c._alt=alt; g.push(c);
  });
 });
 var out=[];
 Object.keys(groups).forEach(function(k){ var l=groups[k]; l.sort(function(a,b){ return (a._alt-b._alt)||((parseInt(a.cn)||0)-(parseInt(b.cn)||0)); }); out.push(l[0]); });
 return out;
}
function classify(){
 var byChamp={};
 CHAMPS.forEach(function(ch){
  var base=String(ch.region||'').replace(/\s*\(.*$/,'').trim(); var rid=regionOfTag(base);
  byChamp[ch.name.toLowerCase()]={ch:ch,rid:rid};
  if(rid&&ch.name!=='Poro'&&REG[rid].legends.indexOf(ch)<0) REG[rid].legends.push(ch);
 });
 var places={}; REGIONS.forEach(function(r){ (r.places||[]).forEach(function(p){ places[p.toLowerCase()]=r.id; }); });
 CARDS.forEach(function(c){
  var set={};
  c.tags.forEach(function(t){
   var rid=regionOfTag(t); if(rid) set[rid]=1;
   var ce=byChamp[t.toLowerCase()]; if(ce&&ce.rid&&t!=='Poro') set[ce.rid]=1;
  });
  if(c.type==='Battlefield'&&places[c.name.toLowerCase()]) set[places[c.name.toLowerCase()]]=1;
  c.regions=Object.keys(set);
  c.regions.forEach(function(k){ REG[k].cards.push(c); });
  CARD_BY_ID[c.id]=c;
 });
 var setOrder=Object.keys(SET_NAME);
 REGIONS.forEach(function(r){
  r.cards.sort(function(a,b){ return TYPE_ORDER.indexOf(a.type)-TYPE_ORDER.indexOf(b.type)||setOrder.indexOf(a.setCode)-setOrder.indexOf(b.setCode)||(parseInt(a.cn)||0)-(parseInt(b.cn)||0); });
  r.legends.sort(function(a,b){ return a.name.localeCompare(b.name); });
 });
}
function afterLoad(){
 LOADED=true; classify();
 REGIONS.forEach(function(r){ var e=$('[data-cnt="'+r.id+'"]'); if(e) e.textContent=r.cards.length; });
 $('#utrr-stat').textContent=CARDS.length+' cards matched to '+REGIONS.length+' regions and locations';
 if(cur){ var id=cur; cur=null; setRegion(id,pinned,true); } 
}
Promise.all([
 Promise.all(SETS.map(function(s){ return getJSON(BASE+s+'.json').catch(function(){return [];}); })),
 getJSON(BASE+'codex/champs.json').catch(function(){return [];}),
 getJSON(BASE+'cardtext.json').catch(function(){return {};}),
 getJSON(BASE+'codex/regions/regions.json').catch(function(){return null;})
]).then(function(res){
 var rows=res[0]; CHAMPS=Array.isArray(res[1])?res[1]:[]; var tx=res[2]||{}; Object.keys(tx).forEach(function(k){ TEXT[k.toUpperCase()]=tx[k]; });
 var ov=res[3]; if(ov&&ov.regions){ ov.regions.forEach(function(o){ var r=REG[o.id]; if(!r) return; ['blurb','tagline','where','book'].forEach(function(f){ if(o[f]) r[f]=o[f]; }); ['facts','clues','places'].forEach(function(f){ if(Array.isArray(o[f])&&o[f].length||f==='places'&&Array.isArray(o[f])) r[f]=o[f]; }); }); }
 CARDS=buildCards(rows);
 if(!CARDS.length){ $('#utrr-stat').textContent='The card data could not be reached right now. Please refresh in a moment.'; }
 var T=(function(){ var o={}; CARDS.forEach(function(c){ o[textKey(c).toUpperCase()]=c; }); return o; })();
 CARDS.forEach(function(c){ var t=TEXT[textKey(c).toUpperCase()]||TEXT[String(c.id).toUpperCase()]; if(t&&t.text) c.text=t.text; });
 afterLoad();
}).catch(function(){ $('#utrr-stat').textContent='Could not load the card data.'; });
updateProgress();
/* open on a random region so the page never starts empty */
var startReg=REGIONS[Math.floor(Math.random()*REGIONS.length)].id;
setTimeout(function(){ setRegion(startReg,false,true); },0);
/* Top button: appears after scrolling, only while the Regions tab is showing */
var topBtn=$('#utrr-top');
function topCheck(){ var vis=(window.pageYOffset||document.documentElement.scrollTop)>500 && mount.offsetParent!==null; topBtn.classList.toggle('utrr-show',vis); }
window.addEventListener('scroll',topCheck,{passive:true}); window.addEventListener('resize',topCheck);
topBtn.addEventListener('click',function(){ var rm=false; try{ rm=matchMedia('(prefers-reduced-motion:reduce)').matches; }catch(e){} window.scrollTo({top:0,behavior:rm?'auto':'smooth'}); });
})();
