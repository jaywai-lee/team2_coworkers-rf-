import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateArticle } from '../api/updateArticle';
import { ARTICLE_QUERY_KEYS } from '../model/querykeys';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateArticle,
  });
  const router = useRouter();
  const updateArticleHandler = async (
    articleId: number,
    title: string,
    content: string,
    image?: string,
  ) => {
    return await mutateAsync(
      { articleId, title, content, image },
      {
        onSuccess: async (data) => {
          queryClient.setQueryData(ARTICLE_QUERY_KEYS.detail(articleId), data);
          queryClient.invalidateQueries({
            queryKey: ['articles', 'list'],
          });

          await router.replace(`/boards/${articleId}`);
          toast.success('게시글이 수정되었습니다.');
        },
      },
    );
  };

  return {
    updateArticle: updateArticleHandler,
    isUpdating: isPending,
  };
}
