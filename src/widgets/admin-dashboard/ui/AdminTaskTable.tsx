import { Task } from '@/features/task';
import { IconArrowRight } from '@/shared/ui/icons/IconArrowRight';
import { useState } from 'react';

export interface AdminTaskRow {
  id: string;
  parentTitle: string;
  subTitle: string;
  assignee: {
    name: string;
    image?: string;
  };
  isCompleted: boolean;
  dueDate: string;
  originalTask: Task;
}

interface AdminTaskTableProps {
  tasks: AdminTaskRow[];
  isLoading: boolean;
  onOpenDetail: (task: Task) => void;
  tasksDate?: string;
}

export function AdminTaskTable({ tasks, isLoading, onOpenDetail, tasksDate }: AdminTaskTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const currentTasks = tasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) {
    return <div className="bg-background-secondary h-96 w-full animate-pulse rounded-xl" />;
  }

  return (
    <div className="bg-background-primary flex flex-col gap-4 rounded-xl p-6 shadow-sm">
      <h2 className="text-txt-primary flex items-center gap-2 text-base font-bold">
        할 일 목록
        <span className="text-txt-default text-md font-medium">({tasks.length}개)</span>
        {tasksDate && (
          <span className="text-txt-disabled text-md ml-1 font-normal">- {tasksDate} 기준</span>
        )}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 table-fixed border-collapse text-left text-sm">
          <thead>
            <tr className="border-background-tertiary text-txt-default border-b">
              <th className="w-[20%] pb-4 font-medium">상위 업무</th>
              <th className="w-[35%] pb-4 pl-2 font-medium">하위 업무</th>
              <th className="w-[20%] pb-4 pl-4 font-medium">담당자</th>
              <th className="w-[15%] pb-4 pl-1 font-medium">완료 여부</th>
              <th className="w-[10%] pr-4 pb-4 text-right font-medium">상세</th>
            </tr>
          </thead>
          <tbody className="divide-background-secondary divide-y">
            {currentTasks.map((task) => (
              <tr key={task.id} className="group hover:bg-background-secondary/50">
                <td className="text-txt-default py-4 pl-4 font-medium">{task.parentTitle}</td>
                <td className="text-txt-primary py-4 font-semibold">{task.subTitle}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-brand-secondary text-brand-primary flex h-6 w-6 items-center justify-center overflow-hidden rounded-full text-[10px] font-bold">
                      {task.assignee.image ? (
                        <img src={task.assignee.image} alt={task.assignee.name} />
                      ) : (
                        task.assignee.name.charAt(0)
                      )}
                    </div>
                    <span className="text-txt-secondary">{task.assignee.name}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      task.isCompleted
                        ? 'bg-brand-secondary text-brand-primary'
                        : 'bg-brand-secondary text-txt-secondary'
                    }`}
                  >
                    {task.isCompleted ? '완료' : '진행 중'}
                  </span>
                </td>
                <td className="py-4 pr-2 text-right">
                  <button
                    onClick={() => onOpenDetail(task.originalTask)}
                    className="text-icon-primary hover:bg-background-secondary hover:text-brand-primary inline-flex h-8 w-8 items-center justify-center rounded-lg hover:shadow-sm"
                  >
                    <IconArrowRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-all ${
              currentPage === pageNum
                ? 'bg-brand-primary text-txt-inverse shadow-md'
                : 'bg-background-primary text-txt-default hover:border-brand-primary hover:text-brand-primary border border-transparent'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
}
