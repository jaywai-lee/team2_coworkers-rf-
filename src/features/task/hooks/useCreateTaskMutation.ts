import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { GROUP_QUERY_KEYS } from '@/features/group/lib/queryKeys';
import { createTask } from '../api/createTask';
import { TASK_QUERY_KEYS } from '../lib/queryKeys';
import { TaskCommonParams } from '../model/params/task.params';
import { createRecurring } from '../api/createRecurring';
import { CreateRecurringParams, CreateTaskParams } from '../model/params/task.create.params';

type UseCreateTaskMutationParams = TaskCommonParams & {
  date?: string;
};

export function useCreateTaskMutation(params: UseCreateTaskMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateTaskParams | CreateRecurringParams) => {
      const path = {
        groupId: params.groupId,
        taskListId: params.taskListId,
      };

      if (body.frequencyType === 'ONCE') {
        return createTask(path, body);
      }

      return createRecurring(path, body);
    },

    onSuccess: (result) => {
      if (!result.ok) return;

      toast.success('할 일이 생성 됐습니다.');

      queryClient.invalidateQueries({
        queryKey: TASK_QUERY_KEYS.lists(params.groupId),
      });
      queryClient.invalidateQueries({
        queryKey: GROUP_QUERY_KEYS.detail(params.groupId),
      });
      queryClient.invalidateQueries({
        queryKey: GROUP_QUERY_KEYS.tasks(params.groupId, params.date),
      });
    },
  });
}
