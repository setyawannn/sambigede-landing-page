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

const readBuildConvexUrl = () =>
  stripWrappingQuotes(import.meta.env.VITE_CONVEX_URL)

const readBuildTurnstileSiteKey = () =>
  stripWrappingQuotes(import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY)

const readBuildR2PublicUrl = () =>
  stripWrappingQuotes(import.meta.env.VITE_R2_PUBLIC_URL)

export const getServerEnvValue = (name: string) => {
  return (
    stripWrappingQuotes(globalThis.__CF_RUNTIME_ENV__?.[name]) ||
    readRuntimeEnv(name)
  )
}

export const getPublicEnvValue = (name: string) => {
  switch (name) {
    case 'VITE_CONVEX_URL':
      return (
        readBuildConvexUrl() ||
        readBrowserEnv(name) ||
        readWorkerEnv(name) ||
        readRuntimeEnv(name)
      )
    case 'VITE_CLOUDFLARE_TURNSTILE_SITE_KEY':
      return (
        readBuildTurnstileSiteKey() ||
        readBrowserEnv(name) ||
        readWorkerEnv(name) ||
        readRuntimeEnv(name)
      )
    case 'VITE_R2_PUBLIC_URL':
      return (
        readBuildR2PublicUrl() ||
        readBrowserEnv(name) ||
        readWorkerEnv(name) ||
        readRuntimeEnv(name)
      )
    default:
      return readBrowserEnv(name) || readWorkerEnv(name) || readRuntimeEnv(name)
  }
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
  const buildValue = readBuildConvexUrl()
  const workerValue = readWorkerEnv('VITE_CONVEX_URL')
  const runtimeValue = readRuntimeEnv('VITE_CONVEX_URL')

  return buildValue || workerValue || runtimeValue
}

export const hasValidServerConvexUrl = () => isValidUrl(getServerConvexUrl())

export const getTurnstileSiteKey = () => {
  return getPublicEnvValue('VITE_CLOUDFLARE_TURNSTILE_SITE_KEY') || ''
}

export const extractR2FileKey = (value?: string | null): string => {
  const normalized = stripWrappingQuotes(value)
  if (!normalized) return ''

  if (normalized.startsWith('data:')) return normalized

  if (/^https?:\/\//i.test(normalized)) {
    try {
      const url = new URL(normalized)
      return url.pathname.replace(/^\//, '')
    } catch {
      return normalized
    }
  }

  return normalized.replace(/^\//, '')
}

export const resolvePublicR2AssetUrl = (value?: string | null) => {
  const normalizedValue = stripWrappingQuotes(value)
  if (!normalizedValue) return undefined

  if (normalizedValue.startsWith('data:')) {
    return normalizedValue
  }

  // Jika data berupa URL eksternal non-R2 (seperti unsplash placeholder)
  if (
    /^https?:\/\//i.test(normalizedValue) &&
    !normalizedValue.includes('.r2.dev') &&
    !normalizedValue.includes('r2.cloudflarestorage.com')
  ) {
    return normalizedValue
  }

  const fileKey = extractR2FileKey(normalizedValue)
  if (!fileKey) return undefined

  const publicUrl =
    getPublicEnvValue('VITE_R2_PUBLIC_URL') ||
    'https://pub-9290bb356c9a4e4d8ef8013e2fe9d0c2.r2.dev'

  return `${publicUrl.replace(/\/$/, '')}/${fileKey}`
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
