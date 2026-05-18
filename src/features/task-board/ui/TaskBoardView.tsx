import { DndContext } from '@dnd-kit/core';
import { cn } from '@/shared/lib/cn';
import type { TaskBoard, TaskBoardColumn, TaskBoardColumnStatus } from '../model/taskBoard.types';
import { taskBoardCollisionDetection } from '../lib/taskBoardCollisionDetection';
import { useTaskBoardDnd, type TaskListOrderPersistPayload } from '../lib/useTaskBoardDnd';
import { useTaskBoardSensors } from '../lib/useTaskBoardSensors';
import { useMemo, type ReactNode } from 'react';
import { TaskColumn } from './TaskColumn';
import { CreateTaskBoardModal } from './CreateTaskBoardModal';
import { useTaskBoardCardActions } from '../hooks/useTaskBoardCardActions';
import { TaskBoardCardActionModals } from './TaskBoardCardActionModals';
import { useTaskBoardBoard } from '../hooks/useTaskBoardBoard';
import { TaskBoardDragOverlay } from './TaskBoardDragOverlay';
import { EMPTY_TASK_BOARD } from '../lib/constants';
import { useTaskBoardActions } from '../hooks/useTaskBoardActions';
import { TaskBoardActionProvider } from './TaskBoardActionContext';

type Props = {
  initialBoard?: TaskBoard;
  trailingPanel?: ReactNode;
  onCreateTaskGroup?: (params: {
    status: TaskBoardColumnStatus;
    title: string;
  }) => Promise<boolean> | boolean;
  onToggleTask?: (params: {
    taskGroupId: string;
    taskId: string;
    checked: boolean;
  }) => Promise<boolean | void> | boolean | void;
  onCompleteTaskGroupByDrop?: (params: {
    taskGroupId: string;
    taskIds: string[];
  }) => Promise<boolean | void> | boolean | void;
  onUncheckTaskGroupByDrop?: (params: {
    taskGroupId: string;
    taskIds: string[];
  }) => Promise<boolean | void> | boolean | void;
  onUpdateTaskGroup?: (params: {
    taskGroupId: string;
    title: string;
  }) => Promise<boolean | void> | boolean | void;
  onDeleteTaskGroup?: (params: { taskGroupId: string }) => Promise<boolean | void> | boolean | void;
  onOpenTaskList?: (taskGroupId: string) => void;
  onTaskListOrderPersist?: (payload: TaskListOrderPersistPayload) => Promise<void> | void;
};

export function TaskBoardView({
  initialBoard = EMPTY_TASK_BOARD,
  trailingPanel,
  onCreateTaskGroup,
  onToggleTask,
  onCompleteTaskGroupByDrop,
  onUncheckTaskGroupByDrop,
  onUpdateTaskGroup,
  onDeleteTaskGroup,
  onOpenTaskList,
  onTaskListOrderPersist,
}: Props) {
  const { board, setBoard, setCardNameLocal, removeCardLocal } = useTaskBoardBoard(initialBoard);
  const sensors = useTaskBoardSensors();

  const { creatingStatus, openCreateModal, closeCreateModal, handleAddCard, handleTaskToggle } =
    useTaskBoardActions({ board, setBoard, onCreateTaskGroup, onToggleTask });

  const {
    activeTaskGroupId,
    dropIndicatorId,
    activeTaskGroup,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useTaskBoardDnd({
    board,
    setBoard,
    onTaskListOrderPersist,
    onTaskGroupDropped: ({ taskGroupId, targetStatus, taskIdsToComplete, taskIdsToUncheck }) => {
      if (targetStatus === 'DONE' && taskIdsToComplete.length > 0) {
        void onCompleteTaskGroupByDrop?.({ taskGroupId, taskIds: taskIdsToComplete });
      }
      if (targetStatus === 'TODO' && taskIdsToUncheck.length > 0) {
        void onUncheckTaskGroupByDrop?.({ taskGroupId, taskIds: taskIdsToUncheck });
      }
    },
  });

  const {
    editingCard,
    editedTitle,
    setEditedTitle,
    setEditingCard,
    deletingCardId,
    setDeletingCardId,
    openEditCardModal,
    handleConfirmEditCard,
    openDeleteCardModal,
    handleConfirmDeleteCard,
  } = useTaskBoardCardActions({
    onUpdateTaskGroup,
    onDeleteTaskGroup,
    setCardNameLocal,
    removeCardLocal,
  });

  const actionValues = useMemo(
    () => ({
      onTaskToggle: handleTaskToggle,
      onEditCard: openEditCardModal,
      onDeleteCard: openDeleteCardModal,
      onOpenTaskList: onOpenTaskList,
    }),
    [handleTaskToggle, openEditCardModal, openDeleteCardModal, onOpenTaskList],
  );

  return (
    <TaskBoardActionProvider value={actionValues}>
      <DndContext
        collisionDetection={taskBoardCollisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        sensors={sensors}
      >
        <div
          className={cn(
            'flex flex-col items-start gap-4 overflow-x-visible pb-2',
            'lg:flex-row lg:items-start lg:gap-5 lg:overflow-x-auto lg:overflow-y-hidden',
          )}
        >
          {board.columns.map((col: TaskBoardColumn) => (
            <div key={col.id} className="w-full min-w-0 shrink-0 lg:w-67.5">
              <TaskColumn
                status={col.status}
                taskGroups={col.taskGroups}
                onAddCard={openCreateModal}
                activeTaskGroupId={activeTaskGroupId}
                dropIndicatorId={dropIndicatorId}
              />
            </div>
          ))}
          {trailingPanel != null && (
            <div className="hidden min-w-0 shrink-0 self-start lg:flex lg:w-60 lg:flex-col">
              {trailingPanel}
            </div>
          )}
        </div>

        <TaskBoardDragOverlay activeTaskGroup={activeTaskGroup} />
      </DndContext>

      <CreateTaskBoardModal
        isOpen={creatingStatus !== null}
        close={closeCreateModal}
        onSubmit={handleAddCard}
      />

      <TaskBoardCardActionModals
        editingCard={editingCard}
        editedTitle={editedTitle}
        setEditedTitle={setEditedTitle}
        setEditingCard={setEditingCard}
        onConfirmEdit={handleConfirmEditCard}
        deletingCardId={deletingCardId}
        setDeletingCardId={setDeletingCardId}
        onConfirmDelete={handleConfirmDeleteCard}
      />
    </TaskBoardActionProvider>
  );
}
