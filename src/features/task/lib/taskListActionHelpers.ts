import type { QueryClient } from '@tanstack/react-query';
import { GROUP_QUERY_KEYS } from '@/features/group/lib/queryKeys';
import { TASK_QUERY_KEYS } from '@/features/task/lib/queryKeys';

export function toNumberId(id: string): number | null {
  const parsed = Number(id);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toNumberIds(ids: string[]): number[] {
  return ids.map((id) => Number(id)).filter((id) => Number.isFinite(id));
}

export async function invalidateTeamTaskQueries(queryClient: QueryClient, groupId: number) {
  await queryClient.invalidateQueries({
    queryKey: [...GROUP_QUERY_KEYS.detail(groupId), 'tasks'],
  });
  await queryClient.invalidateQueries({
    queryKey: TASK_QUERY_KEYS.lists(groupId),
  });
}
