export type TaskBoardColumnStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type TaskBoard = {
  columns: TaskBoardColumn[];
};

export type TaskBoardColumn = {
  id: string;
  status: TaskBoardColumnStatus;
  taskGroups: TaskBoardTaskGroup[];
};

export type TaskBoardTaskGroup = {
  id: string;
  name: string;
  tasks: TaskBoardTask[];
};

export type TaskBoardTask = {
  id: string;
  title: string;
  completed: boolean;
};
