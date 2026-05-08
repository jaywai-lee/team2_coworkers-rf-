import { useCallback, useMemo } from 'react';
import { cn } from '@/shared/lib/cn';
import { Profile } from '@/shared/ui/profile';
import type { ImageAsset } from '@/shared/ui/profile';
import type { MemberCardItem } from '@/shared/ui/profile';
import { MemberCardModal, type MemberCardModalProps } from '@/shared/ui/profile/MemberCardModal';
import { sortMembersAdminsFirst } from '@/shared/ui/profile/lib/memberCard.utils';
import { useMemberCardModalState } from '@/shared/ui/profile/useMemberCardModalState';
import { IconGear } from '@/shared/ui/icons/IconGear';
import Dropdown from '@/shared/ui/dropdown';
import { ICON_SIZE } from '@/shared/constants/icon';
import { TeamCardProgressRow } from './TeamCardProgressRow';
import { TeamCardStatsSection } from './TeamCardStatsSection';
import { TeamCardDropdownMenu } from './TeamCardDropdownMenu';
import {
  TEAM_CARD_DROPDOWN_PANEL_CLASS,
  TEAM_CARD_DROPDOWN_PANEL_CLASS_MEMBER,
  TEAM_CARD_MENU_ITEM_CLASS,
} from './teamCard.constants';
import { useRouter } from 'next/router';

/** `memberImages` 미전달 시 기본값. 매 렌더 `[]`를 쓰면 참조가 매번 바뀌어 `useMemo`가 불필요하게 무효화됨 */
const EMPTY_MEMBER_IMAGES: Array<ImageAsset | undefined> = [];

export type TeamCardTeamMenuMode = 'admin' | 'member';

export type TeamCardProps = {
  teamName: string;
  /** 0–100 */
  progressPercent: number;
  todayTaskCount: number;
  completedTaskCount: string | number;
  /** admin: 수정·삭제, member: 팀 탈퇴만 */
  teamMenuMode?: TeamCardTeamMenuMode;
  onEditTeam?: () => void;
  onDeleteTeam?: () => void;
  onAdminPage?: () => void;
  /** `teamMenuMode === 'member'`일 때 */
  onLeaveTeam?: () => void;
  /** `members`가 없을 때만 사용하는 폴백 이미지 목록(최대 3명 분량 권장). 없으면 플레이스홀더 */
  memberImages?: Array<ImageAsset | undefined>;
  /** 모바일/태블릿에서 열리는 전체 멤버 목록 */
  members?: MemberCardItem[];
  /** 전체 팀원 수(숫자). 없으면 `members`·폴백 목록 길이로 표기 */
  memberCount?: number;
  /** 기본: 모바일·태블릿은 컨테이너 너비에 맞춤, 데스크톱(lg+) 1120×239 */
  className?: string;
  /** 통계 블록(오늘의 할 일·완료) 래퍼 커스텀 */
  statsClassName?: string;
  /** 관리자만. 모바일·태블릿 전체 멤버 모달에서 초대 링크 모달로 이어질 때 사용 */
  onInvite?: () => void;
  canManageMembers?: boolean;
};

export function TeamCard({
  teamName,
  progressPercent,
  todayTaskCount,
  completedTaskCount,
  teamMenuMode = 'admin',
  onEditTeam,
  onDeleteTeam,
  onAdminPage,
  onLeaveTeam,
  memberImages = EMPTY_MEMBER_IMAGES,
  members,
  memberCount,
  className,
  statsClassName,
  onInvite,
  canManageMembers = false,
}: TeamCardProps) {
  const normalizedMembers = useMemo<MemberCardItem[]>(
    () =>
      members && members.length > 0
        ? members
        : memberImages.map((imageSrc, idx) => ({
            id: `team-member-${idx + 1}`,
            name: `멤버 ${idx + 1}`,
            imageSrc,
          })),
    [memberImages, members],
  );

  const sortedMembers = useMemo(
    () => sortMembersAdminsFirst(normalizedMembers),
    [normalizedMembers],
  );

  const {
    isOpen: isMemberModalOpen,
    open: openMemberModal,
    modalMode: memberModalMode,
    selectedMember: memberModalSelected,
    memberDetailFromAllList,
    onMemberClickInList,
    onBackToList,
    onMoreClick,
    onModalClose,
  } = useMemberCardModalState({ defaultModeOnClose: 'all' });

  const handleInviteFromMemberModal = useCallback(() => {
    onModalClose();
    onInvite?.();
  }, [onModalClose, onInvite]);

  const displayMemberCount = typeof memberCount === 'number' ? memberCount : sortedMembers.length;
  /** 모바일·태블릿: 인원 3 이하이면 그만큼만, 4명 이상이면 최대 3명까지 */
  const visibleFaceCount = Math.min(3, displayMemberCount, sortedMembers.length);
  const visibleMembers = sortedMembers.slice(0, visibleFaceCount);
  const showMemberSummary = displayMemberCount > 0;

  const memberCardModalProps: MemberCardModalProps = {
    isOpen: isMemberModalOpen,
    open: openMemberModal,
    onClose: onModalClose,
    modalMode: memberModalMode,
    selectedMember: memberModalSelected,
    members: sortedMembers,
    onMemberClickInList,
    onBackToList: memberDetailFromAllList ? onBackToList : undefined,
    onInvite: canManageMembers && onInvite ? handleInviteFromMemberModal : undefined,
  };

  return (
    <article
      className={cn(
        'border-background-tertiary/60 bg-background-primary relative box-border flex h-[196px] w-full max-w-full flex-col rounded-[20px] border p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)]',
        'md:h-[239px] lg:h-[239px] lg:w-[1120px] lg:max-w-[1120px] lg:shrink-0',
        className,
      )}
    >
      <header className="flex shrink-0 items-end gap-3">
        <h3 className="text-txt-tertiary text-center text-2xl font-bold">{teamName}</h3>
        {showMemberSummary && (
          <button
            type="button"
            onClick={onMoreClick}
            aria-label="전체 멤버 보기"
            className="inline-flex h-7 items-center rounded-[8px] border border-[var(--Border-Primary,#E2E8F0)] px-1 md:h-[40px] md:translate-y-[8px] md:rounded-[12px] md:px-[10px] lg:hidden lg:translate-y-0"
          >
            <div className="flex items-center">
              {visibleMembers.map((member, idx) => (
                <span key={member.id} className={cn('inline-flex', idx > 0 && '-ml-px md:-ml-1')}>
                  <Profile
                    size="xs"
                    imageSrc={member.imageSrc}
                    decorative
                    className="md:hidden"
                    borderClassName="ring-1 ring-background-primary"
                  />
                  <Profile
                    size="md"
                    imageSrc={member.imageSrc}
                    decorative
                    className="hidden md:inline-flex"
                    borderClassName="ring-1 ring-background-primary"
                  />
                </span>
              ))}
            </div>
            <span className="text-txt-default ml-1.5 text-sm leading-none font-medium tabular-nums md:ml-2 md:text-lg">
              {displayMemberCount}
            </span>
          </button>
        )}
      </header>

      <div className="mt-auto flex min-h-0 w-full min-w-0 flex-col">
        <TeamCardStatsSection
          progressPercent={progressPercent}
          todayTaskCount={todayTaskCount}
          completedTaskCount={completedTaskCount}
          statsClassName={statsClassName}
        />

        <TeamCardProgressRow
          teamName={teamName}
          progressPercent={progressPercent}
          trailing={
            <Dropdown>
              <Dropdown.Trigger
                aria-label="팀 메뉴"
                className="text-icon-primary hover:bg-background-secondary focus-visible:ring-brand-primary inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-transparent p-0 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <IconGear size={ICON_SIZE.md} />
              </Dropdown.Trigger>
              <TeamCardDropdownMenu
                className={
                  teamMenuMode === 'member'
                    ? TEAM_CARD_DROPDOWN_PANEL_CLASS_MEMBER
                    : TEAM_CARD_DROPDOWN_PANEL_CLASS
                }
              >
                {teamMenuMode === 'admin' ? (
                  <>
                    <Dropdown.Item
                      align="center"
                      type="button"
                      className={TEAM_CARD_MENU_ITEM_CLASS}
                      onClick={() => onEditTeam?.()}
                    >
                      수정하기
                    </Dropdown.Item>
                    <Dropdown.Item
                      align="center"
                      type="button"
                      className={TEAM_CARD_MENU_ITEM_CLASS}
                      onClick={() => onDeleteTeam?.()}
                    >
                      삭제하기
                    </Dropdown.Item>
                    <Dropdown.Item
                      align="center"
                      type="button"
                      className={TEAM_CARD_MENU_ITEM_CLASS}
                      onClick={() => onAdminPage?.()}
                    >
                      관리자 페이지
                    </Dropdown.Item>
                  </>
                ) : (
                  <Dropdown.Item
                    align="center"
                    type="button"
                    className={TEAM_CARD_MENU_ITEM_CLASS}
                    onClick={() => onLeaveTeam?.()}
                  >
                    팀 탈퇴하기
                  </Dropdown.Item>
                )}
              </TeamCardDropdownMenu>
            </Dropdown>
          }
        />
      </div>
      <MemberCardModal {...memberCardModalProps} />
    </article>
  );
}
