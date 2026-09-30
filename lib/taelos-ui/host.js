/*
 * Bridges the Taelos UI and the app's data.
 *
 * Tasks are stored exactly as before (one JSON document per user in Supabase); this file
 * converts between that shape and the UI's shape, keeping any fields the UI doesn't use.
 * Areas are kept in this browser like categories always were, seeded from those categories.
 */

const AREAS_KEY = 'taelos.areas.v1';
const UI_KEY = 'taelos.ui.v1';
const THEME_KEY = 'todo-theme';
const OLD_CATEGORIES_KEY = 'caxius-todo.categories.v1';
const OLD_DELETED_KEY = 'caxius-todo.deleted-default-categories.v1';
const OLD_DEFAULTS = {
  '🗒️ Notes': { icon: '🗒️', label: 'Notes' },
  '🎤 Voice': { icon: '🎤', label: 'Voice' },
  '🧼 Cleaning': { icon: '🧼', label: 'Cleaning' },
  '📗 Study': { icon: '📗', label: 'Study' },
  '👤 People': { icon: '👤', label: 'People' },
};
const COLORS = ['#7aa2f7', '#bb9af7', '#ff9e64', '#9ece6a', '#f7768e', '#7dcfff', '#e0af68', '#a9b1d6'];
const ICON_RULES = [
  [/work|job|office|brief|career|client/, 'work'], [/home|house|clean|chore|🧼|🏠/, 'home'],
  [/shop|buy|cart|grocer|errand/, 'shopping'], [/health|gym|fit|run|heart|med|doctor|dentist/, 'health'],
  [/music|song|audio|synth|studio|🎤|🎵|voice/, 'music'], [/study|book|read|uni|school|class|learn|📗|📚|graduation/, 'book'],
  [/code|dev|program|laptop/, 'code'], [/note|write|pen|journal|🗒/, 'pen'], [/people|friend|family|social|👤|user/, 'people'],
  [/money|finance|bank|bill|wallet|piggy/, 'money'], [/travel|trip|plane|holiday|map/, 'plane'], [/garden|plant|leaf|seed/, 'leaf'],
  [/game/, 'game'], [/car|drive/, 'car'], [/pet|dog|cat|paw/, 'paw'],
];

const read = (key) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } };
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ } };
const strip = (o) => { Object.keys(o).forEach((k) => o[k] === undefined && delete o[k]); return o; };
const iconFor = (text) => (ICON_RULES.find(([re]) => re.test(text.toLowerCase())) || [null, 'star'])[1];

/** The user's areas: saved ones, else seeded from the old categories and anything tasks refer to. */
export function loadAreas(tasks) {
  let areas = read(AREAS_KEY);
  if (!Array.isArray(areas) || !areas.length) {
    const deleted = new Set(read(OLD_DELETED_KEY) || []);
    const cats = Object.fromEntries(Object.entries(OLD_DEFAULTS).filter(([k]) => !deleted.has(k)));
    const custom = read(OLD_CATEGORIES_KEY);
    if (custom && typeof custom === 'object') {
      Object.entries(custom).forEach(([name, meta]) => {
        if (!meta || typeof meta.label !== 'string') return;
        const key = name === `${meta.icon} ${meta.label}` ? meta.label : name;
        cats[key] = meta;
      });
    }
    areas = Object.entries(cats).map(([id, meta], i) => ({ id, label: meta.label || id, icon: iconFor(`${meta.label || id} ${meta.icon || ''}`), color: COLORS[i % COLORS.length] }));
  }
  const known = new Set(areas.map((a) => a.id));
  tasks.forEach((t) => {
    if (t.category && !known.has(t.category)) {
      known.add(t.category);
      const label = t.category.replace(/^\p{Extended_Pictographic}️?\s*/u, '') || t.category;
      areas.push({ id: t.category, label, icon: iconFor(t.category), color: COLORS[areas.length % COLORS.length] });
    }
  });
  if (!areas.length) areas.push({ id: 'Personal', label: 'Personal', icon: 'star', color: COLORS[0] });
  return areas;
}

/** App task → UI task. The original is kept so unused fields survive a round trip. */
export function toUi(task) {
  const unit = task.progress ? task.progress.unit : 'minutes';
  return {
    id: task.id, title: task.title, area: task.category, due: task.dueDate, time: task.dueTime,
    steps: (task.subtasks || []).map((s) => ({ id: s.id, title: s.title, done: !!s.completed, due: s.dueDate, _raw: s })),
    done: !!task.completed, doneAt: task.completedAt, pushes: task.pushes || 0, shelved: !!task.shelved,
    progress: task.progress ? { unit: task.progress.unit, current: task.progress.current, target: task.progress.target } : null,
    log: (task.workLog || []).filter((e) => typeof e.amount === 'number').map((e) => ({ at: e.at, n: e.amount, unit: e.unit || unit })),
    created: task.createdAt, _raw: task,
  };
}

const ISO = (v) => (v ? new Date(v).toISOString() : undefined);

/** UI task → app task, in the exact shape the repository accepts. */
export function toApp(t) {
  const raw = t._raw || {};
  const keep = strip({ project: raw.project });
  const plainLog = (raw.workLog || []).filter((e) => typeof e.amount !== 'number').map((e) => ({ at: e.at }));
  const chipLog = (t.log || []).map((l) => strip({ at: ISO(l.at), amount: l.n, unit: l.unit }));
  const workLog = plainLog.concat(chipLog).slice(-500);
  const progress = t.progress && (t.progress.current > 0 || t.progress.target)
    ? strip({ current: t.progress.current, target: t.progress.target || undefined, unit: t.progress.unit || 'minutes' }) : undefined;
  return strip({
    ...keep,
    id: t.id,
    title: String(t.title).slice(0, 500),
    completed: !!t.done,
    dueDate: t.due || undefined,
    dueTime: t.time || undefined,
    category: String(t.area || 'Personal').slice(0, 120),
    shelved: t.shelved ? true : undefined,
    progress,
    completedAt: t.done ? ISO(t.doneAt || Date.now()) : undefined,
    workLog: workLog.length ? workLog : undefined,
    pushes: t.pushes ? t.pushes : undefined,
    subtasks: (t.steps || []).slice(0, 100).map((s) => {
      const r = s._raw || {};
      return strip({
        ...strip({ category: r.category, progress: r.progress, workLog: r.workLog, dueTime: r.dueTime }),
        id: s.id, title: String(s.title).slice(0, 500), completed: !!s.done, dueDate: s.due || undefined,
        completedAt: s.done ? (r.completedAt || new Date().toISOString()) : undefined,
      });
    }),
    createdAt: ISO(t.created || Date.now()),
  });
}

/**
 * Builds the host the UI talks to. `repo` is the task repository ({ list, replace }).
 */
export async function createHost(repo, { signOut }) {
  const appTasks = await repo.list();
  const areas = loadAreas(appTasks);
  const ui = read(UI_KEY) || {};
  let timer = null; let pending = null; let failures = 0;
  const host = {
    tasks: appTasks.map(toUi),
    areas,
    ui: { view: ui.view, area: areas.some((a) => a.id === ui.area) ? ui.area : 'all', lastArea: areas.some((a) => a.id === ui.lastArea) ? ui.lastArea : areas[0].id, seenTip: ui.seenTip },
    theme: (() => { try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; } })(),
    onSaveState: null,
    async flush() {
      if (!pending) return;
      const tasks = pending; pending = null; clearTimeout(timer);
      try { await repo.replace(tasks); failures = 0; if (host.onSaveState) host.onSaveState(true); }
      catch (err) {
        console.error('Taelos: save failed', err);
        failures += 1; if (host.onSaveState) host.onSaveState(false);
        if (!pending) pending = tasks;
        timer = setTimeout(() => host.flush(), Math.min(30000, 2000 * failures));
      }
    },
    save(state) {
      write(AREAS_KEY, state.areas);
      write(UI_KEY, { view: state.view, area: state.area, lastArea: state.lastArea, seenTip: state.seenTip });
      pending = state.tasks.map(toApp);
      clearTimeout(timer); timer = setTimeout(() => host.flush(), 600);
    },
    setTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch { /* ignore */ } },
    async signOut() { await host.flush(); await signOut(); },
  };
  return host;
}
