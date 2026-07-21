import { ConvexProvider } from 'convex/react'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexHttpClient } from 'convex/browser'
import {
  getConvexUrl,
  getSafeConvexUrl,
  warnInvalidConvexUrlOnce,
} from '../../lib/convex-env'

const CONVEX_URL = getConvexUrl()
const SAFE_CONVEX_URL = getSafeConvexUrl()

if (!CONVEX_URL) {
  warnInvalidConvexUrlOnce('ConvexProvider')
}

export const convexQueryClient = new ConvexQueryClient(SAFE_CONVEX_URL)
export const convexHttpClient = new ConvexHttpClient(SAFE_CONVEX_URL)

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConvexProvider client={convexQueryClient.convexClient}>
      {children}
    </ConvexProvider>
  )
}
