import Head from 'next/head';
import type { TeamDashboardViewModel } from '@/features/group/hooks/useTeamDashboard';
import { useGroupTasksQuery } from '@/features/group/hooks/useGroupTasksQuery';
import { useUserQuery } from '@/features/user/hooks/useUserQuery';
import { TeamDashboardInviteModal } from './TeamDashboardInviteModal';
import { useGroupInviteActions } from '../../features/group/hooks/useGroupInviteActions';
import { TeamOverviewWidget } from './TeamOverviewWidget';
import { TeamTaskBoardWidget } from './TeamTaskBoardWidget';

type ReadyVm = Extract<TeamDashboardViewModel, { phase: 'ready' }>;

type Props = {
  vm: ReadyVm;
};

export function TeamDashboardReadyView({ vm }: Props) {
  const { groupIdStr, group, memberCardItems, isFetching } = vm;
  const { data: groupTasks = [] } = useGroupTasksQuery(group.id);
  const { data: me } = useUserQuery();

  const {
    isInviteModalOpen,
    openInviteModal,
    closeInviteModal,
    isCopyingInviteLink,
    handleCopyInviteLink,
  } = useGroupInviteActions({ groupId: group.id });

  const boardTaskLists = group.taskLists;

  return (
    <>
      <Head>
        <title>{`${group.name} | Coworkers`}</title>
        <meta name="description" content={`${group.name} 팀의 할 일과 멤버를 확인하세요.`} />
      </Head>

      <div className="relative flex min-h-full flex-1 flex-col gap-6 lg:mx-auto">
        <TeamOverviewWidget
          group={group}
          groupTasks={groupTasks}
          memberCardItems={memberCardItems}
          me={me}
          openInviteModal={openInviteModal}
        />

        <TeamTaskBoardWidget
          groupIdStr={groupIdStr}
          group={group}
          boardTaskLists={boardTaskLists}
          memberCardItems={memberCardItems}
          me={me}
          openInviteModal={openInviteModal}
        />
      </div>

      <TeamDashboardInviteModal
        isOpen={isInviteModalOpen}
        open={openInviteModal}
        close={closeInviteModal}
        isCopyingInviteLink={isCopyingInviteLink}
        onCopyInviteLink={handleCopyInviteLink}
      />
    </>
  );
}
