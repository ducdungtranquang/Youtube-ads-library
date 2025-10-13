import { useState, useEffect } from 'react'
import { RateLimiter } from '@/lib/utils'

interface RateLimitHookOptions {
  action: string
  identifier: string
  maxAttempts?: number
  windowMs?: number
  updateInterval?: number
}

interface RateLimitStatus {
  canAttempt: boolean
  remainingTime?: number
  attemptsLeft?: number
  remainingTimeText?: string
  isClient: boolean
}

export function useRateLimit({
  action,
  identifier,
  maxAttempts = 3,
  windowMs = 15 * 60 * 1000,
  updateInterval = 1000
}: RateLimitHookOptions): RateLimitStatus {
  const [status, setStatus] = useState<RateLimitStatus>(() => ({
    canAttempt: true,
    isClient: false
  }))

  useEffect(() => {
    const updateStatus = () => {
      const result = RateLimiter.canAttempt(action, identifier, maxAttempts, windowMs)
      setStatus({
        ...result,
        remainingTimeText: result.remainingTime 
          ? RateLimiter.getRemainingTimeText(result.remainingTime)
          : undefined,
        isClient: true
      })
    }

    // Update immediately on mount (client-side only)
    updateStatus()

    // Set up interval to update status
    const interval = setInterval(updateStatus, updateInterval)

    return () => clearInterval(interval)
  }, [action, identifier, maxAttempts, windowMs, updateInterval])

  return status
}