import { toTaskListFromArray } from '../lib/mappers/task.mapper';
import type { TaskList } from '../model/entities/task.model';
import type { TaskDto } from '../model/dto/task.dto';
import type { GetTaskListQuery } from '../model/dto/task.query';
import type { TaskCommonParams } from '../model/params/task.params';
import { clientFetcher } from '@/shared/lib/axios/client-fetcher';

// TODO: API 에러 핸들링 필요
export async function getTaskList(
  path: TaskCommonParams,
  query?: GetTaskListQuery,
): Promise<TaskList> {
  const { groupId, taskListId } = path;

  const { data } = await clientFetcher.get<TaskDto[]>(
    `/groups/${groupId}/task-lists/${taskListId}/tasks`,
    {
      params: query,
    },
  );

  return toTaskListFromArray(data, groupId, taskListId);
}
