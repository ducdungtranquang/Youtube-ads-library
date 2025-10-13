interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheStats {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    hitRate: 0
  };

  // Cache TTL mặc định: 8 giờ (để tối ưu VidTao requests)
  private defaultTTL = 8 * 60 * 60 * 1000;

  /**
   * Tạo cache key từ search parameters
   */
  private createCacheKey(type: 'ads' | 'offers', params: Record<string, any>): string {
    // Sắp xếp params để đảm bảo key nhất quán
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as Record<string, any>);

    return `${type}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Get dữ liệu từ cache
   */
  get<T>(type: 'ads' | 'offers', params: Record<string, any>): T | null {
    this.stats.totalRequests++;
    
    const key = this.createCacheKey(type, params);
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.cacheMisses++;
      this.updateHitRate();
      return null;
    }

    // Kiểm tra expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.cacheMisses++;
      this.updateHitRate();
      return null;
    }

    this.stats.cacheHits++;
    this.updateHitRate();
    
    console.log(`[Cache HIT] ${key}`);
    return entry.data;
  }

  /**
   * Set dữ liệu vào cache
   */
  set<T>(type: 'ads' | 'offers', params: Record<string, any>, data: T, ttl?: number): void {
    const key = this.createCacheKey(type, params);
    const now = Date.now();
    const expirationTime = ttl || this.defaultTTL;

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + expirationTime
    };

    this.cache.set(key, entry);
    console.log(`[Cache SET] ${key} (TTL: ${expirationTime}ms)`);
  }

  /**
   * Xóa cache entries hết hạn
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[Cache CLEANUP] Removed ${cleanedCount} expired entries`);
    }
  }

  /**
   * Xóa toàn bộ cache
   */
  clear(): void {
    this.cache.clear();
    console.log('[Cache CLEAR] All cache cleared');
  }

  /**
   * Xóa cache theo pattern
   */
  clearByType(type: 'ads' | 'offers'): void {
    let deletedCount = 0;
    
    for (const [key] of this.cache.entries()) {
      if (key.startsWith(`${type}:`)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    console.log(`[Cache CLEAR] Removed ${deletedCount} ${type} entries`);
  }

  /**
   * Cập nhật hit rate
   */
  private updateHitRate(): void {
    this.stats.hitRate = this.stats.totalRequests > 0 
      ? (this.stats.cacheHits / this.stats.totalRequests) * 100 
      : 0;
  }

  /**
   * Lấy thống kê cache
   */
  getStats(): CacheStats & { cacheSize: number } {
    this.cleanup(); // Cleanup trước khi trả stats
    
    return {
      ...this.stats,
      cacheSize: this.cache.size
    };
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Kiểm tra cache có key không
   */
  has(type: 'ads' | 'offers', params: Record<string, any>): boolean {
    const key = this.createCacheKey(type, params);
    const entry = this.cache.get(key);
    
    if (!entry) return false;
    
    // Kiểm tra expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Auto cleanup mỗi 2 giờ (phù hợp với cache dài hạn)
   */
  private startAutoCleanup(): void {
    setInterval(() => {
      this.cleanup();
    }, 2 * 60 * 60 * 1000); // 2 giờ
  }

  constructor() {
    this.startAutoCleanup();
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

// Export types
export type { CacheStats };