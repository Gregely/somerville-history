// Privacy check for the public copy of the archive.
//
//   node scripts/privacy-check.mjs
//
// 1. transcripts/redactions.json may hold only line numbers, offsets, lengths
//    and generic reason labels: never any wording.
// 2. No committed file may contain a phone number.
// 3. When the private originals are present (transcripts/private/, which is
//    git-ignored), every run of six consecutive words from a withheld passage
//    is searched for in every public file: the bundle, data, README, public
//    transcripts, scripts and assets. A phrase that also occurs in the public
//    text of the transcripts is not counted, since it was never withheld.
// 4. The committed bundle must be the public build, not the private one.
//
// Without the private originals (for example in CI) step 3 is skipped and
// says so.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = (p) => path.join(root, p);
const problems = [];
const fail = (m) => problems.push(m);

// ---------- 1. redactions.json carries no text ----------
const REASONS = new Set(["personal or domestic aside", "third-party private matter"]);
const red = JSON.parse(fs.readFileSync(rel("transcripts/redactions.json"), "utf8"));
for (const [tid, cfg] of Object.entries(red)) {
  const extra = Object.keys(cfg).filter((k) => !["original", "public", "whole", "partial"].includes(k));
  if (extra.length) fail(`redactions.json ${tid}: unexpected keys ${extra.join(", ")}`);
  for (const [n, w] of Object.entries(cfg.whole)) {
    if (!REASONS.has(w.reason)) fail(`redactions.json ${tid}:${n}: reason is not a generic label`);
    if (Object.keys(w).some((k) => !["reason", "length"].includes(k))) fail(`redactions.json ${tid}:${n}: unexpected field`);
  }
  for (const [n, p] of Object.entries(cfg.partial)) {
    if (Object.keys(p).some((k) => !["length", "spans"].includes(k))) fail(`redactions.json ${tid}:${n}: unexpected field`);
    for (const s of p.spans) {
      if (!REASONS.has(s.reason)) fail(`redactions.json ${tid}:${n}: reason is not a generic label`);
      if (Object.keys(s).some((k) => !["start", "end", "reason"].includes(k))) fail(`redactions.json ${tid}:${n}: unexpected span field`);
    }
  }
}

// ---------- files that are, or will be, committed ----------
const files = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], { cwd: root, encoding: "utf8" })
  .split("\n").filter(Boolean)
  .filter((f) => !/\.(png|jpe?g|gif|webp|ico|woff2?|ttf|pdf)$/i.test(f) && fs.existsSync(rel(f)));
for (const f of files) {
  if (f.startsWith("transcripts/private/") || f.startsWith("private-build/")) fail(`${f}: private file is not git-ignored`);
}
const texts = Object.fromEntries(files.map((f) => [f, fs.readFileSync(rel(f), "utf8")]));

// ---------- 2. phone numbers ----------
// Irish and international mobile/landline shapes; dates, years and paragraph
// numbers do not match because a leading + or 0 and 9-12 digits are required.
const PHONE = /(?:\+\d{2,3}[\s-]?\(?0?\)?|\b0)\d{1,3}[\s-]?\d{3}[\s-]?\d{3,4}\b/g;
for (const [f, t] of Object.entries(texts)) {
  if (f === "scripts/privacy-check.mjs") continue;
  for (const m of t.matchAll(PHONE)) {
    if (m[0].replace(/\D/g, "").length >= 9) fail(`${f}: looks like a phone number: ${m[0].slice(0, 4)}…`);
  }
}

// ---------- 3. withheld wording ----------
const words = (s) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").match(/[a-z0-9']+/g) || [];
const grams = (ws, n = 6) => { const g = new Set(); for (let i = 0; i + n <= ws.length; i++) g.add(ws.slice(i, i + n).join(" ")); return g; };
let checked = 0;
const withheld = new Map(); // gram -> "T1:64"
const publicGrams = new Set();
for (const [tid, cfg] of Object.entries(red)) {
  if (!fs.existsSync(rel(cfg.original))) continue;
  checked++;
  const orig = fs.readFileSync(rel(cfg.original), "utf8").split("\n");
  const pub = fs.readFileSync(rel(cfg.public), "utf8").split("\n");
  for (const l of pub) for (const g of grams(words(l.replace(/\[[^\]]*withheld[^\]]*\]/g, " | ")))) publicGrams.add(g);
  for (const n of Object.keys(cfg.whole)) for (const g of grams(words(orig[n - 1]))) withheld.set(g, `${tid}:${n}`);
  for (const [n, p] of Object.entries(cfg.partial)) {
    for (const s of p.spans) for (const g of grams(words(orig[n - 1].slice(s.start, s.end)))) withheld.set(g, `${tid}:${n}`);
  }
}
if (checked) {
  for (const g of publicGrams) withheld.delete(g);
  for (const [f, t] of Object.entries(texts)) {
    const seen = new Set();
    for (const g of grams(words(t))) {
      const at = withheld.get(g);
      if (at && !seen.has(at)) { seen.add(at); fail(`${f}: contains wording withheld at ${at}`); }
    }
  }
}

// ---------- 4. committed bundle is the public build ----------
const bundle = texts["assets/js/archive-data.js"] || "";
if (!/"private":\s*false/.test(bundle)) fail("assets/js/archive-data.js is not the public build");

if (problems.length) {
  console.error(`✗ Privacy check failed (${problems.length}):\n  ` + problems.join("\n  "));
  process.exit(1);
}
console.log(`✓ Privacy check passed: ${files.length} files scanned; redaction config holds no text; no phone numbers; `
  + (checked ? `${withheld.size} withheld six-word phrases absent from every public file.` : "private originals not present, so the withheld-wording scan was skipped."));
