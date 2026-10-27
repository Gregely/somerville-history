// Final repository check.
//
//   node scripts/repo-check.mjs
//
// 1. No committed file contains credentials: API keys, access tokens, private
//    keys or password assignments. Family history, names and anecdotes are
//    not secrets and are not checked for.
// 2. The published transcripts are complete: each matches the checksum of the
//    original recorded in transcripts/transcripts.json, carries no redaction
//    marker, and every paragraph appears in full in the committed bundle.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = (p) => path.join(root, p);
const problems = [];
const fail = (m) => problems.push(m);

// ---------- 1. credentials ----------
const SECRETS = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{36,}\b|\bgithub_pat_[A-Za-z0-9_]{40,}\b/],
  ["Anthropic/OpenAI key", /\bsk-(?:ant-)?[A-Za-z0-9_-]{20,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["Slack token", /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ["Stripe key", /\b[rs]k_live_[A-Za-z0-9]{20,}\b/],
  ["JSON web token", /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/],
  ["credential assignment", /\b(?:password|passwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token)\s*[:=]\s*["'][^"'\s]{6,}["']/i],
];
const files = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], { cwd: root, encoding: "utf8" })
  .split("\n").filter((f) => f && fs.existsSync(rel(f)) && !/\.(png|jpe?g|gif|webp|ico|woff2?|ttf|pdf)$/i.test(f));
for (const f of files) {
  if (f === "scripts/repo-check.mjs") continue;
  const text = fs.readFileSync(rel(f), "utf8");
  for (const [name, re] of SECRETS) if (re.test(text)) fail(`${f}: looks like a ${name}`);
  if (/(^|\/)\.env(\.|$)|\.(pem|key|p12|pfx)$/.test(f)) fail(`${f}: credentials file should not be committed`);
}

// ---------- 2. complete transcripts ----------
const manifest = JSON.parse(fs.readFileSync(rel("transcripts/transcripts.json"), "utf8"));
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(rel("assets/js/archive-data.js"), "utf8"), ctx);
const bundled = Object.fromEntries((ctx.window.ARCHIVE.transcripts || []).map((t) => [t.id, t]));
let paras = 0;
for (const t of manifest) {
  const bytes = fs.readFileSync(rel(t.file));
  const sha = crypto.createHash("sha256").update(bytes).digest("hex");
  if (!t.sha256) fail(`${t.id}: no sha256 of the original recorded in transcripts.json`);
  else if (sha !== t.sha256) fail(`${t.id}: ${t.file} does not match the recorded original`);
  const text = bytes.toString("utf8");
  if (/\[Passage withheld|withheld…\]/.test(text)) fail(`${t.id}: ${t.file} contains a redaction marker`);
  const b = bundled[t.id];
  if (!b) { fail(`${t.id}: missing from the bundle`); continue; }
  const lines = text.replace(/\r\n/g, "\n").split("\n").map((s, i) => [i + 1, s]).filter(([, s]) => s.trim());
  const inBundle = new Map(b.lines.map((l) => [l.n, l.text]));
  for (const [n, s] of lines) if (inBundle.get(n) !== s) fail(`${t.id}:${n}: paragraph missing or altered in the bundle`);
  if (b.lines.length !== lines.length) fail(`${t.id}: bundle has ${b.lines.length} paragraphs, file has ${lines.length}`);
  paras += lines.length;
}

if (problems.length) {
  console.error(`✗ Repository check failed (${problems.length}):\n  ` + problems.join("\n  "));
  process.exit(1);
}
console.log(`✓ Repository check passed: ${files.length} files scanned, no credentials; ${manifest.length} transcripts match their originals and all ${paras} paragraphs are in the published bundle.`);
