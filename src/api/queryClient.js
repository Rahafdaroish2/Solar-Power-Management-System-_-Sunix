import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: (count, error) =>
        count < 2 && ['NETWORK', 'TIMEOUT'].includes(error.code),
    },
    mutations: { retry: false },
  },
});
