# Cache System Documentation

## Overview

This project implements a comprehensive caching system using Supabase to optimize VidTao API calls and improve user experience. The system uses background processing with client-side polling to handle long-running API requests while avoiding Cloudflare Edge timeout issues.

## Architecture

### Components

1. **Supabase Cache Manager** (`lib/supabase-cache.ts`)
   - Core cache management with database operations
   - Hash-based cache key generation
   - Expiration and cleanup logic

2. **API Routes** (`app/api/search/`)
   - Cache-first approach
   - Background job processing
   - Timeout handling with AbortController

3. **Client Hooks** (`hooks/use-cache-polling.ts`)
   - Real-time cache status polling
   - Loading state management
   - Error handling

4. **Database Schema** (`supabase-migration.sql`)
   - Optimized table structure
   - Proper indexing
   - Cleanup functions

### Flow Diagram

```
Client Request → Check Cache → Cache Hit? → Return Data
                      ↓
                 Cache Miss → Create Pending Entry
                      ↓
                Background Job → VidTao API → Update Cache
                      ↓
                Client Polling → Check Status → Return When Complete
```

## Database Schema

### search_cache Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| cache_key | TEXT | Base cache identifier (endpoint type) |
| payload_hash | TEXT | Hash of search parameters |
| endpoint | TEXT | API endpoint identifier |
| status | TEXT | pending, completed, or error |
| data | JSONB | Cached response data |
| error_message | TEXT | Error details if status is error |
| created_at | TIMESTAMP | Entry creation time |
| completed_at | TIMESTAMP | Completion time |
| expires_at | TIMESTAMP | Expiration time (24 hours) |

### Indexes

- `idx_search_cache_unique`: Unique constraint on (cache_key, payload_hash)
- `idx_search_cache_status`: Fast status filtering
- `idx_search_cache_endpoint`: Endpoint-based queries
- `idx_search_cache_expires`: Cleanup operations
- `idx_search_cache_created`: Recent entries first

## API Routes

### QuickSearch API (`/api/search/quicksearch`)

```typescript
POST /api/search/quicksearch
Content-Type: application/json

{
  "keyword": "nike",
  "sort": "latest",
  "limit": 50
}
```

**Response (Cache Hit):**
```json
{
  "ads": [...],
  "total": 150,
  "cached": true
}
```

**Response (Cache Miss):**
```json
{
  "status": "pending",
  "cacheId": "uuid-here",
  "message": "Search in progress..."
}
```

### MKT Search API (`/api/search/mkt`)

```typescript
POST /api/search/mkt
Content-Type: application/json

{
  "type": "ads", // "ads" | "brands" | "companies"
  "keyword": "coca cola",
  "filters": {...}
}
```

Similar response structure to QuickSearch.

### Cache Status API (`/api/cache/status`)

```typescript
GET /api/cache/status?cacheId=uuid-here
```

**Response:**
```json
{
  "status": "completed",
  "data": {...},
  "completedAt": "2024-01-15T10:30:00Z"
}
```

## Client Hooks

### useQuickSearchWithCache

```typescript
import { useQuickSearchWithCache } from '@/hooks/use-cache-polling'

function QuickSearchComponent() {
  const { searchWithCache, loading, data, error, status } = useQuickSearchWithCache()
  
  const handleSearch = async (params) => {
    try {
      const result = await searchWithCache(params)
      if (result.pending) {
        // Polling will automatically start
        console.log('Search in progress...')
      } else {
        // Direct result from cache
        console.log('Results:', result.data)
      }
    } catch (error) {
      console.error('Search failed:', error)
    }
  }
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      {data && <div>Results: {data.ads?.length}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  )
}
```

### useMKTSearchWithCache

Similar to QuickSearch but with longer polling intervals for complex searches.

## Configuration

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# VidTao API Configuration
VIDTAO_API_KEY=your-vidtao-key
VIDTAO_BASE_URL=https://api.vidtao.com
```

### Cache Settings

- **Default Expiration:** 24 hours
- **Polling Intervals:**
  - QuickSearch: 2 seconds (max 3 minutes)
  - MKT Search: 3 seconds (max 5 minutes)
- **Background Job Timeout:** 30 seconds

## Deployment

### 1. Database Setup

Run the migration file in your Supabase SQL editor:

```sql
-- Execute supabase-migration.sql
```

### 2. Environment Configuration

Set up all required environment variables in your deployment platform.

### 3. Monitoring

Use the built-in functions to monitor cache performance:

```sql
-- View cache statistics
SELECT * FROM get_cache_stats();

-- Clean up expired entries manually
SELECT cleanup_expired_cache();
```

## Performance Benefits

1. **Reduced API Calls:** Cache hits eliminate unnecessary VidTao requests
2. **Faster Response Times:** Cached results return instantly
3. **Better UX:** Background processing prevents timeout errors
4. **Cost Optimization:** Fewer external API calls reduce costs

## Troubleshooting

### Common Issues

1. **Polling Not Working**
   - Check network connectivity
   - Verify cacheId is correct
   - Check browser console for errors

2. **Cache Not Updating**
   - Verify service role permissions
   - Check background job execution
   - Review error logs

3. **High Database Usage**
   - Ensure cleanup function is running
   - Adjust cache expiration times
   - Monitor cache hit rates

### Debug Commands

```typescript
// Check cache entry manually
const entry = await supabaseCacheManager.getCacheEntry('quicksearch', payloadHash)

// Force cache cleanup
await supabaseCacheManager.cleanupExpiredEntries()

// View recent errors
SELECT * FROM search_cache WHERE status = 'error' ORDER BY created_at DESC LIMIT 10;
```

## Future Enhancements

1. **Cache Warming:** Pre-populate cache with popular searches
2. **Smart Expiration:** Dynamic TTL based on search popularity  
3. **Metrics Dashboard:** Real-time cache performance monitoring
4. **Cache Invalidation:** Manual cache clearing for specific searches
5. **Compression:** Store compressed JSON for large responses

## Security Considerations

- Row Level Security (RLS) enabled on cache table
- Service role key properly secured
- No sensitive data stored in cache
- Automatic cleanup prevents data accumulation