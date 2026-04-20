import { cn } from '@/shared/lib/cn';
import Dropdown from '@/shared/ui/dropdown';
import { IconKebab } from '@/shared/ui/icons';
import { MemberChip } from './MemberChip';
import type { MemberCardItem } from './memberCard.types';

type Props = {
  members: MemberCardItem[];
  maxVisibleCount: number;
  isInteractive: boolean;
  onMemberClick: (member: MemberCardItem) => void;
  onMoreClick: () => void;
  canManageMembers?: boolean;
  currentUserId?: string;
  onRemoveMember?: (member: MemberCardItem) => void;
  className?: string;
};

export function MemberCardMembersSection({
  members,
  maxVisibleCount,
  isInteractive,
  onMemberClick,
  onMoreClick,
  canManageMembers = false,
  currentUserId,
  onRemoveMember,
  className,
}: Props) {
  const visibleMembers = members.slice(0, maxVisibleCount);
  const hasMore = members.length > maxVisibleCount;

  return (
    <div className={cn('flex flex-col gap-6 overflow-visible', className)}>
      {visibleMembers.map((member) => {
        const isCurrentUser = member.id === currentUserId;
        const canRemoveThisMember = canManageMembers && !!onRemoveMember && !isCurrentUser;

        return (
          <div
            key={member.id}
            className={cn(
              'flex min-h-8 w-full shrink-0 items-center justify-between gap-2 rounded-lg py-0 text-left',
              isInteractive ? 'hover:bg-background-secondary transition-colors' : 'cursor-default',
            )}
          >
            {isInteractive ? (
              <button
                type="button"
                onClick={() => onMemberClick(member)}
                aria-label={`${member.name} 멤버 상세 보기`}
                className="min-w-0 flex-1 text-left"
              >
                <MemberChip
                  name={member.name}
                  email={member.email}
                  imageSrc={member.imageSrc}
                  isAdmin={member.isAdmin}
                  size="md"
                  className="min-w-0 flex-1"
                />
              </button>
            ) : (
              <MemberChip
                name={member.name}
                email={member.email}
                imageSrc={member.imageSrc}
                isAdmin={member.isAdmin}
                size="md"
                className="min-w-0 flex-1"
              />
            )}

            <div className="flex h-7 w-7 shrink-0 items-center justify-center">
              {!isCurrentUser &&
                (canRemoveThisMember ? (
                  <Dropdown>
                    <Dropdown.Trigger className="text-icon-primary hover:bg-background-secondary inline-flex h-7 w-7 items-center justify-center rounded-md p-0">
                      <IconKebab size={18} aria-hidden="true" />
                    </Dropdown.Trigger>
                    <Dropdown.Menu
                      align="right"
                      className="z-20 min-w-[120px] overflow-hidden rounded-xl"
                    >
                      <Dropdown.Item
                        align="left"
                        className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => onRemoveMember?.(member)}
                      >
                        탈퇴시키기
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <IconKebab size={18} className="text-icon-primary" aria-hidden="true" />
                ))}
            </div>
          </div>
        );
      })}

      {hasMore && (
        <button
          type="button"
          onClick={onMoreClick}
          className="border-background-tertiary bg-background-secondary text-brand-primary hover:bg-background-tertiary shrink-0 self-start rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
        >
          더보기 ({members.length - maxVisibleCount})
        </button>
      )}
    </div>
  );
}
