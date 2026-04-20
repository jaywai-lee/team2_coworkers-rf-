import { TaskBoard } from '../model';

export const EMPTY_TASK_BOARD: TaskBoard = {
  columns: [
    { id: 'col-todo', status: 'TODO', taskGroups: [] },
    { id: 'col-in-progress', status: 'IN_PROGRESS', taskGroups: [] },
    { id: 'col-done', status: 'DONE', taskGroups: [] },
  ],
};
