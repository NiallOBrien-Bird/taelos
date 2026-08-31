import { endOfDayTime, getDayKey, normalizeDayEndTime } from './day-boundary';

export type HumanDeadline = { date: string; time?: string; label: string };

const months: Record<string, number> = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
  may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8,
  sept: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
};

const weekdays: Record<string, number> = {
  sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tues: 2, tuesday: 2,
  wed: 3, wednesday: 3, thu: 4, thur: 4, thurs: 4, thursday: 4,
  fri: 5, friday: 5, sat: 6, saturday: 6,
};

const windowEndTimes: Record<string, string> = {
  morning: '11:59', afternoon: '16:59', evening: '20:59', night: '23:59',
  noon: '12:00', midday: '12:00', 'first thing': '09:00',
};

export function deadlineDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function nextMonday(now: Date) {
  return addDays(now, (8 - now.getDay()) % 7 || 7);
}

function nearestWeekday(now: Date, weekday: number, time?: string) {
  let days = (weekday - now.getDay() + 7) % 7;
  if (days === 0 && time) {
    const [hour, minute] = time.split(':').map(Number);
    if (hour * 60 + minute < now.getHours() * 60 + now.getMinutes()) days = 7;
  }
  return addDays(now, days);
}

function parseClockTime(value: string) {
  const match = value.match(/(?:\bat\s*)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*$/i)
    ?? value.match(/\bat\s*(\d{1,2})(?::(\d{2}))?\s*$/i)
    ?? value.match(/(\d{1,2}):(\d{2})\s*$/);
  if (!match) return { text: value.trim(), time: undefined as string | undefined };
  let hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const meridiem = match[3]?.toLowerCase();
  if (minute > 59 || hour > (meridiem ? 12 : 23) || hour < 0) return { text: value.trim(), time: undefined as string | undefined };
  if (meridiem === 'pm' && hour < 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;
  return { text: value.slice(0, match.index).trim(), time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` };
}

function extractWindow(value: string) {
  const match = value.match(/(?:\bat\s+)?\b(first thing|morning|afternoon|evening|night|noon|midday)\s*$/i);
  if (!match) return { text: value.trim(), time: undefined as string | undefined };
  return { text: value.slice(0, match.index).trim(), time: windowEndTimes[match[1].toLowerCase()] };
}

function withDeadline(date: Date, label: string, time?: string): HumanDeadline {
  return { date: deadlineDateString(date), time, label };
}

/** Resolves common human deadline phrases in the user's local timezone. */
export function parseHumanDeadline(
  rawValue: string,
  now = new Date(),
  dayEndTime?: string,
): HumanDeadline | undefined {
  const original = rawValue.trim();
  if (!original || /^(no deadline|none|someday)$/i.test(original)) return undefined;

  const dayEnd = normalizeDayEndTime(dayEndTime);
  const logicalNow = new Date(`${getDayKey(now, dayEnd)}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`);

  const clock = parseClockTime(original);
  const window = extractWindow(clock.text);
  const preferredTime = clock.time ?? window.time;
  const text = window.text.toLowerCase().replace(/\b(by|the|of)\b/g, ' ').replace(/\s+/g, ' ').trim();

  if (preferredTime && (!text || text === 'before' || text === 'this')) {
    return withDeadline(logicalNow, original, preferredTime);
  }

  const relative = text.match(/^in\s+(\d+)\s+(minute|minutes|hour|hours|day|days|week|weeks)$/);
  if (relative) {
    const amount = Number(relative[1]);
    const due = new Date(now);
    if (relative[2].startsWith('minute')) due.setMinutes(due.getMinutes() + amount);
    else if (relative[2].startsWith('hour')) due.setHours(due.getHours() + amount);
    else if (relative[2].startsWith('week')) due.setDate(due.getDate() + amount * 7);
    else due.setDate(due.getDate() + amount);
    const relativeTime = relative[2].startsWith('day') || relative[2].startsWith('week')
      ? preferredTime ?? `${String(due.getHours()).padStart(2, '0')}:${String(due.getMinutes()).padStart(2, '0')}`
      : `${String(due.getHours()).padStart(2, '0')}:${String(due.getMinutes()).padStart(2, '0')}`;
    return withDeadline(new Date(`${getDayKey(due, dayEnd)}T12:00:00`), original, relativeTime);
  }
  if (text === 'one week from now' || text === 'a week from now') {
    const due = addDays(now, 7);
    return withDeadline(due, original, preferredTime ?? `${String(due.getHours()).padStart(2, '0')}:${String(due.getMinutes()).padStart(2, '0')}`);
  }

  if (text === 'later today') {
    const laterHour = Math.min(23, Math.max(18, now.getHours() + 2));
    return withDeadline(logicalNow, original, preferredTime ?? `${String(laterHour).padStart(2, '0')}:00`);
  }
  if (text === 'tonight') return withDeadline(logicalNow, original, preferredTime ?? endOfDayTime(dayEnd));
  if (text === 'end today' || text === 'end day') return withDeadline(logicalNow, original, preferredTime ?? endOfDayTime(dayEnd));
  if (text === 'end tomorrow') return withDeadline(addDays(logicalNow, 1), original, preferredTime ?? endOfDayTime(dayEnd));
  if (text === 'end business' || text === 'close business') return withDeadline(logicalNow, original, preferredTime ?? '16:59');
  if (text === 'close business tomorrow') return withDeadline(addDays(logicalNow, 1), original, preferredTime ?? '16:59');
  if (text === 'before lunch') return withDeadline(logicalNow, original, preferredTime ?? '11:59');
  if (text === 'after lunch') return withDeadline(logicalNow, original, preferredTime ?? '14:00');

  if (text === 'this weekend' || text === 'weekend') return withDeadline(addDays(logicalNow, (7 - logicalNow.getDay()) % 7), original, preferredTime ?? endOfDayTime(dayEnd));
  if (text === 'next weekend') {
    const thisSunday = addDays(logicalNow, (7 - logicalNow.getDay()) % 7);
    return withDeadline(addDays(thisSunday, 7), original, preferredTime ?? endOfDayTime(dayEnd));
  }
  if (text === 'before weekend') return withDeadline(nearestWeekday(logicalNow, 5, preferredTime ?? '16:59'), original, preferredTime ?? '16:59');

  if (text === 'next week') return withDeadline(nextMonday(logicalNow), original, preferredTime);
  if (text === 'beginning next week' || text === 'start next week') return withDeadline(nextMonday(logicalNow), original, preferredTime ?? '09:00');
  if (text === 'middle next week' || text === 'mid next week') return withDeadline(addDays(nextMonday(logicalNow), 2), original, preferredTime ?? '12:00');
  if (text === 'end next week') return withDeadline(addDays(nextMonday(logicalNow), 4), original, preferredTime ?? '16:59');
  if (text === 'end this week' || text === 'end week') return withDeadline(nearestWeekday(logicalNow, 5, preferredTime ?? '16:59'), original, preferredTime ?? '16:59');

  if (text === 'end this month' || text === 'end month') return withDeadline(new Date(logicalNow.getFullYear(), logicalNow.getMonth() + 1, 0), original, preferredTime ?? endOfDayTime(dayEnd));
  if (text === 'beginning next month' || text === 'start next month') return withDeadline(new Date(logicalNow.getFullYear(), logicalNow.getMonth() + 1, 1), original, preferredTime ?? '09:00');

  let date: Date | undefined;
  if (text === 'today') date = logicalNow;
  else if (text === 'tomorrow') date = addDays(logicalNow, 1);
  else if (text === 'day after tomorrow') date = addDays(logicalNow, 2);

  const weekday = text.match(/^(?:(this|next)\s+)?([a-z]+)$/);
  if (!date && weekday && weekdays[weekday[2]] !== undefined) {
    const target = weekdays[weekday[2]];
    const weekdayTime = preferredTime ?? (/^by\s+[a-z]+/i.test(original) ? '09:00' : undefined);
    if (weekday[1] === 'next') date = addDays(nextMonday(logicalNow), (target + 6) % 7);
    else date = nearestWeekday(logicalNow, target, weekdayTime);
  }

  const dayFirst = text.match(/^(?:[a-z]+\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)(?:\s+(\d{4}))?$/);
  const monthFirst = text.match(/^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?$/);
  const explicit = dayFirst
    ? { day: Number(dayFirst[1]), month: months[dayFirst[2]], year: Number(dayFirst[3] ?? logicalNow.getFullYear()) }
    : monthFirst ? { day: Number(monthFirst[2]), month: months[monthFirst[1]], year: Number(monthFirst[3] ?? logicalNow.getFullYear()) } : undefined;
  if (!date && explicit && explicit.month !== undefined) {
    date = new Date(explicit.year, explicit.month, explicit.day);
    if (!dayFirst?.[3] && !monthFirst?.[3] && date < new Date(logicalNow.getFullYear(), logicalNow.getMonth(), logicalNow.getDate())) date.setFullYear(date.getFullYear() + 1);
    if (date.getMonth() !== explicit.month || date.getDate() !== explicit.day) return undefined;
  }

  const numeric = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!date && numeric) {
    date = new Date(Number(numeric[1]), Number(numeric[2]) - 1, Number(numeric[3]));
    if (deadlineDateString(date) !== text) return undefined;
  }

  const isByWeekday = /^by\s+[a-z]+/i.test(original) && weekday;
  return date ? withDeadline(date, original, preferredTime ?? (isByWeekday ? '09:00' : undefined)) : undefined;
}

export function formatDeadlineResolution(deadline: Pick<HumanDeadline, 'date' | 'time'>, options?: { long?: boolean }) {
  const date = new Date(`${deadline.date}T12:00:00`);
  const dateLabel = new Intl.DateTimeFormat('en', options?.long
    ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    : { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
  if (!deadline.time) return dateLabel;
  const [hour, minute] = deadline.time.split(':').map(Number);
  const timeLabel = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: minute ? '2-digit' : undefined }).format(new Date(2000, 0, 1, hour, minute));
  return `${dateLabel} at ${timeLabel}`;
}
