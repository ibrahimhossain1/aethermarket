import * as React from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"

export const metadata = {
  title: "Terms of Service - Aether Exchange",
  description: "Terms and conditions of Aether Marketplace.",
}

export default function TermsPage() {
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
        <h1 className="font-display text-3xl font-bold text-white tracking-tight font-sans">Terms of Service</h1>
        <p className="text-xs text-zinc-500 mt-2">Last Updated: May 2026</p>
      </div>

      <div className="flex flex-col gap-6 text-xs text-zinc-400 font-light leading-relaxed">
        
        <div>
          <h2 className="text-sm font-bold text-zinc-200 mb-2">1. Agreement to Terms</h2>
          <p>
            By accessing or using Aether Marketplace, you agree to comply with and be bound by these Terms of Service. If you do not agree, you must not use or access the services.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-zinc-200 mb-2">2. Accounts and Security</h2>
          <p>
            To buy or sell products, you must register a secure account via Supabase Auth. You are solely responsible for maintaining the confidentiality of your session credentials and all transactions occurring under your account.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-zinc-200 mb-2">3. License of Digital Goods</h2>
          <p>
            All purchased AI prompts, workflows, and code snippets are licensed, not sold, to you. Developers are granted a non-exclusive, non-transferable, worldwide lifetime license to integrate purchased blueprints into their own private or commercial applications. Redistribution or resale of raw source files is strictly prohibited.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-zinc-200 mb-2">4. Fees, Refunds and Payments</h2>
          <p>
            Transactions are securely processed via Stripe Connect. Free downloads do not incur charges. Paid listings are subject to a 15% platform commission fee. Buyers are entitled to a 7-day refund window if the downloaded digital asset is corrupt, missing core files, or completely broken.
          </p>
        </div>

      </div>

    </div>
  )
}
