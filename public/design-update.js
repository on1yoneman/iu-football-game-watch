/* UI improvements, September 21, 2026. Load after week3-update.js. */
document.addEventListener('DOMContentLoaded', () => {
 const css=document.createElement('style');css.textContent=`
 #schedule .game-card{border-left:5px solid #990000;position:relative}
 #schedule .game-card.away{background:#eceff2;border:1px solid #c7d0d8;border-left:5px solid #40546b}
 #schedule .game-card.home{background:#fff5f5;border:1px solid #edd2d2;border-left:5px solid #990000}
 #schedule .game-card.away .site-tag{color:#344d68}
 #schedule .game-card .game-sub .venue-badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:900;padding:4px 7px;border-radius:6px;letter-spacing:.04em}
 #schedule .game-card.home .venue-badge{color:#fff;background:#990000}
 #schedule .game-card.away .venue-badge{color:#fff;background:#40546b}
 #schedule .game-card.next{outline:2px solid #990000;outline-offset:1px}
 #offense .special-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
 #offense .special-card{background:#fff;color:#171717;border:1px solid #e5dfda;box-shadow:0 2px 10px rgba(0,0,0,.035);min-width:0;line-height:1.4}
 #offense .special-card .pos{color:#990000}
 #offense .special-card .subrow{color:#555;flex-wrap:wrap}
 #offense .special-card .starter{line-height:1.35}
 .leaders-group{background:white;border:1px solid #e5dfda;border-radius:14px;overflow:hidden;margin-bottom:9px}
 .leaders-group h3{margin:0;padding:11px 12px 9px;background:#f7f4f1;color:#990000;font-size:12px;letter-spacing:.05em;text-transform:uppercase}
 .leaders-group .stat-row{grid-template-columns:22px minmax(0,1fr) auto;border-top:1px solid #e5dfda;padding:9px 12px}
 .leaders-rank{color:#990000;font-size:12px;font-weight:900}
 .leaders-group .stat-player{margin:0}.leaders-group .stat-number{font-size:15px}
 @media(min-width:700px){#offense .special-grid{grid-template-columns:repeat(5,minmax(0,1fr))}}
 `;document.head.appendChild(css);
 document.querySelectorAll('#schedule .game-card').forEach(card=>{
  const sub=card.querySelector('.game-sub'),tag=sub?.querySelector('.site-tag');if(!tag)return;
  const away=/\bAWAY\b/.test(tag.textContent);card.classList.add(away?'away':'home');
  const next=/\bNEXT\b/.test(tag.textContent);if(next)card.classList.add('next');
  tag.classList.add('venue-badge');tag.textContent=away?'↗ AWAY':'⌂ HOME';
  if(next){const label=document.createElement('strong');label.textContent='NEXT GAME · ';label.style.color='#990000';sub.insertBefore(label,tag);}
 });
 const leaders={
  offense:[
   {title:'Passing yards',rows:[['Josh Hoover','37/51 · 10 TD · 0 INT','649'],['Grant Wilson','3/3 · 2 TD','61'],['Tyler Cherry','1/3 · 0 TD','10']]},
   {title:'Rushing yards',rows:[['Turbo Richard','41 carries · 4 TD','315'],['Lee Beebe Jr.','47 carries · 2 TD','195'],['Grant Wilson / Sean Cuono','Tied for third · 45 yards each','45']]},
   {title:'Receiving yards',rows:[['Charlie Becker','12 receptions · 6 TD','272'],['Nick Marsh','11 receptions · 2 TD','169'],['Shazz Preston','5 receptions · 1 TD','81']]}
  ]
 };
 const offense=document.getElementById('offense');const title=[...offense.querySelectorAll('.section-title h2')].find(el=>el.textContent==='Season snapshot');if(title){const list=title.parentElement.nextElementSibling?.querySelector('.stats-list');if(list){list.style.background='transparent';list.style.border='none';list.innerHTML=leaders.offense.map(group=>`<div class="leaders-group"><h3>${group.title} · top three</h3>${group.rows.map((r,index)=>`<div class="stat-row"><span class="leaders-rank">${index+1}${index===2&&r[0].includes(' / ')?'=':''}</span><div><div class="stat-player">${r[0]}</div><div class="stat-detail">${r[1]}</div></div><div class="stat-number">${r[2]} yd</div></div>`).join('')}</div>`).join('');}}}
 const defense=document.getElementById('defense');const defTitle=[...defense.querySelectorAll('.section-title h2')].find(el=>el.textContent==='Season snapshot');if(defTitle){const list=defTitle.parentElement.nextElementSibling?.querySelector('.stats-list');if(list){list.innerHTML='<div class="stat-row"><div><div class="stat-label">Defensive leaders · verification pending</div><div class="stat-player">Top-three season ranks are not yet published in the retrieved updated defensive leaderboard.</div><div class="stat-detail">Isaiah Jones: 22 tackles; Rolijah Hardy: 21 tackles. Other leaders and TFL/sack rankings will appear only after verification. See the official IU defensive statistics for current numbers.</div></div></div>';}}
});