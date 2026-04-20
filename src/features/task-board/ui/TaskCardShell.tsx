import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import type { KeyboardEvent, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

type TaskCardShellProps = {
  collapsed: boolean;
  children: ReactNode;
  onClick?: () => void;
  /** dnd-kit: 드래그 활성 영역(카드 전체) */
  dragActivatorRef?: (node: HTMLElement | null) => void;
  dragAttributes?: DraggableAttributes;
  dragListeners?: DraggableSyntheticListeners;
};

export function TaskCardShell({
  collapsed,
  children,
  onClick,
  dragActivatorRef,
  dragAttributes,
  dragListeners,
}: TaskCardShellProps) {
  const expandedAria =
    collapsed === true
      ? ({ 'aria-expanded': false as const } as const)
      : ({ 'aria-expanded': true as const } as const);

  return (
    <div
      ref={dragActivatorRef}
      {...(onClick
        ? {
            role: 'button' as const,
            tabIndex: 0,
            onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            },
            ...expandedAria,
          }
        : {
            role: 'group' as const,
            ...expandedAria,
          })}
      {...dragAttributes}
      {...dragListeners}
      onClick={onClick}
      className={cn(
        'border-background-tertiary bg-background-primary flex w-full max-w-full min-w-0 flex-col rounded-[12px] border',
        'max-[767px]:max-w-[343px]',
        'lg:max-w-[270px]',
        dragListeners && 'cursor-grab touch-none active:cursor-grabbing',
        onClick && !dragListeners && 'cursor-pointer',
        'px-5 pt-2.5',
        collapsed ? 'h-[54px] overflow-hidden' : 'min-h-[151px] gap-[10px] pb-6',
      )}
    >
      {children}
    </div>
  );
}
