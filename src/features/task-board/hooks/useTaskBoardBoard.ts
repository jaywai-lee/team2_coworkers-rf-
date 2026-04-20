import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { TaskBoard } from '../model/taskBoard.types';
import { removeTaskGroupFromBoard, renameTaskGroupInBoard } from '../lib/taskBoardLocalUpdates';

const DRAG_LOCK_DURATION_MS = 1500;

export function useTaskBoardBoard(initialBoard: TaskBoard) {
  const [board, setBoard] = useState<TaskBoard>(initialBoard);
  const dragLockRef = useRef(false);
  const dragLockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (dragLockTimerRef.current) clearTimeout(dragLockTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (dragLockRef.current) {
      return;
    }
    setBoard(initialBoard);
  }, [initialBoard]);

  const setBoardWithDragLock: Dispatch<SetStateAction<TaskBoard>> = useCallback((action) => {
    dragLockRef.current = true;
    if (dragLockTimerRef.current) clearTimeout(dragLockTimerRef.current);

    dragLockTimerRef.current = setTimeout(() => {
      dragLockRef.current = false;
    }, DRAG_LOCK_DURATION_MS);

    setBoard(action);
  }, []);

  const setCardNameLocal = useCallback((taskGroupId: string, title: string) => {
    setBoard((prev) => renameTaskGroupInBoard(prev, taskGroupId, title));
  }, []);

  const removeCardLocal = useCallback((taskGroupId: string) => {
    setBoard((prev) => removeTaskGroupFromBoard(prev, taskGroupId));
  }, []);

  return { board, setBoard: setBoardWithDragLock, setCardNameLocal, removeCardLocal };
}
