import { formatDateTime } from '@/shared/lib/date';
import { Task } from '../model/entities/task.model';
import { TaskCommonParams } from '../model/params/task.params';
import { useToggleTaskMutation } from '../hooks/useToggleTaskMutation';
import { IconCalendar } from '@/shared/ui/icons/IconCalendar';
import { IconRepeat } from '@/shared/ui/icons/IconRepeat';
import { Button } from '@/shared/ui/Button/Button';
import { IconCheck, IconClose } from '@/shared/ui/icons';
import { RECURRENCE_LABEL_MAP } from '../model/constants/recurrenceLabel';
import { TaskDetailComments } from './task-comments/TaskDetailComments';
import Dropdown from '@/shared/ui/dropdown';
import { IconKebab } from '@/shared/ui/icons/IconKebab';
import { Profile } from '@/shared/ui/profile';
import { cn } from '@/shared/lib/cn';

type Props = {
  task: Task | null;
  onClose: () => void;
  params: TaskCommonParams;
  listDateIso?: string;
  onTaskChange?: (task: Task) => void;
  onEditClick: (task: Task) => void;
  onDeleteClick: (task: Task) => void;
};

type MetaItemProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
};

function MetaItem({ icon, children }: MetaItemProps) {
  return (
    <div className="text-txt-default flex items-center gap-1 text-xs">
      {icon}
      <span>{children}</span>
    </div>
  );
}

export default function TaskDetailPanel({
  task,
  onClose,
  params,
  listDateIso,
  onTaskChange,
  onEditClick,
  onDeleteClick,
}: Props) {
  const { mutate, isPending } = useToggleTaskMutation(params);

  const handleToggleComplete = () => {
    if (!task || isPending) return;
    const nextDone = !task.isCompleted;
    mutate(
      {
        groupId: params.groupId,
        taskListId: params.taskListId,
        taskId: task.id,
        done: nextDone,
      },
      {
        onSuccess: () => {
          onTaskChange?.({
            ...task,
            isCompleted: nextDone,
            completedAt: nextDone ? new Date().toISOString() : undefined,
          });
        },
      },
    );
  };

  return (
    <>
      {task && <div className="fixed inset-0 z-40" onClick={onClose} />}

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-full bg-white shadow-[0_15px_50px_-12px_rgba(0,0,0,0.3)] transition-transform duration-300 sm:max-w-md md:max-w-[420px] ${task ? 'translate-x-0' : 'translate-x-full'} `}
      >
        {task && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-4 md:px-6 md:py-5">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                aria-label="닫기"
                leftIcon={<IconClose size={24} />}
                className="border-none p-0 text-gray-400 hover:text-gray-600"
              />
            </div>

            <div className="flex items-center justify-between gap-3 px-4 pt-6 md:px-8 lg:px-10 lg:pt-10">
              <h2 className="min-w-0 flex-1 text-lg font-semibold text-gray-900 md:text-xl">
                {task.title}
              </h2>
              <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                <Dropdown>
                  <Dropdown.Trigger
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPending) e.preventDefault();
                    }}
                    className={cn(
                      'text-icon-primary hover:text-txt-primary cursor-pointer rounded p-1 text-gray-400',
                      isPending && 'pointer-events-none opacity-40',
                    )}
                    aria-label="할 일 메뉴"
                  >
                    <IconKebab size={20} />
                  </Dropdown.Trigger>
                  <Dropdown.Menu className="absolute right-0 z-[100] mt-2 w-28">
                    <Dropdown.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isPending) return;
                        onEditClick(task);
                      }}
                      className="px-3 py-2"
                    >
                      수정하기
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isPending) return;
                        onDeleteClick(task);
                      }}
                      className="px-3 py-2"
                    >
                      삭제하기
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 px-4 pb-4 md:px-7">
              <Profile
                size="md"
                imageSrc={task.writer?.imageUrl}
                decorative
                alt={`${task.writer?.nickname ?? '작성자'} 프로필`}
              />
              <span className="text-sm text-gray-700">{task.writer?.nickname ?? '작성자'}</span>
            </div>

            <div className="flex flex-col gap-4 px-4 md:flex-row md:items-start md:justify-between md:gap-3 md:px-6">
              <div className="flex min-w-0 flex-col gap-2">
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <MetaItem icon={<IconCalendar size={16} />}>시작 날짜</MetaItem>
                  <p className="font-weight-regular text-txt-primary text-sm">
                    {formatDateTime(task.date)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <MetaItem icon={<IconRepeat />}>반복 설정</MetaItem>
                  <p className="font-weight-regular text-txt-primary text-sm">
                    {RECURRENCE_LABEL_MAP[task.recurrence]}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                leftIcon={<IconCheck />}
                disabled={isPending}
                className="w-full shrink-0 md:w-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPending) return;
                  handleToggleComplete();
                }}
              >
                {task.isCompleted ? '완료 취소' : '완료하기'}
              </Button>
            </div>

            <div className="border-background-tertiary mx-4 mt-5 border-t md:mx-7" />

            <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
              <p className="font-weight-regular text-txt-primary text-sm leading-relaxed">
                {task.description}
              </p>

              <TaskDetailComments
                task={task}
                params={params}
                listDateIso={listDateIso}
                onTaskChange={onTaskChange}
              />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
