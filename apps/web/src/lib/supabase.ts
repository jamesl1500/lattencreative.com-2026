/**
 * Supabase Client
 * ----
 * Browser-safe Supabase client for use in API routes and client components.
 *
 * @module @latten/web/supabase
 * @author Latten Creative
 * @license MIT
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
