import { TaskListSidebarItem } from './taskListSidebar.types';
import { TaskListMenu } from './TaskListMenu';
import { TaskListProgress } from './TaskListProgress';

type Props = {
  list: TaskListSidebarItem;
  isActive?: boolean;
  onSelect?: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TaskListItem({ list, isActive, onSelect, onEdit, onDelete }: Props) {
  return (
    <div
      className={`border-background-tertiary flex cursor-pointer items-center justify-between gap-3 rounded-[20px] border px-4 py-3 ${isActive ? 'border-brand-primary bg-blue-50' : 'bg-white'}`}
      onClick={onSelect}
    >
      <span className="text-md text-txt-primary min-w-0 flex-1 truncate font-semibold">
        {list.title}
      </span>
      <div className="flex shrink-0 flex-row items-center gap-2">
        <TaskListProgress completed={list.completedCount} total={list.totalCount} />
        <TaskListMenu onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
