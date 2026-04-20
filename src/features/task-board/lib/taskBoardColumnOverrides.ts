import type { TaskBoard, TaskBoardColumnStatus } from '@/features/task-board/model/taskBoard.types';
import type { Task } from '@/features/task/model/entities/task.model';

const STORAGE_PREFIX = 'coworkers:taskBoardColumnOverrides:';

function storageKey(groupId: number) {
  return `${STORAGE_PREFIX}${groupId}`;
}

export function loadTaskBoardColumnOverrides(groupId: number): Map<string, TaskBoardColumnStatus> {
  if (typeof window === 'undefined') return new Map();
  try {
    const raw = localStorage.getItem(storageKey(groupId));
    if (!raw) return new Map();
    const obj = JSON.parse(raw) as Record<string, string>;
    const m = new Map<string, TaskBoardColumnStatus>();
    for (const [k, v] of Object.entries(obj)) {
      if (v === 'TODO' || v === 'IN_PROGRESS' || v === 'DONE') {
        m.set(k, v);
      }
    }
    return m;
  } catch {
    return new Map();
  }
}

export function saveTaskBoardColumnOverrides(groupId: number, map: Map<string, TaskBoardColumnStatus>) {
  if (typeof window === 'undefined') return;
  const obj: Record<string, TaskBoardColumnStatus> = {};
  map.forEach((v, k) => {
    obj[k] = v;
  });
  if (Object.keys(obj).length === 0) {
    localStorage.removeItem(storageKey(groupId));
    return;
  }
  localStorage.setItem(storageKey(groupId), JSON.stringify(obj));
}

function findGroupInBoard(
  board: TaskBoard,
  taskListId: string,
): { status: TaskBoardColumnStatus; tasks: { completed: boolean }[] } | null {
  for (const col of board.columns) {
    const g = col.taskGroups.find((x) => x.id === taskListId);
    if (g) return { status: col.status, tasks: g.tasks };
  }
  return null;
}

export function computeColumnFromTasks(tasks: { isCompleted: boolean }[]): TaskBoardColumnStatus {
  const taskCount = tasks.length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  if (taskCount > 0 && completedCount === taskCount) return 'DONE';
  if (completedCount > 0) return 'IN_PROGRESS';
  return 'TODO';
}

export function mergeColumnOverrideAfterDrag(
  prev: Map<string, TaskBoardColumnStatus>,
  groupId: number,
  nextBoard: TaskBoard,
  movedTaskListId: string,
): Map<string, TaskBoardColumnStatus> {
  const found = findGroupInBoard(nextBoard, movedTaskListId);
  if (!found) return prev;

  const computed = computeColumnFromTasks(found.tasks.map((t) => ({ isCompleted: t.completed })));
  const visual = found.status;
  const next = new Map(prev);

  if (visual !== computed) {
    next.set(movedTaskListId, visual);
  } else {
    next.delete(movedTaskListId);
  }

  saveTaskBoardColumnOverrides(groupId, next);
  return next;
}

/**
 * 더 이상 toTaskBoard에서 쓰이지 않는 오버라이드 제거.
 * - 완료 0개 → 할 일 확정
 * - 일부 완료인데 TODO 오버라이드 → 전부 완료+할 일용 값이므로 제거
 */
export function pruneColumnOverridesForTodoComputed(
  prev: Map<string, TaskBoardColumnStatus>,
  groupId: number,
  taskLists: { id: number; tasks: Task[] }[],
): Map<string, TaskBoardColumnStatus> {
  let changed = false;
  const next = new Map(prev);
  for (const idStr of [...next.keys()]) {
    const tl = taskLists.find((t) => String(t.id) === idStr);
    if (!tl) continue;
    const computed = computeColumnFromTasks(tl.tasks);
    if (computed === 'TODO') {
      const keep =
        next.get(idStr) === 'IN_PROGRESS' || next.get(idStr) === 'DONE';
      /** 빈(또는 미완료만 있는) 목록을 진행 중·완료 칸에 둔 경우 오버라이드 유지 */
      if (keep) continue;
      next.delete(idStr);
      changed = true;
    } else if (computed === 'IN_PROGRESS' && next.get(idStr) === 'TODO') {
      next.delete(idStr);
      changed = true;
    }
  }
  if (!changed) return prev;
  saveTaskBoardColumnOverrides(groupId, next);
  return next;
}
