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

function cloneSeed(): Task[] {
  return structuredClone(seedTasks) as Task[];
}

function isTaskArray(value: unknown): value is Task[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!item || typeof item !== 'object') return false;
      const task = item as Partial<Task>;
      return (
        typeof task.id === 'string' &&
        typeof task.title === 'string' &&
        typeof task.category === 'string' &&
        Array.isArray(task.subtasks)
      );
    })
  );
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

export class LocalTaskRepository implements TaskRepository {
  async list(): Promise<Task[]> {
    throw new Error(
      'Local task storage has been retired. Sign in to use Dudu.',
    );
  }

  async replace(_tasks: Task[]): Promise<void> {
    throw new Error(
      'Local task storage has been retired. Sign in to use Dudu.',
    );
  }

  async reset(): Promise<Task[]> {
    throw new Error(
      'Local task storage has been retired. Sign in to use Dudu.',
    );
  }
}

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
