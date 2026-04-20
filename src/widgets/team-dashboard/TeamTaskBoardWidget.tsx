import { GroupDetail } from '@/features/group';
import { useGroupMemberActions } from '@/features/group/hooks/useGroupMemberActions';
import { TaskBoardView } from '@/features/task-board';
import { useTaskBoardState } from '@/features/task-board/hooks/useTaskBoardState';
import { TaskListOrderPersistPayload } from '@/features/task-board/lib/useTaskBoardDnd';
import { useTeamDashboardActions } from '@/features/task/hooks/useTeamDashboardActions';
import { TaskList } from '@/features/task/model/entities/task.model';
import { MemberCard, MemberCardItem } from '@/shared/ui/profile';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { TeamDashboardRemoveMemberModal } from './TeamDashboardRemoveMemberModal';
import { UserProfile } from '@/features/user';

interface TeamTaskBoardWidgetProps {
  groupIdStr: string;
  group: GroupDetail;
  boardTaskLists: TaskList[];
  memberCardItems: MemberCardItem[];
  me?: UserProfile | null;
  openInviteModal: () => void;
}

const ENABLE_TASK_BOARD_CARD_NAV_TO_LIST = true;

export function TeamTaskBoardWidget({
  groupIdStr,
  group,
  boardTaskLists,
  memberCardItems,
  me,
  openInviteModal,
}: TeamTaskBoardWidgetProps) {
  const router = useRouter();
  const myMembership = group.members.find((member) => member.userId === me?.id);
  const canManageMembers = myMembership?.role === 'ADMIN';

  const { initialBoard, clearColumnOverride, setColumnOverride, mergeOverrideAfterDrag } =
    useTaskBoardState(group.id, boardTaskLists);

  const {
    handleCreateTaskGroup,
    handleUpdateTaskGroup,
    handleDeleteTaskGroup,
    handleToggleTask,
    handleCompleteTaskGroupByDrop,
    handleUncheckTaskGroupByDrop,
    handlePersistTaskListOrderFromBoard,
  } = useTeamDashboardActions({
    groupId: group.id,
    onTaskListBecameFullyCompleted: clearColumnOverride,
    onTaskListCreatedInColumn: setColumnOverride,
  });

  const {
    isRemoveMemberModalOpen,
    openRemoveMemberModal,
    closeRemoveMemberModal,
    isRemovingMember,
    memberToRemove,
    handleRemoveMemberRequest,
    handleConfirmRemoveMember,
  } = useGroupMemberActions({ groupId: group.id });

  const handleTaskListOrderPersist = useCallback(
    (payload: TaskListOrderPersistPayload) => {
      mergeOverrideAfterDrag(payload);
      return handlePersistTaskListOrderFromBoard(payload);
    },
    [handlePersistTaskListOrderFromBoard, mergeOverrideAfterDrag],
  );

  const handleOpenTaskList = ENABLE_TASK_BOARD_CARD_NAV_TO_LIST
    ? (taskGroupId: string) => {
        void router.push(
          `/${encodeURIComponent(groupIdStr)}/task-lists/${encodeURIComponent(taskGroupId)}`,
        );
      }
    : undefined;

  return (
    <section className="flex min-w-0 flex-col gap-4" aria-labelledby="team-task-board-heading">
      <h2 id="team-task-board-heading" className="text-txt-primary text-lg font-bold md:text-xl">
        할 일 목록 ({group.taskLists.length}개)
      </h2>
      <div className="min-w-0 overflow-x-auto pb-2">
        <TaskBoardView
          initialBoard={initialBoard}
          onCreateTaskGroup={handleCreateTaskGroup}
          onToggleTask={handleToggleTask}
          onCompleteTaskGroupByDrop={handleCompleteTaskGroupByDrop}
          onUncheckTaskGroupByDrop={handleUncheckTaskGroupByDrop}
          onUpdateTaskGroup={handleUpdateTaskGroup}
          onDeleteTaskGroup={handleDeleteTaskGroup}
          onOpenTaskList={handleOpenTaskList}
          onTaskListOrderPersist={handleTaskListOrderPersist}
          trailingPanel={
            <MemberCard
              members={memberCardItems}
              title="멤버"
              onInvite={openInviteModal}
              canManageMembers={canManageMembers}
              currentUserId={me ? String(me.id) : undefined}
              onRemoveMember={handleRemoveMemberRequest}
              className="w-full max-w-none"
            />
          }
        />
      </div>

      <TeamDashboardRemoveMemberModal
        isOpen={isRemoveMemberModalOpen}
        open={openRemoveMemberModal}
        close={closeRemoveMemberModal}
        memberToRemove={memberToRemove}
        isRemovingMember={isRemovingMember}
        onConfirmRemoveMember={handleConfirmRemoveMember}
      />
    </section>
  );
}
