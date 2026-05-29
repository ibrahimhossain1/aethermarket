"use client"

import * as React from "react"
import { supabase } from "@/lib/supabase-client"
import { AuthChangeEvent, Session as SupabaseSession } from "@supabase/supabase-js"

export interface Session {
  user: {
    id: string
    email: string
    name: string | null
    image: string | null
    role: "BUYER" | "SELLER" | "ADMIN"
    stripeAccountId: string | null
    stripeCustomerId: string | null
  }
}

interface SessionContextType {
  data: Session | null
  status: "authenticated" | "unauthenticated" | "loading"
  update: () => Promise<void>
}

const SessionContext = React.createContext<SessionContextType>({
  data: null,
  status: "loading",
  update: async () => {},
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null)
  const [status, setStatus] = React.useState<"authenticated" | "unauthenticated" | "loading">("loading")

  // Function to pull decrypted active profile details from secure HTTP-Only cookie
  const fetchSession = React.useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session")
      if (res.ok) {
        const data = await res.json()
        if (data && data.user) {
          setSession(data)
          setStatus("authenticated")
          return
        }
      }
      setSession(null)
      setStatus("unauthenticated")
    } catch {
      setSession(null)
      setStatus("unauthenticated")
    }
  }, [])

  // Sync client session on initial mount and whenever Supabase state changes
  React.useEffect(() => {
    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, currentSession: SupabaseSession | null) => {
      if (currentSession) {
        // Supabase logged in, sync access token with cookie session
        try {
          const res = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: currentSession.access_token })
          })
          if (res.ok) {
            await fetchSession()
          }
        } catch (error) {
          console.error("Failed to sync Supabase session with server:", error)
        }
      } else {
        // Supabase logged out, delete cookie
        try {
          await fetch("/api/auth/session", { method: "DELETE" })
        } catch (error) {
          console.error("Failed to delete session:", error)
        }
        setSession(null)
        setStatus("unauthenticated")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchSession])

  const update = async () => {
    await fetchSession()
  }

  return (
    <SessionContext.Provider value={{ data: session, status, update }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  return React.useContext(SessionContext)
}

/**
 * Custom sign-out utility that logs out both the Supabase Client SDK
 * and triggers session cookie deletions on the server.
 */
export async function signOut({ callbackUrl = "/" }: { callbackUrl?: string } = {}) {
  try {
    await supabase.auth.signOut()
    await fetch("/api/auth/session", { method: "DELETE" })
  } catch (error) {
    console.error("Sign out error:", error)
  }
  window.location.href = callbackUrl
}

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
