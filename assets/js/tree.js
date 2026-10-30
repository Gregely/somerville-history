/* Interactive descendant tree drawn in SVG, as a corkboard: each person is an
   archival card pinned to the cork with a painted silhouette, and the family
   relationships are strings running from pin to pin, with a wax seal for each
   marriage. Each family is a descendant tree from its earliest known ancestor;
   people who married in are drawn beside their partner, and a link takes you to
   their own family's tree. Layout is a simple recursive "tidy" layout. */
(function () {
  "use strict";
  const SA = window.SA;
  const esc = SA.esc;

  const W = 214, H = 98, CG = 34, HG = 30, VG = 92;
  const PIN = 6; // the pin sits at the top centre of each card; strings end there

  // The tree draws either collection through a small graph adapter: the
  // account's people (SA.people) or the extended genealogy's profiles (SA.gen).

  // Family trees. `stop` people are shown but their descendants continue in another tree.
  SA.TREES = [
    { id: "somerville", label: "Somerville", root: "james-somerville-1bt", stop: {}, anchor: "captain-william-somerville" },
    { id: "bellingham", label: "Bellingham of Castle Bellingham", root: "thomas-bellingham", stop: { "eliza-bellingham": "somerville" }, anchor: "henry-bellingham-ltcol" },
    { id: "clinch", label: "Clinch (brewers of Witney)", root: "mr-clinch", stop: { "margaret-hall-clinch": "somerville" } },
    { id: "johnson", label: "Johnson (maternal)", root: "zachariah-johnson", stop: { "honor-johnson": "somerville" } },
    { id: "truell", label: "Truell of Clonmannon", root: "truell-of-clonmannon", stop: {} },
    { id: "oconnor", label: "O'Connor", root: "oconnor-seaman", stop: { "eliza-oconnor": "somerville" } },
  ];
  // Trees of the extended genealogy: the whole family from James the Planter,
  // and each main branch on its own.
  SA.GTREES = [
    { id: "all", label: "Whole family, from James “the Planter”", short: "whole-family", root: "0501", stop: {}, anchor: "0525" },
    { id: "senior", label: "Senior line (baronets, Lords Athlumney)", short: "senior-line", root: "0535", stop: {} },
    { id: "ardrass", label: "Major William of Ardrass", short: "Ardrass", root: "0541", stop: {}, anchor: "0563" },
    { id: "america", label: "Corry Somerville's North American family", short: "North American", root: "0586", stop: {} },
    { id: "clermont", label: "Tenison Alan Somerville and Clermont", short: "Clermont", root: "0591", stop: {}, anchor: "0631" },
  ];

  function makeGraph(o) {
    const byId = Object.fromEntries(o.trees.map((t) => [t.id, t]));
    const g = { ...o, byId };
    const memberCache = {};
    g.members = (tid) => (memberCache[tid] = memberCache[tid] || (() => {
      const tree = byId[tid], out = new Set();
      const walk = (id) => {
        if (out.has(id)) return;
        out.add(id);
        for (const p of g.partnersOf(id)) out.add(p);
        if (tree.stop[id]) return;
        for (const c of g.childrenOf(id)) walk(c);
      };
      walk(tree.root);
      return out;
    })());
    g.descends = (id, root) => id === root || g.parentsOf(id).some((p) => g.descends(p, root));
    // The tree in which a person appears as a descendant (preferred) or at all.
    g.treeOf = (id) => {
      for (const t of o.trees) if (g.descends(id, t.root)) return t.id;
      for (const t of o.trees) if (g.members(t.id).has(id)) return t.id;
      return null;
    };
    // Where a married-in person's own family is drawn.
    g.originTree = (id, currentTree) => {
      if (!g.parentsOf(id).length) return null;
      for (const t of o.trees) if (t.id !== currentTree && g.descends(id, t.root)) return t.id;
      return null;
    };
    return g;
  }

  const ACCOUNT = makeGraph({
    key: "account",
    trees: SA.TREES,
    get: (id) => SA.people[id],
    parentsOf: SA.parentsOf, childrenOf: SA.childrenOf, partnersOf: SA.partnersOf,
    spouseConf: (a, b) => { const sp = SA.spousesOf(a).find((s) => s.id === b); return !sp ? "partner" : sp.conf === "low" ? "low" : ""; },
    parentConf: (id) => SA.people[id].parentConf,
    life: (p) => SA.shortLife(p),
    lifespan: (p) => SA.lifespan(p),
    cls: (p) => `fam-${p.family}`,
    isPlaceholder: (p) => !!p.placeholder,
    isLiving: (p) => !!(p.living || p.possiblyLiving),
    full: (p) => p.fullName || p.name,
    href: (id) => `#/person/${id}`,
    treeHref: (t, id) => `#/tree/${t}${id ? `?focus=${id}` : ""}`,
    narrator: "narrator",
    relLabel: (id) => SA.relLabel(id),
    kicker: (p) => `${SA.FAMILY[p.family] || ""} · ${SA.CATEGORY[p.category] || ""}`,
    summary: (p) => `<p>${SA.inline(p.summary)}</p>`,
    kind: (p) => SA.pKind(p),
    find: (v) => (SA.data.people.find((p) => p.name.toLowerCase() === v) || SA.search(v, 20).find((d) => d.type === "person") || {}).id,
    names: (ids) => ids.map((id) => SA.people[id].name),
    cross: (id) => SA.genOf[id] ? `<a class="btn xlink-g" href="#/genealogy/person/${SA.genOf[id]}">→ In the extended genealogy</a>` : "",
    lineLabel: "Narrator's line",
    unnamedToggle: true,
  });
  SA.treeMembers = (tid) => ACCOUNT.members(tid);
  SA.treeOf = (id) => ACCOUNT.treeOf(id);

  const GEN = makeGraph({
    key: "genealogy",
    trees: SA.GTREES,
    get: (id) => SA.gen[id],
    parentsOf: SA.gParents, childrenOf: SA.gChildren,
    partnersOf: (id) => { const out = SA.gSpouses(id).slice(); for (const c of SA.gChildren(id)) for (const par of SA.gParents(c)) if (par !== id && !out.includes(par)) out.push(par); return out; },
    spouseConf: () => "",
    parentConf: (id) => (SA.gen[id].doubt ? "low" : ""),
    life: (p) => SA.gLife(p),
    lifespan: (p) => SA.gLife(p),
    cls: (p) => `gen-card${p.archive ? " in-account" : ""}`,
    isPlaceholder: () => false,
    isLiving: (p) => !!p.living,
    full: (p) => p.name,
    href: (id) => `#/genealogy/person/${id}`,
    treeHref: (t, id) => `#/genealogy/tree/${t}${id ? `?focus=${id}` : ""}`,
    narrator: "0682",
    relLabel: (id) => SA.gRelLabel(id),
    kicker: (p) => `Record ${p.id} · ${(SA.genBranches[p.branch] || {}).title || ""}`,
    summary: (p) => (p.header || []).length ? `<p class="small">${SA.esc(SA.gPlain(p.header.join(" ")))}</p>` : "",
    kind: (p) => SA.gKind(p),
    find: (v) => (SA.data.genealogy.profiles.find((p) => p.name.toLowerCase() === v) || SA.search(v, 30).find((d) => d.type === "gprofile") || {}).id,
    names: (ids) => ids.map((id) => SA.gen[id].name),
    cross: (id) => SA.gen[id].archive ? `<a class="btn xlink-a" href="#/person/${SA.gen[id].archive}">↩ In Grandpa's account</a>` : "",
    lineLabel: "Grandpa's line",
    unnamedToggle: false,
  });
  SA.genTreeOf = (id) => GEN.treeOf(id);

  // ---------- layout ----------
  function layout(G, tree, opts) {
    const placed = new Set();
    const nodes = [], edges = [];
    const visible = (id) => opts.placeholders || !G.isPlaceholder(G.get(id));

    function measure(id) {
      placed.add(id);
      const partners = G.partnersOf(id);
      const stopTo = tree.stop[id];
      const allKids = G.childrenOf(id).filter(visible);
      const hidden = stopTo || opts.collapsed.has(id) ? allKids.length : 0;
      const kids = hidden ? [] : allKids.filter((k) => !placed.has(k));
      const groupsMap = new Map();
      for (const k of kids) {
        const co = G.parentsOf(k).find((x) => x !== id) || null;
        if (!groupsMap.has(co)) groupsMap.set(co, []);
        groupsMap.get(co).push(k);
      }
      const orderKeys = [partners[0] || null, null, ...partners.slice(1)];
      const groups = [];
      for (const key of [...new Set(orderKeys), ...groupsMap.keys()]) {
        if (groupsMap.has(key) && !groups.some((g) => g.partner === key)) groups.push({ partner: key, subs: groupsMap.get(key).map(measure) });
      }
      const cards = 1 + partners.length;
      const unitW = cards * W + (cards - 1) * CG;
      const subs = groups.flatMap((g) => g.subs);
      const kidsW = subs.reduce((a, s) => a + s.w, 0) + Math.max(0, subs.length - 1) * HG;
      return { id, partners, groups, unitW, kidsW, w: Math.max(unitW, kidsW), hidden, stopTo, total: allKids.length };
    }

    function place(m, left, depth) {
      const y = depth * (H + VG);
      const unitLeft = left + (m.w - m.unitW) / 2;
      let order;
      if (!m.partners.length) order = [m.id];
      else if (m.partners.length === 1) order = [m.id, m.partners[0]];
      else order = [m.partners[0], m.id, ...m.partners.slice(1)];
      const xs = {};
      order.forEach((pid, i) => {
        const x = unitLeft + i * (W + CG);
        xs[pid] = x;
        const isMain = pid === m.id;
        nodes.push({ id: pid, x, y, main: isMain, partnerOf: isMain ? null : m.id, hidden: isMain ? m.hidden : 0, stopTo: isMain ? m.stopTo : null, total: isMain ? m.total : 0, depth });
      });
      for (const pid of m.partners) {
        const a = Math.min(xs[pid], xs[m.id]) + W, b = Math.max(xs[pid], xs[m.id]);
        edges.push({ kind: "couple", d: `M${a - 6},${y + H / 2 - 4}Q${(a + b) / 2},${y + H / 2 + 3} ${b + 6},${y + H / 2 - 4}`, seal: [(a + b) / 2, y + H / 2], style: G.spouseConf(m.id, pid), a: m.id, b: pid });
      }
      let cursor = left + (m.w - m.kidsW) / 2;
      m.groups.forEach((g, gi) => {
        const anchorX = g.partner ? (xs[m.id] + xs[g.partner] + W) / 2 : xs[m.id] + W / 2;
        const anchorY = g.partner ? y + H / 2 : y + H;
        const busY = y + H + VG / 2 + (gi - (m.groups.length - 1) / 2) * 7;
        const childXs = [];
        for (const s of g.subs) {
          place(s, cursor, depth + 1);
          childXs.push({ x: cursor + s.w / 2, id: s.id });
          cursor += s.w + HG;
        }
        // Children's cards are centred in their subtree only when they have no partner on the right.
        const cx = childXs.map((c) => {
          const n = nodes.find((nd) => nd.id === c.id && nd.main);
          return { x: n.x + W / 2, id: c.id };
        });
        const minX = Math.min(anchorX, ...cx.map((c) => c.x)), maxX = Math.max(anchorX, ...cx.map((c) => c.x));
        const kids = cx.map((c) => c.id);
        // the cross-string sags a little between its ends, like a real string
        const sag = Math.min(12, (maxX - minX) * 0.035);
        const sagAt = (x) => { const t = maxX > minX ? (x - minX) / (maxX - minX) : 0.5; return busY + 4 * sag * t * (1 - t); };
        edges.push({ kind: "stem", d: `M${anchorX},${anchorY}L${anchorX},${sagAt(anchorX)}`, a: m.id, b: g.partner, kids });
        edges.push({ kind: "bus", d: maxX > minX ? `M${minX},${busY}Q${(minX + maxX) / 2},${busY + 2 * sag} ${maxX},${busY}` : `M${minX},${busY}`, a: m.id, b: g.partner, kids, kidX: Object.fromEntries(cx.map((c) => [c.id, c.x])), anchorX, sagAt });
        for (const c of cx) {
          const conf = G.parentConf(c.id);
          edges.push({ kind: "drop", d: `M${c.x},${sagAt(c.x)}L${c.x},${y + H + VG + PIN}`, style: conf === "low" ? "low" : conf === "medium" ? "medium" : "", a: m.id, child: c.id });
        }
      });
    }
    const m = measure(tree.root);
    place(m, 0, 0);
    const maxY = Math.max(...nodes.map((n) => n.y)) + H;
    return { nodes, edges, width: m.w, height: maxY };
  }

  // ---------- rendering ----------
  function wrap(text, max) {
    const words = text.split(/\s+/), lines = [];
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; }
      else cur = (cur + " " + w).trim();
    }
    if (cur) lines.push(cur);
    if (lines.length > 3) { lines.length = 3; lines[2] = lines[2].replace(/.{0,2}$/, "") + "…"; }
    return lines;
  }

  SA.mountTree = function (host, initial) {
    const G = initial.graph === "genealogy" ? GEN : ACCOUNT;
    const treeById = G.byId;
    const state = {
      tree: treeById[initial.tree] ? initial.tree : G.trees[0].id,
      focus: initial.focus || null,
      collapsed: new Set(),
      placeholders: true,
      lineHighlight: true,
      k: 1, tx: 0, ty: 0,
      view: initial.view || "chart",
    };
    const narratorAnc = new Set();
    (function walk(id) { if (!G.get(id)) return; narratorAnc.add(id); G.parentsOf(id).forEach(walk); })(G.narrator);

    host.innerHTML = `
      <div class="tree-shell">
        <div class="tree-toolbar" role="toolbar" aria-label="Family tree controls">
          <label class="sel"><span class="sr">Family</span>
            <select data-act="tree">${G.trees.map((t) => `<option value="${t.id}">${esc(t.label)}</option>`).join("")}</select>
          </label>
          <div class="find">
            <input type="search" placeholder="Find a person…" list="tree-people" data-act="find" aria-label="Find a person in the tree" />
            <datalist id="tree-people"></datalist>
          </div>
          <div class="seg" role="group" aria-label="View">
            <button data-act="view-chart" aria-pressed="true">Chart</button><button data-act="view-list" aria-pressed="false">Outline</button>
          </div>
          <div class="zoom" role="group" aria-label="Zoom">
            <button data-act="zoom-out" title="Zoom out" aria-label="Zoom out">−</button>
            <button data-act="fit" title="Fit to screen">Fit</button>
            <button data-act="zoom-in" title="Zoom in" aria-label="Zoom in">+</button>
          </div>
          <button class="fs-btn" data-act="fullscreen" aria-pressed="false" title="Full screen">⛶ <span>Full screen</span></button>
          <label class="tog"><input type="checkbox" data-act="line" checked /> ${G.lineLabel}</label>
          ${G.unnamedToggle ? `<label class="tog"><input type="checkbox" data-act="ph" checked /> Unnamed</label>` : ""}
        </div>
        <div class="tree-stage">
          <svg class="tree-svg" role="img" aria-label="Family tree chart"><g class="vp"></g></svg>
          <div class="tree-list" hidden></div>
          <aside class="tree-panel" hidden aria-live="polite"></aside>
          <div class="tree-legend">
            ${G.key === "genealogy" ? `<span><i class="lg lg-solid"></i>parent (as stated in the profiles)</span>
            <span><i class="lg lg-low"></i>doubtful</span>
            <span><i class="lg lg-acc"></i>also in Grandpa's account</span>` : `<span><i class="lg lg-solid"></i>parent (stated)</span>
            <span><i class="lg lg-medium"></i>parent (inferred)</span>
            <span><i class="lg lg-low"></i>uncertain</span>`}
            <span><i class="lg lg-line"></i>${G.key === "genealogy" ? "Grandpa's line" : "narrator's line"}</span>
            <span><i class="lg-seal" aria-hidden="true"></i>married</span>
            <span class="lg-sils">${SA.portrait("man")}${SA.portrait("woman")} adult · ${SA.portrait("boy")}${SA.portrait("girl")} died in childhood</span>
            <span class="hint">Drag to pan · scroll or pinch to zoom · click a card</span>
          </div>
        </div>
      </div>`;
    const $ = (s) => host.querySelector(s);
    const svg = $(".tree-svg"), vp = $(".vp"), panel = $(".tree-panel"), stage = $(".tree-stage"), list = $(".tree-list");
    let current = null;

    function applyT(animate) {
      vp.style.transition = animate ? "transform .45s cubic-bezier(.2,.7,.2,1)" : "none";
      vp.setAttribute("transform", `translate(${state.tx},${state.ty}) scale(${state.k})`);
      vp.style.transform = `translate(${state.tx}px,${state.ty}px) scale(${state.k})`;
    }
    // Fit the whole tree if it stays legible; otherwise show a readable part of it.
    function initialView() {
      fit(false);
      if (state.k >= 0.55) return;
      const t = treeById[state.tree];
      centerOn(t.anchor || t.root, false, 0.22);
    }
    function fit(animate) {
      if (!current) return;
      const r = svg.getBoundingClientRect();
      const pad = 40;
      const k = Math.min((r.width - pad * 2) / current.width, (r.height - pad * 2) / current.height, 1.1);
      state.k = Math.max(0.12, k);
      state.tx = (r.width - current.width * state.k) / 2;
      state.ty = pad;
      applyT(animate);
    }
    function centerOn(id, animate = true, yFrac = 0.5) {
      const n = current && current.nodes.find((x) => x.id === id && x.main) || current && current.nodes.find((x) => x.id === id);
      if (!n) return false;
      const r = svg.getBoundingClientRect();
      state.k = Math.max(state.k, r.width < 640 ? 0.7 : 0.85);
      state.tx = r.width / 2 - (n.x + W / 2) * state.k - (panel.hidden || r.width < 760 ? 0 : 160);
      state.ty = r.height * yFrac - (n.y + H / 2) * state.k;
      applyT(animate);
      return true;
    }

    function render() {
      const tree = treeById[state.tree];
      $('[data-act="tree"]').value = state.tree;
      current = layout(G, tree, state);
      const sel = state.focus;
      let html = "", shadows = "", seals = "";
      for (const e of current.edges) {
        const anc = (x) => x && narratorAnc.has(x);
        const onLine = state.lineHighlight && anc(e.a) && (
          e.kind === "couple" ? anc(e.b) : e.kind === "drop" ? anc(e.child) : e.kids.some(anc));
        // on a shared cross-string only the stretch leading to the narrator's ancestor is red
        const busLine = e.kind === "bus" && onLine;
        const cls = `e-${e.kind} ${e.style ? "e-" + e.style : ""} ${onLine && !busLine ? "on-line" : ""}`;
        shadows += `<path class="edge-shadow" d="${e.d}"/>`;
        html += `<path class="edge ${cls}" d="${e.d}"/>${e.style ? "" : `<path class="twist" d="${e.d}"/>`}`;
        if (busLine) for (const k of e.kids.filter(anc)) {
          const x0 = e.anchorX, x1 = e.kidX[k], pts = [];
          for (let i = 0; i <= 12; i++) { const x = x0 + ((x1 - x0) * i) / 12; pts.push(`${x.toFixed(1)},${e.sagAt(x).toFixed(1)}`); }
          html += `<path class="edge e-bus on-line" d="M${pts.join("L")}"/><path class="twist on-line" d="M${pts.join("L")}"/>`;
        }
        if (e.seal) seals += `<g class="seal ${e.style ? "seal-" + e.style : ""} ${onLine ? "on-line" : ""}" transform="translate(${e.seal[0]},${e.seal[1]})"><title>${e.style ? "Partners (uncertain)" : "Married"}</title><path d="M0,-9.5C3,-9.6 4.6,-7.6 6.6,-6.8S9.8,-3.2 9.6,0S8.4,4.6 6.8,6.6S3.2,9.8 0,9.6S-4.6,8.4 -6.6,6.8S-9.8,3.2 -9.6,0S-8.4,-4.6 -6.8,-6.6S-3,-9.4 0,-9.5Z"/><circle r="6"/><text y="3.6">∞</text></g>`;
      }
      for (const n of current.nodes) {
        const p = G.get(n.id);
        const lines = wrap(p.name, 17);
        const life = G.life(p);
        const living = G.isLiving(p);
        const cls = ["card", G.cls(p), n.main ? "main" : "spouse", G.isPlaceholder(p) ? "ph" : "", living ? "living" : "", n.id === sel ? "sel" : "", state.lineHighlight && narratorAnc.has(n.id) ? "on-line" : ""].join(" ");
        const origin = !n.main ? G.originTree(n.id, state.tree) : null;
        let extra = "";
        if (n.hidden && n.stopTo) extra = `<g class="more" data-goto="${n.stopTo}" data-focus="${n.id}"><rect x="${W / 2 - 62}" y="${H + 6}" width="124" height="20" rx="10"/><text x="${W / 2}" y="${H + 20}">${n.hidden} children ↘ ${esc(treeById[n.stopTo].short || treeById[n.stopTo].label.split(" ")[0])}</text></g>`;
        else if (n.hidden) extra = `<g class="more" data-expand="${n.id}"><rect x="${W / 2 - 46}" y="${H + 6}" width="92" height="20" rx="10"/><text x="${W / 2}" y="${H + 20}">+ ${n.hidden} hidden</text></g>`;
        else if (n.main && n.total && n.depth >= 0) extra = `<g class="fold" data-collapse="${n.id}" role="button" aria-label="Collapse ${esc(p.name)}'s descendants"><circle cx="${W / 2}" cy="${H + 8}" r="8"/><text x="${W / 2}" y="${H + 12}">−</text></g>`;
        if (origin) extra += `<g class="origin" data-goto="${origin}" data-focus="${n.id}"><title>Show ${esc(p.name)}'s own family</title><rect x="${W - 30}" y="-10" width="40" height="20" rx="10"/><text x="${W - 10}" y="4">↑ fam</text></g>`;
        const kind = G.kind(p);
        // each card hangs a little askew from its pin, consistently for each person
        let h = 0; for (const ch of n.id) h = (h * 31 + ch.charCodeAt(0)) | 0;
        const tilt = ((((h % 1000) + 1000) % 1000) / 1000 - 0.5) * 3.2;
        const nameY = lines.length === 1 ? 44 : lines.length === 2 ? 36 : 28;
        html += `<g class="${cls} k-${kind}" data-id="${n.id}" transform="translate(${n.x},${n.y})" tabindex="0" role="button" aria-label="${esc(p.name + (life ? ", " + life : ""))}">
          <title>${esc(G.full(p))}${life ? " (" + esc(life) + ")" : ""}</title>
          <g class="pinned" transform="rotate(${tilt.toFixed(2)} ${W / 2} ${PIN})">
            <rect class="bg" width="${W}" height="${H}" rx="2.5"/>
            <rect class="bar" width="${W}" height="4" rx="1"/>
            <path class="ruled" d="M78 ${H - 31}H${W - 10}M78 ${H - 13}H${W - 10}"/>
            <use class="sil" href="#sil-${kind}" x="9" y="13" width="60" height="72"/>
            <text class="nm" x="80" y="${nameY}">${lines.map((l, i) => `<tspan x="80" dy="${i ? 17 : 0}">${esc(l)}</tspan>`).join("")}</text>
            <text class="lf" x="80" y="${H - 17}">${esc(life || (G.isPlaceholder(p) ? "name not recorded" : living ? "living" : "dates unknown"))}</text>
            ${G.key === "genealogy" ? `<text class="rec" x="${W - 8}" y="18">№ ${esc(p.id)}</text>` : ""}
            ${living ? `<text class="lv" x="${W - 9}" y="${H - 4}"><title>Living or possibly living</title>living</text>` : ""}
          </g>
          <g class="pin" aria-hidden="true"><ellipse class="pin-sh" cx="${W / 2 + 2.5}" cy="${PIN + 3}" rx="6" ry="4"/><circle class="pin-head" cx="${W / 2}" cy="${PIN}" r="6.5"/><circle class="pin-hi" cx="${W / 2 - 2.2}" cy="${PIN - 2.2}" r="2"/></g>
          ${extra}
        </g>`;
      }
      vp.innerHTML = `<g class="strings-shadow">${shadows}</g>${html}${seals}`;
      // datalist
      $("#tree-people").innerHTML = G.names([...G.members(state.tree)]).map((n) => `<option value="${esc(n)}">`).join("");
      renderList();
    }

    function renderList() {
      const tree = treeById[state.tree];
      const seen = new Set();
      const li = (id) => {
        if (seen.has(id)) return "";
        seen.add(id);
        const p = G.get(id);
        const sp = G.partnersOf(id).map((s) => `<span class="ol-sp">∞ <a href="${G.href(s)}">${esc(G.get(s).name)}</a></span>`).join(" ");
        const kids = tree.stop[id] ? [] : G.childrenOf(id).filter((k) => state.placeholders || !G.isPlaceholder(G.get(k)));
        const cont = tree.stop[id] ? ` <a class="ol-cont" href="${G.treeHref(tree.stop[id], id)}">continues in ${esc(treeById[tree.stop[id]].label)} →</a>` : "";
        return `<li><a href="${G.href(id)}" class="${narratorAnc.has(id) ? "on-line" : ""}">${esc(p.name)}</a> <span class="ol-life">${esc(G.lifespan(p))}</span> ${sp}${cont}${kids.length ? `<ul>${kids.map(li).join("")}</ul>` : ""}</li>`;
      };
      list.innerHTML = `<ul class="outline">${li(tree.root)}</ul>`;
    }

    function showPanel(id) {
      const p = G.get(id);
      if (!p) return;
      const rel = G.relLabel(id);
      const chips = (ids) => ids.map((x) => `<button class="chip chip-p" data-sel="${x}">${esc(G.get(x).name)}</button>`).join(" ") || "<span class='muted'>—</span>";
      const origin = G.originTree(id, state.tree);
      const home = G.treeOf(id);
      panel.innerHTML = `
        <button class="close" data-act="close" aria-label="Close panel">×</button>
        <div class="panel-portrait" title="Silhouette: ${esc(SA.KIND_LABEL[G.kind(p)])}">${SA.portrait(G.kind(p))}</div>
        <div class="kicker">${esc(G.kicker(p))}</div>
        <h3>${esc(p.name)}</h3>
        <div class="life">${esc(G.lifespan(p))}</div>
        ${rel ? `<div class="rel">${esc(rel)}</div>` : ""}
        ${G.summary(p)}
        <dl>
          <dt>Parents</dt><dd>${chips(G.parentsOf(id))}</dd>
          <dt>Partners</dt><dd>${chips(G.partnersOf(id))}</dd>
          <dt>Children</dt><dd>${chips(G.childrenOf(id))}</dd>
        </dl>
        <div class="panel-actions">
          <a class="btn primary" href="${G.href(id)}">Open full profile</a>
          ${G.cross(id)}
          ${origin ? `<button class="btn" data-goto="${origin}" data-focus="${id}">Show own family</button>` : ""}
          ${home && home !== state.tree && !origin ? `<button class="btn" data-goto="${home}" data-focus="${id}">Show in ${esc(treeById[home].short || treeById[home].label.split(" ")[0])} tree</button>` : ""}
        </div>`;
      panel.hidden = false;
    }

    function select(id, { center = true, animate = true } = {}) {
      if (!G.members(state.tree).has(id)) {
        const t = G.treeOf(id);
        if (t) { state.tree = t; render(); }
      }
      state.focus = id;
      vp.querySelectorAll(".card.sel").forEach((n) => n.classList.remove("sel"));
      vp.querySelectorAll(`.card[data-id="${CSS.escape(id)}"]`).forEach((n) => n.classList.add("sel"));
      showPanel(id);
      if (center) centerOn(id, animate);
      history.replaceState(null, "", G.treeHref(state.tree, id));
    }

    // ---------- interaction ----------
    host.addEventListener("click", (ev) => {
      const t = ev.target.closest("[data-act],[data-sel],[data-goto],[data-expand],[data-collapse],.card");
      if (!t) return;
      if (t.dataset.goto) {
        ev.stopPropagation();
        state.tree = t.dataset.goto; state.collapsed.clear(); render(); initialView();
        if (t.dataset.focus) select(t.dataset.focus);
        return;
      }
      if (t.dataset.expand) { ev.stopPropagation(); state.collapsed.delete(t.dataset.expand); render(); return; }
      if (t.dataset.collapse) { ev.stopPropagation(); state.collapsed.add(t.dataset.collapse); render(); return; }
      if (t.dataset.sel) { select(t.dataset.sel); return; }
      const act = t.dataset.act;
      if (act === "zoom-in") zoomBy(1.25);
      else if (act === "zoom-out") zoomBy(0.8);
      else if (act === "fit") fit(true);
      else if (act === "fullscreen") {
        const on = SA.fullscreen(host);
        t.setAttribute("aria-pressed", on);
        t.title = on ? "Exit full screen" : "Full screen";
        t.querySelector("span").textContent = on ? "Exit full screen" : "Full screen";
      }
      else if (act === "close") { panel.hidden = true; }
      else if (act === "view-chart" || act === "view-list") setView(act === "view-list" ? "list" : "chart");
      else if (t.classList.contains("card")) { if (!dragMoved) select(t.dataset.id, { center: false }); }
    });
    host.addEventListener("dblclick", (ev) => {
      const c = ev.target.closest(".card");
      if (c) location.hash = G.href(c.dataset.id);
    });
    host.addEventListener("keydown", (ev) => {
      const c = ev.target.closest && ev.target.closest(".card");
      if (c && (ev.key === "Enter" || ev.key === " ")) { ev.preventDefault(); select(c.dataset.id); }
      if (ev.target.tagName === "INPUT" || ev.target.tagName === "SELECT") return;
      if (ev.key === "+" || ev.key === "=") zoomBy(1.2);
      if (ev.key === "-") zoomBy(0.83);
      if (ev.key === "0") fit(true);
    });
    $('[data-act="tree"]').addEventListener("change", (e) => { state.tree = e.target.value; state.focus = null; state.collapsed.clear(); panel.hidden = true; render(); initialView(); history.replaceState(null, "", G.treeHref(state.tree)); });
    $('[data-act="line"]').addEventListener("change", (e) => { state.lineHighlight = e.target.checked; render(); });
    if ($('[data-act="ph"]')) $('[data-act="ph"]').addEventListener("change", (e) => { state.placeholders = e.target.checked; render(); });
    $('[data-act="find"]').addEventListener("change", (e) => {
      const v = e.target.value.trim().toLowerCase();
      if (!v) return;
      const hit = G.find(v);
      if (hit) select(hit);
      e.target.value = "";
    });
    function setView(v) {
      state.view = v;
      svg.style.display = v === "list" ? "none" : "";
      list.hidden = v !== "list";
      $(".tree-legend").style.display = v === "list" ? "none" : "";
      $('[data-act="view-chart"]').setAttribute("aria-pressed", v === "chart");
      $('[data-act="view-list"]').setAttribute("aria-pressed", v === "list");
    }
    function zoomBy(f, cx, cy) {
      const r = svg.getBoundingClientRect();
      cx = cx == null ? r.width / 2 : cx; cy = cy == null ? r.height / 2 : cy;
      const k = Math.min(2.5, Math.max(0.1, state.k * f));
      state.tx = cx - (cx - state.tx) * (k / state.k);
      state.ty = cy - (cy - state.ty) * (k / state.k);
      state.k = k;
      applyT(false);
    }
    svg.addEventListener("wheel", (e) => {
      e.preventDefault();
      const r = svg.getBoundingClientRect();
      zoomBy(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    const pointers = new Map();
    let dragMoved = false, last = null, pinch = null;
    svg.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".more,.fold,.origin")) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      dragMoved = false;
      last = { x: e.clientX, y: e.clientY };
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: state.k };
      }
    });
    svg.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2 && pinch) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const r = svg.getBoundingClientRect();
        zoomBy((pinch.k * d) / pinch.d / state.k, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
        dragMoved = true;
        return;
      }
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      if (!dragMoved && Math.abs(dx) + Math.abs(dy) > 3) {
        dragMoved = true;
        // capture only once a drag starts, so plain clicks still reach the cards
        try { svg.setPointerCapture(e.pointerId); } catch (err) { /* pointer already released */ }
      }
      if (!dragMoved) return;
      state.tx += dx; state.ty += dy; last = { x: e.clientX, y: e.clientY };
      applyT(false);
    });
    const up = (e) => { pointers.delete(e.pointerId); if (pointers.size < 2) pinch = null; setTimeout(() => (dragMoved = false), 0); };
    svg.addEventListener("pointerup", up);
    svg.addEventListener("pointercancel", up);

    render();
    setView(state.view);
    requestAnimationFrame(() => {
      initialView();
      if (state.focus) select(state.focus, { animate: false });
    });
    return { select, fit };
  };
})();
