import { Button } from '@/shared/ui/Button/Button';
import { IconArrowLeft } from '@/shared/ui/icons/IconArrowLeft';
import { IconArrowRight } from '@/shared/ui/icons/IconArrowRight';
import { IconCalendar } from '@/shared/ui/icons/IconCalendar';
import Calendar from '../../dateTimeField/datePopover';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useClickOutside from '@/shared/hooks/useClickOutside';

type Props = {
  value: Date;
  groupName: string;
  onPrev: () => void;
  onNext: () => void;
  onOpenCalendar: () => void;
  isOpen: boolean;
  onSelectDate: (date: Date) => void;
  onCloseCalendar: () => void;
};

function formatMonth(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

const POPOVER_MIN_WIDTH_PX = 320;

export default function WeekDateHeader({
  value,
  groupName,
  onNext,
  onPrev,
  onOpenCalendar,
  isOpen,
  onSelectDate,
  onCloseCalendar,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePopoverPosition = useCallback(() => {
    const el = wrapperRef.current;
    if (!el || typeof window === 'undefined') return;
    const r = el.getBoundingClientRect();
    const width = Math.min(POPOVER_MIN_WIDTH_PX, window.innerWidth - 32);
    setPopoverPos({
      top: r.bottom + 8,
      left: Math.max(16, r.right - width),
    });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !mounted) return;
    updatePopoverPosition();
    window.addEventListener('scroll', updatePopoverPosition, true);
    window.addEventListener('resize', updatePopoverPosition);
    return () => {
      window.removeEventListener('scroll', updatePopoverPosition, true);
      window.removeEventListener('resize', updatePopoverPosition);
    };
  }, [isOpen, mounted, value, updatePopoverPosition]);

  useClickOutside({
    refs: [wrapperRef, popoverRef],
    enabled: isOpen,
    onClickOutside: onCloseCalendar,
  });

  const calendarPopover =
    mounted && isOpen
      ? createPortal(
          <div
            ref={popoverRef}
            className="pointer-events-auto fixed z-[100] w-[min(320px,calc(100vw-2rem))]"
            style={{ top: popoverPos.top, left: popoverPos.left }}
          >
            <Calendar
              selected={value}
              onSelect={(d) => {
                if (!d) return;
                onSelectDate(d);
              }}
            />
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="min-w-0">
          <h2 className="text-txt-primary truncate text-base font-bold md:text-lg lg:text-xl">
            {groupName}
          </h2>
        </div>
        <div className="flex min-w-0 flex-nowrap items-center gap-x-2 sm:gap-3">
          <h2 className="text-txt-primary min-w-[6.5rem] shrink-0 text-sm font-semibold tabular-nums sm:min-w-[7.25rem] md:min-w-[8rem] md:text-base lg:min-w-[8.5rem] lg:text-lg">
            {formatMonth(value)}
          </h2>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Button
              className="bg-primary h-4 w-4 rounded-full border border-gray-300 p-0"
              variant="ghost"
              onClick={onPrev}
              aria-label="이전 달"
            >
              <IconArrowLeft size={12} />
            </Button>

            <Button
              className="bg-primary h-4 w-4 rounded-full border border-gray-300 p-0"
              variant="ghost"
              onClick={onNext}
              aria-label="다음 달"
            >
              <IconArrowRight size={12} />
            </Button>
            <div ref={wrapperRef} className="relative shrink-0">
              <Button
                className="bg-secondary h-[24px] w-[24px] rounded-full border border-gray-300 p-0"
                variant="ghost"
                aria-label="달력 열기"
                onClick={onOpenCalendar}
              >
                <IconCalendar />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {calendarPopover}
    </>
  );
}
