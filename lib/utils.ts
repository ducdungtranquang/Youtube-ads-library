import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Rate limiting utility
interface RateLimitData {
  count: number
  firstAttempt: number
  lastAttempt: number
}

export class RateLimiter {
  private static isClient = typeof window !== 'undefined'

  private static getStorageKey(action: string, identifier: string): string {
    return `rate_limit_${action}_${identifier}`
  }

  private static getData(key: string): RateLimitData | null {
    if (!this.isClient) return null
    
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  private static setData(key: string, data: RateLimitData): void {
    if (!this.isClient) return
    
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch {
      // Handle localStorage errors silently
    }
  }

  static canAttempt(
    action: string, 
    identifier: string, 
    maxAttempts: number = 3, 
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): { canAttempt: boolean; remainingTime?: number; attemptsLeft?: number } {
    const key = this.getStorageKey(action, identifier)
    const now = Date.now()
    const data = this.getData(key)

    if (!data) {
      return { canAttempt: true, attemptsLeft: maxAttempts - 1 }
    }

    // Check if window has expired
    if (now - data.firstAttempt > windowMs) {
      // Reset the window
      localStorage.removeItem(key)
      return { canAttempt: true, attemptsLeft: maxAttempts - 1 }
    }

    // Check if user has exceeded max attempts
    if (data.count >= maxAttempts) {
      const remainingTime = windowMs - (now - data.firstAttempt)
      return { canAttempt: false, remainingTime }
    }

    return { canAttempt: true, attemptsLeft: maxAttempts - data.count - 1 }
  }

  static recordAttempt(action: string, identifier: string): void {
    const key = this.getStorageKey(action, identifier)
    const now = Date.now()
    const data = this.getData(key)

    if (!data) {
      this.setData(key, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      })
    } else {
      this.setData(key, {
        ...data,
        count: data.count + 1,
        lastAttempt: now
      })
    }
  }

  static getRemainingTimeText(remainingMs: number): string {
    const minutes = Math.ceil(remainingMs / (60 * 1000))
    if (minutes > 60) {
      const hours = Math.ceil(minutes / 60)
      return `${hours} hour${hours > 1 ? 's' : ''}`
    }
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  }
}
