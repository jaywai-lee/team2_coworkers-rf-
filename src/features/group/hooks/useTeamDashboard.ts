import { useRouter } from 'next/router';
import type { GroupDetail } from '../model/entities/group.model';
import { useGroupQuery } from './useGroupQuery';
import { groupMembersToMemberCardItems } from '../lib/mappers/groupMembersToMemberCardItems';
import type { MemberCardItem } from '@/shared/ui/profile';
import { parseTeamIdFromQuery } from '../lib/parseTeamRoute';
import { useMemo } from 'react';

export type TeamDashboardViewModel =
  | { phase: 'router_loading' }
  | { phase: 'invalid_route' }
  | { phase: 'group_loading'; groupIdStr: string }
  | { phase: 'group_error'; groupIdStr: string }
  | {
      phase: 'ready';
      groupIdStr: string;
      group: GroupDetail;
      memberCardItems: MemberCardItem[];
      isFetching: boolean;
    };

export function useTeamDashboard(): TeamDashboardViewModel {
  const router = useRouter();
  const { groupIdStr, groupIdNum, isValidGroupId } = useMemo(
    () => parseTeamIdFromQuery(router.query.teamId),
    [router.query.teamId],
  );

  const shouldFetchGroup = router.isReady && isValidGroupId;
  const safeGroupId = isValidGroupId ? groupIdNum : 0;

  const {
    data: group,
    isPending,
    isFetching,
    isError,
  } = useGroupQuery(safeGroupId, {
    enabled: shouldFetchGroup,
  });

  if (!router.isReady) {
    return { phase: 'router_loading' };
  }

  if (!groupIdStr || !isValidGroupId) {
    return { phase: 'invalid_route' };
  }

  if (isPending) {
    return { phase: 'group_loading', groupIdStr };
  }

  if (isError || group === undefined) {
    return { phase: 'group_error', groupIdStr };
  }

  return {
    phase: 'ready',
    groupIdStr,
    group,
    memberCardItems: groupMembersToMemberCardItems(group.members),
    isFetching,
  };
}
