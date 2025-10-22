"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFavorites } from '@/hooks/use-favorites'
import { useAuth } from '@/contexts/auth-context'
import { VideoFavoriteData } from '@/lib/favorites'

export function FavoritesDebug() {
  const [result, setResult] = useState<string>('')
  const { toggleFavorite, getFavoritesCounts, checkIsFavorited } = useFavorites()
  const { user } = useAuth()

  const testVideo: VideoFavoriteData = {
    title: 'Test Video for Favorites',
    channel: 'Test Channel',
    views: '1000',
    ctr: '5%',
    date: '2024-01-01',
    thumbnail: '/placeholder.svg',
    ytVideoId: 'test-video-123'
  }

  const handleToggle = async () => {
    try {
      const result = await toggleFavorite('video', 'test-video-123', testVideo)
      setResult(`Toggle result: ${result}`)
    } catch (error: any) {
      setResult(`Error: ${error.message}`)
    }
  }

  const handleCheck = async () => {
    try {
      const result = await checkIsFavorited('video', 'test-video-123')
      setResult(`Is favorited: ${result}`)
    } catch (error: any) {
      setResult(`Error: ${error.message}`)
    }
  }

  const handleCounts = async () => {
    try {
      const result = await getFavoritesCounts()
      setResult(`Counts: ${JSON.stringify(result, null, 2)}`)
    } catch (error: any) {
      setResult(`Error: ${error.message}`)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Favorites Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please login to test favorites</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorites Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={handleToggle}>Toggle Favorite</Button>
          <Button onClick={handleCheck}>Check Status</Button>
          <Button onClick={handleCounts}>Get Counts</Button>
        </div>
        {result && (
          <pre className="bg-muted p-4 rounded text-sm overflow-auto">
            {result}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}