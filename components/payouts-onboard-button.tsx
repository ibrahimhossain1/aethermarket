"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Wallet, Sparkles, Check } from "lucide-react"

export default function PayoutsOnboardButton() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const handleOnboard = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/seller/payouts/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await response.json()
      if (response.ok && data.url) {
        // Redirect browser directly to Stripe onboarding URL (or mock success path)
        window.location.href = data.url
      } else {
        alert(data.error || "Failed to initialize Stripe Connect onboarding. Please try again.")
      }
    } catch (error) {
      console.error("Error onboarding Stripe Connect:", error)
      alert("A connection error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleOnboard}
      disabled={loading}
      className="rounded-xl bg-violet-600 hover:bg-violet-500 hover:scale-[1.01] px-6 py-3.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
    >
      <Wallet className="h-4.5 w-4.5" />
      {loading ? "Connecting Bank Nodes..." : "Setup Payouts via Stripe Connect"}
    </button>
  )
}
