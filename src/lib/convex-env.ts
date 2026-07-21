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
