/* IU Football Game Watch — PFF snap history through Northwestern, checked October 1, 2026.
   Snaps: The Daily Hoosier game-by-game PFF lists. Stats: IU Athletics.
   Keeps the existing mobile design, numerical roster and player-bio links. */
document.addEventListener('DOMContentLoaded', () => {
  const games = {
    offense: [
      {label:'North Texas · Sep 5', total:48, players:`Adedamola Ajani=47|Joe Brunner=47|Drew Evans=47|Carter Smith=47|Bray Lynch=47|Josh Hoover=47|Nick Marsh=43|Charlie Becker=42|Tyler Morris=34|Brock Schott=30|Lee Beebe Jr=25|Andrew Barker=21|Turbo Richard=21|Lebron Bond=5|Austin Leibfried=5|Shazz Preston=4|Jackson Wasserstrom=3|Davion Chandler=2|Khobie Martin=2|Ben Novak=1|Sam Simpson=1|Matt Marek=1|Baylor Wilkin=1|Sean Cuono=1|Grant Wilson=1|Joe Hjelle=1|Mario Landino=1|Josh Burnham=1`},
      {label:'Howard · Sep 12', total:62, players:`Adedamola Ajani=48|Joe Brunner=48|Drew Evans=48|Carter Smith=48|Bray Lynch=48|Josh Hoover=38|Charlie Becker=38|Shazz Preston=38|Andrew Barker=34|Lee Beebe Jr=32|Davion Chandler=31|Nick Marsh=30|Brock Schott=23|Tyler Morris=21|Austin Leibfried=16|Turbo Richard=15|Kenton Mondeau=14|Sam Simpson=14|Baylor Wilkin=14|Tyler Cherry=14|Jackson Wasserstrom=12|Grant Wilson=10|Matt Marek=8|Sean Cuono=8|Jayreon Campbell=7|Khobie Martin=2|Lavar Keys=6|Blake Thiry=6|Evan Parker=6|Hunter Stroud=3|Cade Kaiser=3|Parker Elmore=1`},
      {label:'Western Kentucky · Sep 19', total:67, players:`Adedamola Ajani=60|Joe Brunner=60|Drew Evans=60|Carter Smith=60|Bray Lynch=60|Josh Hoover=53|Nick Marsh=45|Charlie Becker=44|Shazz Preston=37|Lee Beebe Jr=32|Tyler Morris=30|Turbo Richard=28|Andrew Barker=26|Brock Schott=24|Davion Chandler=23|Trevor Gibbs=18|Grant Wilson=14|Austin Leibfried=12|Jackson Wasserstrom=10|Kenton Mondeau=7|Sam Simpson=7|Baylor Wilkin=7|Matt Marek=7|Sean Cuono=6|Joe Hjelle=2|Josh Burnham=2|Mario Landino=2|Jayreon Campbell=1`},
      {label:'Northwestern · Sep 25', total:74, players:`Adedamola Ajani=74|Joe Brunner=74|Drew Evans=74|Carter Smith=74|Bray Lynch=74|Josh Hoover=74|Charlie Becker=69|Nick Marsh=68|Lee Beebe Jr=59|Andrew Barker=51|Trevor Gibbs=26|Davion Chandler=22|Shazz Preston=20|Tyler Morris=20|Turbo Richard=15|Brock Schott=6|Stephen Daley=3|Joe Hjelle=3|Josh Burnham=3|Mario Landino=3|Sean Cuono=1|Jayreon Campbell=1`}
    ],
    defense: [
      {label:'North Texas · Sep 5', total:71, players:`Amare Ferrell=67|Ryland Gandy=63|Rolijah Hardy=62|Isaiah Jones=62|Preston Zachman=62|Jaylen Bell=55|Mario Landino=48|Tyrique Tucker=40|Tobi Osunsanmi=38|Byron Baldwin Jr=34|Joe Hjelle=31|Daniel Ndukwe=30|Jeff Utzinger=29|Josh Burnham=26|Chiddi Obiazor=23|Cam McHaney=22|Quan Sanks=22|Jamari Sharpe=16|Stephen Daley=13|Jacob Savage=10|Henry Ohlinger=9|AJ Harris=7|Kaden McConnell=6|Jamar Owens=4|Keishaun Calhoun=3|Anthony Chung=3|Kaiden Turner=3`},
      {label:'Howard · Sep 12', total:47, players:`Jaylen Bell=35|Isaiah Jones=34|Ryland Gandy=34|Rolijah Hardy=32|Amare Ferrell=31|Preston Zachman=27|Byron Baldwin Jr=27|Tobi Osunsanmi=25|Mario Landino=24|Tyrique Tucker=24|Quan Sanks=20|Stephen Daley=19|Daniel Ndukwe=18|Joe Hjelle=17|Chiddi Obiazor=15|Jacob Savage=13|Jamar Owens=13|Lincoln Murff=13|Josh Burnham=13|Kaiden Turner=13|Cam McHaney=12|Carson Williams=12|Jeff Utzinger=11|Kellan Wyatt=9|Anthony Chung=8|Keishaun Calhoun=6|Tyrone Burrus Jr=3|Kaden McConnell=3|Henry Ohlinger=2|Jhrevious Hall=2|Kyler Garcia=1|Clay Conner=1`},
      {label:'Western Kentucky · Sep 19', total:61, players:`Ryland Gandy=59|Rolijah Hardy=58|Amare Ferrell=58|Isaiah Jones=58|Jamari Sharpe=58|Preston Zachman=48|Mario Landino=45|Tyrique Tucker=39|Byron Baldwin Jr=34|Tobi Osunsanmi=31|Josh Burnham=31|Daniel Ndukwe=30|Chiddi Obiazor=30|Quan Sanks=24|Joe Hjelle=19|Kaiden Turner=12|Blake Smythe=7|Cam McHaney=7|Keishaun Calhoun=7|Jeff Utzinger=7|Jamar Owens=3|Jaylen Bell=3|Anthony Chung=3`},
      {label:'Northwestern · Sep 25', total:60, players:`Amare Ferrell=60|Isaiah Jones=60|Jamari Sharpe=60|Jaylen Bell=59|Preston Zachman=58|Rolijah Hardy=48|Mario Landino=47|Tyrique Tucker=44|Stephen Daley=32|Tobi Osunsanmi=30|Byron Baldwin Jr=27|Kellan Wyatt=25|Kaiden Turner=19|Joe Hjelle=14|Jeff Utzinger=14|Josh Burnham=14|Chiddi Obiazor=13|Blake Smythe=12|Daniel Ndukwe=9|Quan Sanks=9|Cam McHaney=4|Jacob Savage=2`}
    ]
  };
  const normalize = n => n.toLowerCase().replace(/[^a-z0-9]/g,'').replace(/^(byronbaldwin)$/, '$1jr');
  const parsed = text => text.split('|').map(entry => { const at=entry.lastIndexOf('='); return [entry.slice(0,at),Number(entry.slice(at+1))]; });
  const updateSnaps = side => {
    const panel=document.getElementById(side); if(!panel)return;
    const weeks=games[side], total=weeks.reduce((sum,g)=>sum+g.total,0), sums={};
    weeks.forEach(g=>parsed(g.players).forEach(([name,n])=>{const key=normalize(name);sums[key]=(sums[key]||0)+n;}));
    const heading=panel.querySelector('.section-title small');if(heading)heading.textContent=`season snap rate · ${total} PFF charted ${side} snaps · through Northwestern`;
    panel.querySelectorAll('.depth-card .snap-pct').forEach(el=>{
      const preceding=el.previousSibling?.textContent||'';
      const match=preceding.match(/(?:^|\/)\s*\d+\s+(.+?)\s*$/);
      if(!match)return;
      const key=normalize(match[1]); if(!Object.prototype.hasOwnProperty.call(sums,key))return;
      el.textContent=`${Math.round(100*sums[key]/total)}%`;
      el.title=`${sums[key]} of ${total} PFF charted ${side} snaps`;
    });
    const notesHeading=[...panel.querySelectorAll('.section-title h2')].find(h=>h.textContent.includes('What we')); if(notesHeading)notesHeading.parentElement.querySelector('small').textContent='through Northwestern';
    const details=document.createElement('details');details.className='note';details.style.marginTop='8px';details.innerHTML=`<summary style="font-weight:850;color:#990000;cursor:pointer">Full game-by-game snap counts · all four games</summary>${weeks.map(g=>`<h3 style="font-size:12px;margin:12px 0 5px">${g.label} · ${g.total} team snaps</h3><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;font-size:11px">${parsed(g.players).map(([name,n])=>`<div>${name}: <b>${n}</b></div>`).join('')}</div>`).join('')}<p style="font-size:10px;color:#6b6865;margin-bottom:0">Source: The Daily Hoosier, snap-count reports for North Texas, Howard, Western Kentucky and Northwestern.</p>`;
    const depth=panel.querySelector('.depth');if(depth){const explainer=document.createElement('p');explainer.style.cssText='font-size:10px;color:#6b6865;margin:7px 2px 0;line-height:1.35';explainer.textContent='Season % = individual PFF charted snaps ÷ team PFF charted snaps through Northwestern. These totals differ from NCAA statistical plays (243 offense / 232 defense). Missed games reduce season rates; latest-game usage is noted separately.';depth.insertAdjacentElement('afterend',explainer);explainer.insertAdjacentElement('afterend',details);}
  };
  updateSnaps('offense');updateSnaps('defense');

});
