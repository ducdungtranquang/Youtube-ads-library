import crypto from "crypto";

export interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

export interface CacheStats {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  size: number;
  maxSize: number;
  ttlHours: number;
  provider: "memory" | "upstash-redis" | "hybrid";
}

/**
 * 10 giờ TTL tính bằng mili-giây
 * 10 giờ = 10 * 60 * 60 * 1000 = 36,000,000 ms
 */
export const FACEBOOK_ADS_CACHE_TTL_MS = 10 * 60 * 60 * 1000;
const MAX_LRU_ENTRIES = 1500;

class FacebookAdsCacheService {
  // L1 In-Memory LRU Map: giữ cho Next.js Node process truy xuất siêu tốc (< 1ms)
  private memoryStore = new Map<string, CacheEntry<any>>();

  private stats = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
  };

  private upstashUrl: string | null = null;
  private upstashToken: string | null = null;

  constructor() {
    this.upstashUrl = process.env.UPSTASH_REDIS_REST_URL || null;
    this.upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN || null;

    // Định kỳ dọn dẹp các key quá hạn mỗi 1 giờ để tối ưu RAM
    if (typeof setInterval !== "undefined") {
      setInterval(() => {
        this.cleanupExpired();
      }, 60 * 60 * 1000);
    }
  }

  /**
   * Tạo Cache Key chuẩn hóa từ URL search parameters
   * Sắp xếp alphabet các params để đảm bảo cùng filter ra đúng 1 cache key duy nhất
   */
  public createSearchKey(searchParams: URLSearchParams | Record<string, any>): string {
    const paramsObj: Record<string, string> = {};

    if (searchParams instanceof URLSearchParams) {
      searchParams.forEach((val, key) => {
        const trimmed = val.trim();
        if (trimmed !== "" && trimmed !== "undefined" && trimmed !== "null") {
          paramsObj[key] = trimmed;
        }
      });
    } else {
      Object.keys(searchParams).forEach((key) => {
        const val = searchParams[key];
        if (val !== undefined && val !== null && String(val).trim() !== "") {
          paramsObj[key] = String(val).trim();
        }
      });
    }

    // Đảm bảo limit luôn được chuẩn hóa tối đa 20 items/page
    if (paramsObj.limit) {
      const parsedLimit = Math.min(Math.max(parseInt(paramsObj.limit, 10) || 20, 1), 20);
      paramsObj.limit = String(parsedLimit);
    } else {
      paramsObj.limit = "20";
    }

    const sortedKeys = Object.keys(paramsObj).sort();
    const normalizedQuery = sortedKeys.map((k) => `${k}=${paramsObj[k]}`).join("&");
    const hash = crypto.createHash("sha256").update(normalizedQuery).digest("hex").slice(0, 24);

    return `fb:search:${hash}`;
  }

  /**
   * Tạo Cache Key cho truy vấn Ads theo Page Facebook
   */
  public createPageAdsKey(pageName: string, page: number = 1, limit: number = 20, exclude?: string): string {
    const safeLimit = Math.min(Math.max(limit, 1), 20);
    const cleanName = encodeURIComponent(pageName.trim().toLowerCase());
    const excludePart = exclude ? `:exc_${encodeURIComponent(exclude.trim())}` : "";
    return `fb:page:${cleanName}:p_${page}:l_${safeLimit}${excludePart}`;
  }

  /**
   * Tạo Cache Key cho truy vấn Similar Ads của 1 ad
   */
  public createSimilarAdsKey(id: string, page: number = 1, limit: number = 15): string {
    const cleanId = encodeURIComponent(String(id).trim());
    return `fb:similar:${cleanId}:p_${page}:l_${limit}`;
  }

  /**
   * Lấy dữ liệu từ Cache (Kiểm tra L1 Memory -> L2 Upstash Redis nếu có)
   */
  public async get<T>(key: string): Promise<CacheEntry<T> | null> {
    this.stats.totalRequests++;

    // 1. Kiểm tra L1 Memory Store
    const memEntry = this.memoryStore.get(key);
    if (memEntry) {
      if (Date.now() < memEntry.expiresAt) {
        // Cập nhật LRU: đưa key lên cuối Map
        this.memoryStore.delete(key);
        this.memoryStore.set(key, memEntry);

        this.stats.cacheHits++;
        return memEntry;
      } else {
        this.memoryStore.delete(key);
      }
    }

    // 2. Kiểm tra L2 Redis (nếu có Upstash REST URL)
    if (this.upstashUrl && this.upstashToken) {
      try {
        const res = await fetch(`${this.upstashUrl}/get/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${this.upstashToken}` },
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.result) {
            const parsed: CacheEntry<T> = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
            if (parsed && Date.now() < parsed.expiresAt) {
              // Lưu lại L1 Memory để các request sau phản hồi 0ms
              this.setMemory(key, parsed);
              this.stats.cacheHits++;
              return parsed;
            }
          }
        }
      } catch (redisErr) {
        console.warn("[Cache] Không thể kết nối Upstash Redis:", (redisErr as Error).message);
      }
    }

    this.stats.cacheMisses++;
    return null;
  }

  /**
   * Lưu dữ liệu vào Cache với TTL 10 giờ
   */
  public async set<T>(key: string, data: T, ttlMs: number = FACEBOOK_ADS_CACHE_TTL_MS): Promise<void> {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      cachedAt: now,
      expiresAt: now + ttlMs,
    };

    // 1. Ghi vào L1 Memory Store (áp dụng giới hạn LRU)
    this.setMemory(key, entry);

    // 2. Ghi vào L2 Redis (nếu có Upstash REST URL)
    if (this.upstashUrl && this.upstashToken) {
      try {
        const ttlSeconds = Math.ceil(ttlMs / 1000);
        await fetch(
          `${this.upstashUrl}/set/${encodeURIComponent(key)}?ex=${ttlSeconds}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.upstashToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(entry),
          }
        );
      } catch (redisErr) {
        console.warn("[Cache] Không thể ghi Upstash Redis:", (redisErr as Error).message);
      }
    }
  }

  /**
   * Ghi vào L1 Memory với chính sách đẩy phần tử cũ nhất (LRU Eviction)
   */
  private setMemory<T>(key: string, entry: CacheEntry<T>): void {
    if (this.memoryStore.has(key)) {
      this.memoryStore.delete(key);
    } else if (this.memoryStore.size >= MAX_LRU_ENTRIES) {
      // Xóa phần tử đầu tiên (ít được dùng nhất - Least Recently Used)
      const oldestKey = this.memoryStore.keys().next().value;
      if (oldestKey) {
        this.memoryStore.delete(oldestKey);
      }
    }
    this.memoryStore.set(key, entry);
  }

  /**
   * Dọn dẹp các cache entry đã hết hạn
   */
  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.memoryStore.entries()) {
      if (now >= entry.expiresAt) {
        this.memoryStore.delete(key);
      }
    }
  }

  /**
   * Xóa toàn bộ Cache
   */
  public clear(): void {
    this.memoryStore.clear();
  }

  /**
   * Thống kê Cache
   */
  public getStats(): CacheStats {
    const total = this.stats.totalRequests;
    const hitRate = total > 0 ? (this.stats.cacheHits / total) * 100 : 0;

    return {
      totalRequests: total,
      cacheHits: this.stats.cacheHits,
      cacheMisses: this.stats.cacheMisses,
      hitRate: Math.round(hitRate * 10) / 10,
      size: this.memoryStore.size,
      maxSize: MAX_LRU_ENTRIES,
      ttlHours: 10,
      provider: this.upstashUrl ? "hybrid" : "memory",
    };
  }
}

// Global Singleton instance (giữ cache qua các lần Next.js reload trong môi trường dev)
const globalCache = globalThis as unknown as {
  __facebookAdsCache?: FacebookAdsCacheService;
};

export const facebookAdsCache =
  globalCache.__facebookAdsCache || new FacebookAdsCacheService();

if (process.env.NODE_ENV !== "production") {
  globalCache.__facebookAdsCache = facebookAdsCache;
}
