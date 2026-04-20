import { clientFetcher } from '@/shared/lib/axios/client-fetcher';
import { TaskCommonParams } from '../model/params/task.params';
import { TaskListDto } from '../model/dto/task.dto';
import { toTaskList } from '../lib/mappers/taskList.mapper';

type Props = TaskCommonParams & {
  date?: string;
};

export async function getTaskListDetail({ groupId, taskListId, date }: Props) {
  const { data } = await clientFetcher.get<TaskListDto>(
    `/groups/${groupId}/task-lists/${taskListId}`,
    {
      params: { date },
    },
  );

  return toTaskList(data);
}
