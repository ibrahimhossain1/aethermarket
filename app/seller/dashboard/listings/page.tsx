export const dynamic = "force-dynamic"

import * as React from "react"
import Link from "next/link"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import ListingActions from "@/components/listing-actions"
import { 
  Layers, 
  Plus, 
  Calendar, 
  Eye, 
  ShoppingBag,
  CheckCircle,
  Clock,
  Archive,
  ArrowRight
} from "lucide-react"

export default async function ListingsPage() {
  const session = await auth()
  const sellerId = session!.user.id

  // Fetch all products created by this seller
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: "desc" },
      include: {
        purchases: { select: { id: true } }
      }
    })
  } catch (err) {
    console.warn("⚠️ Database unavailable. serving mock listing fallback.")
    const { MOCK_PRODUCTS } = require("@/lib/mockData")
    products = MOCK_PRODUCTS.filter((p: any) => p.sellerId === "seller-alex-rivera-1111" || p.sellerId === sellerId)
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-4 gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 uppercase tracking-widest leading-none">Catalog Listings</h2>
          <p className="text-xs text-zinc-550 mt-1.5">Create, edit, publish, or archive your prompts and code Snippets.</p>
        </div>
        <Link 
          href="/seller/dashboard/listings/new"
          className="rounded-full bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition flex items-center justify-center gap-1.5 self-start sm:self-auto hover:scale-[1.01]"
        >
          <Plus className="h-4.5 w-4.5" />
          Add New Listing
        </Link>
      </div>

      {/* 2. Listings List */}
      {products.length === 0 ? (
        // Empty State Placeholder
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-850 p-12 text-center min-h-[300px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950/40 border border-zinc-800 text-zinc-500 mb-4 animate-pulse">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-bold text-zinc-300">No listings found</h3>
          <p className="text-xs text-zinc-550 max-w-sm mt-2 mb-6">
            You haven't uploaded any prompts, workflows, or templates yet. Add your first digital item now.
          </p>
          <Link 
            href="/seller/dashboard/listings/new" 
            className="rounded-full bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-xs font-semibold text-white transition shadow-md shadow-violet-500/10 flex items-center gap-1.5 group"
          >
            Create First Listing
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ) : (
        // Products list
        <div className="flex flex-col gap-4">
          {products.map((p) => {
            const displayPrice = p.isFree 
              ? "Free" 
              : `$${(p.price / 100).toFixed(2)}`
              
            const salesCount = p.purchases?.length || 0

            return (
              <div 
                key={p.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition"
              >
                
                {/* Details left */}
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-zinc-950 border border-zinc-850 overflow-hidden shrink-0">
                    <img 
                      src={p.previewImages?.[0] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80"} 
                      alt={p.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    {/* Item type and category */}
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-violet-400 uppercase tracking-widest">{p.type}</span>
                      <span className="text-[9px] text-zinc-600">•</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{p.category}</span>
                    </div>

                    {/* Listing Title */}
                    <h3 className="text-sm font-bold text-zinc-200 mt-0.5 leading-snug">
                      <Link href={`/marketplace/${p.slug}`} className="hover:underline hover:text-white transition">
                        {p.title}
                      </Link>
                    </h3>

                    {/* Meta information row */}
                    <div className="flex flex-wrap items-center gap-3.5 text-[9px] text-zinc-550 mt-1 font-medium">
                      
                      {/* Price tag */}
                      <span className={`font-semibold ${p.isFree ? "text-emerald-400" : "text-zinc-300"}`}>{displayPrice}</span>
                      <span className="text-zinc-700">•</span>

                      {/* Views count */}
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5 text-zinc-650" />
                        {p.viewCount} views
                      </span>
                      <span className="text-zinc-700">•</span>

                      {/* Sales count */}
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="h-3.5 w-3.5 text-zinc-650" />
                        {salesCount} sales
                      </span>
                      <span className="text-zinc-700">•</span>

                      {/* Created date */}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-zinc-650" />
                        Added on {new Date(p.createdAt).toLocaleDateString()}
                      </span>

                    </div>
                  </div>
                </div>

                {/* Right side status badge and actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 w-full md:w-auto border-t border-zinc-850 md:border-0 pt-3 md:pt-0 shrink-0">
                  
                  {/* Status Tag */}
                  <div>
                    {p.status === "PUBLISHED" && (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 text-[8px] font-bold text-emerald-400 uppercase tracking-wide">
                        <CheckCircle className="h-2.5 w-2.5" /> Published
                      </span>
                    )}
                    {p.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-950/40 border border-amber-800/30 px-2 py-0.5 text-[8px] font-bold text-amber-400 uppercase tracking-wide">
                        <Clock className="h-2.5 w-2.5" /> Pending
                      </span>
                    )}
                    {p.status === "DRAFT" && (
                      <span className="inline-flex items-center gap-1 rounded bg-zinc-850/80 border border-zinc-750 px-2 py-0.5 text-[8px] font-bold text-zinc-400 uppercase tracking-wide">
                        <Archive className="h-2.5 w-2.5" /> Draft
                      </span>
                    )}
                    {p.status === "ARCHIVED" && (
                      <span className="inline-flex items-center gap-1 rounded bg-zinc-950 border border-zinc-900 px-2 py-0.5 text-[8px] font-bold text-zinc-650 uppercase tracking-wide">
                        <Archive className="h-2.5 w-2.5" /> Archived
                      </span>
                    )}
                  </div>

                  {/* Actions (Edit / toggle publish) */}
                  <ListingActions productId={p.id} currentStatus={p.status} />

                </div>

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
