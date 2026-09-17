export const access = 'public';
export const methods = ['GET'];

export default async function (req, res) {
  const r = await fetch('https://iuhoosiers.com/sports/football/roster');
  if (!r.ok) return res.status(502).json({ error: 'Unable to load IU roster' });
  const page = await r.text();
  const re = /<a href="([^"]*\/sports\/football\/roster\/[^"]+)"[^>]*aria-label="([^"]+?) jersey number [^"]+ full bio"/g;
  const bios = {};
  let m;
  while ((m = re.exec(page)) !== null) {
    const name = m[2]
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');
    bios[name] = 'https://iuhoosiers.com' + m[1];
  }
  res.setHeader('Cache-Control', 'public, max-age=86400');
  return res.json(bios);
}