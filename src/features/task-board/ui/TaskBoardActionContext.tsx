import { createContext, useContext } from 'react';

interface TaskBoardActionContextValue {
  onTaskToggle?: (taskGroupId: string, taskId: string, checked: boolean) => void;
  onEditCard?: (taskGroupId: string, currentTitle: string) => void;
  onDeleteCard: (taskGroupId: string) => void;
  onOpenTaskList?: (taskGroupId: string) => void;
}

const TaskBoardActionContext = createContext<TaskBoardActionContextValue | null>(null);

export const useTaskBoardActionContext = () => {
  const context = useContext(TaskBoardActionContext);
  if (!context) {
    throw new Error(
      'useTaskBoardActionContext는 TaskBoardActionProvider 안에서 사용되어야 합니다.',
    );
  }
  return context;
};

export const TaskBoardActionProvider = TaskBoardActionContext.Provider;
