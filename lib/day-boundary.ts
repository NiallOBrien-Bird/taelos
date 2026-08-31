export const DEFAULT_DAY_END_TIME = '00:00';

export function normalizeDayEndTime(value?: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value ?? '')
    ? value!
    : DEFAULT_DAY_END_TIME;
}

function minutesSinceMidnight(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** The calendar date the user considers to be "today" at this moment. */
export function getDayKey(now = new Date(), dayEndTime = DEFAULT_DAY_END_TIME) {
  const boundary = normalizeDayEndTime(dayEndTime);
  const logicalDate = new Date(now);
  if (minutesSinceMidnight(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`) < minutesSinceMidnight(boundary)) {
    logicalDate.setDate(logicalDate.getDate() - 1);
  }
  return toDateKey(logicalDate);
}

/** Converts a task's logical-day time into its real local timestamp. */
export function dueInstant(
  dayKey: string,
  time: string,
  dayEndTime = DEFAULT_DAY_END_TIME,
) {
  const [year, month, day] = dayKey.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const due = new Date(year, month - 1, day, hour, minute);
  if (minutesSinceMidnight(time) < minutesSinceMidnight(normalizeDayEndTime(dayEndTime))) {
    due.setDate(due.getDate() + 1);
  }
  return due;
}

/** Returns the final minute before the user's next logical day begins. */
export function endOfDayTime(dayEndTime = DEFAULT_DAY_END_TIME) {
  const boundary = normalizeDayEndTime(dayEndTime);
  const endMinutes = (minutesSinceMidnight(boundary) + 24 * 60 - 1) % (24 * 60);
  return `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;
}

export function formatClockTime(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: minute ? '2-digit' : undefined,
  }).format(new Date(2000, 0, 1, hour, minute));
}
