"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Edit3, CheckCircle, Clock, Archive, ArrowUpRight } from "lucide-react"

interface ListingActionsProps {
  productId: string
  currentStatus: "DRAFT" | "PENDING" | "PUBLISHED" | "ARCHIVED"
}

export default function ListingActions({ productId, currentStatus }: ListingActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const handleStatusChange = async (targetStatus: "DRAFT" | "PENDING" | "PUBLISHED" | "ARCHIVED") => {
    setLoading(true)
    try {
      const response = await fetch("/api/listings/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId, status: targetStatus })
      })

      const data = await response.json()
      if (response.ok) {
        alert(data.message)
        router.refresh()
      } else {
        alert(data.error || "Failed to update listing status.")
      }
    } catch (err) {
      console.error("Error updating status:", err)
      alert("A connection error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      
      {/* Edit Link */}
      <Link
        href={`/seller/dashboard/listings/${productId}/edit`}
        className="rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 p-2 text-zinc-400 hover:text-white transition flex items-center justify-center gap-1.5 text-[10px] font-bold"
        title="Edit product data"
      >
        <Edit3 className="h-3.5 w-3.5" />
        Edit Data
      </Link>

      {/* Publish or Submit for Approval */}
      {currentStatus === "DRAFT" && (
        <button
          onClick={() => handleStatusChange("PENDING")}
          disabled={loading}
          className="rounded-lg bg-violet-600/10 hover:bg-violet-650/20 border border-violet-800/30 hover:border-violet-750/50 px-3 py-2 text-[10px] font-bold text-violet-400 transition flex items-center gap-1"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          Submit Approval
        </button>
      )}

      {/* Revert to Draft */}
      {(currentStatus === "PENDING" || currentStatus === "ARCHIVED") && (
        <button
          onClick={() => handleStatusChange("DRAFT")}
          disabled={loading}
          className="rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-2 text-[10px] font-bold text-zinc-300 hover:text-white transition flex items-center gap-1"
        >
          <Archive className="h-3.5 w-3.5" />
          Revert Draft
        </button>
      )}

      {/* Archive Listing */}
      {currentStatus === "PUBLISHED" && (
        <button
          onClick={() => handleStatusChange("ARCHIVED")}
          disabled={loading}
          className="rounded-lg bg-rose-950/10 hover:bg-rose-950/30 border border-rose-900/30 px-3 py-2 text-[10px] font-bold text-rose-400 transition flex items-center gap-1"
        >
          <Archive className="h-3.5 w-3.5" />
          Archive Listing
        </button>
      )}

    </div>
  )
}
