# The Somerville Family Archive

An interactive, interconnected family-history archive built from a recorded conversation in which Grandpa (born 1937) told a grandchild what he knows about the Somerville family. Two independent speech-to-text transcripts of the same recording survive. **Both are published complete, exactly as received**, including the everyday conversation around the history; the archive cites both and lets you compare them side by side. It turns those imperfect transcripts into something future generations can explore, check and extend:

- **Story**: an 11-chapter historical narrative, from the 1748 baronetcy to the sale of Clermont, with family testimony, our interpretations and published history visibly distinguished.
- **Family tree**: an interactive SVG chart (pan, zoom, pinch, collapse branches, click for details) of the Somervilles and related families (Bellingham, Clinch, Johnson, Truell, O'Connor and others), with the narrator's line of descent highlighted, plus an accessible outline view.
- **People**: 85 profiles, including a few placeholders for people known to exist but not named. Each gives aliases, the ways the transcript misspelled the name, relationship to the narrator, family links, a fact table with evidence labels, and every supporting transcript passage.
- **Places**: 64 places on a map (Leaflet/OpenStreetMap), from Cumry and Castle Bellingham to Trinidad, Archangel and Nanyuki.
- **Timeline**: 79 events, with family events and wider history side by side, grouped by era.
- **Glossary**: 66 terms covering RIC ranks, militia, dormant titles, expressions, surnames and nicknames.
- **Open questions**: 43 documented ambiguities and contradictions, each with alternatives and next research steps.
- **Transcripts**: both versions of the conversation (A, the original working transcript; B, the companion), with 283 inline "readings" of misheard words (e.g. *"Whitflow"* → Wicklow, *"badayos"* → Badajoz, *"Green desert"* → Reendesert), each with a confidence level and, where useful, a note on how the other transcript heard it. Chips show which entries cite each passage, and every paragraph links to its parallel in the other transcript.
- **Compare**: transcripts A and B side by side, paragraph by paragraph (`#/compare`), so any reading can be checked against both.
- **Sources**: 62 external sources, each marked as read directly, partly read, or known only from a search result, with the date checked.
- **Search**: one search box over everything, including transcript misspellings and near-misses (try *bellendrum*, *Bunt*, *Tete*, *Whitflow*, *Gualter*).

## Running it

There is no build step needed to view it. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8765      # then visit http://localhost:8765
```

Everything except the map tiles and web fonts works offline. It can also be published as-is with GitHub Pages (the family has decided that the whole archive is public; see *A complete public archive* below).

## The two transcripts

| | Transcript A (original) | Transcript B (companion) |
|---|---|---|
| File received | `27 Oct at 16-17.txt` | `+353 85 ••• •••• - 2026-10-27 19.50.34.txt` (phone number in the file name masked) |
| Published file (complete) | `transcripts/interview-01.txt` | `transcripts/interview-01-companion.txt` |
| Cited as | `¶n` | `B¶n` |
| Paragraphs | 304 (lines 1–607, every other line) | 243 |

They are two machine transcriptions of one recording, not two interviews: B is often cleaner on names (*Fighting Atty*, *Louth Militia*, *Bell Turbot* → Belturbet, *Henry Rook*, *Vere*), A sometimes keeps words B drops, and both garble some names the same way (for example *Tennyson*, the default spelling, which is no evidence for how the family spelled Tenison). No audio was available, so where they disagree both readings are kept and graded. `scripts/align.py` aligns them word by word into `transcripts/alignment.json` (293 aligned blocks), which drives the compare view, the parallel links and the citation popovers. The archive was first built from A, and A's paragraph numbers are unchanged.

## How the evidence is labelled

| Label | Meaning |
|---|---|
| ❝ **Testimony** | Said in the recording (Grandpa's memory, often of documents he read long ago) |
| ◇ **Interpretation** | Our reading: resolving a misheard word, merging references, inferring a relationship or date |
| ▤ **Published record** | From an external source, with a numbered citation |
| ⚑ **Conflict** | The recording and published sources disagree; both are kept |

Each label also carries a high, medium or low confidence level. `¶n` links go to paragraph *n* of transcript A and `B¶n` to paragraph *n* of transcript B, numbered by line of each original file. `[n]` links go to external source *n*. Facts taken from compiled genealogies (for example the Winters family pages) are labelled as published records but described as compiled, secondary evidence, not as original registers.

## Project layout

```
index.html                  the single-page app shell
assets/css/app.css          styles (light and dark themes, responsive)
assets/js/core.js           indexes, markup renderer, relationships, search
assets/js/tree.js           family-tree layout and interaction
assets/js/views.js          page views
assets/js/app.js            router, header search, popovers, theme
assets/js/archive-data.js   GENERATED bundle of data + transcript (do not edit)
data/people.json            people: parents, spouses, dates, facts, biography
data/places.json            places: coordinates, identification, description
data/events.json            chronology (family and wider-history events)
data/glossary.json          terms, surnames, nicknames, expressions
data/sources.json           external sources (numbered in the order listed)
data/questions.json         unresolved questions and research leads
data/readings.json          interpretations of misheard phrases in the transcript
data/narrative.json         story chapters
transcripts/transcripts.json  transcript manifest (id, role, file, sha256 of the original, aside ranges)
transcripts/interview-01.txt            transcript A, complete, byte-for-byte as received
transcripts/interview-01-companion.txt  transcript B, complete, byte-for-byte as received
transcripts/alignment.json  GENERATED A↔B paragraph alignment
scripts/build.mjs           validator + bundler (+ quotation checker)
scripts/align.py            regenerates the A↔B alignment
scripts/repo-check.mjs      final check: no credentials, transcripts complete and fully bundled
tests/smoke.cjs             headless browser smoke test (Playwright)
```

### Editing and adding material

1. Edit the JSON in `data/`. Text fields support a small markup:
   - `{p:person-id}` or `{p:person-id|label}` for a person link; likewise `{pl:…}` place, `{t:…}` glossary term, `{e:…}` event, `{qn:…}` open question, `{ch:…}` chapter
   - `{q:142-150}` cites paragraphs of transcript A; `{q:T2:10}` cites transcript B
   - `{s:source-id}` cites an external source. Each source has `access` (`direct` | `partial` | `search-only`) and a `checked` date; say in `used` exactly what the source supports.
   - start a paragraph with `{ctx}` (wider history), `{int}` (our interpretation) or `{sensitive}` (handle with discretion) to style it as a labelled box. Used mid-paragraph, the same markers produce an inline labelled note.
2. Facts take `status` (`testimony` | `inferred` | `record` | `conflict`), `conf` (`high` | `medium` | `low`), `cite` (transcript paragraphs) and `src` (source ids).
3. Run `node scripts/build.mjs`. It checks every cross-reference, citation, parent link and transcript reading, refuses to write the bundle if anything is broken, and otherwise regenerates `assets/js/archive-data.js`. It also checks that quoted words appear in the paragraphs cited for them (or their parallels in the other transcript); `node scripts/build.mjs --check --quotes` lists every doubtful quotation. Then run `node scripts/repo-check.mjs` (see below). CI (`.github/workflows/validate.yml`) runs the same checks and fails if the committed bundle is stale.

**Adding a new recording:** put the transcript file, unchanged, in `transcripts/`, add an entry to `transcripts/transcripts.json` with a new id (`T3`, …), its `file`, its `sha256` (`sha256sum transcripts/<file>`) and any `asides` ranges, and cite it as `{q:T3:15}`. Mark off-topic conversation as asides rather than removing it. If it is another transcript of an existing recording, extend `scripts/align.py`. Paragraph numbers are always line numbers of the file, so never re-wrap a transcript after citing it. If a transcript file is ever corrected deliberately, update its `sha256`; the build refuses a file that no longer matches.

## A complete public archive

**This repository is public, and so is everything in it.** The family has decided to publish the whole archive:

- Both transcripts are published in full, exactly as received: the family history and the conversation around it, including personal and domestic asides and the interviewer's recollections of their Hungarian family (recorded as an attributed, unverified story in the open questions). Nothing is redacted, and there is no separate private build.
- Everyday conversation is marked as **asides** in `transcripts/transcripts.json`. Asides are shown by default; readers can untick *Asides* on the transcript and compare pages to keep to the history. They are searchable like everything else.
- Each transcript page links to its plain-text file for download.
- The only thing not reproduced is the phone number in transcript B's file name, which is masked where the name is shown. It is not part of the transcript.
- **Youghal, 1887.** Grandpa said: *"This now is not for publication … I'll let you use your own discretion, but be careful."* The family has decided to publish it. The archive keeps his caution visible and sets out the story in three separate layers: the family's account, Hansard, and local history. It names the officer as Bellingham Arthur only as the family's identification, since the records give only "District Inspector Somerville" and "Sub-Inspector Summerville". Patrick Hanlon, who died, is treated with respect.
- Editorial choices, not exclusions: profiles of living people record only their place in the family (what they said is all in the transcripts), and some disparaging local hearsay about Rathnew is left in the transcripts rather than repeated in the narrative.

### Repository checks

`node scripts/repo-check.mjs` (also run in CI) confirms that:

1. no committed file contains credentials (API keys, access tokens, private keys, password assignments). Family history, names and anecdotes are not treated as secrets;
2. each transcript matches the sha256 of the original recorded in `transcripts/transcripts.json` and carries no redaction marker;
3. every paragraph of both transcripts appears, unaltered, in the committed bundle the site loads.

`tests/smoke.cjs` additionally opens the transcript and compare pages in a browser and checks that previously withheld passages are visible.

## Key findings from checking the testimony

Several of Grandpa's memories were confirmed, and in places sharpened, by published sources:

- **The Bellinghams**: a published genealogy of the Bellinghams of Castle Bellingham lists exactly the family he described: Elizabeth (Eliza) Bellingham (1779–1839), who married Capt. William Somerville of Ardrass on 30 Aug 1800, her sisters Dorothea and Henrietta Sophia, her brother Alan, who married the French-Canadian **Monique Bâby** (the transcripts' *Babet/Babé*; the forgotten "seaside town in the West Country" is **Lyme Regis**), and her brother **Henry Tenison Bellingham**, killed at **Badajoz on 6 April 1812**.
- **Tenison, not Tennyson**: the name comes from Eliza's mother, Elizabeth Tenison, and a compiled genealogy spells it Tenison throughout. Both transcripts write "Tennyson" because that is the default spelling of the sound.
- **The dormant baronetcy**: the 2nd Baron Athlumney died on **8 January 1929**, exactly as remembered. "Cousin Sir William" was **Sir William Meredyth Somerville**, Chief Secretary for Ireland 1847–52.
- **Youghal, 1887**: Hansard (24 March 1887) records the inquest verdict of wilful murder against "District Inspector Somerville and Constable Ward" after the death of fisherman **Patrick Hanlon** on 8 March 1887. On 10 May the government said "Sub-Inspector Summerville and Constable Ward" would return to duty because the Attorney General saw no grounds to prosecute. That matches the narrator's careful "never formally acquitted" (clearest in transcript B) better than the local history's "eventually acquitted".
- **Archangel**: "Lt. Col. W A T B Somerville DSO" (Uncle Bunt's initials) commanded the 8th (Special) Battalion, Machine Gun Corps, from April 1919. But that history calls him Royal Artillery, and a compiled genealogy gives the RA and the DSO to his brother Jim, so this is kept as a conflict.
- **Clermont**: heritage records credit the 1894 wings to "B A Somerville" (Bellingham Arthur).

### Corrections made in the audit against transcript B (October 2026)

- **"Fighting Atty"** (Atty = Arthur) was Bellingham Arthur's boyhood name (B¶12). RIC garbles such as "the right Irish Construction" and "Royal Irish Conservatory" are recorded as readings; the RUC appears only as the later Northern force (new glossary entry).
- **Uncle Pat was Gualter Hugh Roger Bellingham Somerville.** The archive had wrongly said that the Gualter Somerville in published records was a different man. "Pat", "Paddy" and "Patrick" are kept as the names the family used.
- **Vere** (Vere Frances de Merlie Somerville) is the daughter who married Edmund Truell of Clonmannon in 1912; A's "there to money" was her name.
- **Henry Rook** (B; A has "Rock"/"Oak") was Bellingham Arthur's solicitor and Cecilia's husband, not her father. Both transcripts break the sentence in a way that reads "her father", which is kept as a transcription problem, not a fact.
- **"Green desert"** near Bantry is **Reendesert**, Bunt's home. **"Bell Turbot"** is Belturbet, Co. Cavan (the house "Farm" itself is still unlocated). **Clonmel** and the **Louth Militia** are confirmed by B.
- **Eddie / Teddy / Tettie** and **Maudie Moore** are kept as variants; Maudie's "Greystokes" may be Greystones (a reading, not a fact).
- **The eighth son**: a compiled genealogy gives an infant Tenison (1812) who lived twelve days; recorded as probable.
- **Bellingham Arthur's birth**: "I think it was 1856" against 17 Nov 1853 in a compiled genealogy; kept as a conflict. His death in January 1916 cannot have been the 1918 Spanish flu, as the narrator himself suspected.
- **Corry/Corrie**, **Brakey/Breakey**, **Ardras/Ardrass**, **Cumry** (spelled out C-U-M-R-Y), **Leinster/Livingston Avenue**, **Nanyuki**, **Claremont/Clermont** and the Wicklow/Arklow posting are all now cited from both transcripts, and their variants are searchable.
- **The sale of Clermont**: "about 1950 … 2.53" is kept as a garbled fragment ("'52, '53"?), not a date.
- The new quotation checker, which tests every quotation against the paragraphs cited for it, found two quotations with no supporting citation; both were fixed.

### Source checks

Every external source was re-checked against the specific claim it supports, and its `used` note was rewritten to say exactly that. 50 sources were read directly, one only partly (a *London Gazette* page), and 11 are known only from search results, because their sites block automated access: the three Wicklow Heritage pages, Agriland, Landed Estates, the NLI catalogue, IWM Lives of the First World War, the Great War Forum, TheGenealogist, a Clarke article and a Dublin street site. These are marked "search result only" on the Sources page and should be read by a person before being relied on. The Clarke article is based on interviews with the narrator, so it is not independent corroboration of his account. New sources include the Hansard reply of 10 May 1887 and four pages of a compiled genealogy, which are treated as secondary.

## Unresolved questions (summary)

The full list (43, of which 2 are resolved and 15 partly resolved), with readings and next steps, is on the site's **Open questions** page (`data/questions.json`). The most important are:

1. **Parentage and marriages.** Did Archibald James marry Elizabeth Breakey (Brakey), and was "little Archie" (b. 1823) their son? A compiled genealogy instead records his marriage to an Elizabeth Crawford in 1836; whether she is the same woman is unknown. Whose servant was Elizabeth Brakey? Is "for 19 years" the family's time in Monaghan or Archibald's age?
2. **The dormant baronetcy.** The archive does not assess any claim. Open points include surviving male heirs of the senior line, Major William's parentage and the lawfulness of Archibald James's marriage.
3. Is the 1887 "District Inspector Somerville" documentably Bellingham Arthur? The match is strong but rests on the family story.
4. Bellingham Arthur's birth (1853 or 1856) and his cause of death in 1916; Tenison Alan's death (c. 1890 or 1895) and Dublin address.
5. Bunt and Jim: who commanded at Archangel, and in which regiment; Pat's capture, camps and Military Cross; "Gunners Venture" and the location of Reginald's Kenya farm.
6. Unidentified places: Cumry (Co. Monaghan), the house "Farm" near Belturbet, Jim's burial place.
7. Rachel Clinch: Margaret's sister or her mother? Maudie Moore's origin. The Johnson ancestry, which comes only from an unverified online tree.
8. Where are the original papers now? (Bellingham Arthur's six volumes, Captain William's diary transcripts, the Nelson letters, portraits, Pat's camp photographs.) An inventory with scans is the most valuable next step.

## Limitations

- Both transcripts are automatic speech-to-text with no speaker labels, and no audio was available to settle disagreements. Some passages are unrecoverable in both, and every reading of a garbled word is an interpretation (all are shown and graded).
- Most family details rest on one person's memory and have not yet been checked against civil or church registers, RIC service records or wills. External research so far covers the points cited on the Sources page.
- Map positions marked "approximate" are best guesses; Cumry and "Farm" are placed at their nearest identified towns.
- The tree uses a simple layout that is wide rather than compact; the outline view is easier on small screens.
- The recording is dated 27 October 2026 from transcript B's file name.
