"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/store/useCart"
import { useSession } from "@/components/providers"
import { X, Trash2, ShoppingBag, ArrowRight, CreditCard, Sparkles } from "lucide-react"

export default function CartDrawer() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, isOpen, closeCart, removeItem, totalPrice } = useCart()
  const [loading, setLoading] = React.useState(false)

  // Close drawer on Escape keypress
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [closeCart])

  if (!isOpen) return null

  const handleCheckout = async () => {
    if (!session) {
      closeCart()
      router.push(`/auth/signin?callbackUrl=/marketplace`)
      return
    }

    if (items.length === 0) return

    setLoading(true)
    try {
      const firstItem = items[0]
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: firstItem.id })
      })

      const data = await response.json()
      if (response.ok && data.url) {
        // Remove item from cart since we are initiating checkout
        removeItem(firstItem.id)
        window.location.href = data.url
      } else {
        alert(data.error || "Checkout initialization failed. Please try again.")
      }
    } catch (error) {
      console.error("Error during cart checkout:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const subtotal = totalPrice()

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with backdrop blur */}
      <div 
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={closeCart}
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md transform transition-all duration-300 ease-in-out slide-in-from-right animate-in">
          
          {/* Drawer container */}
          <div className="flex h-full flex-col border-l border-zinc-800 bg-zinc-950/95 p-6 shadow-2xl backdrop-blur-md">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-violet-500" />
                <h2 className="font-display text-lg font-bold text-white tracking-tight">Shopping Cart</h2>
                <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold text-zinc-400 border border-zinc-800 shrink-0">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <button 
                onClick={closeCart}
                className="rounded-full p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900/60 border border-zinc-800 text-zinc-500 mb-4 animate-pulse">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-zinc-300">Your cart is empty</h3>
                  <p className="text-xs text-zinc-550 mt-1.5 mb-6 max-w-[240px] leading-relaxed">
                    Explore the exchange catalog to find premium AI prompts, workflows, and snippets!
                  </p>
                  <button 
                    onClick={() => {
                      closeCart()
                      router.push("/marketplace")
                    }}
                    className="rounded-full bg-violet-600 hover:bg-violet-500 px-5 py-2 text-xs font-semibold text-white transition flex items-center gap-1 group shadow-md shadow-violet-500/10"
                  >
                    Browse Listings
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center gap-3.5 rounded-xl border border-zinc-900 bg-zinc-950/40 p-3 hover:border-zinc-800 transition group"
                    >
                      {/* Image Preview */}
                      <div className="h-14 w-14 rounded-lg bg-zinc-900 border border-zinc-850 overflow-hidden shrink-0">
                        <img 
                          src={item.previewImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80"} 
                          alt={item.title} 
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>

                      {/* Title & Type */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[8px] font-bold text-violet-400 uppercase tracking-widest leading-none">
                          {item.type}
                        </span>
                        <h4 
                          onClick={() => {
                            closeCart()
                            router.push(`/marketplace/${item.slug}`)
                          }}
                          className="text-xs font-bold text-zinc-200 truncate mt-0.5 hover:text-white cursor-pointer transition leading-snug"
                        >
                          {item.title}
                        </h4>
                        <p className="text-[9px] text-zinc-550 mt-0.5 truncate">
                          by @{item.sellerName.toLowerCase().replace(" ", "")}
                        </p>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0 pl-1">
                        <span className="text-xs font-bold text-zinc-100">
                          {item.price === 0 ? "Free" : `$${(item.price / 100).toFixed(2)}`}
                        </span>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="rounded p-1 text-zinc-550 hover:text-rose-400 hover:bg-rose-950/20 transition"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="border-t border-zinc-900 pt-4 flex flex-col gap-4">
                
                {/* Checkout Notice if multiple items */}
                {items.length > 1 && (
                  <div className="rounded-lg bg-violet-950/10 border border-violet-900/30 p-2 text-[10px] text-violet-400 flex items-start gap-1.5 font-light leading-relaxed animate-in fade-in">
                    <Sparkles className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
                    <span>
                      Notice: Checkout will process the first item in your cart (<strong>{items[0].title}</strong>) first.
                    </span>
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-zinc-500 font-medium">Subtotal</span>
                  <span className="font-bold text-white">${(subtotal / 100).toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] border-b border-zinc-900 pb-3 px-1">
                  <span className="text-zinc-550">Processing Fee</span>
                  <span className="text-zinc-400 font-medium">Included</span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-semibold text-zinc-300">Estimated Total</span>
                  <span className="text-lg font-bold text-violet-450">${(subtotal / 100).toFixed(2)}</span>
                </div>

                {/* Checkout CTA */}
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
                >
                  <CreditCard className="h-4 w-4" />
                  {loading ? "Processing..." : `Checkout Now`}
                </button>

                <p className="text-[9px] text-zinc-650 text-center leading-relaxed">
                  Secured digital downloads are delivered instantly after checkout completes.
                </p>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
