import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SignUpRequest } from '../model/dto/auth.dto';
import { authService } from '../api/auth.service';
import { User } from '@/shared/types/user.model';
import { USER_QUERY_KEYS } from '@/features/user';
import { ApiError } from '@/shared/types/apiError';

export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation<User, ApiError, SignUpRequest>({
    mutationFn: (data: SignUpRequest) => authService.signUp(data),
    meta: {
      disableGlobalError: true,
    },
    onSuccess: (user) => {
      queryClient.setQueryData(USER_QUERY_KEYS.me(), user);
    },
  });
};
