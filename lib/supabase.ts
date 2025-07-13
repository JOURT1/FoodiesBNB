import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Restaurant {
  id: string
  name: string
  cuisine: string
  location: string
  rating: number
  review_count: number
  image: string
  description: string
  price_range: string
  open_hours: string
  created_at?: string
}

export interface Visit {
  id: string
  user_id: string
  restaurant_id: string
  visit_date: string
  visit_time: string
  party_size: number
  special_requests?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at?: string
}

export interface User {
  id: string
  email: string
  user_type: 'foodie' | 'restaurant'
  full_name?: string
  created_at?: string
}
