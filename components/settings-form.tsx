"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/providers"
import { 
  User as UserIcon, 
  Globe, 
  Sparkles, 
  Save, 
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  FileCheck
} from "lucide-react"

interface SettingsFormProps {
  initialUser: {
    name: string | null
    email: string
    bio: string | null
    website: string | null
    role: "BUYER" | "SELLER" | "ADMIN"
  }
}

export default function SettingsForm({ initialUser }: SettingsFormProps) {
  const router = useRouter()
  const { update: updateSession } = useSession()

  const [name, setName] = React.useState(initialUser.name || "")
  const [bio, setBio] = React.useState(initialUser.bio || "")
  const [website, setWebsite] = React.useState(initialUser.website || "")
  const [agreeTerms, setAgreeTerms] = React.useState(false)
  
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [errorMsg, setErrorMsg] = React.useState("")

  const handleSubmit = async (e: React.FormEvent, applySeller = false) => {
    e.preventDefault()
    
    if (applySeller && !agreeTerms) {
      alert("Please agree to the seller commission fee terms before elevating your profile.")
      return
    }

    setLoading(true)
    setMessage("")
    setErrorMsg("")

    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          bio,
          website,
          applySeller
        })
      })

      const data = await response.json()
      if (response.ok) {
        setMessage(data.message)
        
        // Refresh session and router to show immediate layout updates
        await updateSession()
        router.refresh()
        
        // Scroll to top to see success alerts
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        setErrorMsg(data.error || "Failed to update profile settings.")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      setErrorMsg("An unexpected connection error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      
      {/* 1. Alerts Banner */}
      {message && (
        <div className="rounded-xl border border-emerald-900 bg-emerald-950/20 p-4 text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          {message}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-rose-900 bg-rose-950/20 p-4 text-xs font-semibold text-rose-400 flex items-center gap-2">
          <HelpCircle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* 2. Main Profile Settings Form */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="flex flex-col gap-5">
        
        <h3 className="font-display text-sm font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2.5">
          Public Profile Details
        </h3>

        {/* Email Row (Disabled) */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Email Address (Primary)</label>
          <input
            type="email"
            value={initialUser.email}
            disabled
            className="w-full rounded-xl bg-zinc-950/60 border border-zinc-900 py-3 px-4 text-xs text-zinc-500 outline-none cursor-not-allowed select-none"
          />
          <span className="text-[9px] text-zinc-600 font-light">Email addresses are tied to NextAuth OAuth credentials and cannot be changed.</span>
        </div>

        {/* Name Row */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Display Name</label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none transition focus:border-violet-600"
            required
          />
        </div>

        {/* Website Row */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Connected Website / Portfolio</label>
          <div className="relative w-full">
            <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-550" />
            <input
              type="url"
              placeholder="e.g. https://myportfolio.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none transition focus:border-violet-600"
            />
          </div>
        </div>

        {/* Bio Row */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Public Biography</label>
          <textarea
            placeholder="Introduce yourself to buyers and subscribers..."
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none resize-none transition focus:border-violet-600"
          />
        </div>

        {/* Submit Save Profile */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-6 py-2.5 text-xs font-semibold text-zinc-200 hover:text-white transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving Changes..." : "Save Public Profile"}
          </button>
        </div>

      </form>

      {/* 3. BECOME A SELLER APPLICATION CARD (BUYERS ONLY) */}
      {initialUser.role === "BUYER" && (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 p-6 flex flex-col gap-5 mt-4">
          
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-violet-950/50 border border-violet-900/40 text-violet-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">Become a Creator on Aether Exchange</h4>
              <p className="text-[10px] text-zinc-500 mt-0.5">Monetize your AI Prompts, automated skills, and code templates.</p>
            </div>
          </div>

          <div className="bg-zinc-900/40 rounded-xl border border-zinc-850 p-4 text-xs text-zinc-500 leading-relaxed font-light">
            <span className="font-bold text-zinc-300 block mb-1">Exchange Terms & Commission Payouts:</span>
            <ul className="list-disc list-inside flex flex-col gap-1.5 pl-1.5 mt-2">
              <li>
                We charge a flat <span className="font-bold text-white">15% platform commission</span> per paid listing download to maintain server hosting, storage pipelines, and signed download routing.
              </li>
              <li>
                You earn <span className="font-bold text-emerald-400">85% of net revenues</span>, directly deposited via Stripe Connect Express.
              </li>
              <li>
                Any listing you create will initially be in a <span className="font-bold text-white">PENDING</span> status, whitelisting automatically upon moderator validation.
              </li>
            </ul>
          </div>

          <form onSubmit={(e) => handleSubmit(e, true)} className="flex flex-col gap-4">
            
            {/* Agreement checkbox */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-850 bg-zinc-900 text-violet-600 focus:ring-violet-500 mt-0.5"
              />
              <span className="text-[10px] text-zinc-450 leading-relaxed font-light">
                I agree to the platform commission terms and verify that I am the sole owner of all files, snippets, and assets that I will upload to the marketplace.
              </span>
            </label>

            {/* Elevate Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !agreeTerms}
                className="rounded-full bg-violet-600 hover:bg-violet-500 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <FileCheck className="h-4 w-4" />
                {loading ? "Elevating..." : "Elevate Profile to Seller Role"}
              </button>
            </div>

          </form>

        </div>
      )}

      {/* 4. ALREADY A SELLER SIGNALS */}
      {initialUser.role === "SELLER" && (
        <div className="rounded-2xl border border-zinc-850 bg-emerald-950/10 p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Seller account is fully active</h4>
            <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">
              You have full creator authorization to add listings, connect bank nodes, and view analytics in your dedicated{" "}
              <Link href="/seller/dashboard" className="text-emerald-400 hover:underline">Seller Analytics Hub</Link>.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
