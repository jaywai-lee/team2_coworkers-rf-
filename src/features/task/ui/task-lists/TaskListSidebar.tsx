import { Button } from '@/shared/ui/Button/Button';
import { TaskListItem } from './TaskListItem';
import { TaskListSidebarItem } from './taskListSidebar.types';
import { IconPlus } from '@/shared/ui/icons';

type Props = {
  taskLists: TaskListSidebarItem[];
  selectedId: number;
  onSelect: (id: number) => void;
  onCreate: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export function TaskListSidebar({
  taskLists,
  selectedId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      {taskLists.map((list) => (
        <TaskListItem
          key={list.id}
          list={list}
          isActive={list.id === selectedId}
          onSelect={() => onSelect(list.id)}
          onEdit={() => onEdit(list.id)}
          onDelete={() => onDelete(list.id)}
        />
      ))}
      <Button
        variant="outline"
        onClick={onCreate}
        className="mt-2 flex w-full items-center justify-center rounded-xl py-2 text-sm"
        leftIcon={<IconPlus size={16} />}
      >
        할 일 추가
      </Button>
    </div>
  );
}
