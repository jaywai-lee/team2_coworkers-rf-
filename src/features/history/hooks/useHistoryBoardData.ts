import { useMemo } from 'react';
import type { UserTaskHistory } from '@/features/user/model/entities/user.model';
import { formatDateWithDay } from '@/shared/lib/date';

export function useHistoryBoardData(
  historyList: UserTaskHistory[] | undefined,
  selectedCategory: string | null,
) {
  const isEmpty = !historyList || historyList.length === 0;

  const { sliderData, displayData } = useMemo(() => {
    const sliderCounts: Record<string, number> = {};
    const groupedData: Record<string, Record<string, UserTaskHistory[]>> = {};

    if (!historyList || historyList.length === 0) {
      return { sliderData: sliderCounts, displayData: groupedData };
    }

    const sortedList = [...historyList].sort((a, b) => {
      const dateA = new Date(a.doneAt || a.date).getTime();
      const dateB = new Date(b.doneAt || b.date).getTime();
      return dateB - dateA; // 내림차순
    });

    sortedList.forEach((task) => {
      sliderCounts[task.name] = (sliderCounts[task.name] || 0) + 1;

      if (selectedCategory && task.name !== selectedCategory) {
        return;
      }

      const dateHeader = formatDateWithDay(task.date);

      if (!groupedData[dateHeader]) {
        groupedData[dateHeader] = {};
      }
      if (!groupedData[dateHeader][task.name]) {
        groupedData[dateHeader][task.name] = [];
      }

      groupedData[dateHeader][task.name].push(task);
    });

    return { sliderData: sliderCounts, displayData: groupedData };
  }, [historyList, selectedCategory]);

  return { isEmpty, sliderData, displayData };
}
