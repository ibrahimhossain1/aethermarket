import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co"
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_secret_placeholder"

const isPlaceholder = !process.env.SUPABASE_URL && 
  !process.env.NEXT_PUBLIC_SUPABASE_URL && 
  (!process.env.SUPABASE_SERVICE_ROLE_KEY || 
   process.env.SUPABASE_SERVICE_ROLE_KEY.includes("supabase_service_role_key_here") ||
   process.env.SUPABASE_SERVICE_ROLE_KEY.includes("sb_secret_placeholder"))

if (isPlaceholder) {
  console.warn("⚠️ Supabase admin environment variables are placeholders! Running Aether in Sandbox Verification mode.")
}

// Initialize a singleton server-side Supabase admin client
export const supabaseAdmin = createClient(supabaseUrl, isPlaceholder ? "sb_placeholder_key" : supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export interface SupabaseDecodedUser {
  id: string
  email: string
  name: string
  picture: string
}

/**
 * Server-side session verification.
 * Resolves the user profile directly via Supabase Auth API using the JWT access token.
 */
export async function verifySessionToken(token: string): Promise<SupabaseDecodedUser> {
  // If credentials are placeholders (local sandbox testing), return mock profile
  if (isPlaceholder) {
    console.log("Supabase credentials are placeholder. Running Aether in Sandbox Verification mode.")
    try {
      const payloadBase64 = token.split(".")[1]
      if (payloadBase64) {
        const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString())
        return {
          id: payload.sub || "mock-supabase-id-12345",
          email: payload.email || "buyer@aether.net",
          name: payload.name || payload.email?.split("@")[0] || "Sandbox User",
          picture: payload.picture || ""
        }
      }
    } catch (e) {
      // Fallback
    }
    return {
      id: "mock-supabase-id-12345",
      email: "buyer@aether.net",
      name: "Sandbox Buyer",
      picture: ""
    }
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  
  if (error || !user) {
    throw new Error(error?.message || "Invalid Supabase session token")
  }

  return {
    id: user.id,
    email: user.email || "",
    name: (user.user_metadata?.name || user.user_metadata?.full_name) || user.email?.split("@")[0] || "Supabase User",
    picture: user.user_metadata?.avatar_url || ""
  }
}
