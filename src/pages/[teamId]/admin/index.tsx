import { useAdminData } from '@/features/admin/hooks/useAdminData';
import { useTaskModal } from '@/features/task/hooks/useTaskModal';
import TaskDeleteModal from '@/features/task/ui/delete-task/TaskDeleteModal';
import TaskDetailPanel from '@/features/task/ui/TaskDetailPanel';
import TaskUpdateModalContent from '@/features/task/ui/update-task/TaskUpdateModalContent';
import WeekDateHeader from '@/features/task/ui/weekdate/weekDateHeader';
import { IconArrowLeft } from '@/shared/ui/icons/IconArrowLeft';
import { AdminStatsChart } from '@/widgets/admin-dashboard/ui/AdminStatsChart';
import { AdminTaskTable } from '@/widgets/admin-dashboard/ui/AdminTaskTable';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function TeamAdminPage() {
  const router = useRouter();
  const { teamId } = router.query;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const validTeamId = typeof teamId === 'string' && !isNaN(Number(teamId)) ? Number(teamId) : 0;
  const { tasks, stats, isLoading } = useAdminData(validTeamId, currentMonth);

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

  const handleMonthChange = (step: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + step);
    setCurrentMonth(newDate);
  };

  if (!router.isReady) return null;

  const panelParams = { groupId: validTeamId, taskListId: detailTask?.taskListId || 0 };

  return (
    <div className="bg-background-secondary min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6 lg:p-10">
        <div className="flex items-center">
          <Link
            href={`/${validTeamId}`}
            className="text-txt-default hover:text-brand-primary flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <IconArrowLeft size={16} />팀 보드로 돌아가기
          </Link>
        </div>
        <WeekDateHeader
          groupName="워크스페이스 관리자"
          value={currentMonth}
          onPrev={() => handleMonthChange(-1)}
          onNext={() => handleMonthChange(1)}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          isOpen={isCalendarOpen}
          onSelectDate={setCurrentMonth}
          onCloseCalendar={() => setIsCalendarOpen(false)}
        />

        <AdminStatsChart stats={stats} isLoading={isLoading} />

        <AdminTaskTable tasks={tasks} isLoading={isLoading} onOpenDetail={openDetail} />
      </div>

      {detailTask && (
        <TaskDetailPanel
          task={detailTask}
          onClose={closeDetail}
          params={panelParams}
          listDateIso={currentMonth.toISOString()} // 현재 선택된 월(Date)
          onTaskChange={setDetailTask}
          onEditClick={openEdit}
          onDeleteClick={openDelete}
        />
      )}

      {deleteTask && (
        <TaskDeleteModal
          taskId={deleteTask.id}
          title={deleteTask.title}
          onClose={closeDelete}
          onDeleteSuccess={closeDetail}
          date={currentMonth.toISOString()}
        />
      )}

      {editTask && (
        <TaskUpdateModalContent
          task={editTask}
          params={panelParams}
          isOpen={true}
          onClose={closeEdit}
        />
      )}
    </div>
  );
}
