export const dynamic = "force-dynamic"

import * as React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { UserRole } from "@prisma/client"
import { 
  ShieldAlert, 
  Users, 
  Layers, 
  LayoutDashboard,
  ShieldCheck,
  ArrowLeft,
  Wallet
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // 1. Secure Admin Role Verification Checkpoint
  const session = await auth()
  if (!session || !session.user) {
    redirect(`/auth/signin?callbackUrl=/admin`)
  }

  const role = session.user.role
  if (role !== UserRole.ADMIN) {
    redirect(`/dashboard?error=admin_only`)
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 2. Top Portal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 mb-8 gap-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">Platform Admin Portal</span>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight mt-1">Platform Control Dashboard</h1>
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
        
        {/* 3. Left Side: Admin Navigation Sidebar */}
        <aside className="w-full lg:w-64 flex flex-col gap-1.5 shrink-0 bg-zinc-950/20 p-4 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
          
          <div className="border-b border-zinc-900 pb-3 mb-3 px-2 flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider font-mono">
            <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" />
            Admin Operations
          </div>

          <nav className="flex flex-col gap-1 w-full">
            <Link 
              href="/admin"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition"
            >
              <LayoutDashboard className="h-4.5 w-4.5 text-indigo-500" />
              System Dashboard
            </Link>

            <Link 
              href="/admin/users"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition"
            >
              <Users className="h-4.5 w-4.5 text-violet-500" />
              User Moderation
            </Link>

            <Link 
              href="/admin/listings"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition"
            >
              <Layers className="h-4.5 w-4.5 text-emerald-500" />
              Catalog Approval
            </Link>

            <Link 
              href="/admin/payouts"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition"
            >
              <Wallet className="h-4.5 w-4.5 text-indigo-400" />
              Connect Payouts
            </Link>
          </nav>

        </aside>

        {/* 4. Right Side: Page Content Slot */}
        <div className="flex-1 w-full min-h-[60vh] bg-zinc-900/10 rounded-2xl border border-zinc-900 p-5 sm:p-6 backdrop-blur-sm">
          {children}
        </div>

      </div>
    </div>
  )
}
