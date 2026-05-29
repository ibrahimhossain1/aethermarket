export const dynamic = "force-dynamic"

import * as React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { 
  User as UserIcon, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LayoutDashboard,
  ShieldCheck,
  TrendingUp
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // 1. Gated authentication check
  const session = await auth()
  if (!session || !session.user) {
    redirect(`/auth/signin?callbackUrl=/dashboard`)
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side: Sidebar Navigation Panel */}
        <aside className="w-full lg:w-64 flex flex-col gap-1.5 shrink-0 bg-zinc-950/20 p-4 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
          
          <div className="border-b border-zinc-900 pb-3 mb-3 px-2">
            <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block">Buyer Account</span>
            <h2 className="text-sm font-bold text-white truncate mt-1">
              {session.user.name || session.user.email}
            </h2>
          </div>

          <nav className="flex flex-col gap-1 w-full">
            <Link 
              href="/dashboard"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition"
            >
              <LayoutDashboard className="h-4.5 w-4.5 text-violet-500" />
              Overview
            </Link>

            <Link 
              href="/dashboard/purchases"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition"
            >
              <ShoppingBag className="h-4.5 w-4.5 text-emerald-500" />
              My Purchases
            </Link>

            <Link 
              href="/dashboard/saved"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition"
            >
              <Heart className="h-4.5 w-4.5 text-rose-500" />
              Wishlist
            </Link>

            <Link 
              href="/dashboard/settings"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition"
            >
              <Settings className="h-4.5 w-4.5 text-zinc-500" />
              Profile Settings
            </Link>
          </nav>

          {/* Quick Creator Pitch */}
          {session.user.role !== "SELLER" && session.user.role !== "ADMIN" && (
            <div className="border-t border-zinc-900 pt-4 mt-4 px-2">
              <span className="text-[9px] font-bold text-zinc-650 uppercase tracking-widest block mb-2">Want to sell?</span>
              <Link 
                href="/dashboard/settings" 
                className="w-full text-center rounded-xl bg-violet-600/10 hover:bg-violet-600/20 border border-violet-800/30 hover:border-violet-750/50 py-2.5 text-[9px] font-bold text-violet-400 block transition"
              >
                Become a Seller
              </Link>
            </div>
          )}

          {/* Seller Dashboard quick link if active */}
          {(session.user.role === "SELLER" || session.user.role === "ADMIN") && (
            <div className="border-t border-zinc-900 pt-4 mt-4 px-2">
              <span className="text-[9px] font-bold text-zinc-650 uppercase tracking-widest block mb-2">Creator Hub</span>
              <Link 
                href="/seller/dashboard" 
                className="flex items-center justify-between rounded-xl bg-zinc-900/40 border border-zinc-800/60 px-3.5 py-2 text-[10px] font-bold text-zinc-300 hover:text-white hover:border-zinc-700 transition"
              >
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Analytics Hub
                </span>
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/40 border border-emerald-800/30 px-1 rounded">Active</span>
              </Link>
            </div>
          )}

        </aside>

        {/* Right Side: Page Content Slot */}
        <div className="flex-1 w-full min-h-[60vh] bg-zinc-900/10 rounded-2xl border border-zinc-900 p-5 sm:p-6 backdrop-blur-sm">
          {children}
        </div>

      </div>
    </div>
  )
}
