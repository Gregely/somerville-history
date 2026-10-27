/* Core: indexes over the archive data, markup rendering, relationships, search.
   Everything hangs off the global SA namespace so the site works from file://
   without a bundler or module loader. */
(function () {
  "use strict";
  const A = window.ARCHIVE;
  const SA = (window.SA = window.SA || {});
  SA.data = A;

  // ---------- small helpers ----------
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  SA.esc = esc;
  SA.h = function (html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
  SA.people = byId(A.people);
  SA.places = byId(A.places);
  SA.events = byId(A.events);
  SA.terms = byId(A.glossary);
  SA.sources = byId(A.sources);
  SA.questions = byId(A.questions);
  SA.chapters = byId(A.narrative);
  SA.sourceNo = Object.fromEntries(A.sources.map((s, i) => [s.id, i + 1]));
  SA.lines = {};
  for (const t of A.transcripts) for (const l of t.lines) SA.lines[`${t.id}:${l.n}`] = l;
  SA.readingsByLine = {};
  for (const r of A.readings) { const k = `${r.t || "T1"}:${r.line}`; (SA.readingsByLine[k] = SA.readingsByLine[k] || []).push(r); }
  // Transcript labels: A = the original working transcript, B = the companion.
  SA.transcripts = Object.fromEntries(A.transcripts.map((t) => [t.id, t]));
  SA.TLABEL = Object.fromEntries(A.transcripts.map((t, i) => [t.id, String.fromCharCode(65 + i)]));
  // Parallel passages in the other transcript(s), from transcripts/alignment.json.
  SA.parallel = function (key) {
    const al = A.alignment;
    if (!al) return [];
    const [t, n] = key.split(":");
    const other = al.pair.find((x) => x !== t);
    return (((al.map || {})[t] || {})[n] || []).map((x) => `${other}:${x}`);
  };

  // ---------- vocabularies ----------
  SA.STATUS = {
    testimony: { label: "Testimony", long: "Said in the recording", icon: "❝" },
    inferred: { label: "Interpretation", long: "Our reading or inference", icon: "◇" },
    record: { label: "Published record", long: "From an external source", icon: "▤" },
    conflict: { label: "Conflict", long: "Sources disagree", icon: "⚑" },
    family: { label: "Family information", long: "Supplied by the family in 2026; not said in the recording", icon: "✎" },
  };
  SA.CONF = { high: "High confidence", medium: "Medium confidence", low: "Low confidence" };
  SA.badge = (status, conf) => {
    const s = SA.STATUS[status] || SA.STATUS.inferred;
    const c = conf ? `<span class="conf conf-${conf}" title="${SA.CONF[conf]}" aria-label="${SA.CONF[conf]}"><i></i><i></i><i></i></span>` : "";
    return `<span class="badge st-${status}" title="${s.long}">${s.icon} ${s.label}${c}</span>`;
  };
  SA.FAMILY = {
    somerville: "Somerville", bellingham: "Bellingham", clinch: "Clinch", johnson: "Johnson", truell: "Truell", other: "Other",
  };
  SA.CATEGORY = { family: "Family", "in-law": "Married in", associated: "Associated", historical: "Historical figure" };

  // ---------- people graph ----------
  const children = {};
  for (const p of A.people) for (const par of p.parents || []) (children[par] = children[par] || []).push(p.id);
  const ord = (id) => {
    const p = SA.people[id];
    return p.order != null ? p.order : 50;
  };
  for (const k in children) children[k].sort((a, b) => ord(a) - ord(b));
  SA.childrenOf = (id) => children[id] || [];
  SA.parentsOf = (id) => (SA.people[id] && SA.people[id].parents) || [];
  SA.spousesOf = (id) => ((SA.people[id] && SA.people[id].spouses) || []).filter((s) => SA.people[s.id]);
  SA.siblingsOf = (id) => {
    const ps = SA.parentsOf(id);
    const set = new Set();
    for (const par of ps) for (const c of SA.childrenOf(par)) if (c !== id) set.add(c);
    return [...set].sort((a, b) => ord(a) - ord(b));
  };
  SA.partnersOf = (id) => {
    const out = SA.spousesOf(id).map((s) => s.id);
    for (const c of SA.childrenOf(id)) for (const par of SA.parentsOf(c)) if (par !== id && !out.includes(par)) out.push(par);
    return out;
  };
  SA.lifespan = (p) => {
    const b = p.born && p.born.display, d = p.died && p.died.display;
    if (p.living) return b ? `b. ${b}` : "living";
    if (b && d) return `${b} – ${d}`;
    if (b) return `b. ${b}`;
    if (d) return `d. ${d}`;
    return "";
  };
  SA.shortLife = (p) => {
    // Compact dates for cards: "1856–1916", "c.1805–c.1895", "d. 1950", "1940s".
    const yr = (s) => {
      if (!s) return "";
      const m = String(s.display).match(/\d{4}s?/);
      if (m) return (/^(c\.|about)|estimate/i.test(s.display) ? "c." : "") + m[0];
      if (/infan/i.test(s.display)) return "in infancy";
      return /century/i.test(s.display) ? s.display : "";
    };
    const b = yr(p.born), d = yr(p.died);
    if (p.living) return b ? `b. ${b}` : "";
    if (b && d) return `${b}–${d}`;
    if (b) return /century/.test(b) ? b : `b. ${b}`;
    if (d) return `d. ${d}`;
    return "";
  };

  // Ancestors with distance.
  function ancestors(id) {
    const out = new Map([[id, 0]]);
    const q = [id];
    while (q.length) {
      const cur = q.shift();
      for (const par of SA.parentsOf(cur)) if (!out.has(par)) { out.set(par, out.get(cur) + 1); q.push(par); }
    }
    return out;
  }
  const ordinal = (n) => (n === 1 ? "" : n === 2 ? "second " : n === 3 ? "third " : n === 4 ? "fourth " : `${n}th `);
  const greats = (n) => (n <= 0 ? "" : n === 1 ? "great-" : n === 2 ? "great-great-" : `${n}× great-`);
  const times = (n) => (n === 1 ? "once" : n === 2 ? "twice" : `${n} times`);
  // Relationship of `id` to `ref` (e.g. "great-grandfather of the narrator").
  SA.relationship = function (id, ref, viaSpouse) {
    if (id === ref) return "the narrator himself";
    const p = SA.people[id];
    const male = p.sex === "m", female = p.sex === "f";
    const g = (m, f, n) => (male ? m : female ? f : n);
    const a1 = ancestors(id), a2 = ancestors(ref);
    let best = null;
    for (const [anc, d1] of a1) if (a2.has(anc)) {
      const d2 = a2.get(anc);
      if (!best || d1 + d2 < best.d1 + best.d2) best = { anc, d1, d2 };
    }
    if (!best) {
      // married in?
      if (viaSpouse) return null;
      for (const s of SA.spousesOf(id)) {
        const r = SA.relationship(s.id, ref, true);
        if (r) return `${g("husband", "wife", "spouse")} of ${SA.people[s.id].name} (${r === "the narrator himself" ? "the narrator" : r + " of the narrator"})`;
      }
      return null;
    }
    const { d1, d2 } = best;
    if (d1 === 0) {
      // id is an ancestor of ref
      if (d2 === 1) return g("father", "mother", "parent");
      if (d2 === 2) return g("grandfather", "grandmother", "grandparent");
      return greats(d2 - 2) + g("grandfather", "grandmother", "grandparent");
    }
    if (d2 === 0) {
      if (d1 === 1) return g("son", "daughter", "child");
      if (d1 === 2) return g("grandson", "granddaughter", "grandchild");
      return greats(d1 - 2) + g("grandson", "granddaughter", "grandchild");
    }
    if (d1 === 1 && d2 === 1) {
      const shared = SA.parentsOf(id).filter((x) => SA.parentsOf(ref).includes(x)).length;
      return (shared === 1 && SA.parentsOf(id).length === 2 && SA.parentsOf(ref).length === 2 ? "half-" : "") + g("brother", "sister", "sibling");
    }
    if (d2 === 1) return (d1 === 2 ? "" : greats(d1 - 2)) + g("nephew", "niece", "nephew/niece");
    if (d1 === 1) {
      if (d2 === 2) return g("uncle", "aunt", "uncle/aunt");
      return greats(d2 - 2) + g("uncle", "aunt", "uncle/aunt");
    }
    const cousin = Math.min(d1, d2) - 1, removed = Math.abs(d1 - d2);
    return `${ordinal(cousin)}cousin${removed ? ` ${times(removed)} removed` : ""}`.replace(/^\s+/, "").replace(/^cousin/, "first cousin");
  };
  SA.relLabel = function (id) {
    const r = SA.relationship(id, "narrator");
    if (!r) return null;
    const txt = /^(the narrator|husband|wife|spouse)/.test(r) ? r : `${r} of the narrator`;
    return txt[0].toUpperCase() + txt.slice(1);
  };
  // Chain of ancestors from the earliest ancestor down to `id`, following the
  // parent that has the longest recorded ancestry.
  SA.lineOfDescent = function (id) {
    const depth = (x) => { const ps = SA.parentsOf(x); return ps.length ? 1 + Math.max(...ps.map(depth)) : 0; };
    const chain = [id];
    let cur = id;
    for (;;) {
      const ps = SA.parentsOf(cur);
      if (!ps.length) break;
      const pick = ps.slice().sort((a, b) => {
        const fa = SA.people[a].family === SA.people[id].family ? 1 : 0, fb = SA.people[b].family === SA.people[id].family ? 1 : 0;
        return fb - fa || depth(b) - depth(a);
      })[0];
      chain.unshift(pick);
      cur = pick;
    }
    return chain;
  };

  // ---------- citations ----------
  // "142-150" / 16 / "T1:16" -> [{t:"T1", a:142, b:150}]
  SA.parseCite = function (s) {
    let str = String(s).replace(/\s+/g, ""), tid = "T1";
    const m = str.match(/^(T\d+):(.*)$/);
    if (m) { tid = m[1]; str = m[2]; }
    return str.split(",").map((part) => {
      const r = part.match(/^(\d+)(?:-(\d+))?$/);
      return r ? { t: tid, a: +r[1], b: r[2] ? +r[2] : +r[1] } : null;
    }).filter(Boolean);
  };
  // Transcript A citations read "¶148"; companion transcript B citations "B¶65".
  SA.citeLink = function (c) {
    const pre = c.t === "T1" ? "" : SA.TLABEL[c.t] || c.t;
    const label = c.a === c.b ? `${pre}¶${c.a}` : `${pre}¶${c.a}–${c.b}`;
    const name = c.t === "T1" ? "transcript A" : `companion transcript ${pre}`;
    return `<a class="cite-q${c.t === "T1" ? "" : " cite-b"}" href="#/transcript/${c.t}:${c.a}" data-t="${c.t}" data-a="${c.a}" data-b="${c.b}" title="${name}, paragraph ${label.replace(/^.*¶/, "")}">${label}</a>`;
  };
  // keys like "T1:16" collapsed into ranges of consecutive paragraphs, per transcript
  SA.keysToCites = function (keys) {
    const by = {};
    for (const k of new Set(keys)) { const [t, n] = k.split(":"); (by[t] = by[t] || []).push(+n); }
    const out = [];
    for (const t of Object.keys(by).sort()) {
      const nums = by[t].sort((a, b) => a - b);
      let cur = null;
      for (const n of nums) {
        // consecutive if no other paragraph lies between (blank lines don't count)
        let gapFree = cur != null;
        if (cur) for (let x = cur.b + 1; x < n; x++) if (SA.lines[`${t}:${x}`]) { gapFree = false; break; }
        if (gapFree) cur.b = n; else { cur = { t, a: n, b: n }; out.push(cur); }
      }
    }
    return out;
  };
  SA.citeList = (keys) => SA.keysToCites(keys || []).map(SA.citeLink).join(" ");
  SA.sourceLink = function (id) {
    const s = SA.sources[id];
    if (!s) return "";
    return `<a class="cite-s" href="#/sources?s=${id}" data-s="${id}" title="${esc(s.title)} (${esc(s.publisher)})">[${SA.sourceNo[id]}]</a>`;
  };

  // ---------- markup ----------
  const TOKEN = /\{(p|pl|t|e|s|qn|ch|q):([^}|]+)(?:\|([^}]*))?\}/g;
  SA.link = function (kind, id, text) {
    switch (kind) {
      case "p": { const p = SA.people[id]; return `<a class="ref ref-p" href="#/person/${id}">${esc(text || (p && p.name) || id)}</a>`; }
      case "pl": { const p = SA.places[id]; return `<a class="ref ref-pl" href="#/place/${id}">${esc(text || (p && p.name) || id)}</a>`; }
      case "t": { const t = SA.terms[id]; return `<a class="ref ref-t" href="#/term/${id}">${esc(text || (t && t.term) || id)}</a>`; }
      case "e": { const e = SA.events[id]; return `<a class="ref ref-e" href="#/timeline?e=${id}">${esc(text || (e && e.title) || id)}</a>`; }
      case "qn": { const q = SA.questions[id]; return `<a class="ref ref-qn" href="#/questions?q=${id}" title="Open question">${esc(text || (q ? "open question: " + q.title : id))}</a>`; }
      case "ch": { const c = SA.chapters[id]; return `<a class="ref ref-ch" href="#/story/${id}">${esc(text || (c && c.title) || id)}</a>`; }
      case "s": return SA.sourceLink(id);
      case "q": return SA.parseCite(id).map(SA.citeLink).join(" ");
    }
    return esc(text || id);
  };
  const LABELS = {
    ctx: ["ctx", "Wider history · published sources"],
    int: ["int", "Our interpretation"],
    sensitive: ["sensitive", "Handle with discretion"],
  };
  function inline(str) {
    let out = "", last = 0;
    for (const m of str.matchAll(TOKEN)) {
      out += esc(str.slice(last, m.index)) + SA.link(m[1], m[2], m[3]);
      last = m.index + m[0].length;
    }
    return out + esc(str.slice(last));
  }
  SA.inline = (s) => inline(String(s || "").replace(/\{(ctx|int|sensitive)\}/g, ""));
  // A paragraph may start with {ctx}/{int}/{sensitive} (styled block) and may
  // switch mode mid-way (rendered as an inline labelled span).
  SA.para = function (str, tag = "p") {
    str = String(str || "");
    const parts = str.split(/\{(ctx|int|sensitive)\}/);
    let html = "", blockKind = null;
    if (parts[0] === "" && parts.length > 2) { blockKind = parts[1]; parts.splice(0, 2); html = inline(parts.shift()); }
    else html = inline(parts.shift());
    for (let i = 0; i < parts.length; i += 2) {
      const [cls, label] = LABELS[parts[i]];
      html += ` <span class="inline-${cls}"><span class="inline-label">${label}</span> ${inline(parts[i + 1] || "")}</span>`;
    }
    if (blockKind) {
      const [cls, label] = LABELS[blockKind];
      return `<div class="callout callout-${cls}"><div class="callout-label">${label}</div><${tag}>${html}</${tag}></div>`;
    }
    return `<${tag}>${html}</${tag}>`;
  };
  SA.paras = (arr) => (arr || []).map((s) => SA.para(s)).join("");
  SA.plain = (s) => String(s || "").replace(TOKEN, (m, k, id, text) => {
    if (text) return text;
    if (k === "p" && SA.people[id]) return SA.people[id].name;
    if (k === "pl" && SA.places[id]) return SA.places[id].name;
    if (k === "t" && SA.terms[id]) return SA.terms[id].term;
    return "";
  }).replace(/\{(ctx|int|sensitive)\}/g, "").replace(/\s+/g, " ").trim();

  // ---------- reverse indexes ----------
  // Which entities cite / mention / relate to a given entity.
  SA.citedBy = (key) => (A.refs[key] || []);
  SA.refsOwnedBy = function (owner) {
    const keys = [];
    for (const k in A.refs) if (A.refs[k].includes(owner)) keys.push(k);
    return keys.sort((a, b) => a.split(":")[0].localeCompare(b.split(":")[0]) || +a.split(":")[1] - +b.split(":")[1]);
  };
  SA.mentionsOf = (owner) => (A.mentions[owner] || []);
  SA.eventsFor = (kind, id) => A.events.filter((e) => (kind === "p" ? e.people : e.places || []).includes(id) || (e.desc || "").includes(`{${kind}:${id}`));
  SA.questionsFor = (kind, id) => A.questions.filter((q) => (kind === "p" ? q.people || [] : kind === "pl" ? q.places || [] : []).includes(id) || (q.desc || "").includes(`{${kind}:${id}`));
  SA.termsFor = (kind, id) => A.glossary.filter((t) => (kind === "p" ? t.people || [] : t.places || []).includes(id));
  SA.peopleAt = (placeId) => A.people.filter((p) => (p.places || []).includes(placeId));
  SA.chaptersFor = (kind, id) => A.narrative.filter((c) => (kind === "p" && (c.people || []).includes(id)) || (c.body || []).some((b) => b.includes(`{${kind}:${id}`)));
  SA.entityName = function (ref) {
    const [k, ...rest] = ref.split(":"); const id = rest.join(":");
    if (k === "p") return SA.people[id] && SA.people[id].name;
    if (k === "pl") return SA.places[id] && SA.places[id].name;
    if (k === "t") return SA.terms[id] && SA.terms[id].term;
    if (k === "e") return SA.events[id] && SA.events[id].title;
    if (k === "qn") return SA.questions[id] && SA.questions[id].title;
    if (k === "ch") return SA.chapters[id] && SA.chapters[id].title;
    return id;
  };
  SA.entityHref = function (ref) {
    const [k, ...rest] = ref.split(":"); const id = rest.join(":");
    return { p: `#/person/${id}`, pl: `#/place/${id}`, t: `#/term/${id}`, e: `#/timeline?e=${id}`, qn: `#/questions?q=${id}`, ch: `#/story/${id}` }[k] || "#/";
  };
  SA.chip = (ref) => {
    const k = ref.split(":")[0];
    return `<a class="chip chip-${k}" href="${SA.entityHref(ref)}">${esc(SA.entityName(ref) || ref)}</a>`;
  };

  // ---------- search ----------
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, "'");
  const words = (s) => norm(s).split(/[^a-z0-9']+/).filter((w) => w.length > 1);
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const m = a.length, n = b.length;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  const docs = [];
  const add = (type, id, title, sub, keys, text, href) =>
    docs.push({ type, id, title, sub, href, text, nTitle: norm(title), nKeys: keys.map(norm), wKeys: new Set(words(title + " " + keys.join(" "))), nText: norm(text) });
  for (const p of A.people) add("person", p.id, p.name, [p.fullName !== p.name ? p.fullName : "", SA.lifespan(p)].filter(Boolean).join(" · "), [p.fullName, ...(p.aliases || []), ...(p.variants || [])], SA.plain(p.summary + " " + (p.bio || []).join(" ")), `#/person/${p.id}`);
  for (const p of A.places) add("place", p.id, p.name, p.region, [...(p.aliases || []), ...(p.variants || [])], SA.plain(p.summary + " " + (p.body || []).join(" ")), `#/place/${p.id}`);
  for (const t of A.glossary) add("term", t.id, t.term, t.category, [...(t.aliases || []), ...(t.variants || [])], SA.plain(t.def), `#/term/${t.id}`);
  for (const e of A.events) add("event", e.id, e.title, e.display, [], SA.plain(e.desc), `#/timeline?e=${e.id}`);
  for (const q of A.questions) add("question", q.id, q.title, q.status, [], SA.plain(q.desc + " " + (q.next || "")), `#/questions?q=${q.id}`);
  for (const c of A.narrative) add("chapter", c.id, c.title, c.era, [], SA.plain(c.lede + " " + c.body.join(" ")), `#/story/${c.id}`);
  for (const s of A.sources) add("source", s.id, s.title, s.publisher, [], s.used || "", `#/sources?s=${s.id}`);
  for (const t of A.transcripts) for (const l of t.lines) add("passage", `${t.id}:${l.n}`, `${SA.TLABEL[t.id]} ¶${l.n}`, "", [], l.text, `#/transcript/${t.id}:${l.n}`);

  SA.search = function (query, limit = 60) {
    const q = norm(query).trim();
    if (!q) return [];
    const qw = words(q);
    const res = [];
    for (const d of docs) {
      let score = 0;
      if (d.nTitle === q) score += 40;
      else if (d.nTitle.startsWith(q)) score += 25;
      else if (d.nTitle.includes(q)) score += 15;
      if (d.nKeys.some((k) => k === q)) score += 30;
      else if (d.nKeys.some((k) => k.includes(q))) score += 12;
      if (d.nText.includes(q)) score += d.type === "passage" ? 6 : 4;
      let allWords = true;
      for (const w of qw) {
        let ws = 0;
        if (d.wKeys.has(w)) ws = 6;
        else if ([...d.wKeys].some((k) => k.startsWith(w))) ws = 4;
        else if (w.length >= 5 && [...d.wKeys].some((k) => k.length >= 4 && lev(k, w) <= (w.length >= 8 ? 2 : 1))) ws = 3;
        else if (d.nText.includes(w)) ws = 1;
        if (!ws) allWords = false;
        score += ws;
      }
      if (!allWords && score < 12) continue;
      if (score > 0) res.push({ d, score: score + (d.type === "passage" ? -2 : 0) });
    }
    res.sort((a, b) => b.score - a.score);
    return res.slice(0, limit).map((r) => r.d);
  };
  SA.snippet = function (text, query, len = 160) {
    const t = String(text), nt = norm(t), q = words(query).sort((a, b) => b.length - a.length)[0] || "";
    let i = q ? nt.indexOf(q) : -1;
    if (i < 0) i = 0;
    const start = Math.max(0, i - len / 2), s = t.slice(start, start + len);
    let out = esc(s);
    for (const w of words(query)) if (w.length > 2) out = out.replace(new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"), "<mark>$1</mark>");
    return (start > 0 ? "…" : "") + out + (start + len < t.length ? "…" : "");
  };
  SA.docText = (d) => d.text;
})();
