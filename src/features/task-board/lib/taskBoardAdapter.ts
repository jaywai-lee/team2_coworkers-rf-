import type { Task, TaskList } from '@/features/task/model/entities/task.model';
import type {
  TaskBoard,
  TaskBoardColumnStatus,
  TaskBoardTaskGroup,
} from '@/features/task-board/model/taskBoard.types';

function toTaskGroup(taskList: TaskList, tasks: Task[]): TaskBoardTaskGroup {
  const taskListId = String(taskList.id);
  return {
    id: taskListId,
    name: taskList.title,
    tasks: tasks.map((task) => ({
      id: String(task.id),
      title: task.title,
      completed: task.isCompleted,
    })),
  };
}

function columnFromCompletion(resolvedTasks: Task[]): TaskBoardColumnStatus {
  const taskCount = resolvedTasks.length;
  const completedCount = resolvedTasks.filter((task) => task.isCompleted).length;
  if (taskCount > 0 && completedCount === taskCount) return 'DONE';
  if (completedCount > 0) return 'IN_PROGRESS';
  return 'TODO';
}

export function toTaskBoard(
  taskLists: TaskList[],
  tasksByDate?: Task[],
  columnOverrides?: ReadonlyMap<string, TaskBoardColumnStatus>,
): TaskBoard {
  const todoGroups: TaskBoardTaskGroup[] = [];
  const inProgressGroups: TaskBoardTaskGroup[] = [];
  const doneGroups: TaskBoardTaskGroup[] = [];

  const hasDateScopedTasks = tasksByDate !== undefined;
  const hasAnyTaskListMapping = (tasksByDate ?? []).some((task) => task.taskListId != null);
  const tasksByTaskListId = new Map<number, Task[]>();

  for (const task of tasksByDate ?? []) {
    if (!task.taskListId) continue;
    const prev = tasksByTaskListId.get(task.taskListId) ?? [];
    prev.push(task);
    tasksByTaskListId.set(task.taskListId, prev);
  }

  const orderedLists = [...taskLists].sort((a, b) => a.order - b.order || a.id - b.id);

  for (const taskList of orderedLists) {
    const resolvedTasks =
      hasDateScopedTasks && hasAnyTaskListMapping
        ? (tasksByTaskListId.get(taskList.id) ?? [])
        : taskList.tasks;
    const group = toTaskGroup(taskList, resolvedTasks);
    const computed = columnFromCompletion(resolvedTasks);
    const override = columnOverrides?.get(String(taskList.id));

    let effective: TaskBoardColumnStatus = override ?? computed;
    if (computed === 'IN_PROGRESS' && override === 'TODO') {
      effective = 'IN_PROGRESS';
    }

    if (effective === 'DONE') {
      doneGroups.push(group);
    } else if (effective === 'IN_PROGRESS') {
      inProgressGroups.push(group);
    } else {
      todoGroups.push(group);
    }
  }

  return {
    columns: [
      {
        id: 'todo',
        status: 'TODO',
        taskGroups: todoGroups,
      },
      {
        id: 'in-progress',
        status: 'IN_PROGRESS',
        taskGroups: inProgressGroups,
      },
      {
        id: 'done',
        status: 'DONE',
        taskGroups: doneGroups,
      },
    ],
  };
}
