import type { TaskBoardColumnStatus } from '../model/taskBoard.types';

/** 컬럼 상태 → 화면 표시용 라벨 (i18n 도입 시 로케일 쪽으로 이전) */
export const TASK_BOARD_COLUMN_STATUS_LABEL: Record<TaskBoardColumnStatus, string> = {
  TODO: '할 일',
  IN_PROGRESS: '진행중',
  DONE: '완료',
};
