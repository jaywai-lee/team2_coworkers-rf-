import { GroupDetail } from '@/features/group';
import { useGroupActions } from '@/features/group/hooks/useGroupActions';
import { Task } from '@/features/task';
import { MemberCardItem } from '@/shared/ui/profile';
import { TeamCard } from '@/shared/ui/team/TeamCard';
import { TeamDashboardDeleteTeamModal } from './TeamDashboardDeleteTeamModal';
import { TeamDashboardLeaveTeamModal } from './TeamDashboardLeaveTeamModal';
import { UserProfile } from '@/features/user';
import { useRouter } from 'next/router';

interface TeamOverviewWidgetProps {
  group: GroupDetail;
  groupTasks: Task[];
  memberCardItems: MemberCardItem[];
  me?: UserProfile | null;
  openInviteModal: () => void;
}

export function TeamOverviewWidget({
  group,
  groupTasks,
  memberCardItems,
  me,
  openInviteModal,
}: TeamOverviewWidgetProps) {
  const myMembership = group.members.find((member) => member.userId === me?.id);
  const canManageMembers = myMembership?.role === 'ADMIN';
  const todayTaskCount = groupTasks.length;
  const completedTaskCount = groupTasks.filter((task) => task.isCompleted).length;
  const progressPercent =
    todayTaskCount > 0 ? Math.round((100 * completedTaskCount) / todayTaskCount) : 0;
  const router = useRouter();
  const currentGroupId = group.id;

  const {
    deleteModal,
    leaveModal,
    isDeleting,
    isLeaving,
    handleEditTeam,
    handleOpenDeleteTeam,
    handleOpenLeaveTeam,
    handleConfirmDeleteTeam,
    handleConfirmLeaveTeam,
  } = useGroupActions({
    groupId: group.id,
    currentUserId: me?.id,
  });

  return (
    <>
      <TeamCard
        teamName={group.name}
        progressPercent={progressPercent}
        todayTaskCount={todayTaskCount}
        completedTaskCount={completedTaskCount}
        members={memberCardItems}
        memberCount={group.members.length}
        className="w-full max-w-full"
        teamMenuMode={canManageMembers ? 'admin' : 'member'}
        onEditTeam={handleEditTeam}
        onDeleteTeam={handleOpenDeleteTeam}
        onAdminPage={() => router.push(`/${currentGroupId}/admin`)}
        onLeaveTeam={handleOpenLeaveTeam}
        onInvite={openInviteModal}
        canManageMembers={canManageMembers}
      />

      <TeamDashboardDeleteTeamModal
        isOpen={deleteModal.isOpen}
        open={deleteModal.open}
        close={deleteModal.close}
        teamName={group.name}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDeleteTeam}
      />

      <TeamDashboardLeaveTeamModal
        isOpen={leaveModal.isOpen}
        open={leaveModal.open}
        close={leaveModal.close}
        teamName={group.name}
        isLeaving={isLeaving}
        onConfirm={handleConfirmLeaveTeam}
      />
    </>
  );
}
