import ArticleListSkeleton from '@/features/boards/components/ArticleListSkeleton';
import BestArticleSkeleton from '@/features/boards/components/BestArticleSkeleton';
import { BoardHeader } from '@/features/boards/components/BoardHeader';
import { BoardToolbar } from '@/features/boards/components/BoardToolbar';
import { useBoardsPage } from '@/features/boards/hooks/useBoardsPage';
import { GlobalLayout } from '@/widgets/layout/GlobalLayout';
import { ReactElement } from 'react';
import dynamic from 'next/dynamic';

const BestArticleCarousel = dynamic(
  () =>
    import('@/features/boards/components/BestArticleCarousel').then(
      (mod) => mod.BestArticleCarousel,
    ),
  {
    loading: () => <BestArticleSkeleton />,
    ssr: false,
  },
);

const ArticleList = dynamic(
  () => import('@/features/boards/components/ArticleList').then((mod) => mod.ArticleList),
  {
    loading: () => <ArticleListSkeleton />,
    ssr: false,
  },
);

export default function BoardsListPage() {
  const {
    best,
    filteredList,
    search,
    setSearch,
    sortOption,
    setSortOption,
    handlers,
    isLoading,
    error,
    loadMoreRef,
    isFetchingNextPage,
  } = useBoardsPage();

  return (
    <main className="mx-auto mt-6 max-w-[1120px] px-2 md:mt-22 md:px-4 lg:px-0">
      <BoardHeader search={search} onChangeSearch={setSearch} />

      <section className="mt-8 h-92.5 rounded-xl border border-slate-100 bg-slate-100 px-2 pt-10">
        {isLoading ? (
          <BestArticleSkeleton />
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            데이터를 가져오는 중 오류 발생
          </div>
        ) : (
          <BestArticleCarousel
            best={best}
            onPrev={handlers.onPrev}
            onNext={handlers.onNext}
            onSwipe={handlers.onSwipe}
          />
        )}
      </section>

      <section className="mt-11 flex justify-center">
        <BoardToolbar sortOption={sortOption} onChangeSort={setSortOption} />
      </section>

      <section className="mt-5 mb-8 flex justify-center">
        {isLoading ? (
          <ArticleListSkeleton />
        ) : error ? (
          <div className="flex h-20 w-full items-center justify-center">
            게시글을 가져오는 중 오류 발생
          </div>
        ) : (
          <>
            <ArticleList articles={filteredList} isFetchingNextPage={isFetchingNextPage} />
            <div ref={loadMoreRef} className="h-20" />
          </>
        )}
      </section>
    </main>
  );
}
BoardsListPage.getLayout = function getLayout(page: ReactElement) {
  return <GlobalLayout>{page}</GlobalLayout>;
};
