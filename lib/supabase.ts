import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types for database tables
export type SubscriptionStatus = 'free' | 'personal' | 'business' | 'expired'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  // Subscription fields
  subscription_status: SubscriptionStatus
  subscription_plan: string | null
  subscription_start: string | null
  subscription_end: string | null
  daily_search_count: number
  last_search_date: string | null
}

export type User = {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
}