import { Skeleton } from '@/shared/ui/skeleton/Skeleton';

export function TaskPageLayoutSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-3 px-4 py-4 md:gap-5 md:px-6 md:py-5 lg:gap-6 lg:px-8 lg:py-6 xl:max-w-[1200px] xl:px-10">
      <Skeleton className="h-14 w-full rounded-xl md:h-16" />

      <div className="flex w-full flex-col gap-4 md:gap-5 lg:flex-row lg:gap-8">
        <TaskListStripSkeleton />

        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5 lg:gap-6">
          <WeekCalendarBlockSkeleton />
          <TasksSectionLoadingSkeleton />
        </div>
      </div>
    </div>
  );
}

export function TaskListStripSkeleton() {
  return (
    <>
      <div className="hidden w-[220px] shrink-0 lg:flex lg:w-[240px] lg:flex-col lg:gap-4">
        <Skeleton className="h-7 w-14 md:h-8" />
        <Skeleton className="min-h-[140px] w-full rounded-2xl md:min-h-[160px]" />
      </div>
      <div className="flex items-center gap-2 md:gap-3 lg:hidden">
        <div className="flex min-w-0 flex-1 pb-2">
          <div className="no-scrollbar flex gap-2 overflow-x-auto whitespace-nowrap md:gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton
                key={i}
                className="h-[52px] min-w-[118px] shrink-0 rounded-xl md:h-[56px] md:min-w-[140px]"
              />
            ))}
          </div>
        </div>
        <Skeleton className="h-9 w-[76px] shrink-0 rounded-xl md:h-10 md:w-[88px]" />
      </div>
    </>
  );
}

function WeekCalendarBlockSkeleton() {
  return (
    <div className="border-background-tertiary flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:gap-4 md:p-5 lg:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <Skeleton className="h-7 w-36 max-w-full md:h-8 md:w-48" />
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Skeleton className="h-6 w-28 rounded-md md:h-7 md:w-32" />
          <Skeleton className="size-8 shrink-0 rounded-lg md:size-9" />
          <Skeleton className="size-8 shrink-0 rounded-lg md:size-9" />
        </div>
      </div>
      <div className="flex w-full justify-between gap-1 sm:gap-2">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-12 flex-1 rounded-lg sm:h-14" />
        ))}
      </div>
    </div>
  );
}

export function TasksSectionLoadingSkeleton() {
  return (
    <div className="mx-auto flex w-full flex-col gap-2 md:max-w-[640px] lg:max-w-[734px]">
      <Skeleton className="h-7 w-44 md:h-8" />
      <Skeleton className="h-10 w-full rounded-xl" />
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-[68px] w-full rounded-xl" />
      ))}
    </div>
  );
}
