'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import type { QuickAddValue } from '@/components/StyleGuide';
import { splitInlineDeadline } from '@/lib/inline-deadline';
import { relativeDue } from '@/lib/relative-due';

/**
 * One-line capture, built for the phone first.
 *
 * Type a task the way you'd write it on paper — "call the bank fri 3pm" — and
 * press Return. The time at the end is read by Taelos's own rule-based parser
 * (no AI, nothing leaves the device) and shown as a chip you can tap to undo.
 *
 * Subtasks: tap "+ Subtask" (or press Tab, or type " +") to drop into an
 * indented line under the task. Return on a subtask starts the next one;
 * Return on an empty line saves everything. Backspace on an empty subtask
 * line pops back out.
 */

type Line = { id: number; text: string; literal: boolean };

type Props = {
  onCreate: (value: QuickAddValue) => void;
  category: string;
  dayEndTime?: string;
};

let nextLineId = 1;
const newLine = (text = ''): Line => ({ id: nextLineId++, text, literal: false });

function read(line: Line, now: Date, dayEndTime?: string) {
  if (line.literal) return { title: line.text.trim() };
  return splitInlineDeadline(line.text, now, dayEndTime);
}

export function InlineCapture({ onCreate, category, dayEndTime }: Props) {
  const [lines, setLines] = useState<Line[]>(() => [newLine()]);
  const [focused, setFocused] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const [justAdded, setJustAdded] = useState('');
  const inputs = useRef(new Map<number, HTMLInputElement>());
  const pendingFocus = useRef<number | null>(null);
  const blurTimer = useRef<number | undefined>(undefined);

  // Keep the dock above the on-screen keyboard (iOS doesn't shrink the layout
  // viewport, so a fixed bar would otherwise sit behind the keyboard).
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setKeyboardInset(
          Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop),
        ),
      );
    };
    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  useLayoutEffect(() => {
    if (pendingFocus.current === null) return;
    const input = inputs.current.get(pendingFocus.current);
    pendingFocus.current = null;
    if (!input) return;
    input.focus();
    const end = input.value.length;
    input.setSelectionRange(end, end);
  });

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(''), 1800);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  const now = new Date();
  const hasText = lines.some((line) => line.text.trim());
  const open = focused || hasText;

  const focusLine = (id: number) => {
    pendingFocus.current = id;
  };

  const update = (id: number, patch: Partial<Line>) =>
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    );

  const addSubtaskAfter = (id: number) => {
    const line = newLine();
    setLines((current) => {
      const index = current.findIndex((item) => item.id === id);
      return [...current.slice(0, index + 1), line, ...current.slice(index + 1)];
    });
    focusLine(line.id);
  };

  const commit = () => {
    const [taskLine, ...subtaskLines] = lines;
    const task = read(taskLine, now, dayEndTime);
    if (!task.title) {
      // A subtask with no parent line: keep what was typed, just refocus.
      focusLine(taskLine.id);
      return;
    }
    const subtasks = subtaskLines
      .map((line) => read(line, now, dayEndTime))
      .filter((subtask) => subtask.title)
      .map((subtask) => ({
        title: subtask.title,
        dueDate: subtask.deadline?.date,
        dueTime: subtask.deadline?.time,
        dueLabel: subtask.deadline?.label,
      }));
    onCreate({
      title: task.title,
      dueDate: task.deadline?.date,
      dueTime: task.deadline?.time,
      dueLabel: task.deadline?.label,
      category,
      subtasks,
    });
    const fresh = newLine();
    setLines([fresh]);
    setJustAdded(
      subtasks.length
        ? `Added "${task.title}" + ${subtasks.length} subtask${subtasks.length === 1 ? '' : 's'}`
        : `Added "${task.title}"`,
    );
    // Stay in the box so the keyboard stays up for the next one.
    focusLine(fresh.id);
  };

  const clear = () => {
    setLines([newLine()]);
    inputs.current.forEach((input) => input.blur());
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>, index: number) => {
    const line = lines[index];
    const isTask = index === 0;
    if (event.nativeEvent.isComposing) return;

    if (event.key === 'Enter') {
      event.preventDefault();
      if (isTask || !line.text.trim()) commit();
      else addSubtaskAfter(line.id);
      return;
    }
    if (event.key === 'Tab' && !event.shiftKey && line.text.trim()) {
      event.preventDefault();
      addSubtaskAfter(line.id);
      return;
    }
    if (event.key === 'Backspace' && !isTask && !line.text) {
      event.preventDefault();
      const previous = lines[index - 1];
      setLines((current) => current.filter((item) => item.id !== line.id));
      focusLine(previous.id);
      return;
    }
    if (event.key === 'ArrowUp' && index > 0) {
      event.preventDefault();
      inputs.current.get(lines[index - 1].id)?.focus();
      return;
    }
    if (event.key === 'ArrowDown' && index < lines.length - 1) {
      event.preventDefault();
      inputs.current.get(lines[index + 1].id)?.focus();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      const detected = !line.literal && splitInlineDeadline(line.text, now, dayEndTime).deadline;
      if (detected) update(line.id, { literal: true });
      else clear();
    }
  };

  const onChange = (line: Line, value: string) => {
    // " +" typed at the end of a line starts a subtask (handy on phone keyboards).
    if (value.endsWith(' +') && value.length > line.text.length && value.trim() !== '+') {
      update(line.id, { text: value.slice(0, -2) });
      addSubtaskAfter(line.id);
      return;
    }
    // Editing the time phrase again re-enables detection.
    update(line.id, { text: value, literal: line.literal && value.startsWith(line.text) });
  };

  const activeTaskHasText = !!lines[0].text.trim();

  return (
    <div
      className={`ic${open ? ' ic-open' : ''}`}
      style={{ '--ic-keyboard': `${keyboardInset}px` } as CSSProperties}
      onFocus={() => {
        window.clearTimeout(blurTimer.current);
        setFocused(true);
      }}
      onBlur={() => {
        // Moving between lines blurs then refocuses; only collapse if focus left.
        blurTimer.current = window.setTimeout(() => setFocused(false), 120);
      }}
    >
      <div className="ic-lines">
        {lines.map((line, index) => {
          const isTask = index === 0;
          const parsed = read(line, now, dayEndTime);
          const detected = !line.literal ? parsed.deadline : undefined;
          const wasDismissed = line.literal && splitInlineDeadline(line.text, now, dayEndTime).deadline;
          const chip = detected
            ? relativeDue(detected.date, detected.time, now, dayEndTime).label
            : undefined;
          return (
            <div key={line.id} className={`ic-line${isTask ? ' ic-task' : ' ic-sub'}`}>
              {isTask ? (
                <span className="ic-bullet" aria-hidden="true" />
              ) : (
                <span className="ic-branch" aria-hidden="true" />
              )}
              <input
                ref={(node) => {
                  if (node) inputs.current.set(line.id, node);
                  else inputs.current.delete(line.id);
                }}
                {...(isTask ? { 'data-quick-add-title': true, 'aria-keyshortcuts': 'N' } : {})}
                value={line.text}
                onChange={(event) => onChange(line, event.target.value)}
                onKeyDown={(event) => onKeyDown(event, index)}
                enterKeyHint={isTask && lines.length === 1 ? 'done' : 'next'}
                autoComplete="off"
                autoCorrect="on"
                spellCheck
                aria-label={isTask ? 'New task' : `Subtask ${index}`}
                placeholder={
                  isTask
                    ? 'Add a task… e.g. call the bank fri 3pm'
                    : index === 1
                      ? 'Subtask… (Return for another)'
                      : 'Another subtask'
                }
              />
              {chip && (
                <button
                  type="button"
                  className="ic-chip"
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => update(line.id, { literal: true })}
                  aria-label={`Due ${chip}. Tap to keep the words as text instead.`}
                  title="Tap to keep these words as text"
                >
                  <span>{chip}</span>
                  <span aria-hidden="true" className="ic-chip-x">×</span>
                </button>
              )}
              {!chip && wasDismissed && (
                <button
                  type="button"
                  className="ic-chip ic-chip-off"
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => update(line.id, { literal: false })}
                  aria-label="Read the time from this line again"
                >
                  No date
                </button>
              )}
            </div>
          );
        })}
      </div>
      {open && (
        <div className="ic-actions">
          <button
            type="button"
            className="ic-action"
            disabled={!activeTaskHasText}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => addSubtaskAfter(lines[lines.length - 1].id)}
          >
            <span aria-hidden="true">+</span> Subtask
          </button>
          <span className="ic-hint" aria-live="polite">
            {justAdded || (lines.length > 1 ? 'Empty line saves' : 'Return to add')}
          </span>
          <button
            type="button"
            className="ic-action ic-save"
            disabled={!activeTaskHasText}
            onPointerDown={(event) => event.preventDefault()}
            onClick={commit}
          >
            Add
          </button>
        </div>
      )}
      {!open && justAdded && (
        <p className="ic-toast" aria-live="polite">
          {justAdded}
        </p>
      )}
    </div>
  );
}
