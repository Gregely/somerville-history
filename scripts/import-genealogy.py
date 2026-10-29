#!/usr/bin/env python3
"""Import the extended genealogy: data/genealogy.json from the compiled family
profiles in "research/David Gilmour amended records".

    python3 scripts/import-genealogy.py            convert, parse and write
    python3 scripts/import-genealogy.py --check    parse and compare only

Needs LibreOffice (soffice) to convert the Word .doc files to .docx, whose
XML keeps the tracked changes: who inserted or deleted what. The profiles'
text is kept as written; insertions by "William Somerville" (Grandpa,
2021-22) and by "7" (2011-12) stay marked, and deletions are kept but hidden
on the site.

Privacy (see also scripts/build.mjs, which enforces it):
  - living people (LIVING): name and place in the family only;
  - people born after 1910 who have died (MODERN): name, years and place;
  - passages in other profiles about living relatives (REDACT) are replaced
    by a marker. Each is pinned to a fingerprint of the paragraph, so if a
    profile is edited the import stops until the passage is reviewed again.

The editorial tables below (links the profiles do not state by number,
doubtful parentage, notes, links to Grandpa's account) are the archive's own
judgements and are shown on the site as archive notes.
"""
import argparse, collections, glob, hashlib, json, os, re, shutil, subprocess, sys, tempfile, zipfile
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "research", "David Gilmour amended records")
OUT = os.path.join(ROOT, "data", "genealogy.json")
FOLDERS = (("Tranche 1", 1), ("Tranche 2", 2), ("Wendy", "wendy"))

# ---------- 1. Word XML: paragraphs with tracked changes ----------
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
MC = "{http://schemas.openxmlformats.org/markup-compatibility/2006}"
AUTH = {"William Somerville": "W", "7": "7", "Unknown": "U"}


def walk(el, code, out):
    tag = el.tag
    if tag == MC + "Fallback":
        return
    if tag in (W + "ins", W + "moveTo"):
        a = AUTH.get(el.get(W + "author"), "U")
        code = "i:" + a
    elif tag in (W + "del", W + "moveFrom"):
        a = AUTH.get(el.get(W + "author"), "U")
        code = "d:" + a
    if tag in (W + "t", W + "delText"):
        out.append([el.text or "", code])
        return
    if tag == W + "tab":
        out.append(["\t", code]); return
    if tag in (W + "br", W + "cr"):
        out.append(["\n", code]); return
    if tag in (W + "drawing", W + "pict") or tag.endswith("}object"):
        out.append(["", "pic"]); return
    if tag in (W + "pPr", W + "rPr", W + "sectPr", W + "instrText"):
        return
    for ch in el:
        walk(ch, code, out)


def paragraphs(path):
    x = zipfile.ZipFile(path).read("word/document.xml")
    root = ET.fromstring(x)
    body = root.find(W + "body")
    paras = []

    def visit(el):
        if el.tag == MC + "Fallback":
            return
        if el.tag == W + "p":
            segs = []
            walk(el, "", segs)
            # merge adjacent segments with the same code
            merged = []
            for t, c in segs:
                if merged and merged[-1][1] == c and c != "pic":
                    merged[-1][0] += t
                else:
                    merged.append([t, c])
            # text boxes inside the paragraph are inlined by walk()
            paras.append(merged)
            return
        for ch in el:
            visit(ch)

    visit(body)
    return paras


def accepted(segs):
    return "".join(t for t, c in segs if not c.startswith("d:") and c != "pic")


# ---------- 2. each profile's record number, name, opening lines and vital fields ----------
acc = accepted


def clean(s):
    return re.sub(r"[ \t ]+", " ", s.replace("﻿", "")).strip()

SMALL = {"of", "de", "and", "the", "von", "van", "du", "la", "le"}
KEEP = {"KCB", "CIE", "MP", "RN", "R.N.", "M.C.", "MC", "B.A.", "M.A.", "MA", "BA", "DSO", "II", "III", "IV", "QC", "KC", "JP", "Bt.", "Bt"}
def tcase(name):
    out = []
    for i, w in enumerate(name.split()):
        if w in KEEP or (len(w) <= 3 and w.endswith(".") and w[:-1].isupper() and len(w) == 2):
            out.append(w); continue
        lw = w.lower()
        if i and lw in SMALL:
            out.append(lw); continue
        t = lw.capitalize()
        t = re.sub(r"^(Mc|Mac(?=[a-z]{3}))([a-z])", lambda m: m.group(1) + m.group(2).upper(), t)
        t = re.sub(r"([’'\-])([a-z])", lambda m: m.group(1) + m.group(2).upper(), t)
        t = re.sub(r"^(\w\.)(\w)", lambda m: m.group(1) + m.group(2).upper(), t)
        t = re.sub(r"\.(\w)", lambda m: "." + m.group(1).upper(), t)
        out.append(t)
    return " ".join(out)

FIELD = re.compile(r"^(Birth|Born|Bapt\w*|Baptism|Marriage(?:\s*\d)?|Married|Death|Died|Buried|Bur|Burial|Bd)\s*[:.]", re.I)

def structure(d):
    """Record number, name, nickname, opening lines and vital fields of one document."""
    lines = [clean(acc(p)) for p in d["paras"]]
    m = re.match(r"^(\d{4}[AB]?)", d["base"])
    rec = m.group(1) if m else None
    typed = None
    start = 0
    for i, l in enumerate(lines):
        mm = re.search(r"Record\s*No[:.]?\s*(\S+)", l)
        if mm:
            typed = mm.group(1); start = i + 1; break
        if re.fullmatch(r"\d{4}[AB]?", l):  # "Record No:" deleted, number kept
            typed = l; start = i + 1; break
        if l:
            break
    body = [l for l in lines[start:]]
    nonempty = [(i, l) for i, l in enumerate(body) if l]
    # file-name name
    fname = re.sub(r"\((?:\s*a|A)mended\)+|\(003\)|\s*-\s*.*LORD ATHLUMNEY.*$|\s*-\s*2ND.*$", "", d["base"][len(rec or ""):]).strip()
    # name line: first non-empty line, if it is mostly capitals
    nm_i, nm = nonempty[0] if nonempty else (0, "")
    letters = re.sub(r"[^A-Za-z]", "", re.sub(r"\(.*?\)|[“”\"‘’'].*?[“”\"‘’']", "", nm))
    is_name = letters and sum(ch.isupper() for ch in letters) / len(letters) > 0.6 and not re.match(r"(Son|Daughter|Dau|Wife|Husband|Father|Mother|Elder|Eldest|Only|Younger)\b", nm, re.I)
    if not is_name:
        nm_i = -1
    name_line = nm if is_name else fname
    known = None
    mk = re.search(r"\(([^)]*)\)|[“\"‘']([^”\"’']+)[”\"’']", name_line)
    if mk:
        known = (mk.group(1) or mk.group(2)).strip(" “”\"‘’'")
        if re.fullmatch(r"(?i)amended|name", known or ""): known = None
    base_name = re.sub(r"\(.*?\)|[“\"‘'][^”\"’']*[”\"’']|\bNAME\b|\(\s*amended\s*\)", "", name_line)
    base_name = re.sub(r"\s+", " ", base_name).strip(" ,")
    base_name = re.sub(r"\bNAME\b", "", re.sub(r"(?<=[a-z])NAME\b", "", base_name)).strip()
    name = " ".join(tcase(w) if (w.isupper() and len(re.sub(r"[^A-Z]", "", w)) > 1 and w not in KEEP) else w for w in base_name.split())
    # header lines: after the name, before the first field
    header, fields = [], []
    j = nm_i + 1
    while j < len(body):
        l = body[j]
        if FIELD.match(l):
            break
        if l:
            if re.match(r"(Notes|Source)\b|(Father|Mother) of\s*:", l, re.I):
                break
            header.append(l)
        j += 1
    # vital fields: consecutive field lines (and their continuation lines);
    # a "Mother of:" list may come first
    k = j
    for kk in range(j, min(len(body), j + 30)):
        if FIELD.match(body[kk]):
            k = kk; break
        if re.match(r"(Notes|Source)\b", body[kk], re.I):
            break
    cur = None
    while k < len(body):
        l = body[k]
        if FIELD.match(l):
            lab, val = re.split(r"\s*[:.]\s*", l, maxsplit=1) if re.search(r"[:.]", l) else (l, "")
            cur = {"label": lab.strip(), "value": val.strip()}
            fields.append(cur)
        elif not l:
            # a blank line ends the block unless the next line is another field
            nxt = next((x for x in body[k + 1:] if x), "")
            if not FIELD.match(nxt):
                break
            cur = None
        elif cur is not None and not re.match(r"(Notes|Source)\b|(Father|Mother) of\s*:", l, re.I):
            cur["value"] = (cur["value"] + " " + l).strip()
        else:
            break
        k += 1
    return {"rec": rec, "typed": typed if typed != rec else None, "base": d["base"], "tranche": d["tranche"], "folder": d["folder"],
            "nameLine": name_line, "name": name, "known": known, "header": header, "fields": fields, "start": start, "nameIdx": nm_i}


# ---------- 3. family links from "Son of X (0541)", "Wife of Y (0563)", marriages ----------
P, BYREC, BYTYPED = [], {}, collections.defaultdict(list)

STOPW = {"somerville", "of", "the", "and", "sir", "rev", "col", "capt", "captain", "major", "maj", "gen", "dr", "lady", "hon", "lord", "mr", "mrs", "miss", "by", "his", "her", "wife", "son", "dau", "daughter", "nee", "née", "late", "bt", "lt", "brig", "brigadier", "general"}
def toks(s):
    return {w for w in re.findall(r"[a-z’']+", s.lower()) if w not in STOPW and len(w) > 1}
def ptoks(p):
    t = toks(p["name"]) | toks(p["known"] or "") | toks(p["nameLine"])
    if "somerville" in p["name"].lower():
        t.add("somerville!")
    return t

REF = re.compile(r"\(\s*(\d{4}[AB]?)\s*\)")
def refs_in(text):
    """[(num, preceding-name-text, position)]"""
    out = []
    for m in REF.finditer(text):
        pre = text[max(0, m.start() - 70):m.start()]
        out.append((m.group(1), pre, m.start()))
    return out

def resolve(num, pre, exclude=None):
    """Find the profile meant by "<name> (num)". Record numbers in the later
    Tranche 2 profiles were renumbered, so check the name as well."""
    words = re.findall(r"[A-Za-z’']+", pre)[-9:]
    nt = toks(" ".join(words))
    if "somerville" in " ".join(words).lower():
        nt.add("somerville!")
    def score(p):
        pt = ptoks(p)
        return len((nt & pt) - {"somerville!"}) * 2 + (1 if "somerville!" in nt and "somerville!" in pt else 0)
    cands = [BYREC[num]] if num in BYREC else []
    for c in cands:
        if c is not exclude and score(c) >= 2:
            return c["rec"], "number"
    for c in BYTYPED.get(num, []):
        if c is not exclude and score(c) >= 2:
            return c["rec"], "typed number"
    best = sorted((p for p in P if p is not exclude), key=lambda p: -score(p))
    if best and score(best[0]) >= 3 and (len(best) == 1 or score(best[0]) > score(best[1])):
        return best[0]["rec"], "name"
    return None, "unresolved"

KW = re.compile(r"\b(?:who\s+)?(married)\b|\b(sons?|daughters?|dau\.?|child|wife|husband|father|mother|widow|issue)\b(?:\s+and\s+cousin)?\s+of\b|\bby\s+his\s+(?:second\s+|first\s+|2nd\s+|1st\s+)?wife\b|\bby\s+her\s+husband\b", re.I)
def clauses(text):
    """Split a relation text at each "<relation> of" keyword: [(kind, start, end)].
    A child, spouse or parent clause after the first parent clause describes
    someone else (a parent's own parents, say), and is tagged "other"."""
    ms = list(KW.finditer(text))
    out = []
    seen_parent = False
    for i, m in enumerate(ms):
        k = m.group(0).lower()
        if k.startswith("by his") or k.startswith("by her"):
            kind = "parent"
        elif m.group(1):
            kind = "other"
        else:
            w = m.group(2).lower()
            kind = "spouse" if w in ("wife", "husband", "widow") else "child" if w in ("father", "mother", "issue") else "parent"
        if kind == "parent" and seen_parent and not (k.startswith("by his") or k.startswith("by her")):
            kind = "other"
        if kind == "parent":
            seen_parent = True
        out.append((kind, m.end(), ms[i + 1].start() if i + 1 < len(ms) else len(text)))
    return out

def links():
    out = {}
    log = []
    for p in P:
        par, sp, kids = [], [], []
        head = " ".join(p["header"])
        cl = clauses(head)
        for num, pre, pos in refs_in(head):
            kind = next((k for k, a, b in cl if a <= pos < b), None)
            if kind in (None, "other"):
                continue
            # in "Father of X (n) wife of Y (m)", Y is the child's spouse
            if kind == "spouse" and any(k == "child" for k, a, b in cl if b <= pos):
                continue
            rec, how = resolve(num, pre, exclude=p)
            if not rec:
                log.append(f"{p['rec']}: unresolved ({num}) after '{pre[-40:]}'"); continue
            if how != "number":
                log.append(f"{p['rec']}: ({num}) '{pre[-30:].strip()}' -> {rec} {BYREC[rec]['name']} by {how}")
            if kind == "parent" and rec not in par: par.append(rec)
            elif kind == "spouse" and rec not in sp: sp.append(rec)
            elif kind == "child" and rec not in kids: kids.append(rec)
        for f in p["fields"]:
            if f["label"].lower().startswith("marr"):
                v = f["value"]
                cl2 = clauses(v)
                for num, pre, pos in refs_in(v):
                    if any(a <= pos < b for k, a, b in cl2):
                        continue  # a reference inside "son of ..." etc.
                    rec, how = resolve(num, pre, exclude=p)
                    if rec and rec not in sp and rec not in par:
                        sp.append(rec)
                        if how != "number":
                            log.append(f"{p['rec']}: marriage ({num}) '{pre[-30:].strip()}' -> {rec} {BYREC[rec]['name']} by {how}")
                    elif not rec:
                        log.append(f"{p['rec']}: marriage unresolved ({num}) after '{pre[-40:]}'")
        out[p["rec"]] = {"parents": par, "spouses": sp, "children": kids}
    return out, log


# ---------- 4. editorial tables (the archive's own judgements) ----------
LIVING = {"0682", "0683", "0686", "0687", "0691", "0692", "0693", "0694", "0695", "0696"}
MODERN = {"0684", "0685", "0688", "0689", "0690"}  # born after 1910 and since died
OMIT = "⟦omitted⟧"

# ---------- manual corrections to the links read from the profiles ----------
EXTRA_SPOUSES = [("0505", "0504"), ("0577", "0574"), ("0610", "0611"), ("0612", "0609"), ("0637", "0636"),
                 ("0680", "0681"), ("0689", "0690"), ("0557", "0556")]
EXTRA_PARENTS = {"0505": ["0506"], "0668": ["0669"], "0509": ["0510"]}
LINK_NOTES = {
    ("0611", "0610"): "Louisa's profile names her husband Pierce Morton (0612); his own record is headed Pierce Norton (0610).",
    ("0609", "0612"): "Frances's profile gives her husband's record number as 0610; his own record is 0612.",
}
DOUBT = {
    "0603": "His profile says he was a son of Captain William Somerville (0563) and Eliza Bellingham (0564). That is hard to reconcile with the dates in the same compilation: their sons Archibald James and John Churchill were born in May 1803 and December 1804, and James Richard was born “about 1803–1804”. His profile is filed with the senior line (Tranche 2), among Sir Marcus Somerville's descendants. The parentage is shown as stated, marked as doubtful.",
}
NOTES = {
    "0557": "The file for this record, named “ELIZBABETH HAMILTON”, contains a copy of her husband Warburton Somerville's profile (0556); no separate profile of her was written. His profile records his first marriage, on 22 February 1796, to “Elizabeth, dau of Capt John Hamilton of Shankill, Co Monaghan”.",
    "0558": "The birth, marriage and death fields of this record repeat those of her husband's profile (0556).",
    "0630": "Father of Mary Dyas, who married Henry Bellingham Somerville (0628). Her own record, 0629, is not among the files received.",
    "0628": "His wife Mary Dyas has record number 0629, but that record is not among the files received.",
}
NAMES = {"0669": "Col. Cecil Norris Baker CIE", "0557": "Elizabeth Hamilton"}
SEX = {"0501": "m", "0503": "m", "0506": "m", "0510": "m", "0521": "m", "0527": "m", "0537": "m", "0539": "m", "0544": "m",
       "0547": "m", "0555": "m", "0565": "m", "0576": "m", "0578": "m", "0581": "m", "0588": "m", "0593": "m", "0600": "m",
       "0602": "m", "0605": "m", "0610": "m", "0612": "m", "0615": "m", "0630": "m", "0633": "m", "0637": "m", "0640": "m",
       "0662": "m", "0665": "m", "0669": "m", "0672": "m", "0674": "m", "0679": "m", "0681": "m", "0684": "m", "0688": "m",
       "0690": "m", "0577": "f", "0557": "f", "0505": "f"}
# compiled profile -> the same person in Grandpa's account (data/people.json)
ARCHIVE = {
    "0563": "captain-william-somerville",
    "0564": "eliza-bellingham",
    "0582": "william-henry-somerville",
    "0583": "henrietta-ryers",
    "0584": "archibald-james-somerville",
    "0584A": "elizabeth-breakey",
    "0584B": "elizabeth-crawford",
    "0585": "john-churchill-somerville",
    "0586": "corry-somerville",
    "0587": "lucinda-simmonton",
    "0589": "bellingham-somerville",
    "0590": "tenison-somerville-1812",
    "0591": "tenison-alan-somerville",
    "0592": "eliza-oconnor",
    "0593": "oconnor-seaman",
    "0594": "samuel-somerville",
    "0595": "eliza-somerville-infant",
    "0596": "eliza-nelson",
    "0597": "thomas-nelson",
    "0613": "corry-son-william",
    "0626": "william-dennistoun-somerville",
    "0627": "tenison-alan-somerville-1845",
    "0628": "henry-bellingham-somerville-1859",
    "0631": "bellingham-arthur-somerville",
    "0632": "margaret-hall-clinch",
    "0633": "mr-clinch",
    "0634": "tenison-alan-somerville-1859",
    "0634A": "erina-somerville",
    "0634B": "thomas-forster-rolfe",
    "0659": "elizabeth-mary-somerville",
    "0660": "bunt",
    "0661": "kitty-harrison",
    "0663": "jim",
    "0664": "margaret-lucy-starkey",
    "0666": "alan-everard-somerville",
    "0667": "pat",
    "0668": "heather-baker",
    "0670": "reginald-somerville",
    "0671": "maud-moore",
    "0673": "honor-johnson",
    "0674": "rector-johnson",
    "0675": "cecilia-somerville",
    "0676": "henry-rock",
    "0677": "dorothy-somerville",
    "0678": "vere-somerville",
    "0679": "edmund-truell",
    "0680": "eddie",
    "0681": "uncle-jordan",
    "0682": "narrator",
    "0689": "juanita",
    "0691": "james-somerville",
    "0693": "charles-somerville",
    "0695": "edward-somerville",
    "0525": "james-somerville-1bt",
    "0526": "elizabeth-quayle",
    "0535": "quaile-somerville-2bt",
    "0541": "major-william-somerville",
    "0543": "elizabeth-munroe",
    "0553": "james-quaile-somerville-3bt",
    "0565": "henry-bellingham-ltcol",
    "0574": "marcus-somerville-4bt",
    "0598": "william-meredyth-somerville",
    "0638": "james-somerville-2nd-baron",
    "0639": "margery-boan",
    "0640": "harry-boan",
}
ARCHIVE_NOTES = {
    "0681": "Identified through his marriage to Edeline Somerville in 1929. The account does not name him with certainty (“Uncle John” or “Uncle Jordan”); this profile calls him “John”.",
    "0593": "The account's Daniel O'Connor, a seaman “of Shoreham, co. Sussex”, father of Eliza O'Connor.",
    "0613": None,
}

# ---------- passages about living relatives (replaced, with a marker) ----------
KEEP_REST = True
# (record, paragraph index in the document) -> (fingerprint of the paragraph as
# received, replacement text; None drops the paragraph). The 0584 entry keeps the
# rest of its paragraph after the replaced opening.
REDACT = {
    ("0564", 47): ("49dfa29772", "NB The above extract has been corrected by WBRBS from reference to LG of Ireland 1952 Edition ‘Riall of Ballyorney House’ and the Somerville records. Dorothea married William Riall of Annerville, Clonmel, Co Tipperary while her youngest sister married his youngest brother Andrew Arthur Riall. The Rialls were bankers in Clonmel, a prosperous milling town. The Riall family, but not the direct descendants of the above, subsequently married into the Roberts family of Old Conna Hall, near Bray, Co Wicklow, which they inherited. (It is now(2011) a prep school). " + OMIT + " Dorothea Riall, referred to as Dora R in Capt William’s diary, was obviously close to her sister Eliza Somerville, and is frequently mentioned in the Diary and the family correspondence. Archibald James Somerville, before his flight to Barbados in February 1823, spent three days at Clonmel before embarking on the George and Thomas. The purpose of the visit has occasioned much speculation."),
    ("0584", 140): ("e16ec589ff", "After Regi’s death, it fell to W B R B Somerville (Bill)(0682) to persue the matter. " + OMIT + " he just did not have an opportunity of taking up the necessary research himself or organising other, professional, genealogists.", KEEP_REST),
    ("0615", 169): ("d2e4b01884", None),
    ("0615", 170): ("1425114fdf", None),
    ("0615", 204): ("e61bf8205c", None),
    ("0662", 41): ("58a1108d3e", "Maureen married a Brigadier Regi Keller, who lived near Bantry. He was excessively hearty. They had a daughter who married a clergyman surnamed Connors " + OMIT + "."),
    ("0668", 18): ("eefb789653", "Julia Heather Margaret Somerville (0687) " + OMIT),
    ("0675", 27): ("0ece311bb1", "daughters " + OMIT),
    ("0675", 28): ("105811c556", None),
    ("0675", 29): ("896a03338a", OMIT + " Girlie d 3"),
    ("0675", 33): ("8cc9a55e72", "Magdalen Virginia Dormer, who d ? and had one son " + OMIT),
    ("0675", 34): ("30d4693e4b", OMIT + " Tommy d 8 July 1999."),
    ("0675", 37): ("02c39db8d3", "Gwendolyn Rosemary Ormsby (Rose) and had one daughter and five sons " + OMIT),
    ("0675", 38): ("7921708e3c", None),
    ("0675", 39): ("7452a4cdb2", None),
    ("0675", 40): ("5c0b72fa08", None),
    ("0675", 41): ("1b41dd4ca0", None),
    ("0675", 42): ("c57fce4d62", None),
    ("0675", 43): ("2b4e6d37f1", None),
    ("0675", 44): ("26c2c9f042", None),
    ("0678", 19): ("046e79cbae", "(1) de Merlie - - -(Merlie) bn 15 August 1913, md ? George Byas and was mother of " + OMIT),
    ("0678", 20): ("3ad441375c", OMIT + " Merlie d 27 August 1949"),
    ("0678", 23): ("d9ff5c6797", "(4)Rachel - - - (Ray) bn 21 November 1916, md ? Gordon Dewar and was mother of " + OMIT + " Ray d ?"),
    ("0678", 24): ("cbc514c087", "(5)Michael - - - bn 27 February md (1) ? divd ? md (2) Cazalet and was father of " + OMIT + " Michael d 28 November 1967"),
    ("0678", 25): ("628f3a0726", "(6)Charles Willliam Somerville (Toby) bn 22 May 1922 md ? Elizabeth (Beth) Moffatt-Wilson and was father of " + OMIT + " Toby d ??"),
    ("0678", 27): ("02f68288df", "(8)George - - - bn 11 July 1926 md ? Mary Fosbroke- Hobbs and was father of " + OMIT + " _d 20? _ _."),
    ("0678", 28): ("315cdb5889", "(9,10)Gillian and Joy (twins) bn 5 September 1929. Gillian md?John Gilmour and is mother of " + OMIT + " Gillian d-- Joy md ?Raymond Goss (divd) and was mother of " + OMIT + " She d ? ."),
}

EMAIL = re.compile(r"[\w.+-]+@[\w-]+(\.[\w-]+)+")

def year_of(s):
    m = re.search(r"\b(1[4-9]\d\d|20[0-2]\d)\b", s or "")
    return m.group(1) if m else None
def approx(s):
    return bool(re.search(r"\b(about|abt|c\.?|circa|poss|prob|before|bef|after|between)\b|\bc\d{4}|\?", s or "", re.I))

def collapse(segs):
    out = []
    for t, c in segs:
        code = "" if c == "" else "p" if c == "pic" else c.replace(":", "")
        t = re.sub(r"[ \t \r\n]+", " ", t.replace("﻿", ""))
        if code != "p" and not t:
            continue
        if out and out[-1][1] == code and code != "p":
            out[-1][0] += t
        else:
            out.append([t, code])
    # trim
    while out and out[0][1] != "p" and not out[0][0].strip():
        out.pop(0)
    while out and out[-1][1] != "p" and not out[-1][0].strip():
        out.pop()
    if out and out[0][1] != "p":
        out[0][0] = out[0][0].lstrip()
    if out and out[-1][1] != "p":
        out[-1][0] = out[-1][0].rstrip()
    for s in out:
        if s[1] != "p":
            s[0] = EMAIL.sub("[email address removed]", s[0])
    if all(c == "" for t, c in out):
        return "".join(t for t, c in out)
    return out
# ---------- 5. convert, parse and assemble ----------
def convert(tmp):
    """The Word files as .docx (LibreOffice keeps the tracked changes)."""
    docs = []
    for folder, tranche in FOLDERS:
        outdir = os.path.join(tmp, folder)
        os.makedirs(outdir)
        files = sorted(f for f in glob.glob(os.path.join(SRC, folder, "*.doc*")) if not os.path.basename(f).startswith("~$"))
        todo = [f for f in files if f.endswith(".doc")]
        for f in files:
            if f.endswith(".docx"):
                shutil.copy(f, outdir)
        if todo:
            subprocess.run(["soffice", "--headless", "--convert-to", "docx", "--outdir", outdir, *todo], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for f in files:
            base = os.path.splitext(os.path.basename(f))[0]
            docs.append({"base": base, "tranche": tranche, "folder": folder, "paras": paragraphs(os.path.join(outdir, base + ".docx"))})
    return docs


def build(DOCS):
    STRUCT = {d["base"]: structure(d) for d in DOCS}
    P[:] = [s for s in STRUCT.values() if s["rec"]]
    BYREC.clear(); BYREC.update({p["rec"]: p for p in P})
    BYTYPED.clear()
    for p in P:
        BYTYPED[p["typed"] or p["rec"]].append(p)
    LINKS, _ = links()
    seen = set()
    profiles = {}
    order = []
    alt = None
    for d in DOCS:
        st = STRUCT[d["base"]]
        rec = st["rec"]
        if not rec:
            alt = (d, st)
            continue
        folder = {1: "Tranche 1", 2: "Tranche 2"}[d["tranche"]]
        files = [os.path.basename(f) for f in glob.glob(os.path.join(SRC, folder, glob.escape(d["base"]) + ".*"))]
        assert files, d["base"]
        start = st["start"]
        paras_raw = d["paras"]
        # body: everything after the "Record No" and name lines
        body_idx = [i for i in range(start, len(paras_raw)) if not (st["nameIdx"] >= 0 and i == start + st["nameIdx"])]
        paras, omitted = [], 0
        revs = collections.Counter()
        for i in body_idx:
            segs = paras_raw[i]
            for t, c in segs:
                if c.startswith(("i:", "d:")) and t.strip():
                    revs[c[2:]] += 1
            key = (rec, i)
            if key in REDACT:
                fp, rep, *keep = REDACT[key]
                full = re.sub(r"\s+", " ", accepted(segs)).strip()
                if hashlib.sha1(full.encode()).hexdigest()[:10] != fp:
                    sys.exit(f"✗ {rec}, paragraph {i}: the passage withheld for privacy has changed; review it and update REDACT")
                seen.add(key)
                omitted += 1
                if rep is None:
                    continue
                if keep:
                    # keep the rest of the paragraph after the replaced opening
                    cut = full.find("genealogists.")
                    rest = full[cut + len("genealogists."):].strip() if cut >= 0 else ""
                    rep = rep + (" " + rest if rest else "")
                paras.append(rep)
                continue
            c = collapse(segs)
            if c == "" or c == []:
                continue
            paras.append(c)
        name = NAMES.get(rec, st["name"])
        lk = LINKS[rec]
        p = {
            "id": rec, "rec": rec, "name": name, "tranche": d["tranche"],
            "file": f"research/David Gilmour amended records/{folder}/{files[0]}",
        }
        if st["typed"]:
            p["typedRec"] = st["typed"]
        if st["known"]:
            p["known"] = st["known"]
        p["_parents"], p["_spouses"], p["_children"] = list(lk["parents"]), list(lk["spouses"]), list(lk["children"])
        # vitals
        fields = st["fields"]
        def fv(*labels):
            for f in fields:
                if f["label"].lower().startswith(labels) and f["value"].strip():
                    return f["value"]
            return ""
        born = fv("birth", "born")
        bapt = fv("bapt")
        died = fv("death", "died")
        if rec == "0558":
            born = bapt = died = ""
        by = year_of(born) or year_of(bapt)
        dy = year_of(died)
        if by and dy and int(dy) < int(by):
            dy = None
        life = {}
        if by:
            life["born"] = ("c. " if approx(born or bapt) else "") + by + ("" if year_of(born) else " (bapt.)")
        if dy:
            life["died"] = ("c. " if approx(died) else "") + dy
        privacy = "living" if rec in LIVING else "modern" if rec in MODERN else "full"
        p["privacy"] = privacy
        if privacy == "full":
            p["life"] = life
            p["header"] = [EMAIL.sub("[email address removed]", h) for h in st["header"]]
            p["fields"] = [{"label": f["label"], "value": EMAIL.sub("[email address removed]", f["value"])} for f in fields if f["value"].strip()] if rec != "0558" else []
            p["paras"] = [] if rec == "0557" else paras
            if omitted:
                p["omitted"] = omitted
            if revs:
                p["revisions"] = dict(revs)
        elif privacy == "modern":
            p["life"] = {k: re.sub(r"[^\d.c ]|\(.*", "", v).strip() for k, v in life.items()}
        if rec == "0557":
            p.pop("typedRec", None)
            p["header"], p["fields"], p["life"] = [], [], {}
        if rec in NOTES and NOTES[rec]:
            p["note"] = NOTES[rec]
        if rec in DOUBT:
            p["doubt"] = DOUBT[rec]
        if rec in ARCHIVE:
            p["archive"] = ARCHIVE[rec]
            if ARCHIVE_NOTES.get(rec):
                p["archiveNote"] = ARCHIVE_NOTES[rec]
        hdr = " ".join(st["header"]).lower()
        sex = SEX.get(rec)
        if not sex:
            m = re.search(r"\b(sons?|husband|father|daughters?|dau|wife|mother|widow)\b", hdr)
            if m:
                sex = "m" if m.group(1) in ("son", "sons", "husband", "father") else "f"
        if sex:
            p["sex"] = sex
        profiles[rec] = p
        order.append(rec)

    # alternative profile of Lucinda Simonton, by Wendy Stevenson
    d, st = alt
    alt_paras = [c for c in (collapse(s) for s in d["paras"][st["start"]:]) if c not in ("", [])]
    profiles["0587"]["alt"] = [{
        "title": "Another profile of Lucinda Simonton",
        "by": "Wendy Stevenson",
        "file": "research/David Gilmour amended records/Wendy/LUCINDA SIMONTON Profile.doc",
        "about": "Filed separately, in a folder named Wendy. Wendy Stevenson, in Canada, is married to a descendant of Corry and Lucinda's daughter Dorothea Victoria (see Corry's profile, 0586). Her profile differs from the compiled one in places; both are shown as they are.",
        "paras": alt_paras,
    }]

    # ---------- symmetric family links ----------
    par = {r: set(profiles[r]["_parents"]) for r in profiles}
    sp = {r: set(profiles[r]["_spouses"]) for r in profiles}
    for r in profiles:
        for c in profiles[r]["_children"]:
            if c in par:
                par[c].add(r)
    for r, ps in EXTRA_PARENTS.items():
        par[r] |= set(ps)
    for a, b in EXTRA_SPOUSES:
        if a in sp and b in sp:
            sp[a].add(b); sp[b].add(a)
    for r in list(sp):
        for s in list(sp[r]):
            if s in sp:
                sp[s].add(r)
            else:
                sp[r].discard(s)
    # the 0557 file is a copy of 0556: none of its links or fields are hers
    par["0557"] = set()
    # a child's two parents are partners
    for r in profiles:
        ps = sorted(par[r])
        if len(ps) == 2:
            sp[ps[0]].add(ps[1]); sp[ps[1]].add(ps[0])
    for r in profiles:
        # parents never double as spouses, and no one is their own relative
        sp[r] -= par[r] | {r}
        par[r].discard(r)
        if len(par[r]) > 2:
            print("too many parents", r, par[r])
    for r, p in profiles.items():
        p["parents"] = sorted(par[r])
        p["spouses"] = sorted(sp[r])
        for k in ("_parents", "_spouses", "_children"):
            del p[k]
        notes = {s: n for (a, s), n in LINK_NOTES.items() if a == r}
        notes.update({a: n for (a, s), n in LINK_NOTES.items() if s == r})
        if notes:
            p["linkNotes"] = notes

    # ---------- branches ----------
    kids = collections.defaultdict(list)
    for r, p in profiles.items():
        for x in p["parents"]:
            kids[x].append(r)
    def desc(root):
        out, st = set(), [root]
        while st:
            x = st.pop()
            if x in out:
                continue
            out.add(x)
            st += kids[x]
        return out
    BR = [
        ("first", "The first generations in Ireland", "0501", "James Somerville “the Planter”, of Tullykelter Castle, Co. Fermanagh (d. 1642), identified in family tradition as the first Somerville to come to Ireland, and his descendants in Fermanagh and Dublin down to Sir James Somerville, Lord Mayor of Dublin and 1st Baronet (d. 1748), and his brothers and sisters."),
        ("senior", "The senior line: the baronets and the Lords Athlumney", "0535", "Sir Quaile Somerville, 2nd Baronet, and his descendants: the baronets of Brownstown and Somerville, Co. Meath, and the Lords Athlumney, the last of whom died in 1929."),
        ("dublin", "Sir James's other children", "0545", "Sir James's younger children: Thomas, who died young, James Somerville of Peter Street, Dublin, and his children, and Sir James's daughters and their husbands."),
        ("ardrass", "Major William of Ardrass and Captain William", "0541", "Major William Somerville of Ardrass, Co. Kildare (d. 1780), his two wives and his daughters; his only son, Captain William Somerville (1776–1844), the diarist, and Eliza Bellingham; and their children, except the two branches shown separately."),
        ("america", "Corry Somerville's North American descendants", "0586", "Corry Somerville (1806–1879), who emigrated in 1834, Lucinda Simonton, and their children and their families in New York, Ontario, Ohio and Kentucky."),
        ("clermont", "Tenison Alan Somerville's descendants: the Clermont line", "0591", "Tenison Alan Somerville (1815–1895) of Trinidad and Dublin, Cecilia Eliza O'Connor, their children, and the family of Bellingham Arthur Somerville of Clermont, Co. Wicklow, down to the present generation. This is Grandpa's own line."),
    ]
    branch_of = {}
    sets = {b[0]: desc(b[2]) for b in BR}
    for r in profiles:
        if r in sets["clermont"]: b = "clermont"
        elif r in sets["america"]: b = "america"
        elif r in sets["ardrass"]: b = "ardrass"
        elif r in sets["senior"]: b = "senior"
        elif r in desc("0525") - {"0525"} and r not in sets["senior"] and r not in sets["ardrass"]: b = "dublin"
        elif r in sets["first"]: b = "first"
        else: b = None
        branch_of[r] = b
    # in-laws take the branch of their spouse, then of their child
    for _ in range(3):
        for r, p in profiles.items():
            if branch_of[r]:
                continue
            for s in p["spouses"]:
                if branch_of.get(s):
                    branch_of[r] = branch_of[s]; break
            else:
                for c in kids[r]:
                    if branch_of.get(c):
                        branch_of[r] = branch_of[c]; break
    # the doubtful James Richard and his family were filed with the senior line
    for r in desc("0603") | {"0604", "0605", "0654", "0658"}:
        branch_of[r] = "senior"
    for r, p in profiles.items():
        p["branch"] = branch_of[r] or "first"

    branches = [{"id": b, "title": t, "head": h, "desc": dsc, "count": sum(1 for p in profiles.values() if p["branch"] == b)} for b, t, h, dsc in BR]

    out = {"branches": branches, "profiles": [profiles[r] for r in sorted(order, key=lambda x: (x[:4], x[4:]))]}
    missing = set(REDACT) - seen
    if missing:
        sys.exit(f"✗ withheld passages not found: {sorted(missing)}")
    for p in out["profiles"]:
        if not p["parents"] and not p["spouses"] and not kids[p["id"]]:
            print(f"  note: {p['id']} {p['name']} has no family links")
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--check", action="store_true", help="compare with data/genealogy.json without writing it")
    args = ap.parse_args()
    if not shutil.which("soffice"):
        sys.exit("✗ LibreOffice (soffice) is needed to read the .doc files")
    with tempfile.TemporaryDirectory() as tmp:
        out = build(convert(tmp))
    text = json.dumps(out, indent=1, ensure_ascii=False)
    counts = f"{len(out['profiles'])} profiles; {dict(collections.Counter(p['branch'] for p in out['profiles']))}; {dict(collections.Counter(p['privacy'] for p in out['profiles']))}"
    if args.check:
        same = os.path.exists(OUT) and open(OUT, encoding="utf-8").read() == text
        print(("✓ data/genealogy.json is up to date: " if same else "✗ data/genealogy.json differs from the profiles: ") + counts)
        sys.exit(0 if same else 1)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"✓ Wrote data/genealogy.json: {counts}. Now run node scripts/build.mjs.")


if __name__ == "__main__":
    main()
