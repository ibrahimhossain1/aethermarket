"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  XCircle, 
  CheckCircle2 
} from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [agreeTerms, setAgreeTerms] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreeTerms) {
      setErrorMessage("Please agree to Aether's Developer terms of service to create your account.")
      return
    }

    setLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // 1. Sign up via Supabase Client
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error("Failed to register account with Supabase.")
      }

      if (!data.session) {
        // If email verification is active
        setSuccessMessage("Registration successful! Please check your email to confirm your account, then sign in.")
        setTimeout(() => {
          router.push("/auth/signin?registered=true")
        }, 3000)
        return
      }

      // 2. Sync cookie session and create PostgreSQL database entry
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: data.session.access_token })
      })

      if (response.ok) {
        setSuccessMessage("Account registered successfully! Redirecting...")
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1500)
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || "Failed to establish secure session.")
      }
    } catch (err: any) {
      console.error("Signup request failed:", err)
      setErrorMessage(err.message || "Failed to connect to authentication server. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 w-full min-h-[85vh] bg-radial-glow py-16 px-4 flex items-center justify-center relative overflow-hidden">
      
      {/* Glowing background highlights */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Translucent Panel */}
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl relative z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="bg-gradient-to-r from-violet-400 via-violet-600 to-indigo-500 bg-clip-text font-display text-2xl font-bold tracking-wider text-transparent transition hover:opacity-90">
              AETHER
            </span>
          </Link>
          <h2 className="text-base font-bold text-white tracking-tight mt-3">Register Creator Account</h2>
          <p className="text-[11px] text-zinc-500 mt-1 font-light leading-relaxed">
            Create your profile to start purchasing templates, writing reviews, and monetizing prompt skills.
          </p>
        </div>

        {/* Feedback notifications */}
        {errorMessage && (
          <div className="rounded-xl border border-rose-900 bg-rose-950/20 p-4 text-xs font-semibold text-rose-450 flex items-center gap-2">
            <XCircle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-emerald-900 bg-emerald-950/20 p-4 text-xs font-semibold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Registration form fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Display Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Display Name</label>
            <div className="relative w-full">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-550" />
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-zinc-950/60 border border-zinc-850 py-3 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none transition focus:border-violet-600 focus:bg-zinc-950"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Email Address</label>
            <div className="relative w-full">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-550" />
              <input
                type="email"
                placeholder="e.g. john@doe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-zinc-950/60 border border-zinc-850 py-3 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none transition focus:border-violet-600 focus:bg-zinc-950"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Password</label>
            <div className="relative w-full">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-550" />
              <input
                type="password"
                placeholder="Minimum 6 characters..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-zinc-950/60 border border-zinc-850 py-3 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none transition focus:border-violet-600 focus:bg-zinc-950"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 cursor-pointer select-none my-1">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-violet-600 focus:ring-violet-500 focus:ring-offset-background mt-0.5"
              disabled={loading}
            />
            <span className="text-[10px] text-zinc-500 leading-normal font-light">
              I agree to the platform developer agreement and verify that all prompts, files, or snippets I listing will comply with general community terms.
            </span>
          </label>

          {/* Signup button */}
          <div className="mt-2">
            <button
              type="submit"
              disabled={loading || !agreeTerms}
              className="w-full rounded-full bg-violet-600 hover:bg-violet-500 py-3 text-xs font-bold text-white shadow-lg shadow-violet-500/20 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              {loading ? "Registering Account..." : "Create Aether Account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </form>

        {/* Footnote Link */}
        <div className="text-center pt-3 border-t border-zinc-900">
          <span className="text-[10px] text-zinc-500 font-light">Already have an account? </span>
          <Link href="/auth/signin" className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition">
            Sign In Instead
          </Link>
        </div>

      </div>

    </div>
  )
}
