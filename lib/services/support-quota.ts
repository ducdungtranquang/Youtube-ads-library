/**
 * Quota Manager cho tính năng Chat Support & Phản hồi
 * - Gói Free / Khách vãng lai: Tối đa 1 tin nhắn / ngày (Reset lúc 00:00 giờ Việt Nam)
 * - Gói Unlimited: Không giới hạn lượt gửi
 */

export function getVietnamTodayKey(): string {
  const d = new Date()
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(d) // "YYYY-MM-DD"
}

interface SupportUsageRecord {
  count: number
  date: string
  lastSentAt: number
}

class SupportQuotaTracker {
  private usage = new Map<string, SupportUsageRecord>()
  private lastCleanup = Date.now()

  constructor() {
    if (typeof setInterval !== 'undefined') {
      setInterval(() => {
        this.cleanup()
      }, 15 * 60 * 1000)
    }
  }

  private cleanup(): void {
    const today = getVietnamTodayKey()
    for (const [key, record] of this.usage.entries()) {
      // Xóa các bản ghi của các ngày trước
      if (record.date !== today) {
        this.usage.delete(key)
      }
    }
    this.lastCleanup = Date.now()
  }

  public getIdentifier(userId?: string | null, clientIp?: string | null): string {
    if (userId && userId.trim()) {
      return `user:${userId.trim()}`
    }
    return `ip:${clientIp || '127.0.0.1'}`
  }

  public getUsage(identifier: string): number {
    const today = getVietnamTodayKey()
    const record = this.usage.get(identifier)
    if (!record || record.date !== today) {
      return 0
    }
    return record.count
  }

  public recordSend(identifier: string): number {
    const today = getVietnamTodayKey()
    const current = this.getUsage(identifier)
    const newCount = current + 1

    this.usage.set(identifier, {
      count: newCount,
      date: today,
      lastSentAt: Date.now(),
    })

    return newCount
  }

  public canSend(identifier: string, isUnlimited: boolean): boolean {
    if (isUnlimited) {
      return true
    }
    // Gói free: Chỉ được 1 lần / ngày
    return this.getUsage(identifier) < 1
  }

  public resetForTesting(identifier: string): void {
    this.usage.delete(identifier)
  }
}

// Global Singleton để giữ state xuyên suốt các server request trong runtime
const globalSupportQuota = globalThis as unknown as {
  __supportQuotaTracker?: SupportQuotaTracker
}

export const supportQuotaTracker =
  globalSupportQuota.__supportQuotaTracker || new SupportQuotaTracker()

if (process.env.NODE_ENV !== 'production') {
  globalSupportQuota.__supportQuotaTracker = supportQuotaTracker
}

