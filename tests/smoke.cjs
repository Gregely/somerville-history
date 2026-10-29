// Headless smoke test: loads every view at desktop and phone width and reports
// script errors, error pages and horizontal overflow.
//   python3 -m http.server 8765 --bind 127.0.0.1   (in the repo root)
//   node tests/smoke.cjs [screenshot-dir]
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const out = process.argv[2] || null;
  const routes = ['', 'story', 'story/west-indies', 'story/district-inspector', 'tree', 'tree/bellingham', 'tree/somerville?focus=reginald-somerville', 'people', 'person/bellingham-arthur-somerville', 'person/tenison-alan-somerville', 'person/narrator', 'person/interviewer', 'person/charles-somerville', 'tree/somerville?focus=interviewer', 'place/cumry', 'person/alan-everard-somerville', 'person/rector-johnson', 'person/william-abraham-johnson', 'sources?s=family-tree-2026', 'person/tenison-somerville-1812', 'person/pat', 'person/vere-somerville', 'places', 'place/clermont', 'timeline', 'timeline?e=ev-youghal-1887', 'glossary', 'term/ric', 'transcript', 'transcript/T1:148', 'transcript/T2', 'transcript/T2:118', 'compare', 'compare?at=T1:312', 'questions', 'questions?q=q-bunt-regiment', 'corrections', 'corrections?c=ic-pat-capture', 'search?q=sabre', 'sources', 'search?q=bellendrum', 'search?q=Bunt', 'search?q=Tenison', 'search?q=Reendesert', 'about', 'transcript/T3', 'transcript/T3:81', 'story/arms-and-claim', 'story/dormant-title', 'story/the-narrator', 'person/elizabeth-mary-somerville', 'person/quentin-somerville', 'person/henry-bellingham-somerville-1859', 'person/thomas-tennison', 'tree/bellingham?focus=thomas-bellingham', 'place/queenstown', 'questions?q=q-family-bible', 'corrections?c=ic-arms-date', 'term/confirmation-of-arms', 'sources?s=visitation-1897', 'search?q=Athlumney', 'search?q=Choyce', 'account', 'genealogy', 'genealogy/people', 'genealogy/people?branch=america', 'genealogy/person/0563', 'genealogy/person/0501', 'genealogy/person/0587', 'genealogy/person/0603', 'genealogy/person/0682', 'genealogy/person/0689', 'genealogy/tree', 'genealogy/tree/clermont?focus=0631', 'genealogy/tree/all?view=list', 'genealogy/differences', 'genealogy/differences?d=gd-corry-death', 'genealogy/sources', 'search?q=Tullykelter'];
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
      if (out && ['', 'tree', 'person/bellingham-arthur-somerville', 'places', 'timeline', 'transcript/T1:148', 'transcript/T2', 'transcript/T2:118', 'compare', 'compare?at=T1:312', 'story/west-indies', 'people', 'account', 'genealogy', 'genealogy/person/0563', 'genealogy/tree', 'genealogy/differences'].includes(r)) await page.screenshot({ path: `${out}/${name}.png` });
    }
    // the complete transcripts are published: no redaction markers, and
    // passages once withheld are visible on the transcript and compare pages
    for (const [r, want] of [['transcript/T1:596', 'sent to a gulag'], ['transcript/T2:238', 'small flat in Eger'], ['transcript/T1:70', 'district nurse'], ['compare?at=T1:596', 'sent to a gulag']]) {
      await page.goto('http://127.0.0.1:8765/#/' + r, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      const body = await page.evaluate(() => document.querySelector('main').innerText);
      if (/withheld from the public copy|withheld…/i.test(body)) errs.push(`${tag} ${r}: redaction marker shown`);
      if (!body.includes(want)) errs.push(`${tag} ${r}: expected text "${want}" not visible`);
    }
    // transcript C: published complete except the masked PIN, cited as "C¶n"
    await page.goto('http://127.0.0.1:8765/#/transcript/T3:43', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const t3 = await page.evaluate(() => document.querySelector('main').innerText);
    if (!t3.includes('[PIN removed]') || /pin is \d{4}/i.test(t3)) errs.push(`${tag} transcript/T3:43: PIN not masked`);
    if (!t3.includes('Bellingham Arthur\'s elder brother was called Henry')) errs.push(`${tag} transcript/T3: passage missing`);
    await page.goto('http://127.0.0.1:8765/#/person/elizabeth-mary-somerville', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const cites = await page.evaluate(() => [...document.querySelectorAll('main a.cite-q')].map((a) => a.textContent));
    if (!cites.some((c) => /^C¶\d/.test(c))) errs.push(`${tag} person/elizabeth-mary-somerville: no C¶ citation links`);
    // the saga: marked as a later synthesis, with its evidence key, labels, sections and transcript links
    await page.goto('http://127.0.0.1:8765/#/story/dormant-title', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const saga = await page.evaluate(() => ({
      kicker: document.querySelector('.chapter .kicker')?.textContent || '',
      note: document.querySelector('.callout-syn')?.innerText || '',
      key: document.querySelectorAll('.evk-key li').length,
      labels: document.querySelectorAll('.chapter p .evk').length,
      heads: document.querySelectorAll('.chapter h2.ch-h').length,
      secs: document.querySelectorAll('.ch-sections button').length,
      cites: [...document.querySelectorAll('.chapter a.cite-q')].map((a) => a.textContent),
      raw: /\{[a-z]+:|\{(h|int|ctx)\}/.test(document.querySelector('main').innerText),
    }));
    if (!/later synthesis/i.test(saga.kicker) || !/not Grandpa's own account/.test(saga.note)) errs.push(`${tag} story/dormant-title: not marked as a later synthesis`);
    if (saga.key !== 7 || saga.labels < 50 || saga.heads < 15 || saga.secs !== saga.heads) errs.push(`${tag} story/dormant-title: key ${saga.key}, labels ${saga.labels}, headings ${saga.heads}, section buttons ${saga.secs}`);
    for (const [re, t] of [[/^¶\d/, "A"], [/^B¶\d/, "B"], [/^C¶\d/, "C"]]) if (!saga.cites.some((c) => re.test(c))) errs.push(`${tag} story/dormant-title: no transcript ${t} citation links`);
    if (saga.raw) errs.push(`${tag} story/dormant-title: raw markup shown`);
    // the narrator's biography: a separate synthesis, with images credited and licensed
    await page.goto('http://127.0.0.1:8765/#/story/the-narrator', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('figure.arch-fig').forEach((f) => f.scrollIntoView()));
    await page.waitForTimeout(800);
    const bio = await page.evaluate(() => ({
      note: document.querySelector('.callout-syn')?.innerText || '',
      figs: [...document.querySelectorAll('.chapter figure.arch-fig')].map((f) => ({ ok: f.querySelector('img').complete && f.querySelector('img').naturalWidth > 0, credit: f.querySelector('.fig-credit')?.innerText || '' })),
      body: document.querySelector('main').innerText,
    }));
    if (!/not Grandpa's own account/.test(bio.note)) errs.push(`${tag} story/the-narrator: not marked as a later synthesis`);
    if (!bio.figs.length || bio.figs.some((f) => !f.ok || !/CC BY|CC0|Public domain/.test(f.credit) || !/Photograph: /.test(f.credit))) errs.push(`${tag} story/the-narrator: figure missing, broken or uncredited ${JSON.stringify(bio.figs)}`);
    if (!/10 August 1983|10th August 1983/.test(bio.body) || /\{[a-z]+:/.test(bio.body)) errs.push(`${tag} story/the-narrator: kidnapping date missing or raw markup shown`);
    await page.goto('http://127.0.0.1:8765/#/story', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    if (!(await page.evaluate(() => document.querySelector('.chapter-card.syn .syn-badge')?.textContent || '')).includes("not Grandpa's own account")) errs.push(`${tag} story: synthesis badge missing`);
    // the two parts: every page says which part it belongs to, and links between them are labelled
    for (const [r, sel, want] of [['story', '.sec-banner.sb-account', "My Grandfather's Account"], ['person/corry-somerville', '.sec-banner.sb-account', "My Grandfather's Account"],
      ['genealogy/person/0586', '.sec-banner.sb-genealogy', 'Extended Somerville Family Genealogy'], ['genealogy/tree', '.sec-banner.sb-genealogy', 'not what Grandpa said'],
      ['person/corry-somerville', 'main .xcard-g', 'In the extended genealogy'], ['genealogy/person/0586', 'main .xcard-a', "Grandpa's account"],
      ['genealogy/person/0501', 'main .xcard-none', 'Not in Grandpa'], ['', 'main .part-g', 'supplementary research'], ['', 'main .part-a', 'original project'],
      ['genealogy/person/0603', 'main .callout-doubt', 'doubtful'], ['genealogy/person/0587', 'main .g-alt', 'Wendy Stevenson'],
      ['search?q=Tullykelter', 'main .rp-genealogy', 'In the extended genealogy'], ['people', 'main', 'not in the recordings']]) {
      await page.goto('http://127.0.0.1:8765/#/' + r, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const t = await page.evaluate((q) => { const el = document.querySelector(q); return el && !el.hidden ? el.textContent : null; }, sel);
      if (!t || !t.includes(want)) errs.push(`${tag} ${r}: expected "${want}" in ${sel}`);
    }
    // living relatives' profiles are published in full, without addresses
    for (const [r, want, banned] of [['genealogy/person/0682', /18 Mar 1937/, /Marlborough|Dargle|Rossana Cottage/i], ['genealogy/person/0691', /22 Apr 1969/, /Hatch St|Slaney/i],
      ['genealogy/person/0693', /Budapest/, /Szarvas|Olasz|Hatch St/i], ['genealogy/person/0689', /Naivasha/, /Dargle|Crowe/i], ['genealogy/person/0687', /Feeny|2018/, /Ash Park|Knockan|BT47/i],
      ['genealogy/person/0664', /Kashmir/, /Dargle|59 Queensgate|SW7/i], ['genealogy/person/0675', /Pettigrew/, /@/]]) {
      await page.goto('http://127.0.0.1:8765/#/' + r, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const body = await page.evaluate(() => [...document.querySelectorAll('main .g-profile-head, main .profile-main, main .family-card')].map((el) => el.innerText).join(' '));
      if (!want.test(body)) errs.push(`${tag} ${r}: profile text missing (${want})`);
      if (banned.test(body)) errs.push(`${tag} ${r}: shows an address (${body.match(banned)[0]})`);
      if ((await page.evaluate(() => document.querySelector('main').innerText)).includes('⟦')) errs.push(`${tag} ${r}: raw address marker shown`);
    }
    console.log(tag, errs.length ? errs.join('\n') : 'no errors');
    if (errs.length) process.exitCode = 1;
    await page.close();
  }
  await browser.close();
})();
