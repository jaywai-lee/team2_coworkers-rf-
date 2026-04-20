import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { GROUP_QUERY_KEYS } from '@/features/group/lib/queryKeys';
import { TASK_QUERY_KEYS } from '@/features/task/lib/queryKeys';
import type { TaskList } from '@/features/task/model/entities/task.model';
import { toTaskList } from '@/features/task/lib/mappers/task.mapper';
import type { GroupDetail } from '@/features/group/model/entities/group.model';
import { useCreateTaskListMutation } from '@/features/task/hooks/useCreateTaskListMutation';
import { useUpdateTaskListMutation } from '@/features/task/hooks/useUpdateTaskListMutation';
import { useDeleteTaskListMutation } from '@/features/task/hooks/useDeleteTaskListMutation';
import { updateTask } from '@/features/task/api/updateTask';
import { updateTaskListOrder } from '@/features/task/api/updateTaskListOrder';
import { flattenTaskBoardTaskListIds } from '@/features/task-board/lib/flattenTaskBoardOrder';
import type { TaskListOrderPersistPayload } from '@/features/task-board/lib/useTaskBoardDnd';
import type { TaskBoardColumnStatus } from '@/features/task-board/model/taskBoard.types';
import type { Result } from '@/shared/types/result';
import { invalidateTeamTaskQueries, toNumberId, toNumberIds } from '../lib/taskListActionHelpers';

type Params = {
  groupId: number;
  onTaskListBecameFullyCompleted?: (taskListIdStr: string) => void;
  /** +로 특정 칸에서 목록 생성 완료 시 해당 칸에 보이도록 오버라이드 저장용 */
  onTaskListCreatedInColumn?: (taskListIdStr: string, status: TaskBoardColumnStatus) => void;
};

function applyOrderedTaskListIdsToGroupDetail(
  prev: GroupDetail,
  orderedIds: string[],
): GroupDetail | null {
  if (orderedIds.length === 0) return null;
  const mapById = new Map(prev.taskLists.map((tl) => [String(tl.id), tl]));
  const seen = new Set<string>();
  const nextLists = orderedIds
    .map((id, index) => {
      const tl = mapById.get(id);
      if (!tl) return null;
      seen.add(id);
      return { ...tl, order: index };
    })
    .filter((x): x is NonNullable<typeof x> => x != null);
  if (nextLists.length !== orderedIds.length) return null;
  const orphans = prev.taskLists.filter((tl) => !seen.has(String(tl.id)));
  return { ...prev, taskLists: [...nextLists, ...orphans] };
}

export function useTeamDashboardActions({
  groupId,
  onTaskListBecameFullyCompleted,
  onTaskListCreatedInColumn,
}: Params) {
  const queryClient = useQueryClient();
  const detailQueryKey = GROUP_QUERY_KEYS.detail(groupId);
  const { mutateAsync: createTaskList } = useCreateTaskListMutation({ groupId });
  const { mutateAsync: updateTaskList } = useUpdateTaskListMutation({ groupId });
  const { mutateAsync: deleteTaskList } = useDeleteTaskListMutation({ groupId });

  const handlePersistTaskListOrderFromBoard = useCallback(
    async (payload: TaskListOrderPersistPayload): Promise<void> => {
      const { nextBoard, movedTaskListId } = payload;
      const prev = queryClient.getQueryData<GroupDetail>(detailQueryKey);
      if (!prev) return;

      const orderedIds = flattenTaskBoardTaskListIds(nextBoard);
      if (orderedIds.length === 0) return;

      const displayIndex = orderedIds.indexOf(movedTaskListId);
      if (displayIndex < 0) return;

      const optimistic = applyOrderedTaskListIdsToGroupDetail(prev, orderedIds);
      if (!optimistic) return;

      await queryClient.cancelQueries({ queryKey: detailQueryKey });
      queryClient.setQueryData(detailQueryKey, optimistic);

      const taskListIdNum = toNumberId(movedTaskListId);
      if (taskListIdNum === null) return;

      const result = await updateTaskListOrder(
        { groupId, taskListId: taskListIdNum },
        { displayIndex },
      );
      if (!result.ok) {
        toast.error(result.error.message);
        await queryClient.invalidateQueries({ queryKey: detailQueryKey });
        return;
      }
      await queryClient.invalidateQueries({ queryKey: detailQueryKey });
    },
    [detailQueryKey, groupId, queryClient],
  );

  const handleCreateTaskGroup = async ({
    status,
    title,
  }: {
    status: TaskBoardColumnStatus;
    title: string;
  }): Promise<boolean> => {
    const result = await createTaskList({ name: title });
    if (!result.ok) {
      toast.error(result.error.message);
      return false;
    }

    const newIdStr = String(result.data.id);

    queryClient.setQueryData<GroupDetail>(detailQueryKey, (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        taskLists: [toTaskList(result.data), ...prev.taskLists],
      };
    });

    /** 빈 목록은 보드상 항상 TODO로 계산되므로, 진행 중/완료 칸에서 만든 경우 칼럼 오버라이드로 위치 맞춤 */
    if (status === 'IN_PROGRESS' || status === 'DONE') {
      onTaskListCreatedInColumn?.(newIdStr, status);
    }

    // true: 생성 성공. TaskBoardView에서 콜백 존재 시 로컬 생성을 건너뛴다.
    return true;
  };

  const handleUpdateTaskGroup = async ({
    taskGroupId,
    title,
  }: {
    taskGroupId: string;
    title: string;
  }): Promise<boolean> => {
    const result = await updateTaskList({
      taskListId: taskGroupId,
      body: { name: title },
    });
    if (!result.ok) {
      toast.error(result.error.message);
      return false;
    }

    queryClient.setQueryData<GroupDetail>(detailQueryKey, (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        taskLists: prev.taskLists.map((taskList) =>
          String(taskList.id) === taskGroupId ? { ...taskList, title } : taskList,
        ),
      };
    });

    // true: 캐시로 보드가 맞춰지므로 TaskBoard 쪽 로컬 setBoard 갱신 생략.
    return true;
  };

  const handleDeleteTaskGroup = async ({
    taskGroupId,
  }: {
    taskGroupId: string;
  }): Promise<boolean> => {
    const result = await deleteTaskList({ taskListId: taskGroupId });
    if (!result.ok) {
      toast.error(result.error.message);
      return false;
    }

    queryClient.setQueryData<GroupDetail>(detailQueryKey, (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        taskLists: prev.taskLists.filter((taskList) => String(taskList.id) !== taskGroupId),
      };
    });
    await invalidateTeamTaskQueries(queryClient, groupId);
    toast.success('할 일 목록을 삭제했습니다.');
    // true: 캐시로 보드가 맞춰지므로 TaskBoard 쪽 로컬 제거 생략.
    return true;
  };

  const handleToggleTask = async ({
    taskGroupId,
    taskId,
    checked,
  }: {
    taskGroupId: string;
    taskId: string;
    checked: boolean;
  }) => {
    const taskListId = toNumberId(taskGroupId);
    const taskIdNum = toNumberId(taskId);
    if (taskListId === null) {
      toast.error('할 일 목록 정보를 확인할 수 없습니다.');
      return false;
    }
    if (taskIdNum === null) {
      toast.error('할 일 정보를 확인할 수 없습니다.');
      return false;
    }

    const result = await updateTask({ groupId, taskListId, taskId: taskIdNum }, { done: checked });
    if (!result.ok) {
      toast.error(result.error.message);
      return false;
    }

    if (checked) {
      const listQueryKey = TASK_QUERY_KEYS.list({ groupId, taskListId });
      const listBefore = queryClient.getQueryData<TaskList>(listQueryKey);
      if (listBefore) {
        const nextTasks = listBefore.tasks.map((t) =>
          t.id === taskIdNum ? { ...t, isCompleted: true } : t,
        );
        const allDone = nextTasks.length > 0 && nextTasks.every((t) => t.isCompleted);
        if (allDone) {
          onTaskListBecameFullyCompleted?.(String(taskListId));
        }
      }
    }

    await invalidateTeamTaskQueries(queryClient, groupId);
    return true;
  };

  const handleCompleteTaskGroupByDrop = async ({
    taskGroupId,
    taskIds,
  }: {
    taskGroupId: string;
    taskIds: string[];
  }) => {
    const taskListId = toNumberId(taskGroupId);
    if (taskListId === null) {
      toast.error('할 일 목록 정보를 확인할 수 없습니다.');
      return false;
    }

    const numericTaskIds = toNumberIds(taskIds);
    if (numericTaskIds.length === 0) return true;

    const results = await Promise.all(
      numericTaskIds.map((taskId) => updateTask({ groupId, taskListId, taskId }, { done: true })),
    );
    const failed = results.find(
      (result): result is Extract<Result<void>, { ok: false }> => !result.ok,
    );
    if (failed) {
      toast.error(failed.error.message);
      return false;
    }

    await invalidateTeamTaskQueries(queryClient, groupId);
    return true;
  };

  const handleUncheckTaskGroupByDrop = async ({
    taskGroupId,
    taskIds,
  }: {
    taskGroupId: string;
    taskIds: string[];
  }) => {
    const taskListId = toNumberId(taskGroupId);
    if (taskListId === null) {
      toast.error('할 일 목록 정보를 확인할 수 없습니다.');
      return false;
    }

    const numericTaskIds = toNumberIds(taskIds);
    if (numericTaskIds.length === 0) return true;

    const results = await Promise.all(
      numericTaskIds.map((taskId) => updateTask({ groupId, taskListId, taskId }, { done: false })),
    );
    const failed = results.find(
      (result): result is Extract<Result<void>, { ok: false }> => !result.ok,
    );
    if (failed) {
      toast.error(failed.error.message);
      return false;
    }

    await invalidateTeamTaskQueries(queryClient, groupId);
    return true;
  };

  return {
    handleCreateTaskGroup,
    handleUpdateTaskGroup,
    handleDeleteTaskGroup,
    handleToggleTask,
    handleCompleteTaskGroupByDrop,
    handleUncheckTaskGroupByDrop,
    handlePersistTaskListOrderFromBoard,
  };
}
