import { memo, useMemo, useState } from 'react';
import type { useSortable } from '@dnd-kit/sortable';
import type { TaskBoardTaskGroup } from '../model/taskBoard.types';
import { TaskRow } from './TaskRow';
import { TaskCardHeader } from './TaskCardHeader';
import { TaskCardShell } from './TaskCardShell';
import { useTaskBoardActionContext } from './TaskBoardActionContext';

export type SortableDragAttributes = ReturnType<typeof useSortable>['attributes'];
export type SortableDragListeners = ReturnType<typeof useSortable>['listeners'];

export type TaskCardProps = {
  taskGroup: TaskBoardTaskGroup;
  setActivatorNodeRef?: (node: HTMLElement | null) => void;
  dragAttributes?: SortableDragAttributes;
  dragListeners?: SortableDragListeners;
};

const TaskCardComponent = ({
  taskGroup,
  setActivatorNodeRef,
  dragAttributes,
  dragListeners,
}: TaskCardProps) => {
  const { onTaskToggle, onEditCard, onDeleteCard, onOpenTaskList } = useTaskBoardActionContext();
  const [collapsed, setCollapsed] = useState(false);
  const tasks = taskGroup.tasks;

  const { checkedTaskCount, cardTaskCount } = useMemo(() => {
    const total = tasks.length;
    const checked = tasks.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);
    return { checkedTaskCount: checked, cardTaskCount: total };
  }, [tasks]);

  const isFullyCompleted = cardTaskCount > 0 && checkedTaskCount === cardTaskCount;

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  const handleTaskToggle = (taskId: string, checked: boolean) => {
    onTaskToggle?.(taskGroup.id, taskId, checked);
  };

  return (
    <TaskCardShell
      collapsed={collapsed}
      onClick={onOpenTaskList ? () => onOpenTaskList(taskGroup.id) : undefined}
      dragActivatorRef={setActivatorNodeRef}
      dragAttributes={dragAttributes}
      dragListeners={dragListeners}
    >
      <TaskCardHeader
        cardName={taskGroup.name}
        collapsed={collapsed}
        isFullyCompleted={isFullyCompleted}
        checkedTaskCount={checkedTaskCount}
        cardTaskCount={cardTaskCount}
        onToggleCollapsed={toggleCollapsed}
        onEditCard={() => onEditCard?.(taskGroup.id, taskGroup.name)}
        onDeleteCard={() => onDeleteCard?.(taskGroup.id)}
      />

      {!collapsed && (
        <div className="flex-1 overflow-visible">
          <div className="flex flex-col gap-2.5">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={(checked) => handleTaskToggle(task.id, checked)}
              />
            ))}
          </div>
        </div>
      )}
    </TaskCardShell>
  );
};

export const TaskCard = memo(TaskCardComponent);
