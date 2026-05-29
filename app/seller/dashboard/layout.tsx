export const dynamic = "force-dynamic"

import * as React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { UserRole } from "@prisma/client"
import { 
  TrendingUp, 
  Layers, 
  Wallet, 
  Plus, 
  LayoutDashboard,
  ShieldCheck,
  Cpu,
  ArrowLeft
} from "lucide-react"

interface SellerLayoutProps {
  children: React.ReactNode
}

export default async function SellerLayout({ children }: SellerLayoutProps) {
  // 1. Secure Creator Role Verification Checkpoint
  const session = await auth()
  if (!session || !session.user) {
    redirect(`/auth/signin?callbackUrl=/seller/dashboard`)
  }

  const role = session.user.role
  if (role !== UserRole.SELLER && role !== UserRole.ADMIN) {
    redirect(`/dashboard/settings?apply_first=true`)
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 2. Top Portal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 mb-8 gap-4">
        <div>
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest block">Aether Creator Portal</span>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight mt-1">Creator Analytics Hub</h1>
        </div>
        <Link 
          href="/dashboard"
          className="rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-4 py-2.5 text-[10px] font-bold text-zinc-350 hover:text-white transition flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Buyer Space
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* 3. Left Side: Creator Navigation Sidebar */}
        <aside className="w-full lg:w-64 flex flex-col gap-1.5 shrink-0 bg-zinc-950/20 p-4 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
          
          {/* Quick Listing Creator Button */}
          <Link 
            href="/seller/dashboard/listings/new"
            className="w-full text-center rounded-xl bg-violet-600 hover:bg-violet-500 py-3 text-xs font-semibold text-white transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-1.5 mb-4 hover:scale-[1.01]"
          >
            <Plus className="h-4.5 w-4.5" />
            Create New Listing
          </Link>

          <span className="text-[9px] font-bold text-zinc-650 uppercase tracking-widest px-2 block mb-1">Creator Tools</span>

          <nav className="flex flex-col gap-1 w-full">
            <Link 
              href="/seller/dashboard"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition"
            >
              <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
              Sales Analytics
            </Link>

            <Link 
              href="/seller/dashboard/listings"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition"
            >
              <Layers className="h-4.5 w-4.5 text-violet-500" />
              Manage Listings
            </Link>

            <Link 
              href="/seller/dashboard/payouts"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition"
            >
              <Wallet className="h-4.5 w-4.5 text-indigo-500" />
              Payout Nodes
            </Link>
          </nav>

          {/* Quick Admin Signal if role is admin */}
          {role === UserRole.ADMIN && (
            <div className="border-t border-zinc-900 pt-4 mt-4 px-2">
              <span className="text-[9px] font-bold text-zinc-650 uppercase tracking-widest block mb-2">Moderator Area</span>
              <Link 
                href="/admin" 
                className="flex items-center justify-between rounded-xl bg-zinc-900/40 border border-zinc-800/60 px-3.5 py-2 text-[10px] font-bold text-zinc-300 hover:text-white hover:border-zinc-700 transition"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-500" />
                  Admin panel
                </span>
                <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/40 border border-indigo-800/30 px-1 rounded">ROOT</span>
              </Link>
            </div>
          )}

        </aside>

        {/* 4. Right Side: Page Content Slot */}
        <div className="flex-1 w-full min-h-[60vh] bg-zinc-900/10 rounded-2xl border border-zinc-900 p-5 sm:p-6 backdrop-blur-sm">
          {children}
        </div>

      </div>
    </div>
  )
}
