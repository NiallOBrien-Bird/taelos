'use client';

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDeadlineResolution, parseHumanDeadline } from '@/lib/human-deadline';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import './style-guide.css';

export type SemanticVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning';
export type ChipVariant = 'neutral' | 'accent' | 'danger' | 'success' | 'warning';
export type TaskDueState = 'none' | 'upcoming' | 'today' | 'overdue';

export const todoTokens = {
  colors: {
    canvas: '#06091a',
    canvasRaised: '#0a0e22',
    text: '#e2e8f0',
    textMuted: '#94a3b8',
    textFaint: '#64748b',
    accent: '#3b82f6',
    accentBright: '#7db2ff',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
  },
  typography: {
    display: 'Outfit, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  radius: { control: 10, card: 16, panel: 22, round: 999 },
  spacing: [4, 8, 12, 16, 20, 24, 32, 40],
} as const;

export interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  selected?: boolean;
  padding?: 'none' | 'compact' | 'default' | 'roomy';
}

export function GlassPanel({
  children,
  className = '',
  interactive = false,
  selected = false,
  padding = 'default',
}: GlassPanelProps) {
  return (
    <section
      className={`sg-glass sg-pad-${padding}${interactive ? ' sg-interactive' : ''}${selected ? ' sg-selected' : ''} ${className}`}
    >
      {children}
    </section>
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: SemanticVariant;
  size?: 'small' | 'medium' | 'large';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'medium', className = '', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`sg-button sg-button-${variant} sg-button-${size} ${className}`}
      {...props}
    />
  );
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: SemanticVariant;
  size?: 'small' | 'medium';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, variant = 'ghost', size = 'medium', className = '', type = 'button', ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={`sg-icon-button sg-icon-button-${variant} sg-icon-button-${size} ${className}`}
        {...props}
      />
    );
  },
);

interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  htmlFor: string;
}

function FieldShell({ label, hint, error, children, htmlFor }: FieldShellProps) {
  return (
    <div className={`sg-field${error ? ' sg-field-error' : ''}`}>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {(error || hint) && <small>{error ?? hint}</small>}
    </div>
  );
}

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, hint, error, id, className = '', ...props }, ref) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
      <FieldShell label={label} hint={hint} error={error} htmlFor={fieldId}>
        <input
          ref={ref}
          id={fieldId}
          className={`sg-input ${className}`}
          aria-invalid={Boolean(error)}
          {...props}
        />
      </FieldShell>
    );
  },
);

export interface SelectFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  id?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  'aria-label'?: string;
  onValueChange?: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  function SelectField(
    {
      label,
      hint,
      error,
      options,
      id,
      className = '',
      value,
      defaultValue,
      disabled,
      'aria-label': ariaLabel,
      onValueChange,
    },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
      <FieldShell label={label} hint={hint} error={error} htmlFor={fieldId}>
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={(nextValue) => {
            if (nextValue) onValueChange?.(nextValue);
          }}
        >
          <SelectTrigger
            ref={ref}
            id={fieldId}
            className={`tm-site-select-trigger ${className}`}
            aria-invalid={Boolean(error)}
            aria-label={ariaLabel}
            disabled={disabled}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            className="tm-site-select-content"
            align="start"
            sideOffset={6}
          >
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="tm-site-select-item"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldShell>
    );
  },
);

export function Chip({
  children,
  variant = 'neutral',
}: {
  children: ReactNode;
  variant?: ChipVariant;
}) {
  return <span className={`sg-chip sg-chip-${variant}`}>{children}</span>;
}

export function ProgressIndicator({
  value,
  label,
  size = 'bar',
}: {
  value: number;
  label: string;
  size?: 'bar' | 'ring';
}) {
  const safeValue = Math.max(0, Math.min(value, 100));
  if (size === 'ring') {
    return (
      <span className="sg-progress-ring-wrap">
        <progress
          className="sg-progress-ring"
          max={100}
          value={safeValue}
          aria-label={label}
          style={{ '--progress': `${safeValue * 3.6}deg` } as React.CSSProperties}
        />
        <span>{Math.round(safeValue)}</span>
      </span>
    );
  }
  return (
    <progress
      className="sg-progress"
      max={100}
      value={safeValue}
      aria-label={label}
    />
  );
}

export function TaskCheckControl({
  checked,
  label,
  progress,
  disabled = false,
  onChange,
}: {
  checked: boolean;
  label: string;
  progress?: number;
  disabled?: boolean;
  onChange?: () => void;
}) {
  const className = `sg-task-check${checked ? ' checked' : ''}${progress !== undefined ? ' progress' : ''}`;
  if (disabled || !onChange) {
    if (progress !== undefined) {
      return (
        <progress
          className={className}
          max={100}
          value={progress}
          aria-label={label}
          style={{ '--check-progress': `${Math.max(0, Math.min(progress, 100)) * 3.6}deg` } as React.CSSProperties}
        />
      );
    }
    return (
      <label className="sg-task-check-label">
        <input type="checkbox" checked={checked} aria-label={label} disabled readOnly />
        <span className={className}>{checked && <CheckIcon />}</span>
      </label>
    );
  }
  return (
    <label className="sg-task-check-label">
      <input type="checkbox" checked={checked} aria-label={label} onChange={onChange} />
      <span className={className}>{checked && <CheckIcon />}</span>
    </label>
  );
}

export interface TaskDisplaySubtask {
  id: string;
  title: string;
  completed: boolean;
  current?: number;
  target?: number;
  unit?: string;
}

export interface TaskDisplayExample {
  id: string;
  title: string;
  completed: boolean;
  dueLabel?: string;
  dueState?: TaskDueState;
  category?: string;
  project?: string;
  subtasks?: TaskDisplaySubtask[];
}

export function TaskRow({
  task,
  selected = false,
  onToggle,
}: {
  task: TaskDisplayExample;
  selected?: boolean;
  onToggle?: () => void;
}) {
  const subtasks = task.subtasks ?? [];
  const completeCount = subtasks.filter((subtask) => subtask.completed).length;
  const parentProgress = subtasks.length ? (completeCount / subtasks.length) * 100 : undefined;
  return (
    <article className={`sg-task-row${selected ? ' selected' : ''}${task.completed ? ' completed' : ''}`}>
      <TaskCheckControl
        checked={task.completed}
        label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
        progress={parentProgress}
        disabled={subtasks.length > 0}
        onChange={subtasks.length ? undefined : onToggle}
      />
      <div className="sg-task-copy">
        <div className="sg-task-title-line">
          <strong>{task.title}</strong>
        </div>
        <div className="sg-task-meta">
          {task.dueLabel && (
            <span className={`sg-due sg-due-${task.dueState ?? 'none'}`}>
              <CalendarIcon /> {task.dueLabel}
            </span>
          )}
          {task.category && <span>{task.category}</span>}
          {task.project && <span>{task.project}</span>}
          {subtasks.length > 0 && <span>{completeCount}/{subtasks.length} subtasks</span>}
        </div>
      </div>
      <IconButton label="More task actions" size="small">
        <MoreIcon />
      </IconButton>
    </article>
  );
}

export interface QuickAddValue {
  title: string;
  dueDate?: string;
  dueTime?: string;
  dueLabel?: string;
  category: string;
  subtasks: Array<{
    title: string;
    dueDate?: string;
    dueTime?: string;
    dueLabel?: string;
  }>;
}

export interface QuickAddBarProps {
  onCreate: (value: QuickAddValue) => void | Promise<void>;
  categories?: string[];
  dayEndTime?: string;
  inputRef?: Ref<HTMLInputElement>;
}

export function QuickAddBar({
  onCreate,
  categories = ['Personal', 'Work', 'Admin', 'Home'],
  dayEndTime,
  inputRef,
}: QuickAddBarProps) {
  const subtaskPanelId = useId();
  const categoryTriggerRef = useRef<HTMLButtonElement>(null);
  const deadlineInputRef = useRef<HTMLInputElement>(null);
  const dueTimeInputRef = useRef<HTMLInputElement>(null);
  const subtaskTitleInputRef = useRef<HTMLInputElement>(null);
  const subtaskTimeInputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [dueLabel, setDueLabel] = useState('');
  const [deadlineText, setDeadlineText] = useState('');
  const [deadlineTouched, setDeadlineTouched] = useState(false);
  const [exactDeadlineOpen, setExactDeadlineOpen] = useState(false);
  const [category, setCategory] = useState(categories[0] ?? 'Personal');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [subtasksOpen, setSubtasksOpen] = useState(false);
  const [subtasks, setSubtasks] = useState<Array<{
    id: number;
    title: string;
    dueDate?: string;
    dueTime?: string;
    dueLabel?: string;
  }>>([]);
  const [nextSubtaskId, setNextSubtaskId] = useState(1);
  const [subtaskDialogOpen, setSubtaskDialogOpen] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskDeadlineText, setSubtaskDeadlineText] = useState('');
  const [subtaskDeadlineTouched, setSubtaskDeadlineTouched] = useState(false);
  const [subtaskDueDate, setSubtaskDueDate] = useState('');
  const [subtaskDueTime, setSubtaskDueTime] = useState('');
  const [subtaskDueLabel, setSubtaskDueLabel] = useState('');
  const [subtaskExactDateOpen, setSubtaskExactDateOpen] = useState(false);

  const resetSubtaskDraft = () => {
    setSubtaskTitle('');
    setSubtaskDeadlineText('');
    setSubtaskDeadlineTouched(false);
    setSubtaskDueDate('');
    setSubtaskDueTime('');
    setSubtaskDueLabel('');
    setSubtaskExactDateOpen(false);
  };

  const addSubtask = () => {
    const nextTitle = subtaskTitle.trim();
    if (!nextTitle) return;
    setSubtasks((current) => [...current, {
      id: nextSubtaskId,
      title: nextTitle,
      dueDate: subtaskDueDate || undefined,
      dueTime: subtaskDueTime || undefined,
      dueLabel: subtaskDueLabel || undefined,
    }]);
    setNextSubtaskId((current) => current + 1);
    setSubtaskDialogOpen(false);
    resetSubtaskDraft();
  };

  const reset = () => {
    setTitle('');
    setDueDate('');
    setDueTime('');
    setDueLabel('');
    setDeadlineText('');
    setDeadlineTouched(false);
    setExactDeadlineOpen(false);
    setScheduleOpen(false);
    setSubtasksOpen(false);
    setSubtasks([]);
    setNextSubtaskId(1);
    setSubtaskDialogOpen(false);
    resetSubtaskDraft();
    setExpanded(false);
  };

  const submit = async (draftSubtask?: {
    title: string;
    dueDate?: string;
    dueTime?: string;
    dueLabel?: string;
  }) => {
    if (!title.trim()) return;
    const submittedDeadline = deadlineText
      ? parseHumanDeadline(deadlineText, new Date(), dayEndTime)
      : undefined;
    const submittedSubtasks = draftSubtask?.title.trim()
      ? [...subtasks, { id: nextSubtaskId, ...draftSubtask }]
      : subtasks;
    await onCreate({
      title: title.trim(),
      dueDate: dueDate || submittedDeadline?.date,
      dueTime: dueTime || submittedDeadline?.time,
      dueLabel: dueLabel || submittedDeadline?.label,
      category,
      subtasks: submittedSubtasks
        .map((subtask) => ({
          title: subtask.title.trim(),
          dueDate: subtask.dueDate,
          dueTime: subtask.dueTime,
          dueLabel: subtask.dueLabel,
        }))
        .filter((subtask) => subtask.title),
    });
    reset();
  };

  const resolvedDeadline = deadlineText ? parseHumanDeadline(deadlineText, new Date(), dayEndTime) : undefined;
  const applyHumanDeadline = (value: string) => {
    const resolved = parseHumanDeadline(value, new Date(), dayEndTime);
    setDeadlineText(value);
    setDeadlineTouched(true);
    if (!resolved) {
      setDueDate('');
      setDueTime('');
      setDueLabel('');
      return;
    }
    setDueDate(resolved.date);
    setDueTime(resolved.time ?? '');
    setDueLabel(resolved.label);
  };

  const resolvedSubtaskDeadline = subtaskDeadlineText
    ? parseHumanDeadline(subtaskDeadlineText, new Date(), dayEndTime)
    : undefined;
  const applySubtaskDeadline = (value: string) => {
    const resolved = parseHumanDeadline(value, new Date(), dayEndTime);
    setSubtaskDeadlineText(value);
    setSubtaskDeadlineTouched(true);
    setSubtaskExactDateOpen(false);
    if (!resolved) {
      setSubtaskDueDate('');
      setSubtaskDueTime('');
      setSubtaskDueLabel('');
      return;
    }
    setSubtaskDueDate(resolved.date);
    setSubtaskDueTime(resolved.time ?? '');
    setSubtaskDueLabel(resolved.label);
  };

  return (
    <GlassPanel className={`sg-quick-add${expanded ? ' expanded' : ''}`} padding="compact">
      <div className="sg-quick-main">
        <input
          data-quick-add-title
          aria-keyshortcuts="N"
          ref={inputRef}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onFocus={() => setExpanded(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              setExpanded(true);
              categoryTriggerRef.current?.focus();
            }
            if (event.key === 'Escape') setExpanded(false);
          }}
          aria-label="Task title"
          placeholder="Add a task…"
        />
        <Select
          value={category}
          onValueChange={(value) => {
            if (value) setCategory(value);
          }}
        >
          <SelectTrigger
            ref={categoryTriggerRef}
            className="tm-site-select-trigger tm-site-select-trigger-compact sg-quick-category"
            aria-label="Task category"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void submit();
              } else if (event.key === 'Tab' && !event.shiftKey) {
                event.preventDefault();
                setScheduleOpen(true);
                requestAnimationFrame(() => deadlineInputRef.current?.focus());
              }
            }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            className="tm-site-select-content"
            align="end"
            sideOffset={6}
          >
            {categories.map((value) => (
              <SelectItem
                key={value}
                value={value}
                className="tm-site-select-item"
              >
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {title && <span className="sg-enter-hint">Enter ↵</span>}
      </div>
      {expanded && (
        <div className="sg-quick-details">
          <button
            type="button"
            className={`sg-detail-toggle${scheduleOpen ? ' open' : ''}`}
            aria-expanded={scheduleOpen}
            aria-controls={`${subtaskPanelId}-schedule`}
            onClick={() => setScheduleOpen((open) => !open)}
          >
            <CalendarIcon />
            <span>{dueDate ? 'Due date set' : 'Set a due date'}</span>
            <small>{dueDate ? `${dueLabel || 'Deadline set'}${dueTime ? ` · ${dueTime}` : ''}` : 'Optional'}</small>
            <ChevronDownIcon />
          </button>
          {scheduleOpen && (
            <div className="sg-human-deadline sg-quick-schedule" id={`${subtaskPanelId}-schedule`}>
              <label htmlFor={`${subtaskPanelId}-deadline`}>When does this need to happen?</label>
              <div className={`sg-deadline-input${deadlineTouched && deadlineText && !resolvedDeadline ? ' invalid' : ''}`}>
                <CalendarIcon />
                <input ref={deadlineInputRef} id={`${subtaskPanelId}-deadline`} value={deadlineText}
                  onChange={(event) => { setDeadlineText(event.target.value); setDeadlineTouched(false); }}
                  onBlur={() => applyHumanDeadline(deadlineText)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      applyHumanDeadline(deadlineText);
                      void submit();
                    } else if (event.key === 'Tab' && !event.shiftKey) {
                      event.preventDefault();
                      applyHumanDeadline(deadlineText);
                      setExactDeadlineOpen(true);
                      requestAnimationFrame(() => dueTimeInputRef.current?.focus());
                    }
                  }}
                  placeholder="Tomorrow at 9am, this weekend…" aria-describedby={`${subtaskPanelId}-deadline-help`}
                  aria-invalid={deadlineTouched && !!deadlineText && !resolvedDeadline} />
                {deadlineText && <button type="button" aria-label="Clear deadline" onClick={() => applyHumanDeadline('')}>×</button>}
              </div>
              <div className="sg-deadline-presets" aria-label="Quick deadline choices">
                {['Tomorrow morning', 'This weekend', 'Next weekend'].map((value) =>
                  <button key={value} type="button" onClick={() => applyHumanDeadline(value)}>{value}</button>)}
              </div>
              <div className="sg-deadline-feedback" id={`${subtaskPanelId}-deadline-help`} aria-live="polite">
                {resolvedDeadline ? <><CheckIcon /><span>Understood: <strong>{formatDeadlineResolution(resolvedDeadline)}</strong></span></>
                  : deadlineTouched && deadlineText ? <span>Try “tomorrow at 9am” or choose an exact date.</span>
                    : <span>Try a day, time, weekend, or date—however you naturally say it.</span>}
                <button type="button" onClick={() => setExactDeadlineOpen((open) => !open)} aria-expanded={exactDeadlineOpen}>Exact date</button>
              </div>
              {exactDeadlineOpen && <div className="sg-exact-deadline">
                <label>Date<input type="date" value={dueDate} onChange={(event) => {
                  const value = event.target.value;
                  setDueDate(value); setDueLabel(value ? 'Exact date' : ''); setDeadlineText(value);
                }} /></label>
                <label>Time <span>optional</span><input ref={dueTimeInputRef} type="time" value={dueTime} onChange={(event) => setDueTime(event.target.value)} onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void submit();
                  } else if (event.key === 'Tab' && !event.shiftKey) {
                    event.preventDefault();
                    setSubtasksOpen(true);
                    setSubtaskDialogOpen(true);
                    requestAnimationFrame(() => subtaskTitleInputRef.current?.focus());
                  }
                }} /></label>
              </div>}
            </div>
          )}
          <button
            type="button"
            className={`sg-subtask-toggle${subtasksOpen ? ' open' : ''}`}
            aria-expanded={subtasksOpen}
            aria-controls={subtaskPanelId}
            onClick={() => setSubtasksOpen((open) => !open)}
          >
            <BranchIcon />
            <span>{subtasks.length ? `${subtasks.length} subtask${subtasks.length === 1 ? '' : 's'}` : 'Add subtasks'}</span>
            <small>Optional</small>
            <ChevronDownIcon />
          </button>
          {subtasksOpen && (
            <div className="sg-subtask-builder" id={subtaskPanelId}>
              <div className="sg-subtask-header">
                <small>Each subtask can have its own due date.</small>
                <Button variant="ghost" size="small" onClick={() => { resetSubtaskDraft(); setSubtaskDialogOpen(true); }}>
                  <PlusIcon /> Add subtask
                </Button>
              </div>
              {subtasks.length > 0 ? (
                <div className="sg-subtask-list-editor">
                  {subtasks.map((subtask, index) => (
                    <div className="sg-subtask-editor-row" key={subtask.id}>
                      <span aria-hidden="true">{index + 1}</span>
                      <input
                        aria-label={`Subtask ${index + 1}`}
                        value={subtask.title}
                        onChange={(event) => setSubtasks((current) => current.map((item) =>
                          item.id === subtask.id ? { ...item, title: event.target.value } : item
                        ))}
                        placeholder="Describe the next step"
                      />
                      {subtask.dueDate && <span className="sg-subtask-due"><CalendarIcon /> {subtask.dueLabel || 'Due date set'}</span>}
                      <IconButton
                        label={`Remove subtask ${index + 1}`}
                        size="small"
                        onClick={() => setSubtasks((current) => current.filter((item) => item.id !== subtask.id))}
                      >
                        <TrashIcon />
                      </IconButton>
                    </div>
                  ))}
                </div>
              ) : (
                <button type="button" className="sg-subtask-empty" onClick={() => { resetSubtaskDraft(); setSubtaskDialogOpen(true); }}>
                  <BranchIcon /> <span>Add the first smaller step</span>
                </button>
              )}
            </div>
          )}
          <div className="sg-quick-actions">
            <span className="sg-quick-summary">
              {dueDate ? <><CalendarIcon /> {dueLabel || 'Deadline set'}{dueTime ? ` · ${dueTime}` : ''}</> : 'No deadline — that’s okay'}
            </span>
            <div>
              <Button variant="ghost" size="small" onClick={reset}>Cancel</Button>
              <Button variant="primary" size="small" onClick={() => void submit()} disabled={!title.trim()}>
                Add task
              </Button>
            </div>
          </div>
        </div>
      )}
      <Dialog open={subtaskDialogOpen} onOpenChange={setSubtaskDialogOpen}>
        <DialogContent className="sg-subtask-dialog" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Add subtask</DialogTitle>
            <DialogDescription>Give this smaller step its own due date if it needs one.</DialogDescription>
          </DialogHeader>
          <label className="sg-subtask-dialog-field">
            Subtask name
            <input ref={subtaskTitleInputRef} value={subtaskTitle} onChange={(event) => setSubtaskTitle(event.target.value)} onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void submit({
                  title: subtaskTitle,
                  dueDate: subtaskDueDate || undefined,
                  dueTime: subtaskDueTime || undefined,
                  dueLabel: subtaskDueLabel || undefined,
                });
              } else if (event.key === 'Tab' && !event.shiftKey) {
                event.preventDefault();
                setSubtaskExactDateOpen(true);
                requestAnimationFrame(() => subtaskTimeInputRef.current?.focus());
              }
            }} placeholder="Describe the next step" />
          </label>
          <div className="sg-human-deadline sg-subtask-deadline">
            <label htmlFor={`${subtaskPanelId}-subtask-deadline`}>Due date <span>optional</span></label>
            <div className={`sg-deadline-input${subtaskDeadlineTouched && subtaskDeadlineText && !resolvedSubtaskDeadline ? ' invalid' : ''}`}>
              <CalendarIcon />
              <input id={`${subtaskPanelId}-subtask-deadline`} value={subtaskDeadlineText} onChange={(event) => { setSubtaskDeadlineText(event.target.value); setSubtaskDeadlineTouched(false); }} onBlur={() => applySubtaskDeadline(subtaskDeadlineText)} placeholder="Tomorrow at 9am…" aria-invalid={subtaskDeadlineTouched && !!subtaskDeadlineText && !resolvedSubtaskDeadline} />
              {subtaskDeadlineText && <button type="button" aria-label="Clear subtask deadline" onClick={() => applySubtaskDeadline('')}>×</button>}
            </div>
            <div className="sg-deadline-feedback" aria-live="polite">
              {resolvedSubtaskDeadline ? <><CheckIcon /><span>Due <strong>{formatDeadlineResolution(resolvedSubtaskDeadline)}</strong></span></> : <span>Use plain language or choose an exact date.</span>}
              <button type="button" onClick={() => setSubtaskExactDateOpen((open) => !open)} aria-expanded={subtaskExactDateOpen}>Exact date</button>
            </div>
            {subtaskExactDateOpen && <div className="sg-exact-deadline">
              <label>Date<input type="date" value={subtaskDueDate} onChange={(event) => { const value = event.target.value; setSubtaskDueDate(value); setSubtaskDueLabel(value ? 'Exact date' : ''); setSubtaskDeadlineText(value); }} /></label>
              <label>Time <span>optional</span><input ref={subtaskTimeInputRef} type="time" value={subtaskDueTime} onChange={(event) => setSubtaskDueTime(event.target.value)} onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void submit({
                    title: subtaskTitle,
                    dueDate: subtaskDueDate || undefined,
                    dueTime: subtaskDueTime || undefined,
                    dueLabel: subtaskDueLabel || undefined,
                  });
                } else if (event.key === 'Tab' && !event.shiftKey && subtaskTitle.trim()) {
                  event.preventDefault();
                  addSubtask();
                  requestAnimationFrame(() => {
                    setSubtaskDialogOpen(true);
                    requestAnimationFrame(() => subtaskTitleInputRef.current?.focus());
                  });
                }
              }} /></label>
            </div>}
          </div>
          <div className="sg-subtask-dialog-actions">
            <Button variant="ghost" size="small" onClick={() => setSubtaskDialogOpen(false)}>Cancel</Button>
            <Button variant="primary" size="small" onClick={addSubtask} disabled={!subtaskTitle.trim()}>Add subtask</Button>
          </div>
        </DialogContent>
      </Dialog>
    </GlassPanel>
  );
}

export function TodoStyleGuide() {
  const [sampleComplete, setSampleComplete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [quickAdds, setQuickAdds] = useState(0);
  const [accent, setAccent] = useState('violet');

  const examples: TaskDisplayExample[] = [
    {
      id: 'default',
      title: 'A calm, ordinary task with useful metadata',
      completed: sampleComplete,
      dueLabel: 'Tomorrow',
      dueState: 'upcoming',
      category: 'Personal',
    },
    {
      id: 'overdue',
      title: 'This deliberately long overdue task demonstrates wrapping without crowding its actions or metadata',
      completed: false,
      dueLabel: 'Yesterday',
      dueState: 'overdue',
      category: 'Admin',
    },
    {
      id: 'parent',
      title: 'Prepare the project kickoff',
      completed: false,
      dueLabel: 'Friday',
      dueState: 'upcoming',
      category: 'Work',
      project: 'Launch plan',
      subtasks: [
        { id: 'one', title: 'Draft agenda', completed: true },
        { id: 'two', title: 'Write background brief', completed: false, current: 420, target: 1000, unit: 'words' },
      ],
    },
  ];

  return (
    <div className={`todo-style-guide sg-accent-${accent}`}>
      <header className="sg-guide-header">
        <div>
          <p className="sg-eyebrow">Caxius design language · v0.1</p>
          <h1>Todo interface system</h1>
          <p>Quiet glass surfaces, legible hierarchy, and progress that reflects real work.</p>
        </div>
        <SelectField
          aria-label="Preview accent"
          value={accent}
          onValueChange={(value) => setAccent(value as 'violet' | 'indigo')}
          options={[
            { value: 'violet', label: 'Azure accent' },
            { value: 'indigo', label: 'Cobalt accent' },
          ]}
        />
      </header>

      <main className="sg-guide-content">
        <section className="sg-guide-section">
          <div className="sg-section-heading"><span>01</span><div><h2>Foundations</h2><p>The values every new surface should inherit.</p></div></div>
          <div className="sg-foundation-grid">
            <GlassPanel>
              <p className="sg-label">Color roles</p>
              <div className="sg-swatches">
                {[
                  ['Canvas', 'canvas'], ['Raised', 'raised'], ['Glass', 'glass'], ['Accent', 'accent'],
                  ['Success', 'success'], ['Warning', 'warning'], ['Danger', 'danger'],
                ].map(([label, role]) => <div key={role}><span className={`sg-swatch sg-swatch-${role}`} /><small>{label}</small></div>)}
              </div>
            </GlassPanel>
            <GlassPanel>
              <p className="sg-label">Type roles</p>
              <h3 className="sg-type-display">Display / Outfit</h3>
              <p className="sg-type-body">Interface copy stays neutral and readable with Inter.</p>
              <code className="sg-type-mono">SAT 29 AUG · 62%</code>
            </GlassPanel>
            <GlassPanel>
              <p className="sg-label">Glass restraint</p>
              <p className="sg-type-body">Use blur to separate working layers—not as decoration. One border, one highlight, and a quiet shadow are enough.</p>
              <div className="sg-layer-sample"><span /><span /><span /></div>
            </GlassPanel>
          </div>
        </section>

        <section className="sg-guide-section">
          <div className="sg-section-heading"><span>02</span><div><h2>Controls</h2><p>Semantic variants include their full interaction states.</p></div></div>
          <GlassPanel className="sg-controls-panel">
            <div className="sg-control-group">
              <p className="sg-label">Buttons</p>
              <div className="sg-control-row">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="danger">Danger</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
            <div className="sg-control-grid">
              <TextField label="Default field" placeholder="Write something useful" hint="Helpful context lives here." />
              <TextField label="Error field" defaultValue="Incomplete" error="This value needs more detail." />
              <SelectField label="Select" defaultValue="today" options={[{ value: 'today', label: 'Today' }, { value: 'week', label: 'This week' }]} />
              <div className="sg-chip-field"><p className="sg-label">Status chips</p><div className="sg-control-row"><Chip variant="accent">Selected</Chip><Chip variant="success">Complete</Chip><Chip variant="warning">Due today</Chip><Chip variant="danger">Overdue</Chip></div></div>
            </div>
            <div className="sg-control-group">
              <p className="sg-label">Progress</p>
              <div className="sg-progress-examples"><ProgressIndicator value={62} label="62 percent complete" /><ProgressIndicator value={62} label="62 percent complete" size="ring" /></div>
            </div>
          </GlassPanel>
        </section>

        <section className="sg-guide-section">
          <div className="sg-section-heading"><span>03</span><div><h2>Task language</h2><p>Simple tasks stay simple; parent progress comes only from children.</p></div></div>
          <GlassPanel padding="none">
            {examples.map((task, index) => (
              <TaskRow key={task.id} task={task} selected={index === 2} onToggle={index === 0 ? () => setSampleComplete((value) => !value) : undefined} />
            ))}
          </GlassPanel>
        </section>

        <section className="sg-guide-section">
          <div className="sg-section-heading"><span>04</span><div><h2>Quick capture</h2><p>One calm line expands only when the user asks for detail.</p></div></div>
          <QuickAddBar onCreate={() => setQuickAdds((value) => value + 1)} />
          {quickAdds > 0 && <output className="sg-inline-success"><CheckIcon /> Added {quickAdds} sample {quickAdds === 1 ? 'task' : 'tasks'}.</output>}
        </section>

        <section className="sg-guide-section">
          <div className="sg-section-heading"><span>05</span><div><h2>Compositions</h2><p>Reference states for navigation, empty views, and overlays.</p></div></div>
          <div className="sg-composition-grid">
            <GlassPanel>
              <p className="sg-label">Navigation</p>
              <nav className="sg-nav-sample" aria-label="Style guide navigation example">
                <button className="active"><ListIcon /> Tasks <span>7</span></button>
                <button><TimelineIcon /> Timeline</button>
                <button><ArchiveIcon /> Shelf</button>
              </nav>
            </GlassPanel>
            <GlassPanel className="sg-empty-state">
              <span className="sg-empty-icon"><SparkIcon /></span>
              <h3>A clear surface</h3>
              <p>Empty states say what belongs here and offer one sensible next step.</p>
              <Button variant="secondary" size="small">Create the first item</Button>
            </GlassPanel>
            <GlassPanel>
              <p className="sg-label">Overlay</p>
              <h3>Confirm consequential actions</h3>
              <p className="sg-type-body">Use a focused modal when the result is destructive or difficult to undo.</p>
              <Button variant="danger" size="small" onClick={() => setModalOpen(true)}>Preview modal</Button>
            </GlassPanel>
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="sg-modal-backdrop">
          <dialog open className="sg-glass sg-modal sg-pad-roomy" aria-labelledby="modal-title">
              <span className="sg-modal-icon"><TrashIcon /></span>
              <h2 id="modal-title">Move this task to the Shelf?</h2>
              <p>It will leave your active list but remain available in the archive.</p>
              <div className="sg-modal-actions"><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => setModalOpen(false)}>Move to Shelf</Button></div>
          </dialog>
        </div>
      )}
    </div>
  );
}

export function PlusIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg>; }
export function CheckIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10 3.2 3.2L15 6.8" /></svg>; }
export function ChevronDownIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>; }
export function CalendarIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="4.5" width="14" height="12" rx="2" /><path d="M6.5 3v3M13.5 3v3M3 8h14" /></svg>; }
export function MoreIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="4" cy="10" r="1" /><circle cx="10" cy="10" r="1" /><circle cx="16" cy="10" r="1" /></svg>; }
export function BranchIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="5" cy="5" r="2" /><circle cx="15" cy="15" r="2" /><path d="M5 7v2a6 6 0 0 0 6 6h2M5 9h7a3 3 0 0 0 3-3V5" /></svg>; }
export function ListIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5h9M7 10h9M7 15h9" /><circle cx="4" cy="5" r=".7" /><circle cx="4" cy="10" r=".7" /><circle cx="4" cy="15" r=".7" /></svg>; }
export function TimelineIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4v12M8 6h8M8 10h5M8 14h7" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="10" r="1" /><circle cx="4" cy="14" r="1" /></svg>; }
export function ArchiveIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h14v11H3zM2 3h16v3H2zM7 10h6" /></svg>; }
export function SparkIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2c.5 4.3 2.8 6.6 7 7-4.2.5-6.5 2.8-7 7-.5-4.2-2.8-6.5-7-7 4.2-.4 6.5-2.7 7-7Z" /></svg>; }
export function TrashIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h12M8 3h4l1 3H7l1-3ZM6 6l1 11h6l1-11M9 9v5M11 9v5" /></svg>; }

export default TodoStyleGuide;
