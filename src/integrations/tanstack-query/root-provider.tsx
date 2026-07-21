import { QueryClient } from '@tanstack/react-query'
import { convexQueryClient } from '../convex/provider'
import { hasValidConvexUrl, warnInvalidConvexUrlOnce } from '../../lib/convex-env'

export function getContext() {
  const convexUrlIsValid = hasValidConvexUrl()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn:
          typeof document !== 'undefined' && convexUrlIsValid
            ? convexQueryClient.queryFn()
            : () => Promise.resolve(undefined),
      },
    },
  })

  if (typeof document !== 'undefined' && convexUrlIsValid) {
    convexQueryClient.connect(queryClient)
  } else if (!convexUrlIsValid) {
    warnInvalidConvexUrlOnce('TanStack Query Convex client dinonaktifkan')
  }

  return {
    queryClient,
  }
}
export default function TanstackQueryProvider() {}
