/* Taelos UI — generated from the design demo (see taelos-demo). Plain DOM, mounted by components/TaelosApp.tsx. */
import './engine.js';

const SHELL = `<aside class="side" aria-label="Main">
  <button class="brand" data-act="view" data-view="timeline">TÆLOS</button>
  <nav class="nav" id="nav"></nav>
  <div class="side-foot"><button data-act="theme"><svg class="i"><use href="#i-sun"/></svg><span class="theme-label">Light mode</span></button><a href="/classic"><svg class="i"><use href="#i-list"/></svg>Classic view</a><button data-act="sign-out"><svg class="i"><use href="#i-out"/></svg>Sign out</button></div>
</aside>

<main class="page" id="page">
  <header class="head"><div id="head"></div><button class="me" data-act="me" aria-label="Settings" aria-haspopup="menu"><svg class="i"><use href="#i-more"/></svg></button><div class="me-pop" id="me-pop" role="menu" hidden><button data-act="theme" role="menuitem"><svg class="i"><use href="#i-sun"/></svg><span class="theme-label">Light mode</span></button><a href="/classic" role="menuitem"><svg class="i"><use href="#i-list"/></svg>Classic view</a><button data-act="sign-out" role="menuitem"><svg class="i"><use href="#i-out"/></svg>Sign out</button></div></header>
  <div class="tabs-area" id="tabs-area" role="tablist" aria-label="Area"></div>
  <section class="add" id="add" aria-label="Add a task">
    <div class="add-line">
      <span class="add-plus" aria-hidden="true"><svg class="i"><use href="#i-plus"/></svg></span>
      <div class="add-field"><div class="add-ghost" id="add-ghost" aria-hidden="true"></div><textarea id="add-input" rows="1" autocomplete="off" autocapitalize="sentences" spellcheck="true" enterkeyhint="done" aria-label="New task"></textarea></div>
      <button class="add-area" id="add-area" type="button" data-act="areas" aria-haspopup="listbox" aria-expanded="false"></button>
    </div>
    <div class="add-hint" id="add-hint" aria-live="polite"></div>
    <div class="areas-pop" id="areas-pop" role="listbox" hidden></div>
    <div class="sugg" id="sugg" role="listbox" aria-label="Suggestions"></div>
    <div class="add-steps" id="add-steps"></div>
    <div class="add-foot"><button type="button" data-act="add-step">+ step</button><span id="add-tip"></span><button class="go" id="add-go" type="button" data-act="add-go" disabled>Add</button></div>
  </section>
  <p class="tip" id="tip" hidden></p>
  <div id="view"></div>
</main>

<div class="scrim" data-act="add-close"></div>
<button class="fab" data-act="add-open" aria-label="Add a task"><svg class="i"><use href="#i-plus"/></svg></button>
<div class="veil" id="veil" data-act="sheet-close" hidden></div>
<section class="sheet" id="sheet" role="dialog" aria-modal="true" hidden></section>
<div class="saving" id="saving" role="alert" hidden>Couldn’t save — retrying</div>
<div class="status" id="status" role="status"><span id="status-text"></span><button data-act="undo" hidden>Undo</button></div>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></symbol>
  <symbol id="i-out" viewBox="0 0 24 24"><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10"/></symbol>
  <symbol id="i-more" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
  <symbol id="i-list" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></symbol>
  <symbol id="i-timeline" viewBox="0 0 24 24"><path d="M6 4v16"/><circle cx="6" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><path d="M11 7h9M11 17h6"/></symbol>
  <symbol id="i-shelf" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"/></symbol>
  <symbol id="i-all" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></symbol>
  <symbol id="i-work" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 13h18"/></symbol>
  <symbol id="i-home" viewBox="0 0 24 24"><path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/></symbol>
  <symbol id="i-shopping" viewBox="0 0 24 24"><path d="M3 4h2.5l2.2 11h10.6L20.5 8H7"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></symbol>
  <symbol id="i-health" viewBox="0 0 24 24"><path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10z"/></symbol>
  <symbol id="i-music" viewBox="0 0 24 24"><path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></symbol>
  <symbol id="i-book" viewBox="0 0 24 24"><path d="M12 6.5C10.3 5.2 7.8 4.6 4 4.8v13c3.8-.2 6.3.4 8 1.7 1.7-1.3 4.2-1.9 8-1.7v-13c-3.8-.2-6.3.4-8 1.7z"/><path d="M12 6.5v13"/></symbol>
  <symbol id="i-code" viewBox="0 0 24 24"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/></symbol>
  <symbol id="i-pen" viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></symbol>
  <symbol id="i-people" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5"/></symbol>
  <symbol id="i-money" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 9.5v.01M17.5 14.5v.01"/></symbol>
  <symbol id="i-plane" viewBox="0 0 24 24"><path d="M10.5 13.5 4 11l1.5-1.5 7 1 4-4a2 2 0 0 1 3 3l-4 4 1 7L15 22l-2.5-6.5-3 3v2.5L8 22l-1-3-3-1 1.5-1.5H8z"/></symbol>
  <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19 13 11"/></symbol>
  <symbol id="i-game" viewBox="0 0 24 24"><path d="M7 8h10a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L14.5 13.5h-5L8.4 14.8A3 3 0 0 1 3 13v-1a4 4 0 0 1 4-4z"/><path d="M8 10.5v3M6.5 12h3M16 11.5v.01M17.5 13v.01"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path d="m12 4 2.4 5 5.4.7-4 3.8 1 5.4L12 16.3 7.2 18.9l1-5.4-4-3.8 5.4-.7z"/></symbol>
  <symbol id="i-car" viewBox="0 0 24 24"><path d="M5 16V12l2-5h10l2 5v4"/><path d="M3.5 16h17M5 12h14"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></symbol>
  <symbol id="i-paw" viewBox="0 0 24 24"><ellipse cx="12" cy="15.5" rx="4" ry="3.5"/><circle cx="6.5" cy="10.5" r="1.8"/><circle cx="17.5" cy="10.5" r="1.8"/><circle cx="9.5" cy="6.5" r="1.8"/><circle cx="14.5" cy="6.5" r="1.8"/></symbol>
  <symbol id="i-push" viewBox="0 0 24 24"><path d="m6 7 5 5-5 5M13 7l5 5-5 5"/></symbol>
  <symbol id="i-chip" viewBox="0 0 24 24"><path d="M4 20 14.5 9.5"/><path d="M6.5 6.5c4-3.2 9.8-2.8 13 1-3.4-1.2-6.4-.6-8.6 1.3"/><path d="M12.5 10.8c-1.9 2.2-2.5 5.2-1.3 8.6-3.8-3.2-4.2-9-1-13"/></symbol>
</svg>`;

/**
 * Mounts the Taelos interface into `root`.
 * host: { tasks, areas, ui, save(state), setTheme(t), signOut() }
 * Returns a cleanup function.
 */
export function mountTaelos(root, host) {
  const listeners = []; const timers = [];
  const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); listeners.push([target, type, fn, opts]); };
  root.innerHTML = SHELL;
  root.classList.add('taelos-app');

  const E = globalThis.TaelosEngine;
  // Areas are yours to edit: name, icon and colour, kept with your tasks.
  const DEFAULT_AREAS = [
    { id: 'work', label: 'Work', icon: 'work', color: '#7aa2f7' }, { id: 'home', label: 'Home', icon: 'home', color: '#bb9af7' },
    { id: 'shopping', label: 'Shopping', icon: 'shopping', color: '#ff9e64' }, { id: 'health', label: 'Health', icon: 'health', color: '#f7768e' },
    { id: 'music', label: 'Music', icon: 'music', color: '#9ece6a' },
  ];
  const AREA_ICONS = ['work', 'home', 'shopping', 'health', 'music', 'book', 'code', 'pen', 'people', 'money', 'plane', 'leaf', 'game', 'star', 'car', 'paw'];
  const AREA_COLORS = ['#7aa2f7', '#7dcfff', '#9ece6a', '#e0af68', '#ff9e64', '#f7768e', '#bb9af7', '#a9b1d6'];
  let AREAS = []; let areaById = {};
  const syncAreas = () => { AREAS = state.areas; areaById = Object.fromEntries(AREAS.map((a) => [a.id, a])); };
  const areaOf = (id) => areaById[id] || AREAS[0] || { id, label: id, icon: 'all', color: '#888' };
  const icon = (id) => `<svg class="i"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const uid = () => Math.random().toString(36).slice(2, 9);
  const now = () => new Date();
  const todayKey = () => E.dateKey(now());
  const inDays = (n) => E.dateKey(E.addDays(now(), n));
  const nextDow = (dow) => inDays(((dow - now().getDay() + 7) % 7) || 7);
  const whenText = (d, t) => E.label(d, t, now()).text;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const caretEnd = (el) => { if (!el) return; el.focus({ preventScroll: true }); const n = el.value.length; try { el.setSelectionRange(n, n); } catch (e) { /* ignore */ } };
  const ac = (area) => `--ac: ${areaOf(area).color}`;

  const UNITS = {
    minutes: { label: 'Time', amounts: [15, 30, 60], short: (n) => fmtTime(n), word: (n) => fmtTime(n) },
    pages: { label: 'Pages', amounts: [5, 10, 25], short: (n) => `${n}p`, word: (n) => `${n} page${n === 1 ? '' : 's'}` },
    words: { label: 'Words', amounts: [100, 250, 500], short: (n) => `${n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n}w`, word: (n) => `${n.toLocaleString()} words` },
    sessions: { label: 'Sessions', amounts: [1, 2, 3], short: (n) => `${n}×`, word: (n) => `${n} session${n === 1 ? '' : 's'}` },
  };
  function fmtTime(m) { return m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m}m`; }

  // ── State ──────────────────────────────────────────────────────────────
  function load() {
    return { tasks: host.tasks, areas: host.areas, history: [], view: 'timeline', area: 'all', lastArea: (host.areas[0] || {}).id, ...host.ui };
  }
  let state = load();
  if (!Array.isArray(state.areas) || !state.areas.length) state.areas = DEFAULT_AREAS.map((a) => ({ ...a }));
  syncAreas();
  const save = () => host.save(state);
  const opened = new Set();
  let showDone = false;
  let undo = null;

  function history() {
    const mine = state.tasks.concat(state.history).map((t) => ({ title: t.title, area: t.area, created: t.created, due: t.due, time: t.time, steps: (t.steps || []).map((s) => s.title) }));
    return mine;
  }
  let model = E.learn(history());
  const relearn = () => { model = E.learn(history()); };
  const snapshot = () => JSON.parse(JSON.stringify({ tasks: state.tasks, areas: state.areas }));
  const find = (id) => state.tasks.find((t) => t.id === id);
  const live = () => state.tasks.filter((t) => !t.shelved);
  const inArea = (t) => state.area === 'all' || t.area === state.area;
  function commit(label, before) { undo = before || null; save(); relearn(); render(); if (label) status(label); }

  // ── Rows ───────────────────────────────────────────────────────────────
  const VIEWS = { timeline: { label: 'Timeline', icon: 'timeline' }, tasks: { label: 'Tasks', icon: 'list' }, shelf: { label: 'Shelf', icon: 'shelf' } };
  function pct(t) {
    if (t.progress && t.progress.target) return Math.min(100, Math.round((t.progress.current / t.progress.target) * 100));
    if (t.steps.length) return Math.round((t.steps.filter((s) => s.done).length / t.steps.length) * 100);
    if (t.progress && t.progress.unit === 'minutes' && t.progress.current) return Math.min(100, Math.round((t.progress.current / 120) * 100));
    return 0;
  }
  function progText(t) {
    if (!t.progress || !t.progress.current) return '';
    const u = UNITS[t.progress.unit] || UNITS.sessions;
    return t.progress.target ? `${t.progress.current}/${u.short(t.progress.target)}` : u.short(t.progress.current);
  }
  function subHTML(t, timeline) {
    const b = [];
    if (t.pushes) b.push(`<span class="pushed" title="Pushed back ${t.pushes}×">${'›'.repeat(Math.min(t.pushes, 4))}</span>`);
    if (t.steps.length) b.push(`<span>${t.steps.filter((s) => s.done).length}/${t.steps.length}</span>`);
    const p = progText(t); if (p) b.push(`<span class="prog">${p}</span>`);
    if (t.due) {
      const l = E.label(t.due, t.time, now());
      // On the timeline the group heading already says the day; overdue rows say nothing about lateness.
      const text = timeline && l.days <= 1 ? (t.time && l.days >= 0 ? E.clock(t.time) : '') : l.text;
      if (text) b.push(`<span class="time ${l.state === 'today' ? 'now' : l.state === 'overdue' ? 'late' : ''}">${esc(text)}</span>`);
    }
    if (state.area === 'all') b.push(`<span class="adot" style="${ac(t.area)}" title="${areaOf(t.area).label}"></span>`);
    return b.join('');
  }
  function stepHTML(s, fresh) {
    return `<div class="step ${s.done ? 'done' : ''} ${fresh ? 'fresh' : ''}" data-step="${s.id}">
      <button class="check" data-act="step-done" aria-label="${s.done ? 'Undo' : 'Complete'} step: ${esc(s.title)}">${icon('check')}</button>
      <span class="st">${esc(s.title)}</span>${s.due ? `<span class="sd">${esc(whenText(s.due))}</span>` : ''}
      <button class="del" data-act="step-del" aria-label="Remove step">${icon('x')}</button></div>`;
  }
  function rowHTML(t, timeline) {
    const isOpen = opened.has(t.id);
    const nudge = t.pushes >= 3 && !t.done;
    const late = timeline && !t.done && t.due && t.due < todayKey();
    return `<div class="item ${t.done ? 'done' : ''} ${t._new ? 'appear' : ''}" data-id="${t.id}">
      <div class="swipe" aria-hidden="true"><span class="l"><span class="lh">›› push back</span><b></b></span><span class="r">shelve</span></div>
      <div class="row">
        <button class="check" style="--p:${pct(t)}" data-act="complete" aria-label="${t.done ? 'Mark not done' : 'Done'}: ${esc(t.title)}">${icon('check')}</button>
        <div class="main" data-act="open" role="button" tabindex="0" aria-expanded="${isOpen}"><span class="title">${esc(t.title)}</span><span class="sub">${subHTML(t, timeline)}</span></div>
        ${late ? `<span class="late-acts">
          <button class="la today" data-act="do-now" aria-label="Do ${esc(t.title)} today">Today</button>
          <button class="la push" data-act="push" aria-label="Push back ${esc(t.title)}" title="Push back">${icon('push')}</button>
        </span>` : `<span class="acts">
          <button class="act chip" data-act="chip" aria-label="Chip away at ${esc(t.title)}" title="Chip away">${icon('chip')}</button>
          <button class="act push" data-act="push" aria-label="Push back ${esc(t.title)}" title="Push back">${icon('push')}</button>
        </span>`}
      </div>
      ${isOpen ? `<div class="open-body">
        <div class="steps">${t.steps.map((s) => stepHTML(s)).join('')}</div>
        <label class="step-add" hidden><span class="plus">${icon('plus')}</span><input id="stepadd-${t.id}" data-act="step-add" placeholder="${t.steps.length ? 'Next step' : 'A step, e.g. “print worksheets tue”'}" autocomplete="off" enterkeyhint="enter"></label>
        <div class="quiet">${nudge ? `<span class="nudge">Pushed back ${t.pushes} times.<button data-act="do-now">Do it today</button><button data-act="shelve">Shelve it</button></span>` : ''}
          <button data-act="chip">Chip away</button><button data-act="push">Push back</button><button data-act="step-new">+ step</button><button data-act="edit">Edit</button><button data-act="more-acts" aria-label="More">⋯</button><span class="more-acts">${nudge ? '' : '<button data-act="shelve">Shelve</button>'}<button class="danger" data-act="delete">Delete</button></span></div>
      </div>` : ''}
    </div>`;
  }

  // ── Views ──────────────────────────────────────────────────────────────
  const byDue = (a, b) => (a.due || '9999').localeCompare(b.due || '9999') || (a.time || '99').localeCompare(b.time || '99');
  function chrome() {
    const openCount = live().filter((t) => !t.done).length;
    $('#nav').innerHTML = Object.entries(VIEWS).map(([id, v]) => `<button class="${state.view === id ? 'on' : ''}" data-act="view" data-view="${id}">${icon(v.icon)}<span>${v.label}</span><small>${id === 'tasks' ? openCount : id === 'shelf' ? state.tasks.filter((t) => t.shelved).length : ''}</small></button>`).join('');
    const scoped = live().filter((t) => !t.done && inArea(t));
    const today = scoped.filter((t) => t.due === todayKey()).length;
    const overdue = scoped.filter((t) => t.due && t.due < todayKey()).length;
    const date = new Intl.DateTimeFormat('en', { weekday: 'short', day: 'numeric', month: 'short' }).format(now());
    const eyebrow = state.view === 'shelf' ? `${state.tasks.filter((t) => t.shelved && inArea(t)).length} shelved` : `${date}${overdue ? ` · ${overdue} overdue` : ''} · ${today} today · ${scoped.length} open`;
    const counts = { timeline: '', tasks: openCount, shelf: state.tasks.filter((t) => t.shelved).length };
    $('#head').innerHTML = `<div class="eyebrow">${esc(eyebrow)}</div><h1 class="views">${Object.entries(VIEWS).map(([id, v]) => `<button data-k="v${id}" class="${state.view === id ? 'on' : ''}" data-act="view" data-view="${id}" aria-current="${state.view === id ? 'page' : 'false'}">${v.label}${state.view !== id && counts[id] ? `<span class="n">${counts[id]}</span>` : ''}</button>`).join('')}</h1>`;
    const n = (id) => live().filter((t) => !t.done && (id === 'all' || t.area === id)).length;
    $('#tabs-area').innerHTML = [{ id: 'all', label: 'All' }].concat(AREAS).map((a) => `<button role="tab" data-k="a${a.id}" class="${state.area === a.id ? 'on' : ''}" ${a.id !== 'all' ? `style="${ac(a.id)}"` : ''} data-act="area" data-area="${a.id}" aria-selected="${state.area === a.id}" aria-label="${esc(a.label)}" title="${esc(a.label)}${a.id !== 'all' ? ' · hold to edit' : ''}">${icon(a.id === 'all' ? 'all' : a.icon)}<span class="lbl">${esc(a.label)}</span><span class="n">${n(a.id) || ''}</span></button>`).join('') + '<button class="tab-add" data-act="area-new" aria-label="New area" title="New area">' + icon('plus') + '</button>';
    const showAdd = state.view === 'tasks' || document.body.classList.contains('composing');
    $('#add').hidden = !showAdd;
    $('#tip').hidden = !!state.seenTip || state.view === 'shelf';
    $('#tip').textContent = 'Tap the circle to finish · hold it to chip away or push back · swipe a row right to push, left to shelve.';
    $('.fab').hidden = state.view === 'tasks' && !window.matchMedia('(max-width: 820px)').matches;
  }
  function timelineView() {
    const tasks = live().filter((t) => !t.done && inArea(t)).sort(byDue);
    const t0 = todayKey(); const dow = now().getDay();
    const endWeek = inDays((7 - dow) % 7); const endNext = inDays(((7 - dow) % 7) + 7);
    const doneToday = live().filter((t) => t.done && inArea(t) && t.doneAt && E.dateKey(new Date(t.doneAt)) === t0).length;
    const groups = [
      { k: 'Overdue', p: 'Its day has passed', f: (t) => t.due && t.due < t0, cls: 'late' },
      { k: 'Today', p: 'What needs your attention now', f: (t) => t.due === t0, cls: 'now' },
      { k: 'Tomorrow', p: 'Coming up next', f: (t) => t.due === inDays(1), cls: 'soon' },
      { k: 'This week', p: 'Before Sunday', f: (t) => t.due > inDays(1) && t.due <= endWeek },
      { k: 'Next week', p: 'The week after', f: (t) => t.due > endWeek && t.due <= endNext },
      { k: 'Later', p: 'Further out', f: (t) => t.due > endNext },
      { k: 'Whenever', p: 'No date yet', f: (t) => !t.due },
    ];
    if (!tasks.length) return `<div class="empty"><b>${doneToday ? 'All done for today.' : 'Nothing on the timeline.'}</b>${state.area === 'all' ? '<button data-act="go-add">Add a task →</button>' : 'Nothing in this area.'}</div>`;
    return `<div class="tl">${groups.map((g) => {
      const items = tasks.filter(g.f); if (!items.length) return '';
      const c = g.cls === 'now' ? `${items.length} left${doneToday ? ` · ${doneToday} done` : ''}` : items.length;
      return `<section class="tl-group ${g.cls || ''}"><header class="tl-head" data-k="h${g.k}"><h2>${g.k}</h2><p>${g.p}</p><span class="c">${c}</span></header><div class="tl-items">${items.map((t) => rowHTML(t, true)).join('')}</div></section>`;
    }).join('')}</div>`;
  }
  function tasksView() {
    const open_ = live().filter((t) => !t.done && inArea(t)).sort(byDue);
    const done = live().filter((t) => t.done && inArea(t));
    const body = open_.length ? open_.map((t) => rowHTML(t, false)).join('') : '<div class="empty"><b>Nothing open here.</b>Type above to add one.</div>';
    const doneBlock = done.length ? `<button class="more-done" data-k="more-done" data-act="toggle-done">${done.length} done${showDone ? '' : ' · show'}</button>${showDone ? done.map((t) => rowHTML(t, false)).join('') : ''}` : '';
    return body + doneBlock;
  }
  function shelfView() {
    const items = state.tasks.filter((t) => t.shelved && inArea(t));
    if (!items.length) return '<div class="empty"><b>The shelf is empty.</b>Shelve anything you want out of the way without losing it.</div>';
    return items.map((t) => `<div class="item" data-id="${t.id}"><div class="row">
      <div class="main"><span class="title">${esc(t.title)}</span><span class="sub">${t.pushes ? `<span class="pushed">${'›'.repeat(Math.min(t.pushes, 4))}</span>` : ''}${state.area === 'all' ? `<span class="adot" style="${ac(t.area)}"></span>` : ''}</span></div>
      <span class="quiet"><button data-act="unshelve" data-when="today">Today</button><button data-act="unshelve" data-when="none">Back</button></span></div></div>`).join('');
  }
  // ── Motion ─────────────────────────────────────────────────────────────
  // Each render measures what's on screen first, then animates the difference (FLIP):
  // rows that moved glide to their new place, new rows ease in, removed rows leave the way
  // they went (push → right, shelve → left), and switching view or area slides the list.
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
  let motion = null; let rendered = false; let lastInk = null;
  const keyOf = (el) => (el.dataset.id ? `i${el.dataset.id}` : el.dataset.k);
  function measure() {
    const m = new Map(); const vh = window.innerHeight;
    $$('#view .item[data-id], #view [data-k], #head [data-k], #tabs-area [data-k]').forEach((el) => {
      const r = el.getBoundingClientRect(); if (r.bottom > -150 && r.top < vh + 150) m.set(keyOf(el), { r, el });
    });
    return m;
  }
  function slideIn(dir) {
    const els = $$('#view .tl-head, #view .item, #view .empty, #view .more-done').filter((el) => { const r = el.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0; }).slice(0, 16);
    const from = dir ? `translateX(${dir * 16}px)` : 'translateY(8px)';
    els.forEach((el, i) => el.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: 'none' }], { duration: 280, delay: i * 18, easing: EASE, fill: 'backwards' }));
  }
  function ghost(el, r, how) {
    if (r.height < 4 || !el.classList.contains('item')) return false;
    el.classList.add('ghost-row'); el.classList.remove('appear');
    Object.assign(el.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    $('#view').parentElement.appendChild(el);
    const to = how === 'right' ? 'translateX(36px)' : how === 'left' ? 'translateX(-36px)' : 'scale(0.97)';
    el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0.2, offset: 0.6 }, { opacity: 0, transform: to }], { duration: 170, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }).onfinish = () => el.remove();
    return true;
  }
  function play(before, hint) {
    const after = measure(); const sliding = hint && 'switch' in hint;
    let ghosts = 0;
    before.forEach(({ r, el }, k) => { if (!after.has(k) && !sliding && k[0] === 'i' && ghost(el, r, hint && hint.leave)) ghosts += 1; });
    after.forEach(({ r, el }, k) => {
      const inView = !!el.closest('#view');
      if (sliding && inView) return;
      const b = before.get(k);
      if (!b) { if (inView) el.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: 70, easing: EASE, fill: 'backwards' }); return; }
      const dx = b.r.left - r.left, dy = b.r.top - r.top; const sc = k[0] === 'v' ? b.r.height / r.height : 1;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(1 - sc) < 0.01) return;
      if (sc !== 1) el.style.transformOrigin = '0 100%';
      const ty = sc !== 1 ? (b.r.bottom - r.bottom) : dy;
      el.animate([{ transform: `translate(${dx}px, ${ty}px) scale(${sc})` }, { transform: 'none' }], { duration: Math.min(420, 260 + Math.abs(dy) / 6), delay: ghosts ? 110 : 0, easing: EASE, fill: 'backwards' });
    });
    if (sliding) slideIn(hint.switch);
    if (hint && hint.grow) {
      const body = $(`.item[data-id="${hint.grow}"] .open-body`);
      if (body) { const h = body.offsetHeight; body.style.overflow = 'hidden'; body.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 240, easing: EASE }).onfinish = () => { body.style.overflow = ''; }; }
    }
  }
  function leaveThen(id, how, done) {
    const it = $(`#view .item[data-id="${id}"]`);
    if (calm.matches || !it) { done(); return; }
    const h = it.offsetHeight; const to = how === 'left' ? 'translateX(-32px)' : how === 'right' ? 'translateX(32px)' : 'scale(0.97)';
    it.style.overflow = 'hidden'; it.style.pointerEvents = 'none';
    it.animate([{ opacity: 1, transform: 'none', height: `${h}px` }, { opacity: 0, transform: to, height: `${h}px`, offset: 0.45 }, { opacity: 0, transform: to, height: '0px' }], { duration: 340, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }).onfinish = done;
  }
  function collapse(body, done) {
    if (calm.matches || !body) { done(); return; }
    body.style.overflow = 'hidden';
    body.animate([{ height: `${body.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 190, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }).onfinish = done;
  }
  function placeInk(animate) {
    const bar = $('#tabs-area'); const on = bar && $('button.on', bar); if (!on) return;
    const el = document.createElement('i'); el.className = 'tab-ink'; bar.appendChild(el); bar.classList.add('inked');
    const x = on.offsetLeft + 10, w = Math.max(8, on.offsetWidth - 20);
    const c = getComputedStyle(on).getPropertyValue('--ac').trim() || getComputedStyle(bar).getPropertyValue('--accent').trim();
    Object.assign(el.style, { transform: `translateX(${x}px)`, width: `${w}px`, background: c });
    if (animate && lastInk && (lastInk.x !== x || lastInk.w !== w)) el.animate([{ transform: `translateX(${lastInk.x}px)`, width: `${lastInk.w}px`, background: lastInk.c }, { transform: `translateX(${x}px)`, width: `${w}px`, background: c }], { duration: 320, easing: EASE });
    lastInk = { x, w, c };
  }
  function render() {
    const hint = motion; motion = null;
    const animate = rendered && !calm.matches;
    const before = animate ? measure() : null;
    chrome();
    $('#view').innerHTML = state.view === 'timeline' ? timelineView() : state.view === 'tasks' ? tasksView() : shelfView();
    state.tasks.forEach((t) => delete t._new);
    paintArea();
    placeInk(animate);
    if (animate) play(before, hint);
    else if (!rendered && !calm.matches) slideIn(0);
    rendered = true;
  }

  // ── Add line ───────────────────────────────────────────────────────────
  const addEl = $('#add'), input = $('#add-input'), stepsEl = $('#add-steps');
  const comp = { picked: null, literal: false, quiet: false, suggestions: [], hot: 0, area: null, auto: null, hint: null };
  const captureArea = () => comp.area || (state.area !== 'all' ? state.area : comp.auto || state.lastArea);
  function areaFromWords(text) {
    const key = text.toLowerCase().replace(/\s+/g, ' ').trim(); if (!key) return null;
    const pool = model.byTitle.get(key) || model.byVerb.get(key.split(' ')[0]) || [];
    if (pool.length < 2) return null;
    const counts = {}; pool.forEach((h) => { counts[h.area] = (counts[h.area] || 0) + 1; });
    return Object.entries(counts).sort((x, y) => y[1] - x[1])[0][0];
  }
  function paintArea() {
    const a = captureArea();
    $('#add-area').innerHTML = `<span class="dot" style="${ac(a)}"></span>${areaOf(a).label}`;
    $('#add-area').setAttribute('aria-label', `Area: ${areaOf(a).label}. Change`);
    input.placeholder = 'Add a task…';
    const pop = $('#areas-pop');
    if (!pop.hidden) pop.innerHTML = AREAS.map((x) => `<button type="button" role="option" class="${a === x.id ? 'on' : ''}" data-act="pick-area" data-area="${x.id}"><span class="dot" style="${ac(x.id)}"></span>${x.label}</button>`).join('') + '<button type="button" class="new" data-act="area-new">+ New area…</button>';
  }
  const stepInputs = () => $$('input', stepsEl);
  function addStep(afterEl, text = '', focus = true) {
    const row = document.createElement('div'); row.className = 'add-step';
    row.innerHTML = `<input autocomplete="off" enterkeyhint="next" aria-label="Step" placeholder="${stepInputs().length ? 'Next step' : 'First step'}"><span class="sd"></span>`;
    const el = row.firstChild; el.value = text;
    if (afterEl && afterEl.closest('.add-step')) afterEl.closest('.add-step').after(row); else stepsEl.prepend(row);
    paintStep(el); if (focus) caretEnd(el); foot(); return el;
  }
  function paintStep(el) { const sp = E.splitLine(el.value, now()); el.nextSibling.textContent = sp.when ? whenText(sp.when.date, sp.when.time) : ''; }
  function removeStep(el) { const all = stepInputs(); const i = all.indexOf(el); el.closest('.add-step').remove(); caretEnd(i > 0 ? all[i - 1] : input); foot(); }
  const parsedMain = () => (comp.literal ? { title: input.value.trim() } : E.splitLine(input.value, now()));

  function paintAdd() {
    const raw = input.value; const p = parsedMain();
    const active = document.activeElement === input || !!raw.trim() || stepInputs().length > 0 || document.body.classList.contains('composing');
    addEl.classList.toggle('open', active);
    comp.suggestions = raw.trim() && !p.when && !comp.picked && !comp.quiet ? E.suggest(model, raw, now(), 2) : [];
    comp.suggestions.forEach((s) => { s.existing = live().find((t) => !t.done && t.title.toLowerCase() === s.title.toLowerCase()) || null; });
    if (comp.hot >= comp.suggestions.length) comp.hot = 0;
    // The typed text is drawn here so the time phrase can change colour in place; the ghost is the top suggestion's tail.
    const top = comp.suggestions[comp.hot];
    const atEnd = input.selectionStart === raw.length;
    let html = esc(raw);
    if (p.when && p.phrase) { const i = raw.toLowerCase().lastIndexOf(p.phrase.toLowerCase()); if (i >= 0) html = `${esc(raw.slice(0, i))}<span class="when">${esc(raw.slice(i, i + p.phrase.length))}</span>${esc(raw.slice(i + p.phrase.length))}`; }
    else if (top && atEnd && raw && !comp.quiet && top.title.toLowerCase().startsWith(raw.toLowerCase())) html += `<span class="ghost">${esc(top.title.slice(raw.length))}</span>`;
    $('#add-ghost').innerHTML = html + '\u200b';
    const titleText = (p.title || raw).trim();
    const guess = titleText ? (E.suggest(model, titleText, now(), 1)[0] || null) : null;
    const verb = titleText ? E.verbHint(model, `${titleText} x`, now()) : null;
    comp.auto = (guess && guess.title.toLowerCase().startsWith(titleText.toLowerCase()) && guess.area) || (verb && verb.area) || areaFromWords(titleText);
    comp.hint = !p.when && !comp.picked && raw.trim() && !comp.suggestions.length ? E.verbHint(model, raw, now()) : null;
    const when = p.when || (comp.picked && comp.picked.when) || null;
    const hint = $('#add-hint');
    if (when) { hint.className = 'add-hint when'; hint.innerHTML = `<button type="button" data-act="no-when" title="Keep these words as text">${esc(whenText(when.date, when.time))}</button>`; }
    else if (comp.hint) { hint.className = 'add-hint guess'; hint.innerHTML = `<button type="button" data-act="use-hint" title="When your “${esc(comp.hint.verb)}” tasks usually happen">${esc(whenText(comp.hint.when.date, comp.hint.when.time))}?</button>`; }
    else if (comp.literal && raw.trim()) { hint.className = 'add-hint'; hint.innerHTML = '<button type="button" data-act="when-back">no date</button>'; }
    else { hint.className = 'add-hint'; hint.innerHTML = ''; }
    $('#sugg').innerHTML = comp.suggestions.map((s, i) => {
      const k = raw.length; const starts = s.title.toLowerCase().startsWith(raw.toLowerCase());
      const meta = s.existing ? `<span class="onlist">already on your list</span>` : [s.usualDay ? '<span class="usual">usual today</span>' : '', s.when ? esc(whenText(s.when.date, s.when.time)) : '', s.steps.length ? `${s.steps.length} steps` : '', s.area && s.area !== captureArea() ? areaOf(s.area).label : ''].filter(Boolean).join(' · ');
      return `<button type="button" role="option" aria-selected="${i === comp.hot}" class="${i === comp.hot ? 'hot' : ''}" data-act="pick" data-i="${i}"><span class="t">${starts ? `<b>${esc(s.title.slice(0, k))}</b>${esc(s.title.slice(k))}` : esc(s.title)}</span><span class="m">${meta}</span></button>`;
    }).join('');
    paintArea(); foot();
  }
  function foot() {
    $('#add-go').disabled = !parsedMain().title;
    const n = stepInputs().length;
    $('#add-tip').textContent = comp.suggestions.length ? 'Tab to use the suggestion' : n ? 'Return on an empty step adds the task' : 'Return adds · Tab for a step';
  }
  function pick(i) {
    const s = comp.suggestions[i]; if (!s) return;
    if (s.existing) { const id = s.existing.id; if (state.area !== 'all' && state.area !== s.existing.area) state.area = 'all'; clearAdd(); closeAdd(); opened.add(id); render(); const el = $(`.item[data-id="${id}"]`); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); status('Already on your list'); return; }
    input.value = s.title; comp.picked = s; comp.literal = true; if (s.area) comp.area = s.area;
    stepsEl.innerHTML = ''; s.steps.slice().reverse().forEach((t) => addStep(null, t, false));
    paintAdd(); caretEnd(input);
  }
  function submit() {
    const p = parsedMain(); if (!p.title) { caretEnd(input); return; }
    const when = p.when || (comp.picked && comp.picked.when) || null; const area = captureArea();
    const steps = stepInputs().map((el) => el.value.trim()).filter(Boolean).map((text) => { const sp = E.splitLine(text, now()); return { id: uid(), title: sp.title, due: sp.when ? sp.when.date : undefined, done: false }; });
    const task = { id: uid(), title: p.title.charAt(0).toUpperCase() + p.title.slice(1), area, due: when ? when.date : undefined, time: when ? when.time : undefined, steps, done: false, pushes: 0, progress: null, log: [], created: new Date().toISOString(), _new: true };
    state.tasks.unshift(task); state.lastArea = area;
    clearAdd(); undo = null; save(); relearn();
    if (state.view !== 'tasks' && !document.body.classList.contains('composing')) state.view = 'tasks';
    render(); caretEnd(input);
  }
  function clearAdd() { input.value = ''; stepsEl.innerHTML = ''; Object.assign(comp, { picked: null, literal: false, quiet: false, hot: 0, area: null, auto: null }); $('#areas-pop').hidden = true; $('#add-area').setAttribute('aria-expanded', 'false'); paintAdd(); }
  function openAdd() { document.body.classList.add('composing'); addEl.classList.add('docked'); addEl.hidden = false; caretEnd(input); paintAdd(); }
  function closeAdd() { document.body.classList.remove('composing'); addEl.classList.remove('docked'); input.blur(); chrome(); paintAdd(); }

  input.addEventListener('input', () => {
    if (/\n/.test(input.value)) input.value = input.value.replace(/\s*\n\s*/g, ' ');
    const v = input.value;
    if (comp.picked && v !== comp.picked.title) { comp.picked = null; comp.literal = false; }
    if (!v) { comp.literal = false; comp.quiet = false; }
    comp.hot = 0;
    if (/\s\+$/.test(v)) { input.value = v.replace(/\s\+$/, ''); addStep(stepInputs().pop() || null); paintAdd(); return; }
    paintAdd();
  });
  input.addEventListener('focus', paintAdd);
  input.addEventListener('blur', () => setTimeout(paintAdd, 150));
  input.addEventListener('keydown', (e) => {
    if (e.isComposing) return;
    const atEnd = input.selectionStart === input.value.length;
    if (comp.suggestions.length && ((e.key === 'Tab' && !e.shiftKey) || (e.key === 'ArrowRight' && atEnd))) { e.preventDefault(); pick(comp.hot); return; }
    if (e.key === 'Tab' && !e.shiftKey && input.value.trim()) { e.preventDefault(); const f = stepInputs()[0]; if (f) caretEnd(f); else addStep(null); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); if (comp.suggestions.length) { comp.hot = (comp.hot + 1) % comp.suggestions.length; paintAdd(); } else { const f = stepInputs()[0]; if (f) caretEnd(f); } return; }
    if (e.key === 'ArrowUp' && comp.suggestions.length) { e.preventDefault(); comp.hot = (comp.hot + comp.suggestions.length - 1) % comp.suggestions.length; paintAdd(); return; }
    if (e.key === 'Enter') { e.preventDefault(); submit(); return; }
    if (e.key === 'Escape') { e.preventDefault(); if (comp.suggestions.length) { comp.quiet = true; paintAdd(); } else if (!comp.literal && E.splitLine(input.value, now()).when) { comp.literal = true; paintAdd(); } else if (input.value || stepInputs().length) clearAdd(); else closeAdd(); }
  });
  stepsEl.addEventListener('input', (e) => { if (e.target.tagName === 'INPUT') { paintStep(e.target); foot(); } });
  stepsEl.addEventListener('keydown', (e) => {
    const el = e.target; if (el.tagName !== 'INPUT' || e.isComposing) return;
    const all = stepInputs(); const i = all.indexOf(el);
    if (e.key === 'Enter') { e.preventDefault(); if (el.value.trim()) addStep(el); else { el.closest('.add-step').remove(); submit(); } }
    else if (e.key === 'Backspace' && !el.value) { e.preventDefault(); removeStep(el); }
    else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) { e.preventDefault(); caretEnd(i > 0 ? all[i - 1] : input); }
    else if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey && el.value.trim())) { e.preventDefault(); if (all[i + 1]) caretEnd(all[i + 1]); else if (e.key === 'Tab') addStep(el); }
    else if (e.key === 'Escape') { e.preventDefault(); caretEnd(input); }
  });

  // ── Status line ────────────────────────────────────────────────────────
  let statusTimer;
  function status(text) {
    $('#status-text').textContent = text; $('#status button').hidden = !undo;
    $('#status').classList.add('show'); clearTimeout(statusTimer);
    statusTimer = setTimeout(() => $('#status').classList.remove('show'), 3600);
  }
  const taskOf = (el) => { const it = el.closest('[data-id]'); return it ? find(it.dataset.id) : null; };

  // ── Sheets: push back, chip away, edit ─────────────────────────────────
  let sheet = null; const sheetEl = $('#sheet');
  function showSheet(type, t, focusSel) { if (closing) { clearTimeout(closing); closing = null; sheetEl.classList.remove('closing'); $('#veil').classList.remove('closing'); } sheet = { type, id: t.id }; paintSheet(); sheetEl.hidden = false; $('#veil').hidden = false; if (type === 'push') wireSlider(t); if (focusSel) caretEnd($(focusSel, sheetEl)); }
  function wireSlider(t) {
    const track = $('#ps-track'); if (!track) return;
    const st = pushStops(t); let cur = -1;
    const show = (sel) => {
      const f = sel.show; $('#ps-thumb').style.left = `${f * 100}%`; $('#ps-fill').style.width = `${f * 100}%`;
      $$('.ps-tick', track).forEach((k, i) => { k.classList.toggle('passed', i < sel.i); k.classList.toggle('hot', i === sel.i); });
      const w = $('#ps-when');
      if (sel.i < 0) { w.textContent = 'Drag to push back'; w.className = 'idle'; $('#ps-sub').textContent = t.due ? `now ${whenText(t.due, t.time)}` : 'no date yet'; } else { w.textContent = st[sel.i].label; w.className = ''; $('#ps-sub').textContent = st[sel.i].sub; }
      $('#ps-thumb').setAttribute('aria-valuenow', String(sel.i + 1)); $('#ps-thumb').setAttribute('aria-valuetext', sel.i < 0 ? 'Not moved' : st[sel.i].label);
      if (sel.i !== cur) { if (sel.i >= 0) tick(); cur = sel.i; }
    };
    const at = (x) => { const r = track.getBoundingClientRect(); return Math.max(0, Math.min(1, (x - r.left) / r.width)); };
    track.addEventListener('pointerdown', (e) => {
      e.preventDefault(); track.classList.add('dragging'); try { track.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      show(pickStop(at(e.clientX), st));
      const move = (ev) => show(pickStop(at(ev.clientX), st));
      const up = () => {
        track.classList.remove('dragging'); track.removeEventListener('pointermove', move); track.removeEventListener('pointerup', up); track.removeEventListener('pointercancel', up);
        if (cur >= 0) { const s = st[cur]; show({ i: cur, show: stopPos(cur, st.length) }); setTimeout(() => pushTo(t, s.due, s.time, snapshot()), 160); }
        else show({ i: -1, show: 0 });
      };
      track.addEventListener('pointermove', move); track.addEventListener('pointerup', up); track.addEventListener('pointercancel', up);
    });
    $('#ps-thumb').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); const i = Math.min(st.length - 1, cur + 1); show({ i, show: stopPos(i, st.length) }); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); const i = Math.max(-1, cur - 1); show({ i, show: i < 0 ? 0 : stopPos(i, st.length) }); }
      else if (e.key === 'Enter' && cur >= 0) { e.preventDefault(); e.stopPropagation(); const s = st[cur]; pushTo(t, s.due, s.time, snapshot()); }
    });
  }
  // Area sheet: add or edit an area.
  let areaDraft = null;
  function areaSheet() {
    const d = areaDraft; const isNew = !d.id;
    const count = isNew ? 0 : state.tasks.filter((t) => t.area === d.id).length;
    const others = AREAS.filter((a) => a.id !== d.id);
    return `<div class="sh-head" style="--ac:${d.color}"><div><div class="sh-k">${isNew ? 'New area' : 'Edit area'}</div>
        <input class="a-name" id="area-name" value="${esc(d.label)}" placeholder="Name, e.g. Uni" autocomplete="off" enterkeyhint="done" aria-label="Area name"></div>
        <button class="xbtn" data-act="sheet-close" aria-label="Close">${icon('x')}</button></div>
      <div class="sec" style="--ac:${d.color}"><span class="lbl">Icon</span><div class="a-icons">${AREA_ICONS.map((k) => `<button class="${d.icon === k ? 'on' : ''}" data-act="area-icon" data-icon="${k}" aria-label="${k}">${icon(k)}</button>`).join('')}</div></div>
      <div class="sec"><span class="lbl">Colour</span><div class="a-colors">${AREA_COLORS.map((c) => `<button class="${d.color === c ? 'on' : ''}" style="--c:${c}" data-act="area-color" data-color="${c}" aria-label="Colour ${c}"></button>`).join('')}</div></div>
      ${d.confirmDelete ? `<div class="a-del"><p style="margin:0">${count ? `Delete <b>${esc(d.label)}</b>? Its ${count === 1 ? 'task moves' : `${count} tasks move`} to:` : `Delete <b>${esc(d.label)}</b>?`}</p>
          <div class="pills">${count ? others.map((a) => `<button class="pill" style="--ac:${a.color}" data-act="area-delete" data-to="${a.id}"><span class="dot"></span>${esc(a.label)}</button>`).join('') : '<button class="pill" data-act="area-delete">Delete</button>'}<button class="pill" data-act="area-keep">Keep it</button></div></div>` : ''}
      <div class="foot">${!isNew && others.length && !d.confirmDelete ? '<button class="btn danger" data-act="area-ask-delete">Delete</button>' : ''}<span class="sp"></span>
        <span class="a-preview" style="--ac:${d.color}">${icon(d.icon)}${esc(d.label || 'New area')}</span>
        <button class="btn primary" data-act="area-save">${isNew ? 'Add' : 'Done'}</button></div>`;
  }
  function openArea(id) {
    const a = id ? areaById[id] : null;
    const used = new Set(AREAS.map((x) => x.color));
    areaDraft = a ? { ...a } : { id: null, label: '', icon: AREA_ICONS.find((k) => !AREAS.some((x) => x.icon === k)) || 'star', color: AREA_COLORS.find((c) => !used.has(c)) || AREA_COLORS[0] };
    $('#areas-pop').hidden = true;
    if (closing) { clearTimeout(closing); closing = null; sheetEl.classList.remove('closing'); $('#veil').classList.remove('closing'); }
    sheet = { type: 'area', id: null }; sheetEl.innerHTML = areaSheet(); sheetEl.hidden = false; $('#veil').hidden = false;
    caretEnd($('#area-name'));
  }
  function repaintArea() { const v = $('#area-name') ? $('#area-name').value : areaDraft.label; areaDraft.label = v; sheetEl.innerHTML = areaSheet(); const n = $('#area-name'); if (n) caretEnd(n); }
  function saveArea() {
    const label = ($('#area-name').value || '').trim(); if (!label) { caretEnd($('#area-name')); return; }
    const before = snapshot();
    if (areaDraft.id) { const a = areaById[areaDraft.id]; Object.assign(a, { label, icon: areaDraft.icon, color: areaDraft.color }); }
    else {
      let id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'area'; while (areaById[id]) id += '-2';
      state.areas.push({ id, label, icon: areaDraft.icon, color: areaDraft.color });
      if (addEl.classList.contains('open') || document.body.classList.contains('composing')) comp.area = id;
    }
    syncAreas(); closeSheet(); commit(areaDraft.id ? `Saved ${label}` : `Added ${label}`, before);
  }
  function deleteArea(to) {
    const before = snapshot(); const id = areaDraft.id; const name = areaDraft.label;
    const target = to || (AREAS.find((a) => a.id !== id) || {}).id;
    state.tasks.forEach((t) => { if (t.area === id) t.area = target; });
    state.history.forEach((h) => { if (h.area === id) h.area = target; });
    state.areas = state.areas.filter((a) => a.id !== id); syncAreas();
    if (state.area === id) state.area = 'all';
    if (state.lastArea === id) state.lastArea = target;
    if (comp.area === id) comp.area = null;
    closeSheet(); commit(`Deleted ${name}${to ? ` · tasks moved to ${areaOf(target).label}` : ''}`, before);
  }
  let closing = null;
  function closeSheet() {
    sheet = null; if (sheetEl.hidden) return;
    const veil = $('#veil'); const end = () => { closing = null; sheetEl.classList.remove('closing'); veil.classList.remove('closing'); if (!sheet) { sheetEl.hidden = true; veil.hidden = true; sheetEl.innerHTML = ''; } };
    if (calm.matches) { end(); return; }
    sheetEl.classList.add('closing'); veil.classList.add('closing'); clearTimeout(closing); closing = setTimeout(end, 170);
  }
  function paintSheet() { if (sheet && sheet.type === 'area') { repaintArea(); return; } const t = sheet && find(sheet.id); if (!t) { closeSheet(); return; } sheetEl.innerHTML = sheet.type === 'push' ? pushSheet(t) : sheet.type === 'chip' ? chipSheet(t) : editSheet(t); }
  const head = (k, t) => `<div class="sh-head"><div><div class="sh-k">${k}</div><div class="sh-t">${esc(t.title)}</div></div><button class="xbtn" data-act="sheet-close" aria-label="Close">${icon('x')}</button></div>`;

  function pushOptions(t) {
    const n = now(); let opts = [];
    if (n.getHours() < 18) opts.push({ k: 'later', label: 'Later today', due: todayKey(), time: '19:00' });
    opts.push({ k: 'tomorrow', label: 'Tomorrow', due: inDays(1), time: t.time });
    const dow = n.getDay();
    if (dow >= 1 && dow <= 4) opts.push({ k: 'weekend', label: 'This weekend', due: inDays(6 - dow), time: undefined });
    opts.push({ k: 'nextweek', label: 'Next week', due: nextDow(1), time: undefined });
    if (t.due && t.due > todayKey()) opts = opts.filter((o) => o.due > t.due);
    if (!opts.length) opts.push({ k: 'week-later', label: 'A week later', due: E.dateKey(E.addDays(E.fromKey(t.due), 7)), time: t.time });
    return opts;
  }
  // Push-back stops, worked out from now; only ever later than the task's current slot.
  function pushStops(t) {
    const n = now(); const hm = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const t0 = todayKey(); const stops = [];
    const long = (k) => new Intl.DateTimeFormat('en', { weekday: 'long' }).format(E.fromKey(k));
    const short = (k) => new Intl.DateTimeFormat('en', { weekday: 'short', day: 'numeric', month: 'short' }).format(E.fromKey(k));
    const add = (due, time, name, sub) => stops.push({ due, time, name: name || whenText(due, time), sub: sub || '' });
    const h = n.getHours();
    if (h < 22) { const d = new Date(n); d.setMinutes(Math.ceil((d.getMinutes() + 60) / 15) * 15, 0, 0); add(E.dateKey(d), hm(d), 'In an hour', E.clock(hm(d))); }
    if (h < 7) add(t0, '09:00');
    if (h < 12) add(t0, '14:00', 'This afternoon');
    if (h < 17) add(t0, '19:00');
    if (h < 20) add(t0, '21:00');
    ['09:00', '14:00', '19:00', '21:00'].forEach((tm) => add(inDays(1), tm));
    const d2 = E.fromKey(inDays(2)).getDay();
    add(inDays(2), undefined, d2 === 6 || d2 === 0 ? 'This weekend' : long(inDays(2)), d2 === 6 || d2 === 0 ? long(inDays(2)) : '');
    const dow = n.getDay();
    const sat = inDays(((6 - dow + 7) % 7) || 7);
    if (sat > inDays(2)) add(sat, undefined, dow === 0 ? 'Next weekend' : 'This weekend', long(sat));
    const mon = nextDow(1); if (mon > inDays(2)) add(mon, undefined, 'Next week', long(mon));
    const nsat = E.dateKey(E.addDays(E.fromKey(mon), 5)); add(nsat, undefined, 'Next weekend', short(nsat));
    const eom = E.dateKey(new Date(n.getFullYear(), n.getMonth() + 1, 0, 12));
    if (eom > stops[stops.length - 1].due) add(eom, undefined, 'End of month', short(eom));
    const key = (x) => `${x.due} ${x.time || '23:59'}`;
    const cur = t.due ? `${t.due} ${t.time || (t.due < t0 ? '00:00' : '23:59')}` : '';
    let out = stops.filter((x, i) => (i === 0 || key(x) > key(stops[i - 1])) && (!cur || t.due < t0 || key(x) > cur));
    if (!out.length) { const b = E.dateKey(E.addDays(E.fromKey(t.due), 7)); out = [{ due: b, time: t.time, name: 'A week later', sub: short(b) }]; }
    return out.map((x) => ({ ...x, label: x.name }));
  }
  // Stop i sits at (i/(n-1))^1.45 along the track: the later the stop, the longer the pull.
  const START = 0.07;
  const stopPos = (i, n) => (n === 1 ? 0.6 : START + (1 - START) * Math.pow(i / (n - 1), 1.45));
  function pickStop(f, stops) {
    if (f < START * 0.55) return { i: -1, show: Math.max(0, f) };
    let best = 0, bd = Infinity;
    stops.forEach((_, i) => { const d = Math.abs(stopPos(i, stops.length) - f); if (d < bd) { bd = d; best = i; } });
    // Magnet: the handle leans towards the stop it's nearest, so each one feels like a detent.
    const p = stopPos(best, stops.length);
    return { i: best, show: f + (p - f) * 0.55 };
  }
  const tick = () => { try { if (navigator.vibrate) navigator.vibrate(6); } catch (e) { /* ignore */ } };

  function pushSheet(t) {
    return `${head('Push back', t)}
      ${t.pushes >= 3 ? `<div class="nudge-line">Pushed back ${t.pushes} times already.<button data-act="do-now">Do it today</button><button data-act="shelve">Shelve it</button></div>` : ''}
      ${(() => { const st = pushStops(t); return `<div class="ps">
        <div class="ps-read"><b id="ps-when" class="idle">Drag to push back</b><small id="ps-sub">${t.due ? `now ${esc(whenText(t.due, t.time))}` : 'no date yet'}</small></div>
        <div class="ps-track" id="ps-track"><div class="ps-fill" id="ps-fill"></div>${st.map((_, i) => `<span class="ps-tick" style="left:${(stopPos(i, st.length) * 100).toFixed(2)}%"></span>`).join('')}
          <div class="ps-thumb" id="ps-thumb" role="slider" tabindex="0" aria-label="Push back to" aria-valuemin="0" aria-valuemax="${st.length}" aria-valuenow="0" aria-valuetext="Not moved">${icon('push')}</div></div>
        <div class="ps-ends"><span>${esc(st[0].label)}</span><span>${esc(st[st.length - 1].label)}</span></div></div>`; })()}
      <div class="fld"><input id="push-when" placeholder="or a day: fri, 14 oct, in 3 days" autocomplete="off" enterkeyhint="done" aria-label="Push to"><span class="out" id="push-out"></span></div>`;
  }
  function relDay(iso) { const diff = E.diffDays(E.dateKey(new Date(iso)), todayKey()); return diff === 0 ? 'Today' : diff === -1 ? 'Yesterday' : new Intl.DateTimeFormat('en', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso)); }
  function chipSheet(t) {
    const p = t.progress || { unit: 'minutes', current: 0 }; const u = UNITS[p.unit] || UNITS.minutes;
    const pc = p.target ? Math.min(100, Math.round((p.current / p.target) * 100)) : null;
    const log = (t.log || []).slice(-4).reverse();
    return `${head('Chip away', t)}
      <div class="meter"><div class="big"><b>${p.unit === 'minutes' ? fmtTime(p.current) : p.current.toLocaleString()}</b><span>${p.unit === 'minutes' ? 'so far' : `${u.label.toLowerCase()}${p.target ? ` of ${p.target.toLocaleString()}` : ' so far'}`}</span>${pc !== null ? `<span class="pct">${pc}%</span>` : ''}</div>${pc !== null ? `<div class="bar"><i style="--w:${pc}%"></i></div>` : ''}</div>
      <div class="seg" role="tablist">${Object.entries(UNITS).map(([k, v]) => `<button role="tab" aria-selected="${p.unit === k}" class="${p.unit === k ? 'on' : ''}" data-act="chip-unit" data-unit="${k}">${v.label}</button>`).join('')}</div>
      <div class="amounts">${u.amounts.map((n) => `<button data-act="chip-add" data-n="${n}">+${p.unit === 'minutes' ? fmtTime(n) : n}</button>`).join('')}</div>
      <div class="fld"><input id="chip-custom" inputmode="numeric" placeholder="${p.unit === 'minutes' ? 'other, in minutes' : `other, in ${u.label.toLowerCase()}`}" autocomplete="off" enterkeyhint="done"><button class="btn quiet" data-act="chip-custom">Add</button></div>
      <div class="fld"><input id="chip-goal" inputmode="numeric" placeholder="${p.unit === 'minutes' ? 'goal in minutes' : `goal in ${u.label.toLowerCase()}`}" value="${p.target || ''}" autocomplete="off" enterkeyhint="done"><button class="btn quiet" data-act="chip-goal">Set goal</button></div>
      ${t.steps.length ? `<div class="sec"><span class="lbl">Steps</span><div class="steps">${t.steps.map((s) => stepHTML(s)).join('')}</div></div>` : ''}
      ${log.length ? `<div class="sec"><span class="lbl">Recent</span><ul class="log">${log.map((l) => `<li><span>${esc(relDay(l.at))}</span><b>+${(UNITS[l.unit] || UNITS.sessions).word(l.n)}</b></li>`).join('')}</ul></div>` : ''}
      <div class="foot"><button class="btn quiet" data-act="sheet-close">Done for now</button><span class="sp"></span><button class="btn primary" data-act="finish">${icon('check')}Finish task</button></div>`;
  }
  function editSheet(t) {
    return `<div class="sh-head"><div><div class="sh-k">Edit</div><input class="tt" id="edit-title" value="${esc(t.title)}" aria-label="Title" autocomplete="off"></div><button class="xbtn" data-act="sheet-close" aria-label="Close">${icon('x')}</button></div>
      <div class="sec"><span class="lbl">Steps</span><div class="steps" id="edit-steps">${t.steps.map((s) => stepHTML(s)).join('')}</div><label class="step-add"><span class="plus">${icon('plus')}</span><input id="edit-step" placeholder="Add a step" autocomplete="off" enterkeyhint="enter"></label></div>
      <div class="sec"><span class="lbl">When</span><div class="fld"><input id="edit-when" placeholder="${t.due ? esc(whenText(t.due, t.time)) : 'fri 3pm, next week, none'}" autocomplete="off" enterkeyhint="done"><span class="out" id="edit-when-out">${t.due ? esc(whenText(t.due, t.time)) : 'no date'}</span></div></div>
      <div class="sec"><span class="lbl">Area</span><div class="pills">${AREAS.map((a) => `<button class="pill ${t.area === a.id ? 'on' : ''}" style="${ac(a.id)}" data-act="edit-area" data-area="${a.id}"><span class="dot"></span>${a.label}</button>`).join('')}<button class="pill" data-act="area-new">+ New</button></div></div>
      <div class="foot"><button class="btn quiet" data-act="shelve">Shelve</button><button class="btn danger" data-act="delete">Delete</button><span class="sp"></span><button class="btn primary" data-act="sheet-close">Done</button></div>`;
  }

  // ── Actions ────────────────────────────────────────────────────────────
  let suppressClick = false;
  function finish(t, before) { t.done = true; t.doneAt = new Date().toISOString(); opened.delete(t.id); commit(`Done · ${t.title}`, before); }
  function pushTo(t, due, time, before) { state.seenTip = true; t.due = due; t.time = time; t.pushes = (t.pushes || 0) + 1; opened.delete(t.id); closeSheet(); motion = { leave: 'right' }; commit(`Pushed to ${whenText(due, time)}  ${'›'.repeat(Math.min(t.pushes, 4))}`, before); }
  function addProgress(t, n, before) {
    if (!n || n <= 0) return; state.seenTip = true;
    t.progress = t.progress || { unit: 'minutes', current: 0 }; t.progress.current += n;
    t.log = (t.log || []).concat({ at: new Date().toISOString(), n, unit: t.progress.unit });
    undo = before; save(); render(); paintSheet();
    status(`+${(UNITS[t.progress.unit] || UNITS.sessions).word(n)} · ${t.title}${t.progress.target && t.progress.current >= t.progress.target ? ' · goal reached' : ''}`);
  }

  on(document, 'click', (e) => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    if (suppressClick) { suppressClick = false; return; }
    const act = el.dataset.act; const t = taskOf(el) || (sheet && find(sheet.id)); const before = snapshot();
    switch (act) {
      case 'view': { const order = Object.keys(VIEWS); const d = Math.sign(order.indexOf(el.dataset.view) - order.indexOf(state.view)); if (!d) { window.scrollTo({ top: 0, behavior: 'smooth' }); break; } motion = { switch: d }; } state.view = el.dataset.view; save(); render(); window.scrollTo({ top: 0 }); break;
      case 'go-add': state.view = 'tasks'; save(); render(); if (window.matchMedia('(max-width: 820px)').matches) openAdd(); else caretEnd(input); break;
      case 'area': if (holdFired) { holdFired = false; break; } { const order = ['all'].concat(AREAS.map((a) => a.id)); const d = Math.sign(order.indexOf(el.dataset.area) - order.indexOf(state.area)); if (!d) break; motion = { switch: d }; } state.area = el.dataset.area; comp.area = null; save(); render(); break;
      case 'area-new': openArea(null); break;
      case 'area-icon': areaDraft.icon = el.dataset.icon; repaintArea(); break;
      case 'area-color': areaDraft.color = el.dataset.color; repaintArea(); break;
      case 'area-save': saveArea(); break;
      case 'area-ask-delete': areaDraft.confirmDelete = true; repaintArea(); break;
      case 'area-keep': areaDraft.confirmDelete = false; repaintArea(); break;
      case 'area-delete': deleteArea(el.dataset.to); break;
      case 'theme': { const t2 = root.dataset.theme === 'light' ? 'dark' : 'light'; $('#me-pop').hidden = true; const flip = () => { root.dataset.theme = t2; paintTheme(); }; if (document.startViewTransition && !calm.matches) document.startViewTransition(flip); else flip(); host.setTheme(t2); break; }
      case 'sign-out': host.signOut(); break;
      case 'me': $('#me-pop').hidden = !$('#me-pop').hidden; break;
      case 'complete': {
        if (t.done) { t.done = false; t.doneAt = undefined; commit('Reopened', before); break; }
        const it = el.closest('.item');
        if (!it || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(t, before); break; }
        try { if (navigator.vibrate) navigator.vibrate([10, 30, 6]); } catch (err) { /* ignore */ }
        it.classList.add('finishing');
        setTimeout(() => { it.style.maxHeight = `${it.offsetHeight}px`; requestAnimationFrame(() => it.classList.add('folding')); }, 720);
        setTimeout(() => finish(t, before), 1060);
        break;
      }
      case 'open': if (opened.has(t.id)) { opened.delete(t.id); collapse($(`.item[data-id="${t.id}"] .open-body`), render); } else { opened.add(t.id); motion = { grow: t.id }; render(); } break;
      case 'step-new': { const lab = $(`#stepadd-${t.id}`).closest('.step-add'); lab.hidden = false; caretEnd($(`#stepadd-${t.id}`)); break; }
      case 'more-acts': el.nextElementSibling.classList.toggle('show'); break;
      case 'chip': showSheet('chip', t); break;
      case 'push': showSheet('push', t); break;
      case 'edit': showSheet('edit', t, '#edit-title'); break;
      case 'sheet-close': closeSheet(); break;
      case 'push-to': { const o = pushOptions(t).find((x) => x.k === el.dataset.k); pushTo(t, o.due, o.time, before); break; }
      case 'do-now': t.due = todayKey(); t.time = undefined; closeSheet(); commit('On for today', before); break;
      case 'shelve': closeSheet(); leaveThen(t.id, 'left', () => { t.shelved = true; opened.delete(t.id); motion = { leave: 'left' }; commit('Shelved', before); }); break;
      case 'delete': closeSheet(); leaveThen(t.id, 'fade', () => { state.tasks = state.tasks.filter((x) => x !== t); opened.delete(t.id); motion = { leave: 'fade' }; commit('Deleted', before); }); break;
      case 'finish': closeSheet(); finish(t, before); break;
      case 'chip-add': addProgress(t, Number(el.dataset.n), before); break;
      case 'chip-custom': { const v = Number($('#chip-custom').value); if (v > 0) addProgress(t, v, before); break; }
      case 'chip-goal': { const v = Number($('#chip-goal').value); t.progress = t.progress || { unit: 'minutes', current: 0 }; t.progress.target = v > 0 ? v : undefined; undo = before; save(); render(); paintSheet(); status(v > 0 ? 'Goal set' : 'Goal cleared'); break; }
      case 'chip-unit': { if (t.progress && t.progress.unit === el.dataset.unit) break; t.progress = { unit: el.dataset.unit, current: 0 }; save(); render(); paintSheet(); break; }
      case 'step-done': { const s = t.steps.find((x) => x.id === el.closest('.step').dataset.step); s.done = !s.done; el.closest('.step').classList.toggle('done', s.done); el.closest('.step').classList.add('pop'); save(); const it = $(`.item[data-id="${t.id}"]`); if (it) { $('.sub', it).innerHTML = subHTML(t, state.view === 'timeline'); $('.row .check', it).style.setProperty('--p', pct(t)); } break; }
      case 'step-del': { t.steps = t.steps.filter((x) => x.id !== el.closest('.step').dataset.step); el.closest('.step').remove(); undo = before; save(); const it = $(`.item[data-id="${t.id}"]`); if (it) $('.sub', it).innerHTML = subHTML(t, state.view === 'timeline'); break; }
      case 'edit-area': t.area = el.dataset.area; save(); render(); $$('#sheet [data-act="edit-area"]').forEach((b) => b.classList.toggle('on', b.dataset.area === t.area)); break;
      case 'unshelve': { const when = el.dataset.when; leaveThen(t.id, 'right', () => { t.shelved = false; t.due = when === 'today' ? todayKey() : undefined; t.time = undefined; motion = { leave: 'right' }; commit(t.due ? 'Back for today' : 'Back on your list', before); }); break; }
      case 'toggle-done': showDone = !showDone; render(); break;
      case 'undo': if (undo) { if (Array.isArray(undo)) state.tasks = undo; else { state.tasks = undo.tasks; state.areas = undo.areas; syncAreas(); if (state.area !== 'all' && !areaById[state.area]) state.area = 'all'; } undo = null; save(); relearn(); render(); if (sheet) paintSheet(); $('#status').classList.remove('show'); } break;
      case 'add-open': openAdd(); break;
      case 'add-close': closeAdd(); break;
      case 'add-go': submit(); break;
      case 'add-step': addStep(stepInputs().pop() || null); break;
      case 'pick': pick(Number(el.dataset.i)); break;
      case 'areas': { const pop = $('#areas-pop'); pop.hidden = !pop.hidden; el.setAttribute('aria-expanded', String(!pop.hidden)); paintArea(); break; }
      case 'pick-area': comp.area = el.dataset.area; $('#areas-pop').hidden = true; $('#add-area').setAttribute('aria-expanded', 'false'); paintAdd(); caretEnd(input); break;
      case 'no-when': if (comp.picked) comp.picked = { ...comp.picked, when: null }; comp.literal = true; paintAdd(); caretEnd(input); break;
      case 'when-back': comp.literal = false; paintAdd(); caretEnd(input); break;
      case 'use-hint': if (comp.hint) { comp.picked = { title: input.value, when: comp.hint.when, steps: [] }; comp.literal = true; if (comp.hint.area && !comp.area && state.area === 'all') comp.area = comp.hint.area; paintAdd(); caretEnd(input); } break;
      default: break;
    }
  });
  on(document, 'click', (e) => { if (!e.target.closest('#areas-pop, #add-area')) { $('#areas-pop').hidden = true; $('#add-area').setAttribute('aria-expanded', 'false'); } });

  // Typing in an opened row or a sheet never redraws the field you're in.
  $('#view').addEventListener('keydown', (e) => {
    const el = e.target; const t = taskOf(el); if (!t || e.isComposing) return;
    if (el.classList.contains('main') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); el.click(); return; }
    if (el.dataset.act !== 'step-add') return;
    if (e.key === 'Escape') { opened.delete(t.id); render(); return; }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const sp = E.splitLine(el.value, now()); if (!sp.title) return;
    const s = { id: uid(), title: sp.title, due: sp.when ? sp.when.date : undefined, done: false };
    t.steps.push(s); $('.steps', el.closest('.open-body')).insertAdjacentHTML('beforeend', stepHTML(s, true));
    el.value = ''; el.placeholder = 'Add a step'; save(); relearn();
    const it = el.closest('.item'); $('.sub', it).innerHTML = subHTML(t, state.view === 'timeline'); $('.row .check', it).style.setProperty('--p', pct(t));
  });
  sheetEl.addEventListener('keydown', (e) => {
    if (sheet && sheet.type === 'area') { if (e.key === 'Escape') { e.preventDefault(); closeSheet(); } else if (e.key === 'Enter' && e.target.id === 'area-name') { e.preventDefault(); saveArea(); } return; }
    const t = sheet && find(sheet.id); if (!t || e.isComposing) return;
    const id = e.target.id;
    if (e.key === 'Escape') { e.preventDefault(); closeSheet(); return; }
    if (id === 'area-name' && e.key === 'Enter') { e.preventDefault(); saveArea(); return; }
    if (e.key !== 'Enter') return;
    e.preventDefault(); const before = snapshot();
    if (id === 'edit-title') caretEnd($('#edit-step'));
    else if (id === 'edit-step') { const sp = E.splitLine(e.target.value, now()); if (!sp.title) { caretEnd($('#edit-when')); return; } const st = { id: uid(), title: sp.title, due: sp.when ? sp.when.date : undefined, done: false }; t.steps.push(st); $('#edit-steps').insertAdjacentHTML('beforeend', stepHTML(st, true)); e.target.value = ''; save(); relearn(); render(); }
    else if (id === 'edit-when') {
      const v = e.target.value.trim();
      if (/^(none|no date|someday|clear)$/i.test(v)) { t.due = undefined; t.time = undefined; }
      else { const w = E.parseWhen(v, now()); if (!w) { $('#edit-when-out').textContent = 'try “fri 3pm”'; return; } t.due = w.date; t.time = w.time; }
      e.target.value = ''; e.target.placeholder = t.due ? whenText(t.due, t.time) : 'fri 3pm, next week, none';
      $('#edit-when-out').textContent = t.due ? whenText(t.due, t.time) : 'no date'; undo = before; save(); render();
    } else if (id === 'push-when') { const w = E.parseWhen(e.target.value, now()); if (!w) { $('#push-out').textContent = 'try “fri” or “14 oct”'; return; } pushTo(t, w.date, w.time, before); }
    else if (id === 'chip-custom') { const v = Number(e.target.value); if (v > 0) addProgress(t, v, before); }
    else if (id === 'chip-goal') { $('[data-act="chip-goal"]', sheetEl).click(); }
  });
  sheetEl.addEventListener('input', (e) => {
    if (e.target.id === 'area-name' && areaDraft) { areaDraft.label = e.target.value; const pv = $('.a-preview', sheetEl); if (pv) pv.innerHTML = `${icon(areaDraft.icon)}${esc(areaDraft.label || 'New area')}`; return; }
    const t = sheet && find(sheet.id); if (!t) return;
    if (e.target.id === 'edit-title' && e.target.value.trim()) { t.title = e.target.value.trim(); save(); const r = $(`.item[data-id="${t.id}"] .title`); if (r) r.textContent = t.title; }
    if (e.target.id === 'edit-when' || e.target.id === 'push-when') { const w = E.parseWhen(e.target.value, now()); $(e.target.id === 'edit-when' ? '#edit-when-out' : '#push-out').textContent = w ? whenText(w.date, w.time) : ''; }
  });

  // Hold an area tab (or right-click it) to edit that area.
  let holdFired = false;
  on(document, 'pointerdown', (e) => {
    const tab = e.target.closest('#tabs-area button[data-area]'); if (!tab || tab.dataset.area === 'all' || e.button > 0) return;
    const sx = e.clientX, sy = e.clientY; holdFired = false;
    const timer = setTimeout(() => { holdFired = true; tab.classList.add('holding'); try { if (navigator.vibrate) navigator.vibrate(8); } catch (err) { /* ignore */ } openArea(tab.dataset.area); setTimeout(() => tab.classList.remove('holding'), 200); }, 450);
    const stop = (ev) => { if (ev.type === 'pointermove' && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return; clearTimeout(timer); document.removeEventListener('pointermove', stop); document.removeEventListener('pointerup', stop); document.removeEventListener('pointercancel', stop); };
    on(document, 'pointermove', stop); on(document, 'pointerup', stop); on(document, 'pointercancel', stop);
  });
  on(document, 'contextmenu', (e) => { const tab = e.target.closest('#tabs-area button[data-area]'); if (!tab || tab.dataset.area === 'all') return; e.preventDefault(); holdFired = false; openArea(tab.dataset.area); });

  // Hold the circle: chip away and push back unfold beside it. A plain tap still finishes the task.
  let unfolded = null; let unfoldTimer; let ignoreCloseUntil = 0;
  function closeUnfold() { if (!unfolded) return; const { row } = unfolded; row.classList.remove('unfolding'); const u = $('.unfold', row); if (u) u.remove(); $('.check', row).classList.remove('held'); unfolded = null; clearTimeout(unfoldTimer); }
  function openUnfold(row, t) {
    closeUnfold();
    row.classList.add('unfolding'); $('.check', row).classList.add('held');
    row.insertAdjacentHTML('beforeend', `<div class="unfold" role="menu"><button class="chip" data-act="chip">${icon('chip')}Chip away</button><button class="push" data-act="push">${icon('push')}Push back</button></div>`);
    unfolded = { row, t };
    try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) { /* ignore */ }
  }
  on(document, 'pointerdown', (e) => {
    const check = e.target.closest('#view .row > .check'); if (!check || e.button > 0) return;
    const row = check.closest('.row'); const t = taskOf(check); if (!t || t.done) return;
    const sx = e.clientX, sy = e.clientY; let held = false, hot = null;
    try { check.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    const timer = setTimeout(() => { held = true; openUnfold(row, t); }, 260);
    const move = (ev) => {
      if (!held) { if (Math.hypot(ev.clientX - sx, ev.clientY - sy) > 10) { clearTimeout(timer); cleanup(); } return; }
      const under = document.elementFromPoint(ev.clientX, ev.clientY); const b = under && under.closest('.unfold button');
      $$('.unfold button', row).forEach((x) => x.classList.toggle('hot', x === b)); hot = b;
    };
    const up = () => {
      clearTimeout(timer); cleanup();
      if (!held) return;
      suppressClick = true; setTimeout(() => { suppressClick = false; }, 60);
      if (hot) { const act = hot.dataset.act; closeUnfold(); showSheet(act, t); }
      else { ignoreCloseUntil = Date.now() + 250; unfoldTimer = setTimeout(closeUnfold, 3000); }
    };
    const cleanup = () => { check.removeEventListener('pointermove', move); check.removeEventListener('pointerup', up); check.removeEventListener('pointercancel', up); };
    check.addEventListener('pointermove', move); check.addEventListener('pointerup', up); check.addEventListener('pointercancel', up);
  });
  on(document, 'click', (e) => { if (unfolded && !e.target.closest('.unfold') && Date.now() > ignoreCloseUntil) closeUnfold(); }, true);
  on(document, 'click', (e) => { const b = e.target.closest('.unfold button'); if (b && unfolded) { const t = unfolded.t; closeUnfold(); showSheet(b.dataset.act, t); e.stopPropagation(); } }, true);
  on(document, 'contextmenu', (e) => { if (e.target.closest('#view .row > .check')) e.preventDefault(); });

  // Swipe a row: right pushes back, left shelves.
  on(document, 'pointerdown', (e) => {
    const row = e.target.closest('#view .row');
    if (!row || e.pointerType === 'mouse' || e.target.closest('.check, .acts, input, button')) return;
    const item = row.closest('.item'); const t = taskOf(row); if (!t || t.done || t.shelved) return;
    const sx = e.clientX, sy = e.clientY; let dx = 0, swiping = false; let sel = { i: -1 }; let stops = null; let D = 1;
    const label = $('.swipe .l b', item); const hint = $('.swipe .lh', item); const subEl = $('.sub', row); const subWas = subEl.innerHTML;
    const move = (ev) => {
      dx = ev.clientX - sx; const dy = ev.clientY - sy;
      if (!swiping && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.4) { swiping = true; item.classList.add('swiping'); stops = pushStops(t); D = row.getBoundingClientRect().width - 48; try { row.setPointerCapture(ev.pointerId); } catch (err) { /* ignore */ } }
      if (!swiping) return;
      item.classList.toggle('go-right', dx > 0); item.classList.toggle('go-left', dx < 0);
      if (dx > 0) {
        const prev = sel.i; sel = pickStop(dx / D, stops);
        row.style.transform = `translateX(${Math.min(D, sel.show * D)}px)`;
        label.textContent = sel.i >= 0 ? stops[sel.i].label : ''; hint.textContent = '››';
        subEl.innerHTML = sel.i >= 0 ? `<span class="dest">›› ${esc(stops[sel.i].label)}</span>${stops[sel.i].sub ? `<span>${esc(stops[sel.i].sub)}</span>` : ''}` : subWas;
        if (sel.i !== prev && sel.i >= 0) tick();
      } else { sel = { i: -1 }; subEl.innerHTML = subWas; row.style.transform = `translateX(${dx}px)`; }
    };
    const end = () => {
      row.removeEventListener('pointermove', move); row.removeEventListener('pointerup', end); row.removeEventListener('pointercancel', end);
      if (!swiping) return;
      suppressClick = true; setTimeout(() => { suppressClick = false; }, 350);
      const before = snapshot();
      if (dx > 0 && sel.i >= 0) { const s = stops[sel.i]; pushTo(t, s.due, s.time, before); return; }
      if (dx < -96) { t.shelved = true; opened.delete(t.id); motion = { leave: 'left' }; commit('Shelved', before); return; }
      subEl.innerHTML = subWas; item.classList.add('settle'); row.style.transform = '';
      setTimeout(() => item.classList.remove('swiping', 'settle'), 220);
    };
    row.addEventListener('pointermove', move); row.addEventListener('pointerup', end); row.addEventListener('pointercancel', end);
  });

  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && sheet) closeSheet();
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if (typing || e.metaKey || e.ctrlKey || e.altKey || sheet) return;
    if (e.key === 'n') { e.preventDefault(); state.view = 'tasks'; render(); if (window.matchMedia('(max-width: 820px)').matches) openAdd(); else caretEnd(input); }
    if (['1', '2', '3'].includes(e.key)) { state.view = Object.keys(VIEWS)[Number(e.key) - 1]; save(); render(); }
  });
  // The page follows the keyboard: whatever you're typing in stays in view above it.
  let kb = 0;
  function keepVisible(el) {
    if (!el || !/INPUT|TEXTAREA/.test(el.tagName) || el.closest('.docked, .sheet')) return;
    const r = el.getBoundingClientRect();
    const top = 12 + (parseFloat(getComputedStyle(document.documentElement).paddingTop) || 0);
    const bottom = (window.visualViewport ? window.visualViewport.height + window.visualViewport.offsetTop : window.innerHeight) - 24;
    if (r.bottom > bottom) window.scrollBy({ top: r.bottom - bottom + 40, behavior: 'smooth' });
    else if (r.top < top) window.scrollBy({ top: r.top - top - 12, behavior: 'smooth' });
  }
  on(document, 'focusin', (e) => { if (/INPUT|TEXTAREA/.test(e.target.tagName)) document.body.classList.add('typing'); setTimeout(() => keepVisible(e.target), 60); setTimeout(() => keepVisible(e.target), 380); });
  on(document, 'focusout', () => { setTimeout(() => { if (!/INPUT|TEXTAREA/.test(document.activeElement.tagName)) document.body.classList.remove('typing'); }, 120); });
  if (window.visualViewport) {
    const vv = window.visualViewport;
    const fit = () => {
      const next = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      document.documentElement.style.setProperty('--kb', `${next}px`);
      if (next !== kb) { kb = next; setTimeout(() => keepVisible(document.activeElement), 40); }
    };
    on(vv, 'resize', fit); on(vv, 'scroll', fit); fit();
  }
  timers.push(setInterval(() => { if (!/INPUT|TEXTAREA/.test(document.activeElement.tagName)) render(); }, 60000));
  on(window, 'resize', chrome);

  on(document, 'click', (e) => { if (!e.target.closest('.me, #me-pop')) { const p = $('#me-pop'); if (p) p.hidden = true; } });
  function paintTheme() { $$('.theme-label', root).forEach((el) => { el.textContent = root.dataset.theme === 'light' ? 'Dark mode' : 'Light mode'; }); }
  host.onSaveState = (ok) => { const el = $('#saving'); if (el) el.hidden = ok; };
  // Merged tasks arrived (changes from another device, or Claude). The data always switches
  // over, so the next save includes them; the redraw waits if you're typing in a task's field.
  let redrawWhenFree = null;
  host.onRemote = (tasks) => {
    state.tasks = tasks; undo = null;
    [...opened].forEach((id) => { if (!find(id)) opened.delete(id); });
    relearn();
    const typingInTask = () => /INPUT|TEXTAREA/.test(document.activeElement.tagName) && document.activeElement.closest('#sheet, #view');
    const redraw = () => { if (typingInTask()) { redrawWhenFree = setTimeout(redraw, 500); return; } redrawWhenFree = null; render(); if (sheet) paintSheet(); };
    clearTimeout(redrawWhenFree); redraw();
  };
  paintTheme();
  render(); paintAdd();

  return () => {
    listeners.forEach(([t, ty, fn, o]) => t.removeEventListener(ty, fn, o));
    timers.forEach(clearInterval);
    clearTimeout(redrawWhenFree); host.onRemote = null;
    document.body.classList.remove('composing', 'typing');
    root.innerHTML = '';
  };
}
