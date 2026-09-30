import { dueInstant, endOfDayTime, getDayKey, normalizeDayEndTime } from './day-boundary';

/**
 * Builds a due label from the stored date and time, relative to *now*.
 *
 * The phrase the user typed ("tomorrow evening") is never shown back, because
 * it goes stale the moment the day rolls over. Instead the label is rebuilt on
 * every render: "Tomorrow evening" today becomes "This evening" tomorrow and
 * "Yesterday evening" the day after.
 */

const dayMs = 24 * 60 * 60 * 1000;

const windowNames: Record<string, string> = {
  '11:59': 'morning',
  '16:59': 'afternoon',
  '20:59': 'evening',
};

function dayIndex(key: string) {
  const [year, month, day] = key.split('-').map(Number);
  return Math.round(Date.UTC(year, month - 1, day) / dayMs);
}

export function formatClock(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: minute ? '2-digit' : undefined,
  })
    .format(new Date(2000, 0, 1, hour, minute))
    .replace(' ', '')
    .toLowerCase();
}

type TimePart =
  | { kind: 'none' }
  | { kind: 'endOfDay' }
  | { kind: 'window'; name: string }
  | { kind: 'clock'; text: string };

function describeTime(time: string | undefined, dayEndTime: string): TimePart {
  if (!time) return { kind: 'none' };
  if (time === endOfDayTime(dayEndTime) || time === '23:59') return { kind: 'endOfDay' };
  const window = windowNames[time];
  if (window) return { kind: 'window', name: window };
  return { kind: 'clock', text: formatClock(time) };
}

function withTime(day: string, part: TimePart, endOfDayWord: string) {
  switch (part.kind) {
    case 'none':
      return day;
    case 'endOfDay':
      return endOfDayWord;
    case 'window':
      return `${day} ${part.name}`;
    case 'clock':
      return `${day} · ${part.text}`;
  }
}

export type RelativeDueState = 'none' | 'slipped' | 'today' | 'upcoming';

export function relativeDue(
  dueDate: string | undefined,
  dueTime: string | undefined,
  now = new Date(),
  dayEndTime?: string,
): { label: string; state: RelativeDueState; daysAway: number } {
  if (!dueDate) return { label: 'No date', state: 'none', daysAway: Infinity };
  const dayEnd = normalizeDayEndTime(dayEndTime);
  const todayKey = getDayKey(now, dayEnd);
  const diff = dayIndex(dueDate) - dayIndex(todayKey);
  const part = describeTime(dueTime, dayEnd);
  const date = new Date(`${dueDate}T12:00:00`);
  const weekday = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date);
  const shortDate = new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);

  let label: string;
  if (diff === 0) {
    label =
      part.kind === 'window' ? `This ${part.name}` : withTime('Today', part, 'Tonight');
  } else if (diff === 1) {
    label = withTime('Tomorrow', part, 'Tomorrow night');
  } else if (diff === -1) {
    label = withTime('Yesterday', part, 'Yesterday');
  } else if (diff > 1 && diff < 7) {
    label = withTime(weekday, part, weekday);
  } else if (diff < -1 && diff > -7) {
    label = `Since ${weekday}`;
  } else if (diff <= -7) {
    label = `Since ${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date)}`;
  } else {
    label = withTime(shortDate, part, shortDate);
  }

  const passedToday =
    diff === 0 && !!dueTime && part.kind !== 'endOfDay' && dueInstant(dueDate, dueTime, dayEnd) < now;
  const state: RelativeDueState =
    diff < 0 || passedToday ? 'slipped' : diff === 0 ? 'today' : 'upcoming';
  return { label, state, daysAway: diff };
}
