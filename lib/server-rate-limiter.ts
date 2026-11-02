import { NextRequest, NextResponse } from "next/server";

export interface RateLimitConfig {
  windowMs?: number;      // Khoảng thời gian tính (mili-giây), mặc định 60s
  maxRequests?: number;   // Số request tối đa trong window, mặc định 30
  prefix?: string;        // Phân loại API (ví dụ: 'fb-search', 'page-ads', 'ad-detail')
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;      // Epoch timestamp (giây) khi cửa sổ reset
  retryAfter: number;     // Số giây cần chờ trước khi thử lại
}

interface ClientBucket {
  timestamps: number[];
  lastSeen: number;
}

class ServerRateLimiterService {
  private buckets = new Map<string, ClientBucket>();
  private lastCleanup = Date.now();

  constructor() {
    // Tự động dọn dẹp các bucket cũ sau mỗi 2 phút
    if (typeof setInterval !== "undefined") {
      setInterval(() => {
        this.cleanup();
      }, 2 * 60 * 1000);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 phút không hoạt động
    for (const [key, bucket] of this.buckets.entries()) {
      if (now - bucket.lastSeen > maxAge) {
        this.buckets.delete(key);
      }
    }
    this.lastCleanup = now;
  }

  public getClientIp(request: NextRequest): string {
    const cfIp = request.headers.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();

    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();

    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();

    return "127.0.0.1";
  }

  public check(request: NextRequest, config: RateLimitConfig = {}): RateLimitResult {
    const windowMs = config.windowMs || 60 * 1000;
    const maxRequests = config.maxRequests || 30;
    const prefix = config.prefix || "global";

    const ip = this.getClientIp(request);
    const authHeader = request.headers.get("authorization");
    // Nhận diện theo IP và token (nếu có)
    const tokenPart = authHeader?.startsWith("Bearer ") ? authHeader.slice(7, 24) : "";
    const key = `${prefix}:${ip}${tokenPart ? `:${tokenPart}` : ""}`;

    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = { timestamps: [now], lastSeen: now };
      this.buckets.set(key, bucket);
      return {
        allowed: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        resetTime: Math.ceil((now + windowMs) / 1000),
        retryAfter: 0,
      };
    }

    bucket.lastSeen = now;
    // Lọc bỏ các timestamp nằm ngoài sliding window
    const windowStart = now - windowMs;
    bucket.timestamps = bucket.timestamps.filter((ts) => ts > windowStart);

    if (bucket.timestamps.length >= maxRequests) {
      const oldestInWindow = bucket.timestamps[0];
      const retryAfterMs = Math.max(oldestInWindow + windowMs - now, 1000);
      const retryAfterSec = Math.ceil(retryAfterMs / 1000);

      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        resetTime: Math.ceil((oldestInWindow + windowMs) / 1000),
        retryAfter: retryAfterSec,
      };
    }

    bucket.timestamps.push(now);
    return {
      allowed: true,
      limit: maxRequests,
      remaining: Math.max(maxRequests - bucket.timestamps.length, 0),
      resetTime: Math.ceil((now + windowMs) / 1000),
      retryAfter: 0,
    };
  }

  public createTooManyRequestsResponse(result: RateLimitResult): NextResponse {
    return NextResponse.json(
      {
        success: false,
        message: `Bạn đang gửi yêu cầu quá nhanh để bảo vệ hệ thống khỏi crawl tự động. Vui lòng chờ ${result.retryAfter}s trước khi gửi tiếp.`,
        error: "Rate limit exceeded",
        retry_after: result.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(result.retryAfter),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(result.resetTime),
        },
      }
    );
  }

  public applyHeaders(response: NextResponse, result: RateLimitResult): NextResponse {
    response.headers.set("X-RateLimit-Limit", String(result.limit));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    response.headers.set("X-RateLimit-Reset", String(result.resetTime));
    return response;
  }
}

// Global Singleton instance
const globalLimiter = globalThis as unknown as {
  __serverRateLimiter?: ServerRateLimiterService;
};

export const serverRateLimiter =
  globalLimiter.__serverRateLimiter || new ServerRateLimiterService();

if (process.env.NODE_ENV !== "production") {
  globalLimiter.__serverRateLimiter = serverRateLimiter;
}
