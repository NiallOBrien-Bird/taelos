'use client';

import type { Task } from '@/lib/task-repository';
import { getDayKey } from '@/lib/day-boundary';

/**
 * A lualine-style status line for the day: the current mode on the left
 * (driven purely by CSS — the pill reads "Insert" while you're typing in the
 * capture bar), then a quiet summary and a hairline progress bar.
 */
export function StatusLine({ tasks, dayEndTime }: { tasks: Task[]; dayEndTime?: string }) {
  const now = new Date();
  const today = getDayKey(now, dayEndTime);
  const live = tasks.filter((task) => !task.shelved);
  const open = live.filter((task) => !task.completed);
  const doneToday = live.filter(
    (task) => task.completed && task.completedAt && getDayKey(new Date(task.completedAt), dayEndTime) === today,
  ).length;
  const carried = open.filter((task) => task.dueDate && task.dueDate < today).length;
  const dueByToday = open.filter((task) => task.dueDate && task.dueDate <= today).length;
  const total = doneToday + dueByToday;
  const progress = total ? doneToday / total : 0;
  const date = new Intl.DateTimeFormat('en', { weekday: 'short', day: 'numeric', month: 'short' }).format(now);

  return (
    <div className="tl-status" role="status">
      <span className="tl-mode" aria-hidden="true">
        <span className="tl-mode-normal">Normal</span>
        <span className="tl-mode-insert">Insert</span>
      </span>
      <span className="tl-date">{date}</span>
      <span className="tl-stats">
        <span>
          <b>{open.length}</b> open
        </span>
        <span>
          <b>{doneToday}</b> done
        </span>
        {carried > 0 && (
          <span className="tl-carried">
            <b>{carried}</b> carried
          </span>
        )}
      </span>
      <span
        className="tl-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-label={`${doneToday} of ${total} done today`}
      />
    </div>
  );
}
