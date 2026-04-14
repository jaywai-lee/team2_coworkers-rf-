import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { GroupDetail } from '@/features/group/model/entities/group.model';
import { GROUP_QUERY_KEYS } from '@/features/group/lib/queryKeys';
import { toTaskList } from '../lib/mappers/task.mapper';
import type { TaskList } from '../model/entities/task.model';
import { useCreateTaskListMutation } from './useCreateTaskListMutation';
import { useUpdateTaskListMutation } from './useUpdateTaskListMutation';
import { useDeleteTaskListMutation } from './useDeleteTaskListMutation';
import { TASK_QUERY_KEYS } from '../lib/queryKeys';

type Params = {
  groupId: number;
  currentTaskListId: number;
  taskLists: TaskList[] | undefined;
  onSelectTaskList: (id: number) => void;
};

export function useTaskListActions({
  groupId,
  currentTaskListId,
  taskLists,
  onSelectTaskList,
}: Params) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<{ taskListId: number; title: string } | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { mutateAsync: createTaskList } = useCreateTaskListMutation({ groupId });
  const { mutateAsync: updateTaskList } = useUpdateTaskListMutation({ groupId });
  const { mutateAsync: deleteTaskList } = useDeleteTaskListMutation({ groupId });

  const openEditModal = (id: number) => {
    const list = taskLists?.find((l) => Number(l.id) === Number(id));
    setEditing(list ? { taskListId: list.id, title: list.title } : { taskListId: id, title: '' });
    setEditedTitle(list?.title ?? '');
  };

  const openDeleteModal = (id: number) => {
    setDeletingId(id);
  };

  const openCreateModal = () => setIsCreateOpen(true);
  const closeCreateModal = () => setIsCreateOpen(false);
  const closeEditModal = () => setEditing(null);
  const closeDeleteModal = () => setDeletingId(null);

  const handleCreateSubmit = async (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const result = await createTaskList({ name: trimmed });
    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }

    queryClient.setQueryData<GroupDetail>(GROUP_QUERY_KEYS.detail(groupId), (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        taskLists: [toTaskList(result.data), ...prev.taskLists],
      };
    });

    queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.detail(groupId) });
    toast.success('할 일 목록을 만들었습니다.');
  };

  const handleConfirmEdit = async () => {
    if (!editing) return;

    const trimmed = editedTitle.trim();
    if (!trimmed || trimmed === editing.title) {
      setEditing(null);
      return;
    }

    const result = await updateTaskList({
      taskListId: editing.taskListId,
      body: { name: trimmed },
    });

    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }

    queryClient.setQueryData<GroupDetail>(GROUP_QUERY_KEYS.detail(groupId), (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        taskLists: prev.taskLists.map((item) =>
          Number(item.id) === Number(editing.taskListId) ? { ...item, title: trimmed } : item,
        ),
      };
    });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.detail(groupId) }),
      queryClient.invalidateQueries({ queryKey: ['taskListDetail', groupId, editing.taskListId] }),
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all }),
    ]);

    toast.success('할 일 목록을 수정했습니다.');
    setEditing(null);
  };

  const handleConfirmDelete = async () => {
    if (deletingId == null) return;

    const deletedId = deletingId;
    const result = await deleteTaskList({ taskListId: deletedId });
    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }

    let nextId: number | null = null;
    queryClient.setQueryData<GroupDetail>(GROUP_QUERY_KEYS.detail(groupId), (prev) => {
      if (!prev) return prev;
      const filtered = prev.taskLists.filter((item) => Number(item.id) !== Number(deletedId));
      nextId = filtered[0]?.id ?? null;
      return { ...prev, taskLists: filtered };
    });

    queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.detail(groupId) });
    queryClient.invalidateQueries({ queryKey: ['taskListDetail', groupId, deletingId] });
    toast.success('할 일 목록을 삭제했습니다.');
    setDeletingId(null);

    if (Number(currentTaskListId) === Number(deletedId) && nextId != null) {
      onSelectTaskList(nextId);
    }
  };

  return {
    isCreateOpen,
    openCreateModal,
    closeCreateModal,
    editing,
    closeEditModal,
    editedTitle,
    setEditedTitle,
    deletingId,
    openEditModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateSubmit,
    handleConfirmEdit,
    handleConfirmDelete,
  };
}
