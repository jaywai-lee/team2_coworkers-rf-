import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useModal } from '@/shared/ui/modal';
import { useDeleteGroupMutation } from '@/features/group/hooks/useDeleteGroupMutation';
import { useRemoveGroupMemberMutation } from '@/features/group/hooks/useRemoveMemberMutation';
import { GROUP_QUERY_KEYS } from '@/features/group/lib/queryKeys';
import { USER_QUERY_KEYS } from '@/features/user/lib/queryKeys';
import { ROUTES, teamEditPath } from '@/shared/constants/routes';

type Params = {
  groupId: number;
  currentUserId: number | undefined;
};

export function useGroupActions({ groupId, currentUserId }: Params) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteModal = useModal(false);
  const leaveModal = useModal(false);

  const { mutateAsync: deleteGroup, isPending: isDeleting } = useDeleteGroupMutation();
  const { mutateAsync: removeMember, isPending: isLeaving } = useRemoveGroupMemberMutation();

  const handleEditTeam = () => {
    void router.push(teamEditPath(String(groupId)));
  };

  const handleConfirmDeleteTeam = async () => {
    try {
      await deleteGroup({ groupId });
      toast.success('팀이 삭제되었습니다.');
      deleteModal.close();
      await router.push(ROUTES.FREE_BOARD);
    } catch (e) {
      const err = e as { message?: string };
      toast.error(err?.message ?? '팀 삭제에 실패했습니다.');
    }
  };

  const handleConfirmLeaveTeam = async () => {
    if (currentUserId === undefined) {
      toast.error('로그인 정보를 확인할 수 없습니다.');
      return;
    }
    try {
      await removeMember({ groupId, memberUserId: currentUserId });
      toast.success('팀에서 나갔습니다.');
      leaveModal.close();
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.groups() });
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.all });
      await router.push(ROUTES.FREE_BOARD);
    } catch (e) {
      const err = e as { message?: string };
      toast.error(err?.message ?? '팀 나가기에 실패했습니다.');
    }
  };

  return {
    deleteModal,
    leaveModal,
    isDeleting,
    isLeaving,
    handleEditTeam,
    handleOpenDeleteTeam: deleteModal.open,
    handleOpenLeaveTeam: leaveModal.open,
    handleConfirmDeleteTeam,
    handleConfirmLeaveTeam,
  };
}
