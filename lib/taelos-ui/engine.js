/* Taelos engine: dates, natural-language times, live labels and local prediction. No AI; nothing leaves the device. */
/* Taelos engine: dates, natural-language times, live labels and local
   prediction from task history. Plain rules only — no AI, nothing leaves
   the device. Attaches to globalThis.TaelosEngine. */
(function () {
  const DAY = 86400000;

  // ── Dates ────────────────────────────────────────────────────────────────
  const pad = (n) => String(n).padStart(2, '0');
  const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromKey = (k) => new Date(`${k}T12:00:00`);
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const dayIndex = (k) => { const [y, m, d] = k.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / DAY); };
  const diffDays = (a, b) => dayIndex(a) - dayIndex(b);
  const hhmm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  // ── Natural-language times (port of Taelos's human-deadline parser) ──────
  const months = { jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11 };
  const weekdays = { sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tues: 2, tuesday: 2, wed: 3, weds: 3, wednesday: 3, thu: 4, thur: 4, thurs: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6 };
  const windows = { morning: '09:00', afternoon: '14:00', evening: '19:00', tonight: '21:00', night: '21:00', noon: '12:00', midday: '12:00', lunch: '12:30', 'first thing': '08:30' };

  function parseClock(v) {
    const m = v.match(/(?:\bat\s*)?\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i)
      || v.match(/\bat\s*(\d{1,2})(?::(\d{2}))?$/i)
      || v.match(/\b(\d{1,2}):(\d{2})$/);
    if (!m) return { text: v.trim() };
    let h = Number(m[1]); const min = Number(m[2] || 0); const mer = m[3] && m[3].toLowerCase();
    if (min > 59 || h > (mer ? 12 : 23)) return { text: v.trim() };
    if (mer === 'pm' && h < 12) h += 12;
    if (mer === 'am' && h === 12) h = 0;
    // "at 5" with no am/pm: assume the afternoon for 1–7.
    if (!mer && !m[0].includes(':') && h >= 1 && h <= 7) h += 12;
    return { text: v.slice(0, m.index).trim(), time: `${pad(h)}:${pad(min)}` };
  }

  function parseWhen(raw, now = new Date()) {
    let original = String(raw || '').trim().toLowerCase()
      .replace(/\b(?:tmrw|tmr|tmw|tmoz|tomoz|2moro)\b/g, 'tomorrow').replace(/\btonite\b/g, 'tonight');
    if (!original) return null;
    const clock = parseClock(original);
    let text = clock.text; let time = clock.time;
    const wm = text.match(/(?:\b(?:this|in the|at)\s+)?\b(first thing|morning|afternoon|evening|tonight|night|noon|midday|lunch)$/);
    if (wm) { time = time || windows[wm[1]]; text = text.slice(0, wm.index).trim(); if (wm[1] === 'tonight') text = text || 'today'; }
    text = text.replace(/\b(by|the|of|on|due)\b/g, ' ').replace(/\s+/g, ' ').trim();
    const today = new Date(now); today.setHours(12, 0, 0, 0);
    const out = (d, t) => ({ date: dateKey(d), time: t || undefined });

    if (!text && time) return out(today, time);
    let m = text.match(/^in\s+(\d+|an?|one|two|three)\s+(minute|minutes|min|mins|hour|hours|hr|hrs|day|days|week|weeks)$/);
    if (m) {
      const n = ({ a: 1, an: 1, one: 1, two: 2, three: 3 })[m[1]] || Number(m[1]);
      const d = new Date(now);
      if (/^min/.test(m[2])) d.setMinutes(d.getMinutes() + n);
      else if (/^h/.test(m[2])) d.setHours(d.getHours() + n);
      else if (/^week/.test(m[2])) d.setDate(d.getDate() + 7 * n);
      else d.setDate(d.getDate() + n);
      return out(d, /^(min|h)/.test(m[2]) ? hhmm(d) : time);
    }
    if (text === 'today' || text === 'later today' || text === 'later') return out(today, time || (text === 'today' ? undefined : '18:00'));
    if (text === 'tomorrow') return out(addDays(today, 1), time);
    if (text === 'day after tomorrow') return out(addDays(today, 2), time);
    if (text === 'weekend' || text === 'this weekend') return out(addDays(today, (6 - today.getDay() + 7) % 7 || (today.getDay() === 6 ? 0 : 7)), time);
    if (text === 'next week') return out(addDays(today, ((8 - today.getDay()) % 7) || 7), time);
    if (text === 'end of week' || text === 'end week' || text === 'end this week') return out(addDays(today, (5 - today.getDay() + 7) % 7), time || '17:00');
    if (text === 'next month') return out(new Date(today.getFullYear(), today.getMonth() + 1, 1, 12), time);
    m = text.match(/^(?:(this|next)\s+)?([a-z]+)$/);
    if (m && weekdays[m[2]] !== undefined) {
      let n = (weekdays[m[2]] - today.getDay() + 7) % 7;
      if (m[1] === 'next' && n < 7) n = n === 0 ? 7 : n + (n < 3 ? 7 : 0);
      if (n === 0 && !m[1] && time && time < hhmm(now)) n = 7;
      return out(addDays(today, n), time);
    }
    m = text.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)$/) || text.match(/^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?$/);
    if (m) {
      const dayNum = Number(/\d/.test(m[1]) ? m[1] : m[2]);
      const mon = months[/\d/.test(m[1]) ? m[2] : m[1]];
      if (mon !== undefined) {
        const d = new Date(today.getFullYear(), mon, dayNum, 12);
        if (d.getMonth() !== mon) return null;
        if (d < today) d.setFullYear(d.getFullYear() + 1);
        return out(d, time);
      }
    }
    return null;
  }

  // Read a time phrase off the end of a typed line: "call bank fri 3pm".
  function splitLine(line, now = new Date()) {
    const text = String(line || '').replace(/\s+/g, ' ').trim();
    if (!text) return { title: '' };
    const words = text.split(' ');
    for (let n = Math.min(6, words.length - 1); n >= 1; n -= 1) {
      const phrase = words.slice(-n).join(' ').replace(/^@/, '');
      const before = (words[words.length - n - 1] || '').toLowerCase();
      if (/^the\b/i.test(phrase) || ['the', 'a', 'an', 'my', 'your'].includes(before)) continue;
      const when = parseWhen(phrase, now);
      if (!when) continue;
      const title = words.slice(0, -n).join(' ').replace(/\s+(?:by|due|on|at|for|@)$/i, '').trim();
      if (!title) continue;
      return { title, when, phrase };
    }
    return { title: text };
  }

  // ── Live, relative labels ────────────────────────────────────────────────
  function clock(t) {
    const [h, m] = t.split(':').map(Number);
    const hr = h % 12 || 12;
    return `${hr}${m ? ':' + pad(m) : ''}${h < 12 ? 'am' : 'pm'}`;
  }
  const windowName = (t) => ({ '09:00': 'morning', '14:00': 'afternoon', '19:00': 'evening', '21:00': 'night' })[t];

  function label(date, time, now = new Date()) {
    if (!date) return { text: 'No date', state: 'none', days: Infinity };
    const today = dateKey(now);
    const d = diffDays(date, today);
    const wd = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(fromKey(date));
    const win = time && windowName(time);
    const part = (day) => (!time ? day : win ? `${day} ${win}` : `${day} · ${clock(time)}`);
    let text;
    // A task whose date has passed is overdue: it says which day it was for, never how late it is.
    if (d < 0) text = d === -1 ? 'Yesterday' : d > -7 ? wd : new Intl.DateTimeFormat('en', { weekday: 'short', day: 'numeric', month: 'short' }).format(fromKey(date));
    else if (d === 0) text = !time ? 'Today' : win ? (win === 'night' ? 'Tonight' : `This ${win}`) : `Today · ${clock(time)}`;
    else if (d === 1) text = win === 'night' ? 'Tomorrow night' : part('Tomorrow');
    else if (d < 7) text = part(wd);
    else text = part(new Intl.DateTimeFormat('en', { weekday: 'short', day: 'numeric', month: 'short' }).format(fromKey(date)));
    return { text, state: d < 0 ? 'overdue' : d === 0 ? 'today' : 'upcoming', days: d, carried: d < 0 };
  }

  // ── Prediction from history ──────────────────────────────────────────────
  // history: [{ title, area, created: ISO, due?: 'YYYY-MM-DD', time?: 'HH:MM', steps?: [str] }]
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const mode = (arr) => {
    const c = new Map(); let best, n = 0;
    for (const v of arr) { if (v == null) continue; const k = c.get(v) + 1 || 1; c.set(v, k); if (k > n) { n = k; best = v; } }
    return n ? { value: best, count: n } : null;
  };

  function learn(history) {
    const byTitle = new Map(); const byVerb = new Map();
    for (const h of history) {
      const key = norm(h.title);
      if (!byTitle.has(key)) byTitle.set(key, []);
      byTitle.get(key).push(h);
      const verb = key.split(' ')[0];
      if (!byVerb.has(verb)) byVerb.set(verb, []);
      byVerb.get(verb).push(h);
    }
    return { byTitle, byVerb };
  }

  // Predict when something with this history usually lands, from `now`.
  function predictWhen(items, now) {
    const today = new Date(now); today.setHours(12, 0, 0, 0);
    const created = items.map((h) => new Date(h.created));
    const time = mode(items.map((h) => h.time || null));
    const t = time && time.count >= 2 ? time.value : undefined;
    const passed = (d) => d === 0 && t && t <= `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    // Weekday habits: every due weekday seen at least twice (Tue + Thu gym).
    const dowCounts = new Map();
    items.forEach((h) => { if (h.due) { const w = fromKey(h.due).getDay(); dowCounts.set(w, (dowCounts.get(w) || 0) + 1); } });
    const habitual = [...dowCounts].filter(([, n]) => n >= 2).map(([w]) => w);
    const habitShare = habitual.reduce((n, w) => n + dowCounts.get(w), 0) / items.length;
    let date;
    if (habitual.length && habitShare >= 0.6) {
      const gaps = habitual.map((w) => (w - today.getDay() + 7) % 7).map((g) => (passed(g) ? 7 : g));
      date = addDays(today, Math.min(...gaps));
    } else {
      const off = mode(items.map((h, i) => (h.due ? diffDays(h.due, dateKey(created[i])) : null)));
      if (!off) return null;
      const g = Math.max(0, off.value);
      date = addDays(today, passed(g) ? 1 : g);
    }
    return { date: dateKey(date), time: t };
  }

  function suggest(model, typed, now = new Date(), limit = 3) {
    const q = norm(typed);
    if (!q) return [];
    const wd = now.getDay();
    const results = [];
    for (const [key, items] of model.byTitle) {
      if (key === q) continue;
      const starts = key.startsWith(q);
      const wordStarts = !starts && key.split(' ').some((w) => w.startsWith(q));
      if (!starts && !wordStarts) continue;
      let score = 0;
      for (const h of items) {
        const age = Math.max(0, (now - new Date(h.created)) / DAY);
        const sameDay = new Date(h.created).getDay() === wd;
        score += Math.exp(-age / 35) * (sameDay ? 3 : 1);
      }
      if (starts) score *= 2;
      const latest = items.reduce((a, b) => (new Date(a.created) > new Date(b.created) ? a : b));
      results.push({
        title: latest.title,
        area: (mode(items.map((h) => h.area)) || {}).value,
        when: predictWhen(items, now),
        steps: latest.steps || [],
        uses: items.length,
        usualDay: items.filter((h) => new Date(h.created).getDay() === wd).length >= 2,
        score,
      });
    }
    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  // Timing hint for a new title from its first word ("buy …" → Sat morning).
  function verbHint(model, typed, now = new Date()) {
    const verb = norm(typed).split(' ')[0];
    if (!verb || norm(typed) === verb) return null;
    const items = model.byVerb.get(verb);
    if (!items || items.length < 3) return null;
    // A verb habit needs more than one task behind it ("buy groceries", "buy ink").
    if (new Set(items.map((h) => norm(h.title))).size < 2) return null;
    const when = predictWhen(items, now);
    if (!when) return null;
    return { verb, when, area: (mode(items.map((h) => h.area)) || {}).value, samples: items.length };
  }

  globalThis.TaelosEngine = { dateKey, fromKey, addDays, diffDays, parseWhen, splitLine, label, clock, learn, suggest, verbHint, predictWhen };
})();
