'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Dynamically import devtools for development only
const ReactQueryDevtools = process.env.NODE_ENV === 'development' 
  ? React.lazy(() => 
      import('@tanstack/react-query-devtools').then((d) => ({
        default: d.ReactQueryDevtools,
      }))
    )
  : null;

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that cached data stays fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Time in milliseconds that cached data stays in memory when unused
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
      // Retry failed requests automatically
      retry: 2,
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: true,
      // Custom retry delay function
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Add React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && ReactQueryDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </React.Suspense>
      )}
    </QueryClientProvider>
  );
}

// Export the query client for use in other parts of the app
export { queryClient };
