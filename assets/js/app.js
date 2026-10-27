/* App shell: hash router, header search, citation popovers, theme. */
(function () {
  "use strict";
  const SA = window.SA, esc = SA.esc, V = SA.views;
  const main = document.getElementById("main");

  const ROUTES = [
    [/^\/?$/, () => V.home(main), "Home"],
    [/^\/story\/?$/, () => V.story(main), "Story", "story"],
    [/^\/story\/([^/]+)$/, (m) => V.story(main, m[1]), (m) => SA.chapters[m[1]] && SA.chapters[m[1]].title, "story"],
    [/^\/tree\/?([^/]*)$/, (m, p) => V.tree(main, m[1], p), "Family tree", "tree"],
    [/^\/people\/?$/, (m, p) => V.people(main, p), "People", "people"],
    [/^\/person\/([^/]+)$/, (m) => V.person(main, m[1]), (m) => SA.people[m[1]] && SA.people[m[1]].name, "people"],
    [/^\/places\/?$/, (m, p) => V.places(main, p), "Places", "places"],
    [/^\/place\/([^/]+)$/, (m) => V.place(main, m[1]), (m) => SA.places[m[1]] && SA.places[m[1]].name, "places"],
    [/^\/timeline\/?$/, (m, p) => V.timeline(main, p), "Timeline", "timeline"],
    [/^\/glossary\/?$/, (m, p) => V.glossary(main, p), "Glossary", "glossary"],
    [/^\/term\/([^/]+)$/, (m) => V.term(main, m[1]), (m) => SA.terms[m[1]] && SA.terms[m[1]].term, "glossary"],
    [/^\/transcript\/?([^/]*)$/, (m) => V.transcript(main, m[1]), "Transcript", "transcript"],
    [/^\/compare\/?$/, (m, p) => V.compare(main, p), "Compare transcripts", "transcript"],
    [/^\/questions\/?$/, (m, p) => V.questions(main, p), "Open questions", "questions"],
    [/^\/sources\/?$/, (m, p) => V.sources(main, p), "Sources", "sources"],
    [/^\/search\/?$/, (m, p) => V.search(main, p), "Search"],
    [/^\/about\/?$/, () => V.about(main), "About", "about"],
  ];

  function parse() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, "")) || "/";
    const [path, qs] = raw.split("?");
    const params = Object.fromEntries(new URLSearchParams(qs || ""));
    return { path, params };
  }
  // People whose ids changed when they were identified; old links still work.
  const MOVED = { "unidentified-son": "tenison-somerville-1812", "elder-brother-ric": "william-dennistoun-somerville", "mrs-truell": "vere-somerville", "died-young-1": "dorothy-somerville", "jim-wife": "margaret-lucy-starkey" };
  function route() {
    const { path, params } = parse();
    const moved = path.match(/^\/(person)\/([^/]+)$/);
    if (moved && MOVED[moved[2]]) { location.replace(`#/${moved[1]}/${MOVED[moved[2]]}`); return; }
    hidePop();
    main.className = "";
    for (const [re, fn, title, nav] of ROUTES) {
      const m = path.match(re);
      if (!m) continue;
      try { fn(m, params); } catch (e) { console.error(e); main.innerHTML = `<div class="profile narrow"><h1>Something went wrong</h1><pre>${esc(e.stack || e)}</pre></div>`; }
      const t = typeof title === "function" ? title(m) : title;
      document.title = (t && t !== "Home" ? `${t} · ` : "") + "Somerville Family Archive";
      document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("cur", a.dataset.nav === nav));
      document.body.classList.remove("nav-open");
      if (!params.e && !params.q && !params.s && !params.at && !/^\/transcript\/.+:/.test(path) && !/^\/tree/.test(path)) window.scrollTo(0, 0);
      main.focus({ preventScroll: true });
      return;
    }
    V.notFound(main);
  }
  window.addEventListener("hashchange", route);

  // ---------- header search ----------
  const input = document.getElementById("q");
  const drop = document.getElementById("q-results");
  let sel = -1, items = [];
  const TYPE = { person: "Person", place: "Place", term: "Term", event: "Event", chapter: "Story", question: "Question", source: "Source", passage: "Transcript" };
  const excerpt = (l) => esc(l.text.length > 360 ? l.text.slice(0, 360) + "…" : l.text);
  function showDrop() {
    const q = input.value.trim();
    if (!q) { drop.hidden = true; return; }
    const res = SA.search(q, 40);
    const nonPassage = res.filter((d) => d.type !== "passage").slice(0, 7);
    const passages = res.filter((d) => d.type === "passage").slice(0, 3);
    items = [...nonPassage, ...passages];
    drop.innerHTML = items.map((d, i) => `<a role="option" id="qr-${i}" href="${d.href}" class="${i === sel ? "act" : ""}"><span class="ty ty-${d.type}">${TYPE[d.type]}</span><span class="tt">${d.type === "passage" ? SA.snippet(SA.docText(d), q, 90) : esc(d.title)}</span>${d.sub && d.type !== "passage" ? `<span class="sb">${esc(d.sub)}</span>` : ""}</a>`).join("")
      + `<a class="all" href="#/search?q=${encodeURIComponent(q)}">All results for “${esc(q)}” →</a>`;
    drop.hidden = false;
  }
  input.addEventListener("input", () => { sel = -1; showDrop(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { sel = Math.min(items.length - 1, sel + 1); showDrop(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { sel = Math.max(-1, sel - 1); showDrop(); e.preventDefault(); }
    else if (e.key === "Enter") {
      e.preventDefault();
      location.hash = sel >= 0 && items[sel] ? items[sel].href : `#/search?q=${encodeURIComponent(input.value.trim())}`;
      drop.hidden = true; input.blur();
    } else if (e.key === "Escape") { drop.hidden = true; input.blur(); }
  });
  input.addEventListener("focus", showDrop);
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search")) drop.hidden = true;
    if (e.target.closest("#q-results a")) { drop.hidden = true; input.value = ""; }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });

  // ---------- popovers for citations and readings ----------
  const pop = document.getElementById("pop");
  let popFor = null, hideTimer = null;
  function hidePop() { pop.hidden = true; popFor = null; }
  function place(el) {
    const r = el.getBoundingClientRect();
    pop.hidden = false;
    pop.style.maxHeight = "";
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    const x = Math.min(window.innerWidth - pw - 12, Math.max(12, r.left + r.width / 2 - pw / 2));
    // never cover the link itself: use the side with more room and scroll within it
    const below = window.innerHeight - r.bottom - 16, above = r.top - 16;
    const down = ph <= below || below >= above;
    const room = Math.max(120, down ? below : above);
    if (ph > room) pop.style.maxHeight = `${room}px`;
    const y = down ? r.bottom + 8 : r.top - Math.min(ph, room) - 8;
    pop.style.left = `${x}px`; pop.style.top = `${y}px`;
  }
  function showPop(el) {
    clearTimeout(hideTimer);
    if (popFor === el) return;
    popFor = el;
    if (el.matches(".cite-q")) {
      const t = el.dataset.t, a = +el.dataset.a, b = +el.dataset.b;
      const ls = [];
      for (let n = a; n <= b; n++) { const l = SA.lines[`${t}:${n}`]; if (l) ls.push(l); }
      const shown = ls.slice(0, 2);
      const par = [...new Set(shown.flatMap((l) => SA.parallel(`${t}:${l.n}`)))].slice(0, 2);
      const pt = par.length ? par[0].split(":")[0] : null;
      pop.innerHTML = `<div class="pop-h">Transcript ${SA.TLABEL[t]} ¶${a}${b !== a ? "–" + b : ""}</div>${shown.map((l) => `<p>${excerpt(l)}</p>`).join("")}${ls.length > 2 ? `<p class="muted">…and ${ls.length - 2} more paragraphs</p>` : ""}`
        + (par.length ? `<div class="pop-h pop-h2">Same passage in transcript ${SA.TLABEL[pt]} (¶${par.map((k) => k.split(":")[1]).join(", ")})</div>${par.map((k) => `<p class="pop-par">${excerpt(SA.lines[k])}</p>`).join("")}` : "")
        + `<div class="pop-f">Click to open in the transcript · <a href="#/compare?at=${t}:${a}">compare A | B</a></div>`;
    } else if (el.matches(".cite-s")) {
      const s = SA.sources[el.dataset.s];
      pop.innerHTML = `<div class="pop-h">Source [${SA.sourceNo[s.id]}]</div><p><b>${esc(s.title)}</b><br>${esc(s.publisher)}</p>${s.used ? `<p class="small">${esc(s.used)}</p>` : ""}<div class="pop-f">Click for the source list · <a href="${esc(s.url)}" target="_blank" rel="noopener">open the source ↗</a></div>`;
    } else if (el.matches("mark.reading")) {
      pop.innerHTML = `<div class="pop-h">Reading · ${esc(SA.CONF[el.dataset.conf])}</div><p>Heard as “${esc(el.textContent)}”; probably <b>${esc(el.dataset.reading)}</b>.</p>${el.dataset.note ? `<p class="small">${esc(el.dataset.note)}</p>` : ""}${el.dataset.href ? `<div class="pop-f"><a href="${el.dataset.href}">${esc(el.dataset.target)} →</a></div>` : ""}`;
    }
    place(el);
  }
  const SEL = ".cite-q, .cite-s, mark.reading";
  document.addEventListener("mouseover", (e) => { const el = e.target.closest(SEL); if (el) showPop(el); else if (!e.target.closest("#pop")) { clearTimeout(hideTimer); hideTimer = setTimeout(hidePop, 220); } });
  document.addEventListener("focusin", (e) => { const el = e.target.closest(SEL); if (el) showPop(el); });
  document.addEventListener("click", (e) => {
    const m = e.target.closest("mark.reading");
    if (m) { showPop(m); e.stopPropagation(); return; }
    if (!e.target.closest("#pop") && !e.target.closest(SEL)) hidePop();
  });
  window.addEventListener("scroll", () => { if (!pop.hidden) hidePop(); }, { passive: true });

  // ---------- theme & mobile nav ----------
  const root = document.documentElement;
  const saved = (() => { try { return localStorage.getItem("theme"); } catch (e) { return null; } })();
  if (saved) root.dataset.theme = saved;
  document.getElementById("theme").addEventListener("click", () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) { /* storage unavailable */ }
  });
  document.getElementById("menu").addEventListener("click", () => document.body.classList.toggle("nav-open"));

  route();
})();
