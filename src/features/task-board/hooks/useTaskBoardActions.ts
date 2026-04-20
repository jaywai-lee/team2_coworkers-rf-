import { useRef, useState } from 'react';
import { TaskBoard, TaskBoardColumnStatus, TaskBoardTaskGroup } from '../model';
import { applyTaskToggleToBoard } from '../lib/applyTaskToggleToBoard';

const INITIAL_CARD_INDEX: Record<TaskBoardColumnStatus, number> = {
  TODO: 1,
  IN_PROGRESS: 1,
  DONE: 1,
};

function createTaskGroup(
  status: TaskBoardColumnStatus,
  index: number,
  name: string,
): TaskBoardTaskGroup {
  const groupId = `${status}-card-${index}`;
  return { id: groupId, name, tasks: [] };
}

interface UseTaskBoardActionsParams {
  board: TaskBoard;
  setBoard: React.Dispatch<React.SetStateAction<TaskBoard>>;
  onCreateTaskGroup?: (params: {
    status: TaskBoardColumnStatus;
    title: string;
  }) => Promise<boolean> | boolean;
  onToggleTask?: (params: {
    taskGroupId: string;
    taskId: string;
    checked: boolean;
  }) => Promise<boolean | void> | boolean | void;
}

export function useTaskBoardActions({
  board,
  setBoard,
  onCreateTaskGroup,
  onToggleTask,
}: UseTaskBoardActionsParams) {
  const [creatingStatus, setCreatingStatus] = useState<TaskBoardColumnStatus | null>(null);
  const nextCardIndexByStatus = useRef<Record<TaskBoardColumnStatus, number>>({
    ...INITIAL_CARD_INDEX,
  });

  const openCreateModal = (status: TaskBoardColumnStatus) => setCreatingStatus(status);
  const closeCreateModal = () => setCreatingStatus(null);

  const handleAddCard = async (title: string) => {
    if (!creatingStatus) return;
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const status = creatingStatus;
    const created = await onCreateTaskGroup?.({ status, title: trimmedTitle });

    if (created === false) return;
    if (onCreateTaskGroup && created === true) {
      setCreatingStatus(null);
      return;
    }

    const index = nextCardIndexByStatus.current[status]++;
    const newGroup = createTaskGroup(status, index, trimmedTitle);

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.status === status ? { ...col, taskGroups: [newGroup, ...col.taskGroups] } : col,
      ),
    }));
    setCreatingStatus(null);
  };

  const handleTaskToggle = async (taskGroupId: string, taskId: string, checked: boolean) => {
    const prevBoard = board;
    setBoard((prev) => applyTaskToggleToBoard(prev, taskGroupId, taskId, checked));

    const toggled = await onToggleTask?.({ taskGroupId, taskId, checked });
    if (toggled === false) {
      setBoard(prevBoard);
    }
  };

  return {
    creatingStatus,
    openCreateModal,
    closeCreateModal,
    handleAddCard,
    handleTaskToggle,
  };
}
