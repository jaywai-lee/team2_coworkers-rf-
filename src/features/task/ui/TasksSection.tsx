import { useTaskListQuery } from '../hooks/useTaskListQuery';
import { TaskCommonParams } from '../model/params/task.params';
import TaskCreateButton from './create-task/TaskCreateButton';
import TaskItem from './TaskItem';
import TaskDetailPanel from './TaskDetailPanel';
import TaskDeleteModal from './delete-task/TaskDeleteModal';
import TaskUpdateModalContent from './update-task/TaskUpdateModalContent';
import { useTaskModal } from '../hooks/useTaskModal';
import { TasksSectionLoadingSkeleton } from '@/features/task/ui/TaskPageLayoutSkeleton';

type Props = TaskCommonParams & {
  date?: Date;
};

export default function TasksSection({ groupId, taskListId, date }: Props) {
  const { data, isLoading, isError } = useTaskListQuery(
    { groupId, taskListId },
    { date: date?.toISOString() },
  );
  const params = { groupId, taskListId };
  const taskCount = data?.tasks.length ?? 0;
  const {
    detailTask,
    setDetailTask,
    editTask,
    deleteTask,
    openDetail,
    openEdit,
    openDelete,
    closeDetail,
    closeEdit,
    closeDelete,
  } = useTaskModal();

  if (isLoading) return <TasksSectionLoadingSkeleton />;
  if (isError) return <div>에러 발생</div>;

  return (
    <>
      <section className="mx-auto flex w-full flex-col gap-2 md:max-w-[640px] lg:max-w-[734px]">
        <h2 className="text-txt-primary text-base font-semibold md:text-lg">
          할 일 목록 <span className="text-txt-secondary">({taskCount}개)</span>
        </h2>

        <ul className="flex w-full flex-col gap-2 md:gap-2.5">
          <TaskCreateButton params={params} />
          {!data || data.tasks.length === 0 ? (
            <li className="border-background-tertiary flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-8 md:gap-3 md:py-10">
              <p className="text-txt-default text-center text-sm">
                오늘의 할 일 목록이 없네요. <br />
                편안하게 쉬어볼까요?
              </p>
            </li>
          ) : (
            data.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                params={params}
                onClick={openDetail}
                onDeleteClick={openDelete}
                onEditClick={openEdit}
              />
            ))
          )}
        </ul>
      </section>
      <TaskDetailPanel
        task={detailTask}
        onClose={closeDetail}
        params={params}
        listDateIso={date?.toISOString()}
        onTaskChange={setDetailTask}
        onEditClick={openEdit}
        onDeleteClick={openDelete}
      />
      {deleteTask && (
        <TaskDeleteModal
          taskId={deleteTask.id}
          title={deleteTask.title}
          onClose={closeDelete}
          onDeleteSuccess={closeDetail}
          date={date?.toISOString()}
        />
      )}
      {editTask && (
        <TaskUpdateModalContent task={editTask} params={params} isOpen={true} onClose={closeEdit} />
      )}
    </>
  );
}
