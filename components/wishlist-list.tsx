"use client"

import * as React from "react"
import Link from "next/link"
import { useSaved } from "@/lib/store/useSaved"
import ProductCard from "@/components/product-card"
import { Heart, ArrowRight } from "lucide-react"

interface WishlistListProps {
  initialSaved: any[]
  isDbOffline: boolean
}

export default function WishlistList({ initialSaved, isDbOffline }: WishlistListProps) {
  const savedStore = useSaved()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // In offline sandbox mode, we read directly from client-side persisted useSaved store!
  const displayItems = React.useMemo(() => {
    if (!mounted) return initialSaved

    if (isDbOffline) {
      return savedStore.items
    }

    return initialSaved
  }, [mounted, initialSaved, isDbOffline, savedStore.items])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
        <div className="h-48 bg-zinc-900/40 rounded-2xl border border-zinc-800"></div>
        <div className="h-48 bg-zinc-900/40 rounded-2xl border border-zinc-800"></div>
        <div className="h-48 bg-zinc-900/40 rounded-2xl border border-zinc-800"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {displayItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-850 p-12 text-center min-h-[300px] animate-in fade-in duration-300">
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-300">
          {displayItems.map((p) => {
            const sellerUsername = p.sellerName?.toLowerCase().replace(" ", "") || "seller"
            return (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.title}
                slug={p.slug}
                price={p.price}
                isFree={p.price === 0}
                type={p.type}
                previewImage={p.previewImage}
                sellerName={p.sellerName}
                sellerUsername={sellerUsername}
                reviews={[]}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
