// Succession check for the story "The Dormant Title" (chapter dormant-title).
// Works the male-line succession to the Somerville baronetcy out of the extended
// genealogy (data/genealogy.json) instead of restating it, and checks that
//  - the descent from Sir James, 1st Baronet, to Grandpa and his sons is linked
//    parent to child in the profiles;
//  - every senior male line the claim passes over is recorded as ending (died
//    young, unmarried, d.s.p., daughters only), or is one of the known gaps;
//  - the result agrees with Grandpa's reckoning (C¶71–74) and with the saga;
//  - every quotation the saga attributes to a profile is found in that profile.
// It checks the archive's reasoning, not the claim: the Crawford line (Archibald
// James's children by his 1836 marriage) is not traced in the profiles at all.
//   node tests/succession.cjs
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), "utf8"));
const G = Object.fromEntries(read("data/genealogy.json").profiles.map((p) => [p.id, p]));
const saga = read("data/narrative.json").find((c) => c.id === "dormant-title");
const errs = [];
const fail = (m) => errs.push(m);

const text = (id) => [G[id].name, ...G[id].paras.map((x) => (typeof x === "string" ? x : x.map((r) => r[0]).join("")))].join("\n");
const year = (s) => { const m = /\b(1[5-9]\d\d|20\d\d)\b/.exec(s || ""); return m ? +m[1] : null; };
const born = (id) => year((G[id].life || {}).born);
const died = (id) => year((G[id].life || {}).died) || year((/^Death:.*$/m.exec(text(id)) || [""])[0]);

// Sons in order of birth. Where a son has no birth date, the order comes from his
// profile's wording ("2ND son", "5th son") or the account, as noted.
const ORDER = {
  "0525": ["0535", "0540", "0541", "0545"], // William: "the second son of the first baronet" (B¶41); Thomas died aged three
  "0535": ["0553", "0556", "0559"], // Warburton and William of Lake are undated younger sons
  "0553": ["0574", "0579"], // Marcus succeeded as 4th Baronet, so James of Ross was the younger; both lines end
  "0579": ["0606", "0607", "0608"], // "2ND Son", "3RD Son"
  "0591": ["0626", "0627", "0628", "0631", "0634"], // 0634: "5th son" (birth year garbled in the profile)
};
const children = {};
for (const p of Object.values(G)) for (const par of p.parents || []) (children[par] ||= []).push(p.id);
function sons(id) {
  const s = (children[id] || []).filter((k) => G[k].sex === "m");
  if (ORDER[id]) {
    if (s.length !== ORDER[id].length || s.some((k) => !ORDER[id].includes(k))) fail(`${id}: sons ${s} differ from the fixed order ${ORDER[id]}`);
    const dated = ORDER[id].filter(born).map(born);
    if (dated.some((y, i) => i && y < dated[i - 1])) fail(`${id}: fixed order contradicts birth years`);
    return ORDER[id];
  }
  for (const k of s) if (!born(k)) fail(`${id}: son ${k} has no birth year and no fixed order`);
  return s.sort((a, b) => born(a) - born(b));
}

// How a line with no recorded sons is known to end.
function ending(id) {
  const t = text(id), b = born(id), d = died(id);
  if (/no legitimate issue/i.test(t) && id === "0584") return "CONTESTED: the family's index says “no legitimate issue”; the 1836 marriage is the point in dispute";
  if (b && d && d - b < 16) return `died young (${b}–${d})`;
  if (/died young/i.test(t)) return "died young";
  if (/\bunmarried\b/i.test(t)) return "unmarried";
  if (/\bd\.?s\.?p\b|without issue|no legitimate issue|no children|childless/i.test(t)) return "no children (d.s.p.)";
  if (/\b\d daughters:|only child|one daughter|three daughters/i.test(t) || DAUGHTERS[id]) return "daughters only";
  return null;
}
// Daughters only, recorded outside the man's own profile.
const DAUGHTERS = { "0628": "his only child, Lily (0628 lists her; the 1924 confirmation calls her “only child”)" };

// Walk the male lines in order of seniority, as a baronetcy descends.
const visited = [], gaps = [], contested = [];
let holder = null;
(function walk(id, depth) {
  const s = sons(id);
  if (G[id].living && !holder) { holder = id; visited.push([depth, id, "LIVING: senior surviving male line in the archive"]); }
  else if (!s.length && !G[id].living) {
    const e = ending(id);
    visited.push([depth, id, e || "GAP: no sons recorded, and no record that the line ended"]);
    if (!e) gaps.push(id);
    else if (e.startsWith("CONTESTED")) contested.push(id);
  } else visited.push([depth, id, ""]);
  if (holder) return;
  for (const k of s) { walk(k, depth + 1); if (holder) return; }
})("0525", 0);

// 1. the descent on which the claim rests
const CHAIN = ["0525", "0541", "0563", "0591", "0631", "0670", "0682"];
for (let i = 1; i < CHAIN.length; i++) if (!(G[CHAIN[i]].parents || []).includes(CHAIN[i - 1])) fail(`descent: ${CHAIN[i]} is not a child of ${CHAIN[i - 1]}`);
for (const id of ["0691", "0693", "0695"]) if (!(G[id].parents || []).includes("0682")) fail(`${id} is not a son of 0682`);
if (!(born("0691") < born("0693") && born("0693") < born("0695"))) fail("Grandpa's sons are not in the order James, Charles, Edward");

// 2. the senior line ends with the 2nd Lord Athlumney
const SENIOR = ["0525", "0535", "0553", "0574", "0598", "0638"];
for (let i = 1; i < SENIOR.length; i++) if (!(G[SENIOR[i]].parents || []).includes(SENIOR[i - 1])) fail(`senior line: ${SENIOR[i]} is not a child of ${SENIOR[i - 1]}`);
if (died("0638") !== 1929 || !/d\.?s\.?p/i.test(text("0638"))) fail("0638: the 2nd Baron should die d.s.p. in 1929");

// 3. the walk reaches Grandpa, passing only lines that end, the two known gaps and Archibald
if (holder !== "0682") fail(`senior surviving male line is ${holder}, expected 0682 (William, b. 1937)`);
const EXPECTED_GAPS = ["0556", "0559"]; // Warburton and William of Lake: "no children recorded either way" in the saga
if (gaps.join() !== EXPECTED_GAPS.join()) fail(`gaps ${gaps} differ from the gaps the saga states (${EXPECTED_GAPS})`);
if (contested.join() !== "0584") fail(`contested lines ${contested}, expected only Archibald James (0584)`);
const order = visited.map((v) => v[1]);
for (const [a, b] of [["0582", "0584"], ["0584", "0586"], ["0586", "0591"], ["0626", "0628"], ["0628", "0631"], ["0660", "0670"]])
  if (order.indexOf(a) > order.indexOf(b)) fail(`order: ${a} should rank before ${b}`);

// 4. after Grandpa: his sons and grandsons, from their profiles (the grandsons have none of their own)
const HEIRS = [["0691", "James (b. 1969)", /Three daughters/], ["0693", "Charles (b. 1971)", null], ["0693", "Gergely (b. 2005)", /Gergely[^\n]*born:? 22 June 2005/], ["0693", "Benedek (b. 2010)", /Benedek[^\n]*born:? 5 February 2010/], ["0695", "Edward (b. 1972)", null], ["0695", "Alexander (b. 2007)", /Alexander[^\n]*born:? 11 June 2007/]];
for (const [id, who, re] of HEIRS) if (re && !re.test(text(id))) fail(`${id}: profile does not record ${who}`);

// 5. the saga says the same
const body = saga.body.join("\n");
for (const [re, what] of [[/\{g:0582\}/, "William Henry"], [/\{g:0613\}/, "Corry's son"], [/\{g:0603\}/, "James Richard"], [/\{g:0556\} \{g:0559\}/, "the two gaps"], [/\{q:T3:73\}/, "Grandpa's reckoning"], [/\{q:T3:74\}/, "Benedek before Alexander"]])
  if (!re.test(body)) fail(`saga does not cite ${what}`);
if (!/not Grandpa's own account/.test(saga.synthesis || "")) fail("saga is not marked as a later synthesis");

// 6. quotations the saga attributes to profiles ("…" {k:..} {g:ID} {g:ID}) are in one of them
const norm = (s) => s.toLowerCase().replace(/[’‘`]/g, "'").replace(/[“”]/g, '"').replace(/[–—-]/g, " ").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
let checked = 0;
for (const [i, para] of saga.body.entries()) {
  for (const m of para.matchAll(/"([^"]{12,})"((?:\s*\{k:[a-z]+\})*)((?:\s*\{g:[0-9A-Z]+\})+)/g)) {
    const ids = [...m[3].matchAll(/\{g:([0-9A-Z]+)\}/g)].map((x) => x[1]);
    const prof = norm(ids.map(text).join("\n"));
    for (const frag of m[1].split("…").map(norm).filter((f) => f.split(" ").length >= 3)) {
      checked++;
      if (!prof.includes(frag)) {
        const words = frag.split(" "), hit = words.filter((w) => prof.includes(w)).length;
        if (hit / words.length < 0.9 || !prof.includes(words.slice(0, 3).join(" "))) fail(`saga body[${i}]: “${frag}” not found in profile ${ids.join(" or ")}`);
      }
    }
  }
}

// report
const name = (id) => G[id].name;
console.log("Male-line seniority from Sir James Somerville, 1st Baronet (extended genealogy):");
for (const [d, id, note] of visited) console.log(`${"  ".repeat(d)}${id} ${name(id)}${born(id) ? ` (b. ${born(id)})` : ""}${note ? ` — ${note}` : ""}`);
console.log(`\nOn Grandpa's case (Archibald James's 1836 marriage bigamous, little Archie's line unknown), the senior surviving male line is ${holder} ${holder ? name(holder) : ""}; then:`);
HEIRS.forEach(([, who], i) => console.log(`  ${i + 1}. ${who}${i === 0 ? " — has daughters only, so the line passes on after him" : ""}`));
console.log("If the 1836 marriage stands, the title goes instead to Archibald James's male line by Elizabeth Crawford, which the profiles do not trace.");
console.log(`Gaps: ${gaps.map((g) => `${g} ${name(g)}`).join("; ")}. Profile quotations checked: ${checked}.`);
if (errs.length) { console.error(`\n${errs.length} problem(s):\n` + errs.map((e) => "✗ " + e).join("\n")); process.exit(1); }
console.log("✓ Succession consistent with the profiles and the saga.");
