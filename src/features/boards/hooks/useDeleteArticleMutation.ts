import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteArticle } from '../api/deleteArticle';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { ARTICLE_QUERY_KEYS } from '../model/querykeys';

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteArticle,
  });

  const deleteHandler = (articleId: number) => {
    queryClient.cancelQueries({
      queryKey: ARTICLE_QUERY_KEYS.detail(articleId),
    });

    mutate(articleId, {
      onSuccess: async () => {
        await router.replace('/boards');

        queryClient.invalidateQueries({
          queryKey: ['articles', 'list'],
        });

        queryClient.removeQueries({
          queryKey: ARTICLE_QUERY_KEYS.detail(articleId),
        });
        toast.success('게시글이 삭제되었습니다.');
      },
    });
  };

  return {
    deleteArticle: deleteHandler,
    isDeleting: isPending,
  };
}
