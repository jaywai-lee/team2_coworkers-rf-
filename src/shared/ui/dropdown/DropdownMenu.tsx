import type { CSSProperties, HTMLAttributes } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/cn';
import { useDropdown } from './Dropdown';

export type DropdownMenuAlign =
  | 'left'
  | 'right'
  | 'side-left'
  | 'side-right'
  | 'top-left'
  | 'top-right';

const alignStyles: Record<DropdownMenuAlign, string> = {
  left: 'left-0 top-full',
  right: 'right-0 top-full',
  'side-left': 'right-full top-0',
  'side-right': 'left-full top-0',
  'top-left': 'left-0 bottom-full',
  'top-right': 'right-0 bottom-full',
};

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'align'> {
  children: React.ReactNode;
  className?: string;
  align?: DropdownMenuAlign;
}

const MENU_GAP_PX = 8;

export default function DropdownMenu({ children, className, align = 'right', ...props }: Props) {
  const { isOpen, menuRef, menuId, triggerRef, useFixedMenu } = useDropdown();
  const [mounted, setMounted] = useState(false);
  const [fixedStyle, setFixedStyle] = useState<CSSProperties>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateFixedPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const r = trigger.getBoundingClientRect();

    switch (align) {
      case 'right':
        setFixedStyle({
          position: 'fixed',
          top: r.bottom + MENU_GAP_PX,
          left: r.right,
          transform: 'translateX(-100%)',
          zIndex: 100,
        });
        break;
      case 'left':
        setFixedStyle({
          position: 'fixed',
          top: r.bottom + MENU_GAP_PX,
          left: r.left,
          zIndex: 100,
        });
        break;
      case 'side-left':
        setFixedStyle({
          position: 'fixed',
          top: r.top,
          left: r.left - MENU_GAP_PX,
          transform: 'translateX(-100%)',
          zIndex: 100,
        });
        break;
      case 'side-right':
        setFixedStyle({
          position: 'fixed',
          top: r.top,
          left: r.right + MENU_GAP_PX,
          zIndex: 100,
        });
        break;
      case 'top-left':
        setFixedStyle({
          position: 'fixed',
          bottom: window.innerHeight - r.top + MENU_GAP_PX,
          left: r.left,
          zIndex: 100,
        });
        break;
      case 'top-right':
        setFixedStyle({
          position: 'fixed',
          bottom: window.innerHeight - r.top + MENU_GAP_PX,
          left: r.right,
          transform: 'translateX(-100%)',
          zIndex: 100,
        });
        break;
    }
  }, [align, triggerRef]);

  const rafScrollRef = useRef<number | null>(null);
  const schedulePositionUpdate = useCallback(() => {
    if (rafScrollRef.current != null) return;
    rafScrollRef.current = requestAnimationFrame(() => {
      rafScrollRef.current = null;
      updateFixedPosition();
    });
  }, [updateFixedPosition]);

  const scrollListenerOptions = { capture: true, passive: true } as const;

  useLayoutEffect(() => {
    if (!isOpen || !useFixedMenu) return;
    updateFixedPosition();
    window.addEventListener('scroll', schedulePositionUpdate, scrollListenerOptions);
    window.addEventListener('resize', schedulePositionUpdate);
    return () => {
      if (rafScrollRef.current != null) {
        cancelAnimationFrame(rafScrollRef.current);
        rafScrollRef.current = null;
      }
      window.removeEventListener('scroll', schedulePositionUpdate, scrollListenerOptions);
      window.removeEventListener('resize', schedulePositionUpdate);
    };
  }, [isOpen, useFixedMenu, schedulePositionUpdate, updateFixedPosition]);

  if (!isOpen) return null;

  const marginClass = align.startsWith('side-')
    ? align === 'side-left'
      ? 'mr-2'
      : 'ml-2'
    : align.startsWith('top-')
      ? 'mb-2'
      : 'mt-2';

  const menu = (
    <div
      id={menuId}
      ref={menuRef}
      className={cn(
        'absolute rounded-2xl border border-gray-200 bg-white shadow-md',
        marginClass,
        alignStyles[align],
        className,
      )}
      style={useFixedMenu ? fixedStyle : undefined}
      {...props}
    >
      {children}
    </div>
  );

  if (useFixedMenu) {
    if (!mounted || typeof document === 'undefined') return null;
    return createPortal(menu, document.body);
  }

  return menu;
}
