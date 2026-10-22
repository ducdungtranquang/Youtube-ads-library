import { useState, useCallback } from 'react'

export interface VideoDetails {
  ytVideoId: string
  swiped?: boolean
  channelId?: string
  title: string
  description?: string
  duration?: number
  thumbnail?: string
  brandId?: number
  brandName?: string
  publishedAt?: string
  totalSpend?: number
  last30Days?: number
  isActive?: boolean
  firstSeen?: string
  lastSeen?: string | null
  spend?: Array<{
    date: string
    spend: number
  }>
  categoryId?: number | null
  clickUrls?: string[]
  landingPage?: string | null
  landingPages?: string[]
  transcript?: string | null
}

interface UseVideoDetailsReturn {
  videoDetails: VideoDetails | null
  loading: boolean
  error: string | null
  fetchVideoDetails: (videoId: string) => Promise<void>
}

export function useVideoDetails(): UseVideoDetailsReturn {
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVideoDetails = useCallback(async (videoId: string) => {
    if (!videoId) {
      setError('Video ID is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/videos/${videoId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch video details')
      }

      if (result.success && result.data) {
        const raw = result.data.data || result.data
        const clickUrls: string[] = Array.isArray(raw.clickUrls)
          ? raw.clickUrls.filter((u: unknown): u is string => typeof u === 'string' && u.trim().length > 0)
          : (typeof raw.clickUrl === 'string' && raw.clickUrl.trim() ? [raw.clickUrl.trim()] : [])

        const landingPage: string | null = raw.landingPage || (clickUrls.length > 0 ? clickUrls[0] : null)
        const transcript: string | null = typeof raw.transcript === 'string' && raw.transcript.trim()
          ? raw.transcript.trim()
          : null

        setVideoDetails({
          ...raw,
          clickUrls,
          landingPage,
          landingPages: clickUrls,
          transcript,
        })
      } else {
        throw new Error(result.error || 'No video data received')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Video details fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    videoDetails,
    loading,
    error,
    fetchVideoDetails
  }
}