// Test de bout en bout (Playwright + Chromium) : parcours complet sur un viewport iPhone.
// Usage : npm test   (captures d'écran dans tests/screenshots, ou dans le dossier passé en argument)
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || path.join(dir, 'screenshots');
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.join(dir, '..', 'index.html');

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

const check = (name, cond, extra = '') => { console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? ' — ' + extra : '')); if (!cond) process.exitCode = 1; };
const shot = n => page.screenshot({ path: path.join(out, n + '.png') });

/* position écran d'un point de la scène (coordonnées 900 x 1600) */
async function scenePoint(x, y) {
  return page.evaluate(([x, y]) => {
    const r = document.getElementById('sceneInner').getBoundingClientRect();
    return { x: r.left + x / 900 * r.width, y: r.top + y / 1600 * r.height };
  }, [x, y]);
}
const tap = async (x, y) => { const p = await scenePoint(x, y); await page.touchscreen.tap(p.x, p.y); };

await page.goto(url);
await shot('01-home');
check('accueil affiché', await page.locator('#screen-home.active').count() === 1);
check('3 époques', await page.locator('.era-card').count() === 3);

/* --- ouvrir l'époque Moyen Âge, niveau 1 --- */
await page.click('[data-era="moyen-age"]');
await shot('02-era');
const nMoyenAge = await page.evaluate(() => Anachro.data.inEra('moyen-age').length);
check('niveaux suivants verrouillés au départ', await page.locator('.tile.locked').count() === nMoyenAge - 1, `${nMoyenAge} niveaux dans l'époque`);
await page.click('[data-level="ma-marche"]');
await shot('03-start');
check('carte de démarrage', await page.locator('.modal [data-act="go"]').count() === 1);
await page.click('[data-act="go"]');
await page.waitForTimeout(1300);
const t1 = await page.textContent('#timerText');
check('le chrono descend', t1 !== '0:30', t1);

/* --- mauvais tap : perd une vie --- */
await tap(700, 300);
await page.waitForTimeout(150);
check('vie perdue au mauvais tap', await page.locator('.heart.lost').count() === 1);
await shot('04-miss');

/* --- indice --- */
await page.click('#hintBtn');
check('indice décompté', (await page.textContent('#hintCount')) === '2');
await page.waitForTimeout(200);
await shot('05-hint');

/* --- zoom --- */
await page.click('#zoomBtn');
await page.waitForTimeout(400);
const tr = await page.evaluate(() => document.getElementById('sceneInner').style.transform);
check('zoom appliqué', /scale\(2\.3\)/.test(tr), tr);
await shot('06-zoom');
await page.click('#zoomBtn');
await page.waitForTimeout(400);

/* --- pause : la scène est masquée, le chrono s'arrête --- */
await page.click('[data-act="pause"]');
const pa = await page.textContent('#timerText');
await page.waitForTimeout(1200);
check('chrono figé en pause', pa === await page.textContent('#timerText'), pa);
await shot('07-pause');
await page.click('[data-act="resume"]');

/* --- bon tap : victoire --- */
const t0 = await page.evaluate(() => Anachro.data.byId['ma-marche'].target);
await tap(t0.x, t0.y);
await page.waitForTimeout(700);
check('victoire', await page.locator('.sheet.win').count() === 1);
check('callout affiché', await page.locator('.callout').count() === 1);
check('taps ignorés après victoire', (await page.locator('.miss').count()) === 0);
await shot('08-win');
const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('anachro.v1')));
check('progression enregistrée', saved.levels['ma-marche'] && saved.levels['ma-marche'].stars >= 1, JSON.stringify(saved.levels['ma-marche']));

/* --- niveau suivant débloqué --- */
await page.click('[data-act="next"]');
await page.waitForTimeout(200);
check('niveau suivant lancé', (await page.textContent('#levelPill')) === 'Niveau 2');
await page.click('[data-act="go"]');

/* --- défaite par manque de vies --- */
await tap(100, 300); await page.waitForTimeout(100);
await tap(150, 400); await page.waitForTimeout(100);
await tap(200, 500); await page.waitForTimeout(700);
check('défaite (0 vie)', await page.locator('.sheet.lose').count() === 1);
await shot('09-lose');

/* --- défaite par le temps --- */
await page.evaluate(() => { Anachro.data.TIME_LIMIT = 2; });
await page.click('[data-act="retry"]');
await page.click('[data-act="go"]');
await page.waitForTimeout(2600);
check('défaite (temps écoulé)', (await page.textContent('.sheet.lose .sheet-title')).includes('Temps'));
await page.evaluate(() => { Anachro.data.TIME_LIMIT = 30; });

/* --- retour, classement, profil --- */
await page.click('[data-act="quit"]');
await page.click('[data-tab="ranking"]');
await shot('10-ranking');
check('classement affiche le record', (await page.textContent('.rank-list')).includes('Le marché'));
await page.click('[data-tab="profile"]');
await shot('11-profile');
await page.click('[data-tab="home"]');
await shot('12-home-after');

/* --- lien de défi --- */
await page.goto(url + '#niveau=eg-desert&t=18');
await page.waitForTimeout(300);
const numDesert = await page.evaluate(() => Anachro.data.levels.findIndex(l => l.id === 'eg-desert') + 1);
check('défi ouvre le bon niveau', (await page.textContent('#levelPill')) === 'Niveau ' + numDesert, 'Niveau ' + numDesert);
check('défi mentionné', (await page.textContent('.modal')).includes('18'));
await shot('13-challenge');

/* --- niveau du jour + série --- */
await page.goto(url);
await page.click('.daily');
await page.click('[data-act="go"]');
const id = await page.evaluate(() => document.getElementById('levelPill').textContent);
check('niveau du jour lancé', /Niveau \d/.test(id), id);

/* --- chaque niveau est gagnable, et chaque zone valide fait gagner --- */
const cases = await page.evaluate(() => Anachro.data.levels.flatMap(l => Anachro.data.zones(l).map((z, i) => [l.id, i, z.x, z.y])));
let visit = 0;
for (const [lid, i, x, y] of cases) {
  await page.goto(`${url}?v=${++visit}#niveau=${lid}`); // paramètre unique : évite que le navigateur ne recharge pas la même URL
  await page.click('[data-act="go"]');
  await page.waitForFunction(() => document.querySelector('#hintBtn') && !document.querySelector('#hintBtn').disabled);
  await tap(x, y);
  await page.waitForTimeout(250);
  check(`gagnable : ${lid} (zone ${i + 1})`, await page.locator('.sheet.win').count() === 1);
  if (['us-banquette', 'eg-desert', 'ma-chevalier'].includes(lid) && i === 0) { await page.waitForTimeout(700); await shot('win-' + lid); }
}

/* --- un tap juste à côté d'un intrus, hors zone, coûte une vie --- */
await page.goto(`${url}?v=${++visit}#niveau=ma-marche`);
await page.click('[data-act="go"]');
await page.waitForFunction(() => document.querySelector('#hintBtn') && !document.querySelector('#hintBtn').disabled);
const tz = await page.evaluate(() => Anachro.data.byId['ma-marche'].target);
await tap(tz.x + tz.r + 120, tz.y);
await page.waitForTimeout(150);
check('tap hors zone = vie perdue', await page.locator('.heart.lost').count() === 1);

/* --- effacer la progression : confirmation en deux touches --- */
await page.goto(url);
await page.click('[data-tab="profile"]');
await page.click('[data-act="reset"]');
check('1re touche : demande confirmation', await page.locator('[data-act="reset"].armed').count() === 1);
check('rien effacé après 1 touche', await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('anachro.v1')).levels).length > 0));
await page.click('[data-act="reset"]');
check('2e touche : progression effacée', await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('anachro.v1')).levels).length === 0));

check('aucune erreur JS', errors.length === 0, errors.join(' | '));
await browser.close();
