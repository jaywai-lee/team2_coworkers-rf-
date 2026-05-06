import Header from '@/features/task/ui/header/header';
import WeekCalendar from '@/features/task/ui/weekdate/weekDate';
import { useCallback, useState } from 'react';
import { TaskListSidebar } from './task-lists/TaskListSidebar';
import TasksSection from './TasksSection';
import { TaskListHorizontal } from './task-lists/TaskListHorizontal';
import { useRouter } from 'next/router';
import { useGroupQuery } from '@/features/group/hooks/useGroupQuery';
import type { TaskList } from '@/features/task/model/entities/task.model';
import type { TaskListSidebarItem } from './task-lists/taskListSidebar.types';
import { CreateTaskBoardModal } from '@/features/task-board/ui/CreateTaskBoardModal';
import { EditTaskGroupModal } from '@/features/task-board/ui/EditTaskGroupModal';
import { DeleteTaskGroupModal } from '@/features/task-board/ui/DeleteTaskGroupModal';
import { useTaskListActions } from '@/features/task/hooks/useTaskListActions';
import {
  TaskListStripSkeleton,
  TaskPageLayoutSkeleton,
} from '@/features/task/ui/TaskPageLayoutSkeleton';

type Props = {
  groupId: number;
  taskList?: TaskList | null;
};

function toTaskListSidebarItem(list: TaskList): TaskListSidebarItem {
  return {
    id: list.id,
    groupId: list.groupId,
    title: list.title,
    totalCount: list.tasks.length,
    completedCount: list.tasks.filter((task) => task.completedAt).length,
  };
}

function isFiniteNumber(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function TaskContentArea({
  groupId,
  currentIdNum,
  selectedListTitle,
}: {
  groupId: number;
  currentIdNum: number;
  selectedListTitle: string;
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 px-12 md:gap-5 lg:gap-6">
      <WeekCalendar value={selectedDate} onChange={setSelectedDate} groupName={selectedListTitle} />
      <TasksSection groupId={groupId} taskListId={currentIdNum} date={selectedDate} />
    </div>
  );
}

export function TaskPageLayout({ groupId, taskList }: Props) {
  const router = useRouter();
  const { data: group, isPending: isGroupPending } = useGroupQuery(groupId, {
    enabled: router.isReady,
  });

  const taskListIdFromUrl = Number(router.query.taskListId);
  const currentId: number | undefined = Number.isFinite(taskListIdFromUrl)
    ? taskListIdFromUrl
    : (taskList?.id ?? group?.taskLists?.[0]?.id);

  const currentIdNum = isFiniteNumber(currentId) ? currentId : -1;

  const handleSelectTaskList = useCallback(
    (id: number) => {
      router.push(
        {
          pathname: '/[teamId]/task-lists/[taskListId]',
          query: {
            teamId: groupId,
            taskListId: id,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [groupId, router],
  );

  const taskListActions = useTaskListActions({
    groupId,
    currentTaskListId: currentIdNum,
    taskLists: group?.taskLists,
    onSelectTaskList: handleSelectTaskList,
  });

  const taskListSidebarItems = group?.taskLists?.map((l) => toTaskListSidebarItem(l)) ?? [];
  const groupQueryAllowed = Number.isFinite(groupId) && groupId > 0;
  const showTaskListSkeleton =
    groupQueryAllowed && isGroupPending && taskListSidebarItems.length === 0;

  if (!router.isReady) return <TaskPageLayoutSkeleton />;
  if (!isFiniteNumber(currentId)) return <TaskPageLayoutSkeleton />;

  const selectedListFromGroup = group?.taskLists?.find((l) => l.id === currentIdNum);
  const selectedListFromDetail =
    taskList && taskList.id === currentIdNum ? toTaskListSidebarItem(taskList) : undefined;
  const selectedList = selectedListFromGroup
    ? toTaskListSidebarItem(selectedListFromGroup)
    : selectedListFromDetail;

  return (
    <div className="bg-background-secondary min-h-screen w-full">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-3 px-5 py-4 md:gap-5 md:px-10 md:py-15 lg:max-w-[1120px] lg:gap-6 lg:py-[120px]">
        <Header />
        <div className="flex w-full flex-col gap-4 md:gap-5 lg:flex-row lg:gap-8">
          {showTaskListSkeleton ? (
            <TaskListStripSkeleton />
          ) : (
            <>
              <div className="hidden w-[220px] shrink-0 lg:flex lg:w-[240px] lg:flex-col lg:gap-4">
                <h2 className="text-txt-primary text-base font-bold md:text-xl">할 일 목록</h2>

                <div className="border-background-tertiary cursor-pointer rounded-2xl bg-white p-3 shadow-sm md:p-4">
                  <TaskListSidebar
                    taskLists={taskListSidebarItems}
                    selectedId={currentIdNum}
                    onSelect={handleSelectTaskList}
                    onCreate={taskListActions.openCreateModal}
                    onEdit={(id) => taskListActions.openEditModal(id)}
                    onDelete={(id) => taskListActions.openDeleteModal(id)}
                  />
                </div>
              </div>
              <div className="lg:hidden">
                <TaskListHorizontal
                  taskLists={taskListSidebarItems}
                  selectedId={currentIdNum}
                  onSelect={handleSelectTaskList}
                  onCreate={taskListActions.openCreateModal}
                  onEdit={(id) => taskListActions.openEditModal(id)}
                  onDelete={(id) => taskListActions.openDeleteModal(id)}
                />
              </div>
            </>
          )}
          <TaskContentArea
            groupId={groupId}
            currentIdNum={currentIdNum}
            selectedListTitle={selectedList?.title ?? ''}
          />
        </div>
      </div>

      <CreateTaskBoardModal
        isOpen={taskListActions.isCreateOpen}
        close={taskListActions.closeCreateModal}
        onSubmit={taskListActions.handleCreateSubmit}
      />

      <EditTaskGroupModal
        isOpen={taskListActions.editing !== null}
        onClose={taskListActions.closeEditModal}
        editedTitle={taskListActions.editedTitle}
        onEditedTitleChange={taskListActions.setEditedTitle}
        onConfirmEdit={taskListActions.handleConfirmEdit}
      />

      <DeleteTaskGroupModal
        isOpen={taskListActions.deletingId !== null}
        onClose={taskListActions.closeDeleteModal}
        onConfirmDelete={taskListActions.handleConfirmDelete}
      />
    </div>
  );
}
