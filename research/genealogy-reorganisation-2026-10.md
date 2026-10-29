# Reorganising the archive into two parts (October 2026)

The archive is now in two separate parts:

1. **My Grandfather's Account**, the original oral-history project.
2. **Extended Somerville Family Genealogy**, supplementary research built from the compiled family profiles in `research/David Gilmour amended records`.

This note records how existing material was classified, what the profiles are, and the editorial decisions taken in building part two.

## 1. Classification of the existing material

Everything that existed before this change belongs to **part one**. It was built from the recordings, or from the sources used to explain and check them. It keeps its URLs, data files and safeguards unchanged.

| Item | Part | Notes |
|---|---|---|
| Transcripts A, B, C; readings; A/B alignment and comparison | Account | Unchanged. Checksums, the masked PIN and the completeness checks still apply. |
| Story (12 chapters) | Account | Unchanged. |
| People (106), places, timeline, glossary, account tree | Account | Unchanged. 11 people who are never cited from or named in the transcripts are now flagged *not in the recordings*. |
| Open questions, Incorrect information | Account | Unchanged. Incorrect information still requires documentary evidence against his words; the genealogy is not used to "correct" him. |
| Sources and method (97 sources) | Account | The entry `fam-profiles` (the narrator's written profiles, shown on screen at C¶150–167) now points to the profile files and to part two. |
| `research/evidence-audit-2026-10.*`, `research/transcript-c-review-2026-10.*` | Account | Research on the account. |
| `research/David Gilmour amended records/` | Genealogy | Source files of part two, kept as received. |
| Home, search, about | Both | Present both parts. Search results are grouped by part. |

The account's own record of a person was **not merged** with the compiled profile of the same person. Each keeps its own claims and sources. The 65 people who appear in both are linked by `archive` in `data/genealogy.json`. The links are shown with labelled cards in both directions, with both collections' dates side by side.

Nothing Grandpa said was changed, including where the profiles disagree with him. One example: the account still treats his sister Juanita as possibly living, which is the archive's caution and not something he said, while her profile records her death in 2007. The disagreement is listed instead.

## 2. The profiles

The folder holds three groups of profiles:

| Group | Count | Content |
|---|---|---|
| Tranche 1 | 81 Word files | Major William's descendants: records 0563–0597, 0613–0634B and 0659–0696 |
| Tranche 2 | 118 Word files | The senior line and the early generations: records 0501–0581 and 0598–0658 |
| `Wendy/` | 1 file | A second profile of Lucinda Simonton |

The folder also holds older versions and other material:

- **Earlier copies.** `Section 1–6.rar` and `Further Amendments.zip` contain earlier copies of the Tranche 1 profiles. Each loose file is the same as, or longer than, its packed copy, so the loose files were used.
- **Pictures.** `Pictures/` holds 53 unlabelled photographs (2022), which are not published.

The profiles are probably the ones Grandpa showed in the second recording, "the ones as amended" (C¶167). He began them for David Gilmour (C¶152), a cousin, and some sections are headed "Further research by David Gilmour". The profiles name other contributors too:

- Wendy Stevenson;
- W. M. Stevenson;
- correspondents such as Janet Friend;
- Cecil B. Rooke and Reginald Somerville, behind the *Somerville Index* pedigree.

**Tracked changes** in the Word files show who amended what:

| Recorded author | Date | Extent | Interpretation |
|---|---|---|---|
| "William Somerville" | 2021–22 | 221 inserted passages in the published profiles | Taken to be Grandpa, consistent with C¶167 |
| "7" | 2011–12 | 1,146 | Not identified |

Red text is applied inconsistently, so it is not used to attribute anything.

## 3. Editorial decisions in part two

- **Provenance on every page.** Every genealogy page carries the part's banner. Every profile names its file and tranche and states that it is not from the recordings.
- **Text kept as written.** Profile text is kept as written, including slips. Only whitespace is tidied, and pictures are marked, not reproduced.
- **Labelled sources.** Information is labelled by source:
  - the compiled profile;
  - Grandpa's tracked amendments;
  - the 2011–12 revisions;
  - others' research and letters;
  - tradition;
  - archive notes, which are ours.
- **Family links.** Links are read from each profile's opening lines and marriage entries, matched by name as well as record number, because 20 files carry a different number in their "Record No." line. A few links stated only by name were added by hand. The import script lists all of these.
- **Doubtful or defective records.** These are shown with archive notes, not silently fixed:
  - James Richard (0603) is said to be a son of Captain William and Eliza. That is hard to reconcile with their other sons' births, so the link is drawn dotted.
  - 0557 is a copy of her husband's profile.
  - 0629 and 0697 are missing.
  - Two husbands' names and numbers are crossed (0609–0612).
- **Disagreements.** 15 disagreements are listed in `data/genealogy-differences.json`, with both versions, what each rests on, and what would settle them. A compiled pedigree is not treated as authoritative because it is more detailed.

## 4. Privacy

| Group | What is shown |
|---|---|
| Living people (10) | Name and family links only |
| People born after 1910 who have died (5) | Name, years and family links only, because their profiles describe living relatives |
| Other profiles | 27 paragraphs giving living people's dates, addresses or children are replaced by a visible marker; e-mail addresses are removed |
| Photographs | Not published |

`scripts/build.mjs` and `scripts/repo-check.mjs` enforce these rules. `tests/smoke.cjs` checks a sample of pages in the browser.

**The original Word files are in the public repository as received.** They include living people's full details: dates and places of birth, addresses, careers and marriages. The website does not reproduce these details, but the files themselves are public on GitHub and in the repository's history. Removing them from the history would mean rewriting it, which has not been done.

## 5. Regenerating

Run:

```sh
python3 scripts/import-genealogy.py
node scripts/build.mjs
```

The import script needs LibreOffice. Its `--check` option reports whether `data/genealogy.json` is up to date.

Each privacy omission is pinned to a fingerprint of its paragraph, so if a profile is edited, the import stops until that passage has been reviewed again.
