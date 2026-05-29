"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/providers"
import { Sparkles } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { status } = useSession()

  React.useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
      router.refresh()
    } else if (status === "unauthenticated") {
      // If it fails or finishes unauthenticated after 5 seconds, fall back to signin
      const timer = setTimeout(() => {
        router.push("/auth/signin?error=callback_failed")
      }, 5500)
      return () => clearTimeout(timer)
    }
  }, [status, router])

  return (
    <div className="flex-1 w-full min-h-[85vh] bg-radial-glow py-16 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Glowing background highlights */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sleek loading card */}
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-md shadow-2xl text-center flex flex-col items-center justify-center gap-6 relative z-10">
        
        {/* Neon rotating spinner */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-violet-950 border-t-violet-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-indigo-950 border-b-indigo-400 animate-spin [animation-duration:1.5s]"></div>
          <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-violet-400 animate-pulse" />
        </div>

        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Synchronizing Identity</h3>
          <p className="text-[10px] text-zinc-500 leading-relaxed mt-1.5 font-light">
            Please wait while we establish your secure digital session and sync with your marketplace dashboard.
          </p>
        </div>

      </div>

    </div>
  )
}
