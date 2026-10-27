/* Page views. Each view renders into the <main> element. */
(function () {
  "use strict";
  const SA = window.SA, A = SA.data, esc = SA.esc;
  const V = (SA.views = {});

  // ---------- shared fragments ----------
  const legend = () => `
    <div class="legend" aria-label="How to read the evidence labels">
      ${Object.entries(SA.STATUS).map(([k, s]) => `<div>${SA.badge(k)}<span>${esc(s.long)}</span></div>`).join("")}
      <div><span class="badge st-plain">Confidence<span class="conf conf-high"><i></i><i></i><i></i></span></span><span>three bars high · two medium · one low</span></div>
      <div><span><a class="cite-q" tabindex="-1">¶16</a> <a class="cite-q cite-b" tabindex="-1">B¶7</a></span><span>a supporting passage in transcript A (the original) or B (the companion transcript); hover to see it beside the parallel passage in the other transcript</span></div>
      <div><a class="cite-s" tabindex="-1">[3]</a><span>links to an external source</span></div>
    </div>`;
  SA.legend = legend;

  function factTable(facts) {
    if (!facts || !facts.length) return "";
    return `<table class="facts"><thead><tr><th scope="col">Fact</th><th scope="col">Detail</th><th scope="col">Evidence</th></tr></thead><tbody>${facts.map((f) => `
      <tr><th scope="row">${esc(f.label)}</th>
        <td>${SA.inline(f.value)}${f.narrator ? `<div class="note narrator"><b>❝ Narrator's account:</b> ${SA.inline(f.narrator)}</div>` : ""}${f.note ? `<div class="note">${SA.inline(f.note)}</div>` : ""}</td>
        <td class="ev">${SA.badge(f.status, f.conf)}<div class="cites">${SA.citeList(f.cite)} ${(f.src || []).map(SA.sourceLink).join(" ")}</div></td></tr>`).join("")}</tbody></table>`;
  }
  function passageList(keys, query) {
    if (!keys.length) return "";
    return `<ol class="passages">${keys.map((k) => {
      const l = SA.lines[k];
      if (!l) return "";
      const text = query ? SA.snippet(l.text, query, 260) : esc(l.text.length > 300 ? l.text.slice(0, 300) + "…" : l.text);
      const t = k.split(":")[0];
      return `<li><a class="pn" href="#/transcript/${k}">${t === "T1" ? "" : SA.TLABEL[t]}¶${l.n}</a><span>${text}</span></li>`;
    }).join("")}</ol>`;
  }
  function evidenceSection(owner, primaryName) {
    const cited = SA.refsOwnedBy(owner);
    const extra = SA.mentionsOf(owner).filter((k) => !cited.includes(k));
    const q = primaryName && primaryName.split(/[ (]/)[0];
    return `
      ${cited.length ? `<section class="block"><h2>Supporting passages <span class="count">${cited.length}</span></h2><p class="muted small">Passages of the transcript cited for this entry, in order.</p>${passageList(cited)}</section>` : ""}
      ${extra.length ? `<section class="block"><h2>Other possible mentions <span class="count">${extra.length}</span></h2><p class="muted small">Found automatically by matching transcript spellings; not individually checked.</p>${passageList(extra, q)}</section>` : ""}`;
  }
  const eventItems = (events) => events.length ? `<ul class="mini-events">${events.slice().sort((a, b) => a.year - b.year || (a.month || 0) - (b.month || 0)).map((e) => `<li><span class="yr">${esc(e.display)}</span><a href="#/timeline?e=${e.id}">${esc(e.title)}</a></li>`).join("")}</ul>` : "";
  const questionItems = (qs) => qs.length ? `<ul class="mini-qs">${qs.map((q) => `<li><span class="qstatus qs-${q.status.replace(/\s/g, "-")}">${esc(q.status)}</span><a href="#/questions?q=${q.id}">${esc(q.title)}</a></li>`).join("")}</ul>` : "";
  const personChip = (id, extra = "") => {
    const p = SA.people[id];
    if (!p) return "";
    return `<a class="pchip ${p.placeholder ? "ph" : ""}" href="#/person/${id}"><span class="nm">${esc(p.name)}</span><span class="lf">${esc(SA.shortLife(p))}${extra}</span></a>`;
  };
  SA.personChip = personChip;

  // ---------- home ----------
  V.home = function (main) {
    const line = SA.lineOfDescent("narrator");
    const counts = [
      ["people", A.people.filter((p) => !p.placeholder).length, "#/people"],
      ["places", A.places.length, "#/places"],
      ["events", A.events.length, "#/timeline"],
      ["terms", A.glossary.length, "#/glossary"],
      ["open questions", A.questions.filter((q) => q.status !== "resolved").length, "#/questions"],
    ];
    main.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <p class="kicker">A family archive · from a recorded conversation</p>
          <h1>The Somervilles of Ardrass, Castle Bellingham &amp; Clermont</h1>
          <p class="lede">Six generations of a family remembered by Grandpa, who is coming up to 90: a Lord Mayor's baronetcy, a diary kept every evening in the 1820s, a son who fled to Barbados, three generations in the Irish Constabulary, a house at Rathnew, and the Great War. Every claim links to the words he used.</p>
          <div class="hero-actions">
            <a class="btn primary" href="#/story">Read the family story</a>
            <a class="btn" href="#/tree">Explore the tree</a>
            <a class="btn" href="#/transcript">Read the transcript</a>
          </div>
        </div>
        <ol class="descent" aria-label="Line of descent to the narrator">
          ${line.map((id, i) => { const p = SA.people[id]; const sp = SA.partnersOf(id).find((s) => line[i + 1] && SA.parentsOf(line[i + 1]).includes(s)); return `<li><a href="#/person/${id}"><span class="nm">${esc(p.name)}</span><span class="lf">${esc(SA.shortLife(p))}</span></a>${sp ? `<span class="sp">∞ <a href="#/person/${sp}">${esc(SA.people[sp].name)}</a></span>` : ""}</li>`; }).join("")}
        </ol>
      </section>
      <section class="stats">${counts.map(([l, n, href]) => `<a href="${href}"><b>${n}</b><span>${l}</span></a>`).join("")}</section>
      <section class="grid-cards">
        ${[
          ["#/story", "Family story", "Eleven chapters that follow the family from the 1740s to the sale of Clermont, with the wider history alongside."],
          ["#/tree", "Family tree", "Interactive chart of the Somervilles and the families they married into. Drag, zoom, and click anyone."],
          ["#/people", "People", "A searchable profile for every identifiable person, with the name variants heard in the recording."],
          ["#/places", "Places", "From Cumry and Castle Bellingham to Trinidad, Archangel and Nanyuki, on a map."],
          ["#/timeline", "Timeline", "Family events and the wider history from 1736 to today, side by side."],
          ["#/glossary", "Glossary", "RIC ranks, militia, dormant titles, local expressions, surnames and nicknames."],
          ["#/questions", "Open questions", "What is uncertain or contradictory, and what to look for next."],
          ["#/transcript", "Transcript", "The full conversation, annotated with readings of the words the transcription software misheard."],
        ].map(([h, t, d]) => `<a class="card-link" href="${h}"><h3>${t}</h3><p>${d}</p></a>`).join("")}
      </section>
      <section class="block two-col">
        <div>
          <h2>How to read this archive</h2>
          <p>Grandpa's words are <strong>testimony</strong>: what he remembers, often from family papers he read long ago. We label our own readings, such as which \"Captain Somerville\" a newspaper meant or what the speech-to-text software was trying to spell, as <strong>interpretation</strong>, each with a confidence level. Facts from outside the family appear as <strong>published record</strong> with a numbered citation. Where they disagree we say so and keep both.</p>
          ${legend()}
        </div>
        <div>
          <h2>Most important open questions</h2>
          ${questionItems(A.questions.filter((q) => q.priority === "high"))}
          <p><a href="#/questions">All ${A.questions.length} questions →</a></p>
          <div class="callout callout-sensitive"><div class="callout-label">The complete record</div><p>Both transcripts are published in full, including the everyday conversation around the history. Grandpa asked for discretion about the 1887 Youghal story; the family has decided to include it, with the family account, the parliamentary record and local history kept separate. See <a href="#/about">About this archive</a>.</p></div>
        </div>
      </section>`;
  };

  // ---------- story ----------
  V.story = function (main, id) {
    const chs = A.narrative;
    const ch = id && SA.chapters[id];
    const toc = `<nav class="toc" aria-label="Chapters"><ol>${chs.map((c, i) => `<li class="${ch && c.id === ch.id ? "cur" : ""}"><a href="#/story/${c.id}"><span class="n">${i + 1}</span><span><b>${esc(c.title)}</b><small>${esc(c.era)}</small></span></a></li>`).join("")}</ol></nav>`;
    if (!ch) {
      main.innerHTML = `
        <header class="page-head"><p class="kicker">Historical narrative</p><h1>The family story</h1>
        <p class="lede">A connected account, built from the conversation and checked against published history. Grandpa's words are quoted with links to the transcript; wider history appears in shaded boxes; our own interpretations are marked.</p></header>
        <div class="story-index">${chs.map((c, i) => `<a class="chapter-card" href="#/story/${c.id}"><span class="n">${i + 1}</span><div><h3>${esc(c.title)}</h3><p class="era">${esc(c.era)}</p><p>${esc(c.lede)}</p></div></a>`).join("")}</div>`;
      return;
    }
    const i = chs.indexOf(ch);
    main.innerHTML = `
      <div class="story-layout">
        <aside class="story-side">${toc}</aside>
        <article class="chapter prose">
          <p class="kicker">Chapter ${i + 1} · ${esc(ch.era)}</p>
          <h1>${esc(ch.title)}</h1>
          <p class="lede">${esc(ch.lede)}</p>
          ${ch.sensitive ? `<div class="callout callout-sensitive"><div class="callout-label">Handle with discretion</div><p>The narrator asked that part of this chapter be treated carefully. It concerns a death in 1887 that is documented in public records.</p></div>` : ""}
          ${SA.paras(ch.body)}
          ${(ch.people || []).length ? `<div class="chapter-people"><h2>People in this chapter</h2><div class="pchips">${ch.people.map((p) => personChip(p)).join("")}</div></div>` : ""}
          <nav class="pager">${i > 0 ? `<a href="#/story/${chs[i - 1].id}">← ${esc(chs[i - 1].title)}</a>` : "<span></span>"}${i < chs.length - 1 ? `<a href="#/story/${chs[i + 1].id}">${esc(chs[i + 1].title)} →</a>` : ""}</nav>
        </article>
      </div>`;
  };

  // ---------- tree ----------
  V.tree = function (main, tid, params) {
    main.classList.add("full");
    main.innerHTML = `<div class="tree-host"></div>`;
    SA.mountTree(main.querySelector(".tree-host"), { tree: tid || (params.focus && SA.treeOf(params.focus)) || "somerville", focus: params.focus, view: params.view });
  };

  // ---------- people ----------
  V.people = function (main, params) {
    const fams = [...new Set(A.people.map((p) => p.family))];
    main.innerHTML = `
      <header class="page-head"><p class="kicker">Directory</p><h1>People</h1>
        <p class="lede">${A.people.filter((p) => !p.placeholder).length} named people and ${A.people.filter((p) => p.placeholder).length} placeholders for people we know existed but cannot name. Search by any name, nickname or the way the transcript spelled it.</p></header>
      <div class="filters">
        <input type="search" class="grow" placeholder="Filter by name, nickname or misspelling (e.g. Bellendrum, Bunt, Tete)…" data-f="q" value="${esc(params.q || "")}" aria-label="Filter people" />
        <select data-f="family" aria-label="Family"><option value="">All families</option>${fams.map((f) => `<option value="${f}">${esc(SA.FAMILY[f] || f)}</option>`).join("")}</select>
        <select data-f="cat" aria-label="Category"><option value="">All categories</option>${Object.entries(SA.CATEGORY).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select>
        <select data-f="sort" aria-label="Sort"><option value="gen">Sort by generation</option><option value="az">Sort A–Z</option></select>
        <label class="tog"><input type="checkbox" data-f="ph" checked /> Placeholders</label>
      </div>
      <div class="people-grid" aria-live="polite"></div>`;
    const grid = main.querySelector(".people-grid");
    const f = (k) => main.querySelector(`[data-f="${k}"]`);
    if (params.family) f("family").value = params.family;
    const gen = (id) => { const ps = SA.parentsOf(id); return ps.length ? 1 + Math.max(...ps.map(gen)) : (SA.partnersOf(id).length ? Math.max(0, ...SA.partnersOf(id).filter((x) => SA.parentsOf(x).length).map((x) => gen(x))) : 0); };
    const birthKey = (p) => { const m = String((p.born && p.born.display) || (p.died && p.died.display) || "").match(/\d{4}/); return m ? +m[0] : 9999; };
    const draw = () => {
      const q = f("q").value.trim(), fam = f("family").value, cat = f("cat").value, ph = f("ph").checked;
      let list = A.people.filter((p) => (!fam || p.family === fam) && (!cat || p.category === cat) && (ph || !p.placeholder));
      if (q) { const hits = new Set(SA.search(q, 200).filter((d) => d.type === "person").map((d) => d.id)); list = list.filter((p) => hits.has(p.id)); }
      if (f("sort").value === "az") list.sort((a, b) => a.name.localeCompare(b.name));
      else list.sort((a, b) => gen(a.id) - gen(b.id) || birthKey(a) - birthKey(b) || a.name.localeCompare(b.name));
      grid.innerHTML = list.length ? list.map((p) => {
        const rel = SA.relLabel(p.id);
        return `<a class="person-card fam-${p.family} ${p.placeholder ? "ph" : ""}" href="#/person/${p.id}">
          <div class="pc-top"><span class="fam">${esc(SA.FAMILY[p.family])}</span>${p.living || p.possiblyLiving ? `<span class="tag">living</span>` : ""}${p.placeholder ? `<span class="tag">placeholder</span>` : ""}</div>
          <h3>${esc(p.name)}</h3>
          <div class="lf">${esc(SA.lifespan(p))}</div>
          ${rel ? `<div class="rel">${esc(rel)}</div>` : ""}
          <p>${esc(SA.plain(p.summary)).slice(0, 180)}${SA.plain(p.summary).length > 180 ? "…" : ""}</p>
          ${(p.aliases || []).length ? `<div class="aka">aka ${esc(p.aliases.slice(0, 3).join(", "))}</div>` : ""}
        </a>`;
      }).join("") : `<p class="empty">No one matches. Try a different spelling: the search also matches near-misses.</p>`;
    };
    main.querySelector(".filters").addEventListener("input", draw);
    draw();
  };

  V.person = function (main, id) {
    const p = SA.people[id];
    if (!p) return V.notFound(main);
    const rel = SA.relLabel(id);
    const parents = SA.parentsOf(id), partners = SA.partnersOf(id), kids = SA.childrenOf(id), sibs = SA.siblingsOf(id);
    const spInfo = (sid) => {
      const s = SA.spousesOf(id).find((x) => x.id === sid);
      if (!s) return `<div class="small muted">co-parent</div>`;
      return `<div class="small">${s.date ? `married ${esc(s.date)}` : "married"}${s.place && SA.places[s.place] ? `, ${SA.link("pl", s.place)}` : ""} ${SA.badge(s.status || "testimony", s.conf)} ${SA.citeList(s.cite)} ${(s.src || []).map(SA.sourceLink).join(" ")}${s.note ? `<div class="note">${esc(s.note)}</div>` : ""}</div>`;
    };
    const line = SA.lineOfDescent(id);
    const events = SA.eventsFor("p", id), qs = SA.questionsFor("p", id), terms = SA.termsFor("p", id), chs = SA.chaptersFor("p", id);
    const tree = SA.treeOf(id);
    const lifeFact = (k, label) => p[k] ? `<div class="lifefact"><span class="lbl">${label}</span> <b>${esc(p[k].display)}</b> ${SA.badge(p[k].status, p[k].conf)} ${SA.citeList(p[k].cite)} ${(p[k].src || []).map(SA.sourceLink).join(" ")}${p[k].narrator ? `<div class="note narrator"><b>❝ Narrator's account:</b> ${SA.inline(p[k].narrator)}</div>` : ""}${p[k].note ? `<div class="note">${esc(p[k].note)}</div>` : ""}</div>` : "";
    main.innerHTML = `
      <article class="profile">
        <header class="profile-head fam-${p.family}">
          <p class="kicker">${esc(SA.FAMILY[p.family])} · ${esc(SA.CATEGORY[p.category] || "")}${p.placeholder ? " · placeholder" : ""}</p>
          <h1>${esc(p.name)}</h1>
          ${p.fullName && p.fullName !== p.name ? `<p class="fullname">${esc(p.fullName)}</p>` : ""}
          ${rel ? `<p class="relchip">${esc(rel)}</p>` : ""}
          <div class="lifefacts">${lifeFact("born", "Born")}${lifeFact("died", "Died")}</div>
          ${(p.aliases || []).length ? `<p class="aka"><span class="lbl">Also known as</span> ${p.aliases.map((a) => `<span class="alias">${esc(a)}</span>`).join(" ")}</p>` : ""}
          ${(p.variants || []).length ? `<p class="aka"><span class="lbl">Heard in the transcript as</span> ${p.variants.map((a) => `<span class="variant">“${esc(a)}”</span>`).join(" ")}</p>` : ""}
          ${p.living || p.possiblyLiving ? `<div class="callout callout-sensitive"><div class="callout-label">Living person</div><p>This person is living or may be living. Only what bears on the family history is recorded.</p></div>` : ""}
        </header>
        <div class="profile-grid">
          <div class="profile-main prose">
            <p class="lede">${SA.inline(p.summary)}</p>
            <section class="block"><h2>Biography</h2>${SA.paras(p.bio)}</section>
            ${p.facts && p.facts.length ? `<section class="block"><h2>Facts and evidence</h2>${factTable(p.facts)}</section>` : ""}
            ${evidenceSection(`p:${id}`, p.name)}
          </div>
          <aside class="profile-side">
            <section class="side-card family-card">
              <h2>Family</h2>
              <h3>Parents</h3><div class="pchips">${parents.map((x) => personChip(x)).join("") || "<span class='muted small'>Not recorded</span>"}${parents.length && p.parentConf && p.parentConf !== "high" ? `<div class="small">${SA.badge("inferred", p.parentConf)} parentage</div>` : ""}</div>
              ${partners.length ? `<h3>Partners</h3>${partners.map((x) => `<div class="partner">${personChip(x)}${spInfo(x)}</div>`).join("")}` : ""}
              ${sibs.length ? `<h3>Siblings</h3><div class="pchips">${sibs.map((x) => personChip(x)).join("")}</div>` : ""}
              ${kids.length ? `<h3>Children</h3><div class="pchips">${kids.map((x) => personChip(x)).join("")}</div>` : ""}
              ${tree ? `<a class="btn small-btn" href="#/tree/${tree}?focus=${id}">View in family tree</a>` : ""}
            </section>
            ${line.length > 1 ? `<section class="side-card"><h2>Line of descent</h2><ol class="chain">${line.map((x) => `<li class="${x === id ? "cur" : ""}"><a href="#/person/${x}">${esc(SA.people[x].name)}</a> <small>${esc(SA.shortLife(SA.people[x]))}</small></li>`).join("")}</ol></section>` : ""}
            ${(p.places || []).length ? `<section class="side-card"><h2>Places</h2><div class="chips">${p.places.map((pl) => SA.chip(`pl:${pl}`)).join("")}</div></section>` : ""}
            ${events.length ? `<section class="side-card"><h2>Timeline</h2>${eventItems(events)}</section>` : ""}
            ${chs.length ? `<section class="side-card"><h2>In the story</h2><div class="chips">${chs.map((c) => SA.chip(`ch:${c.id}`)).join("")}</div></section>` : ""}
            ${qs.length ? `<section class="side-card"><h2>Open questions</h2>${questionItems(qs)}</section>` : ""}
            ${terms.length ? `<section class="side-card"><h2>Glossary</h2><div class="chips">${terms.map((t) => SA.chip(`t:${t.id}`)).join("")}</div></section>` : ""}
          </aside>
        </div>
      </article>`;
  };

  // ---------- places ----------
  const TYPE_LABEL = { house: "House / estate", town: "Town or village", street: "Street", institution: "Institution", region: "County / region", country: "Country", battlefield: "Battlefield" };
  function mapInto(el, places, opts = {}) {
    if (!window.L) { el.innerHTML = `<div class="map-off">The map needs an internet connection. All places are listed below.</div>`; return null; }
    const map = L.map(el, { scrollWheelZoom: false, worldCopyJump: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
    const markers = {};
    for (const p of places) {
      if (!p.coords) continue;
      const m = L.circleMarker(p.coords, { radius: opts.single ? 9 : 7, className: `mk mk-${p.type}${p.approx ? " mk-approx" : ""}`, weight: 2 }).addTo(map);
      m.bindPopup(`<b><a href="#/place/${p.id}">${esc(p.name)}</a></b><br><small>${esc(p.region)}${p.approx ? " · approximate position" : ""}</small><br>${esc(SA.plain(p.summary)).slice(0, 160)}`);
      markers[p.id] = m;
    }
    return { map, markers };
  }
  V.places = function (main, params) {
    const regions = ["Ireland", "Britain", "Overseas"];
    const zone = (p) => /^(Co\.|Dublin|Ulster)/.test(p.region) ? "Ireland" : /England|Oxfordshire|Dorset/.test(p.region) ? "Britain" : "Overseas";
    main.innerHTML = `
      <header class="page-head"><p class="kicker">Directory</p><h1>Places</h1><p class="lede">${A.places.length} houses, towns, battlefields and countries mentioned in the recording or needed to explain it. Positions marked as approximate are best guesses.</p></header>
      <div class="map-wrap"><div class="map" id="places-map"></div>
        <div class="map-btns" role="group" aria-label="Map extent"><button data-z="ireland">Ireland</button><button data-z="europe">Ireland &amp; Britain</button><button data-z="world">World</button></div></div>
      <div class="filters">
        <input type="search" class="grow" placeholder="Filter places…" data-f="q" aria-label="Filter places" />
        <select data-f="zone" aria-label="Region"><option value="">Everywhere</option>${regions.map((r) => `<option>${r}</option>`).join("")}</select>
        <select data-f="type" aria-label="Type"><option value="">All types</option>${Object.entries(TYPE_LABEL).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select>
      </div>
      <div class="place-grid"></div>`;
    const m = mapInto(main.querySelector("#places-map"), A.places);
    const views = { ireland: [[51.3, -10.6], [55.4, -5.4]], europe: [[49.8, -10.6], [55.6, 1.8]], world: [[-30, -100], [66, 60]] };
    if (m) { m.map.fitBounds(views.ireland); main.querySelector(".map-btns").addEventListener("click", (e) => { const z = e.target.dataset.z; if (z) m.map.fitBounds(views[z]); }); }
    const grid = main.querySelector(".place-grid");
    const f = (k) => main.querySelector(`[data-f="${k}"]`);
    const draw = () => {
      const q = f("q").value.trim(), z = f("zone").value, t = f("type").value;
      let list = A.places.filter((p) => (!z || zone(p) === z) && (!t || p.type === t));
      if (q) { const hits = new Set(SA.search(q, 200).filter((d) => d.type === "place").map((d) => d.id)); list = list.filter((p) => hits.has(p.id)); }
      grid.innerHTML = list.map((p) => {
        const people = SA.peopleAt(p.id);
        return `<a class="place-card" href="#/place/${p.id}" data-id="${p.id}"><div class="pc-top"><span class="ptype t-${p.type}">${esc(TYPE_LABEL[p.type] || p.type)}</span><span class="reg">${esc(p.region)}</span></div>
          <h3>${esc(p.name)}</h3><p>${esc(SA.plain(p.summary))}</p>${people.length ? `<div class="small muted">${people.length} ${people.length === 1 ? "person" : "people"}</div>` : ""}</a>`;
      }).join("") || `<p class="empty">No places match.</p>`;
      if (m) for (const [id, mk] of Object.entries(m.markers)) mk.setStyle({ opacity: list.some((p) => p.id === id) ? 1 : 0.15, fillOpacity: list.some((p) => p.id === id) ? 0.85 : 0.1 });
    };
    main.querySelector(".filters").addEventListener("input", draw);
    grid.addEventListener("mouseover", (e) => { const c = e.target.closest(".place-card"); if (c && m && m.markers[c.dataset.id]) m.markers[c.dataset.id].openPopup(); });
    draw();
  };
  V.place = function (main, id) {
    const p = SA.places[id];
    if (!p) return V.notFound(main);
    const people = SA.peopleAt(id), events = SA.eventsFor("pl", id), qs = SA.questionsFor("pl", id), terms = SA.termsFor("pl", id);
    const near = p.coords ? A.places.filter((x) => x.id !== id && x.coords && Math.hypot(x.coords[0] - p.coords[0], x.coords[1] - p.coords[1]) < 0.35) : [];
    main.innerHTML = `
      <article class="profile">
        <header class="profile-head">
          <p class="kicker">${esc(TYPE_LABEL[p.type] || p.type)} · ${esc(p.region)}</p>
          <h1>${esc(p.name)}</h1>
          ${p.ident ? `<p>Identification: ${SA.badge(p.ident.status, p.ident.conf)}</p>` : ""}
          ${(p.aliases || []).length ? `<p class="aka"><span class="lbl">Also</span> ${p.aliases.map((a) => `<span class="alias">${esc(a)}</span>`).join(" ")}</p>` : ""}
          ${(p.variants || []).length ? `<p class="aka"><span class="lbl">Heard in the transcript as</span> ${p.variants.map((a) => `<span class="variant">“${esc(a)}”</span>`).join(" ")}</p>` : ""}
        </header>
        <div class="profile-grid">
          <div class="profile-main prose">
            <p class="lede">${SA.inline(p.summary)}</p>
            ${SA.paras(p.body)}
            ${p.facts ? `<section class="block"><h2>Facts and evidence</h2>${factTable(p.facts)}</section>` : ""}
            ${evidenceSection(`pl:${id}`, p.name)}
          </div>
          <aside class="profile-side">
            <section class="side-card"><div class="map small-map" id="place-map"></div>${p.approx ? `<p class="small muted">Marker position is approximate.</p>` : ""}</section>
            ${people.length ? `<section class="side-card"><h2>People</h2><div class="pchips">${people.map((x) => personChip(x.id)).join("")}</div></section>` : ""}
            ${events.length ? `<section class="side-card"><h2>Timeline</h2>${eventItems(events)}</section>` : ""}
            ${near.length ? `<section class="side-card"><h2>Nearby</h2><div class="chips">${near.map((x) => SA.chip(`pl:${x.id}`)).join("")}</div></section>` : ""}
            ${qs.length ? `<section class="side-card"><h2>Open questions</h2>${questionItems(qs)}</section>` : ""}
            ${terms.length ? `<section class="side-card"><h2>Glossary</h2><div class="chips">${terms.map((t) => SA.chip(`t:${t.id}`)).join("")}</div></section>` : ""}
          </aside>
        </div>
      </article>`;
    if (p.coords) {
      const m = mapInto(main.querySelector("#place-map"), [p, ...near], { single: true });
      if (m) m.map.setView(p.coords, p.type === "country" ? 5 : p.type === "region" ? 7 : 11);
    } else main.querySelector("#place-map").remove();
  };

  // ---------- timeline ----------
  const ERAS = [
    [0, 1782, "Georgian Ireland"], [1782, 1800, "Grattan's Parliament and rebellion"], [1801, 1844, "After the Union"],
    [1845, 1852, "The Great Famine"], [1853, 1878, "Mid-Victorian Ireland"], [1879, 1913, "Land War and Home Rule"],
    [1914, 1918, "The Great War"], [1919, 1923, "Revolution and Civil War"], [1924, 1959, "The new state"], [1960, 9999, "Recent times"],
  ];
  V.timeline = function (main, params) {
    const peopleWithEvents = [...new Set(A.events.flatMap((e) => e.people || []))].map((id) => SA.people[id]).sort((a, b) => a.name.localeCompare(b.name));
    main.innerHTML = `
      <header class="page-head"><p class="kicker">Chronology</p><h1>Timeline</h1><p class="lede">Family events (left) and the wider history that shaped them (right). Dates marked “c.” or with a range are approximate; the evidence label on each shows where it comes from.</p></header>
      <div class="filters">
        <div class="seg" role="group" aria-label="Kind"><button data-k="" aria-pressed="true">All</button><button data-k="family" aria-pressed="false">Family</button><button data-k="context" aria-pressed="false">Wider history</button></div>
        <select data-f="person" aria-label="Person"><option value="">Everyone</option>${peopleWithEvents.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select>
        <input type="search" class="grow" placeholder="Filter events…" data-f="q" aria-label="Filter events" />
      </div>
      <div class="timeline" aria-live="polite"></div>`;
    let kind = "";
    const tl = main.querySelector(".timeline");
    const f = (k) => main.querySelector(`[data-f="${k}"]`);
    if (params.p) f("person").value = params.p;
    const draw = () => {
      const pid = f("person").value, q = f("q").value.trim().toLowerCase();
      const list = A.events.filter((e) => (!kind || e.kind === kind) && (!pid || (e.people || []).includes(pid)) && (!q || (e.title + " " + SA.plain(e.desc)).toLowerCase().includes(q)))
        .sort((a, b) => a.year - b.year || (a.month || 0) - (b.month || 0) || (a.day || 0) - (b.day || 0));
      let html = "", era = null;
      for (const e of list) {
        const er = ERAS.find(([a, b]) => e.year >= a && e.year <= b);
        if (er !== era) { era = er; html += `<h2 class="era"><span>${esc(er[2])}</span></h2>`; }
        html += `<div class="tl-item k-${e.kind} ${e.sensitive ? "sensitive" : ""}" id="ev-${e.id}">
          <div class="tl-date">${esc(e.display)}</div>
          <div class="tl-card">
            <h3>${esc(e.title)}</h3>
            <div class="tl-meta">${SA.badge(e.status, e.conf)}${e.sensitive ? `<span class="badge st-sensitive">Handle with discretion</span>` : ""}</div>
            <p>${SA.inline(e.desc)}</p>
            ${(e.people || []).length || (e.places || []).length ? `<div class="chips">${(e.people || []).map((x) => SA.chip(`p:${x}`)).join("")}${(e.places || []).map((x) => SA.chip(`pl:${x}`)).join("")}</div>` : ""}
            ${(e.src || []).length ? `<div class="small">Sources: ${(e.src || []).map(SA.sourceLink).join(" ")}</div>` : ""}
          </div></div>`;
      }
      tl.innerHTML = html || `<p class="empty">No events match.</p>`;
    };
    main.querySelector(".seg").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      kind = b.dataset.k;
      main.querySelectorAll(".seg button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      draw();
    });
    main.querySelector(".filters").addEventListener("input", draw);
    draw();
    if (params.e) {
      const el = main.querySelector(`#ev-${CSS.escape(params.e)}`);
      if (el) { el.classList.add("target"); setTimeout(() => el.scrollIntoView({ block: "center" }), 30); }
    }
  };

  // ---------- glossary ----------
  V.glossary = function (main, params) {
    const cats = [...new Set(A.glossary.map((t) => t.category))].sort();
    main.innerHTML = `
      <header class="page-head"><p class="kicker">Reference</p><h1>Glossary</h1><p class="lede">Institutions, ranks, historical terms, family nicknames, surnames and turns of phrase that a future reader may not know, each linked to where it comes up.</p></header>
      <div class="filters">
        <input type="search" class="grow" placeholder="Filter terms…" data-f="q" aria-label="Filter terms" />
        <select data-f="cat" aria-label="Category"><option value="">All categories</option>${cats.map((c) => `<option>${esc(c)}</option>`).join("")}</select>
      </div>
      <nav class="az"></nav>
      <dl class="glossary"></dl>`;
    const f = (k) => main.querySelector(`[data-f="${k}"]`);
    const draw = () => {
      const q = f("q").value.trim(), c = f("cat").value;
      let list = A.glossary.filter((t) => !c || t.category === c);
      if (q) { const hits = new Set(SA.search(q, 200).filter((d) => d.type === "term").map((d) => d.id)); list = list.filter((t) => hits.has(t.id)); }
      list.sort((a, b) => a.term.replace(/^["“]/, "").localeCompare(b.term.replace(/^["“]/, "")));
      const letters = [...new Set(list.map((t) => t.term.replace(/^["“]/, "")[0].toUpperCase()))];
      main.querySelector(".az").innerHTML = letters.map((l) => `<a href="#" data-l="${l}">${l}</a>`).join("");
      let lastL = "";
      main.querySelector(".glossary").innerHTML = list.map((t) => {
        const L = t.term.replace(/^["“]/, "")[0].toUpperCase();
        const anchor = L !== lastL ? ` data-letter="${L}"` : ""; lastL = L;
        return `<div class="term" id="term-${t.id}"${anchor}><dt><a href="#/term/${t.id}">${esc(t.term)}</a> <span class="cat">${esc(t.category)}</span></dt><dd>${SA.inline(t.def)}</dd></div>`;
      }).join("") || `<p class="empty">No terms match.</p>`;
    };
    main.querySelector(".filters").addEventListener("input", draw);
    main.querySelector(".az").addEventListener("click", (e) => { const l = e.target.dataset.l; if (!l) return; e.preventDefault(); const el = main.querySelector(`[data-letter="${l}"]`); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); });
    draw();
  };
  V.term = function (main, id) {
    const t = SA.terms[id];
    if (!t) return V.notFound(main);
    main.innerHTML = `
      <article class="profile narrow">
        <header class="profile-head"><p class="kicker"><a href="#/glossary">Glossary</a> · ${esc(t.category)}</p><h1>${esc(t.term)}</h1>
          ${(t.aliases || []).length ? `<p class="aka"><span class="lbl">Also</span> ${t.aliases.map((a) => `<span class="alias">${esc(a)}</span>`).join(" ")}</p>` : ""}
          ${(t.variants || []).length ? `<p class="aka"><span class="lbl">Heard in the transcript as</span> ${t.variants.map((a) => `<span class="variant">“${esc(a)}”</span>`).join(" ")}</p>` : ""}</header>
        <div class="prose"><p class="lede">${SA.inline(t.def)}</p>
          ${(t.people || []).length ? `<h2>People</h2><div class="pchips">${t.people.map((x) => personChip(x)).join("")}</div>` : ""}
          ${(t.places || []).length ? `<h2>Places</h2><div class="chips">${t.places.map((x) => SA.chip(`pl:${x}`)).join("")}</div>` : ""}
          ${evidenceSection(`t:${id}`, t.term)}
        </div>
      </article>`;
  };

  // ---------- transcript ----------
  function markReadings(l, tid) {
    const rs = (SA.readingsByLine[`${tid}:${l.n}`] || []).map((r) => ({ r, i: l.text.indexOf(r.phrase) })).filter((x) => x.i >= 0).sort((a, b) => a.i - b.i);
    let out = "", pos = 0;
    for (const { r, i } of rs) {
      if (i < pos) continue;
      out += esc(l.text.slice(pos, i));
      const [k, ...rest] = (r.link || "").split(":");
      const href = r.link ? SA.entityHref(r.link) : "";
      out += `<mark class="reading conf-${r.conf}" tabindex="0" data-reading="${esc(r.reading)}" data-conf="${r.conf}"${r.note ? ` data-note="${esc(r.note)}"` : ""} ${href ? `data-href="${href}" data-target="${esc(SA.entityName(r.link) || rest.join(":"))}"` : ""}>${esc(r.phrase)}</mark>`;
      pos = i + r.phrase.length;
    }
    return out + esc(l.text.slice(pos));
  }
  SA.markReadings = markReadings;
  const paraText = (l, tid) => markReadings(l, tid);
  const parallelLinks = (key) => {
    const par = SA.parallel(key);
    if (!par.length) return "";
    const t = par[0].split(":")[0];
    return `<a class="par" href="#/compare?at=${key}" title="Compare with the same passage in transcript ${SA.TLABEL[t]}">≈ ${SA.TLABEL[t]}¶${par.map((k) => k.split(":")[1]).join(", ")}</a>`;
  };
  function transcriptTabs(cur) {
    return `<nav class="ttabs" aria-label="Transcripts">${A.transcripts.map((t) => `<a href="#/transcript/${t.id}" class="${cur === t.id ? "cur" : ""}"><b>${SA.TLABEL[t.id]}</b> ${esc(t.role === "original" ? "Original transcript" : "Companion transcript")}</a>`).join("")}${A.alignment ? `<a href="#/compare" class="${cur === "compare" ? "cur" : ""}"><b>A | B</b> Compare side by side</a>` : ""}</nav>`;
  }
  const filterBar = (extra = "") => `
        <div class="filters sticky">
          <input type="search" class="grow" placeholder="Search the transcript…" data-f="q" aria-label="Search the transcript" />
          <label class="tog"><input type="checkbox" data-f="readings" checked /> Readings of misheard words</label>
          <label class="tog" title="Untick to hide the everyday conversation and keep to the family history"><input type="checkbox" data-f="asides" checked /> Asides</label>
          ${extra}<span class="tcount small muted"></span>
        </div>`;
  V.transcript = function (main, target) {
    const [tidRaw, n] = (target || "").split(":");
    const t = SA.transcripts[tidRaw] || A.transcripts[0];
    main.innerHTML = `
      <div class="transcript-layout">
        <header class="page-head"><p class="kicker">Primary source · transcript ${SA.TLABEL[t.id]}</p><h1>${esc(t.title)}</h1>
          ${transcriptTabs(t.id)}
          <p class="lede">${esc(t.origin)}</p>
          <p class="small">Recorded ${esc(t.date)}. Source file: <code>${esc(t.sourceFile || "")}</code>. Paragraph numbers (¶) are line numbers of that file; citations in this archive point to them (transcript A as “¶n”, transcript B as “B¶n”). This is the complete transcript as received; the everyday conversation around the history is marked as asides. <a href="${esc(t.file)}" download>Download the full text (.txt)</a>.</p>
        </header>
        ${filterBar()}
        <div class="transcript"></div>
      </div>`;
    const box = main.querySelector(".transcript");
    box.innerHTML = t.lines.map((l) => {
      const key = `${t.id}:${l.n}`;
      const refs = SA.citedBy(key).filter((r) => !r.startsWith("ch:")).slice(0, 8);
      return `<div class="tp k-${l.kind}" id="p-${l.n}" data-n="${l.n}">
        <a class="pn" href="#/transcript/${key}" aria-label="Paragraph ${l.n}">${t.id === "T1" ? "" : SA.TLABEL[t.id]}¶${l.n}</a>
        <div class="tx">${paraText(l, t.id)}</div>
        <div class="refs">${parallelLinks(key)}${refs.map(SA.chip).join("")}</div>
      </div>`;
    }).join("");
    wireFilters(main, box, ".tp", ".tx");
    if (n) focusPara(main, box.querySelector(`#p-${+n}`));
  };
  function wireFilters(main, box, rowSel, textSel) {
    const f = (k) => main.querySelector(`[data-f="${k}"]`);
    const apply = () => {
      box.classList.toggle("no-readings", !f("readings").checked);
      box.classList.toggle("show-asides", f("asides").checked);
      const q = f("q").value.trim().toLowerCase();
      let c = 0;
      box.querySelectorAll(rowSel).forEach((el) => {
        const hit = !q || [...el.querySelectorAll(textSel)].some((x) => x.textContent.toLowerCase().includes(q));
        el.hidden = !hit; if (hit && q) c++;
      });
      main.querySelector(".tcount").textContent = q ? `${c} matching` : "";
    };
    main.querySelector(".filters").addEventListener("input", apply);
    apply();
  }
  function focusPara(main, el) {
    if (!el) return;
    if (el.classList.contains("k-aside")) { main.querySelector('[data-f="asides"]').checked = true; main.querySelector(".filters").dispatchEvent(new Event("input")); }
    el.classList.add("target");
    setTimeout(() => el.scrollIntoView({ block: "center" }), 30);
  }
  // Side-by-side comparison of transcripts A and B, row by aligned paragraph.
  V.compare = function (main, params) {
    const al = A.alignment;
    if (!al) return V.notFound(main);
    const [ta, tb] = al.pair;
    const at = params.at || "";
    const kindOf = (t, n) => (SA.lines[`${t}:${n}`] || {}).kind || "text";
    const shown = new Set();
    const rows = al.blocks.map((blk, i) => {
      const left = blk.a.map((n) => { const l = SA.lines[`${ta}:${n}`]; return l ? `<div class="cp" id="c-${ta}-${n}"><a class="pn" href="#/transcript/${ta}:${n}">¶${n}</a><div class="tx">${paraText(l, ta)}</div></div>` : ""; }).join("");
      const right = blk.b.map((n) => {
        const l = SA.lines[`${tb}:${n}`];
        if (!l) return "";
        if (shown.has(n)) return `<div class="cp cont" id="c-${tb}-${n}-${i}"><a class="pn" href="#/transcript/${tb}:${n}">${SA.TLABEL[tb]}¶${n}</a><div class="tx muted small">↑ continued</div></div>`;
        shown.add(n);
        return `<div class="cp" id="c-${tb}-${n}"><a class="pn" href="#/transcript/${tb}:${n}">${SA.TLABEL[tb]}¶${n}</a><div class="tx">${paraText(l, tb)}</div></div>`;
      }).join("");
      const kinds = [...blk.a.map((n) => kindOf(ta, n)), ...blk.b.map((n) => kindOf(tb, n))];
      const kind = kinds.every((k) => k !== "text") ? "aside" : "text";
      return `<div class="crow k-${kind}" data-a="${blk.a.join(" ")}" data-b="${blk.b.join(" ")}"><div class="ccol">${left}</div><div class="ccol">${right}</div></div>`;
    }).join("");
    main.innerHTML = `
      <div class="transcript-layout wide">
        <header class="page-head"><p class="kicker">Primary sources · comparison</p><h1>Compare the two transcripts</h1>
          ${transcriptTabs("compare")}
          <p class="lede">Both are automatic transcripts of the same recording. Each row pairs a paragraph of transcript A with the matching passage of transcript B, aligned word by word. Where they agree, that agreement is evidence about what was said. Where they differ, the archive keeps both readings, because no audio was available to settle them.</p>
        </header>
        ${filterBar()}
        <div class="compare"><div class="chead"><div>A · ${esc(SA.transcripts[ta].sourceFile || ta)}</div><div>B · ${esc(SA.transcripts[tb].sourceFile || tb)}</div></div>${rows}</div>
      </div>`;
    const box = main.querySelector(".compare");
    wireFilters(main, box, ".crow", ".tx");
    if (at) {
      const [t, n] = at.split(":");
      const row = [...box.querySelectorAll(".crow")].find((r) => (t === ta ? r.dataset.a : r.dataset.b).split(" ").includes(n));
      if (row) focusPara(main, row);
    }
  };

  // ---------- questions ----------
  V.questions = function (main, params) {
    const order = { high: 0, medium: 1, low: 2 };
    const list = A.questions.slice().sort((a, b) => order[a.priority] - order[b.priority]);
    main.innerHTML = `
      <header class="page-head"><p class="kicker">Research agenda</p><h1>Open questions</h1><p class="lede">Ambiguities, contradictions and gaps. Each records what was said, the possible readings, and where to look next. Please add answers as they are found.</p></header>
      <div class="filters"><div class="seg" role="group" aria-label="Status"><button data-s="" aria-pressed="true">All</button><button data-s="open" aria-pressed="false">Open</button><button data-s="partly resolved" aria-pressed="false">Partly resolved</button><button data-s="resolved" aria-pressed="false">Resolved</button></div></div>
      <div class="questions">${list.map((q) => `
        <article class="question pr-${q.priority}" id="q-${q.id}" data-status="${esc(q.status)}">
          <header><span class="qstatus qs-${q.status.replace(/\s/g, "-")}">${esc(q.status)}</span><span class="prio">${esc(q.priority)} priority</span></header>
          <h2>${esc(q.title)}</h2>
          ${SA.para(q.desc)}
          ${(q.alternatives || []).length ? `<h3>Possible readings</h3><ul>${q.alternatives.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
          ${q.next ? `<h3>Next steps</h3>${SA.para(q.next)}` : ""}
          <div class="chips">${(q.people || []).map((x) => SA.chip(`p:${x}`)).join("")}${(q.places || []).map((x) => SA.chip(`pl:${x}`)).join("")}</div>
          ${(q.cite || []).length ? `<div class="small">Passages: ${SA.citeList(q.cite)}</div>` : ""}
        </article>`).join("")}</div>`;
    main.querySelector(".seg").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      main.querySelectorAll(".seg button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      main.querySelectorAll(".question").forEach((el) => (el.hidden = b.dataset.s && el.dataset.status !== b.dataset.s));
    });
    if (params.q) { const el = main.querySelector(`#q-${CSS.escape(params.q)}`); if (el) { el.classList.add("target"); setTimeout(() => el.scrollIntoView({ block: "center" }), 30); } }
  };

  // ---------- sources ----------
  let sourceUse = null;
  function computeSourceUse() {
    const use = {};
    const scan = (obj, owner) => {
      const s = JSON.stringify(obj);
      for (const m of s.matchAll(/\{s:([a-z0-9-]+)\}/g)) (use[m[1]] = use[m[1]] || new Set()).add(owner);
      for (const m of s.matchAll(/"src":\[([^\]]*)\]/g)) for (const id of m[1].match(/[a-z0-9-]+/g) || []) (use[id] = use[id] || new Set()).add(owner);
    };
    A.people.forEach((p) => scan(p, `p:${p.id}`));
    A.places.forEach((p) => scan(p, `pl:${p.id}`));
    A.events.forEach((e) => scan(e, `e:${e.id}`));
    A.glossary.forEach((t) => scan(t, `t:${t.id}`));
    A.questions.forEach((q) => scan(q, `qn:${q.id}`));
    A.narrative.forEach((c) => scan(c, `ch:${c.id}`));
    return use;
  }
  const ACCESS_SHORT = { direct: "read directly", partial: "partly read", "search-only": "search result only" };
  const ACCESS = {
    direct: "The page itself was read and checked against the claims attributed to it.",
    partial: "Only part of the source could be read (e.g. text extracted from a scan); see the note.",
    "search-only": "Located through search results; the page blocks automated access, so the quoted details still need direct inspection.",
  };
  V.sources = function (main, params) {
    sourceUse = sourceUse || computeSourceUse();
    const t = A.transcripts[0];
    main.innerHTML = `
      <header class="page-head"><p class="kicker">Evidence</p><h1>Sources and method</h1></header>
      <div class="two-col block">
        <section class="prose">
          <h2>The primary sources</h2>
          <p>Two automatic transcripts of the same recorded conversation:</p>
          <ul>${A.transcripts.map((t) => `<li><a href="#/transcript/${t.id}"><b>${SA.TLABEL[t.id]}</b>: ${esc(t.title)}</a> (${t.lines.length} paragraphs; file <code>${esc(t.sourceFile || "")}</code>). ${esc(t.origin)}</li>`).join("")}</ul>
          <p>Transcript A was used to build the archive; B was added during an audit. The <a href="#/compare">side-by-side comparison</a> pairs their paragraphs. Citations to A read “¶n”, citations to B “B¶n”.</p>
          <h2>Method</h2>
          <p>Every person, place, event and term was extracted by reading the whole transcript, resolving the speech-to-text errors from context (for example “Bellinger Martha” as <i>Bellingham Arthur</i>, “Whitflow” as <i>Wicklow</i>, “badayos” as <i>Badajoz</i>). These readings are shown in the transcript itself and graded by confidence.</p>
          <p>References to the same person were merged only when the context made it clear (for instance, “Bunt”, “Bundt” and “Uncle buns” are William Arthur Tenison Bellingham Somerville). People who are mentioned but not named have placeholder entries rather than invented names.</p>
          <p>Where the two transcripts disagree, the more plausible reading is shown with a confidence label, and the alternative is kept in the reading note or an open question. No audio was available. Where they agree on a wording, that is treated as evidence of what was said, even when the wording is itself a slip (for example “my aunt Eddie's parents”).</p>
          <p>Where the narrator's account could be checked, we looked for published sources, preferring primary records (Hansard), then scholarly and heritage databases, then reference works. External facts are always shown separately from family testimony and numbered below. Where a primary record or well-supported published research contradicts the narrator, the archive's conclusion follows the documentary evidence, and his own account is still shown beside it (“Narrator's account”) with the source and the reasoning, so his testimony is never silently replaced. Where the evidence is not decisive, both versions are kept and the conflict is flagged.</p>
          <p>A few identifications were supplied by the family in 2026 rather than said in the recording (for example the names of the narrator's children); they carry the label “Family information”.</p>
          <p>Nothing has been added to fill gaps. Dates the narrator did not give are left blank or marked as estimates.</p>
        </section>
        <section><h2>Evidence labels</h2>${legend()}</section>
      </div>
      <section class="block"><h2>External sources <span class="count">${A.sources.length}</span></h2>
        <p class="small muted">Each source is labelled <span class="access access-direct">read directly</span>, <span class="access access-partial">partly read</span> or <span class="access access-search-only">search result only</span>. Compiled online genealogies are secondary: they can confirm that a claim exists somewhere else, but they are not proof of it, and some draw on the same family's own research.</p>
        <ol class="sources">${A.sources.map((s) => `
          <li id="src-${s.id}" value="${SA.sourceNo[s.id]}">
            <div class="st"><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a></div>
            <div class="small">${esc(s.publisher)}${s.year ? `, ${esc(s.year)}` : ""} · <span class="stype">${esc(s.type)}</span><span class="access access-${esc(s.access)}" title="${esc(ACCESS[s.access] || "")}">${esc(ACCESS_SHORT[s.access] || s.access)}</span>${s.checked ? ` <span class="muted">checked ${esc(s.checked)}</span>` : ""}</div>
            ${s.used ? `<div class="small"><b>Used for:</b> ${esc(s.used)}</div>` : ""}
            ${s.reliability ? `<div class="small muted">${esc(s.reliability)}</div>` : ""}
            ${sourceUse[s.id] ? `<div class="chips">${[...sourceUse[s.id]].slice(0, 12).map(SA.chip).join("")}</div>` : ""}
          </li>`).join("")}</ol></section>`;
    if (params.s) { const el = main.querySelector(`#src-${CSS.escape(params.s)}`); if (el) { el.classList.add("target"); setTimeout(() => el.scrollIntoView({ block: "center" }), 30); } }
  };

  // ---------- search ----------
  const TYPE_NAMES = { person: "People", place: "Places", term: "Glossary", event: "Timeline", chapter: "Story", question: "Open questions", source: "Sources", passage: "Transcript passages" };
  V.search = function (main, params) {
    const q = params.q || "";
    const res = SA.search(q, 200);
    const groups = {};
    for (const d of res) (groups[d.type] = groups[d.type] || []).push(d);
    main.innerHTML = `
      <header class="page-head"><p class="kicker">Search</p><h1>${q ? `Results for “${esc(q)}”` : "Search the archive"}</h1>
        <form class="search-big" role="search"><input type="search" name="q" value="${esc(q)}" placeholder="Name, place, word or phrase… misspellings welcome" aria-label="Search" /><button class="btn primary">Search</button></form>
        ${q ? `<p class="muted">${res.length} results. The search matches names, nicknames, the transcript's misspellings and near-misses.</p>` : ""}</header>
      ${Object.keys(TYPE_NAMES).filter((t) => groups[t]).map((t) => `
        <section class="block results"><h2>${TYPE_NAMES[t]} <span class="count">${groups[t].length}</span></h2>
          <ul>${groups[t].slice(0, t === "passage" ? 40 : 20).map((d) => `<li><a href="${d.href}"><b>${esc(d.title)}</b>${d.sub ? ` <span class="muted">${esc(d.sub)}</span>` : ""}</a><div class="snip">${SA.snippet(SA.docText(d), q)}</div></li>`).join("")}</ul></section>`).join("") || (q ? `<p class="empty">Nothing found. Try another spelling or a shorter word.</p>` : "")}`;
    main.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); location.hash = `#/search?q=${encodeURIComponent(e.target.q.value)}`; });
    if (!q) main.querySelector("input").focus();
  };

  // ---------- about ----------
  V.about = function (main) {
    main.innerHTML = `
      <article class="profile narrow prose">
        <header class="profile-head"><p class="kicker">About</p><h1>About this archive</h1></header>
        <p class="lede">This site preserves a recorded conversation in which Grandpa, William Somerville (born 1937), told his grandson Gergely what he knows about the Somerville family, organised so that people now and later can explore it, check it and add to it.</p>
        <h2>What is here</h2>
        <ul>
          <li><b>Story</b>: a narrative in eleven chapters, with testimony, interpretation and published history clearly distinguished.</li>
          <li><b>Tree</b>: the Somervilles and five related families, drawn from structured parent and partner links.</li>
          <li><b>People, Places, Glossary, Timeline</b>: directories that link to each other and to the transcript.</li>
          <li><b>Open questions</b>: everything uncertain or contradictory, with suggested next steps.</li>
          <li><b>Transcripts</b>: two independent speech-to-text transcripts of the same conversation (A, the original, and B, a companion), with readings of misheard words, links between parallel passages, and a side-by-side <a href="#/compare">comparison</a>.</li>
        </ul>
        <h2>Privacy and discretion</h2>
        <p>Both transcripts are published complete, exactly as received, and can be downloaded as text files from the transcript pages. Passages of everyday conversation are marked as asides, shown by default, and can be hidden to keep to the history. The narrator, William Somerville, and his immediate family are named, as confirmed by the family in 2026; profiles of living people record their place in the family rather than personal details. Grandpa said of the 1887 Youghal story, “This now is not for publication … use your own discretion, but be careful”; the family has decided to include it. His caution is shown, and the family's account, the parliamentary record and local history are kept separate.</p>
        <h2>Limitations</h2>
        <ul>
          <li>Both transcripts are automatic speech-to-text with no speaker labels, and no audio was available to settle their disagreements; some passages are garbled beyond recovery in both.</li>
          <li>Many dates rest on one person's memory. External checks cover the points listed under Sources; most family details are not yet verified against civil or church records.</li>
          <li>Map positions marked “approximate” are best guesses.</li>
          <li>Search and the tree run in your browser; the map needs an internet connection.</li>
        </ul>
        <h2>Maintaining the archive</h2>
        <p>All content lives in plain JSON files in the <code>data/</code> folder (people, places, events, glossary, sources, questions, readings, narrative), and transcripts in <code>transcripts/</code>. After editing, run <code>node scripts/build.mjs</code>, which checks every link and citation and regenerates the site's data file. See the README for details.</p>
      </article>`;
  };

  V.notFound = function (main) {
    main.innerHTML = `<div class="profile narrow"><h1>Not found</h1><p>That page does not exist. <a href="#/">Go home</a> or try the search.</p></div>`;
  };
})();
