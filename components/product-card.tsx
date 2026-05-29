"use client"

import * as React from "react"
import Link from "next/link"
import { Star, ArrowRight, Bookmark } from "lucide-react"
import { useSaved } from "@/lib/store/useSaved"

export interface ProductCardProps {
  id: string
  title: string
  slug: string
  price: number // in cents
  isFree: boolean
  type: "PROMPT" | "SKILL" | "CODE"
  previewImage?: string
  sellerName: string
  sellerUsername: string
  reviews?: Array<{ rating: number }>
}

export default function ProductCard({
  id,
  title,
  slug,
  price,
  isFree,
  type,
  previewImage,
  sellerName,
  sellerUsername,
  reviews = []
}: ProductCardProps) {
  const toggleSaved = useSaved((state) => state.toggleSaved)
  const isSaved = useSaved((state) => state.isSaved(id))
  
  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0

  const displayPrice = isFree 
    ? <span className="text-emerald-500 font-semibold text-sm">Free</span>
    : <span className="text-white font-medium text-sm">${(price / 100).toFixed(2)}</span>

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleSaved({
      id,
      title,
      price,
      type,
      slug,
      sellerName,
      previewImage
    })
  }

  return (
    <Link 
      href={`/marketplace/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-600 hover:shadow-xl hover:shadow-violet-600/5"
    >
      {/* Product Type Label */}
      <span className="absolute left-3 top-3 z-10 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-violet-400">
        {type}
      </span>

      {/* Save to Wishlist Bookmark */}
      <button 
        onClick={handleSaveToggle}
        className="absolute right-3 top-3 z-10 p-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-zinc-400 hover:text-rose-500 hover:scale-105 transition"
        title={isSaved ? "Saved" : "Save item"}
      >
        <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
      </button>

      {/* Image Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
        {previewImage ? (
          <img 
            src={previewImage} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-950/50">
            <span className="text-xs text-zinc-600 font-display">AETHER LISTING</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
          <span className="text-[10px] font-semibold text-white flex items-center gap-1">
            View Details <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* Vetted Seller Username */}
          <span className="text-[10px] text-zinc-500 hover:text-violet-400 transition font-medium">
            @{sellerUsername.replace("@", "").toLowerCase()}
          </span>
          
          {/* Title */}
          <h3 className="mt-1 line-clamp-1 font-display text-sm font-semibold text-zinc-100 leading-tight group-hover:text-white transition-colors">
            {title}
          </h3>
        </div>

        {/* Rating & Price Row */}
        <div className="mt-3 flex items-center justify-between border-t border-zinc-800/50 pt-2.5">
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            <Star className={`h-3.5 w-3.5 ${avgRating > 0 ? "fill-amber-500 text-amber-500" : "text-zinc-600"}`} />
            <span className="text-xs font-semibold text-zinc-300">
              {avgRating > 0 ? avgRating.toFixed(1) : "—"}
            </span>
            {reviews.length > 0 && (
              <span className="text-[9px] text-zinc-600">({reviews.length})</span>
            )}
          </div>

          {/* Price Badge */}
          <div className="rounded-full bg-zinc-950/40 border border-zinc-850 px-2.5 py-0.5 flex items-center justify-center">
            {displayPrice}
          </div>
        </div>
      </div>
    </Link>
  )
}
