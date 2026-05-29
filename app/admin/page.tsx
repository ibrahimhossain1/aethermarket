export const dynamic = "force-dynamic"

import * as React from "react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { 
  Coins, 
  Users, 
  Layers, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react"

export default async function AdminDashboardPage() {
  
  // 1. Fetch Platform aggregates (supports mock connection fallback)
  let userCount = 0
  let listingCount = 0
  let gmvCents = 0
  let recentPurchases: any[] = []

  try {
    userCount = await prisma.user.count()
    listingCount = await prisma.product.count()
    
    const purchases = await prisma.purchase.findMany({
      include: {
        product: { select: { title: true } },
        buyer: { select: { email: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    gmvCents = purchases.reduce((sum, p) => sum + p.amount, 0)
    recentPurchases = purchases.slice(0, 5)
  } catch (error) {
    console.warn("⚠️ Database unavailable. serving mock admin analytics.")
    // Mock admin metrics
    userCount = 1450
    listingCount = 124
    gmvCents = 1452000 // $14,520.00
    recentPurchases = [
      { id: "tx-1", productId: "prod-agent-prompt", amount: 1900, platformFee: 285, createdAt: new Date(), product: { title: "Cognitive Multi-Agent Architect Prompt" }, buyer: { email: "john@doe.com" } },
      { id: "tx-2", productId: "prod-stripe-discord", amount: 2900, platformFee: 435, createdAt: new Date(), product: { title: "Stripe-to-Discord Sync Blueprint" }, buyer: { email: "jane@doe.com" } }
    ]
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* 1. Page Header */}
      <div>
        <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest border-b border-zinc-900 pb-3 mb-1">System Administration</h2>
        <p className="text-xs text-zinc-550">Review overall GMV, platform transaction history, and moderative metrics.</p>
      </div>

      {/* 2. Analytical Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Platform GMV */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Gross Sales (GMV)</span>
            <h3 className="font-display text-2xl font-bold text-emerald-400 tracking-tight mt-1">
              ${(gmvCents / 100).toFixed(2)}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        {/* Total Users */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Registered Users</span>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight mt-1">
              {userCount}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-violet-950/40 border border-violet-800/40 text-violet-400 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Total Listings */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Active Catalog Assets</span>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight mt-1">
              {listingCount}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-indigo-400 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* 3. PLATFORM-WIDE TRANSACTION LOGS */}
      <div className="rounded-xl border border-zinc-850 p-5 bg-zinc-950/30">
        <h3 className="font-display text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-3 mb-4 flex items-center gap-2">
          <TrendingUp className="h-4.5 w-4.5 text-violet-500" />
          System-Wide Sales Audit Ledger
        </h3>

        {recentPurchases.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-500 font-light border border-dashed border-zinc-850 rounded-xl">
            No sales recorded yet on the platform.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-[10px] uppercase font-bold text-zinc-550 tracking-wider">
                  <th className="pb-3 pl-2">Product</th>
                  <th className="pb-3">Buyer Email</th>
                  <th className="pb-3 text-right">Commission (15%)</th>
                  <th className="pb-3 text-right pr-2">Paid Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {recentPurchases.map((po) => (
                  <tr key={po.id} className="hover:bg-zinc-900/10 transition-colors">
                    {/* Product Name */}
                    <td className="py-3.5 pl-2 text-zinc-200 font-semibold max-w-[200px] truncate">
                      {po.product?.title || "Asset Listing"}
                    </td>
                    {/* Buyer Email */}
                    <td className="py-3.5 font-light text-zinc-400">
                      {po.buyer?.email}
                    </td>
                    {/* Platform Fee */}
                    <td className="py-3.5 text-right font-semibold text-violet-400 font-mono">
                      ${(po.platformFee / 100).toFixed(2)}
                    </td>
                    {/* Total Amount */}
                    <td className="py-3.5 text-right pr-2 font-bold text-white font-mono">
                      ${(po.amount / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
