import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import type { TaskBoardColumnStatus, TaskBoardTaskGroup } from '../model/taskBoard.types';
import { TASK_BOARD_COLUMN_STATUS_LABEL } from '../lib/taskBoardColumnLabels';
import { TaskColumnStatusHeader } from './TaskColumnStatusHeader';
import { cn } from '@/shared/lib/cn';
import { TaskSortableCardItem } from './TaskSortableCardItem';

export type TaskColumnProps = {
  status: TaskBoardColumnStatus;
  taskGroups: TaskBoardTaskGroup[];
  onAddCard: () => void;
  activeTaskGroupId?: string | null;
  dropIndicatorId?: string | null;
};

const COLUMN_DROPPABLE_ID_PREFIX = 'task-board-column:';
const getColumnDroppableId = (status: TaskBoardColumnStatus) =>
  `${COLUMN_DROPPABLE_ID_PREFIX}${status}`;

const staticSortingStrategy = () => null;

export function TaskColumn({
  status,
  taskGroups,
  onAddCard,
  activeTaskGroupId,
  dropIndicatorId,
}: TaskColumnProps) {
  const label = TASK_BOARD_COLUMN_STATUS_LABEL[status];
  const droppableId = useMemo(() => getColumnDroppableId(status), [status]);

  const { setNodeRef } = useDroppable({
    id: droppableId,
    data: { type: 'column', columnStatus: status },
  });

  const isColumnDropTarget = dropIndicatorId === `column:${droppableId}`;

  const showEmptyColumnDropIndicator = isColumnDropTarget && taskGroups.length === 0;
  const showBottomDropIndicator = isColumnDropTarget && taskGroups.length > 0;

  const isActiveInThisColumn =
    activeTaskGroupId != null && taskGroups.some((g) => g.id === activeTaskGroupId);

  const itemIds = taskGroups.map((g) => g.id);

  return (
    <div className="relative flex flex-col gap-3">
      <TaskColumnStatusHeader label={label} onAddTask={onAddCard} />

      <div
        ref={setNodeRef}
        className={cn(
          'relative flex flex-col gap-3 rounded-xl transition-colors duration-200',
          taskGroups.length === 0 && 'min-h-30',
          isColumnDropTarget && 'bg-brand-secondary/60',
        )}
      >
        <SortableContext items={itemIds} strategy={staticSortingStrategy}>
          {taskGroups.map((group) => (
            <TaskSortableCardItem
              key={group.id}
              taskGroup={group}
              columnStatus={status}
              isActiveInThisColumn={isActiveInThisColumn}
              activeTaskGroupId={activeTaskGroupId}
              dropIndicatorId={dropIndicatorId}
              suppressDropIndicatorBefore={false}
            />
          ))}
        </SortableContext>

        {showEmptyColumnDropIndicator && (
          <div className="pointer-events-none absolute top-2 right-0 left-0 z-10 px-1" aria-hidden>
            <div className="bg-brand-primary h-0.75 w-full shrink-0 rounded-full" />
          </div>
        )}

        {showBottomDropIndicator && (
          <div className="bg-brand-primary pointer-events-none absolute right-0 -bottom-1.5 left-0 z-10 h-0.75 rounded-full" />
        )}
      </div>
    </div>
  );
}
