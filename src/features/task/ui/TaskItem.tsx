import Checkbox from '@/shared/ui/checkbox';
import { Task } from '../model/entities/task.model';
import { IconCalendar } from '@/shared/ui/icons/IconCalendar';
import { IconRepeat } from '@/shared/ui/icons/IconRepeat';
import { formatDate } from '@/shared/lib/date';
import { IconComment } from '@/shared/ui/icons/IconComment';
import { useToggleTaskMutation } from '../hooks/useToggleTaskMutation';
import { TaskCommonParams } from '../model/params/task.params';
import { RECURRENCE_LABEL_MAP } from '../model/constants/recurrenceLabel';
import { memo } from 'react';
import KebabMenu from '@/features/boards/components/KebabMenu';

type Props = {
  task: Task;
  onClick: (task: Task) => void;
  params: TaskCommonParams;
  onDeleteClick: (task: Task) => void;
  onEditClick: (task: Task) => void;
};

type MetaItemProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function MetaItem({ icon, children }: MetaItemProps) {
  return (
    <div className="text-txt-default flex items-center gap-1 text-xs">
      {icon}
      <span>{children}</span>
    </div>
  );
}

function TaskItem({ task, onClick, params, onDeleteClick, onEditClick }: Props) {
  const { mutate } = useToggleTaskMutation(params);
  const checkboxId = `task-${task.id}`;

  const handleToggle = (checked: boolean) => {
    mutate({
      groupId: params.groupId,
      taskListId: params.taskListId,
      taskId: task.id,
      done: checked,
    });
  };
  return (
    <li
      onClick={() => onClick(task)}
      className="border-background-tertiary relative flex items-start justify-between gap-2 rounded-lg border bg-white px-2.5 py-2 hover:cursor-pointer md:gap-3 md:px-3 md:py-2.5"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <div onClick={(e) => e.stopPropagation()} className="shrink-0">
            <Checkbox
              id={checkboxId}
              size="lg"
              checked={task.isCompleted}
              onChange={handleToggle}
            />
          </div>
          <div className="flex min-w-0 flex-1 overflow-hidden">
            <div className="inline-flex max-w-full min-w-0 items-center gap-1.5">
              <label
                htmlFor={checkboxId}
                onClick={(e) => e.stopPropagation()}
                className={`min-w-0 cursor-pointer truncate text-sm transition-colors md:text-sm ${task.isCompleted ? 'text-gray-400 line-through' : 'text-txt-primary'}`}
              >
                {task.title}
              </label>
              <div className="shrink-0">
                <MetaItem icon={<IconComment />}>{task.commentCount}</MetaItem>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 md:mt-0 md:gap-2">
          <MetaItem icon={<IconCalendar />}>{task.date && formatDate(task.date)}</MetaItem>
          <span className="bg-txt-secondary h-3 w-px" />
          <MetaItem icon={<IconRepeat />}>{RECURRENCE_LABEL_MAP[task.recurrence]}</MetaItem>
        </div>
      </div>

      <KebabMenu
        onEdit={() => onEditClick(task)}
        onDelete={() => onDeleteClick(task)}
        isDeleteDanger
        align="side-left"
      />
    </li>
  );
}

export default memo(TaskItem);
