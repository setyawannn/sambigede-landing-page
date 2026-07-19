import { QueryClient } from '@tanstack/react-query'
import { convexQueryClient } from '../convex/provider'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: typeof document !== 'undefined' 
          ? convexQueryClient.queryFn() 
          : () => Promise.resolve(undefined),
      },
    },
  })

  if (typeof document !== 'undefined') {
    convexQueryClient.connect(queryClient)
  }

  return {
    queryClient,
  }
}
export default function TanstackQueryProvider() {}
