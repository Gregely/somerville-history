# The Somerville Family Archive

An interactive, interconnected family-history archive built from a recorded conversation in which Grandpa (born 1937) told a grandchild what he knows about the Somerville family. It turns an imperfect speech-to-text transcript into something future generations can explore, check and extend:

- **Story**: an 11-chapter historical narrative, from the 1748 baronetcy to the sale of Clermont, with family testimony, our interpretations and published history visibly distinguished.
- **Family tree**: an interactive SVG chart (pan, zoom, pinch, collapse branches, click for details) of the Somervilles and five related families (Bellingham, Clinch, Johnson, Truell, O'Connor), with the narrator's line of descent highlighted, plus an accessible outline view.
- **People**: 75 profiles (68 named people and 7 placeholders for people known to exist but not named). Each gives aliases, the ways the transcript misspelled the name, relationship to the narrator, family links, a fact table with evidence labels, and every supporting transcript passage.
- **Places**: 58 places on a map (Leaflet/OpenStreetMap), from Cumry and Castle Bellingham to Trinidad, Archangel and Nanyuki.
- **Timeline**: 63 events, with family events and wider history side by side, grouped by era.
- **Glossary**: 65 terms covering RIC ranks, militia, dormant titles, expressions, surnames and nicknames.
- **Open questions**: 32 documented ambiguities and contradictions, each with alternatives and next research steps.
- **Transcript**: the conversation itself, with 179 inline "readings" of misheard words (e.g. *"Whitflow"* → Wicklow, *"badayos"* → Badajoz), each with a confidence level, and chips showing which entries cite each passage.
- **Search**: one search box over everything, including transcript misspellings and near-misses (try *bellendrum*, *Bunt*, *Tete*, *Whitflow*).

## Running it

There is no build step needed to view it. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8765      # then visit http://localhost:8765
```

Everything except the map tiles and web fonts works offline. It can also be published as-is with GitHub Pages (see *Privacy* below before doing so).

## How the evidence is labelled

| Label | Meaning |
|---|---|
| ❝ **Testimony** | Said in the recording (Grandpa's memory, often of documents he read long ago) |
| ◇ **Interpretation** | Our reading: resolving a misheard word, merging references, inferring a relationship or date |
| ▤ **Published record** | From an external source, with a numbered citation |
| ⚑ **Conflict** | The recording and published sources disagree; both are kept |

Each label also carries a high, medium or low confidence level. `¶n` links go to paragraph *n* of the transcript, numbered by line of the original file. `[n]` links go to external source *n*.

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
transcripts/transcripts.json  transcript manifest (id, files, aside ranges)
transcripts/interview-01.txt  public copy of the transcript (see Privacy)
transcripts/private/        the unredacted original (git-ignored, never committed)
scripts/build.mjs           validator + bundler
scripts/redact.py           produces the public transcript from the original
tests/smoke.cjs             headless browser smoke test (Playwright)
```

### Editing and adding material

1. Edit the JSON in `data/`. Text fields support a small markup:
   - `{p:person-id}` or `{p:person-id|label}` for a person link; likewise `{pl:…}` place, `{t:…}` glossary term, `{e:…}` event, `{qn:…}` open question, `{ch:…}` chapter
   - `{q:142-150}` cites transcript paragraphs (`{q:T2:10}` for a second transcript)
   - `{s:source-id}` cites an external source
   - start a paragraph with `{ctx}` (wider history), `{int}` (our interpretation) or `{sensitive}` (handle with discretion) to style it as a labelled box. Used mid-paragraph, the same markers produce an inline labelled note.
2. Facts take `status` (`testimony` | `inferred` | `record` | `conflict`), `conf` (`high` | `medium` | `low`), `cite` (transcript paragraphs) and `src` (source ids).
3. Run `node scripts/build.mjs`. It checks every cross-reference, citation, parent link and transcript reading, refuses to write the bundle if anything is broken, and otherwise regenerates `assets/js/archive-data.js`. CI (`.github/workflows/validate.yml`) runs the same check and fails if the committed bundle is stale.

**Adding a new recording:** put the text file in `transcripts/` (and any unredacted original in `transcripts/private/`), add an entry to `transcripts/transcripts.json` with a new id (`T2`, …), and cite it as `{q:T2:15}`. Paragraph numbers are always line numbers of the file, so never re-wrap a transcript after citing it.

## Privacy and discretion

**This repository is public.** Decisions taken:

- The committed transcript (`transcripts/interview-01.txt`) leaves out 30 passages that are personal, domestic or about third parties. Each is replaced by a marker so line numbers are unchanged. **No family-history content was removed.** `scripts/redact.py` lists exactly what was withheld and why. The original is in `transcripts/private/` and is git-ignored. `node scripts/build.mjs --private` builds a complete local copy into `private-build/` (also git-ignored) for family use.
- Living people (the narrator, the interviewer, relatives named in passing) get no personal details. The half-sister born in 1932 is treated as possibly living.
- Grandpa said of the 1887 Youghal story: *"This now is not for publication … I'll let you use your own discretion, but be careful."* Because the events are in Hansard and local histories, the archive includes them, with his caution displayed and the dead man, Patrick Hanlon, treated with respect. **If the family prefers, remove `ev-youghal-1887`, the relevant paragraphs in `bellingham-arthur-somerville` and the `district-inspector` chapter before publishing, or make the repository private.**
- Some disparaging local hearsay in the transcript (about Rathnew) is preserved verbatim in the transcript but not repeated elsewhere.

## Key findings from checking the testimony

Several of Grandpa's memories were confirmed, and in places sharpened, by published sources:

- **The Bellinghams**: a published genealogy of the Bellinghams of Castle Bellingham lists exactly the family he described: Elizabeth (Eliza) Bellingham (1779–1839), who married Capt. William Somerville of Ardrass on 30 Aug 1800, her sisters Dorothea and Henrietta Sophia, her brother Alan, who married the French-Canadian **Monique Bâby** (the forgotten "seaside town in the West Country" is **Lyme Regis**), and her brother **Henry Tenison Bellingham**, killed at **Badajoz on 6 April 1812**.
- **"Tennyson Allen" is almost certainly *Tenison Alan***: the name comes from Eliza's mother, Elizabeth Tenison.
- **The dormant baronetcy**: the 2nd Baron Athlumney died on **8 January 1929**, exactly as remembered. "Cousin Sir William" was **Sir William Meredyth Somerville**, Chief Secretary for Ireland 1847–52.
- **Youghal, 1887**: Hansard (24 March 1887) records the inquest verdict of wilful murder against "District Inspector Somerville and Constable Ward" after the death of fisherman **Patrick Hanlon** on 8 March 1887; the Crown later dropped the case.
- **Archangel**: "Lt. Col. W A T B Somerville DSO" (Uncle Bunt's initials) commanded the 8th (Special) Battalion, Machine Gun Corps, from April 1919; it landed at Archangel on 26 May 1919.
- **Clermont**: heritage records credit the 1894 wings to "B A Somerville" (Bellingham Arthur).

## Unresolved questions (summary)

The full list, with readings and next steps, is on the site's **Open questions** page (`data/questions.json`). The most important are:

1. Did Archibald James marry Elizabeth Breakey, and was "little Archie" (b. 1823) their son? This bears on the dormant baronetcy.
2. Is the 1887 "District Inspector Somerville" documentably Bellingham Arthur? (The match is strong but rests on the family story.)
3. Where are the original papers now? (Bellingham Arthur's six volumes, Captain William's diary transcripts, the Nelson letters, portraits, Pat's camp photographs.) An inventory with scans is the most valuable next step.
4. The eighth son of Captain William and Eliza; the other children of Tenison Alan; the first name of the daughter who married Edmund Truell.
5. Bunt's regiment (King's Own vs Royal Artillery); Pat's capture, camps and Military Cross; "Gunners Venture" in Kenya.
6. Unidentified places: Cumry (Co. Monaghan), "Farm" (near Belturbet?), "Livingston Avenue" (Rathmines), "Green desert" (near Bantry), "Matthew" (Jim's burial).
7. The Johnson ancestry, which comes only from an unverified online tree.

## Limitations

- The source is automatic speech-to-text with no speaker labels; some passages are unrecoverable, and every reading of a garbled word is an interpretation (all are shown and graded).
- Most family details rest on one person's memory and have not yet been checked against civil or church registers, RIC service records or wills. External research so far covers the points cited on the Sources page.
- Some external sources (heritage websites) were consulted via search summaries because they block automated access; they are flagged as such in `data/sources.json`.
- Map positions marked "approximate" are best guesses; Cumry and "Farm" are placed at their nearest identified towns.
- The tree uses a simple layout that is wide rather than compact; the outline view is easier on small screens.
- The year of the recording is inferred (probably 2026).
