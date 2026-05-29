import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase client environment variables are missing! Authentication will run in fallback sandbox mode.")
}

// Initialize a singleton client-side Supabase instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
