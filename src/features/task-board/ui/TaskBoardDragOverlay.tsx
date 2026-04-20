import { useEffect, useState } from 'react';
import { TaskBoardTaskGroup } from '../model';
import { createPortal } from 'react-dom';
import { defaultDropAnimationSideEffects, DragOverlay } from '@dnd-kit/core';
import { cn } from '@/shared/lib/cn';
import { TaskCard } from './TaskCard';

interface TaskBoardDragOverlayProps {
  activeTaskGroup: TaskBoardTaskGroup | null | undefined;
}

export function TaskBoardDragOverlay({ activeTaskGroup }: TaskBoardDragOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <DragOverlay
      dropAnimation={{
        duration: 260,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: { opacity: '0.7' },
          },
        }),
      }}
    >
      {activeTaskGroup ? (
        <div
          className={cn(
            'box-border w-[calc(100vw-2rem)] max-w-2xl scale-[1.02] drop-shadow-[0_14px_26px_rgba(15,23,42,0.18)]',
            'lg:w-67.5 lg:max-w-67.5',
          )}
        >
          <TaskCard taskGroup={activeTaskGroup} />
        </div>
      ) : null}
    </DragOverlay>,
    document.body,
  );
}
