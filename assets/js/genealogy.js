/* Part two: the Extended Somerville Family Genealogy (supplementary research).
   Views over data/genealogy.json (the compiled profiles) and
   data/genealogy-differences.json. Kept apart from Grandpa's account: shared
   people are linked to the account, never merged with it. */
(function () {
  "use strict";
  const SA = window.SA, A = SA.data, esc = SA.esc, V = SA.views;
  const G = A.genealogy || { branches: [], profiles: [] };
  const GI = SA.GI;
  const REPO = "https://github.com/Gregely/somerville-history/blob/claude/family-history-archive-nwmc6d/";
  const fileUrl = (path) => REPO + path.split("/").map(encodeURIComponent).join("/");
  const branchTitle = (b) => (SA.genBranches[b] || {}).title || "";
  const TRANCHE = { 1: "Tranche 1 · Major William's descendants", 2: "Tranche 2 · the senior line and the early generations" };

  // ---------- fragments ----------
  const gChip = (id, extra = "") => {
    const p = SA.gen[id];
    if (!p) return "";
    return `<a class="pchip gchip${p.archive ? " in-account" : ""}" href="#/genealogy/person/${id}"><span class="nm">${esc(p.name)}${p.archive ? ` <span class="acc-mark" title="Also in Grandpa's account">❝</span>` : ""}</span><span class="lf">${esc(id)}${SA.gLife(p) ? " · " + esc(SA.gLife(p)) : ""}${extra}</span></a>`;
  };
  SA.gChip = gChip;
  const xlinkA = (pid, label = "↩ In Grandpa's account") => `<a class="btn small-btn xlink-a" href="#/person/${pid}">${label}</a>`;

  // A profile paragraph: base text, tracked insertions (by "William Somerville",
  // i.e. Grandpa, or by the earlier editor "7"), deletions (hidden by default),
  // pictures, and markers where an address has been taken out.
  const REV = {
    W: "Amendment recorded in the file as by “William Somerville” (Grandpa), 2021–22",
    7: "Revision of 2011–12 by an editor recorded in the file only as “7”",
    U: "Revision by an unrecorded editor",
  };
  const ADDR = `<span class="omit" title="A home or postal address is not reproduced on the website">[address omitted]</span>`;
  const text = (t) => esc(t).replace(/⟦address⟧/g, ADDR);
  function seg([t, c]) {
    if (c === "") return text(t);
    if (c === "p") return `<span class="pic" title="A picture in the original document, not reproduced">▣ picture</span>`;
    const a = c.slice(1);
    return c[0] === "i" ? `<ins class="rv rv-${a}" title="${esc(REV[a])}">${text(t)}</ins>` : `<del class="rv rv-${a}" title="Deleted: ${esc(REV[a])}">${text(t)}</del>`;
  }
  const HEAD = /^(Notes?|Further [Rr]esearch|Additional [Rr]esearch|Addendum|Sources?|Further [Ii]nformation)\b[^.]{0,60}:?$/;
  function para(pa) {
    const plain = SA.gParaText(pa).trim();
    let html = typeof pa === "string" ? text(pa) : pa.map(seg).join("");
    if (HEAD.test(plain) && plain.length < 80) return `<h3 class="gp-h">${html}</h3>`;
    // bold a short leading label ("SR1636:", "CRISP:", "Notes:")
    if (typeof pa === "string") html = html.replace(/^([A-Za-z][\w .&’'()-]{0,24}:)(\s)/, "<b>$1</b>$2");
    return `<p>${html}</p>`;
  }
  const profileText = (paras) => paras.map(para).join("");

  const revCount = (p, a) => (p.revisions && p.revisions[a]) || 0;
  const relLine = (id) => { const r = SA.gRelLabel(id); return r ? `<p class="relchip">${esc(r)}</p>` : ""; };

  // ---------- overview ----------
  V.gHome = function (main) {
    const shared = G.profiles.filter((p) => p.archive);
    const tot = (a) => G.profiles.reduce((n, p) => n + revCount(p, a), 0);
    main.innerHTML = `
      <header class="page-head g-head"><p class="kicker">Part two · supplementary research</p><h1>Extended Somerville Family Genealogy</h1>
        <p class="lede">The family descending from James Somerville, “the Planter”, of Tullykelter Castle, Co. Fermanagh (d. 1642), identified in family tradition as the first Somerville to come to Ireland, set out in ${G.profiles.length} compiled profiles of the family and those they married. It reaches people and branches Grandpa never spoke of, and adds detail to many he did.</p></header>
      <div class="callout callout-g"><div class="callout-label">${GI} What this part is, and is not</div>
        <p>These are the <b>compiled family profiles</b> in <code>research/David Gilmour amended records</code>: begun by a cousin, David Gilmour, and amended over the years by Grandpa and others, from an earlier family pedigree, family papers, correspondence and published works. They are <b>not Grandpa's account</b>. Grandpa did amend many of them, but most of their text is the compilers' work, so nothing here is presented as something he said, knew or endorsed. The archive has not checked them record by record, and they are not treated as more authoritative than the recordings because they are more detailed.</p>
        <p>For what Grandpa himself said, go to <a href="#/account">My Grandfather's Account</a>. Where the two disagree, both versions are kept: see <a href="#/genealogy/differences">Where the sources differ</a>.</p></div>
      <section class="block">
        <h2>How to tell where information comes from</h2>
        <div class="g-legend">
          <div><span class="gl gl-profile">▦ Compiled profile</span><span>The profile's own text and fields, shown as written (spelling and punctuation kept). Each profile names its sources: usually the <i>Somerville Index</i>, a family pedigree registered in the 1950s, “SR” items in the family's Somerville Records, and the printed <i>Visitation of Ireland</i> (“CRISP”).</span></div>
          <div><span class="gl gl-w"><ins class="rv rv-W">Grandpa's amendment</ins></span><span>Text added as a tracked change by “William Somerville” in 2021–22 (${tot("W")} additions in the published profiles): almost certainly Grandpa, who said in the second recording that these are “the ones as amended” {q:T3:167}. These are his additions to someone else's compilation, not his recorded account.</span></div>
          <div><span class="gl gl-7"><ins class="rv rv-7">Earlier revision</ins></span><span>Tracked changes of 2011–12 by an editor the files record only as “7” (${tot("7")} additions). Who that was is not known.</span></div>
          <div><span class="gl gl-other">Others' research</span><span>Sections headed “Further research” or “Additional research”, letters and e-mails quoted in the profiles, with the researcher named where the profile names them (David Gilmour, Wendy Stevenson, W. M. Stevenson and others).</span></div>
          <div><span class="gl gl-trad">Tradition</span><span>What the family has long believed but no record establishes, such as where James the Planter came from; the profiles usually say so, and the archive keeps every version.</span></div>
          <div><span class="gl gl-note">Archive note</span><span>Our own notes and inferences: how a profile links to the account, doubtful parentage, missing or duplicated records. They are always labelled as ours.</span></div>
        </div>
      </section>
      <section class="block">
        <h2>The branches</h2>
        <div class="branch-grid">${G.branches.map((b) => `
          <article class="branch-card">
            <h3>${esc(b.title)}</h3>
            <p>${esc(b.desc)}</p>
            <p class="small muted">${b.count} profiles · from ${gChip(b.head)}</p>
            <div class="bc-actions"><a class="btn small-btn" href="#/genealogy/people?branch=${b.id}">Profiles</a>${SA.GTREES.some((t) => t.id === b.id) ? `<a class="btn small-btn" href="#/genealogy/tree/${b.id}">Tree</a>` : `<a class="btn small-btn" href="#/genealogy/tree/all?focus=${b.head}">In the tree</a>`}</div>
          </article>`).join("")}</div>
      </section>
      <section class="stats g-stats">
        <a href="#/genealogy/people"><b>${G.profiles.length}</b><span>profiles</span></a>
        <a href="#/genealogy/tree"><b>${G.branches.length}</b><span>branches</span></a>
        <a href="#/genealogy/people?acc=yes"><b>${shared.length}</b><span>also in Grandpa's account</span></a>
        <a href="#/genealogy/people?acc=no"><b>${G.profiles.length - shared.length}</b><span>not in the account</span></a>
        <a href="#/genealogy/differences"><b>${SA.genDiffs.length}</b><span>differences noted</span></a>
      </section>
      <section class="block two-col">
        <div>
          <h2>People in both parts</h2>
          <p class="small muted">Each pair is the same person, recorded separately in each part. The links say which way they go.</p>
          <ul class="shared-list">${shared.map((p) => `<li><a class="sh-g" href="#/genealogy/person/${p.id}">${esc(p.name)} <small>${esc(p.id)}</small></a><a class="sh-a" href="#/person/${p.archive}">↩ ${esc(SA.people[p.archive].name)}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h2>More</h2>
          <ul>
            <li><a href="#/genealogy/differences">Where the sources differ</a>: dates and versions on which the account and the profiles disagree, with both kept.</li>
            <li><a href="#/genealogy/sources">Sources and notes</a>: the files, who compiled them, what they cite, how the text was prepared, and what is left out (addresses).</li>
            <li><a href="#/genealogy/tree">The tree</a> from James the Planter to the present generation, or by branch.</li>
          </ul>
        </div>
      </section>`;
    main.querySelectorAll(".g-legend span").forEach((el) => { el.innerHTML = el.innerHTML.replace(/\{q:([^}]+)\}/g, (m, c) => SA.link("q", c)); });
  };

  // ---------- directory ----------
  V.gPeople = function (main, params) {
    main.innerHTML = `
      <header class="page-head g-head"><p class="kicker">Extended genealogy · directory</p><h1>Compiled profiles</h1>
        <p class="lede">All ${G.profiles.length} profiles, by record number, the order in which the compilers numbered the family. Profiles marked <span class="acc-mark">❝</span> are people who also appear in Grandpa's account.</p></header>
      <div class="filters">
        <input type="search" class="grow" placeholder="Filter by name, nickname, place or record number…" data-f="q" value="${esc(params.q || "")}" aria-label="Filter profiles" />
        <select data-f="branch" aria-label="Branch"><option value="">All branches</option>${G.branches.map((b) => `<option value="${b.id}">${esc(b.title)}</option>`).join("")}</select>
        <select data-f="acc" aria-label="In the account"><option value="">In the account or not</option><option value="yes">Also in Grandpa's account</option><option value="no">Only in the genealogy</option></select>
        <select data-f="sort" aria-label="Sort"><option value="rec">Sort by record</option><option value="az">Sort A–Z</option><option value="born">Sort by date</option></select>
      </div>
      <div class="people-grid g-grid" aria-live="polite"></div>`;
    const f = (k) => main.querySelector(`[data-f="${k}"]`);
    if (params.branch) f("branch").value = params.branch;
    if (params.acc) f("acc").value = params.acc;
    const grid = main.querySelector(".g-grid");
    const yr = (p) => { const m = String((p.life && (p.life.born || p.life.died)) || "").match(/\d{4}/); return m ? +m[0] : 9999; };
    const draw = () => {
      const q = f("q").value.trim(), br = f("branch").value, acc = f("acc").value;
      let list = G.profiles.filter((p) => (!br || p.branch === br) && (!acc || (acc === "yes" ? !!p.archive : !p.archive)));
      if (q) {
        const hits = new Set(SA.search(q, 400).filter((d) => d.type === "gprofile").map((d) => d.id));
        list = list.filter((p) => hits.has(p.id) || p.id === q);
      }
      if (f("sort").value === "az") list.sort((a, b) => a.name.split(" ").slice(-1)[0].localeCompare(b.name.split(" ").slice(-1)[0]) || a.name.localeCompare(b.name));
      else if (f("sort").value === "born") list.sort((a, b) => yr(a) - yr(b));
      grid.innerHTML = list.map((p) => {
        const rel = SA.gRelLabel(p.id);
        return `<a class="person-card gen-card${p.archive ? " in-account" : ""}" href="#/genealogy/person/${p.id}">
          <span class="pc-portrait">${SA.portrait(SA.gKind(p))}</span>
          <div class="pc-top"><span class="fam">Record ${esc(p.id)}</span>${p.living ? `<span class="tag">living</span>` : ""}${p.archive ? `<span class="tag tag-a" title="Also in Grandpa's account">❝ in the account</span>` : ""}${p.doubt ? `<span class="tag tag-doubt">⚑ doubtful link</span>` : ""}</div>
          <h3>${esc(p.name)}</h3>
          ${p.known ? `<div class="aka">“${esc(p.known)}”</div>` : ""}
          <div class="lf">${esc(SA.gLife(p))}</div>
          ${rel ? `<div class="rel">${esc(rel)}</div>` : ""}
          <p>${esc(branchTitle(p.branch))}</p>
        </a>`;
      }).join("") || `<p class="empty">No profiles match.</p>`;
    };
    main.querySelector(".filters").addEventListener("input", draw);
    draw();
  };

  // ---------- profile ----------
  V.gPerson = function (main, id) {
    const p = SA.gen[id];
    if (!p) return V.notFound(main);
    const parents = SA.gParents(id), spouses = SA.gSpouses(id), kids = SA.gChildren(id), sibs = SA.gSiblings(id);
    const coParents = kids.flatMap((k) => SA.gParents(k)).filter((x) => x !== id && !spouses.includes(x));
    const partners = [...new Set([...spouses, ...coParents])];
    const acc = p.archive && SA.people[p.archive];
    const diffs = SA.gDiffsFor(id);
    const full = true;
    const tree = SA.genTreeOf(id);
    const linkNote = (x) => p.linkNotes && p.linkNotes[x] ? `<div class="small note">Archive note: ${esc(p.linkNotes[x])}</div>` : "";
    const accRows = acc && full ? [["Born", acc.born, /^(birth|born|bapt)/i], ["Died", acc.died, /^(death|died|bur|bd)/i]].map(([l, a, re]) => {
      const gv = (p.fields || []).filter((f) => re.test(f.label)).map((f) => `${esc(f.label)}: ${text(f.value)}`).join("<br>");
      return a || gv ? `<tr><th>${l}</th><td>${a ? `${esc(a.display)} ${SA.badge(a.status, a.conf)}` : "—"}</td><td>${gv || "—"}</td></tr>` : "";
    }).join("") : "";
    main.innerHTML = `
      <article class="profile g-profile">
        <header class="profile-head g-profile-head has-portrait">
          <div class="head-portrait" title="Silhouette: ${esc(SA.KIND_LABEL[SA.gKind(p)])}">${SA.portrait(SA.gKind(p))}</div>
          <p class="kicker"><a href="#/genealogy">Extended genealogy</a> · Record ${esc(id)}${p.typedRec ? ` (typed “${esc(p.typedRec)}” in the file)` : ""} · ${esc(branchTitle(p.branch))}</p>
          <h1>${esc(p.name)}</h1>
          ${p.known ? `<p class="fullname">Known as “${esc(p.known)}”</p>` : ""}
          ${SA.gLife(p) ? `<p class="g-life">${esc(SA.gLife(p))}</p>` : ""}
          ${relLine(id)}
          <p class="g-prov"><span class="gl gl-profile">▦ Compiled profile</span> <span class="small">from <a href="${fileUrl(p.file)}" target="_blank" rel="noopener">${esc(p.file.split("/").slice(-2).join(" / "))}</a> · ${esc(TRANCHE[p.tranche] || "")}. Not from the recordings.</span></p>
          ${p.living ? `<div class="callout callout-sensitive"><div class="callout-label">Living person</div><p>The profile is shown in full, as the family has decided, except for addresses, which are left out.</p></div>` : ""}
          ${p.doubt ? `<div class="callout callout-doubt"><div class="callout-label">⚑ Archive note · doubtful parentage</div><p>${esc(p.doubt)}</p></div>` : ""}
          ${p.note ? `<div class="callout callout-note"><div class="callout-label">Archive note</div><p>${esc(p.note)}</p></div>` : ""}
        </header>
        <div class="profile-grid">
          <div class="profile-main">
            ${full && ((p.header || []).length || (p.fields || []).length) ? `<section class="block"><h2>As recorded in the profile</h2>
              ${(p.header || []).map((h) => `<p class="g-headline">${text(h)}</p>`).join("")}
              ${(p.fields || []).length ? `<table class="facts g-fields"><tbody>${p.fields.map((f) => `<tr><th scope="row">${esc(f.label)}</th><td>${text(f.value)}</td></tr>`).join("")}</tbody></table>` : ""}
              <p class="small muted">Copied from the profile as written. Record numbers in brackets refer to other profiles.</p></section>` : ""}
            ${full && (p.paras || []).length ? `<section class="block g-text-block"><h2>The full profile</h2>
              <div class="filters g-rev-filters">
                <label class="tog"><input type="checkbox" data-r="W" checked /> Highlight Grandpa's amendments <span class="count">${revCount(p, "W")}</span></label>
                <label class="tog"><input type="checkbox" data-r="7" /> Highlight 2011–12 revisions <span class="count">${revCount(p, "7")}</span></label>
                <label class="tog"><input type="checkbox" data-r="del" /> Show deleted text</label>
              </div>
              <div class="g-text show-W">${profileText(p.paras)}</div>
              ${p.addresses ? `<p class="small muted">${p.addresses > 1 ? "Addresses are" : "An address is"} left out of ${p.addresses} paragraph${p.addresses > 1 ? "s" : ""} of this profile.</p>` : ""}
            </section>` : ""}
            ${(p.alt || []).map((a) => `<section class="block g-alt"><h2>${esc(a.title)}</h2>
              <p class="small"><span class="gl gl-other">Others' research</span> By ${esc(a.by)} · <a href="${fileUrl(a.file)}" target="_blank" rel="noopener">${esc(a.file.split("/").slice(-2).join(" / "))}</a>. ${esc(a.about)}</p>
              <div class="g-text">${profileText(a.paras)}</div></section>`).join("")}
          </div>
          <aside class="profile-side">
            ${acc ? `<section class="side-card xcard xcard-a">
              <div class="xk"><span aria-hidden="true">❝</span> Grandpa's account · the original project</div>
              <h2><a href="#/person/${p.archive}">↩ ${esc(acc.name)}</a></h2>
              <p class="small">${SA.inline(acc.summary)}</p>
              ${p.archiveNote ? `<p class="small note">Archive note: ${esc(p.archiveNote)}</p>` : ""}
              ${accRows ? `<table class="xdates"><thead><tr><th></th><th>❝ The account</th><th>${GI} This profile</th></tr></thead><tbody>${accRows}</tbody></table>` : ""}
              ${diffs.length ? `<p class="small">⚑ ${diffs.map((d) => `<a href="#/genealogy/differences?d=${d.id}">${esc(d.title)}</a>`).join("; ")}</p>` : ""}
              ${xlinkA(p.archive, "↩ What Grandpa said")}
            </section>` : `<section class="side-card xcard xcard-none"><div class="xk">Not in Grandpa's account</div><p class="small">${esc(p.name)} does not appear in the recordings or in the account built from them.</p>${diffs.length ? `<p class="small">⚑ ${diffs.map((d) => `<a href="#/genealogy/differences?d=${d.id}">${esc(d.title)}</a>`).join("; ")}</p>` : ""}</section>`}
            <section class="side-card family-card">
              <h2>Family <span class="small muted">(as the profiles link them)</span></h2>
              <h3>Parents</h3><div class="pchips">${parents.map((x) => gChip(x)).join("") || "<span class='muted small'>No profile</span>"}${p.doubt ? `<div class="small">⚑ doubtful</div>` : ""}</div>
              ${partners.length ? `<h3>Spouses</h3>${partners.map((x) => `<div class="partner">${gChip(x)}${linkNote(x)}</div>`).join("")}` : ""}
              ${sibs.length ? `<h3>Brothers and sisters</h3><div class="pchips">${sibs.map((x) => gChip(x)).join("")}</div>` : ""}
              ${kids.length ? `<h3>Children</h3><div class="pchips">${kids.map((x) => gChip(x)).join("")}</div>` : ""}
              ${tree ? `<a class="btn small-btn" href="#/genealogy/tree/${tree}?focus=${id}">View in the genealogy tree</a>` : ""}
            </section>
            ${full && (revCount(p, "W") || revCount(p, "7")) ? `<section class="side-card"><h2>Revisions in the file</h2>
              <p class="small"><ins class="rv rv-W">Grandpa's amendments</ins> (“William Somerville”, 2021–22): ${revCount(p, "W")}<br><ins class="rv rv-7">Earlier revisions</ins> (“7”, 2011–12): ${revCount(p, "7")}</p>
              <p class="small muted">Counted from the tracked changes in the Word file. Untracked edits cannot be attributed.</p></section>` : ""}
          </aside>
        </div>
      </article>`;
    const box = main.querySelector(".g-text-block");
    if (box) box.querySelector(".g-rev-filters").addEventListener("change", (e) => {
      const r = e.target.dataset.r;
      if (r) box.querySelector(".g-text").classList.toggle(`show-${r}`, e.target.checked);
    });
  };

  // ---------- tree ----------
  V.gTree = function (main, tid, params) {
    main.classList.add("full");
    main.innerHTML = `<div class="tree-host"></div>`;
    SA.mountTree(main.querySelector(".tree-host"), { graph: "genealogy", tree: tid || (params.focus && SA.genTreeOf(params.focus)) || "all", focus: params.focus, view: params.view });
  };

  // ---------- differences ----------
  V.gDiff = function (main, params) {
    main.innerHTML = `
      <header class="page-head g-head"><p class="kicker">Extended genealogy · checked against the account</p><h1>Where the sources differ</h1>
        <p class="lede">Dates and versions on which Grandpa's account and the compiled profiles disagree. Neither is treated as settling the matter: both are shown, with what each rests on and what would decide it.</p></header>
      <div class="callout callout-g"><div class="callout-label">How to read this page</div>
        <p>On the left, <b>❝ Grandpa's account</b>: what he said, with transcript references, and the records the account uses. On the right, <b>${GI} the compiled genealogy</b>: what the profiles say, quoted. The note below each is ours. Where Grandpa's own words are contradicted by stronger documents, that is recorded on the account's <a href="#/corrections">Incorrect information</a> page instead; disagreements between two compilations are not corrections.</p></div>
      <div class="gdiffs">${SA.genDiffs.map((d) => `
        <article class="gdiff" id="d-${d.id}">
          <h2>${esc(d.title)}</h2>
          <div class="cgrid">
            <section class="gd-a"><h3><span aria-hidden="true">❝</span> In Grandpa's account</h3><p>${SA.inline(d.account)}</p>
              ${(d.people || []).length ? `<div class="chips">${d.people.map((x) => `<a class="chip xchip-a" href="#/person/${x}">↩ ${esc(SA.people[x].name)}</a>`).join("")}</div>` : ""}</section>
            <section class="gd-g"><h3>${GI} In the compiled genealogy</h3><p>${esc(d.genealogy)}</p>
              <div class="chips">${(d.profiles || []).map((x) => `<a class="chip xchip-g" href="#/genealogy/person/${x}">→ ${esc(SA.gen[x].name)} <small>${esc(x)}</small></a>`).join("")}</div></section>
          </div>
          <p class="gd-note"><span class="gl gl-note">Archive note</span> ${esc(d.note)}</p>
        </article>`).join("")}</div>`;
    if (params.d) { const el = main.querySelector(`#d-${CSS.escape(params.d)}`); if (el) { el.classList.add("target"); setTimeout(() => el.scrollIntoView({ block: "center" }), 30); } }
  };

  // ---------- sources and notes ----------
  V.gSources = function (main) {
    const n = (t) => G.profiles.filter((p) => p.tranche === t).length;
    const tot = (a) => G.profiles.reduce((s, p) => s + revCount(p, a), 0);
    const withRev = (a) => G.profiles.filter((p) => revCount(p, a)).length;
    const allText = G.profiles.map((p) => [...(p.header || []), ...(p.fields || []).map((f) => f.value), ...(p.paras || []).map(SA.gParaText)].join(" ")).join(" ");
    const sr = new Set((allText.match(/\bSR\s?\d{2,4}/g) || []).map((x) => x.replace(/\s/, "")));
    const typed = G.profiles.filter((p) => p.typedRec);
    const living = G.profiles.filter((p) => p.living);
    const addr = G.profiles.reduce((s, p) => s + (p.addresses || 0), 0);
    main.innerHTML = `
      <article class="profile narrow prose g-sources">
        <header class="profile-head g-profile-head"><p class="kicker">Extended genealogy · evidence</p><h1>Sources and notes</h1>
          <p class="lede">Where the compiled profiles come from, what they rest on, how they were prepared for this website, and what is withheld. The sources of Grandpa's account are listed separately, under <a href="#/sources">Sources and method</a>.</p></header>
        <h2>The files</h2>
        <p>The profiles are Word documents in the folder <a href="${fileUrl("research/David Gilmour amended records")}" target="_blank" rel="noopener"><code>research/David Gilmour amended records</code></a>, one per person, named by record number:</p>
        <ul>
          <li><b>Tranche 1</b>: ${n(1)} profiles of Major William Somerville's descendants and those they married (records 0563–0597, 0613–0634B and 0659–0696), most of them marked “amended”. The same profiles, in earlier versions, are also packed in <code>Section 1.rar</code> to <code>Section 6.rar</code> and <code>Further Amendments.zip</code>; the loose files are the latest versions, and are the ones used here.</li>
          <li><b>Tranche 2</b>: ${n(2)} profiles of the senior line and the early generations (records 0501–0581 and 0598–0658).</li>
          <li><b>Wendy</b>: a separate profile of Lucinda Simonton by Wendy Stevenson, shown beside the compiled one on <a href="#/genealogy/person/0587">Lucinda's profile</a>.</li>
          <li><b>Pictures</b>: 53 photographs taken in February and March 2022 of portraits, miniatures, silhouettes, houses and family groups, old and recent. They are unlabelled and include living children, so they are <b>not published</b> on the website; they remain in the folder as a lead for identifying the family's portraits.</li>
        </ul>
        <p>These appear to be the profiles Grandpa showed on screen in the second recording, “the ones as amended” {q:T3:167}, which he had begun for David Gilmour {q:T3:152}; the account cites them as <a href="#/sources?s=fam-profiles">the narrator's written profiles</a>.</p>
        <h2>Who compiled them</h2>
        <ul>
          <li><b>D. R. G. (David) Gilmour</b>, a cousin, compiled the profiles and much of the research marked “Further research”. The profiles say he is the son of Gillian Truell, a daughter of Vere Somerville and Edmund Truell (<a href="#/genealogy/person/0678">0678</a>, <a href="#/genealogy/person/0667">0667</a>).</li>
          <li><b>Grandpa</b>, William B. R. B. Somerville, who appears in the profiles as “WBRBS”, amended them in 2021–22 and added his own research and memories: ${tot("W")} tracked additions in ${withRev("W")} of the published profiles.</li>
          <li>An editor recorded only as <b>“7”</b> revised ${withRev("7")} profiles in 2011–12 (${tot("7")} tracked additions).</li>
          <li><b>Wendy Stevenson</b> in Canada, married to a descendant of Corry Somerville, and the files of <b>W. M. Stevenson</b>, for the North American family; correspondents such as Janet Friend are quoted where they contributed.</li>
          <li>Behind them all is the work of <b>Cecil B. Rooke</b> (Cecilia Somerville, <a href="#/genealogy/person/0675">0675</a>) and her brother <b>Reginald</b> (<a href="#/genealogy/person/0670">0670</a>), whose pedigree is the “Somerville Index”, and of <b>Lily Somerville</b> (<a href="#/genealogy/person/0659">0659</a>).</li>
        </ul>
        <h2>What the profiles cite</h2>
        <ul>
          <li><b>The Somerville Index</b>: the family tree produced by Cecil Rooke and Reginald Somerville and registered in the Genealogical Office, a copy of which Dorothy Rooke gave to David Gilmour (<a href="#/genealogy/person/0501">0501</a>). The National Library's list of the Rooke papers describes the registration of the Somerville pedigree in 1955 {s:nli-rooke}. It is itself a family compilation.</li>
          <li><b>“SR” numbers</b>: items in the family's Somerville Records (${sr.size} different items are cited), such as parish register extracts, wills, tombstones and admissions. They are summarised in the profiles; the archive has not seen them.</li>
          <li><b>“CRISP”</b>: the <i>Visitation of Ireland</i> of Howard and Crisp, which printed the family's pedigree in 1897 {s:visitation-1897}.</li>
          <li>Published works quoted at length: peerages and baronetages, the <i>Memorie of the Somervilles</i>, the Oxford Dictionary of National Biography, <i>Who Was Who</i>, the Australian Dictionary of Biography, newspapers, census returns and web pages, usually with the reference given in the profile.</li>
          <li>Family letters, diaries and papers, quoted or summarised, and family memory, including Grandpa's.</li>
        </ul>
        <p>The archive has checked none of these record by record for the genealogy. Where a profile and the account's own sources disagree, both are shown on <a href="#/genealogy/differences">Where the sources differ</a>.</p>
        <h2>How the text was prepared</h2>
        <ul>
          <li>Each document was converted from Word, and its tracked changes were read from the file: the current text is shown, with additions by “William Somerville” and by “7” highlighted on request and deletions available behind a switch. Red text in the files is not used to attribute anything, because it is not applied consistently.</li>
          <li>The wording, spelling and punctuation are the profiles' own, including their slips (“Gustavis”, “Cemetary”). Only runs of spaces and tabs are tidied, and pictures are marked but not reproduced.</li>
          <li>Record numbers follow the file names. ${typed.length} files carry a different number in their “Record No.” line (${typed.map((p) => `<a href="#/genealogy/person/${p.id}">${p.id}</a>`).join(", ")}), from an earlier numbering that some references in the text still use; references were matched by name as well as number.</li>
          <li>Two records are referred to but missing: 0629, Mary Dyas, and 0697, Joseph Barrett. The file for 0557 (Elizabeth Hamilton) contains a copy of her husband's profile instead of her own.</li>
          <li>Family links are taken from each profile's opening lines (“Son of …”, “Wife of …”) and marriage entries. Where they are doubtful or inconsistent, the profile carries an archive note.</li>
        </ul>
        <h2>Privacy</h2>
        <ul>
          <li>The profiles are published in full, including those of the ${living.length} living relatives, as the family decided in October 2026.</li>
          <li>Addresses are left out: present-day homes and postal addresses, the addresses of living people and of those who died since 1980 (including where living people were born), and Grandpa's house wherever it is named. ${addr} paragraphs carry the marker <span class="omit">[address omitted]</span>. E-mail addresses are removed. Addresses of people who died long ago are family history and are kept.</li>
          <li>The photographs filed with the profiles are not published: they are unlabelled and include children.</li>
          <li>The original files are in the repository folder as received.</li>
        </ul>
      </article>`;
    main.querySelectorAll(".g-sources p, .g-sources li").forEach((el) => { if (/\{[qs]:/.test(el.innerHTML)) el.innerHTML = el.innerHTML.replace(/\{([qs]):([^}]+)\}/g, (m, k, c) => SA.link(k, c)); });
  };
})();
