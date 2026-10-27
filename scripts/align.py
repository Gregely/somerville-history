"""Align the paragraphs of two transcripts of the same recording.

    python3 -I scripts/align.py            # writes transcripts/alignment.json

Both transcripts are word-aligned with difflib; each paragraph is then mapped
to the paragraph(s) of the other transcript that its matched words fall in.
Paragraphs are grouped into "blocks" (connected, order-preserving groups)
for the side-by-side comparison view. Only paragraph numbers are written.
"""
import difflib
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(entry):
    return open(os.path.join(ROOT, entry["file"]), encoding="utf-8").read().split("\n"), "file"


def words(lines):
    out = []
    for i, line in enumerate(lines):
        for w in re.findall(r"[a-z0-9']+", line.lower()):
            out.append((w, i + 1))
    return out


def align(a_lines, b_lines):
    wa, wb = words(a_lines), words(b_lines)
    sm = difflib.SequenceMatcher(None, [w for w, _ in wa], [w for w, _ in wb], autojunk=False)
    links = {}
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            pa, pb = wa[blk.a + k][1], wb[blk.b + k][1]
            links.setdefault(pa, {}).setdefault(pb, 0)
            links[pa][pb] += 1
    # keep links carrying a meaningful share of a paragraph's matched words
    a2b = {}
    for pa, targets in links.items():
        total = sum(targets.values())
        keep = sorted(pb for pb, n in targets.items() if n >= 3 or n / total >= 0.34)
        if keep:
            a2b[pa] = keep
    return a2b


def blocks(a2b, a_paras, b_paras):
    """Group into order-preserving blocks of A and B paragraphs."""
    out = []
    for pa in a_paras:
        t = a2b.get(pa, [])
        cur = out[-1] if out else None
        if cur is None or (t and cur["b"] and min(t) >= max(cur["b"])):
            out.append({"a": [pa], "b": list(t)})
        else:
            cur["a"].append(pa)
            cur["b"] = sorted(set(cur["b"]) | set(t))
    # merge blocks whose B ranges cross (sharing one boundary paragraph is fine)
    merged = []
    for blk in out:
        if merged and blk["b"] and merged[-1]["b"] and min(blk["b"]) < max(merged[-1]["b"]):
            merged[-1]["a"] += blk["a"]
            merged[-1]["b"] = sorted(set(merged[-1]["b"]) | set(blk["b"]))
        else:
            merged.append(blk)
    # give every B paragraph a home: fill each block up to the next block's start
    with_b = [m for m in merged if m["b"]]
    for i, blk in enumerate(with_b):
        lo = blk["b"][0]
        nxt = with_b[i + 1]["b"][0] if i + 1 < len(with_b) else max(b_paras) + 1
        blk["b"] = sorted(set(blk["b"]) | {p for p in b_paras if lo <= p < nxt})
    if with_b:
        with_b[0]["b"] = sorted(set(with_b[0]["b"]) | {p for p in b_paras if p < with_b[0]["b"][0]})
    return merged


def main():
    manifest = json.load(open(os.path.join(ROOT, "transcripts", "transcripts.json"), encoding="utf-8"))
    a, b = manifest[0], manifest[1]
    a_lines, a_src = load(a)
    b_lines, b_src = load(b)
    a2b = align(a_lines, b_lines)
    b2a = {}
    for pa, pbs in a2b.items():
        for pb in pbs:
            b2a.setdefault(pb, []).append(pa)
    a_paras = [i + 1 for i, l in enumerate(a_lines) if l.strip()]
    b_paras = [i + 1 for i, l in enumerate(b_lines) if l.strip()]
    out = {
        "pair": [a["id"], b["id"]],
        "computedFrom": {a["id"]: a_src, b["id"]: b_src},
        "map": {a["id"]: {str(k): v for k, v in sorted(a2b.items())}, b["id"]: {str(k): sorted(v) for k, v in sorted(b2a.items())}},
        "blocks": blocks(a2b, a_paras, b_paras),
    }
    json.dump(out, open(os.path.join(ROOT, "transcripts", "alignment.json"), "w"), separators=(",", ":"))
    unaligned = [p for p in a_paras if p not in a2b]
    print(f"aligned {len(a2b)}/{len(a_paras)} {a['id']} paragraphs; {len(out['blocks'])} blocks; unaligned {a['id']}: {unaligned[:30]}")


if __name__ == "__main__":
    main()
