import { Skeleton } from '@/shared/ui/skeleton/Skeleton';

export default function BestArticleSkeleton() {
  return (
    // 💡 1. 캐러셀과 완벽히 똑같은 부모 컨테이너
    <div className="mx-auto w-full max-w-[1120px] px-6 select-none">
      {/* 💡 2. 타이틀 영역 */}
      <div className="px-4 md:px-2">
        <Skeleton className="h-7 w-32" />
      </div>

      {/* 💡 3. 카드 영역 (캐러셀과 똑같이 flex justify-center gap-4 pt-6 적용) */}
      <div className="flex justify-center gap-4 overflow-hidden pt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            // 실제 카드의 너비(w-[340px])와 높이(h-[205px])를 맞추고 반응형 숨김(hidden) 추가
            className={`h-[205px] w-[340px] shrink-0 rounded-xl border border-slate-200 bg-white px-5 py-6 ${
              i === 2 ? 'hidden md:block' : i === 3 ? 'hidden lg:block' : ''
            }`}
          >
            {/* 뱃지 */}
            <Skeleton className="mb-4 h-6 w-16 rounded-[4px]" />

            {/* 제목 및 내용 */}
            <div className="mt-4 space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>

            {/* 날짜/작성자 (하단) */}
            <div className="mt-6 flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* 💡 4. 하단 점(Pagination) 및 화살표 영역 */}
      <div className="mt-5 grid grid-cols-3 items-center">
        <div />
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className={`h-2 rounded-full ${i === 1 ? 'w-4' : 'w-2'}`} />
          ))}
        </div>
        <div className="flex justify-end gap-2 pr-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
