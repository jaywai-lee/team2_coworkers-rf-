import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/getUser';
import { USER_QUERY_KEYS } from '../lib/queryKeys';
import { UserProfile } from '../model/entities/user.model';
import { ApiError } from '@/shared/types/apiError';

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function useUserQuery() {
  return useQuery<UserProfile | null, ApiError>({
    queryKey: USER_QUERY_KEYS.me(),
    queryFn: async () => {
      try {
        return await getUser();
      } catch (error: unknown) {
        if (isApiError(error) && error.status === 401) {
          return null;
        }
        throw error as ApiError;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}
