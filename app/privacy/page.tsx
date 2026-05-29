import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Privacy Policy - Aether Exchange",
  description: "Privacy policy of Aether Marketplace.",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Back Button */}
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-550 hover:text-zinc-300 transition uppercase tracking-wider mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Exchange
      </Link>

      {/* Header */}
      <div className="border-b border-zinc-900 pb-6 mb-10">
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-zinc-500 mt-2">Last Updated: May 2026</p>
      </div>

      <div className="flex flex-col gap-6 text-xs text-zinc-400 font-light leading-relaxed">
        
        <div>
          <h2 className="text-sm font-bold text-zinc-200 mb-2">1. Information We Collect</h2>
          <p>
            We collect personal identity details when you sign up using Supabase Auth, including your name, email, avatar image, and authentication logs. Billing transactions are gathered directly by Stripe, and we do not store sensitive payment cards locally.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-zinc-200 mb-2">2. How We Use Information</h2>
          <p>
            Your information is strictly utilized to sync your session profile, generate transactional email receipts, manage download logs, dispatch secure signed URLs, and distribute seller revenue payments. We never sell or lease user data to third-party advertising companies.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-zinc-200 mb-2">3. Storage & Security</h2>
          <p>
            All digital file uploads, downloads, and user metadata are stored securely in Supabase Storage with dynamic signed token expirations (1-hour link duration) to prevent unauthorized distribution leaks.
          </p>
        </div>

      </div>

    </div>
  )
}
