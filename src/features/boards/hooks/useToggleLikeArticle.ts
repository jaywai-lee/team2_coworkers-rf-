import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeArticle } from '../api/likeArticle';
import { unlikeArticle } from '../api/unlikeArticle';
import { ARTICLE_QUERY_KEYS } from '../model/querykeys';
import { ArticleDetail } from '../model/entities/article.model';

export function useToggleLikeArticle() {
  const queryClient = useQueryClient();

  const toggleLikeMutation = useMutation({
    mutationFn: ({ articleId, isLiked }: { articleId: number; isLiked: boolean }) =>
      isLiked ? unlikeArticle(articleId) : likeArticle(articleId),

    onMutate: async ({ articleId, isLiked }) => {
      const detailKey = ARTICLE_QUERY_KEYS.detail(articleId);

      await queryClient.cancelQueries({ queryKey: detailKey });

      const previous = queryClient.getQueryData(detailKey);

      queryClient.setQueryData(detailKey, (old: ArticleDetail | undefined) =>
        old
          ? {
              ...old,
              isLiked: !isLiked,
              likeCount: old.likeCount + (isLiked ? -1 : 1),
            }
          : old,
      );

      return { previous };
    },

    onError: (_err, { articleId }, context) => {
      const detailKey = ARTICLE_QUERY_KEYS.detail(articleId);
      if (context?.previous) {
        queryClient.setQueryData(detailKey, context.previous);
      }
    },

    onSettled: (_data, _error, { articleId }) => {
      const listKey = ARTICLE_QUERY_KEYS.list();
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });

  const toggleLike = (articleId: number, isLiked: boolean) => {
    toggleLikeMutation.mutate({ articleId, isLiked });
  };

  return { toggleLike, isLiking: toggleLikeMutation.isPending };
}
