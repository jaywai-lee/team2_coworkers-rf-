import { TaskList } from '@/features/task/model/entities/task.model';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { TaskBoardColumnStatus } from '../model';
import {
  loadTaskBoardColumnOverrides,
  mergeColumnOverrideAfterDrag,
  pruneColumnOverridesForTodoComputed,
  saveTaskBoardColumnOverrides,
} from '../lib/taskBoardColumnOverrides';
import { toTaskBoard } from '../lib/taskBoardAdapter';
import { TaskListOrderPersistPayload } from '../lib/useTaskBoardDnd';

export function useTaskBoardState(groupId: number, boardTaskLists: TaskList[]) {
  const [columnOverrides, setColumnOverrides] = useState<Map<string, TaskBoardColumnStatus>>(
    () => new Map(),
  );

  useEffect(() => {
    setColumnOverrides(loadTaskBoardColumnOverrides(groupId));
  }, [groupId]);

  useLayoutEffect(() => {
    setColumnOverrides((prev) =>
      pruneColumnOverridesForTodoComputed(prev, groupId, boardTaskLists),
    );
  }, [groupId, boardTaskLists]);

  const initialBoard = useMemo(
    () => toTaskBoard(boardTaskLists, undefined, columnOverrides),
    [boardTaskLists, columnOverrides],
  );

  const clearColumnOverride = useCallback(
    (taskListIdStr: string) => {
      setColumnOverrides((prev) => {
        if (!prev.has(taskListIdStr)) return prev;
        const next = new Map(prev);
        next.delete(taskListIdStr);
        saveTaskBoardColumnOverrides(groupId, next);
        return next;
      });
    },
    [groupId],
  );

  const setColumnOverride = useCallback(
    (taskListIdStr: string, status: TaskBoardColumnStatus) => {
      setColumnOverrides((prev) => {
        const next = new Map(prev);
        next.set(taskListIdStr, status);
        saveTaskBoardColumnOverrides(groupId, next);
        return next;
      });
    },
    [groupId],
  );

  const mergeOverrideAfterDrag = useCallback(
    (payload: TaskListOrderPersistPayload) => {
      setColumnOverrides((prev) =>
        mergeColumnOverrideAfterDrag(prev, groupId, payload.nextBoard, payload.movedTaskListId),
      );
    },
    [groupId],
  );

  return {
    initialBoard,
    clearColumnOverride,
    setColumnOverride,
    mergeOverrideAfterDrag,
  };
}
