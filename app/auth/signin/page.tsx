"use client"

import * as React from "react"
import { Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth as firebaseAuth, googleProvider, githubProvider } from "@/lib/firebase-client"
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight, 
  XCircle, 
  CheckCircle2 
} from "lucide-react"

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const errorParam = searchParams.get("error")

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")

  React.useEffect(() => {
    if (errorParam) {
      setErrorMessage("An unexpected authentication error occurred.")
    }
  }, [errorParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // 1. Log in to Firebase client-side
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)
      const idToken = await userCredential.user.getIdToken()

      // 2. Establish server cookie session
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      })

      if (response.ok) {
        setSuccessMessage("Authentication successful! Redirecting...")
        setTimeout(() => {
          router.push(callbackUrl)
          router.refresh()
        }, 1000)
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || "Failed to establish secure session.")
      }
    } catch (err: any) {
      console.error("Login submission error:", err)
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setErrorMessage("Invalid email or password combination. Please try again.")
      } else {
        setErrorMessage("Connection timeout. Please verify your credentials and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (providerName: "google" | "github") => {
    setLoading(true)
    setErrorMessage("")
    setSuccessMessage("")
    
    try {
      const provider = providerName === "google" ? googleProvider : githubProvider
      // 1. Trigger Firebase Social Popup
      const userCredential = await signInWithPopup(firebaseAuth, provider)
      const idToken = await userCredential.user.getIdToken()

      // 2. Sync cookie session
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      })

      if (response.ok) {
        setSuccessMessage(`Google login successful! Welcome back...`)
        setTimeout(() => {
          router.push(callbackUrl)
          router.refresh()
        }, 1000)
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || "Failed to sync OAuth session.")
      }
    } catch (err: any) {
      console.error(`OAuth login error for ${providerName}:`, err)
      if (err.code !== "auth/popup-closed-by-user") {
        setErrorMessage(`Social login failed. Ensure popups are allowed and try again.`)
      }
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 w-full min-h-[85vh] bg-radial-glow py-16 px-4 flex items-center justify-center relative overflow-hidden">
      
      {/* Dynamic Background glowing orb designs */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Glassmorphic Portal Panel */}
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl relative z-10 flex flex-col gap-6">
        
        {/* Brand details */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="bg-gradient-to-r from-violet-400 via-violet-600 to-indigo-500 bg-clip-text font-display text-2xl font-bold tracking-wider text-transparent transition hover:opacity-90">
              AETHER
            </span>
          </Link>
          <h2 className="text-base font-bold text-white tracking-tight mt-3">Welcome back</h2>
          <p className="text-[11px] text-zinc-500 mt-1 font-light leading-relaxed">
            Enter your credentials or use social identity providers to access your digital workspace.
          </p>
        </div>

        {/* Feedback alerts */}
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

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email field */}
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

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Password</label>
            <div className="relative w-full">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-550" />
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-zinc-950/60 border border-zinc-850 py-3 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none transition focus:border-violet-600 focus:bg-zinc-950"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Login Button */}
          <div className="mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-violet-600 hover:bg-violet-500 py-3 text-xs font-bold text-white shadow-lg shadow-violet-500/20 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              {loading ? "Authenticating..." : "Sign In to Aether"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-1">
          <span className="flex-1 h-px bg-zinc-850"></span>
          <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest font-mono">Or Continue With</span>
          <span className="flex-1 h-px bg-zinc-850"></span>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3.5">
          <button
            onClick={() => handleOAuthSignIn("google")}
            disabled={loading}
            className="rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-900/40 py-2.5 px-4 text-xs text-zinc-300 font-semibold transition flex items-center justify-center gap-2.5 disabled:opacity-40"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            onClick={() => handleOAuthSignIn("github")}
            disabled={loading}
            className="rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-900/40 py-2.5 px-4 text-xs text-zinc-300 font-semibold transition flex items-center justify-center gap-2.5 disabled:opacity-40"
          >
            <svg className="h-4 w-4 shrink-0 fill-zinc-300" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Registration footer link */}
        <div className="text-center pt-2 border-t border-zinc-900">
          <span className="text-[10px] text-zinc-500 font-light">Don't have an Aether account? </span>
          <Link href="/auth/signup" className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition">
            Create an Account
          </Link>
        </div>

      </div>

    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 w-full min-h-[85vh] bg-background py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-md text-center text-xs text-zinc-500">
          Loading authentication gateway...
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
