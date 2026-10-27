"""Produce the public transcripts from the private originals.

    python3 -I scripts/redact.py            # all transcripts in transcripts/redactions.json
    python3 -I scripts/redact.py T2         # one transcript

What is withheld is specified in transcripts/redactions.json by line number
and character offsets only, so the committed configuration never contains
any withheld wording. Line numbers are preserved exactly, so every citation
(e.g. T1:216, T2:88) points at the same passage in the private and public
versions. Only personal, domestic and third-party asides are withheld;
family-history content is not.

The private originals live in transcripts/private/ (git-ignored). Each entry
records the original line length, and the script refuses to run if the
original no longer matches, so offsets cannot silently drift.
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WHOLE_MARK = "[Passage withheld from the public copy: {why}. Preserved in the private original.]"
SPAN_MARK = "[…{why} withheld…]"


def redact(tid, cfg):
    src = os.path.join(ROOT, cfg["original"])
    lines = open(src, encoding="utf-8").read().split("\n")
    for n, w in cfg["whole"].items():
        line = lines[int(n) - 1]
        assert len(line) == w["length"], f"{tid}:{n} original changed (length {len(line)} != {w['length']})"
        lines[int(n) - 1] = WHOLE_MARK.format(why=w["reason"])
    for n, p in cfg["partial"].items():
        line = lines[int(n) - 1]
        assert len(line) == p["length"], f"{tid}:{n} original changed (length {len(line)} != {p['length']})"
        # apply right-to-left so earlier offsets stay valid
        for s in sorted(p["spans"], key=lambda s: -s["start"]):
            lead = " " if s["start"] > 0 and line[s["start"] - 1] != " " else ""
            tail = " " if s["end"] < len(line) and line[s["end"]] != " " and not line[s["end"]].isspace() else ""
            line = line[: s["start"]] + lead + SPAN_MARK.format(why=s["reason"]) + tail + line[s["end"]:]
        lines[int(n) - 1] = line
    dst = os.path.join(ROOT, cfg["public"])
    open(dst, "w", encoding="utf-8").write("\n".join(lines))
    print(f"{tid}: wrote {cfg['public']} ({len(cfg['whole'])} whole, {len(cfg['partial'])} partial)")


def main(only=None):
    config = json.load(open(os.path.join(ROOT, "transcripts", "redactions.json"), encoding="utf-8"))
    for tid, cfg in config.items():
        if only and tid not in only:
            continue
        redact(tid, cfg)


if __name__ == "__main__":
    main(set(sys.argv[1:]) or None)
