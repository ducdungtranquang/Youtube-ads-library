"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useFavorites, scheduleFavoriteCheck, addFavoriteChangeListener, removeFavoriteChangeListener } from '@/hooks/use-favorites'
import { useAuth } from '@/contexts/auth-context'
import { 
  FavoriteType,
  VideoFavoriteData,
  OfferFavoriteData,
  AffiliateFavoriteData,
  BrandFavoriteData,
  CompanyFavoriteData
} from '@/lib/favorites'

import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FavoriteButtonProps {
  itemType: FavoriteType
  itemId: string
  itemData: VideoFavoriteData | OfferFavoriteData | AffiliateFavoriteData | BrandFavoriteData | CompanyFavoriteData | any // allow facebook ad data
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'default' | 'lg'
  showText?: boolean
  className?: string
  onToggle?: (isFavorited: boolean) => void
}

export function FavoriteButton({
  itemType,
  itemId,
  itemData,
  variant = 'ghost',
  size = 'default',
  showText = false,
  className,
  onToggle
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const { toggleFavorite, loading } = useFavorites()
  const { user } = useAuth()

  // Check initial favorite status using batched scheduler
  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setIsChecking(false)
        return
      }
      
      setIsChecking(true)
      const favorited = await scheduleFavoriteCheck({ type: itemType, id: itemId })
      setIsFavorited(favorited)
      setIsChecking(false)
    }

    checkStatus()
  }, [itemType, itemId, user])

  // Subscribe to favorite change events
  useEffect(() => {
    if (!user) return

    const handleFavoriteChange = (type: FavoriteType, id: string, isFavorited: boolean) => {
      // Only update if this is the relevant item
      if (type === itemType && id === itemId) {
        setIsFavorited(isFavorited)
      }
    }

    addFavoriteChangeListener(handleFavoriteChange)

    return () => {
      removeFavoriteChangeListener(handleFavoriteChange)
    }
  }, [itemType, itemId, user])

  const handleToggle = async (e: React.MouseEvent) => {
    // Prevent event bubbling to parent card click handler
    e.stopPropagation()
    e.preventDefault()
    
    if (!user) {
      toast.error('Bạn cần đăng nhập để sử dụng tính năng yêu thích')
      return
    }

    const newStatus = await toggleFavorite(itemType, itemId, itemData)
    setIsFavorited(newStatus)
    onToggle?.(newStatus)
  }

  const isLoading = loading || isChecking

  return (
    <div onClick={handleToggle} className="inline-flex">
      <Button
        variant={variant}
        size={size}
        disabled={isLoading}
        className={cn(
          'transition-colors',
          isFavorited && 'text-red-500 hover:text-red-600',
          className
        )}
      >
        <Heart 
          className={cn(
            'h-4 w-4',
            showText && 'mr-2',
            isFavorited && 'fill-current'
          )} 
        />
        {showText && (isFavorited ? 'Đã yêu thích' : 'Yêu thích')}
      </Button>
    </div>
  )
}