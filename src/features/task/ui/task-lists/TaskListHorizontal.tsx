import { TaskListSidebarItem } from './taskListSidebar.types';
import { TaskListMenu } from './TaskListMenu';
import { TaskListProgress } from './TaskListProgress';
import { IconPlus } from '@/shared/ui/icons';
import { Button } from '@/shared/ui/Button/Button';

type Props = {
  taskLists: TaskListSidebarItem[];
  selectedId: number;
  onSelect: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
};

export function TaskListHorizontal({
  taskLists,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
}: Props) {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="flex min-w-0 flex-1 pb-2">
        <div className="no-scrollbar flex gap-3 overflow-x-auto whitespace-nowrap md:gap-3">
          {taskLists.map((list) => {
            const isActive = list.id === selectedId;

            return (
              <div
                key={list.id}
                onClick={() => onSelect(list.id)}
                className={`border-background-tertiary flex min-w-[240px] shrink-0 cursor-pointer items-center justify-between gap-3 rounded-[20px] border px-4 py-3 transition sm:min-w-[260px] ${
                  isActive ? 'border-brand-primary bg-blue-50' : 'bg-white'
                }`}
              >
                <span className="text-md text-txt-primary min-w-0 flex-1 truncate text-left font-semibold">
                  {list.title}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <TaskListProgress completed={list.completedCount} total={list.totalCount} />
                  <div onClick={(e) => e.stopPropagation()}>
                    <TaskListMenu
                      onEdit={() => onEdit(list.id)}
                      onDelete={() => onDelete(list.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onCreate}
        className="flex shrink-0 items-center justify-center rounded-xl px-2 py-2 text-xs md:px-3 md:text-sm"
        leftIcon={<IconPlus size={16} />}
      >
        추가하기
      </Button>
    </div>
  );
}
