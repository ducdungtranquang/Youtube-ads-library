'use client'

import { useState, useEffect } from 'react'
import { useCacheStatus } from '@/hooks/use-cache-status'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Trash2, Activity, Database, Clock, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

export function CacheStatusCard() {
  const { stats, loading, error, fetchStats, clearCache } = useCacheStatus()
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    // Fetch initial stats
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchStats()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, fetchStats])

  const handleClearCache = async (type: 'all' | 'ads' | 'offers') => {
    const result = await clearCache(type)
    
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.error || 'Failed to clear cache')
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const getHitRateColor = (hitRate: number) => {
    if (hitRate >= 80) return 'bg-green-500'
    if (hitRate >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center py-4">
            <Activity className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
            <Button 
              onClick={fetchStats}
              variant="outline"
              size="sm"
              className="mt-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Cache Status
            </CardTitle>
            <CardDescription>
              VidTao API request cache statistics
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
            >
              <Activity className="h-4 w-4 mr-2" />
              Auto Refresh
            </Button>
            <Button
              onClick={fetchStats}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats ? (
          <>
            {/* Cache Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(stats.totalRequests)}
                </div>
                <div className="text-sm text-muted-foreground">Total Requests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(stats.cacheHits)}
                </div>
                <div className="text-sm text-muted-foreground">Cache Hits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatNumber(stats.cacheMisses)}
                </div>
                <div className="text-sm text-muted-foreground">Cache Misses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatNumber(stats.cacheSize)}
                </div>
                <div className="text-sm text-muted-foreground">Cache Size</div>
              </div>
            </div>

            {/* Hit Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Hit Rate
                </span>
                <Badge variant="secondary">
                  {stats.hitRate.toFixed(1)}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getHitRateColor(stats.hitRate)}`}
                  style={{ width: `${stats.hitRate}%` }}
                />
              </div>
            </div>

            {/* Cache Info */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-medium">TTL:</span>
                <span>8 hours</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4" />
                <span className="font-medium">Auto Cleanup:</span>
                <span>Every 2 hours</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4" />
                <span className="font-medium">Cache Types:</span>
                <span>Ads, Offers</span>
              </div>
            </div>

            {/* Clear Cache Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button
                onClick={() => handleClearCache('all')}
                variant="destructive"
                size="sm"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              <Button
                onClick={() => handleClearCache('ads')}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Ads
              </Button>
              <Button
                onClick={() => handleClearCache('offers')}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Offers
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading cache statistics...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}