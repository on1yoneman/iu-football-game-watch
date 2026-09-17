document.addEventListener('DOMContentLoaded', async () => {
  const roster = document.getElementById('roster');
  if (!roster) return;
  try {
    const r = await fetch('/api/player-bios');
    if (!r.ok) return;
    const bios = await r.json();
    roster.querySelectorAll('.pname').forEach((el) => {
      if (el.querySelector('a')) return;
      const firstText = [...el.childNodes].find((n) => n.nodeType === Node.TEXT_NODE);
      const name = firstText ? firstText.textContent.trim() : el.textContent.trim();
      const href = bios[name];
      if (!href || !firstText) return;
      const link = document.createElement('a');
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = name;
      el.replaceChild(link, firstText);
    });
  } catch (_) {
    // Leave the roster fully usable if the bio lookup is unavailable.
  }
});