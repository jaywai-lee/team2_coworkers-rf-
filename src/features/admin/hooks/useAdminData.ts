import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useGroupQuery } from '@/features/group';
import { getTaskListDetail } from '@/features/task/api/getTaskListDetail';
import { AdminStats } from '@/widgets/admin-dashboard/ui/AdminStatsChart';
import { AdminTaskRow } from '@/widgets/admin-dashboard/ui/AdminTaskTable';

export const useAdminData = (groupId: number, currentMonth: Date) => {
  const year = currentMonth.getFullYear();
  const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
  const day = String(currentMonth.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const { data: groupMeta, isLoading: isGroupLoading, isError } = useGroupQuery(groupId);

  const listQueries = useQueries({
    queries: (groupMeta?.taskLists || []).map((list) => ({
      queryKey: ['taskListDetail', groupId, list.id, dateStr],
      queryFn: () => getTaskListDetail({ groupId, taskListId: list.id, date: dateStr }),
      enabled: !!list.id,
    })),
  });

  const isListsLoading = listQueries.some((q) => q.isLoading);

  const { adminStats, adminTasks } = useMemo(() => {
    const allTasks: AdminTaskRow[] = [];
    let completedCount = 0;

    listQueries.forEach((query) => {
      if (query.data && Array.isArray(query.data.tasks)) {
        const parentTitle = query.data.title || '알 수 없는 목록';

        query.data.tasks.forEach((task: any) => {
          const isCompleted = task.isCompleted;
          if (isCompleted) completedCount++;

          allTasks.push({
            id: String(task.id),
            parentTitle,
            subTitle: task.title || task.name,
            assignee: {
              name: task.writer?.nickname || '미지정',
              image: task.writer?.imageUrl || task.writer?.image,
            },
            isCompleted,
            dueDate: task.date
              ? `${new Date(task.date).getFullYear()}-${String(new Date(task.date).getMonth() + 1).padStart(2, '0')}-${String(new Date(task.date).getDate()).padStart(2, '0')}`
              : '미정',
            originalTask: task,
          });
        });
      }
    });

    const totalTasks = allTasks.length;
    const stats: AdminStats = {
      totalTasks,
      completedTasks: completedCount,
      pendingTasks: totalTasks - completedCount,
      trendData: [
        { name: '1주차', total: totalTasks, completed: completedCount },
        { name: '2주차', total: totalTasks, completed: completedCount },
        { name: '3주차', total: totalTasks, completed: completedCount },
        { name: '4주차', total: totalTasks, completed: completedCount },
      ],
      planInfo: {
        planName: 'Pro plan',
        currentMembers: groupMeta?.members?.length || 0,
        maxMembers: 10,
      },
    };

    return { adminStats: stats, adminTasks: allTasks };
  }, [listQueries, groupMeta]);

  return {
    stats: adminStats,
    tasks: adminTasks,
    isLoading: isGroupLoading || isListsLoading,
    isError,
  };
};
