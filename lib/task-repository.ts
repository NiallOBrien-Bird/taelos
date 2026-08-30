import seedTasks from './tasks.seed.json';
import { createClient } from './supabase/client';

export type ProgressUnit = string;

export interface WorkLogEntry {
  at: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  dueTime?: string;
  dueLabel?: string;
  category?: string;
  progress?: {
    current: number;
    target?: number;
    unit: ProgressUnit;
  };
  completedAt?: string;
  workLog?: WorkLogEntry[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  dueTime?: string;
  dueLabel?: string;
  category: string;
  project?: string;
  shelved?: boolean;
  progress?: {
    current: number;
    target?: number;
    unit: ProgressUnit;
  };
  completedAt?: string;
  workLog?: WorkLogEntry[];
  subtasks: Subtask[];
  createdAt: string;
}

export interface TaskRepository {
  list(): Promise<Task[]>;
  replace(tasks: Task[]): Promise<void>;
  reset(): Promise<Task[]>;
}

const MAX_TASKS = 1_000;
const MAX_SUBTASKS_PER_TASK = 100;
const MAX_WORK_LOG_ENTRIES = 500;
const MAX_DOCUMENT_BYTES = 512 * 1024;
const MAX_ID_LENGTH = 128;
const MAX_TITLE_LENGTH = 500;
const MAX_CATEGORY_LENGTH = 120;
const MAX_PROJECT_LENGTH = 160;
const MAX_DUE_LABEL_LENGTH = 160;
const MAX_UNIT_LENGTH = 48;

const taskKeys = new Set([
  'id', 'title', 'completed', 'dueDate', 'dueTime', 'dueLabel', 'category',
  'project', 'shelved', 'progress', 'completedAt', 'workLog', 'subtasks', 'createdAt',
]);
const subtaskKeys = new Set([
  'id', 'title', 'completed', 'dueDate', 'dueTime', 'dueLabel', 'category',
  'progress', 'completedAt', 'workLog',
]);
const progressKeys = new Set(['current', 'target', 'unit']);
const workLogKeys = new Set(['at']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: Set<string>) {
  return Object.keys(value).every((key) => allowed.has(key));
}

function isBoundedString(value: unknown, maximum: number) {
  return typeof value === 'string' && value.length > 0 && value.length <= maximum;
}

function isOptionalBoundedString(value: unknown, maximum: number) {
  return value === undefined || isBoundedString(value, maximum);
}

function isIsoTimestamp(value: unknown) {
  return (
    typeof value === 'string' &&
    value.length <= 40 &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
}

function isDate(value: unknown) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function isOptionalDate(value: unknown) {
  return value === undefined || isDate(value);
}

function isOptionalTime(value: unknown) {
  return value === undefined || (typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value));
}

function isProgress(value: unknown) {
  if (value === undefined) return true;
  if (!isRecord(value) || !hasOnlyKeys(value, progressKeys)) return false;
  return (
    typeof value.current === 'number' &&
    Number.isFinite(value.current) &&
    value.current >= 0 &&
    (value.target === undefined ||
      (typeof value.target === 'number' &&
        Number.isFinite(value.target) &&
        value.target > 0 &&
        value.target >= value.current)) &&
    isBoundedString(value.unit, MAX_UNIT_LENGTH)
  );
}

function isWorkLog(value: unknown) {
  return (
    value === undefined ||
    (Array.isArray(value) &&
      value.length <= MAX_WORK_LOG_ENTRIES &&
      value.every(
        (entry) =>
          isRecord(entry) && hasOnlyKeys(entry, workLogKeys) && isIsoTimestamp(entry.at),
      ))
  );
}

function hasValidCommonFields(value: Record<string, unknown>) {
  return (
    isBoundedString(value.id, MAX_ID_LENGTH) &&
    isBoundedString(value.title, MAX_TITLE_LENGTH) &&
    typeof value.completed === 'boolean' &&
    isOptionalDate(value.dueDate) &&
    isOptionalTime(value.dueTime) &&
    isOptionalBoundedString(value.dueLabel, MAX_DUE_LABEL_LENGTH) &&
    isProgress(value.progress) &&
    (value.completedAt === undefined || isIsoTimestamp(value.completedAt)) &&
    isWorkLog(value.workLog)
  );
}

function cloneSeed(): Task[] {
  return structuredClone(seedTasks) as Task[];
}

export function isTaskArray(value: unknown): value is Task[] {
  const valid =
    Array.isArray(value) &&
    value.length <= MAX_TASKS &&
    value.every((item) => {
      if (!isRecord(item) || !hasOnlyKeys(item, taskKeys)) return false;
      const task = item as Record<string, unknown>;
      return (
        hasValidCommonFields(task) &&
        isBoundedString(task.category, MAX_CATEGORY_LENGTH) &&
        isOptionalBoundedString(task.project, MAX_PROJECT_LENGTH) &&
        (task.shelved === undefined || typeof task.shelved === 'boolean') &&
        isIsoTimestamp(task.createdAt) &&
        Array.isArray(task.subtasks) &&
        task.subtasks.length <= MAX_SUBTASKS_PER_TASK &&
        task.subtasks.every((subtask) => {
          if (!isRecord(subtask) || !hasOnlyKeys(subtask, subtaskKeys)) return false;
          return (
            hasValidCommonFields(subtask) &&
            isOptionalBoundedString(subtask.category, MAX_CATEGORY_LENGTH)
          );
        })
      );
    });

  if (!valid || new TextEncoder().encode(JSON.stringify(value)).byteLength > MAX_DOCUMENT_BYTES) {
    return false;
  }

  const ids = new Set<string>();
  for (const task of value) {
    if (ids.has(task.id)) return false;
    ids.add(task.id);
    for (const subtask of task.subtasks) {
      if (ids.has(subtask.id)) return false;
      ids.add(subtask.id);
    }
  }
  return true;
}

async function currentUserId(): Promise<string> {
  const { data, error } = await createClient().auth.getUser();
  if (error || !data.user) throw error ?? new Error('You must be signed in.');
  return data.user.id;
}

export class SupabaseTaskRepository implements TaskRepository {
  async list(): Promise<Task[]> {
    const userId = await currentUserId();
    const supabase = createClient();
    const { data, error } = await supabase
      .from('task_collections')
      .select('tasks')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;

    if (data && isTaskArray(data.tasks)) return data.tasks;

    const tasks = cloneSeed();
    const { error: insertError } = await supabase
      .from('task_collections')
      .upsert({ user_id: userId, tasks }, { onConflict: 'user_id' });
    if (insertError) throw insertError;
    return tasks;
  }

  async replace(tasks: Task[]): Promise<void> {
    if (!isTaskArray(tasks)) throw new Error('Invalid task data.');
    const userId = await currentUserId();
    const { error } = await createClient()
      .from('task_collections')
      .upsert(
        { user_id: userId, tasks, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      );
    if (error) throw error;
  }

  async reset(): Promise<Task[]> {
    const tasks = cloneSeed();
    await this.replace(tasks);
    return tasks;
  }
}

// The proxy protects the UI; this repository is deliberately authenticated as
// defense in depth. There is no anonymous/local-storage fallback for task data.
export const taskRepository: TaskRepository = new SupabaseTaskRepository();

export function getSubtaskProgress(subtask: Subtask): number {
  return subtask.completed ? 1 : 0;
}

export function getTaskProgress(task: Task): number {
  if (task.subtasks.length === 0) return task.completed ? 1 : 0;
  return (
    task.subtasks.reduce(
      (sum, subtask) => sum + getSubtaskProgress(subtask),
      0,
    ) / task.subtasks.length
  );
}

export function formatWorkDone(
  task: Pick<Task, 'completed' | 'progress' | 'subtasks'>,
): string {
  if (task.completed) return 'Complete';
  const trackedWork =
    task.progress && task.progress.current > 0
      ? `${task.progress.current} ${task.progress.unit}`
      : undefined;
  if (task.subtasks.length > 0) {
    const complete = task.subtasks.filter(
      (subtask) => getSubtaskProgress(subtask) >= 1,
    ).length;
    const subtaskSummary = `${complete}/${task.subtasks.length} subtasks`;
    return trackedWork ? `${trackedWork} · ${subtaskSummary}` : subtaskSummary;
  }
  return trackedWork ?? '—';
}

export function deriveTaskCompletion(task: Task): Task {
  if (task.subtasks.length === 0) return task;
  return {
    ...task,
    completed: task.subtasks.every(
      (subtask) => getSubtaskProgress(subtask) >= 1,
    ),
  };
}

/** Adds a dated activity event without overwriting earlier work. */
export function recordWork<T extends { workLog?: WorkLogEntry[] }>(
  item: T,
  at = new Date().toISOString(),
): T {
  return { ...item, workLog: [...(item.workLog ?? []), { at }] };
}

/** Returns date-only activity records for completed tasks and work entries. */
export function getTaskActivityDates(task: Task): string[] {
  const dates: string[] = [];
  const add = (value?: string) => {
    const date = value?.slice(0, 10);
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) dates.push(date);
  };
  const addItem = (
    item: Pick<Subtask, 'completed' | 'completedAt' | 'workLog'>,
    fallback?: string,
  ) => {
    if (item.completed) add(item.completedAt ?? fallback);
    item.workLog?.forEach((entry) => add(entry.at));
  };

  addItem(task, task.createdAt);
  task.subtasks.forEach((subtask) => addItem(subtask, task.createdAt));
  return dates;
}
