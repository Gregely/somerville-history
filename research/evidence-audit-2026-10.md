# Evidence audit, October 2026: the family tree, the recording and the records

This report cross-examines four bodies of evidence: the family's Ancestry tree (exported as a GEDCOM file on 27 October 2026), William Somerville's recorded testimony (transcripts A and B), the archive's existing conclusions, and independent historical sources. It records every meaningful discrepancy, the best-supported conclusion and the confidence in it, and what changed in the archive as a result.

The GEDCOM file itself is **not** in this repository or its history (`*.ged` is git-ignored). It contains living relatives and unrelated branches; this report covers deceased members of the Somerville line and their ancestors only. Matters concerning living people and other branches were reported to the family privately.

## 1. Summary of the most important findings

- **The family was in Co. Cork at the time of the Youghal riot.** The tree places two of Bellingham Arthur's children's births at Queenstown (Cobh) in 1884 and 1885 and a death there in December 1887; by April 1888 the family was at Seaview House, Wicklow. This fits the narrator's "early stations … in Cork", strengthens the identification of District Inspector Somerville, and dates the transfer to Wicklow to the winter of 1887–88 (C01). The entries are uncited: the Cork civil registers are the first records to check.
- **The ninth child is identified.** The narrator said there were nine children, two of whom died young. The tree supplies the unnamed one: Alan Everard Whichnour Bellingham Somerville (1885–87). His names follow the family's naming pattern (C02).
- **Several of the narrator's dates are one to two years early, while his sequences are right.** Bunt was born in 1882, not "about 1884". Maudie died in March 1935, not 1934 (Reginald and Juanita landed in London from Beira on 5 April 1935). Reginald remarried in 1936. Eliza O'Connor may have died in 1898, not "about 1895" (C04, C05, C10, C23; pattern P8).
- **The archive had skipped a generation in the Johnson line,** by treating a tentative reading of the tree in the recording as structure. The tree as exported puts William Abraham Johnson between Samuel and Zachariah. The puzzling "Samuel the Elder" is probably a Samuel Tench (C06).
- **"William P … William J" in the recording are the tree's labels for Major William and Captain William.** The middle names "Padlou" and "James" appear in no other source (C16).
- **The GEDCOM has its own errors.**
  - Elizabeth Tenison is attached to parents who died before her birth (C20).
  - The 17th-century Somerville generations are copied from an online tree full of impossible dates (C22).
  - Cecilia appears twice, once as "Lenton" (C29).
  - Registration districts are recorded as birthplaces (P1).
  - A burial date has become a death date (P3).
- **Unresolved conflicts surfaced.** Henry Bellingham Somerville was born in 1848 or 1859; The Times's "fourth son" favours 1848, against the compiled genealogy's "twins of 1859" (C24). Vere died in 1975 or 1976 (C26). Captain William was born on 3 or 17 March 1776 (C15).

## 2. Method

- **The GEDCOM** (version 5.5.1, Ancestry export) was parsed in full: 139 individuals, 53 families and 25 source records. Of 254 individual birth, death, burial, baptism and probate facts, **69 (27%) carry any citation**, and 10 of those cite only other online trees. The most-cited source is the Find a Grave index (28 citations), followed by the 1911 and 1901 Irish censuses. Every claim was taken from the file without alteration. Its citations were recorded, but the records behind them (on Ancestry, Find a Grave and newspapers.com) could not be opened, so they are described as *cited, not inspected*.
- **The transcripts** were left unchanged. Testimony is quoted with its paragraph (A ¶n, B ¶n) and classed as eyewitness memory, remembered conversation or family tradition. Many tree passages in the recording are the *interviewer reading the tree aloud*, not the narrator's knowledge.
- **External research** used primary sources where they were reachable (Hansard, statute, archival catalogues) and published genealogies otherwise. Irish civil registers, the census website, Find a Grave and Ancestry blocked automated access, so nothing is claimed from them.
- **Automated consistency checks** ran across the whole tree: births after a parent's death, parental ages outside 15–60, marriages under 16, deaths before birth, burials more than 30 days after death, multiple marriage dates, one-parent families and duplicate names.
- **Verdicts:** Resolved; Probable; Disputed; Unresolved; Potential data error. Confidence: high, moderate, low.

## 3. Discrepancy register

The same register, with all fields, is in [`evidence-audit-2026-10.csv`](evidence-audit-2026-10.csv). Claims are ranked by significance: those touching identity, several generations or the archive's published conclusions come first.

### C01 · Bellingham Arthur Somerville; Youghal 1887

**Claim:** The family was living at Queenstown (Cobh), Co. Cork, in 1884–87, i.e. Bellingham Arthur was stationed in Co. Cork when the Youghal riot occurred (8 Mar 1887).  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* Jim (James Aubrey Henry Bellingham) b. 23 Mar 1884, Queenstown, Cork; Alan Everard Whichnour Bellingham b. 6 Oct 1885, Queenstown; d. 14 Dec 1887, Queenstown. All three facts UNCITED in the GEDCOM.
- *Grandfather's account (transcript reference):* "One of his early stations was in Cork … he was also in Limerick and Cork. And the little vignette that I'm going to mention occurred in Cork" (B¶116; A¶290–294); "a detachment of RIC was sent by train from Cork" (B¶118–125; A¶312–316). Testimony = family tradition, not eyewitness.
- *Archive's conclusion before the audit:* Identification of 'District Inspector Somerville' as Bellingham Arthur resolved (Oct 2026) on RIC service + Ronayne's 'young officer' from outside + family account; no Cork posting date was known.
- *Independent documentary evidence:* None inspected for the Queenstown births. Hansard (18 Mar 1887) shows the officer was not the local Youghal D.I. (Kerin).
- *Citations and links:* GEDCOM individuals for Jim and Alan Everard (no source records); Hansard 18 Mar 1887 https://api.parliament.uk/historic-hansard/commons/1887/mar/18/crime-and-outrage-ireland-the-1
- *Independence of sources:* GEDCOM birthplaces are independent of the recording (the narrator names no Cork birthplaces) but are unsourced.
- *Nature of the discrepancy:* No conflict; new corroborating lead.
- *Best-supported conclusion and reasoning:* Two children born at Queenstown in 1884 and 1885, and a death there in Dec 1887, would place the family in east Cork throughout the Youghal period, as the narrator says. This strengthens, but does not by itself prove, the identification.
- *Remaining alternatives:* The birthplaces could have been copied from an unrelated Somerville family; Queenstown could be a registration district rather than residence.
- *Record that would settle it:* Irish civil birth registers, Queenstown (Cork) district, 1884 and 1885; death register Dec 1887 (irishgenealogy.ie); RIC officers' register HO 184.
- *Recommended action:* Add to Bellingham Arthur's record and the Youghal question as supporting family-tree evidence, labelled as such.

### C02 · Children of Bellingham Arthur and Margaret Clinch

**Claim:** There were nine children, two of whom died young; the second child who died young is Alan Everard Whichnour Bellingham Somerville (1885–87).  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* Lists Cecilia, Bunt, Jim, Alan Everard (1885–87), Dorothy (1888–95), Vere, Edeline, Gualter, Reginald, plus 'Lenton' (see C35). Alan Everard uncited.
- *Grandfather's account (transcript reference):* "There were nine children altogether. I've left out two because they died as children" (B¶92; A¶228–230).
- *Archive's conclusion before the audit:* Nine children: seven named, Dorothy (d. 1895), and an unnamed placeholder 'child who died young'.
- *Independent documentary evidence:* Compiled genealogy (Winters p68) lists seven children and omits Alan Everard and Reginald; the 1891 census household (via Winters) post-dates his death.
- *Citations and links:* https://winters-online.net/bishopmeredith/g1/p68.htm
- *Independence of sources:* Independent of the recording; unsourced.
- *Nature of the discrepancy:* Archive gap filled by GEDCOM.
- *Best-supported conclusion and reasoning:* The GEDCOM's Alan Everard brings the count to exactly the nine the narrator gives, with two dying in childhood. His middle names (Whichnour = Wychnor, Staffs.) match the family's naming pattern (Dorothy *Alrewas*: Alrewas adjoins Wychnor), which argues against an invented entry.
- *Remaining alternatives:* A different unnamed infant; the GEDCOM entry could be mis-attributed.
- *Record that would settle it:* Civil birth (Oct 1885) and death (Dec 1887) registrations, Cork/Queenstown; 1911 census 'children born alive / still living' column for Margaret Somerville.
- *Recommended action:* Name the placeholder as Alan Everard (family tree), keep the uncertainty visible.

### C03 · Reginald Somerville's birth

**Claim:** Reginald was born in 1897.  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* b. 1897, 'Rathdrum, Ireland', citing Ireland Civil Registration Births Index (Ancestry db 2573), 1901 and 1911 Irish census, an incoming passenger list and Find a Grave.
- *Grandfather's account (transcript reference):* "My father was 17 when the Great War started in 1914" (B¶138; A¶348); "the only one who was born at Clermont" (B¶228; A¶572–574); "He was 38 at the time" (B¶199; A¶510–512).
- *Archive's conclusion before the audit:* c. 1896–97, at Clermont (inferred); q-reginald-birth open.
- *Independent documentary evidence:* Civil birth index cited in GEDCOM (not inspected). Rathdrum is the registration district covering Rathnew/Clermont, not a birthplace.
- *Citations and links:* GEDCOM source 'Ireland, Civil Registration Births Index, 1864-1958' (Ancestry APID 1,2573::5292150)
- *Independence of sources:* Civil index is independent of the testimony.
- *Nature of the discrepancy:* None in substance; GEDCOM records a registration district as a birthplace (see pattern P1).
- *Best-supported conclusion and reasoning:* 1897, registered in Rathdrum district, consistent with birth at Clermont and with the narrator's ages.
- *Remaining alternatives:* Late-1896 birth registered in 1897.
- *Record that would settle it:* The civil birth register entry (irishgenealogy.ie), which gives day and place.
- *Recommended action:* Update birth to 1897 (family tree citing the civil index); mark q-reginald-birth partly resolved.

### C04 · Maudie Moore's death and Reginald's return

**Claim:** Maudie died at sea on the voyage home in March 1935 (not c. 1934).  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* Maudie d. 11 Mar 1935 'Died at sea on way home from Kenya' (Ancestry tree only); Reginald arrived London 5 Apr 1935 from Beira (UK Incoming Passenger Lists, TNA BT26, piece 1069, item 131); Juanita on the same list (b. 'abt 1933', i.e. age 2).
- *Grandfather's account (transcript reference):* "Four years later [1932] my half-sister was born, Juanita. Two years after that, they were coming back … And his wife died on the journey" (B¶197–198; A¶504–510); "because 1932, 1934 … He was 38 at the time" (B¶199).
- *Archive's conclusion before the audit:* d. c. 1934 on the voyage home (testimony).
- *Independent documentary evidence:* Passenger list BT26/1069/131 cited in GEDCOM (not inspected).
- *Citations and links:* GEDCOM citation: The National Archives (UK), BT26 piece 1069 item 131 (Ancestry APID 1,1518::10561405)
- *Independence of sources:* Passenger list independent of the testimony; the 11 March date is uncited.
- *Nature of the discrepancy:* Narrator's '1934' vs records' early 1935.
- *Best-supported conclusion and reasoning:* Reginald landed in London on 5 Apr 1935 from Beira with Juanita, so the voyage on which Maudie died was in early 1935. A man born in 1897 would be 37 or 38 in early 1935 but at most 37 in 1934, so "38 at the time" also fits 1935. The narrator's sequence is right; his year is about one year early.
- *Remaining alternatives:* Maudie died on an earlier voyage leg in 1934 and Reginald travelled later (unlikely given the narrator's account).
- *Record that would settle it:* The passenger list itself; UK Registers of Deaths at Sea (BT 334) for 1935.
- *Recommended action:* Change Maudie's death to 'March 1935 (probably 11 March), at sea', keep the narrator's 1934 visible.

### C05 · Reginald Somerville's second marriage

**Claim:** Reginald married Honor Johnson in the April–June quarter of 1936.  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* MARR Jun 1936, Rathdrum (Ireland Civil Registration Marriages Index); Honor in the Irish Independent, 17 Apr 1936 (newspaper index).
- *Grandfather's account (transcript reference):* After Maudie's death he met Honor at Clermont and "they got married … So I was born in 1937" (B¶200–201; A¶512–516).
- *Archive's conclusion before the audit:* c. 1935–36 / 'after 1934' (testimony).
- *Independent documentary evidence:* Civil marriage index (not inspected).
- *Citations and links:* GEDCOM: Ireland Civil Registration Marriages Index (APID 1,2572::4514174); Irish Independent 17 Apr 1936 (newspapers.com index)
- *Independence of sources:* Independent of the testimony.
- *Nature of the discrepancy:* Refinement only.
- *Best-supported conclusion and reasoning:* Marriage registered in the June quarter of 1936 in Rathdrum district, a year after Maudie's death, and before the narrator's birth in 1937.
- *Record that would settle it:* Civil marriage register entry (irishgenealogy.ie).
- *Recommended action:* Set the marriage to 1936 (Apr–Jun quarter).

### C06 · The Johnson line (narrator's mother's family)

**Claim:** Samuel Johnson's father was Zachariah (archive) — or William Abraham Johnson, with Zacharias a generation earlier (GEDCOM).  
**Verdict:** Probable · **Confidence:** low

- *GEDCOM version and citations:* Rev. Phillip Bernard Johnson (b. 16 Oct 1866 Wexford; d. 2 Jul 1926) ← Samuel Johnson (1812–1883) & Mary Anne Richards ← William Abraham Johnson (c.1775–1829) & Frances Tench ← Zacharias Johnson & Charlotte Smyth. Frances Tench's father and grandfather are both Samuel Tench. Only Rev. Phillip's 1911 census entry is cited.
- *Grandfather's account (transcript reference):* Read from the interviewer's Ancestry tree: "Samuel's parents and … the Tenches … Frances Tench … Samuel's father … It might have been Zachariah … I have Samuel again … Samuel the Elder but again, I'm not sure" (B¶204–206; A¶522–524). No speaker labels: much of this is the interviewer reading an earlier state of the same tree.
- *Archive's conclusion before the audit:* Samuel Johnson's parents = 'Zachariah' and Frances Tench; 'Samuel the Elder' treated as a rival name for Samuel's father.
- *Independent documentary evidence:* None independent; the recording and the GEDCOM are the same tree at two dates.
- *Citations and links:* GEDCOM Johnson individuals (uncited); transcript B¶203–206
- *Independence of sources:* NOT independent: the spoken reading derives from this tree.
- *Nature of the discrepancy:* Archive skipped a generation by taking a tentative reading as structure.
- *Best-supported conclusion and reasoning:* The current tree puts William Abraham Johnson between Samuel and Zacharias, and the 'Samuel again … Samuel the Elder' the interviewer saw are most likely the two Samuel Tenches in Frances Tench's line, not a Johnson. The archive should follow the tree's structure, labelled as unverified family-tree information.
- *Remaining alternatives:* The tree may itself be wrong; the 18th-century Johnson generations are entirely unsourced.
- *Record that would settle it:* Church of Ireland registers (Wexford); clergy succession lists; Burke-type pedigrees for Tench of Ballyhally.
- *Recommended action:* Insert William Abraham Johnson (family tree) between Samuel and Zachariah; keep the question open.

### C07 · Rev. Philip Johnson, Rector of Wicklow

**Claim:** Honor's father was Rev. Phillip (Philip) Bernard Johnson, 1866–1926.  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* b. 16 Oct 1866 Wexford; 1911 census at Bollarney South, Wicklow Urban, with wife Elizabeth Charlotte Annie (Lillian) Pope and children Bernard, Honor, Norah, Edward (1911 census cited); d. 2 Jul 1926 (uncited).
- *Grandfather's account (transcript reference):* "Honor Johnson … Her father was the rector of Wicklow" (B¶201; A¶512–516); "Philip was my grandfather" (B¶203; A¶520).
- *Archive's conclusion before the audit:* Philip Johnson, Rector of Wicklow; first name 'unconfirmed'.
- *Independent documentary evidence:* Henry Rooke was rector of Wicklow 1873–1906 (Wikipedia citing Crockford's), so a successor from 1906 fits a Johnson household in Wicklow town in 1911.
- *Citations and links:* https://en.wikipedia.org/wiki/Henry_Rooke_(priest); GEDCOM 1911 census citation http://www.census.nationalarchives.ie/pages/1911/Wicklow/Wicklow_Urban/Bollarney_South/898810/ (site unavailable; not inspected)
- *Independence of sources:* Census index independent of the testimony.
- *Nature of the discrepancy:* None; adds full name and dates.
- *Best-supported conclusion and reasoning:* The Rector is very probably Rev. Phillip Bernard Johnson, living in Wicklow town in 1911 with Honor (b. 1903).
- *Remaining alternatives:* The 1911 household could be a curate's; succession not checked.
- *Record that would settle it:* Crockford's Clerical Directory / Leslie's clergy succession lists for Wicklow, 1906–26; the 1911 census return.
- *Recommended action:* Add full name and dates to the Rector's record (family tree), keep 'Rector of Wicklow' as testimony.

### C08 · Honor Johnson

**Claim:** Honor's full name was Honor Lucretia Phillipa Johnson, b. 27 Jun 1903 Dublin, d. 21 Jun 1985, buried Delgany.  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* As stated; cites 1911 census, 1926 census, Find a Grave, Irish Independent 17 Apr 1936.
- *Grandfather's account (transcript reference):* "Honor LP. Honor LP, yes … Honor was my mother" (B¶203; A¶520) — the interviewer reading initials from the tree.
- *Archive's conclusion before the audit:* Honor Johnson; no dates.
- *Independent documentary evidence:* 'Honor LP' in the recording matches 'Lucretia Phillipa' (same tree).
- *Citations and links:* GEDCOM; Find a Grave memorial 195571769 (403, not inspected)
- *Independence of sources:* Partly independent (census, newspaper).
- *Nature of the discrepancy:* Gap.
- *Best-supported conclusion and reasoning:* Adopt the full name and dates as family-tree information.
- *Record that would settle it:* 1911/1926 census returns; civil birth register 1903.
- *Recommended action:* Update Honor's record.

### C09 · Reginald Somerville's full name and death

**Claim:** Full name Reginald Malcolm John Bellingham Somerville; died July 1971, buried Delgany.  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* Primary name 'Reginald'; alternative 'Reginald John Bellingham Malcolm' — but its own cited source (Western Mail, 8 Jul 1940) is indexed as 'Lieut. Reginald Malcolm John Bellingham Somerville'. Death July 1971, burial Delgany (Find a Grave).
- *Grandfather's account (transcript reference):* "my father, Reginald Malcolm John" (B¶92; A¶228).
- *Archive's conclusion before the audit:* Reginald Malcolm John Somerville; no death date.
- *Independent documentary evidence:* Western Mail index entry (not inspected).
- *Citations and links:* GEDCOM; https://www.findagrave.com/memorial/195571756 (403)
- *Independence of sources:* Newspaper independent of testimony.
- *Nature of the discrepancy:* GEDCOM internal contradiction on name order.
- *Best-supported conclusion and reasoning:* Name order as the narrator and the 1940 newspaper give it; the GEDCOM's alternative order is a data-entry error. Death in July 1971 is family-tree information citing Find a Grave.
- *Record that would settle it:* Civil death register 1971; the 1940 Western Mail item (why 'Lieut.' in 1940?).
- *Recommended action:* Add 'Bellingham' to the full name; add death July 1971 (family tree).

### C10 · Bunt's birth

**Claim:** Bunt was born 8 Aug 1882 at Newtownards, not 'about 1884'.  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* b. 8 Aug 1882 Newtownards, Down (uncited); 1891 census at Witney cited.
- *Grandfather's account (transcript reference):* "Bunt was born in about 1884" (B¶103; A¶264).
- *Archive's conclusion before the audit:* c. 1883–84 (narrator 'about 1884'; compiled genealogy: about 1883 from age at death).
- *Independent documentary evidence:* 1891 census age 8 (via Winters p68) → born Apr 1882–Apr 1883; The Times death notice, aged 68 on 13 Feb 1951 (via Winters p69) → born Feb 1882–Feb 1883.
- *Citations and links:* https://winters-online.net/bishopmeredith/g1/p68.htm ; https://winters-online.net/bishopmeredith/g1/p69.htm
- *Independence of sources:* Census and Times are independent of each other and of the GEDCOM date.
- *Nature of the discrepancy:* Narrator about two years late.
- *Best-supported conclusion and reasoning:* 8 Aug 1882 fits both independent age statements; the narrator's 'about 1884' is an estimate.
- *Remaining alternatives:* Late 1882 at another place.
- *Record that would settle it:* Civil birth register, Newtownards district, 1882.
- *Recommended action:* Change Bunt's birth to 8 Aug 1882, Newtownards (family tree, consistent with census and death-notice ages); show the narrator's 1884.

### C11 · Jim's birth

**Claim:** Jim was born 23 Mar 1884 at Queenstown, Co. Cork.  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* As claimed; uncited.
- *Grandfather's account (transcript reference):* Not dated by the narrator.
- *Archive's conclusion before the audit:* 1884.
- *Independent documentary evidence:* 1891 census age 7 (via Winters) → 1883–84.
- *Citations and links:* Winters p68
- *Independence of sources:* Partial.
- *Nature of the discrepancy:* Refinement.
- *Best-supported conclusion and reasoning:* Consistent with the census age; see C01 for its significance.
- *Record that would settle it:* Civil birth register, Cork 1884.
- *Recommended action:* Add date and place (family tree).

### C12 · Gualter (Pat)'s birth

**Claim:** Gualter was born 1 May 1894 at Ballyhenry, Co. Wicklow.  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* b. 01 May 1894, Ballyhenry, Co Wicklow (Ancestry tree + 1901/1911 census citations).
- *Grandfather's account (transcript reference):* "two or three years older than my father" (archive).
- *Archive's conclusion before the audit:* 1894/95 (compiled genealogy 1894; IWM search result 1895).
- *Independent documentary evidence:* Clarke article (search result only, based partly on interviews with the narrator): born 1894 at Ballyhenry House, Ashford.
- *Citations and links:* https://heritage.wicklowheritage.org/… (Clarke, search-only)
- *Independence of sources:* Clarke and GEDCOM may both derive from family knowledge.
- *Nature of the discrepancy:* 1894 vs 1895.
- *Best-supported conclusion and reasoning:* 1 May 1894 at Ballyhenry is best supported; the IWM '1895' is probably an age-derived estimate.
- *Remaining alternatives:* 1895.
- *Record that would settle it:* Civil birth register, Rathdrum district, 1894.
- *Recommended action:* Update birth.

### C13 · Move to Clermont (dating)

**Claim:** The family moved to Clermont between March 1895 and 1897.  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* Gualter b. May 1894 at Ballyhenry; Dorothy b. Apr 1888 and d. Mar 1895 at Seaview House; Reginald b. 1897 (Rathdrum district); family at Newrath (Clermont) in 1901 and 1911 census.
- *Grandfather's account (transcript reference):* "for some years he rented places around Wicklow … My father was the only one who was born at Clermont" (B¶228; A¶572–574).
- *Archive's conclusion before the audit:* 'Bought in the mid-1890s' (NLI); 1894 works (DIA); move year unsettled.
- *Independent documentary evidence:* DIA: 1894 wings for B. A. Somerville; NLI: purchase mid-1890s.
- *Citations and links:* https://dia.ie/works/view/1582/building/CO.+WICKLOW%2C+CLERMONT ; https://www.nli.ie/sites/default/files/2022-12/rooke.pdf
- *Independence of sources:* Independent.
- *Nature of the discrepancy:* None; narrows the date.
- *Best-supported conclusion and reasoning:* Bought and altered by 1894, occupied after March 1895 and by 1897.
- *Record that would settle it:* 1901 census return; Wicklow Newsletter 1894–96.
- *Recommended action:* Note on the Clermont event.

### C14 · Clinch inheritance timing

**Claim:** Margaret's parents died in 1891 and 1894, releasing the Clinch money in time for Clermont.  
**Verdict:** Probable · **Confidence:** low

- *GEDCOM version and citations:* William Clinch c.1821–1891, buried 8 Aug 1891 Witney St Mary; Rachel Hall Wright 1827–16 Feb 1894 (all uncited).
- *Grandfather's account (transcript reference):* "She had money, and Bellingham Arthur did not" (B¶132; A¶330); Margaret and her sister Rachel inherited the brewery (A¶330; B¶131).
- *Archive's conclusion before the audit:* William Clinch b. c.1821, no death; Rachel Hall Wright b. c.1827.
- *Independent documentary evidence:* 1891 census (Apr) shows both alive at Witney (via Winters).
- *Citations and links:* Winters p68
- *Independence of sources:* Partial.
- *Nature of the discrepancy:* Gap.
- *Best-supported conclusion and reasoning:* If the GEDCOM dates are right, Margaret inherited between Aug 1891 and Feb 1894 — exactly when Clermont was bought and enlarged (1894).
- *Remaining alternatives:* Inheritance by settlement before death.
- *Record that would settle it:* England & Wales probate calendar 1891 (William Clinch) and the will itself — would also test the 'sister Rachel' and disinherited-son story.
- *Recommended action:* Add the dates to the Clinch records as family-tree information.

### C15 · Captain William Somerville's name and birth day

**Claim:** Captain William = 'William James Somerville', b. 17 Mar 1776 (GEDCOM) vs 3 Mar 1776 (Stirnet via Winters).  
**Verdict:** Disputed · **Confidence:** moderate (year high)

- *GEDCOM version and citations:* 'William James Somerville' b. 17 Mar 1776 Dublin; d. 19 Dec 1844; bur. St Audoen's 1844 (all uncited).
- *Grandfather's account (transcript reference):* "born in 1777, I think" (A¶62; B¶30).
- *Archive's conclusion before the audit:* 3 Mar 1776 (record, medium); narrator's 1777 shown.
- *Independent documentary evidence:* Winters p67 citing Stirnet: 3 March 1776; Bellingham genealogy: 1776.
- *Citations and links:* https://winters-online.net/bishopmeredith/g1/p67.htm ; https://landedfamilies.blogspot.com/2023/05/546-bellingham-of-levens-and-castle.html
- *Independence of sources:* Stirnet and the GEDCOM appear independent (different day).
- *Nature of the discrepancy:* Day of month (3 vs 17); middle name 'James' found nowhere else.
- *Best-supported conclusion and reasoning:* Year 1776 secure; day disputed. 'James' is an unsupported tree label (see C16).
- *Remaining alternatives:* Either day; one may be a baptism.
- *Record that would settle it:* Stirnet's source; Dublin parish registers 1776.
- *Recommended action:* Show 'March 1776 (3 or 17 March)'.

### C16 · 'William P … William J' in the recording

**Claim:** The interviewer's 'William P, who is father of William J. William P being William Padlew' are Major William and Captain William.  
**Verdict:** Resolved · **Confidence:** high (identity); middle names unsupported

- *GEDCOM version and citations:* Major William entered as 'William Padlou Somerville' (c.1720–Mar 1780), son of Sir James 1st Bt; Captain William as 'William James Somerville'.
- *Grandfather's account (transcript reference):* "William Henry, son of William J … I have William P, who is father of William J. William P being William Padlew? Was that a name?" (B¶53; A¶116–120).
- *Archive's conclusion before the audit:* q-ancestry-williams: unmatched names.
- *Independent documentary evidence:* Stirnet/Winters p66, Burke and Wikipedia name Major William simply 'William'.
- *Citations and links:* https://winters-online.net/bishopmeredith/g1/p66.htm ; https://en.wikipedia.org/wiki/Sir_James_Somerville,_1st_Baronet
- *Nature of the discrepancy:* Names unmatched in archive.
- *Best-supported conclusion and reasoning:* Identity resolved: the names are the interviewer's Ancestry-tree labels for Major William (1720–80) and Captain William. The middle names 'Padlou' and 'James' are not supported by any other source and should not be adopted.
- *Record that would settle it:* G.O. MS 182A (registered pedigree) for any middle names.
- *Recommended action:* Resolve q-ancestry-williams; record the labels as tree variants only.

### C17 · Elizabeth Munroe's death

**Claim:** Died 16 Mar 1817 (Winters) vs died 11 Mar, buried 16 Mar 1817 at St Audoen's (GEDCOM).  
**Verdict:** Disputed · **Confidence:** low

- *GEDCOM version and citations:* d. 11 March 1817; bur. 16 March 1817, St Audoen's (uncited).
- *Archive's conclusion before the audit:* d. 16 Mar 1817 (compiled genealogy).
- *Independent documentary evidence:* Winters p66/67 citing Stirnet.
- *Citations and links:* Winters p66
- *Independence of sources:* Uncertain.
- *Nature of the discrepancy:* Burial date in one source = death date in the other (pattern P3).
- *Best-supported conclusion and reasoning:* Probably died c. 11 March and buried 16 March; the archive's 16 March may be the burial.
- *Remaining alternatives:* Either.
- *Record that would settle it:* St Audoen's burial register (RCB Library).
- *Recommended action:* Show 'March 1817 (11 or 16 March)'.

### C18 · Eliza Bellingham's birth

**Claim:** Born 5 Sep 1779.  
**Verdict:** Resolved · **Confidence:** high

- *GEDCOM version and citations:* 5 Sep 1779, Thomastown, Louth; buried St Audoen's 19 Dec 1839 (uncited).
- *Archive's conclusion before the audit:* 1779.
- *Independent documentary evidence:* Landed families of Britain and Ireland no. 546: 'born 5 September 1779'.
- *Citations and links:* https://landedfamilies.blogspot.com/2023/05/546-bellingham-of-levens-and-castle.html
- *Independence of sources:* GEDCOM probably copies a published source.
- *Nature of the discrepancy:* Archive less precise than its own source.
- *Best-supported conclusion and reasoning:* 5 Sep 1779 (published genealogy).
- *Recommended action:* Update birth.

### C19 · Henry Bellingham (d. 1800): burial

**Claim:** Buried 29 Nov 1800 at St Mary's, Dublin, 80 days after his death on 10 Sep 1800.  
**Verdict:** Potential data error · **Confidence:** —

- *GEDCOM version and citations:* As stated (uncited).
- *Archive's conclusion before the audit:* d. Sep 1800 (10 Sep published; 8 Sep compiled).
- *Independent documentary evidence:* Landed families: died 10 Sep 1800, burial not recorded.
- *Citations and links:* Landed families no. 546
- *Nature of the discrepancy:* Implausible interval.
- *Best-supported conclusion and reasoning:* One of the dates belongs to another event or person.
- *Remaining alternatives:* Death date wrong; burial date mis-copied.
- *Record that would settle it:* St Mary's, Dublin, burial register 1800.
- *Recommended action:* None (register only).

### C20 · Elizabeth Tenison's parents

**Claim:** GEDCOM: daughter of Richard Tenison (1685–1725) and Margaret Barton (1690–1743).  
**Verdict:** Potential data error · **Confidence:** high (that it is an error)

- *GEDCOM version and citations:* Elizabeth b. 1750; parents as stated (uncited).
- *Archive's conclusion before the audit:* Mother of Eliza Bellingham; parents not recorded.
- *Independent documentary evidence:* Landed families: Elizabeth (c.1750–1814), 'daughter of Richard Tenison' (no dates).
- *Citations and links:* Landed families no. 546
- *Nature of the discrepancy:* Impossible: born 25 years after her father's death and 7 after her mother's.
- *Best-supported conclusion and reasoning:* The GEDCOM has attached her to the wrong (earlier) Richard Tenison — a generation conflation.
- *Remaining alternatives:* Her father was a later Richard Tenison, perhaps a son of the 1685–1725 man.
- *Record that would settle it:* Tenison pedigrees (Burke); Louth parish registers.
- *Recommended action:* None publicly; the archive does not adopt these parents.

### C21 · Sir James Somerville, 1st Bt: birth and wife's father

**Claim:** Born 1694 (GEDCOM) vs c. 1698 (Wikipedia/Rayment); wife Elizabeth Quayle daughter of James (Wikipedia) or William (Stirnet) Quaile.  
**Verdict:** Disputed · **Confidence:** low

- *GEDCOM version and citations:* b. 1694; d. 16 Aug 1748; wife Elizabeth Quayle b. 1698, d. 10 Nov 1725 (uncited).
- *Archive's conclusion before the audit:* b. c. 1698; Elizabeth 'daughter of James Quayle'.
- *Independent documentary evidence:* Wikipedia: c.1698; married 2 Feb 1713; Stirnet (via Winters): eldest son Quaile b. 14 Mar 1714, Elizabeth's father William Quaile, Alderman.
- *Citations and links:* https://en.wikipedia.org/wiki/Sir_James_Somerville,_1st_Baronet ; https://winters-online.net/bishopmeredith/g1/p66.htm
- *Independence of sources:* Wikipedia's marriage sentence is uncited.
- *Nature of the discrepancy:* A birth c.1698 implies marriage at about 15; the archive did not show the Quayle conflict.
- *Best-supported conclusion and reasoning:* Birth probably earlier than 1698 (c.1694 fits a 1713 marriage); Elizabeth's father disputed (James vs William).
- *Record that would settle it:* Burke's Peerage (1832) pp. 463–4; Dublin aldermen lists.
- *Recommended action:* Show 'c. 1694–98'; record the Quayle conflict.

### C22 · Early Somerville generations (pre-1690)

**Claim:** Thomas Somerville (1617–69) ← James Somerville (1571–1642) & Elizabeth Hamilton, with Scottish (Plean, Cambusnethan) connections.  
**Verdict:** Potential data error · **Confidence:** high (that it is unreliable)

- *GEDCOM version and citations:* Sourced to a Geneanet community tree (bloodman23) and other Ancestry trees.
- *Archive's conclusion before the audit:* Not adopted; origins chapter starts with Sir James.
- *Independent documentary evidence:* Burke (via Wikipedia): Sir James was 'only son of Thomas Somerville' and Sarah King — the GEDCOM's Thomas (b.1665) has no wife.
- *Citations and links:* https://en.wikipedia.org/wiki/Sir_James_Somerville,_1st_Baronet
- *Independence of sources:* Copied online trees.
- *Nature of the discrepancy:* Internal impossibilities: Elizabeth Hamilton b.1595 'married' 1603 (aged 8), 1609 and c.1615, and also to a John Somerville; her parents married 1605, ten years after her birth; a daughter b. 1610 in 'Irland'.
- *Best-supported conclusion and reasoning:* These generations conflate several Scottish and Fermanagh Somerville lines and cannot be relied on.
- *Record that would settle it:* Burke 1832; Fermanagh plantation records; Scottish Somerville peerage sources.
- *Recommended action:* Do not publish.

### C23 · Eliza O'Connor (Mrs Tenison Somerville)

**Claim:** Cecilia Eliza Priscilla O'Connor, b. 21 Jun 1815 Shoreham, Sussex; d. 31 Dec 1898 Rathmines; daughter of Daniel O'Connor and Elizabeth Ritchie.  
**Verdict:** Probable · **Confidence:** moderate (father); low (death date)

- *GEDCOM version and citations:* As stated; all uncited. Daniel O'Connor c.1790 Shoreham – Jun 1878 Inishowen.
- *Grandfather's account (transcript reference):* "Eliza O'Connor was the daughter of a seaman who had had altogether three marriages" (B¶84; A¶204–208); "he died first … about 1890 … She died about 1895" (B¶88; A¶216).
- *Archive's conclusion before the audit:* 'Eliza O'Connor (recorded as Cecelia Eliza)'; d. c. 1895; father an unnamed seaman.
- *Independent documentary evidence:* NLI Rooke Papers: Cecil B. Rooke's notes on the O'Connor family; 'her great grandfather Daniel O'Connor appears to have been a rather colourful [character]' — Cecil's great-grandfather on this line is Eliza's father.
- *Citations and links:* https://www.nli.ie/sites/default/files/2022-12/rooke.pdf (p. iv, note d)
- *Independence of sources:* NLI (Cecil's research) independent of the Ancestry tree.
- *Nature of the discrepancy:* Death c.1895 vs 31 Dec 1898.
- *Best-supported conclusion and reasoning:* Her father was Daniel O'Connor (probable: tree + NLI). The 1898 death date is an uncited lead; if correct, the narrator's order of deaths (Tenison first, 1895) is right and only his dates are early.
- *Record that would settle it:* Civil death register, Rathmines, Dec 1898; Cecil's O'Connor notes (NLI Rooke Papers).
- *Recommended action:* Name the seaman Daniel O'Connor (probable); add the 1898 death as a family-tree claim beside the narrator's 1895.

### C24 · Henry Bellingham Somerville's birth

**Claim:** b. 23 Dec 1848 (GEDCOM) vs 28 Jul 1859, twin of Tenison Alan (Winters/IGI).  
**Verdict:** Disputed · **Confidence:** low (leaning 1848)

- *GEDCOM version and citations:* b. 23 Dec 1848 Dublin; d. 14 Feb 1915 Dublin (uncited).
- *Archive's conclusion before the audit:* Twin, b. 28 Jul 1859 (compiled genealogy).
- *Independent documentary evidence:* The Times, 22 Jan 1916 (via Winters) calls Bellingham Arthur the '4th son' of Tenison Alan. With sons born 1842, 1845 and 1853, he is fourth only if Henry was born before 1853.
- *Citations and links:* Winters p68
- *Independence of sources:* Times notice independent of both trees.
- *Nature of the discrepancy:* Eleven-year difference; twin status.
- *Best-supported conclusion and reasoning:* The 'fourth son' statement favours the GEDCOM's 1848. The identical 1859 date in the compiled genealogy may be a copying of his brother's.
- *Remaining alternatives:* The Times counted differently.
- *Record that would settle it:* Dublin baptismal registers 1848/1859; 1880 marriage record (Mary Dyas), which states age.
- *Recommended action:* Replace 'twin' with a visible conflict.

### C25 · Erina Bellingham Somerville

**Claim:** Married Thomas Forster Woulfe 17 Jan 1883 (Winters) vs died unmarried as Somerville at Doncaster, 22 Jan 1927 (GEDCOM).  
**Verdict:** Unresolved · **Confidence:** —

- *GEDCOM version and citations:* d. 22 Jan 1927 Doncaster; no spouse (uncited).
- *Archive's conclusion before the audit:* Mrs Thomas Forster Woulfe; no death.
- *Independent documentary evidence:* Winters p68 (IGI).
- *Citations and links:* Winters p68
- *Independence of sources:* Different sources.
- *Nature of the discrepancy:* Married vs unmarried.
- *Best-supported conclusion and reasoning:* Unresolved; the GEDCOM may simply lack the marriage.
- *Remaining alternatives:* Widowed and reverted; two different Erinas.
- *Record that would settle it:* Doncaster death registration 1927 (surname used); 1883 marriage record.
- *Recommended action:* Add death as a family-tree claim with the conflict noted.

### C26 · Vere Truell's death

**Claim:** 18 Apr 1975 (Find a Grave via GEDCOM) vs 18 Apr 1976 (Winters).  
**Verdict:** Disputed · **Confidence:** —

- *GEDCOM version and citations:* d. 18 April 1975; buried Broadstone, Dorset.
- *Archive's conclusion before the audit:* 18 Apr 1976, Wimborne.
- *Independent documentary evidence:* Neither inspected.
- *Citations and links:* Find a Grave 292112118 (403); Winters p68
- *Independence of sources:* Probably different origins.
- *Nature of the discrepancy:* Year.
- *Best-supported conclusion and reasoning:* Same day and month suggest one typo.
- *Record that would settle it:* England & Wales death index / probate calendar 1975–76.
- *Recommended action:* Show both years.

### C27 · Dorothy Somerville's death

**Claim:** 5 Mar 1895 (Winters, The Times 8 Mar 1895) vs 6 Mar 1895 (GEDCOM).  
**Verdict:** Disputed · **Confidence:** low

- *GEDCOM version and citations:* b. 15 Apr 1888; d. 6 Mar 1895, Seaview House (uncited).
- *Archive's conclusion before the audit:* 5 Mar 1895.
- *Independent documentary evidence:* Winters cites The Times, 8 Mar 1895.
- *Citations and links:* Winters p68
- *Nature of the discrepancy:* One day.
- *Best-supported conclusion and reasoning:* Keep 5 March (nearer a contemporary notice); note 6 March.
- *Record that would settle it:* Civil death register, Rathdrum district, Mar 1895.
- *Recommended action:* Note the variant.

### C28 · Bellingham Arthur's birthplace

**Claim:** Born at Rathnew, Co. Wicklow (GEDCOM) vs baptised in Dublin (IGI).  
**Verdict:** Potential data error · **Confidence:** moderate

- *GEDCOM version and citations:* b. 17 Nov 1853, Rathnew (cites census and Find a Grave; neither would normally give a townland).
- *Archive's conclusion before the audit:* Baptised Dublin 16 Jun 1854.
- *Independent documentary evidence:* IGI via Winters; his father was then based in Dublin.
- *Citations and links:* Winters p68
- *Nature of the discrepancy:* Place.
- *Best-supported conclusion and reasoning:* Rathnew is almost certainly his later home and place of death carried back to his birth.
- *Record that would settle it:* 1901/1911 census birthplace column.
- *Recommended action:* None (archive already correct).

### C29 · 'Lenton Somerville'

**Claim:** A daughter 'Lenton', b. 1881, at Witney in 1891.  
**Verdict:** Potential data error · **Confidence:** high

- *GEDCOM version and citations:* Separate person, cited to the 1891 England census.
- *Independent documentary evidence:* The 1891 household (via Winters) lists Cecelia, 10, and no Lenton.
- *Citations and links:* Winters p68
- *Nature of the discrepancy:* Duplicate.
- *Best-supported conclusion and reasoning:* Almost certainly Cecilia, mis-indexed in the census index and attached as a second person.
- *Record that would settle it:* The census image.
- *Recommended action:* None.

### C30 · Margaret Clinch's marriage

**Claim:** Married 27 Aug 1879 (parish register) and a separate '1880' marriage event.  
**Verdict:** Resolved · **Confidence:** high

- *GEDCOM version and citations:* Both; the 1880 event uncited.
- *Archive's conclusion before the audit:* 27 Aug 1879.
- *Independent documentary evidence:* Oxfordshire marriages (cited in GEDCOM).
- *Citations and links:* GEDCOM: BOD294 C_14
- *Nature of the discrepancy:* GEDCOM internal.
- *Best-supported conclusion and reasoning:* 27 Aug 1879 at St Mary, Witney.
- *Recommended action:* None.

### C31 · Pat's marriage

**Claim:** Jul [quarter] 1925, Andover district (GRO index 2c/673) vs 7 Sep 1925, Longparish (Times via Winters).  
**Verdict:** Resolved · **Confidence:** high

- *GEDCOM version and citations:* As stated.
- *Archive's conclusion before the audit:* 7 Sep 1925, Longparish.
- *Independent documentary evidence:* Longparish lies in Andover registration district; September is in the July–September quarter.
- *Citations and links:* GEDCOM GRO index; Winters p68
- *Independence of sources:* Independent.
- *Nature of the discrepancy:* Apparent only.
- *Best-supported conclusion and reasoning:* The two agree.
- *Recommended action:* None.

### C32 · Edeline (Aunt Eddie)

**Claim:** Born c. 1892, Co. Wicklow; husband 'John'.  
**Verdict:** Probable · **Confidence:** moderate (birth); low (husband)

- *GEDCOM version and citations:* b. abt 1892 (census ages); spouse 'John' (no surname).
- *Grandfather's account (transcript reference):* "Uncle John, as he was to me" (B¶103; A¶256–260 'Uncle Jordan').
- *Archive's conclusion before the audit:* No birth; husband 'Uncle John/Jordan'.
- *Citations and links:* GEDCOM 1901/1911 census citations
- *Independence of sources:* 'John' in the tree may derive from the recording itself.
- *Nature of the discrepancy:* Gap.
- *Best-supported conclusion and reasoning:* Birth c. 1892 probable; 'John' slightly favoured but not independently established.
- *Record that would settle it:* 1929 Times notice (Winters); civil/church marriage record.
- *Recommended action:* Add birth c. 1892 (census ages).

### C33 · Edmund Truell

**Claim:** b. 14 Aug 1878; d. 3 May 1950; buried Broadstone, Dorset; Connaught Rangers.  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* As stated (Find a Grave; 1912 marriage notice).
- *Grandfather's account (transcript reference):* He preferred an English inheritance in Dorset (archive).
- *Archive's conclusion before the audit:* No dates.
- *Citations and links:* Find a Grave 292112000 (403)
- *Independence of sources:* Independent of testimony.
- *Nature of the discrepancy:* Gap.
- *Best-supported conclusion and reasoning:* Dorset burial supports the narrator.
- *Record that would settle it:* Probate calendar 1950.
- *Recommended action:* Add dates (family tree).

### C34 · Jim's burial

**Claim:** Buried at Rathnew (B) vs 'Matthew' (A).  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* Death 13 Apr 1950, 'Rathdrum' (registration district covering Rathnew).
- *Grandfather's account (transcript reference):* "he's buried in Rathnew" (B¶151); "buried in Matthew" (A¶388).
- *Archive's conclusion before the audit:* Partly resolved toward Rathnew.
- *Citations and links:* GEDCOM
- *Best-supported conclusion and reasoning:* A death registered in Rathdrum district fits dying at Clermont and burial locally; the grave itself is still unlocated.
- *Record that would settle it:* Rathnew burial register 1950.
- *Recommended action:* Note.

### C35 · Tenison Alan Somerville (1815)'s birthplace

**Claim:** Born at 'Loughbrickland, Armagh'.  
**Verdict:** Unresolved · **Confidence:** —

- *GEDCOM version and citations:* Uncited; Loughbrickland is in Co. Down, not Armagh.
- *Grandfather's account (transcript reference):* Children were 'born at a different place' (A¶62).
- *Archive's conclusion before the audit:* Birthplace not recorded.
- *Nature of the discrepancy:* County error.
- *Best-supported conclusion and reasoning:* Unsupported; even the county is wrong.
- *Record that would settle it:* Militia stations of the Louth Militia 1815; parish registers.
- *Recommended action:* None.

### C36 · Maudie Moore's family

**Claim:** Father Arthur Ellard Hawkesworth Moore.  
**Verdict:** Unresolved · **Confidence:** low

- *GEDCOM version and citations:* Uncited; Maudie b. Jan 1901; marriage 31 Jul 1928 (with a note typed into the place field).
- *Grandfather's account (transcript reference):* "a girl from Greystokes called Maudie Moore. She came from the County Laois family" (B¶197; A¶506–508).
- *Archive's conclusion before the audit:* Origin unknown; 'Greystones?'.
- *Independent documentary evidence:* NLI Rooke list: a 1946 letter from Reg Somerville 'refers to the Ellard family'.
- *Citations and links:* https://www.nli.ie/sites/default/files/2022-12/rooke.pdf
- *Independence of sources:* Indirect.
- *Nature of the discrepancy:* Gap.
- *Best-supported conclusion and reasoning:* A lead, not a conclusion.
- *Record that would settle it:* 1928 marriage record; 1901/1911 census for Arthur E. H. Moore.
- *Recommended action:* Add as a family-tree lead in the question only.

### C37 · Tenison Alan (1859–1906)

**Claim:** Died 27 Dec 1906, Leeds.  
**Verdict:** Probable · **Confidence:** moderate

- *GEDCOM version and citations:* As stated (uncited).
- *Archive's conclusion before the audit:* 1906 (Leeds registration district).
- *Independent documentary evidence:* Winters cites GRO death index 1906.
- *Citations and links:* Winters p68
- *Nature of the discrepancy:* Refinement.
- *Best-supported conclusion and reasoning:* Consistent.
- *Record that would settle it:* GRO death certificate.
- *Recommended action:* Add day (family tree).

### C38 · Pat's daughter

**Claim:** Julia Heather Margaret Somerville, 1931–2017.  
**Verdict:** Probable · **Confidence:** low

- *GEDCOM version and citations:* Uncited (Ancestry tree).
- *Grandfather's account (transcript reference):* A grandson 'through his daughter' visited the narrator (A¶454–460; B¶175–179).
- *Archive's conclusion before the audit:* Daughter unnamed.
- *Nature of the discrepancy:* Gap.
- *Best-supported conclusion and reasoning:* Consistent with the narrator's account; unverified.
- *Record that would settle it:* GRO birth index 1931.
- *Recommended action:* Mention in Pat's record as family-tree information.

### C39 · Narrator's immediate family

**Claim:** Children James, Charles and Edward (family) vs GEDCOM showing only Charles.  
**Verdict:** Resolved · **Confidence:** high

- *GEDCOM version and citations:* Only Charles is entered as a child.
- *Archive's conclusion before the audit:* Three sons (family information, 2026).
- *Nature of the discrepancy:* Omission in the tree, not a contradiction.
- *Best-supported conclusion and reasoning:* The tree is incomplete for living generations.
- *Recommended action:* None.

## 4. Claims by verdict

**Resolved (5)**

- C16 — 'William P … William J' in the recording: Identity resolved: the names are the interviewer's Ancestry-tree labels for Major William (1720–80) and Captain William.
- C18 — Eliza Bellingham's birth: 5 Sep 1779 (published genealogy).
- C30 — Margaret Clinch's marriage: 27 Aug 1879 at St Mary, Witney.
- C31 — Pat's marriage: The two agree.
- C39 — Narrator's immediate family: The tree is incomplete for living generations.

**Probable (20)**

- C01 — Bellingham Arthur Somerville; Youghal 1887: Two children born at Queenstown in 1884 and 1885, and a death there in Dec 1887, would place the family in east Cork throughout the Youghal period, as the narrator says.
- C02 — Children of Bellingham Arthur and Margaret Clinch: The GEDCOM's Alan Everard brings the count to exactly the nine the narrator gives, with two dying in childhood.
- C03 — Reginald Somerville's birth: 1897, registered in Rathdrum district, consistent with birth at Clermont and with the narrator's ages.
- C04 — Maudie Moore's death and Reginald's return: Reginald landed in London on 5 Apr 1935 from Beira with Juanita, so the voyage on which Maudie died was in early 1935.
- C05 — Reginald Somerville's second marriage: Marriage registered in the June quarter of 1936 in Rathdrum district, a year after Maudie's death, and before the narrator's birth in 1937.
- C06 — The Johnson line (narrator's mother's family): The current tree puts William Abraham Johnson between Samuel and Zacharias, and the 'Samuel again … Samuel the Elder' the interviewer saw are most likely the two Samuel Tenches in Frances Tench's line, not a Johnson.
- C07 — Rev. Philip Johnson, Rector of Wicklow: The Rector is very probably Rev.
- C08 — Honor Johnson: Adopt the full name and dates as family-tree information.
- C09 — Reginald Somerville's full name and death: Name order as the narrator and the 1940 newspaper give it; the GEDCOM's alternative order is a data-entry error.
- C10 — Bunt's birth: 8 Aug 1882 fits both independent age statements; the narrator's 'about 1884' is an estimate.
- C11 — Jim's birth: Consistent with the census age; see C01 for its significance.
- C12 — Gualter (Pat)'s birth: 1 May 1894 at Ballyhenry is best supported; the IWM '1895' is probably an age-derived estimate.
- C13 — Move to Clermont (dating): Bought and altered by 1894, occupied after March 1895 and by 1897.
- C14 — Clinch inheritance timing: If the GEDCOM dates are right, Margaret inherited between Aug 1891 and Feb 1894 — exactly when Clermont was bought and enlarged (1894).
- C23 — Eliza O'Connor (Mrs Tenison Somerville): Her father was Daniel O'Connor (probable: tree + NLI).
- C32 — Edeline (Aunt Eddie): Birth c.
- C33 — Edmund Truell: Dorset burial supports the narrator.
- C34 — Jim's burial: A death registered in Rathdrum district fits dying at Clermont and burial locally; the grave itself is still unlocated.
- C37 — Tenison Alan (1859–1906): Consistent.
- C38 — Pat's daughter: Consistent with the narrator's account; unverified.

**Disputed (6)**

- C15 — Captain William Somerville's name and birth day: Year 1776 secure; day disputed.
- C17 — Elizabeth Munroe's death: Probably died c.
- C21 — Sir James Somerville, 1st Bt: birth and wife's father: Birth probably earlier than 1698 (c.1694 fits a 1713 marriage); Elizabeth's father disputed (James vs William).
- C24 — Henry Bellingham Somerville's birth: The 'fourth son' statement favours the GEDCOM's 1848.
- C26 — Vere Truell's death: Same day and month suggest one typo.
- C27 — Dorothy Somerville's death: Keep 5 March (nearer a contemporary notice); note 6 March.

**Unresolved (3)**

- C25 — Erina Bellingham Somerville: Unresolved; the GEDCOM may simply lack the marriage.
- C35 — Tenison Alan Somerville (1815)'s birthplace: Unsupported; even the county is wrong.
- C36 — Maudie Moore's family: A lead, not a conclusion.

**Potential data error (5)**

- C19 — Henry Bellingham (d. 1800): burial: One of the dates belongs to another event or person.
- C20 — Elizabeth Tenison's parents: The GEDCOM has attached her to the wrong (earlier) Richard Tenison — a generation conflation.
- C22 — Early Somerville generations (pre-1690): These generations conflate several Scottish and Fermanagh Somerville lines and cannot be relied on.
- C28 — Bellingham Arthur's birthplace: Rathnew is almost certainly his later home and place of death carried back to his birth.
- C29 — 'Lenton Somerville': Almost certainly Cecilia, mis-indexed in the census index and attached as a second person.

## 5. Recurring error patterns

- **P1. Registration districts recorded as places.** Reginald 'born Rathdrum', Jim 'died Rathdrum', marriages 'Rathdrum', Rev. Johnson 'died Rathdown': the civil-registration district is entered as a birthplace or death place. Rathdrum district includes Rathnew and Clermont, so these are consistent with the testimony once read correctly.
- **P2. Census-age estimates presented as birth facts.** 'abt 1881', 'abt 1891', 'abt 1892', 'abt 1933' come from census or passenger-list ages; Vere's 'abt 1891' conflicts with her age of 8 months at the 1891 census (born c. Aug 1890).
- **P3. Burial date confused with death date.** Elizabeth Munroe: the compiled genealogy's death date (16 Mar 1817) is the GEDCOM's burial date.
- **P4. Generation conflation.** Elizabeth Tenison attached to a father who died 25 years before her birth; the 17th-century Somervilles merged from several lines; in the archive itself, Zachariah Johnson placed as Samuel's father, a generation too low.
- **P5. Duplicates from mis-indexed records.** 'Lenton Somerville' (= Cecilia in the 1891 index); a duplicated wife and marriage in an unrelated branch.
- **P6. Oral readings feeding back into the tree.** 'Henry Rook' and 'John' in the GEDCOM match what was heard in the recording, so they are not independent confirmation of the testimony.
- **P7. Circular corroboration.** Find a Grave memorials and other members' trees often derive from the same Ancestry data; dates appearing in both are counted once.
- **P8. Narrator's dates early by one to two years, sequence right.** Bunt (1884 vs 1882), Maudie's death (1934 vs 1935), Tenison and Eliza (c.1890/1895 vs 1895/1898), Bellingham Arthur (1856 vs 1853). The order of events is consistently right; absolute years drift — typical of remembered, not documented, dates.

## 6. Dependencies traced

- Queenstown births (C01, C11) → strengthen the Youghal identification and date the transfer to Wicklow to between Dec 1887 and Apr 1888 (Dorothy born at Seaview House, Wicklow).
- Alan Everard (C02) → completes the nine children; the placeholder is replaced.
- Maudie's death in 1935 (C04) → Reginald's remarriage in 1936 (C05) → the narrator's birth in 1937 and 'he was 38 at the time'.
- Henry Bellingham Somerville's birth (C24) → Bellingham Arthur as 'fourth son' → the 'twins of 1859' claim.
- Clinch deaths 1891/1894 (C14) → Margaret's inheritance → Clermont bought and enlarged in 1894 (C13).
- Johnson generations (C06) → the archive's tree structure for the maternal line.

## 7. Sources

**Inspected directly**

- GEDCOM export of the family's Ancestry tree 'Somerville Family Tree' (Ancestry member tree RIN 197810623), GEDCOM 5.5.1, exported 27 Oct 2026. Private file supplied by the family; parsed in full; not published.
- Wikipedia, 'Sir James Somerville, 1st Baronet'. https://en.wikipedia.org/wiki/Sir_James_Somerville,_1st_Baronet
- Wikipedia, 'Henry Rooke (priest)' (cites Crockford's 1898 p. 1234). https://en.wikipedia.org/wiki/Henry_Rooke_(priest)
- N. Kingsley, Landed families of Britain and Ireland no. 546, 'Bellingham of Levens and Castle Bellingham' (2023). https://landedfamilies.blogspot.com/2023/05/546-bellingham-of-levens-and-castle.html
- Winters family pages (Bishop Richard Meredith), persons pp. 66–69 (compiled; cites Stirnet, IGI, The Times, 1891 census, GRO). https://winters-online.net/bishopmeredith/g1/p66.htm (also p67, p68, p69)
- B. Clesham, The Rooke Papers: a descriptive list, NLI Collection List No. 48 (1998). https://www.nli.ie/sites/default/files/2022-12/rooke.pdf
- Dictionary of Irish Architects, Clermont, Co. Wicklow. https://dia.ie/works/view/1582/building/CO.+WICKLOW%2C+CLERMONT
- Hansard, 18 Mar, 31 Mar, 4 Apr 1887. https://api.parliament.uk/historic-hansard/commons/1887/mar/18/crime-and-outrage-ireland-the-1 ; …/1887/mar/31/crime-and-outrage-ireland-death-of ; …/1887/apr/04/crime-and-outrage-ireland-death-of
- Logainm, Cumry / Na Comraigh. https://www.logainm.ie/en/39936
- Constabulary and Police (Ireland) Act 1883, s. 12. https://www.legislation.gov.uk/ukpga/Vict/46-47/14/section/12/enacted

**Cited or sought but not inspected** (no claim is made from their content)

- census.nationalarchives.ie (1901, 1911 Newrath and Wicklow Urban returns): HTTP 503.
- Find a Grave memorials 233235961, 219717160, 195571756, 195571769, 292112118, 292112000: HTTP 403.
- Ancestry record indexes cited in the GEDCOM (civil registration, passenger lists, probate, census): Subscription; known only from the GEDCOM's citation lines.
- newspapers.com clippings cited in the GEDCOM: Subscription.
- civilrecords.irishgenealogy.ie: HTTP 403.
- Geneanet community tree 'bloodman23': Not consulted: an unsourced copied tree.

## 8. Records needing manual consultation

- **irishgenealogy.ie (civil registers).** Births: Queenstown/Cork 1884 (James Aubrey Henry Bellingham) and 1885 (Alan Everard Whichnour Bellingham); Rathdrum 1897 (Reginald); Newtownards 1882 (William Arthur Tenison Bellingham); Rathdrum 1894 (Gualter). Deaths: Cork Dec 1887 (Alan Everard); Rathdrum Mar 1895 (Dorothy); Dublin Jul 1895 (Tenison Alan); Rathmines Dec 1898 (Cecilia Eliza Somerville); Rathdrum Jan 1916 (Bellingham Arthur, cause of death); Rathdrum Apr 1950 (Jim). Marriage: Rathdrum Apr–Jun 1936 (Reginald & Honor). Blocked to automated access.
- **National Archives of Ireland census, 1901 and 1911.** Newrath (Clermont), Glenealy DED: occupations (B. A. Somerville's RIC status), birthplaces, and the 1911 'children born alive / still living' column, which would test 'nine children, two died'. URLs in the GEDCOM; site returned 503.
- **The National Archives (UK) HO 184.** RIC officers' register for Bellingham Arthur Somerville: appointment 1872, stations (Newtownards, Queenstown?), 1887 events, retirement before 1891.
- **The National Archives (UK) BT 26/1069/131 and BT 334.** Passenger list, arrival London 5 Apr 1935 from Beira; registers of deaths at sea 1935 (Maudie).
- **Principal Probate Registry calendars (England & Wales).** William Clinch of Witney, 1891 (and his will: daughters, the disinherited son); Vere Truell 1975/76; Gualter Somerville 1948 (cited in GEDCOM).
- **RCB Library, Dublin.** St Audoen's burial register (Elizabeth Munroe 1817; Eliza Somerville 1839; Captain William 1844); St Mary's burials 1800 (Henry Bellingham); Wicklow clergy succession 1906–26 (Rev. P. B. Johnson).
- **National Library of Ireland.** G.O. MS 182A (registered Somerville pedigree, pp. 119–130); Rooke Papers Ms. 33,584–33,601 (O'Connor and Somerville notes).
- **Newspapers.** Western Mail 8 Jul 1940 ('Lieut. Reginald … Bellingham Somerville'); Irish Independent 17 Apr 1936; The Times 1916, 1950, 1951 notices quoted by Winters.
- **Stirnet Somerville03 (subscription).** Source for Captain William's 3 March 1776 and Major William's two marriages.
- **Herlihy, Royal Irish Constabulary Officers (Four Courts Press).** Biographical entry for B. A. Somerville and any other officer named Somerville c. 1887.

## 9. Change log: what changed in the archive and why

Only claims judged Resolved or Probable were adopted. Disputed claims are shown as conflicts, with both versions visible. Claims taken from the family tree carry the *✎ Family information* label and cite the private tree. Where they contradict the narrator, his words remain visible as *❝ Narrator's account*.

| Record | Change | Register | Evidence label |
|---|---|---|---|
| Placeholder "child who died young" | Named as Alan Everard Whichnour Bellingham Somerville (6 Oct 1885 – 14 Dec 1887, Queenstown); new id `alan-everard-somerville`, old link redirects | C02 | Family information |
| Bellingham Arthur Somerville | Added: stationed in Co. Cork c. 1884–87 (inferred from children's birthplaces); 1901/1911 census residence at Newrath (Clermont); transfer to Wicklow dated winter 1887–88 | C01, C13 | Interpretation / family information |
| Youghal question | Supporting evidence added (Queenstown 1884–87); verdict unchanged (resolved) | C01 | — |
| Bunt | Birth changed from c. 1883–84 to 8 Aug 1882, Newtownards; narrator's "about 1884" kept visible | C10 | Family information, consistent with two independent ages |
| Jim | Birth 23 Mar 1884, Queenstown, added | C11 | Family information |
| Gualter (Pat) | Birth 1 May 1894, Ballyhenry (was 1894/95); daughter Julia (1931–2017) noted | C12, C38 | Family information |
| Edeline (Eddie) | Birth c. 1892 added (census ages) | C32 | Family information |
| Reginald | Birth 1897 (was c. 1896–97, question partly resolved); full name adds Bellingham; death July 1971, Delgany; second marriage 1936 (was c. 1935–36) | C03, C05, C09 | Family information citing civil indexes |
| Maudie Moore | Death changed from c. 1934 to March 1935 (probably 11 March), at sea; narrator's 1934 kept visible | C04 | Family information citing a passenger list |
| Honor Johnson | Full name Honor Lucretia Phillipa; born 27 Jun 1903, died 21 Jun 1985, buried Delgany | C08 | Family information |
| Rector of Wicklow | Identified as Rev. Phillip Bernard Johnson (1866–1926); 1911 census household | C07 | Family information + context (Henry Rooke rector to 1906) |
| Johnson line | William Abraham Johnson inserted between Samuel and Zachariah (archive had skipped a generation); Samuel 1812–83 | C06 | Family information (unverified) |
| Captain William | Birth shown as March 1776 (3 or 17 March) — was 3 March | C15 | Conflict |
| Elizabeth Munroe | Death shown as March 1817 (11 or 16 March) — was 16 March | C17 | Conflict |
| Eliza Bellingham | Birth 5 Sep 1779 (was 1779) | C18 | Published record |
| Sir James Somerville, 1st Bt | Birth shown as c. 1694–98 (was c. 1698) | C21 | Conflict |
| Elizabeth Quayle | Father shown as disputed (James vs William Quaile); death 10 Nov 1725 | C21 | Conflict / record |
| Eliza O'Connor and her father | Father named Daniel O'Connor (NLI + tree); her death shown as c. 1895 (narrator) or 31 Dec 1898 (tree) | C23 | Record / conflict |
| Henry Bellingham Somerville | "Twin, b. 1859" replaced by a visible conflict (1859 or 1848); death 1915 | C24 | Conflict |
| Tenison Alan (1859–1906) | "Twin" removed from name; death 27 Dec 1906 | C24, C37 | Record / family information |
| Erina | Death 22 Jan 1927, Doncaster, added with the marriage conflict noted | C25 | Family information |
| Vere | Death shown as 18 Apr 1975 or 1976 | C26 | Conflict |
| Dorothy | 6 March variant noted beside 5 March | C27 | Note |
| Edmund Truell | Dates 1878–1950, Connaught Rangers, Dorset burial | C33 | Family information |
| William Clinch, Rachel Hall Wright | Deaths 1891 and 1894 added | C14 | Family information |
| Questions | q-ancestry-williams resolved; q-reginald-birth and q-johnson-line partly resolved; leads added to q-youghal-identity, q-tenison-death, q-maudie-origin, q-tenison-children, q-captain-william-born, q-clinch-rachel, q-jim-burial, q-hungarian-family | — | — |
| Sources | Added the private family tree (no public link) and Wikipedia's Henry Rooke (priest); Winters p66 note extended | — | — |
| Display | Sources can now be private (no public link); "Family information" label now explicitly covers the family's Ancestry tree | — | — |

**Not adopted:** the tree's parents for Elizabeth Tenison (C20); the pre-1690 Somerville generations (C22); the "Padlou" and "James" middle names (C16); "Lenton" (C29); Bellingham Arthur's birthplace "Rathnew" (C28); Tenison Alan's birthplace "Loughbrickland, Armagh" (C35); and everything concerning living relatives and unrelated branches.
