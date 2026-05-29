export const dynamic = "force-dynamic"

import * as React from "react"
import Link from "next/link"
import { auth } from "@/auth"
import { getBuyerPurchases, getBuyerSaved } from "@/lib/data"
import { 
  ShoppingBag, 
  Heart, 
  Coins, 
  ArrowRight, 
  Download,
  Calendar,
  Sparkles
} from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  // 1. Fetch buyer statistics & transactions (supports mock fallback)
  const purchases = await getBuyerPurchases(userId)
  const savedItems = await getBuyerSaved(userId)

  const activePurchasesCount = purchases.filter(p => !p.refunded).length
  const totalSpentCents = purchases.filter(p => !p.refunded).reduce((sum, p) => sum + p.amount, 0)
  
  const recentPurchases = purchases.slice(0, 3)
  const recentSaved = savedItems.slice(0, 3)

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* 1. Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">Buyer Dashboard</h1>
        <p className="text-xs text-zinc-500 mt-1">Manage your transactions, access download keys, and review saved assets.</p>
      </div>

      {/* 2. Analytical Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Total Spent */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total Investment</span>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight mt-1">
              ${(totalSpentCents / 100).toFixed(2)}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-violet-950/40 border border-violet-800/40 text-violet-400 flex items-center justify-center shrink-0">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        {/* Purchased Items */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">My Assets</span>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight mt-1">
              {activePurchasesCount}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 flex items-center justify-center shrink-0">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>

        {/* Wishlisted Items */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Bookmarked</span>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight mt-1">
              {savedItems.length}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-400 flex items-center justify-center shrink-0">
            <Heart className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* 3. RECENT PURCHASES ROW */}
      <div className="rounded-xl border border-zinc-850 p-5 bg-zinc-950/30">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-900">
          <h3 className="font-display text-sm font-bold text-zinc-200 uppercase tracking-widest flex items-center gap-1.5">
            <ShoppingBag className="h-4.5 w-4.5 text-emerald-500" />
            Recent Purchases
          </h3>
          <Link href="/dashboard/purchases" className="text-[10px] font-semibold text-zinc-500 hover:text-white transition flex items-center gap-1 uppercase tracking-wider">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentPurchases.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-500 font-light border border-dashed border-zinc-850 rounded-xl">
            You haven't purchased any templates or prompts yet. Visit the{" "}
            <Link href="/marketplace" className="text-violet-400 hover:underline">Marketplace</Link> to buy your first asset!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentPurchases.map((purchase) => (
              <div 
                key={purchase.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-zinc-900 bg-zinc-950/40 p-3 hover:border-zinc-800 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                    <img 
                      src={purchase.product?.previewImages?.[0] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80"} 
                      alt={purchase.product?.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 line-clamp-1">{purchase.product?.title}</h4>
                    <span className="text-[9px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3 w-3 text-zinc-650" />
                      Bought on {new Date(purchase.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs font-semibold text-zinc-300">
                    {purchase.amount === 0 ? "Free" : `$${(purchase.amount / 100).toFixed(2)}`}
                  </span>
                  
                  <a 
                    href={`/api/download/${purchase.id}`}
                    className="rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white px-3.5 py-1.5 text-[10px] font-bold text-zinc-350 transition flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download File
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. WISHLIST PREVIEW ROW */}
      <div className="rounded-xl border border-zinc-850 p-5 bg-zinc-950/30">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-900">
          <h3 className="font-display text-sm font-bold text-zinc-200 uppercase tracking-widest flex items-center gap-1.5">
            <Heart className="h-4.5 w-4.5 text-rose-500" />
            Bookmarked items
          </h3>
          <Link href="/dashboard/saved" className="text-[10px] font-semibold text-zinc-500 hover:text-white transition flex items-center gap-1 uppercase tracking-wider">
            Manage Wishlist <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentSaved.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-500 font-light border border-dashed border-zinc-850 rounded-xl">
            No saved listings found. Bookmark listings in the catalog to review them here later!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentSaved.map((p) => (
              <Link 
                key={p.id}
                href={`/marketplace/${p.slug}`}
                className="group rounded-xl border border-zinc-900 bg-zinc-950/20 p-3 hover:border-zinc-800 transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[8px] font-bold text-violet-400 uppercase tracking-widest">{p.type}</span>
                  <h4 className="text-xs font-bold text-zinc-200 line-clamp-1 mt-1 group-hover:text-violet-400 transition-colors">{p.title}</h4>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-900 pt-2 mt-3 text-[10px]">
                  <span className="text-zinc-550">@{p.seller?.name?.toLowerCase().replace(" ", "")}</span>
                  <span className="font-semibold text-zinc-300">
                    {p.isFree ? "Free" : `$${(p.price / 100).toFixed(2)}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
