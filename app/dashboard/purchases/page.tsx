export const dynamic = "force-dynamic"

import * as React from "react"
import { auth } from "@/auth"
import { getBuyerPurchases } from "@/lib/data"
import { isDatabaseOffline } from "@/lib/prisma"
import PurchasesList from "@/components/purchases-list"

export default async function PurchasesPage() {
  const session = await auth()
  const userId = session!.user.id

  // Fetch all buyer purchases (supports connection mock fallback)
  const purchases = await getBuyerPurchases(userId)
  const dbOffline = isDatabaseOffline()

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="border-b border-zinc-900 pb-4">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">My Purchased Assets</h1>
        <p className="text-xs text-zinc-500 mt-1">Access secure download keys and track refund windows for your purchased products.</p>
      </div>

      <PurchasesList initialPurchases={purchases} isDbOffline={dbOffline} />

    </div>
  )
}
