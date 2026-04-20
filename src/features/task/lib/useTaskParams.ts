import { useRouter } from 'next/router';
import { TaskCommonParams } from '../model/params/task.params';

function toNumber(value: string | string[] | undefined, name: string): number {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  const num = Number(value);

  if (Number.isNaN(num)) {
    throw new Error(`${name} is invalid`);
  }
  return num;
}

export function useTaskParams(): TaskCommonParams {
  const router = useRouter();
  const { groupId, teamId, taskListId } = router.query;
  const rawGroupId = groupId ?? teamId;

  return {
    groupId: rawGroupId ? toNumber(rawGroupId, 'groupId') : 0,
    taskListId: taskListId ? toNumber(taskListId, 'taskListId') : 0,
  };
}
