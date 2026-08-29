import seedTasks from './tasks.seed.json';

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

const STORAGE_KEY = 'caxius-todo.tasks.v2';

function cloneSeed(): Task[] {
  return structuredClone(seedTasks) as Task[];
}

function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const task = item as Partial<Task>;
    return (
      typeof task.id === 'string' &&
      typeof task.title === 'string' &&
      typeof task.category === 'string' &&
      Array.isArray(task.subtasks)
    );
  });
}

export class LocalTaskRepository implements TaskRepository {
  async list(): Promise<Task[]> {
    if (typeof window === 'undefined') return cloneSeed();

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return cloneSeed();

    try {
      const parsed: unknown = JSON.parse(saved);
      return isTaskArray(parsed) ? parsed : cloneSeed();
    } catch {
      return cloneSeed();
    }
  }

  async replace(tasks: Task[]): Promise<void> {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  async reset(): Promise<Task[]> {
    const tasks = cloneSeed();
    await this.replace(tasks);
    return tasks;
  }
}

export const taskRepository: TaskRepository = new LocalTaskRepository();

export function getSubtaskProgress(subtask: Subtask): number {
  return subtask.completed ? 1 : 0;
}

export function getTaskProgress(task: Task): number {
  if (task.subtasks.length === 0) return task.completed ? 1 : 0;
  return (
    task.subtasks.reduce((sum, subtask) => sum + getSubtaskProgress(subtask), 0) /
    task.subtasks.length
  );
}

export function formatWorkDone(task: Pick<Task, 'completed' | 'progress' | 'subtasks'>): string {
  if (task.completed) return 'Complete';
  const trackedWork = task.progress && task.progress.current > 0
    ? `${task.progress.current} ${task.progress.unit}`
    : undefined;
  if (task.subtasks.length > 0) {
    const complete = task.subtasks.filter((subtask) => getSubtaskProgress(subtask) >= 1).length;
    const subtaskSummary = `${complete}/${task.subtasks.length} subtasks`;
    return trackedWork ? `${trackedWork} · ${subtaskSummary}` : subtaskSummary;
  }
  return trackedWork ?? '—';
}

export function deriveTaskCompletion(task: Task): Task {
  if (task.subtasks.length === 0) return task;
  return {
    ...task,
    completed: task.subtasks.every((subtask) => getSubtaskProgress(subtask) >= 1),
  };
}

/** Adds a dated activity event without overwriting earlier work. */
export function recordWork<T extends { workLog?: WorkLogEntry[] }>(item: T, at = new Date().toISOString()): T {
  return { ...item, workLog: [...(item.workLog ?? []), { at }] };
}

/** Returns date-only activity records for completed tasks and work entries. */
export function getTaskActivityDates(task: Task): string[] {
  const dates: string[] = [];
  const add = (value?: string) => {
    const date = value?.slice(0, 10);
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) dates.push(date);
  };
  const addItem = (item: Pick<Subtask, 'completed' | 'completedAt' | 'workLog'>, fallback?: string) => {
    if (item.completed) add(item.completedAt ?? fallback);
    item.workLog?.forEach((entry) => add(entry.at));
  };

  addItem(task, task.createdAt);
  task.subtasks.forEach((subtask) => addItem(subtask, task.createdAt));
  return dates;
}
