// Rend chaque niveau en PNG avec ses zones valides entourées en vert, pour contrôler les coordonnées.
// Usage : npm run check-targets [dossier-de-sortie]   (par défaut tools/screenshots)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || path.join(dir, 'screenshots');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 450, height: 800 } });
await page.goto('file://' + path.join(dir, 'check-targets.html'));
const ids = await page.evaluate(() => Anachro.data.levels.map(l => l.id));
for (const id of ids) {
  await page.evaluate(id => {
    const l = Anachro.data.byId[id];
    document.getElementById('host').innerHTML = Anachro.data.artHTML(l);
    document.querySelectorAll('.ring').forEach(n => n.remove());
    for (const z of Anachro.data.zones(l)) {
      const r = document.createElement('div');
      r.className = 'ring';
      r.style.cssText = `left:${z.x / 900 * 100}%;top:${z.y / 1600 * 100}%;width:${z.r * 2 / 900 * 100}%`;
      document.getElementById('wrap').appendChild(r);
    }
  }, id);
  await page.locator('#host img').evaluate(img => img.decode());
  await page.screenshot({ path: path.join(out, id + '.png') });
}
await browser.close();
console.log('ok', ids.join(', '));
