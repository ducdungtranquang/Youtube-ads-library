'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Client-side OAuth callback handler.
// Supabase JS v2 with PKCE stores the code_verifier in localStorage (client-side only).
// This page lets the browser pick up the ?code= from the URL and exchange it via
// supabase.auth.exchangeCodeForSession(), which has access to the stored verifier.
export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) return
    hasProcessed.current = true

    const handleCallback = async () => {
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')
      const code = searchParams.get('code')

      // Handle provider-level errors (e.g. user denied consent)
      if (error) {
        toast.error(errorDescription ?? 'Đăng nhập Google thất bại')
        router.replace('/login')
        return
      }

      if (code) {
        const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          toast.error('Không thể xác thực. Vui lòng thử lại.')
          router.replace('/login')
          return
        }

        // Đảm bảo user_profiles luôn tồn tại ngay sau khi đăng nhập Google thành công
        if (exchangeData?.user) {
          try {
            await fetch('/api/user/sync-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: exchangeData.user.id,
                email: exchangeData.user.email,
                fullName: exchangeData.user.user_metadata?.full_name || exchangeData.user.user_metadata?.name || '',
                referredBy: exchangeData.user.user_metadata?.referred_by || null,
              }),
            })
          } catch (e) {
            console.warn('Sync profile on Google OAuth error:', e)
          }
        }

        // Session is now set - onAuthStateChange in AuthProvider will fire SIGNED_IN
        // but since we're not on /login or /register, we redirect manually
        toast.success('Đăng nhập thành công!')
        router.replace('/dashboard')
        return
      }

      // No code - something went wrong
      router.replace('/login')
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#EA4335] opacity-20 blur-xl animate-pulse" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-700">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-base font-medium text-white">Đang xác thực với Google...</p>
        <p className="text-sm text-slate-400">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  )
}
