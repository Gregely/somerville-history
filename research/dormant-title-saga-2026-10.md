# The Dormant Title: notes on the saga (October 2026)

The story **The Dormant Title: a Somerville saga** (`data/narrative.json`, id `dormant-title`; on the site at `#/story/dormant-title`) is a later synthesis. It tells the history of the Somerville baronetcy from its creation in 1748 to Grandpa's claim today. It was written to be presented. It is not part of Grandpa's account, and the page says so above the text.

## Rules followed

- **Sources.** It uses only material already in the archive: the three transcripts, the compiled profiles of the extended genealogy, the archive's sources, open questions and corrections. Nothing was searched for or added from outside.
- **Grandpa's words.** Wherever he speaks about a point, his words are quoted and linked to the passage in transcript A, B or C. The build checks each quotation against the cited passage.
- **Evidence labels.** Every other claim carries a label for the kind of evidence behind it:

  | Label | Meaning |
  |---|---|
  | Documented | A record or published source |
  | Compiled profile | The family's compiled profiles |
  | Grandpa's recollection | Said by Grandpa in the recordings |
  | Family tradition | Long believed in the family; no record establishes it |
  | Allegation | Asserted by someone in the story, unproven |
  | Our inference | The archive's own reasoning |
  | Sources conflict | The records disagree |

- **Contradictions kept.** Where sources disagree, both versions are given: the date of the patent, the 3rd Baronet's dates, Garter's first name, "sixth" against "ninth" baronet, the date of the Rouge Dragon visit, and Bellingham Brooke's birthplace.
- **Claim not established.** The claim is presented as the family's case. The saga sets out what would decide it.
- **Left out.** The criminal allegation about a later owner of Somerville and the DNA results are left out, as elsewhere in the archive.

## Checking

- `tests/succession.cjs` works out the male-line seniority from the genealogy data and confirms the result the saga describes.
  - The senior surviving male line in the archive is Grandpa's, if Archibald James's 1836 marriage is set aside.
  - After him the line runs James (daughters only), Charles, Gergely, Benedek, Edward, Alexander.
  - Only two lines are passed over without a record that they ended: those of Warburton and of William of Lake, younger sons of Sir Quaile.
- Every quotation attributed to a profile was checked against that profile's text.

Re-reading the draft against the profiles corrected these points:

- Tenison Alan was seven, not eight, when Archibald left in 1823.
- The 1834 Bible entry is in a Canadian edition, not an American one.
- The American trade paper reckoning the succession dates from 1879.
- Bunt served in North Russia in 1919. The record does not say he commanded at Archangel.
- Tetty proposed that Bunt's widow, Kitty, give up her interest in Clermont. It was not the brothers' shares.

Reading the profiles in full also added material the first draft missed:

- **James Richard (0603).** A doubtful ninth son of Captain William. His three sons all died young, so his line does not affect the succession.
- **"No legitimate issue".** The family's own Somerville Index enters Archibald with these words.
- **Tetty and the diary.** By her own account, Tetty helped destroy parts of Captain William's diary as a child.
- **Thomas Nelson's letter (1879)** and **John Aikens's threat** to the Crawford property.
- **Tenison Alan's possible confusion** of Archibald's affairs with Corry's, which the compilers note.

## Key sources

| Source | Covers |
|---|---|
| Transcript C ¶13–21, 51–75, 77–96, 99–143, 167–195 | The senior line, the claim, the 1929 cutting, the will and Quentin, the bigamy argument, Corry, the rolls and the College of Arms |
| Transcripts A ¶16–18, 104–176, 382–386, 554–562 and B ¶8–9, 41–76, 149–150, 218–222 | Archibald and little Archie, Captain William's sons, Clermont and Bunt |
| Profiles 0584, 0584A, 0584B | Archibald James, Elizabeth Breaky and Elizabeth Crawford: the diary, the letters of 1838–1880, the Declaration of 1893, the Ballybay register, the 1849 passenger list, the College of Arms history and Debrett's |
| Profiles 0586, 0587, 0613 | Corry, Lucinda, and their son William Bellingham |
| Profiles 0525–0559, 0574, 0598, 0606–0608, 0638 | The 1st Baronet and the senior line |
| Profiles 0563, 0582, 0589, 0591, 0603, 0626–0634, 0660–0670, 0680, 0682, 0691–0695 | Our branch |
| Profile 0501 | The Somerville Index and the draft pedigree at the College of Arms |
| Published and family sources | `visitation-1897`, `visitation-additions`, `fam-athlumney-cutting`, `fam-arms-1924`, `nli-arms-1924`, `nli-rooke`, `wp-somerville-baronets`, `wp-sir-james-somerville`, `wp-2nd-baron`, `wp-1st-baron`, `wp-conyngham`, `wp-harry-boan`, `wp-peter-agnew`, `wp-agnew-somerville`, `wp-official-roll`, `wp-rouge-dragon`, `winters-p68` |
| Open questions and corrections | `q-archibald-marriage`, `q-baronetcy-succession`, `q-brakey-household`, `q-eighth-son`; correction `ic-agnew-marriage` |

## The most important unresolved questions

1. **Did Archibald James marry Elizabeth Breaky, and when?** No register entry has been found. Without one, the 1836 Crawford marriage cannot be shown to be bigamous, and the American line ranks ahead of ours.
2. **Was the "Mrs Elizabeth Somerville, widow" of Ballybay (1846) Archibald's wife?** If she was, she was not a widow when she remarried.
3. **What became of little Archie?** If he was born after a marriage and left sons, his line would rank first of all. He may be the "A.J. Sommerville, age 30" of the 1849 passenger list.
4. **Who was the father of the Crawford children?** The profile notes that it is not conclusively proven.
5. **Warburton and William of Lake.** Did these younger sons of Sir Quaile leave male issue? The profiles record nothing either way.
6. **The 1960s draft pedigree at the College of Arms**, deferred by Garter, and the Genealogical Office pedigree of 1955 (G.O. MS 182A). Neither has been seen.
7. **Smaller conflicts:**
   - Debrett's 2019 entry: "sixth" or "ninth" baronet?
   - The date of the visit to Rouge Dragon: 2013–14 or 2023–24?
   - Garter: Sir George or Sir Arthur Bellew?
   - The patent: February or June 1748?
8. **The Choyce story.** Who was David Robert Choyce's mother? Which Boan sister was the elder? The archive has not checked anything said about Geraldine Somerville beyond the recording.
