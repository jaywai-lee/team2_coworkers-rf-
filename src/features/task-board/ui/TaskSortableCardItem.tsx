import { useCallback, useLayoutEffect, useRef } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/shared/lib/cn';
import type { TaskBoardTaskGroup } from '../model/taskBoard.types';
import { TaskCard } from './TaskCard';

type TaskSortableCardItemProps = {
  taskGroup: TaskBoardTaskGroup;
  columnStatus: string;
  isActiveInThisColumn: boolean;
  activeTaskGroupId?: string | null;
  dropIndicatorId?: string | null;
  suppressDropIndicatorBefore?: boolean;
};

function DropIndicatorLine({ edge }: { edge: 'top' | 'bottom' }) {
  return (
    <div
      className={cn(
        'bg-brand-primary pointer-events-none absolute right-0 left-0 z-10 h-0.75 rounded-full',
        edge === 'top' ? '-top-1.5' : '-bottom-1.5',
      )}
      aria-hidden
    />
  );
}

export function TaskSortableCardItem({
  taskGroup,
  columnStatus,
  activeTaskGroupId,
  dropIndicatorId,
  suppressDropIndicatorBefore = false,
}: TaskSortableCardItemProps) {
  const id: UniqueIdentifier = taskGroup.id;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { columnStatus },
    transition: null,
  });

  const nodeRef = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      nodeRef.current = node;
      setNodeRef(node);
    },
    [setNodeRef],
  );

  const isDragActive = activeTaskGroupId != null;

  useLayoutEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    if (isDragActive) {
      el.style.transform = '';
      el.style.transition = '';
      return;
    }
    el.style.transform = CSS.Translate.toString(transform) ?? '';
    el.style.transition = transition ?? '';
  }, [transform, transition, isDragActive]);

  const showDropIndicatorBefore =
    !suppressDropIndicatorBefore && dropIndicatorId === `before:${taskGroup.id}`;

  const showDropIndicatorAfter = dropIndicatorId === `after:${taskGroup.id}`;

  return (
    <div
      ref={setRef}
      className={cn(
        'relative w-full max-w-full will-change-transform',
        !isDragging && 'transition-opacity duration-200 ease-out',
        isDragging && 'opacity-30',
      )}
    >
      {showDropIndicatorBefore && <DropIndicatorLine edge="top" />}
      <TaskCard
        taskGroup={taskGroup}
        setActivatorNodeRef={setActivatorNodeRef}
        dragAttributes={attributes}
        dragListeners={listeners}
      />
      {showDropIndicatorAfter && <DropIndicatorLine edge="bottom" />}
    </div>
  );
}
