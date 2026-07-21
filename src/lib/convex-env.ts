const stripWrappingQuotes = (value?: string | null) => {
  if (!value) return undefined

  const trimmedValue = value.trim()
  const unwrappedValue = trimmedValue.replace(/^['"`]+|['"`]+$/g, '')

  return unwrappedValue || undefined
}

const readRuntimeEnv = (name: string) => {
  if (typeof process === 'undefined') return undefined

  return stripWrappingQuotes(process.env?.[name])
}

const isValidUrl = (value?: string) => {
  if (!value) return false

  try {
    const parsedUrl = new URL(value)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

export const getConvexUrl = () => {
  const buildValue = stripWrappingQuotes(import.meta.env.VITE_CONVEX_URL)
  const runtimeValue = readRuntimeEnv('VITE_CONVEX_URL')

  return buildValue || runtimeValue
}

export const getSafeConvexUrl = () => {
  const resolvedUrl = getConvexUrl()

  if (isValidUrl(resolvedUrl)) {
    return resolvedUrl
  }

  return 'https://invalid.convex.cloud'
}

export const hasValidConvexUrl = () => isValidUrl(getConvexUrl())

export const getCloudflareBindingValue = async (name: string) => {
  if (!import.meta.env.SSR) return undefined

  try {
    const loadCloudflareModule = new Function(
      'return import("cloudflare:workers")',
    ) as () => Promise<{ env?: Record<string, string | undefined> }>
    const { env } = await loadCloudflareModule()

    return stripWrappingQuotes(env?.[name])
  } catch {
    return undefined
  }
}

export const getServerConvexUrl = async () => {
  const buildValue = stripWrappingQuotes(import.meta.env.VITE_CONVEX_URL)
  const cloudflareValue = await getCloudflareBindingValue('VITE_CONVEX_URL')
  const runtimeValue = readRuntimeEnv('VITE_CONVEX_URL')

  return buildValue || cloudflareValue || runtimeValue
}

export const hasValidServerConvexUrl = async () =>
  isValidUrl(await getServerConvexUrl())

let hasWarnedInvalidConvexUrl = false

export const warnInvalidConvexUrlOnce = (scope: string) => {
  if (hasWarnedInvalidConvexUrl || hasValidConvexUrl()) {
    return
  }

  hasWarnedInvalidConvexUrl = true
  console.error(
    `${scope}: VITE_CONVEX_URL belum valid. Pastikan variabel tersedia di build Pages dan runtime binding Cloudflare tanpa quote/backtick.`,
  )
}
