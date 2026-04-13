import Link from 'next/link';
import ArticleContent from '@/features/boards/components/ArticleContent';
import ArticleDetailSkeleton from '@/features/boards/components/ArticleDetailSkeleton';
import CommentSection from '@/features/boards/components/CommentSection';
import { useArticleDetailPage } from '@/features/boards/hooks/useArticleDetailPage';
import { GlobalLayout } from '@/widgets/layout/GlobalLayout';
import { ReactElement } from 'react';
import { IconArrowLeft } from '@/shared/ui/icons/IconArrowLeft';

export default function ArticleDetail() {
  const { article, comments, isLoading, isError } = useArticleDetailPage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="relative mx-auto min-h-[80vh] w-full max-w-225 rounded-2xl bg-white shadow-xl">
        <Link
          href="/boards"
          className="flex items-center gap-1 px-3 pt-6 text-slate-400 hover:text-slate-600 md:px-8"
        >
          <IconArrowLeft size={24} />
        </Link>
        <div className="space-y-4 px-6 pb-6 md:px-18 md:pt-5 md:pb-18">
          {isLoading ? (
            <ArticleDetailSkeleton />
          ) : isError ? (
            <div className="flex h-40 items-center justify-center text-red-400">에러 발생</div>
          ) : article ? (
            <>
              <ArticleContent article={article} />
              <CommentSection article={article} comments={comments} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
ArticleDetail.getLayout = function getLayout(page: ReactElement) {
  return <GlobalLayout>{page}</GlobalLayout>;
};
