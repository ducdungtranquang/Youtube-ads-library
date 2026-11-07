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

// Deduplication và tracking in-flight sync profile ở cấp client/session
const syncedUserIds = new Set<string>()
const inFlightSyncs = new Map<string, Promise<void>>()

function isUserSyncedInSession(userId: string): boolean {
  if (syncedUserIds.has(userId)) return true
  if (typeof window !== 'undefined') {
    try {
      return sessionStorage.getItem(`synced_profile_${userId}`) === 'true'
    } catch {
      return false
    }
  }
  return false
}

function markUserSyncedInSession(userId: string): void {
  syncedUserIds.add(userId)
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(`synced_profile_${userId}`, 'true')
    } catch {}
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  const syncUserProfile = async (targetUser: User | null, referredBy?: string, provider?: string) => {
    if (!targetUser?.id) return

    // Tránh gọi lặp nhiều lần cho cùng 1 user trong cùng một phiên browser
    if (!referredBy && isUserSyncedInSession(targetUser.id)) {
      return
    }

    // Nếu đang có 1 request sync chạy dở cho user này, đợi request đó (tránh race condition)
    if (inFlightSyncs.has(targetUser.id)) {
      return await inFlightSyncs.get(targetUser.id)
    }

    const syncPromise = (async () => {
      try {
        await fetch('/api/user/sync-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: targetUser.id,
            email: targetUser.email,
            fullName: targetUser.user_metadata?.full_name || targetUser.user_metadata?.name || '',
            referredBy: referredBy || targetUser.user_metadata?.referred_by || null,
            provider: provider || (targetUser as any).app_metadata?.provider || (targetUser as any).identities?.[0]?.provider || 'email',
          }),
        })
        markUserSyncedInSession(targetUser.id)
      } catch (err) {
        console.warn('Failed to sync user profile:', err)
      } finally {
        inFlightSyncs.delete(targetUser.id)
      }
    })()

    inFlightSyncs.set(targetUser.id, syncPromise)
    return await syncPromise
  }

  useEffect(() => {
    setIsClient(true)
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser((prevUser) => {
        const nextUser = session?.user ?? null
        if (!prevUser && !nextUser) return null
        if (
          prevUser &&
          nextUser &&
          prevUser.id === nextUser.id &&
          prevUser.updated_at === nextUser.updated_at &&
          prevUser.email === nextUser.email
        ) {
          return prevUser
        }
        return nextUser
      })
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
      setUser((prevUser) => {
        const nextUser = session?.user ?? null
        if (!prevUser && !nextUser) return null
        if (
          prevUser &&
          nextUser &&
          prevUser.id === nextUser.id &&
          prevUser.updated_at === nextUser.updated_at &&
          prevUser.email === nextUser.email
        ) {
          return prevUser
        }
        return nextUser
      })
      setLoading(false)

      if (event === 'SIGNED_IN') {
        if (session?.user) {
          syncUserProfile(session.user)
        }
        // Redirect vß╗ü dashboard nß║┐u user ─æang ß╗ƒ trang login/register
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
      syncUserProfile(data.user, referredBy, 'email')
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
    if (user?.id) {
      syncedUserIds.delete(user.id)
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.removeItem(`synced_profile_${user.id}`)
        } catch {}
      }
    }
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
