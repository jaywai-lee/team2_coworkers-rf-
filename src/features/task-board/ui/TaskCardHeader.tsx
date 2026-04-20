import type { MouseEvent, PointerEvent } from 'react';
import { IconArrowDown, IconDone, IconProgress } from '@/shared/ui/icons';
import { cn } from '@/shared/lib/cn';
import KebabMenu from '@/features/boards/components/KebabMenu';

type TaskCardHeaderProps = {
  cardName: string;
  collapsed: boolean;
  isFullyCompleted: boolean;
  checkedTaskCount: number;
  cardTaskCount: number;
  onToggleCollapsed: () => void;
  onEditCard?: () => void;
  onDeleteCard?: () => void;
};

export function TaskCardHeader({
  cardName,
  collapsed,
  isFullyCompleted,
  checkedTaskCount,
  cardTaskCount,
  onToggleCollapsed,
  onEditCard,
  onDeleteCard,
}: TaskCardHeaderProps) {
  const progressRatio = cardTaskCount === 0 ? 0 : checkedTaskCount / cardTaskCount;

  return (
    <div className={cn('flex w-full items-center gap-3')}>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          onPointerDown={(event: PointerEvent<HTMLButtonElement>) => event.stopPropagation()}
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            onToggleCollapsed();
          }}
          aria-label={collapsed ? '접힌 카드 펼치기' : '카드 접기'}
          className={cn(
            'text-icon-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] p-0',
            'hover:bg-background-secondary -translate-x-[6px]',
          )}
        >
          <IconArrowDown size={20} className={collapsed ? 'rotate-180' : undefined} />
        </button>

        <div className="text-txt-primary min-w-0 truncate text-sm leading-none font-semibold">
          {cardName}
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-1 text-[#74A1FB]">
          {isFullyCompleted ? (
            <IconDone
              size={16}
              className="text-[#74A1FB]"
              animateOnMount
              key={`done-${checkedTaskCount}/${cardTaskCount}`}
            />
          ) : (
            <IconProgress
              size={16}
              className="shrink-0"
              progress={progressRatio}
              animateOnMount
              key={`progress-${checkedTaskCount}/${cardTaskCount}`}
            />
          )}
          <span className="text-sm leading-none font-semibold text-[#74A1FB] tabular-nums">
            {checkedTaskCount}/{cardTaskCount}
          </span>
        </div>

        <KebabMenu onEdit={onEditCard} onDelete={onDeleteCard} isDeleteDanger align="right" />
      </div>
    </div>
  );
}
