import { useState, useCallback } from 'react'

export interface VideoDetails {
  ytVideoId: string
  realYtVideoId?: string
  token?: string
  url?: string
  isRevealed?: boolean
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
  isRevealing: boolean
  error: string | null
  fetchVideoDetails: (videoId: string) => Promise<void>
  revealVideoId: (token: string) => Promise<string | null>
}

export function useVideoDetails(): UseVideoDetailsReturn {
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const revealVideoId = useCallback(async (token: string): Promise<string | null> => {
    if (!token) return null
    // If already real YouTube ID
    if (!token.startsWith('v_') && /^[a-zA-Z0-9_-]{11}$/.test(token)) {
      return token
    }

    setIsRevealing(true)
    try {
      const response = await fetch('/api/videos/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      const data = await response.json()
      if (data.success && data.ytVideoId) {
        const realId = data.ytVideoId
        setVideoDetails((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            ytVideoId: realId,
            realYtVideoId: realId,
            url: data.url || `https://youtube.com/watch?v=${realId}`,
            isRevealed: true
          }
        })
        return realId
      }
      return null
    } catch (err) {
      console.error('Error in revealVideoId:', err)
      return null
    } finally {
      setIsRevealing(false)
    }
  }, [])

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

        const currentYtId: string = raw.ytVideoId || raw.realYtVideoId || videoId
        const isMasked = currentYtId.startsWith('v_') || currentYtId.length > 11

        setVideoDetails({
          ...raw,
          ytVideoId: currentYtId,
          realYtVideoId: raw.realYtVideoId || (!isMasked ? currentYtId : undefined),
          token: raw.token || (isMasked ? currentYtId : undefined),
          url: raw.url || (!isMasked ? `https://youtube.com/watch?v=${currentYtId}` : undefined),
          isRevealed: !isMasked || Boolean(raw.realYtVideoId),
          clickUrls,
          landingPage,
          landingPages: clickUrls,
          transcript,
        })

        // If still masked after fetch, do a fallback reveal
        if (isMasked && !raw.realYtVideoId) {
          revealVideoId(currentYtId)
        }
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
  }, [revealVideoId])

  return {
    videoDetails,
    loading,
    isRevealing,
    error,
    fetchVideoDetails,
    revealVideoId
  }
}