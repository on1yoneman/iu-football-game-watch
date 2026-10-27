/* IU Football Game Watch: one authoritative snap ledger and renderer.
   The static HTML is the accessible fallback; /snap-history.json is canonical. */
document.addEventListener('DOMContentLoaded', async () => {
  const names = ['NT','HOW','WKU','NW','RUT','NEB','OSU','MICH'];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  try {
    const response = await fetch('/snap-history.json', {cache:'no-store'});
    if (!response.ok) throw new Error('snap ledger unavailable');
    const data = await response.json();
    for (const unit of ['offense','defense']) {
      const games = data.games.filter(g => g.unit === unit);
      const denom = games.reduce((n,g) => n + g.plays, 0);
      if (games.length !== 8 || denom !== data.season.plays[unit]) throw new Error('snap denominator mismatch');
      const sums = {};
      for (const game of games) for (const [name,n] of Object.entries(game.counts)) sums[name] = (sums[name]||0)+n;
      for (const [name,n] of Object.entries(data.season.counts[unit])) if (sums[name] !== n) throw new Error('snap season mismatch: '+name);
      document.querySelectorAll('#'+unit+' .snap-pct').forEach(el => {
        const raw = el.previousSibling?.textContent?.trim() || '';
        const name = raw.replace(/^\/?\s*\d+\s+/, '').trim();
        if (!(name in sums)) return;
        const total = sums[name];
        el.title = total+' of '+denom+' charted '+unit+' snaps through Michigan';
        el.textContent = Math.round(100*total/denom)+'%';
      });
      const target = document.getElementById(unit+'-snap-history');
      if (!target) throw new Error('missing '+unit+' ledger container');
      const players = Object.keys(sums).sort((a,b)=>sums[b]-sums[a] || a.localeCompare(b));
      const header = games.map((g,i)=>'<th scope="col"><a href="'+esc(g.url)+'" target="_blank" rel="noopener" title="'+esc(g.game)+' source">'+names[i]+'</a><small style="display:block;font-weight:400">'+g.plays+'</small></th>').join('');
      const body = players.map(name=>'<tr><th scope="row">'+esc(name)+'</th>'+games.map(g=>'<td>'+(g.counts[name]??'–')+'</td>').join('')+'<td><strong>'+sums[name]+'</strong></td><td><strong>'+Math.round(100*sums[name]/denom)+'%</strong></td></tr>').join('');
      target.innerHTML = '<p class="stat-detail">Every charted player, every game. Tap a game heading for the source; a dash means no charted snaps. Season denominator: '+denom+'.</p><div style="overflow-x:auto;border:1px solid var(--line);border-radius:12px;background:white"><table class="snap-matrix" style="border-collapse:collapse;width:100%;min-width:760px;font-size:12px"><thead><tr><th scope="col">Player</th>'+header+'<th scope="col">Total</th><th scope="col">Rate</th></tr></thead><tbody>'+body+'</tbody></table></div>';
      const style = document.getElementById('snap-matrix-style');
      if (!style) { const css = document.createElement('style');css.id='snap-matrix-style';css.textContent='.snap-matrix th,.snap-matrix td{padding:7px 9px;border-bottom:1px solid #e5dfda;text-align:right;white-space:nowrap}.snap-matrix th:first-child{text-align:left;position:sticky;left:0;background:#fff;z-index:1}.snap-matrix thead th{background:#f7f4f1;color:#990000;font-size:11px}.snap-matrix tbody tr:nth-child(even) td,.snap-matrix tbody tr:nth-child(even) th{background:#faf8f6}.snap-matrix tbody tr:hover td,.snap-matrix tbody tr:hover th{background:#f7e9e9}';document.head.appendChild(css); }
    }
  } catch(err) {
    for(const unit of ['offense','defense']) {
      const target = document.getElementById(unit+'-snap-history');
      if (target) target.innerHTML = '<p class="stat-detail">Full game-by-game ledger temporarily unavailable. The verified season snap percentages remain above. <a href="https://www.thedailyhoosier.com/">See The Daily Hoosier for source reports</a>.</p>';
    }
    console.error('IU snap ledger validation:', err);
  }
});