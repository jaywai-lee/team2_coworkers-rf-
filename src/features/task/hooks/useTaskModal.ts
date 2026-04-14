import { useCallback, useState } from 'react';
import { Task } from '../model/entities/task.model';

export function useTaskModal() {
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const openDetail = useCallback((task: Task) => setDetailTask(task), []);
  const openEdit = useCallback((task: Task) => setEditTask(task), []);
  const openDelete = useCallback((task: Task) => setDeleteTask(task), []);

  const closeDetail = useCallback(() => setDetailTask(null), []);
  const closeEdit = useCallback(() => setEditTask(null), []);
  const closeDelete = useCallback(() => setDeleteTask(null), []);

  return {
    detailTask,
    setDetailTask,
    editTask,
    deleteTask,

    openDetail,
    openEdit,
    openDelete,

    closeDetail,
    closeEdit,
    closeDelete,
  };
}
