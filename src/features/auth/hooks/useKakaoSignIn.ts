import { User } from '@/shared/types/user.model';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/auth.service';
import { USER_QUERY_KEYS } from '@/features/user';

export const useKakaoSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { redirectUri: string; token: string }>({
    mutationFn: authService.kakaoSignIn,
    onSuccess: (user) => {
      queryClient.setQueryData(USER_QUERY_KEYS.me(), user);
    },
  });
};
