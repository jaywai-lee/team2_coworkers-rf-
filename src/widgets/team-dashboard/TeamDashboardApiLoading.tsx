import { Skeleton } from '@/shared/ui/skeleton/Skeleton';

export function TeamDashboardApiLoading() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col gap-6"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="h-[196px] w-full max-w-full rounded-[20px] md:h-[239px]" />
      <section className="flex min-w-0 flex-col gap-4">
        <Skeleton className="h-7 w-56 rounded-md md:h-8" />
        <div className="min-w-0 overflow-x-auto pb-2">
          <div className="flex flex-col gap-[16px] lg:flex-row lg:items-start lg:gap-[20px]">
            <div className="w-full min-w-0 shrink-0 lg:w-[270px]">
              <Skeleton className="min-h-[120px] w-full rounded-xl" />
            </div>
            <div className="w-full min-w-0 shrink-0 lg:w-[270px]">
              <Skeleton className="min-h-[120px] w-full rounded-xl" />
            </div>
            <div className="w-full min-w-0 shrink-0 lg:w-[270px]">
              <Skeleton className="min-h-[120px] w-full rounded-xl" />
            </div>
            <div className="hidden min-w-0 shrink-0 lg:flex lg:w-[240px] lg:flex-col">
              <Skeleton className="min-h-[200px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
