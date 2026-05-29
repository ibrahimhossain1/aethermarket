export const dynamic = "force-dynamic"

import * as React from "react"
import { auth } from "@/auth"
import { getBuyerSaved } from "@/lib/data"
import { isDatabaseOffline } from "@/lib/prisma"
import WishlistList from "@/components/wishlist-list"

export default async function SavedPage() {
  const session = await auth()
  const userId = session!.user.id

  // Fetch wishlisted items from database (empty fallback in offline mode)
  const savedProducts = await getBuyerSaved(userId)
  const dbOffline = isDatabaseOffline()

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="border-b border-zinc-900 pb-4">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">My Wishlist</h1>
        <p className="text-xs text-zinc-500 mt-1">Review, manage, and checkout items you've bookmarked while browsing the exchange.</p>
      </div>

      <WishlistList initialSaved={savedProducts} isDbOffline={dbOffline} />

    </div>
  )
}
