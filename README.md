# The Somerville Family Archive

An interactive, interconnected family-history archive built from a recorded conversation in which Grandpa, **William Somerville** (born 1937), told his grandson **Gergely Somerville** what he knows about the Somerville family. Two independent speech-to-text transcripts of the same recording survive. **Both are published complete, exactly as received**, including the everyday conversation around the history; the archive cites both and lets you compare them side by side. It turns those imperfect transcripts into something future generations can explore, check and extend:

- **Story**: an 11-chapter historical narrative, from the 1748 baronetcy to the sale of Clermont, with family testimony, our interpretations and published history visibly distinguished.
- **Family tree**: an interactive SVG chart (pan, zoom, pinch, collapse branches, click for details) of the Somervilles and related families (Bellingham, Clinch, Johnson, Truell, O'Connor and others), with the narrator's line of descent highlighted, plus an accessible outline view.
- **People**: 89 profiles, including the narrator's own immediate family, including a few placeholders for people known to exist but not named. Each gives aliases, the ways the transcript misspelled the name, relationship to the narrator, family links, a fact table with evidence labels, and every supporting transcript passage.
- **Places**: 64 places on a map (Leaflet/OpenStreetMap), from Cumry and Castle Bellingham to Trinidad, Archangel and Nanyuki.
- **Timeline**: 86 events, with family events and wider history side by side, grouped by era.
- **Glossary**: 66 terms covering RIC ranks, militia, dormant titles, expressions, surnames and nicknames.
- **Open questions**: a register of 43 ambiguities and contradictions (13 resolved, 13 partly resolved, 17 open), each with the evidence, the reasoning and the next research steps.
- **Transcripts**: both versions of the conversation (A, the original working transcript; B, the companion), with 283 inline "readings" of misheard words (e.g. *"Whitflow"* → Wicklow, *"badayos"* → Badajoz, *"Green desert"* → Reendesert), each with a confidence level and, where useful, a note on how the other transcript heard it. Chips show which entries cite each passage, and every paragraph links to its parallel in the other transcript.
- **Compare**: transcripts A and B side by side, paragraph by paragraph (`#/compare`), so any reading can be checked against both.
- **Sources**: 72 sources, including the family's private Ancestry tree (cited, never published), each marked as read directly, partly read, or known only from a search result, with the date checked.
- **Incorrect information**: a separate tab (`#/corrections`) listing the 10 places where Grandpa's testimony is contradicted by stronger documentary evidence. Each entry shows his words with transcript references, the best-supported conclusion, why they differ, and the evidence: primary or secondary, with links, and whether it was read directly. It corrects the factual claim, not the record of what he said, and marks entries as *Corrected* (3) or *Probably incorrect* (7).
- **Search**: one search box over everything, including transcript misspellings and near-misses (try *bellendrum*, *Bunt*, *Tete*, *Whitflow*, *Gualter*).

## Running it

There is no build step needed to view it. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8765      # then visit http://localhost:8765
```

Everything except the map tiles and web fonts works offline. It can also be published as-is with GitHub Pages (the family has decided that the whole archive is public; see *A complete public archive* below).


### Android app

`scripts/build-apk.sh` packages the whole archive as an Android app (`dist/somerville-archive-<version>.apk`, about 3 MB, Android 7.0 or later). The app is a full-screen WebView over a bundled copy of the site, so it works offline: the map library (Leaflet) and the web fonts are bundled too. Only the map tiles need a connection, and links to external sources open in the phone's browser. The Back button moves through the archive's pages, and the app follows the phone's light or dark mode.

- **Build requirements:** JDK 17+, Node, and the Android SDK (`platforms;android-34`, `build-tools;34.0.0`) at `$ANDROID_HOME` (default `/opt/android-sdk`). No Gradle is needed.
- **Source:** `android/` holds the manifest, two small Java classes and the launcher icons. Build output goes to `android/build/` and `dist/`; both are git-ignored.
- **Signing:** the APK is signed with `android/release.keystore` (git-ignored; created on first build, or set `APK_KEYSTORE` / `APK_KEYPASS`). Keep that file. Android installs an update over an existing copy only if it is signed with the same key; otherwise uninstall the old app first.
- **Installing:** copy the APK to the phone and open it. Android will ask you to allow installs from that source (the app is not on Google Play).
- **Versions:** bump `android:versionCode` and `android:versionName` in `android/AndroidManifest.xml` for each new release.

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
| ⚑ **Conflict** | The recording and published sources disagree and the evidence is not decisive; both are kept |
| ✎ **Family information** | Supplied by the family in 2026, including its Ancestry tree; not said in the recording and not independently verified (e.g. the names of the narrator's children, dates taken from the tree) |

**When records contradict the narrator.** Where a primary record or well-supported published research contradicts Grandpa's recollection, the archive's conclusion follows the documentary evidence, and his own words are shown beside it as *❝ Narrator's account*, with the source and the reasoning in a note. His testimony is never silently replaced; the transcripts remain the primary source for what he said. In the data this is the optional `narrator` field on a fact or a birth or death date.

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
data/corrections.json       "Incorrect information": testimony contradicted by stronger evidence
transcripts/transcripts.json  transcript manifest (id, role, file, sha256 of the original, aside ranges)
transcripts/interview-01.txt            transcript A, complete, byte-for-byte as received
transcripts/interview-01-companion.txt  transcript B, complete, byte-for-byte as received
transcripts/alignment.json  GENERATED A↔B paragraph alignment
scripts/build.mjs           validator + bundler (+ quotation checker)
scripts/align.py            regenerates the A↔B alignment
scripts/build-apk.sh        builds the Android app (see Android app)
scripts/repo-check.mjs      final check: no credentials, transcripts complete and fully bundled
android/                    Android app shell (manifest, WebView activity, icons)
research/                   evidence-audit reports and registers (e.g. evidence-audit-2026-10.md / .csv)
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

**Adding an entry to Incorrect information** (`data/corrections.json`): include a claim only when stronger documentary evidence actually contradicts the testimony. Do not add mere uncertainties, misheard words, or claims contradicted only by the family's private tree. Each entry needs:
- `said`: his words, with `{q:…}` citations; the build checks the quotation against the cited paragraphs.
- `conclusion` and `explanation`.
- `verdict`: `corrected` | `probable`.
- `evidence`: entries of the form `{src, kind: primary | secondary | context, inspected, claim}`, where `inspected` says honestly whether the record itself was seen.

The build rejects an entry with no citation, no evidence beyond context, or only the private family tree as evidence.

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
- **Youghal, 1887**: Hansard (24 March 1887) records the inquest verdict of wilful murder against "District Inspector Somerville and Constable Ward" after the death of fisherman **Patrick Hanlon** on 8 March 1887. On 10 May the government said "Sub-Inspector Summerville and Constable Ward" would return to duty because the Attorney General saw no grounds to prosecute. That matches the narrator's careful "never formally acquitted" (clearest in transcript B) better than the local history's "eventually acquitted". The officer is identified as Bellingham Arthur (see *Final refinement* below).
- **Archangel**: "Lt. Col. W A T B Somerville DSO" (Uncle Bunt's initials) commanded the 8th (Special) Battalion, Machine Gun Corps, from April 1919, as the narrator said. That history's "(Royal Artillery)" is judged a confusion with his gunner brother Jim: Bunt was a King's Own officer, as the narrator also said.
- **Clermont**: bought in the mid-1890s from Col. Charles George Tottenham of Ballycurry (National Library of Ireland); wings added in 1894 for B. A. Somerville by Sir Thomas Drew (Dictionary of Irish Architects).

### Corrections made in the audit against transcript B (October 2026)

- **"Fighting Atty"** (Atty = Arthur) was Bellingham Arthur's boyhood name (B¶12). RIC garbles such as "the right Irish Construction" and "Royal Irish Conservatory" are recorded as readings; the RUC appears only as the later Northern force (new glossary entry).
- **Uncle Pat was Gualter Hugh Roger Bellingham Somerville.** The archive had wrongly said that the Gualter Somerville in published records was a different man. "Pat", "Paddy" and "Patrick" are kept as the names the family used.
- **Vere** (Vere Frances de Merlie Somerville) is the daughter who married Edmund Truell of Clonmannon in 1912; A's "there to money" was her name.
- **Henry Rooke** (heard as Rook in B, "Rock"/"Oak" in A) was Bellingham Arthur's solicitor and Cecilia's husband, not her father. Both transcripts break the sentence in a way that reads "her father"; this is kept as a transcription problem, not a fact. The spelling Rooke was later confirmed from the National Library's Rooke Papers.
- **"Green desert"** near Bantry is **Reendesert**, Bunt's home. **"Bell Turbot"** is Belturbet, Co. Cavan (the house "Farm" itself is still unlocated). **Clonmel** and the **Louth Militia** are confirmed by B.
- **Eddie / Teddy / Tettie** and **Maudie Moore** are kept as variants; Maudie's "Greystokes" may be Greystones (a reading, not a fact).
- **The eighth son**: a compiled genealogy gives an infant Tenison (1812) who lived twelve days; recorded as probable.
- **Bellingham Arthur's birth**: "I think it was 1856" against 17 Nov 1853 in a compiled genealogy; kept as a conflict. His death in January 1916 cannot have been the 1918 Spanish flu, as the narrator himself suspected.
- **Corry/Corrie**, **Brakey/Breakey**, **Ardras/Ardrass**, **Cumry** (spelled out C-U-M-R-Y), **Leinster/Livingston Avenue**, **Nanyuki**, **Claremont/Clermont** and the Wicklow/Arklow posting are all now cited from both transcripts, and their variants are searchable.
- **The sale of Clermont**: "about 1950 … 2.53" is kept as a garbled fragment ("'52, '53"?), not a date.
- The new quotation checker, which tests every quotation against the paragraphs cited for it, found two quotations with no supporting citation; both were fixed.

### Final refinement (October 2026)

Open questions were re-examined against primary records and well-supported published research. Resolved:

- **Youghal, 1887: District Inspector Somerville was Bellingham Arthur Somerville.** Hansard gives only the surname, under both ranks: sub-inspectors had been restyled district inspectors by the Constabulary and Police (Ireland) Act 1883. The identification combines four strands. (1) Bellingham Arthur was a serving RIC officer of that rank: he joined in 1872, aged 18, and the 1891 census describes him as a "Retired D. I. R. I. Constabulary". (2) Dr Ronayne's letter, read in the Commons, shows the officer was a "young officer, Mr. Somerville" from outside, not the local inspector, Kerin; this matches the family's detachment "from Cork". (3) The family's account, independent of Hansard, matches the inquest, arrest, Parliament and return to duty without a trial. (4) The family links the affair to his transfer to Wicklow, and his career ended by 1891. *Limitations:* no surviving document seen names him in full in connection with Youghal, and his RIC service register (HO 184) has not been examined.
- **Bellingham Arthur's birth: 17 November 1853** (baptised in Dublin in June 1854; his RIC and census ages agree), not the narrator's "1856, I think".
- **Captain William's birth: 3 March 1776** (two published genealogies agree), not "1777, I think".
- **Henry Rooke**, not Rook: a solicitor, son of Archdeacon Henry Rooke of Wicklow, who married Cecilia on 11 April 1912 and died in 1942. Cecilia, as **Cecil B. Rooke** (1880–1973), registered the Somerville pedigree at the Genealogical Office in 1955 (G.O. MS 182A). Her papers, including extracts of Somerville wills her father made before the 1922 fire, are in the National Library's Rooke Papers.
- **Bunt: King's Own (Royal Lancaster)**, the commander at Archangel. **Tenison**, not Tennyson. **Cumry** is the townland Na Comraigh in Aghnamullen parish, near Ballybay, spelled exactly as the narrator spelled it. **Reendesert Lodge** was Kitty's home with her first husband, **Alan Campbell Ferguson** (d. 1920), so she was his widow. The sale of **Castle Bellingham** was completed by Alan's widow. The **recording date** is adopted as 27 October 2026.
- Partly resolved: **Pat** was probably captured in October 1914 near Zonnebeke, with the 2nd Battalion, not "in the retreat from Mons". **Tenison Alan** died on 31 July 1895, but who died first is still open. **Gunners' Venture Ltd** existed: a 17,000-acre farm near Nanyuki owned by ex-artillery officers. A **Rachel Clinch** was Margaret's mother; a sister of that name is unconfirmed. Some of the **papers** are located: the NLI's Rooke Papers and G.O. MS 182A, and in 1998 the library noted that "the Somerville Papers" were with Mr William Somerville.
- **The narrator's family** is now identified, with relationships confirmed by the family: William Somerville (b. 1937), son of Reginald Somerville and Honor Johnson; his sister Juanita (b. 1932, strictly a half-sister); his sons James, Charles and Edward; and his grandson Gergely, Charles's son, the interviewer. All of them are in the tree and the profiles. The existing records for the narrator, the interviewer and Juanita were updated rather than duplicated.

### Evidence audit against the family's Ancestry tree (October 2026)

The family's Ancestry tree, exported as a GEDCOM file, was cross-examined against both transcripts, the archive and independent sources, claim by claim. The full report, with a 39-claim discrepancy register, verdicts, error patterns, a bibliography, records to consult and a change log, is in [`research/evidence-audit-2026-10.md`](research/evidence-audit-2026-10.md), with the register as [CSV](research/evidence-audit-2026-10.csv).

**The GEDCOM is never committed.** `*.ged` is git-ignored, because the file contains living relatives and other branches of the family. In the archive it is cited as a private source with no public link, and its claims carry the *Family information* label. Only 27% of its vital facts carry any citation, and the records it cites (civil indexes, censuses, passenger lists, Find a Grave) could not be opened, so none is presented as an independently verified record.

Main results:
- Two of Bellingham Arthur's children were born at Queenstown, Co. Cork, in 1884–85, which puts the family in east Cork at the time of the Youghal riot.
- The ninth child who died young is named: Alan Everard (1885–87).
- Bunt was born in 1882.
- Maudie died in March 1935 and Reginald remarried in 1936.
- The archive had skipped a generation in the Johnson line; this is corrected.
- "William P … William J" in the recording are the tree's labels for Major William and Captain William.
- New conflicts are now visible (Henry Bellingham Somerville's birth, Vere's death, Captain William's birth day).
- The tree's own errors are listed and were not adopted: impossible parents for Elizabeth Tenison, the 17th-century generations, a duplicated Cecilia.

### Source checks

Every external source was re-checked against the specific claim it supports, and its `used` note was rewritten to say exactly that. 56 sources were read directly, one only partly (a *London Gazette* page), and 13 are known only from search results, because their sites block automated access or were unavailable: the three Wicklow Heritage pages, Agriland, Landed Estates, the NLI catalogue record, IWM Lives of the First World War, the Great War Forum, TheGenealogist, a Clarke article, a Dublin street site, a study of Nanyuki in the 1920s and the King's Own museum. The Irish census and civil-registration sites were also unreachable by automated access, so the 1901/1911 census and civil death records remain to be checked by hand. These are marked "search result only" on the Sources page and should be read by a person before being relied on. The Clarke article is based on interviews with the narrator, so it is not independent corroboration of his account. New sources include the Hansard reports of 31 March, 4 April and 10 May 1887, the 1883 Act, the National Library of Ireland's descriptive list of the Rooke Papers, the Dictionary of Irish Architects, Logainm and four pages of a compiled genealogy (treated as secondary, though it quotes primary records such as the 1891 census and The Times).

## Unresolved questions (summary)

The full register (43 questions: 13 resolved, 13 partly resolved, 17 open), with the evidence, reasoning and next steps, is on the site's **Open questions** page (`data/questions.json`). The most important genuine uncertainties are:

1. **Parentage and marriages.** Did Archibald James marry Elizabeth Breakey (Brakey), and was "little Archie" (b. 1823) their son? A compiled genealogy instead records his marriage to an Elizabeth Crawford in 1836; whether she is the same woman is unknown. Whose servant was Elizabeth Brakey? Is "for 19 years" the family's time in Monaghan or Archibald's age?
2. **The dormant baronetcy.** The archive does not assess any claim. Open points include surviving male heirs of the senior line, Major William's parentage and the lawfulness of Archibald James's marriage.
3. What Bellingham Arthur died of in January 1916 (influenza, but not the 1918 pandemic): the civil death record has not been read.
4. Pat's escapes, camps and Military Cross, and the London Gazette entries for Bunt's DSO and Pat's MC; whether Jim also held the DSO.
5. Places still unlocated: the farm within Cumry, the house "Farm" near Belturbet, Tenison's Dublin address, Reginald's Kenya farm, Jim's grave.
6. Rachel Clinch as Margaret's sister; Maudie Moore's origin; Reginald's exact birth date; the Johnson ancestry, which comes only from an unverified online tree; Aunt Eddie's husband; who "Sir William the younger" was (G.O. MS 182A should answer this).
7. An inventory of the papers in the narrator's keeping, and a reading of the registered pedigree, are the most valuable next steps.

## Limitations

- Both transcripts are automatic speech-to-text with no speaker labels, and no audio was available to settle disagreements. Some passages are unrecoverable in both, and every reading of a garbled word is an interpretation (all are shown and graded).
- Many family details still rest on one person's memory. Civil and church registers, the 1901/1911 Irish census and RIC service records have not yet been read directly, because those sites block automated access; several dates come from a compiled genealogy quoting the IGI, the 1891 census and The Times.
- Map positions marked "approximate" are best guesses; "Farm" is placed at Belturbet. Cumry is now placed at its townland.
- The tree uses a simple layout that is wide rather than compact; the outline view is easier on small screens.
- The recording is dated 27 October 2026 from transcript B's file name.
