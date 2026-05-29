"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/providers"
import { ShoppingCart, Heart, Download, CreditCard, Sparkles, Check } from "lucide-react"
import { useCart, CartItem } from "@/lib/store/useCart"
import { useSaved } from "@/lib/store/useSaved"

interface ProductDetailActionsProps {
  product: {
    id: string
    title: string
    price: number
    isFree: boolean
    type: "PROMPT" | "SKILL" | "CODE"
    slug: string
    sellerName: string
    previewImage?: string
  }
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const router = useRouter()
  const { data: session } = useSession()
  
  const { id, title, price, isFree, type, slug, sellerName, previewImage } = product

  const cart = useCart()
  const saved = useSaved()

  const inCart = cart.isInCart(id)
  const isSaved = saved.isSaved(id)

  const [loading, setLoading] = React.useState(false)
  const [purchasedFree, setPurchasedFree] = React.useState(false)

  const handleCartToggle = () => {
    if (inCart) {
      cart.removeItem(id)
    } else {
      cart.addItem({
        id,
        title,
        price,
        type,
        slug,
        sellerName,
        previewImage
      })
    }
  }

  const handleWishlistToggle = () => {
    saved.toggleSaved({
      id,
      title,
      price,
      type,
      slug,
      sellerName,
      previewImage
    })
  }

  const handleCheckout = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/marketplace/${slug}`)
      return
    }

    setLoading(true)
    try {
      // 1. Paid product Stripe Checkout
      if (!isFree) {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ productId: id })
        })

        const data = await response.json()
        if (response.ok && data.url) {
          window.location.href = data.url
        } else {
          alert(data.error || "Checkout session initialization failed. Please try again.")
        }
      } else {
        // 2. Free product instant-purchase API route
        const response = await fetch("/api/purchase/free", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ productId: id })
        })

        const data = await response.json()
        if (response.ok) {
          setPurchasedFree(true)
          // Initiate signed download URL retrieval
          router.push(`/dashboard/purchases`)
        } else {
          alert(data.error || "Failed to process free registration.")
        }
      }
    } catch (error) {
      console.error("Error in action handler:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3.5 w-full">
      
      {/* 1. PRIMARY ACTION: Buy Now or Free Instant Download */}
      {purchasedFree ? (
        <button 
          onClick={() => router.push("/dashboard/purchases")}
          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Check className="h-4 w-4" />
          Added to Purchases! Download Now
        </button>
      ) : (
        <button 
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full rounded-xl py-3.5 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
            isFree 
              ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20" 
              : "bg-violet-600 hover:bg-violet-500 shadow-violet-500/20"
          } disabled:opacity-50`}
        >
          {isFree ? (
            <>
              <Download className="h-4 w-4" />
              {loading ? "Processing..." : "Download Instantly (Free)"}
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              {loading ? "Initializing..." : `Buy Now — $${(price / 100).toFixed(2)}`}
            </>
          )}
        </button>
      )}

      {/* 2. SECONDARY ACTIONS ROW */}
      {!purchasedFree && (
        <div className="flex items-center gap-3">
          {/* Add to Cart */}
          {!isFree && (
            <button 
              onClick={handleCartToggle}
              className={`flex-1 rounded-xl border border-zinc-800 py-3 text-xs font-semibold transition flex items-center justify-center gap-2 ${
                inCart 
                  ? "bg-zinc-800 text-white border-zinc-700" 
                  : "bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {inCart ? "In Cart" : "Add to Cart"}
            </button>
          )}

          {/* Save to Wishlist */}
          <button 
            onClick={handleWishlistToggle}
            className={`rounded-xl border border-zinc-800 p-3 text-zinc-400 hover:text-white hover:border-zinc-750 transition flex items-center justify-center ${
              isFree ? "w-full" : "w-12"
            } ${isSaved ? "bg-rose-950/20 border-rose-900/40 text-rose-500" : "bg-zinc-900/60"}`}
            title="Save to Wishlist"
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
            {isFree && <span className="text-xs font-semibold ml-2">{isSaved ? "Saved" : "Save to Wishlist"}</span>}
          </button>
        </div>
      )}

      {/* 3. TRUST SIGNALS */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-3 mt-1">
        <ul className="text-[10px] text-zinc-500 flex flex-col gap-2 font-medium">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400"></span>
            Instant delivery via secure digital link
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
            Lifetime access and download logs
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Verified safe and secure Stripe checkout
          </li>
        </ul>
      </div>

    </div>
  )
}
