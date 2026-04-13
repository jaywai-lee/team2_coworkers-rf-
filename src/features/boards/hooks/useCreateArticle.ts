import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArticle } from '../api/createArticle';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

export function useCreateArticle() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createArticle,
  });
  const router = useRouter();
  const createArticleHandler = async (title: string, content: string, image?: string) => {
    return await mutateAsync(
      { title, content, image },
      {
        onSuccess: async () => {
          await router.replace('/boards');

          queryClient.invalidateQueries({
            queryKey: ['articles', 'list'],
          });
          queryClient.removeQueries({ queryKey: ['articles'] });
          toast.success('게시글이 등록되었습니다.');
        },
      },
    );
  };

  return {
    createArticle: createArticleHandler,
    isCreating: isPending,
  };
}
