export const dynamic = "force-dynamic"

import * as React from "react"
import Link from "next/link"
import { auth } from "@/auth"
import { getBuyerSaved } from "@/lib/data"
import ProductCard from "@/components/product-card"
import { Heart, ArrowRight } from "lucide-react"

export default async function SavedPage() {
  const session = await auth()
  const userId = session!.user.id

  // Fetch wishlisted items
  const savedProducts = await getBuyerSaved(userId)

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Page Header */}
      <div className="border-b border-zinc-900 pb-4">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">My Wishlist</h1>
        <p className="text-xs text-zinc-500 mt-1">Review, manage, and checkout items you've bookmarked while browsing the exchange.</p>
      </div>

      {savedProducts.length === 0 ? (
        // Wishlist Empty State
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-850 p-12 text-center min-h-[300px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950/40 border border-zinc-800 text-zinc-500 mb-4 animate-pulse">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-bold text-zinc-300">Your wishlist is empty</h3>
          <p className="text-xs text-zinc-550 max-w-sm mt-2 mb-6">
            Keep track of advanced prompts and templates by clicking the bookmark icon on catalog listing cards.
          </p>
          <Link 
            href="/marketplace" 
            className="rounded-full bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-xs font-semibold text-white transition shadow-md shadow-violet-500/10 flex items-center gap-1 group"
          >
            Explore Catalog
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ) : (
        // Grid display
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedProducts.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              title={p.title}
              slug={p.slug}
              price={p.price}
              isFree={p.isFree}
              type={p.type}
              previewImage={p.previewImages?.[0]}
              sellerName={p.seller?.name ?? "Seller"}
              sellerUsername={p.seller?.name?.toLowerCase().replace(" ", "") ?? "seller"}
              reviews={p.reviews}
            />
          ))}
        </div>
      )}

    </div>
  )
}
