import React, { useEffect, useState, useRef } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'

interface R2ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
}

// Global batch tracker for Class B operations to prevent Convex limit hits
let classBBatchCount = 0
let flushTimeout: ReturnType<typeof setTimeout> | null = null

export default function R2Image({
  src,
  alt = 'Image',
  fallbackSrc = '/placeholder-image.webp', // Default local placeholder
  className,
  ...props
}: R2ImageProps) {
  // Use a very lightweight query to check circuit breaker status
  const isCircuitBreakerActive = useQuery(
    api.r2_analytics.getCircuitBreakerStatus,
  )
  const incrementClassB = useMutation(api.r2_analytics.incrementClassB)

  const [imgSrc, setImgSrc] = useState<string | undefined>(src)
  const reportedRef = useRef(false)

  // Handle circuit breaker
  useEffect(() => {
    const isR2 = src
      ? src.startsWith(import.meta.env.VITE_R2_PUBLIC_URL || '') ||
        src.includes('r2.dev') ||
        src.includes('r2.cloudflarestorage.com')
      : false

    if (isR2 && isCircuitBreakerActive === true) {
      // Circuit breaker tripped! Swap to fallback
      setImgSrc(fallbackSrc)
    } else {
      setImgSrc(src)
    }
  }, [isCircuitBreakerActive, src, fallbackSrc])

  // Track Class B operation when image loads successfully (and only once per component mount)
  useEffect(() => {
    const isR2 = src
      ? src.startsWith(import.meta.env.VITE_R2_PUBLIC_URL || '') ||
        src.includes('r2.dev') ||
        src.includes('r2.cloudflarestorage.com')
      : false

    if (
      !reportedRef.current &&
      imgSrc === src &&
      src &&
      isR2 &&
      isCircuitBreakerActive === false
    ) {
      reportedRef.current = true

      // We throttle/batch reports to avoid hitting Convex limits
      classBBatchCount++

      if (!flushTimeout) {
        flushTimeout = setTimeout(() => {
          if (classBBatchCount > 0) {
            incrementClassB({ count: classBBatchCount }).catch(console.error)
            classBBatchCount = 0
          }
          flushTimeout = null
        }, 5000) // Flush every 5 seconds
      }
    }
  }, [imgSrc, src, isCircuitBreakerActive, incrementClassB])

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
    }
  }

  // If status is still loading, we might show a skeleton or just the normal image
  // It's better to show the normal image initially rather than waiting,
  // but if the limit is exceeded, it's safer to wait. We'll just render it for now.

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
      {...props}
    />
  )
}
