'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

interface GoogleAuthButtonProps {
  mode?: 'login' | 'register'
  className?: string
  disabled?: boolean
  onBeforeAuth?: () => boolean
}

export function GoogleAuthButton({ mode = 'login', className, disabled, onBeforeAuth }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithOAuth } = useAuth()

  const handleGoogleAuth = async () => {
    if (onBeforeAuth && !onBeforeAuth()) {
      return
    }
    setIsLoading(true)
    try {
      if (typeof window !== 'undefined') {
        const storedRef = localStorage.getItem('ads_spy_ref')
        if (storedRef) {
          document.cookie = `ads_spy_ref=${encodeURIComponent(storedRef)}; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax`
        }
      }
      const { error } = await signInWithOAuth('google')
      if (error) {
        toast.error(error.message || `${mode === 'login' ? 'Đăng nhập' : 'Đăng ký'} bằng Google thất bại`)
        setIsLoading(false)
      }
    } catch {
      toast.error('Đã xảy ra lỗi không mong muốn')
      setIsLoading(false)
    }
  }

  const label = mode === 'login' ? 'Tiếp tục với Google' : 'Đăng ký với Google'

  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full h-11 font-semibold text-sm bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-800 shadow-xs transition-all duration-150 rounded-xl cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2.5 focus-visible:ring-2 focus-visible:ring-indigo-600/20 ${className ?? ''}`}
      onClick={handleGoogleAuth}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
          <span className="text-slate-700">Đang kết nối Google...</span>
        </>
      ) : (
        <>
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="font-semibold text-slate-800">{label}</span>
        </>
      )}
    </Button>
  )
}
