import KebabMenu from '@/features/boards/components/KebabMenu';
import { IconUser } from '@/shared/ui/icons';
import { useState } from 'react';
import { ArticleDetail } from '../model/entities/article.model';
import { useUserQuery } from '@/features/user';
import { formatDate } from '@/shared/lib/date';
import { useDeleteArticle } from '../hooks/useDeleteArticleMutation';
import { useRouter } from 'next/router';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface Props {
  article: ArticleDetail;
}

export default function ArticleContent({ article }: Props) {
  const [imgError, setImgError] = useState(false);
  const { data: currentUser } = useUserQuery();
  const { deleteArticle } = useDeleteArticle();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleConfirmDelete = () => {
    deleteArticle(article.id);
    setIsDeleteOpen(false);
  };
  const router = useRouter();
  return (
    <>
      <div className="mt-7 flex items-center justify-between">
        <h1 className="flex-1 text-xl font-bold break-all">{article.title}</h1>

        {currentUser?.id === article.writer.id && (
          <KebabMenu
            onEdit={() => router.push(`/boards/${article.id}/editArticle`)}
            onDelete={() => setIsDeleteOpen(true)}
            isDeleteDanger
            align="side-right"
          />
        )}
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <IconUser size={24} className="rounded-[6px] bg-slate-200 text-white" />

        <div className="text-md font-medium">{article.writer.nickname}</div>
        <div>|</div>
        <div className="text-slate-400">{formatDate(article.createdAt)}</div>
      </div>

      <div className="text-md mt-4 leading-relaxed whitespace-pre-line">{article.content}</div>

      <div className="mt-4 flex justify-between">
        {article.image &&
          (!imgError ? (
            <img
              src={article.image}
              alt={article.title}
              className="h-35 w-35 rounded-xl md:h-45 md:w-45"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-35 w-35 items-center justify-center rounded-xl border bg-gray-100 text-gray-400 md:h-45 md:w-45">
              이미지 오류
            </div>
          ))}
      </div>
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="게시글을 삭제할까요?"
        description="삭제된 게시글은 복구할 수 없습니다."
      />
    </>
  );
}
