'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string, referredBy?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  changePassword: (newPassword: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  const syncUserProfile = async (targetUser: User | null, referredBy?: string) => {
    if (!targetUser?.id) return
    try {
      await fetch('/api/user/sync-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUser.id,
          email: targetUser.email,
          fullName: targetUser.user_metadata?.full_name || targetUser.user_metadata?.name || '',
          referredBy: referredBy || targetUser.user_metadata?.referred_by || null,
        }),
      })
    } catch (err) {
      console.warn('Failed to sync user profile:', err)
    }
  }

  useEffect(() => {
    setIsClient(true)
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) {
        syncUserProfile(session.user)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === 'SIGNED_IN') {
        if (session?.user) {
          syncUserProfile(session.user)
        }
        // Redirect về dashboard nếu user đang ở trang login/register
        if (typeof window !== 'undefined') {
          const authPages = ['/login', '/register']
          const isOnAuthPage = authPages.some(page => window.location.pathname.startsWith(page))
          if (isOnAuthPage) {
            router.push('/dashboard')
          }
        }
      } else if (event === 'SIGNED_OUT') {
        // Redirect to home after sign out
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signUp = async (email: string, password: string, fullName?: string, referredBy?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          referred_by: referredBy,
        },
      },
    })
    if (!error && data?.user) {
      syncUserProfile(data.user, referredBy)
    }
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error && data?.user) {
      syncUserProfile(data.user)
    }
    return { error }
  }

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : '/auth/callback'
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        // Request profile scopes to get avatar and name
        scopes: provider === 'google' ? 'openid email profile' : undefined,
      },
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/reset-password`
      : '/reset-password'
      
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
    return { error }
  }

  const changePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    changePassword,
  }

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}