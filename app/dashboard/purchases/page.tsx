export const dynamic = "force-dynamic"

import * as React from "react"
import Link from "next/link"
import { auth } from "@/auth"
import { getBuyerPurchases } from "@/lib/data"
import RefundButton from "@/components/refund-button"
import { 
  ShoppingBag, 
  Download, 
  Calendar, 
  ArrowRight,
  ShieldAlert,
  Search,
  Sparkles
} from "lucide-react"

export default async function PurchasesPage() {
  const session = await auth()
  const userId = session!.user.id

  // Fetch all buyer purchases (supports connection mock fallback)
  const purchases = await getBuyerPurchases(userId)

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Page Header */}
      <div className="border-b border-zinc-900 pb-4">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">My Purchased Assets</h1>
        <p className="text-xs text-zinc-500 mt-1">Access secure download keys and track refund windows for your purchased products.</p>
      </div>

      {purchases.length === 0 ? (
        // Empty State Placeholder
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-850 p-12 text-center min-h-[300px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950/40 border border-zinc-800 text-zinc-500 mb-4 animate-pulse">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-bold text-zinc-300">No purchases found</h3>
          <p className="text-xs text-zinc-550 max-w-sm mt-2 mb-6">
            You haven't bought any prompts or code snippets yet. Visit the catalog to find items.
          </p>
          <Link 
            href="/marketplace" 
            className="rounded-full bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-xs font-semibold text-white transition shadow-md shadow-violet-500/10 flex items-center gap-1 group"
          >
            Explore Marketplace
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ) : (
        // Purchased items list
        <div className="flex flex-col gap-4">
          {purchases.map((p) => {
            const displayPrice = p.amount === 0 
              ? "Free" 
              : `$${(p.amount / 100).toFixed(2)}`
              
            return (
              <div 
                key={p.id}
                className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl border p-4 transition ${
                  p.refunded 
                    ? "bg-zinc-950/20 border-zinc-900 opacity-60" 
                    : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {/* Details left */}
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-zinc-950 border border-zinc-850 overflow-hidden shrink-0">
                    <img 
                      src={p.product?.previewImages?.[0] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80"} 
                      alt={p.product?.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    {/* Item Type */}
                    <span className="text-[8px] font-bold text-violet-400 uppercase tracking-widest">{p.product?.type}</span>
                    
                    {/* Item Title */}
                    <h3 className="text-sm font-bold text-zinc-100 mt-0.5 leading-snug">
                      {p.product ? (
                        <Link href={`/marketplace/${p.product.slug}`} className="hover:underline hover:text-white transition">
                          {p.product.title}
                        </Link>
                      ) : (
                        "Archived Listing"
                      )}
                    </h3>

                    {/* Vetted Seller Username */}
                    <p className="text-[10px] text-zinc-550 mt-1">
                      by @{p.product?.seller?.name?.toLowerCase().replace(" ", "") || "creator"}{" "}
                      <span className="text-zinc-650 ml-1.5">•</span>{" "}
                      <span className="inline-flex items-center gap-1 ml-1.5">
                        <Calendar className="h-3 w-3 text-zinc-650" />
                        Bought on {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right side actions and pricing */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto justify-between sm:justify-end border-t border-zinc-850 sm:border-0 pt-3 sm:pt-0 shrink-0">
                  
                  {/* Prices & Badges */}
                  <div className="text-left sm:text-right flex items-center justify-between sm:flex-col gap-2 sm:gap-0.5 px-1">
                    <span className="text-[9px] uppercase font-bold text-zinc-650 tracking-wider">Amount Paid</span>
                    <span className="text-sm font-bold text-zinc-200">{displayPrice}</span>
                  </div>

                  {/* Actions wrapper */}
                  <div className="flex flex-row items-center gap-2.5">
                    {/* Secure Signed Download URL trigger */}
                    {!p.refunded ? (
                      <a 
                        href={`/api/download/${p.id}`}
                        className="flex-1 sm:flex-none rounded-xl bg-violet-600 hover:bg-violet-500 hover:scale-[1.01] px-5 py-2.5 text-xs font-semibold text-white transition-all shadow-md shadow-violet-500/10 flex items-center justify-center gap-1.5"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    ) : (
                      <span className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-550 select-none">
                        <ShieldAlert className="h-4 w-4 text-rose-500/40" />
                        Locked
                      </span>
                    )}

                    {/* Interactive 7-Day Refund Button */}
                    <RefundButton 
                      purchaseId={p.id} 
                      createdAt={p.createdAt} 
                      refunded={p.refunded} 
                    />
                  </div>

                </div>

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
