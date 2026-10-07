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

const CACHE_PREFIX = 'taelos.cache.v1:';

// Key-order-insensitive comparison: Postgres hands JSON back with its keys reordered.
const stable = (v) => (Array.isArray(v) ? `[${v.map(stable).join(',')}]`
  : v && typeof v === 'object' ? `{${Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`
    : JSON.stringify(v));
const same = (a, b) => stable(a) === stable(b);

/**
 * Three-way merge of task lists. `base` = the server's copy when this device last synced,
 * `local` = this device's copy now, `remote` = the server's copy now.
 * A task this device didn't touch takes the server's version (or goes, if the server deleted it);
 * a task this device changed, added or deleted keeps the device's version;
 * a task only the server has (added by Claude or another device) is added at the top.
 */
export function mergeTasks(base, local, remote) {
  const B = new Map(base.map((t) => [t.id, t]));
  const L = new Map(local.map((t) => [t.id, t]));
  const R = new Map(remote.map((t) => [t.id, t]));
  const out = remote.filter((r) => !B.has(r.id) && !L.has(r.id));
  for (const l of local) {
    const b = B.get(l.id);
    if (b && same(l, b)) { if (R.has(l.id)) out.push(R.get(l.id)); }
    else out.push(l);
  }
  return out;
}

/** Thrown when there is no signed-in session on this device. */
export class SignedOutError extends Error {}

/**
 * Builds the host the UI talks to. `repo` is the task repository ({ userId, list, replace }).
 *
 * Local first: when this device has a cached copy of the user's tasks, the UI starts from it
 * straight away and Supabase is asked for the latest copy in the background. The network is
 * only waited on the very first time a device opens Taelos. Nothing is saved until this
 * device has merged in the server's latest copy, so tasks added elsewhere (another device,
 * Claude) are never overwritten by a stale copy.
 */
export async function createHost(repo, { signOut }) {
  const userId = await repo.userId();
  if (!userId) throw new SignedOutError('Not signed in.');
  const cacheKey = CACHE_PREFIX + userId;
  // Cache = { tasks: this device's copy, base: the server's copy at the last sync }.
  // (An older cache held just the task array.)
  const raw = read(cacheKey);
  const cached = Array.isArray(raw) ? { tasks: raw, base: raw } : raw && Array.isArray(raw.tasks) && Array.isArray(raw.base) ? raw : null;

  let latest; let base; let synced = false;
  if (cached) { latest = cached.tasks; base = cached.base; }
  else { latest = await repo.list(); base = latest; synced = true; }
  const persist = () => write(cacheKey, { tasks: latest, base });
  persist();

  const areas = loadAreas(latest);
  const ui = read(UI_KEY) || {};
  let timer = null; let pending = null; let failures = 0;
  let refreshing = null;
  const schedule = (ms) => { clearTimeout(timer); timer = setTimeout(() => host.flush(), ms); };
  const host = {
    tasks: latest.map(toUi),
    areas,
    ui: { view: ['timeline', 'tasks', 'shelf'].includes(ui.view) ? ui.view : 'timeline', area: areas.some((a) => a.id === ui.area) ? ui.area : 'all', lastArea: areas.some((a) => a.id === ui.lastArea) ? ui.lastArea : areas[0].id, seenTip: ui.seenTip },
    theme: (() => { try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; } })(),
    onSaveState: null,
    /** Set by the UI: called with the merged UI tasks whenever they differ from what it shows. */
    onRemote: null,
    /** Fetch the server's copy and merge it with this device's. Resolves true once synced. */
    refresh() {
      if (refreshing) return refreshing;
      refreshing = repo.list().then((remote) => {
        const next = same(latest, base) ? remote : mergeTasks(base, latest, remote);
        base = remote; synced = true;
        if (!same(next, latest)) {
          latest = next;
          if (host.onRemote) host.onRemote(next.map(toUi)); else host.tasks = next.map(toUi);
        }
        // Anything only this device has goes up now.
        if (!same(latest, base)) { pending = latest; schedule(0); }
        persist();
        return true;
      }).catch((err) => { console.warn('Taelos: refresh failed; showing the copy on this device', err); return false; })
        .finally(() => { refreshing = null; });
      return refreshing;
    },
    async flush() {
      if (!pending) return;
      clearTimeout(timer);
      // Never save before merging the server's copy: that is how other devices' tasks get lost.
      if (!synced && !(await host.refresh())) { failures += 1; schedule(Math.min(30000, 2000 * failures)); return; }
      if (!pending) return;
      const tasks = pending; pending = null;
      try {
        await repo.replace(tasks); failures = 0;
        base = tasks; persist();
        if (host.onSaveState) host.onSaveState(true);
      } catch (err) {
        console.error('Taelos: save failed', err);
        failures += 1; if (host.onSaveState) host.onSaveState(false);
        if (!pending) pending = tasks;
        schedule(Math.min(30000, 2000 * failures));
      }
    },
    save(state) {
      write(AREAS_KEY, state.areas);
      write(UI_KEY, { view: state.view, area: state.area, lastArea: state.lastArea, seenTip: state.seenTip });
      latest = state.tasks.map(toApp);
      pending = latest;
      persist();
      schedule(600);
    },
    setTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch { /* ignore */ } },
    async signOut() {
      await host.flush();
      try { localStorage.removeItem(cacheKey); } catch { /* ignore */ }
      try { if ('caches' in window) { const keys = await caches.keys(); await Promise.all(keys.filter((k) => k.startsWith('taelos-shell-')).map(async (k) => (await caches.open(k)).delete('/'))); } } catch { /* ignore */ }
      await signOut();
    },
  };
  if (cached) void host.refresh();
  return host;
}
