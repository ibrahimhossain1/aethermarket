"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HelpCircle, RefreshCw, CheckCircle2 } from "lucide-react"

interface RefundButtonProps {
  purchaseId: string
  createdAt: Date | string
  refunded: boolean
  onRefundSuccess?: () => void
}

export default function RefundButton({ purchaseId, createdAt, refunded, onRefundSuccess }: RefundButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [isRefunded, setIsRefunded] = React.useState(refunded)

  // Verify if purchase is within the 7-day refund eligibility window
  const purchaseTime = new Date(createdAt).getTime()
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const isEligible = purchaseTime >= sevenDaysAgo && !isRefunded

  const handleRefundClick = async () => {
    const confirmRefund = window.confirm(
      "⚠️ WARNING: Are you sure you want to request a refund? \n\n" +
      "This will immediately submit a rollback request to Stripe and revoke your download access to this product."
    )

    if (!confirmRefund) return

    setLoading(true)
    try {
      const response = await fetch("/api/purchase/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ purchaseId })
      })

      const data = await response.json()
      if (response.ok) {
        setIsRefunded(true)
        if (onRefundSuccess) onRefundSuccess()
        alert("Success! Your refund was successfully processed. Funds have been returned to your card.")
        router.refresh()
      } else {
        alert(data.error || "Failed to process refund request.")
      }
    } catch (error) {
      console.error("Error submitting refund:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (isRefunded) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-950/40 border border-rose-900/30 px-3 py-1.5 text-[10px] font-bold text-rose-500 uppercase tracking-widest">
        Refunded
      </span>
    )
  }

  if (!isEligible) {
    return (
      <span className="text-[10px] text-zinc-650 font-medium select-none cursor-not-allowed">
        Refund window closed (7d expired)
      </span>
    )
  }

  return (
    <button
      onClick={handleRefundClick}
      disabled={loading}
      className="rounded-lg border border-rose-900/40 bg-rose-950/10 hover:bg-rose-950/30 hover:border-rose-900/60 px-3.5 py-1.5 text-[10px] font-bold text-rose-400 transition flex items-center gap-1.5 disabled:opacity-50"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Refunding..." : "Request 7d Refund"}
    </button>
  )
}
