import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRef } from "react";

function QueryProvider({ children }) {
  const queryClientRef = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: 0,
          retryDelay: 0,
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: 60000, //60sec
          // placeholderData: keepPreviousData,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
      {queryClientRef?.current && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default QueryProvider;

// refetchInterval: 15000,
// staleTime: 0,
//it means queries will refetch after stale time and until then considered fresh.
// gcTime: 1000 * 60 * 5,
//by default query labeled as "inactive" when there is not active instance and remain in the cache.
//also its garbage collected after 5 minutes.
