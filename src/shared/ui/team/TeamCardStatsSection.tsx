import { cn } from '@/shared/lib/cn';
import { getSafeProgressPercent } from './teamCard.guards';

export type TeamCardStatsSectionProps = {
  progressPercent: number;
  todayTaskCount: number;
  completedTaskCount: string | number;
  statsClassName?: string;
};

export function TeamCardStatsSection({
  progressPercent,
  todayTaskCount,
  completedTaskCount,
  statsClassName,
}: TeamCardStatsSectionProps) {
  const safeProgressPercent = getSafeProgressPercent(progressPercent);

  return (
    <div className="flex w-full min-w-0 items-end justify-between gap-6">
      <div className="shrink-0 pl-2">
        <p className="text-txt-default text-[12px] leading-[14px] font-medium">오늘의 진행 상황</p>
        <p className="text-brand-primary mt-1 text-[32px] leading-[38px] font-bold tabular-nums">
          {safeProgressPercent}%
        </p>
      </div>

      <div
        className={cn(
          'flex h-[46px] shrink-0 items-stretch justify-end gap-5 pr-13',
          statsClassName,
        )}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-txt-default text-[12px] leading-[14px] font-medium whitespace-nowrap">
            오늘의 할 일
          </span>
          <span className="text-txt-secondary mt-1 text-[32px] leading-[28px] font-bold tabular-nums">
            {todayTaskCount}
          </span>
        </div>
        <div className="bg-background-tertiary w-px shrink-0" aria-hidden="true" />
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-txt-default text-[12px] leading-[14px] font-medium whitespace-nowrap">
            완료<span aria-hidden="true"> 🙌</span>
          </span>
          <span className="text-brand-primary mt-1 text-[32px] leading-[28px] font-bold tabular-nums">
            {completedTaskCount}
          </span>
        </div>
      </div>
    </div>
  );
}
