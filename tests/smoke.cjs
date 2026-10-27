// Headless smoke test: loads every view at desktop and phone width and reports
// script errors, error pages and horizontal overflow.
//   python3 -m http.server 8765 --bind 127.0.0.1   (in the repo root)
//   node tests/smoke.cjs [screenshot-dir]
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const out = process.argv[2] || null;
  const routes = ['', 'story', 'story/west-indies', 'story/district-inspector', 'tree', 'tree/bellingham', 'tree/somerville?focus=reginald-somerville', 'people', 'person/bellingham-arthur-somerville', 'person/tenison-alan-somerville', 'person/narrator', 'person/tenison-somerville-1812', 'person/pat', 'person/vere-somerville', 'places', 'place/clermont', 'timeline', 'timeline?e=ev-youghal-1887', 'glossary', 'term/ric', 'transcript', 'transcript/T1:148', 'transcript/T2', 'transcript/T2:118', 'compare', 'compare?at=T1:312', 'questions', 'questions?q=q-bunt-regiment', 'sources', 'search?q=bellendrum', 'search?q=Bunt', 'search?q=Tenison', 'search?q=Reendesert', 'about'];
  for (const [w, h, tag] of [[1366, 900, 'd'], [390, 844, 'm']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const errs = [];
    page.on('pageerror', e => errs.push('pageerror ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text()); });
    for (const r of routes) {
      await page.goto('http://127.0.0.1:8765/#/' + r, { waitUntil: 'networkidle' }).catch(e => errs.push('goto ' + r + ' ' + e.message));
      await page.waitForTimeout(400);
      const txt = await page.evaluate(() => document.querySelector('main').innerText.slice(0, 80).replace(/\n/g, ' '));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (/Something went wrong|Not found/.test(txt) || overflow) errs.push(`${tag} ${r}: ${overflow ? 'HORIZONTAL OVERFLOW ' : ''}${txt}`);
      const name = (tag + '-' + (r || 'home')).replace(/[^a-z0-9-]+/gi, '_');
      if (out && ['', 'tree', 'person/bellingham-arthur-somerville', 'places', 'timeline', 'transcript/T1:148', 'transcript/T2', 'transcript/T2:118', 'compare', 'compare?at=T1:312', 'story/west-indies', 'people'].includes(r)) await page.screenshot({ path: `${out}/${name}.png` });
    }
    console.log(tag, errs.length ? errs.join('\n') : 'no errors');
    if (errs.length) process.exitCode = 1;
    await page.close();
  }
  await browser.close();
})();
