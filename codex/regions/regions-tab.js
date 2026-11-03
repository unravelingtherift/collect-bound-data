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

/* ---------- original, stylized map geometry (not Riot art) ---------- */
var GEO={
 demacia:{poly:[[[100,185],[170,168],[250,184],[302,214],[312,290],[290,352],[222,378],[140,356],[94,290]]],lab:[200,285],deco:'wall'},
 noxus:{poly:[[[322,180],[400,164],[500,172],[562,200],[578,270],[552,342],[470,372],[380,362],[330,312],[326,240]]],lab:[450,270],deco:'spikes'},
 freljord:{poly:[[[118,72],[220,40],[340,50],[450,34],[560,54],[612,100],[562,142],[470,128],[400,152],[320,138],[240,162],[160,150],[110,116]]],lab:[360,92],deco:'snow'},
 piltover:{poly:[[[596,200],[650,194],[692,224],[686,264],[640,276],[600,256]]],lab:[644,236],deco:'gears'},
 zaun:{poly:[[[602,288],[656,284],[692,302],[682,346],[632,362],[590,336]]],lab:[640,325],deco:'mist'},
 ionia:{poly:[[[770,110],[820,95],[862,120],[852,166],[802,182],[766,150]],[[852,204],[892,208],[902,242],[872,258],[846,236]],[[736,196],[774,206],[770,242],[738,236]]],lab:[812,142],deco:'leaves'},
 bilgewater:{poly:[[[760,382],[812,366],[852,386],[846,428],[800,442],[765,422]],[[862,442],[897,452],[892,482],[862,477]],[[720,446],[752,456],[742,488],[716,476]]],lab:[806,404],deco:'waves'},
 shadow:{poly:[[[70,455],[120,436],[166,456],[176,496],[136,522],[86,506]],[[40,522],[72,536],[62,566],[36,550]],[[152,542],[186,550],[176,578],[150,566]]],lab:[118,482],deco:'mistdark'},
 targon:{poly:[[[245,505],[292,432],[336,505],[322,562],[256,566]]],lab:[290,540],deco:'peaks'},
 shurima:{poly:[[[382,472],[472,452],[562,472],[622,502],[642,562],[592,612],[502,626],[422,612],[376,552]]],lab:[505,548],deco:'dunes'},
 ixtal:{poly:[[[668,502],[732,492],[776,522],[782,572],[736,602],[682,592],[657,547]]],lab:[722,548],deco:'jungle'},
 icathia:{poly:[[[455,396],[496,390],[522,410],[512,436],[471,440],[450,420]]],lab:[486,418],deco:'crack'},
 bandle:{circle:[926,322,42],lab:[926,322],deco:'sparkle'},
 void:{circle:[924,574,52],lab:[924,574],deco:'swirl'}
};
function smooth(pts){
 var n=pts.length,d='M'+pts[0][0]+','+pts[0][1];
 for(var i=0;i<n;i++){
  var p0=pts[(i-1+n)%n],p1=pts[i],p2=pts[(i+1)%n],p3=pts[(i+2)%n];
  d+=' C'+(p1[0]+(p2[0]-p0[0])/6).toFixed(1)+','+(p1[1]+(p2[1]-p0[1])/6).toFixed(1)+' '+(p2[0]-(p3[0]-p1[0])/6).toFixed(1)+','+(p2[1]-(p3[1]-p1[1])/6).toFixed(1)+' '+p2[0]+','+p2[1];
 }
 return d+'Z';
}
function decoFor(kind,g,col){
 var s='';
 if(kind==='snow'){ for(var i=0;i<16;i++){ s+='<circle cx="'+(150+i*28)+'" cy="'+(78+(i%4)*14+(i%3)*5)+'" r="'+(1.4+(i%3)*.5)+'" fill="#fff" opacity=".6"/>'; } }
 if(kind==='wall'){ s='<path d="M140,215 L140,330 M170,205 L170,340 M200,200 L200,345" stroke="'+col+'" stroke-width="1.2" opacity=".35" fill="none"/><path d="M130,205 h14 v-10 h8 v10 h14 v-10 h8 v10" stroke="'+col+'" stroke-width="1.2" fill="none" opacity=".5"/>'; }
 if(kind==='spikes'){ s='<path d="M385,205 l12,-24 l12,24 M425,198 l12,-28 l12,28 M465,205 l12,-24 l12,24" stroke="'+col+'" stroke-width="1.4" fill="none" opacity=".5"/>'; }
 if(kind==='gears'){ s='<circle cx="640" cy="228" r="26" fill="none" stroke="'+col+'" stroke-width="1.2" stroke-dasharray="4 5" opacity=".55" class="utrr-spin"/>'; }
 if(kind==='mist'){ s='<ellipse cx="640" cy="322" rx="38" ry="14" fill="#6ee0a0" opacity=".16" class="utrr-drift"/>'; }
 if(kind==='leaves'){ s='<circle cx="806" cy="140" r="5" fill="#ffb6dc" opacity=".6"/><circle cx="880" cy="228" r="4" fill="#ffb6dc" opacity=".6"/><circle cx="752" cy="218" r="3" fill="#ffb6dc" opacity=".6"/>'; }
 if(kind==='waves'){ s='<path d="M780,425 q8,-8 16,0 t16,0 t16,0" stroke="'+col+'" fill="none" stroke-width="1.2" opacity=".6"/>'; }
 if(kind==='mistdark'){ s='<ellipse cx="118" cy="505" rx="64" ry="20" fill="#5fd0a8" opacity=".14" class="utrr-drift"/><ellipse cx="108" cy="460" rx="44" ry="14" fill="#5fd0a8" opacity=".12" class="utrr-drift2"/>'; }
 if(kind==='peaks'){ s='<path d="M262,552 L292,452 L322,552 M288,505 L308,470 L326,520" stroke="#fff" stroke-width="1.4" fill="none" opacity=".55"/><circle cx="292" cy="452" r="3.5" fill="#fff" class="utrr-twinkle"/>'; }
 if(kind==='dunes'){ s='<path d="M410,568 q20,-16 40,0 t40,0 t40,0 t40,0 M430,590 q20,-14 40,0 t40,0 t40,0" stroke="'+col+'" fill="none" stroke-width="1.2" opacity=".5"/>'; }
 if(kind==='jungle'){ s='<circle cx="705" cy="530" r="6" fill="'+col+'" opacity=".45"/><circle cx="740" cy="560" r="8" fill="'+col+'" opacity=".4"/><circle cx="700" cy="575" r="5" fill="'+col+'" opacity=".4"/>'; }
 if(kind==='crack'){ s='<path d="M470,400 l10,14 l-8,8 l14,14" stroke="#c88cff" stroke-width="1.6" fill="none" opacity=".9" class="utrr-twinkle"/>'; }
 if(kind==='sparkle'){ s='<circle cx="926" cy="322" r="42" fill="none" stroke="'+col+'" stroke-dasharray="3 5" opacity=".7" class="utrr-spin"/><path d="M912,318 l3,-9 l3,9 l9,3 l-9,3 l-3,9 l-3,-9 l-9,-3z M934,336 l2,-6 l2,6 l6,2 l-6,2 l-2,6 l-2,-6 l-6,-2z" fill="#ffd2f2" class="utrr-twinkle"/>'; }
 if(kind==='swirl'){ s='<path d="M924,574 m0,-8 a8,8 0 1 1 -8,8 a16,16 0 1 1 16,16 a26,26 0 1 1 -26,-26" stroke="#c9a4ff" stroke-width="1.6" fill="none" opacity=".8" class="utrr-spin"/><circle cx="924" cy="574" r="6" fill="#0a0612"/>'; }
 return s;
}

/* ---------- styles ---------- */
var st=document.createElement('style'); st.id='utrr-style';
st.textContent="#utr-regions{--void:#0a0b12;--panel:#161826;--panel2:#1c1f32;--line:#2a2d42;--gold:#c9a35c;--gold2:#eecd8d;--ink:#eae7dc;--dim:#9d9cae;--cyan:#4fd8d1;--rc:#c9a35c;\n background:radial-gradient(1200px 600px at 50% -200px,rgba(79,216,209,.1),transparent 70%),#0a0b12;color:var(--ink);font-family:'Sora',system-ui,sans-serif;font-size:15px;line-height:1.6;position:relative;overflow:hidden;overflow:clip;padding:0 0 60px}\n#utr-regions *{box-sizing:border-box}\n#utr-regions.utrr-bleed{width:calc(100vw - var(--utrr-sbw,0px));max-width:none;margin-left:calc(50% - (100vw - var(--utrr-sbw,0px)) / 2)}\n#utr-regions button{font-family:inherit}\n.utrr-hero,.utrr-mapwrap,.utrr-panel{max-width:1180px;margin:0 auto;padding-left:16px;padding-right:16px;position:relative}\n.utrr-hero{padding-top:44px;text-align:center}\n.utrr-kicker{margin:0;color:var(--gold);letter-spacing:.24em;text-transform:uppercase;font-size:.72rem}\n.utrr-title{font-family:'Friz Quadrata','Cinzel',serif;font-weight:600;font-size:clamp(1.9rem,5vw,3.2rem);margin:8px 0 6px;color:var(--gold2);letter-spacing:.06em}\n.utrr-sub{max-width:700px;margin:0 auto;color:var(--dim)}\n.utrr-tools{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;align-items:center;margin-top:22px}\n.utrr-btn{background:var(--gold);color:#221a08;border:1px solid var(--gold);border-radius:999px;padding:10px 20px;font-weight:600;font-size:.86rem;cursor:pointer;transition:transform .15s,filter .15s}\n.utrr-btn:hover{filter:brightness(1.1);transform:translateY(-1px)}\n.utrr-btn-alt{background:var(--panel);color:var(--gold2);border-color:var(--gold)}\n.utrr-btn-sm{padding:6px 14px;font-size:.78rem}\n.utrr-prog{min-width:230px;text-align:left;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:8px 14px}\n.utrr-prog-top{display:flex;justify-content:space-between;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dim)}\n.utrr-prog-top b{color:var(--gold2)}\n.utrr-prog-track{height:6px;background:#0a0b12;border-radius:6px;margin:6px 0 4px;overflow:hidden}\n.utrr-prog-track i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--gold),var(--cyan));transition:width .5s}\n.utrr-prog small{font-size:.7rem;color:var(--dim)}\n.utrr-mapwrap{margin-top:26px}\n.utrr-map{position:relative;border:1px solid var(--line);border-radius:18px;overflow:hidden;background:#090b14;box-shadow:0 18px 50px rgba(0,0,0,.5)}\n#utrr-svg{display:block;width:100%;height:auto;max-height:80vh}\n.utrr-wave{fill:none;stroke:#1d2442;stroke-width:1.2;opacity:.55}\n.utrr-land{fill:#12172a;stroke:#2a3355;stroke-width:1.5;stroke-dasharray:2 6}\n.utrr-cont{fill:#2a3355;font-size:13px;letter-spacing:.25em;font-family:'Sora',sans-serif}\n.utrr-reg{cursor:pointer;outline:none;--rc:#c9a35c}\n.utrr-shape{fill:var(--rc);fill-opacity:.2;stroke:var(--rc);stroke-width:2;stroke-opacity:.8;transition:fill-opacity .2s,stroke-width .2s,filter .2s;vector-effect:non-scaling-stroke}\n.utrr-reg:hover .utrr-shape,.utrr-reg.utrr-on .utrr-shape,.utrr-reg:focus-visible .utrr-shape{fill-opacity:.52;stroke-width:3;filter:drop-shadow(0 0 10px var(--rc))}\n.utrr-reg.utrr-pin .utrr-shape{fill-opacity:.62;stroke-dasharray:none;filter:drop-shadow(0 0 14px var(--rc))}\n.utrr-reg.utrr-seen .utrr-shape{stroke-opacity:1}\n.utrr-lab{fill:#f4efe0;font-size:14px;font-weight:700;letter-spacing:.14em;font-family:'Sora',sans-serif;paint-order:stroke;stroke:#05060c;stroke-width:3.5px;stroke-linejoin:round;pointer-events:none;opacity:.92}\n.utrr-reg.utrr-on .utrr-lab{fill:#fff;opacity:1}\n.utrr-reg.utrr-right .utrr-shape{fill:#46b96a;fill-opacity:.7;stroke:#7dffa7;filter:drop-shadow(0 0 16px #46b96a)}\n.utrr-reg.utrr-wrong .utrr-shape{fill:#e5484d;fill-opacity:.7;stroke:#ff8a8f}\n.utrr-quizmode .utrr-lab{opacity:.18}\n.utrr-quizmode .utrr-reg.utrr-right .utrr-lab,.utrr-quizmode .utrr-reg.utrr-wrong .utrr-lab{opacity:1}\n.utrr-ping .utrr-shape{animation:utrr-ping 1s ease-out 2}\n@keyframes utrr-ping{0%{fill-opacity:.9}100%{fill-opacity:.52}}\n.utrr-spin{transform-box:fill-box;transform-origin:center;animation:utrr-spin 16s linear infinite}\n@keyframes utrr-spin{to{transform:rotate(360deg)}}\n.utrr-drift{animation:utrr-drift 7s ease-in-out infinite alternate}\n.utrr-drift2{animation:utrr-drift 9s ease-in-out infinite alternate-reverse}\n@keyframes utrr-drift{from{transform:translateX(-8px)}to{transform:translateX(8px)}}\n.utrr-twinkle{animation:utrr-tw 2.4s ease-in-out infinite}\n@keyframes utrr-tw{0%,100%{opacity:.35}50%{opacity:1}}\n.utrr-tip{position:absolute;transform:translate(-50%,-135%);background:rgba(10,11,18,.94);border:1px solid var(--gold);border-radius:10px;padding:6px 12px;font-size:.78rem;pointer-events:none;opacity:0;transition:opacity .15s;white-space:nowrap;z-index:3;display:flex;flex-direction:column;align-items:center;line-height:1.3}\n.utrr-tip.utrr-below{transform:translate(-50%,40%)}\n.utrr-tip.utrr-show{opacity:1}\n.utrr-tip b{color:var(--gold2);font-family:'Friz Quadrata','Cinzel',serif;font-size:.95rem}\n.utrr-tip span{color:var(--dim);font-size:.7rem}\n.utrr-hint{font-size:.72rem;color:var(--dim);margin:8px 2px 12px;text-align:center}\n.utrr-chiprow{display:flex;gap:8px;flex-wrap:wrap}\n.utrr-chips{justify-content:center}\n.utrr-chip{border:1px solid var(--line);background:var(--panel);color:var(--dim);padding:8px 14px;border-radius:999px;font-size:.8rem;cursor:pointer;transition:all .18s;display:inline-flex;align-items:center;gap:7px}\n.utrr-chip:hover{border-color:var(--gold);color:var(--ink)}\n.utrr-chip.utrr-active{background:var(--gold);border-color:var(--gold);color:#221a08;font-weight:600}\n.utrr-chip em{font-style:normal;font-size:.7rem;opacity:.75}\n.utrr-chip-reg i,.utrr-chip-sm i{width:9px;height:9px;border-radius:50%;background:var(--rc);display:inline-block}\n.utrr-chip-reg.utrr-seen{border-color:var(--rc)}\n.utrr-chip-reg.utrr-active i{box-shadow:0 0 0 2px #221a08}\n.utrr-chip-sm{padding:5px 11px;font-size:.74rem}\n.utrr-quiz{background:var(--panel);border:1px solid var(--gold);border-radius:14px;padding:14px 18px;margin-bottom:12px;text-align:center}\n.utrr-qtop{display:flex;justify-content:space-between;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}\n.utrr-qclue{font-family:'Friz Quadrata','Cinzel',serif;font-size:clamp(1.05rem,2.6vw,1.4rem);color:var(--gold2);margin:8px 0}\n#utrr-qfb{min-height:1.4em;margin:0 0 8px;color:var(--dim);font-size:.85rem}\n#utrr-qfb.utrr-ok{color:#7dffa7}#utrr-qfb.utrr-bad{color:#ff8a8f}\n.utrr-qbtns{display:flex;gap:10px;justify-content:center}\n.utrr-panel{margin-top:30px;scroll-margin-top:90px;animation:utrr-in .4s ease both}\n@keyframes utrr-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}\n.utrr-phead{display:flex;justify-content:space-between;gap:12px;align-items:flex-end;flex-wrap:wrap;border-bottom:2px solid var(--rc);padding-bottom:12px;margin-bottom:18px}\n.utrr-where{margin:0;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--rc)}\n.utrr-panel h3{font-family:'Friz Quadrata','Cinzel',serif;font-size:clamp(1.7rem,4vw,2.5rem);margin:2px 0;color:#fff;font-weight:600}\n.utrr-tag{margin:0;color:var(--gold2);font-style:italic}\n.utrr-pinstate{font-size:.72rem;color:var(--dim);border:1px solid var(--line);border-radius:999px;padding:4px 12px}\n.utrr-pgrid{display:grid;grid-template-columns:1.1fr 1fr;gap:28px}\n@media(max-width:820px){.utrr-pgrid{grid-template-columns:1fr}}\n.utrr-blurb{margin:0 0 14px;font-size:.98rem}\n.utrr-fact{background:rgba(79,216,209,.07);border-left:3px solid var(--cyan);padding:10px 14px;border-radius:0 10px 10px 0;font-size:.9rem}\n.utrr-fact b{color:var(--cyan)}\n.utrr-linkbtn{background:none;border:0;color:var(--gold2);cursor:pointer;font-size:.78rem;display:block;margin-top:6px;padding:0}\n.utrr-linkbtn:hover{text-decoration:underline}\n.utrr-book{font-size:.78rem;color:var(--dim);margin:12px 0 0;font-style:italic}\n.utrr-lbl{margin:16px 0 8px;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}\n.utrr-lbl:first-child{margin-top:0}\n.utrr-dim{color:var(--dim);font-size:.8rem}\n.utrr-legends{display:flex;gap:8px;flex-wrap:wrap;max-height:176px;overflow:auto;padding:2px}\n.utrr-lg{display:flex;align-items:center;gap:7px;background:var(--panel);border:1px solid var(--line);color:var(--ink);padding:3px 11px 3px 3px;border-radius:999px;font-size:.76rem;cursor:pointer;transition:border-color .15s}\n.utrr-lg img{width:26px;height:26px;border-radius:50%;object-fit:cover}\n.utrr-lg:hover{border-color:var(--gold)}.utrr-lg.utrr-active{background:var(--gold);color:#221a08;border-color:var(--gold)}\n.utrr-place{background:var(--panel);border:1px solid var(--line);color:var(--ink);padding:6px 12px;border-radius:999px;font-size:.78rem;cursor:pointer}\n.utrr-place:hover{border-color:var(--gold)}\n.utrr-bar{display:flex;height:10px;border-radius:6px;overflow:hidden;background:#0a0b12}\n.utrr-bar i{display:block;height:100%}\n.utrr-leg{display:flex;gap:12px;flex-wrap:wrap;font-size:.72rem;color:var(--dim);margin-top:6px}\n.utrr-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px}\n.utrr-cardshead{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;margin:30px 0 12px}\n.utrr-cardshead h4{font-family:'Friz Quadrata','Cinzel',serif;font-size:1.25rem;margin:0;color:var(--gold2);font-weight:600}\n.utrr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(188px,1fr));gap:20px;margin-top:16px}\n@media(max-width:520px){.utrr-grid{grid-template-columns:repeat(2,1fr);gap:14px}}\n.utrr-grid.utrr-fade{animation:utrr-in .35s ease both}\n.utrr-ctile{background:none;border:0;padding:0;cursor:pointer;text-align:left;color:inherit;display:block;transition:transform .2s ease}\n.utrr-ctile:hover{transform:translateY(-4px)}\n.utrr-cimg{position:relative;border-radius:12px;overflow:hidden;aspect-ratio:5/7;background:linear-gradient(160deg,var(--panel2),var(--panel));border:1px solid var(--line);box-shadow:0 10px 26px rgba(0,0,0,.4)}\n.utrr-cimg img{width:100%;height:100%;object-fit:cover;display:block}\n.utrr-cname{margin-top:8px;font-size:.86rem;font-weight:600;color:var(--ink)}\n.utrr-csnip{font-size:.68rem;color:var(--dim);line-height:1.35;margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n.utrr-cmeta{font-size:.7rem;color:var(--dim);letter-spacing:.06em;text-transform:uppercase;margin-top:2px}\n.utrr-ban{position:absolute;top:8px;right:8px;background:#c0464f;color:#fff;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;padding:3px 7px;border-radius:6px;font-weight:700}\n.utrr-ctile.utrr-land{grid-column:span 2}.utrr-ctile.utrr-land .utrr-cimg{aspect-ratio:518/371}\n.utrr-empty{grid-column:1/-1;text-align:center;color:var(--dim);padding:40px 0}\n.utrr-morerow{text-align:center;margin-top:26px}\n.utrr-foot{font-size:.74rem;color:var(--dim);line-height:1.6;max-width:760px;margin:20px 0 0}\n.utrr-modal{position:fixed;inset:0;background:rgba(6,6,12,.8);backdrop-filter:blur(6px);display:none;align-items:flex-start;justify-content:center;z-index:2147483000;padding:40px 16px;overflow-y:auto}\n.utrr-modal.utrr-open{display:flex}\n.utrr-mbox{background:var(--panel);border:1px solid var(--line);border-radius:18px;max-width:760px;width:100%;position:relative;animation:utrr-in .3s ease both}\n.utrr-mclose{position:absolute;top:10px;right:12px;width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:var(--void);color:var(--ink);font-size:1.3rem;cursor:pointer;z-index:2}\n.utrr-cm{display:grid;grid-template-columns:230px 1fr;gap:26px;padding:30px 32px 32px}\n@media(max-width:640px){.utrr-cm{grid-template-columns:1fr;padding:24px 20px}.utrr-cm-img{max-width:210px}}\n.utrr-cm-img img{width:100%;border-radius:12px;display:block;box-shadow:0 14px 34px rgba(0,0,0,.55)}\n.utrr-cm-body h3{font-family:'Friz Quadrata','Cinzel',serif;margin:6px 0 4px;font-size:1.7rem;font-weight:600;color:#fff}\n.utrr-cm-stats{color:var(--dim);font-size:.84rem;margin-bottom:4px}\n.utrr-printed{border-left:2px solid var(--gold);padding:6px 0 6px 14px;background:rgba(201,163,92,.06);margin:0 0 10px;font-size:.9rem}\n.utrr-flav{margin:0;font-style:italic;color:var(--dim);font-size:.9rem}\n.utrr-ico{display:inline-block;font-size:.68rem;font-weight:700;padding:0 6px;margin:0 1px;border-radius:6px;background:var(--panel2);border:1px solid var(--gold);color:var(--gold2)}\n.utrr-ico.utrr-en{border-radius:50%;min-width:18px;text-align:center;padding:0 4px;background:#111;color:#fff;border-color:#555}\nhtml.utrr-lock{overflow:hidden}\n#utr-regions :focus-visible{outline:2px solid var(--cyan);outline-offset:2px}\n.utrr-reg:focus-visible{outline:none}\n@media(prefers-reduced-motion:reduce){#utr-regions *{animation:none!important;transition:none!important}}\n\n#utr-regions.utrr-embed{background:transparent;overflow:visible}\n#utr-regions.utrr-embed .utrr-bg{display:none}\n#utr-regions.utrr-embed .utrr-hero{padding-top:28px}\n#utr-regions.utrr-embed .utrr-title{font-size:clamp(1.6rem,4vw,2.4rem)}";
document.head.appendChild(st);
try{
 if(!document.querySelector('link[href*="family=Sora"]')){
  var fl=document.createElement('link'); fl.rel='stylesheet'; fl.href='https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Sora:wght@300;400;500;600;700&display=swap'; document.head.appendChild(fl);
 }
}catch(e){}

mount.innerHTML="<div id=\"utr-regions\">\n <div class=\"utrr-bg\" aria-hidden=\"true\"></div>\n <header class=\"utrr-hero\">\n  <p class=\"utrr-kicker\">Lore Codex \u00b7 Regions &amp; Locations</p>\n  <h2 class=\"utrr-title\">REGIONS OF RUNETERRA</h2>\n  <p class=\"utrr-sub\">Every region and place that shows up on Riftbound cards, and where it sits in the League of Legends world. Hover a region to see its cards. Click to pin it.</p>\n  <div class=\"utrr-tools\">\n   <button type=\"button\" id=\"utrr-surprise\" class=\"utrr-btn\">\ud83e\udded Surprise me</button>\n   <button type=\"button\" id=\"utrr-quizbtn\" class=\"utrr-btn utrr-btn-alt\">Region quiz</button>\n   <div class=\"utrr-prog\" aria-live=\"polite\"><div class=\"utrr-prog-top\"><span>Explorer's passport</span><b id=\"utrr-prog-n\">0 / 14</b></div><div class=\"utrr-prog-track\"><i id=\"utrr-prog-bar\"></i></div><small id=\"utrr-prog-msg\"></small></div>\n  </div>\n </header>\n <section class=\"utrr-mapwrap\" aria-label=\"Interactive map of Runeterra\">\n  <div id=\"utrr-quiz\" class=\"utrr-quiz\" hidden>\n   <div id=\"utrr-qplay\">\n    <div class=\"utrr-qtop\"><span id=\"utrr-qn\"></span><span id=\"utrr-qs\"></span></div>\n    <p class=\"utrr-qclue\" id=\"utrr-qclue\"></p>\n    <p id=\"utrr-qfb\" aria-live=\"polite\"></p>\n    <div class=\"utrr-qbtns\"><button type=\"button\" class=\"utrr-btn utrr-btn-sm\" id=\"utrr-qskip\">Skip</button><button type=\"button\" class=\"utrr-btn utrr-btn-sm utrr-btn-alt\" id=\"utrr-qquit\">Quit</button></div>\n   </div>\n   <div id=\"utrr-qresult\" hidden><p class=\"utrr-qclue\" id=\"utrr-qres\"></p><div class=\"utrr-qbtns\"><button type=\"button\" class=\"utrr-btn utrr-btn-sm\" id=\"utrr-qagain\">Play again</button><button type=\"button\" class=\"utrr-btn utrr-btn-sm utrr-btn-alt\" onclick=\"document.getElementById('utrr-qquit').click()\">Back to the map</button></div></div>\n  </div>\n  <div class=\"utrr-map\">\n   <svg id=\"utrr-svg\" viewBox=\"0 0 1000 640\" role=\"group\" aria-label=\"Map of Runeterra regions\" preserveAspectRatio=\"xMidYMid meet\"></svg>\n   <div id=\"utrr-tip\" class=\"utrr-tip\" aria-hidden=\"true\"></div>\n  </div>\n  <p class=\"utrr-hint\">Stylized, not-to-scale map made for this site. Region chips below do the same thing as the map, for keyboards and phones.</p>\n  <div class=\"utrr-chiprow utrr-chips\" id=\"utrr-chips\" role=\"group\" aria-label=\"Choose a region\"></div>\n </section>\n <section id=\"utrr-panel\" class=\"utrr-panel\" hidden aria-live=\"polite\">\n  <div class=\"utrr-phead\">\n   <div><p class=\"utrr-where\" id=\"utrr-rwhere\"></p><h3 id=\"utrr-rname\"></h3><p class=\"utrr-tag\" id=\"utrr-rtag\"></p></div>\n   <span class=\"utrr-pinstate\" id=\"utrr-pinstate\"></span>\n  </div>\n  <div class=\"utrr-pgrid\">\n   <div>\n    <p class=\"utrr-blurb\" id=\"utrr-rblurb\"></p>\n    <div class=\"utrr-fact\"><span id=\"utrr-fact\"></span><button type=\"button\" id=\"utrr-factbtn\" class=\"utrr-linkbtn\">Another fact \u2192</button></div>\n    <p class=\"utrr-book\" id=\"utrr-book\"></p>\n   </div>\n   <div>\n    <div class=\"utrr-lbl\">Legends from here <small class=\"utrr-dim\">(tap to filter cards)</small></div>\n    <div class=\"utrr-legends\" id=\"utrr-legends\"></div>\n    <div class=\"utrr-lbl\">Locations on cards</div>\n    <div class=\"utrr-chiprow\" id=\"utrr-places\"></div>\n    <div class=\"utrr-lbl\">Domains in this region</div>\n    <div id=\"utrr-dom\"></div>\n   </div>\n  </div>\n  <div class=\"utrr-cardshead\"><h4>Riftbound cards from this region</h4><span id=\"utrr-count\" class=\"utrr-dim\"></span></div>\n  <div class=\"utrr-chiprow\" id=\"utrr-types\"></div>\n  <div class=\"utrr-grid\" id=\"utrr-grid\"></div>\n  <div class=\"utrr-morerow\"><button type=\"button\" class=\"utrr-btn utrr-btn-alt\" id=\"utrr-more\" hidden>Show more cards</button></div>\n  <p class=\"utrr-foot\" id=\"utrr-stat\">Loading the cards\u2026</p>\n  <p class=\"utrr-foot\">Region summaries are original write-ups based on the League of Legends universe (universe.leagueoflegends.com, including the <i>Realms of Runeterra</i> book) and the League of Legends wiki. Cards are matched by their region tags and by the region of each Legend. Card art and names belong to Riot Games.</p>\n </section>\n <div id=\"utrr-modal\" class=\"utrr-modal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"utrr-mtitle\">\n  <div class=\"utrr-mbox\"><button type=\"button\" id=\"utrr-mclose\" class=\"utrr-mclose\" aria-label=\"Close\">\u00d7</button><div id=\"utrr-mbody\"></div></div>\n </div>\n</div>";
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
var svgParts=[];
REGIONS.forEach(function(r){
 var g=GEO[r.id]; if(!g) return;
 var shapes='';
 if(g.poly){ g.poly.forEach(function(p){ shapes+='<path class="utrr-shape" d="'+smooth(p)+'"/>'; }); }
 else { shapes+='<circle class="utrr-shape" cx="'+g.circle[0]+'" cy="'+g.circle[1]+'" r="'+g.circle[2]+'"/>'; }
 var lines=r.name.length>11&&r.name.indexOf(' ')>0?r.name.split(' '):[r.name];
 var lab='<text class="utrr-lab" x="'+g.lab[0]+'" y="'+g.lab[1]+'" text-anchor="middle">'+lines.map(function(t,i){return '<tspan x="'+g.lab[0]+'" dy="'+(i?'1.05em':(lines.length>1?'-.3em':'.35em'))+'">'+esc(t.toUpperCase())+'</tspan>';}).join('')+'</text>';
 svgParts.push('<g class="utrr-reg" id="utrr-reg-'+r.id+'" data-id="'+r.id+'" tabindex="0" role="button" aria-label="'+esc(r.name)+'" style="--rc:'+r.color+'">'+shapes+'<g class="utrr-deco" pointer-events="none">'+decoFor(g.deco,g,r.color)+'</g>'+lab+'</g>');
});
var wave='';
for(var wy=60;wy<640;wy+=70){ wave+='<path d="M0,'+wy+' q25,-8 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0" class="utrr-wave"/>'; }
var valoran=smooth([[86,62],[330,34],[620,44],[704,200],[708,364],[600,392],[330,388],[214,396],[84,332],[82,182]]);
$('#utrr-svg').innerHTML='<defs><radialGradient id="utrr-sea" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#151a2e"/><stop offset="1" stop-color="#090b14"/></radialGradient></defs>'
 +'<rect width="1000" height="640" fill="url(#utrr-sea)"/>'+wave
 +'<path d="'+valoran+'" class="utrr-land"/><text class="utrr-cont" x="456" y="402" text-anchor="middle">V A L O R A N</text>'
 +'<text class="utrr-cont" x="640" y="628" text-anchor="middle">S H U R I M A N   L A N D S</text>'
 +'<g class="utrr-compass" transform="translate(72,606)"><circle r="20" fill="none" stroke="#c9a35c" opacity=".5"/><path d="M0,-26 L5,0 L0,26 L-5,0Z M-26,0 L0,-5 L26,0 L0,5Z" fill="#c9a35c" opacity=".45"/><text y="-30" text-anchor="middle" font-size="10" fill="#eecd8d">N</text></g>'
 +svgParts.join('');

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
 var tip=$('#utrr-tip'), r=REG[id], g=GEO[id];
 if(r&&g){
  var cx=g.circle?g.circle[0]:g.lab[0], cy=(g.circle?g.circle[1]:g.lab[1]);
  var top=(cy/640*100), left=(cx/1000*100);
  tip.style.left=left+'%'; tip.style.top=top+'%';
  tip.classList.toggle('utrr-below',cy<130);
  tip.innerHTML='<b>'+esc(r.name)+'</b><span>'+r.cards.length+' Riftbound card'+(r.cards.length===1?'':'s')+'</span>';
  tip.classList.add('utrr-show');
 }
 if(!auto&&!visited[id]){ visited[id]=1; saveVisited(); }
 updateProgress();
 if(changed){ filterType='All'; filterChamp=null; shown=24; renderPanel(); }
 else { $('#utrr-pinstate').textContent=pinned?'Pinned: click the region again to unpin':'Hovering: click to pin'; }
}
function hideTip(){ $('#utrr-tip').classList.remove('utrr-show'); }

$('#utrr-svg').addEventListener('pointerover',function(e){
 var g=e.target.closest&&e.target.closest('.utrr-reg'); if(!g||quiz.on) return;
 if(e.pointerType==='touch') return;
 if(pinned) { showTipOnly(g.dataset.id); return; }
 clearTimeout(hoverT); hoverT=setTimeout(function(){ setRegion(g.dataset.id); },70);
});
function showTipOnly(id){ var r=REG[id],g=GEO[id]; var tip=$('#utrr-tip'); var cx=g.circle?g.circle[0]:g.lab[0], cy=g.circle?g.circle[1]:g.lab[1]; tip.style.left=cx/10+'%'; tip.style.top=(cy/6.4)+'%'; tip.classList.toggle('utrr-below',cy<130); tip.innerHTML='<b>'+esc(r.name)+'</b><span>Click to switch</span>'; tip.classList.add('utrr-show'); }
$('#utrr-svg').addEventListener('pointerout',function(e){
 clearTimeout(hoverT);
 var to=e.relatedTarget; if(to&&to.closest&&to.closest('.utrr-reg')) return;
 if(pinned&&cur){ setTipBack(); } else if(!quiz.on&&!cur){ hideTip(); }
});
function setTipBack(){ var r=REG[cur],g=GEO[cur]; var tip=$('#utrr-tip'); var cx=g.circle?g.circle[0]:g.lab[0], cy=g.circle?g.circle[1]:g.lab[1]; tip.style.left=cx/10+'%'; tip.style.top=(cy/6.4)+'%'; tip.classList.toggle('utrr-below',cy<130); tip.innerHTML='<b>'+esc(r.name)+'</b><span>'+r.cards.length+' Riftbound card'+(r.cards.length===1?'':'s')+'</span>'; }
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
 $('#utrr-qs').textContent='Score '+quiz.score;
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
})();
