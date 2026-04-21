import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';
import { useState } from 'react';
import { isApiError, mapApiError } from '../api/mapApiError';
import { EMPTY_TASK_COMMENT_CONTENT } from '../constants/mutationErrors';
import { toast } from 'sonner';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            const mappedError = mapApiError(error);
            if (mappedError.status !== 401) {
              toast.error(mappedError.message);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.disableGlobalError) return;
            if (error instanceof Error && error.message === EMPTY_TASK_COMMENT_CONTENT) return;
            const mappedError = mapApiError(error);
            if (mappedError.status !== 401) {
              toast.error(mappedError.message);
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: (failureCount, error: unknown) => {
              if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401 || status === 403) return false;
              }
              if (isApiError(error)) {
                if (error.status === 401 || error.status === 403) return false;
              }
              return failureCount < 3;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
