#!/usr/bin/env node
// Validates the archive data and bundles it into assets/js/archive-data.js,
// which the site loads as a plain script (so it also works from file://).
//
//   node scripts/build.mjs            validate + write the public bundle
//   node scripts/build.mjs --check    validate only
//   node scripts/build.mjs --private  build a full, unredacted copy of the
//                                     site into private-build/ (git-ignored)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const PRIVATE = args.has("--private");
const CHECK_ONLY = args.has("--check");

const readJSON = (p) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
  } catch (e) {
    console.error(`✗ ${p}: ${e.message}`);
    process.exit(1);
  }
};

const data = {
  people: readJSON("data/people.json"),
  places: readJSON("data/places.json"),
  events: readJSON("data/events.json"),
  glossary: readJSON("data/glossary.json"),
  sources: readJSON("data/sources.json"),
  questions: readJSON("data/questions.json"),
  readings: readJSON("data/readings.json"),
  narrative: readJSON("data/narrative.json"),
};
const manifest = readJSON("transcripts/transcripts.json");
const alignment = fs.existsSync(path.join(root, "transcripts/alignment.json")) ? readJSON("transcripts/alignment.json") : null;
const QUOTE_REPORT = args.has("--quotes");

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// ---------- transcripts ----------
const transcripts = manifest.map((t) => {
  const file = PRIVATE && t.privateFile && fs.existsSync(path.join(root, t.privateFile)) ? t.privateFile : t.file;
  if (PRIVATE && file !== t.privateFile) warn(`${t.id}: private original not found, using public copy`);
  const raw = fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n").split("\n");
  const inAside = (n) => (t.asides || []).some(([a, b]) => n >= a && n <= b);
  const lines = [];
  raw.forEach((text, i) => {
    const n = i + 1;
    if (!text.trim()) return;
    const withheld = /^\[Passage withheld/.test(text);
    lines.push({ n, text, kind: withheld ? "withheld" : inAside(n) ? "aside" : "text" });
  });
  return { id: t.id, title: t.title, date: t.date, origin: t.origin, role: t.role, sourceFile: t.sourceFile, lines };
});
const lineIndex = new Map();
for (const t of transcripts) for (const l of t.lines) lineIndex.set(`${t.id}:${l.n}`, l);

// Normalise a citation (number, "142-150", "T1:16") into a list of "T1:n" keys.
function expandCite(c, ctx) {
  let s = String(c).trim();
  let tid = "T1";
  const m = s.match(/^(T\d+):(.*)$/);
  if (m) { tid = m[1]; s = m[2]; }
  const out = [];
  for (const part of s.split(/\s*,\s*/)) {
    const r = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!r) { err(`${ctx}: bad citation "${c}"`); continue; }
    const a = +r[1], b = r[2] ? +r[2] : a;
    if (b < a) { err(`${ctx}: reversed range "${c}"`); continue; }
    let found = 0;
    for (let n = a; n <= b; n++) {
      const key = `${tid}:${n}`;
      if (lineIndex.has(key)) { out.push(key); found++; }
    }
    if (!found) err(`${ctx}: citation ${tid}:${part} points at no transcript passage`);
  }
  return out;
}

// ---------- ids ----------
const ids = {};
for (const [kind, list, key] of [
  ["p", data.people, "id"], ["pl", data.places, "id"], ["e", data.events, "id"],
  ["t", data.glossary, "id"], ["s", data.sources, "id"], ["qn", data.questions, "id"],
  ["ch", data.narrative, "id"],
]) {
  ids[kind] = new Set();
  for (const item of list) {
    if (!item[key]) err(`${kind}: entry without id: ${JSON.stringify(item).slice(0, 80)}`);
    if (ids[kind].has(item[key])) err(`${kind}: duplicate id ${item[key]}`);
    ids[kind].add(item[key]);
  }
}
const has = (kind, id) => ids[kind] && ids[kind].has(id);

// ---------- markup ----------
// Collects {q:..} citations so every passage knows which entries cite it.
const backrefs = new Map(); // "T1:n" -> Set("p:id")
function addBackref(keys, owner) {
  for (const k of keys) {
    if (!backrefs.has(k)) backrefs.set(k, new Set());
    backrefs.get(k).add(owner);
  }
}
const TOKEN = /\{(p|pl|t|e|s|qn|ch|q):([^}|]+)(?:\|([^}]*))?\}/g;
function checkMarkup(str, ctx, owner) {
  if (typeof str !== "string") return;
  const stripped = str.replace(/^\{(ctx|int|sensitive)\}/, "");
  for (const m of stripped.matchAll(TOKEN)) {
    const [, kind, ref] = m;
    if (kind === "q") addBackref(expandCite(ref.replace(/\s+/g, ""), ctx), owner);
    else if (!has(kind, ref)) err(`${ctx}: unknown ${kind} reference "${ref}"`);
  }
  const leftovers = stripped.replace(TOKEN, "").match(/\{[a-z]+:[^}]*\}/g);
  if (leftovers) err(`${ctx}: unparsed markup ${leftovers.join(", ")}`);
}
function checkFacts(facts, ctx, owner) {
  for (const f of facts || []) {
    const fctx = `${ctx} fact "${f.label}"`;
    if (!["testimony", "inferred", "record", "conflict"].includes(f.status)) err(`${fctx}: bad status ${f.status}`);
    if (!["high", "medium", "low"].includes(f.conf)) err(`${fctx}: bad confidence ${f.conf}`);
    f.cite = (f.cite || []).flatMap((c) => expandCite(c, fctx));
    addBackref(f.cite, owner);
    for (const s of f.src || []) if (!has("s", s)) err(`${fctx}: unknown source ${s}`);
    if (!f.cite.length && !(f.src || []).length && f.status !== "inferred") warn(`${fctx}: no supporting passage or source`);
  }
}
const normCites = (arr, ctx, owner) => {
  const out = (arr || []).flatMap((c) => expandCite(c, ctx));
  if (owner) addBackref(out, owner);
  return out;
};

// ---------- people ----------
for (const p of data.people) {
  const ctx = `person ${p.id}`, owner = `p:${p.id}`;
  for (const par of p.parents || []) if (!has("p", par)) err(`${ctx}: unknown parent ${par}`);
  for (const sp of p.spouses || []) {
    if (!has("p", sp.id)) err(`${ctx}: unknown spouse ${sp.id}`);
    sp.cite = normCites(sp.cite, `${ctx} spouse`, owner);
    for (const s of sp.src || []) if (!has("s", s)) err(`${ctx}: unknown source ${s}`);
  }
  for (const k of ["born", "died"]) if (p[k]) {
    p[k].cite = normCites(p[k].cite, `${ctx} ${k}`, owner);
    for (const s of p[k].src || []) if (!has("s", s)) err(`${ctx} ${k}: unknown source ${s}`);
  }
  for (const pl of p.places || []) if (!has("pl", pl)) err(`${ctx}: unknown place ${pl}`);
  checkMarkup(p.summary, `${ctx} summary`, owner);
  (p.bio || []).forEach((b, i) => checkMarkup(b, `${ctx} bio[${i}]`, owner));
  checkFacts(p.facts, ctx, owner);
}
// make spouse links symmetric
const byId = Object.fromEntries(data.people.map((p) => [p.id, p]));
for (const p of data.people) for (const sp of p.spouses || []) {
  const other = byId[sp.id];
  if (!other) continue;
  other.spouses = other.spouses || [];
  if (!other.spouses.some((x) => x.id === p.id)) other.spouses.push({ ...sp, id: p.id, mirrored: true });
}
// parent cycles
for (const p of data.people) {
  const seen = new Set();
  const walk = (id) => {
    if (id === p.id && seen.size) { err(`person ${p.id}: is their own ancestor`); return; }
    if (seen.has(id)) return;
    seen.add(id);
    for (const par of (byId[id] && byId[id].parents) || []) walk(par);
  };
  for (const par of p.parents || []) walk(par);
}

// ---------- places ----------
for (const pl of data.places) {
  const ctx = `place ${pl.id}`, owner = `pl:${pl.id}`;
  if (!Array.isArray(pl.coords) || pl.coords.length !== 2) warn(`${ctx}: no coordinates`);
  checkMarkup(pl.summary, `${ctx} summary`, owner);
  (pl.body || []).forEach((b, i) => checkMarkup(b, `${ctx} body[${i}]`, owner));
  checkFacts(pl.facts, ctx, owner);
}
// ---------- events ----------
for (const e of data.events) {
  const ctx = `event ${e.id}`, owner = `e:${e.id}`;
  if (typeof e.year !== "number") err(`${ctx}: missing numeric year`);
  for (const id of e.people || []) if (!has("p", id)) err(`${ctx}: unknown person ${id}`);
  for (const id of e.places || []) if (!has("pl", id)) err(`${ctx}: unknown place ${id}`);
  for (const s of e.src || []) if (!has("s", s)) err(`${ctx}: unknown source ${s}`);
  e.cite = normCites(e.cite, ctx, owner);
  checkMarkup(e.desc, `${ctx} desc`, owner);
}
// ---------- glossary ----------
for (const t of data.glossary) {
  const ctx = `term ${t.id}`, owner = `t:${t.id}`;
  for (const id of t.people || []) if (!has("p", id)) err(`${ctx}: unknown person ${id}`);
  for (const id of t.places || []) if (!has("pl", id)) err(`${ctx}: unknown place ${id}`);
  checkMarkup(t.def, `${ctx} def`, owner);
}
// ---------- questions ----------
for (const q of data.questions) {
  const ctx = `question ${q.id}`, owner = `qn:${q.id}`;
  for (const id of q.people || []) if (!has("p", id)) err(`${ctx}: unknown person ${id}`);
  for (const id of q.places || []) if (!has("pl", id)) err(`${ctx}: unknown place ${id}`);
  for (const s of q.src || []) if (!has("s", s)) err(`${ctx}: unknown source ${s}`);
  q.cite = normCites(q.cite, ctx, owner);
  checkMarkup(q.desc, `${ctx} desc`, owner);
  checkMarkup(q.next, `${ctx} next`, owner);
}
// ---------- narrative ----------
for (const ch of data.narrative) {
  const ctx = `chapter ${ch.id}`, owner = `ch:${ch.id}`;
  (ch.body || []).forEach((b, i) => checkMarkup(b, `${ctx} body[${i}]`, owner));
  for (const id of ch.people || []) if (!has("p", id)) err(`${ctx}: unknown person ${id}`);
}
// ---------- alignment ----------
if (alignment) {
  const [ta, tb] = alignment.pair;
  for (const [from, to] of [[ta, tb], [tb, ta]])
    for (const [n, targets] of Object.entries(alignment.map[from] || {})) {
      const known = (t, x) => lineIndex.has(`${t}:${x}`);
      if (!known(from, n)) err(`alignment: ${from}:${n} is not a passage`);
      for (const x of targets) if (!known(to, x)) err(`alignment: ${to}:${x} is not a passage`);
    }
}
// ---------- readings ----------
for (const r of data.readings) {
  r.t = r.t || "T1";
  const key = `${r.t}:${r.line}`;
  const l = lineIndex.get(key);
  const ctx = `reading ${key} "${r.phrase}"`;
  if (!l) { err(`${ctx}: no such passage`); continue; }
  if (l.kind === "withheld") { warn(`${ctx}: passage is withheld in this build`); continue; }
  if (!l.text.includes(r.phrase)) err(`${ctx}: phrase not found in passage`);
  if (r.link) {
    const [kind, ...rest] = r.link.split(":");
    if (!has(kind, rest.join(":"))) err(`${ctx}: unknown link ${r.link}`);
    else addBackref([key], r.link);
  }
}
// Automatic mentions: passages containing one of an entry's transcript
// spellings (variants). Kept separate from explicit citations.
const mentions = {};
const variantList = [
  ...data.people.map((p) => [`p:${p.id}`, p.variants || []]),
  ...data.places.map((pl) => [`pl:${pl.id}`, pl.variants || []]),
  ...data.glossary.map((t) => [`t:${t.id}`, t.variants || []]),
];
for (const [owner, variants] of variantList) {
  const vs = variants.filter((v) => v.length >= 6).map((v) => v.toLowerCase());
  if (!vs.length) continue;
  for (const [key, l] of lineIndex) {
    if (l.kind !== "text") continue;
    const low = l.text.toLowerCase();
    if (vs.some((v) => low.includes(v))) (mentions[owner] = mentions[owner] || []).push(key);
  }
}

// ---------- quotation check ----------
// A quoted phrase followed by a {q:..} citation should share most of its
// content words with the cited passages or their parallels in the other
// transcript. The quotations are lightly cleaned up from the speech-to-text,
// so this is a warning-level check (run with --quotes for the full report).
const STOP = new Set("the a an and of to in was he she it his her that i is for on at with as by be had have this from or but so they were there which who you we my me not are been".split(" "));
const toks = (x) => (x.toLowerCase().match(/[a-z]+/g) || []).filter((w) => w.length > 2 && !STOP.has(w));
const parallels = (key) => {
  if (!alignment) return [];
  const [t, n] = key.split(":");
  return ((alignment.map[t] || {})[n] || []).map((x) => `${alignment.pair.find((p) => p !== t)}:${x}`);
};
const quoteIssues = [];
function checkQuotes(str, ctx) {
  if (typeof str !== "string") return;
  // Runs of adjacent {q:..} tokens are checked together; quotations are
  // attributed to the run that follows them, after the last {s:..} or {q:..}.
  const tokens = [...str.matchAll(/\{(q|s):([^}]+)\}/g)];
  let prevEnd = 0;
  for (let i = 0; i < tokens.length; i++) {
    const m = tokens[i];
    if (m[1] === "s") { prevEnd = m.index + m[0].length; continue; }
    const group = [m];
    while (i + 1 < tokens.length && tokens[i + 1][1] === "q" && /^\s*$/.test(str.slice(group[group.length - 1].index + group[group.length - 1][0].length, tokens[i + 1].index))) group.push(tokens[++i]);
    const seg = str.slice(prevEnd, m.index);
    const last = group[group.length - 1];
    prevEnd = last.index + last[0].length;
    const quotes = [...seg.matchAll(/"([^"\s,;.)][^"]{10,}[^"\s])"/g)].map((x) => x[1]);
    if (!quotes.length) continue;
    const keys = group.flatMap((g) => expandCite(g[2].replace(/\s+/g, ""), ctx));
    if (keys.some((k) => lineIndex.get(k) && lineIndex.get(k).kind === "withheld")) continue;
    const pool = new Set(keys.flatMap((k) => [k, ...parallels(k)]).flatMap((k) => (lineIndex.get(k) ? toks(lineIndex.get(k).text) : [])));
    for (const q of quotes) {
      const qt = toks(q.replace(/\[[^\]]*\]/g, ""));
      if (qt.length < 3) continue;
      const hit = qt.filter((w) => pool.has(w)).length / qt.length;
      if (hit < 0.5) quoteIssues.push(`${ctx}: "${q.slice(0, 70)}" vs ${group.map((g) => g[0]).join(" ")} (${Math.round(hit * 100)}% word overlap)`);
    }
  }
}
const scan = (obj, ctx) => {
  if (typeof obj === "string") return checkQuotes(obj, ctx);
  if (Array.isArray(obj)) return obj.forEach((x, i) => scan(x, ctx));
  if (obj && typeof obj === "object") for (const [k, v] of Object.entries(obj)) if (!["cite", "src", "id", "url"].includes(k)) scan(v, ctx);
};
for (const [kind, list] of Object.entries({ people: data.people, places: data.places, events: data.events, glossary: data.glossary, questions: data.questions, narrative: data.narrative }))
  for (const item of list) scan(item, `${kind}/${item.id}`);
if (QUOTE_REPORT) for (const q of quoteIssues) console.warn(`⚠ quote ${q}`);
else if (quoteIssues.length) warn(`${quoteIssues.length} quotation(s) with weak overlap with their cited passages (run with --quotes to list)`);

// ---------- sources ----------
for (const s of data.sources) {
  if (!/^https?:\/\//.test(s.url || "")) err(`source ${s.id}: missing or bad url`);
  if (!["direct", "search-only", "partial"].includes(s.access)) err(`source ${s.id}: access must be direct | partial | search-only`);
}

// ---------- report ----------
for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  console.error(`\n${errors.length} error(s). Bundle not written.`);
  process.exit(1);
}

const refs = {};
for (const [k, set] of backrefs) refs[k] = [...set].sort();
const counts = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.length]));
console.log(`✓ Data valid: ${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(", ")}; ${transcripts.reduce((a, t) => a + t.lines.length, 0)} transcript passages; ${backrefs.size} cited passages.`);
if (CHECK_ONLY) process.exit(0);

const bundle = { ...data, transcripts, alignment, refs, mentions, private: PRIVATE };
const js = `/* Generated by scripts/build.mjs from data/*.json and transcripts/. Do not edit by hand. */\nwindow.ARCHIVE = ${JSON.stringify(bundle)};\n`;

if (PRIVATE) {
  const out = path.join(root, "private-build");
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  fs.copyFileSync(path.join(root, "index.html"), path.join(out, "index.html"));
  fs.cpSync(path.join(root, "assets"), path.join(out, "assets"), { recursive: true });
  fs.writeFileSync(path.join(out, "assets/js/archive-data.js"), js);
  console.log(`✓ Private (unredacted) build written to private-build/. Do not publish it.`);
} else {
  fs.writeFileSync(path.join(root, "assets/js/archive-data.js"), js);
  console.log(`✓ Wrote assets/js/archive-data.js (${(js.length / 1024).toFixed(0)} KB)`);
}
