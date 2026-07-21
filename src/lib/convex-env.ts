const stripWrappingQuotes = (value?: string | null) => {
  if (!value) return undefined

  const trimmedValue = value.trim()
  const unwrappedValue = trimmedValue.replace(/^['"`]+|['"`]+$/g, '')

  return unwrappedValue || undefined
}

declare global {
  var __CF_RUNTIME_ENV__:
    | Record<string, string | undefined>
    | undefined
    | null

  interface Window {
    __APP_ENV__?: Record<string, string | undefined>
  }
}

const readBrowserEnv = (name: string) => {
  if (typeof window === 'undefined') return undefined

  return stripWrappingQuotes(window.__APP_ENV__?.[name])
}

const readWorkerEnv = (name: string) => {
  return stripWrappingQuotes(globalThis.__CF_RUNTIME_ENV__?.[name])
}

const readRuntimeEnv = (name: string) => {
  if (typeof process === 'undefined') return undefined

  return stripWrappingQuotes(process.env?.[name])
}

const readBuildEnv = (name: string) => {
  const buildEnv = import.meta.env as Record<string, string | undefined>
  return stripWrappingQuotes(buildEnv[name])
}

export const getServerEnvValue = (name: string) => {
  return (
    stripWrappingQuotes(globalThis.__CF_RUNTIME_ENV__?.[name]) ||
    readRuntimeEnv(name)
  )
}

export const getPublicEnvValue = (name: string) => {
  return (
    readBuildEnv(name) ||
    readBrowserEnv(name) ||
    readWorkerEnv(name) ||
    readRuntimeEnv(name)
  )
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
  return getPublicEnvValue('VITE_CONVEX_URL')
}

export const getSafeConvexUrl = () => {
  const resolvedUrl = getConvexUrl()

  if (isValidUrl(resolvedUrl)) {
    return resolvedUrl
  }

  return 'https://invalid.convex.cloud'
}

export const hasValidConvexUrl = () => isValidUrl(getConvexUrl())

export const getServerConvexUrl = () => {
  const buildValue = stripWrappingQuotes(import.meta.env.VITE_CONVEX_URL)
  const workerValue = readWorkerEnv('VITE_CONVEX_URL')
  const runtimeValue = readRuntimeEnv('VITE_CONVEX_URL')

  return buildValue || workerValue || runtimeValue
}

export const hasValidServerConvexUrl = () => isValidUrl(getServerConvexUrl())

export const getTurnstileSiteKey = () => {
  return getPublicEnvValue('VITE_CLOUDFLARE_TURNSTILE_SITE_KEY') || ''
}

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
