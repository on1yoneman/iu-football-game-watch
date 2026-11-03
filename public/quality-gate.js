/* IU Game Watch publication QA. Run in a real browser with ?audit=1; fails visibly and in console. */
(async function(){
  if(!new URLSearchParams(location.search).has('audit')) return;
  const errors=[], checks=[];
  const check=(name,ok,detail='')=>{checks.push({name,ok,detail});if(!ok)errors.push(name+(detail?': '+detail:''));};
  const expected=(()=>{const s=document.querySelector('#schedule .opponent-preview .section-title small');return s?.textContent.match(/^([^·]+)/)?.[1].trim()||''})();
  check('Next opponent named',!!expected);
  check('Preview opponent matches next opponent',!!expected&&document.querySelector('#preview .section-title h2')?.textContent.includes(expected));
  check('Opponent watch matches preview',!!expected&&document.querySelector('#opponent-watch-title')?.textContent.includes(expected));
  check('Opponent watch has at least four player cards',document.querySelectorAll('#preview .opponent-watch .note').length>=4);
  const roster=[...document.querySelectorAll('#roster .player-row')];
  check('Roster contains at least 80 cards',roster.length>=80,String(roster.length));
  check('No nested roster cards',roster.every(r=>!r.querySelector('.player-row')));
  check('All roster cards have number name and position',roster.every(r=>r.querySelector('.number')&&r.querySelector('.pname')&&r.querySelector('.ppos')));
  const current=document.querySelector('#schedule .opponent-preview')?.textContent||'';
  const currentDate=current.match(/Nov\.\s*\d+|Oct\.\s*\d+|Sep\.\s*\d+/)?.[0];
  check('Next opponent card exists',!!currentDate);
  const past=document.querySelectorAll('#schedule .game-result');
  check('Past results contain winner/loser class',past.length>0&&[...past].every(r=>r.classList.contains('win')||r.classList.contains('loss')));
  const source=document.documentElement.innerHTML;
  check('No stale eight-game ledger labels',!source.includes('All eight games'));
  check('No prior-game analysis mislabeled as current',!(/through Minnesota[^<]{0,30}Oct\. 24/i.test(source)));
  check('No legacy weekly override scripts',!document.querySelector('script[src*="week3-update"],script[src*="weekly-update"]'));
  const bad=errors.length;
  const panel=document.createElement('pre');panel.id='site-audit-results';panel.style.cssText='position:relative;z-index:9999;white-space:pre-wrap;background:'+(bad?'#fff1f1':'#efffee')+';color:#111;padding:20px;margin:20px;border:3px solid '+(bad?'#b00020':'#16753a');
  panel.textContent=(bad?'AUDIT FAILED':'AUDIT PASSED')+' — '+checks.length+' checks, '+bad+' failures\n'+checks.map(c=>(c.ok?'PASS':'FAIL')+' '+c.name+(c.detail?' ('+c.detail+')':'')).join('\n');
  document.body.prepend(panel);window.__siteAudit={ok:bad===0,errors,checks};if(bad)console.error('IU SITE AUDIT FAILED',errors);else console.info('IU SITE AUDIT PASSED',checks.length);
})();