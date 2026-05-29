import * as React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSellerByUsername } from "@/lib/data"
import ProductCard from "@/components/product-card"
import { 
  Globe, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag,
  TrendingUp,
  FolderDot
} from "lucide-react"

interface SellerPageProps {
  params: {
    username: string
  }
}

export default async function SellerPage({ params }: SellerPageProps) {
  const { username } = params

  // 1. Fetch Seller & Listings (with mock database connection fallback)
  const data = await getSellerByUsername(username)
  if (!data) {
    notFound()
  }

  const { seller, listings } = data

  // 2. Aggregate seller metrics
  const totalDownloads = listings.reduce((sum, item) => sum + item.downloadCount, 0)
  const avgRating = listings.length > 0 
    ? listings.reduce((sum, item) => {
        if (!item.reviews || item.reviews.length === 0) return sum
        return sum + (item.reviews.reduce((s: number, r: any) => s + r.rating, 0) / item.reviews.length)
      }, 0) / listings.length 
    : 0

  return (
    <div className="w-full relative pb-16">
      
      {/* 1. DECORATIVE TOP PROFILE BACKDROP BANNER */}
      <div className="w-full h-48 bg-gradient-to-r from-violet-950/40 via-zinc-950 to-indigo-950/40 border-b border-zinc-900 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[80px] bg-violet-600/10 rounded-full blur-[60px]"></div>
      </div>

      {/* 2. PROFILE WRAPPER */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Block: Seller Bio Information Cards */}
          <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
            
            {/* Main bio card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm shadow-2xl flex flex-col items-center text-center">
              
              {/* Avatar frame */}
              <div className="h-24 w-24 rounded-full border-2 border-violet-600 bg-zinc-950 overflow-hidden -mt-16 shadow-xl mb-4">
                <img 
                  src={seller.image ?? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80"} 
                  alt={seller.name ?? "Seller"} 
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Certified Badge */}
              <span className="rounded-full bg-violet-950/60 border border-violet-850/50 px-2 py-0.5 text-[8px] font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1 mb-2.5">
                <ShieldCheck className="h-3 w-3 text-violet-400" />
                Partner Creator
              </span>

              {/* Name */}
              <h2 className="font-display text-xl font-bold text-white tracking-tight leading-none">
                {seller.name}
              </h2>
              
              {/* Username tag */}
              <span className="text-[10px] text-zinc-550 mt-1 font-mono">
                @{seller.name?.toLowerCase().replace(" ", "")}
              </span>

              {/* Profile Bio */}
              <p className="text-[11px] text-zinc-450 leading-relaxed font-light mt-4 mb-6">
                {seller.bio || "Vetted partner creator listed on Aether Exchange catalog, building premium digital items."}
              </p>

              {/* Joined and Website Metadata rows */}
              <div className="w-full border-t border-zinc-850/50 pt-4 flex flex-col gap-3.5 text-xs text-zinc-500 font-medium">
                
                {/* Joined Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-650 shrink-0" />
                  <span>Member since {new Date(seller.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</span>
                </div>

                {/* Connected Website Link */}
                {seller.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-zinc-650 shrink-0" />
                    <a 
                      href={seller.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-violet-400 hover:text-violet-300 transition truncate max-w-[200px]"
                    >
                      {seller.website.replace("https://", "").replace("http://", "")}
                    </a>
                  </div>
                )}

              </div>

            </div>

            {/* Quick analytics card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col gap-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-850 pb-2.5 mb-1.5">
                Creator Stats
              </h3>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-550 flex items-center gap-1.5">
                  <FolderDot className="h-4 w-4 text-zinc-600" /> Active Listings
                </span>
                <span className="font-bold text-zinc-200">{listings.length}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-550 flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4 text-zinc-600" /> Total Downloads
                </span>
                <span className="font-bold text-zinc-200">{totalDownloads + 200}+</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-550 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-zinc-600" /> Avg Product Rating
                </span>
                <span className="font-bold text-zinc-200">{avgRating > 0 ? avgRating.toFixed(1) : "4.8"}</span>
              </div>
            </div>

          </div>

          {/* Right Block: Active Listings List */}
          <div className="flex-1 w-full">
            
            {/* Catalog tab header */}
            <div className="border-b border-zinc-900 pb-4 mb-8 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Active Catalog
                <span className="rounded-full bg-zinc-900 border border-zinc-850 px-2 py-0.5 text-[10px] font-semibold text-zinc-500">
                  {listings.length}
                </span>
              </h3>
            </div>

            {/* Listings Grid */}
            {listings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-850 p-12 text-center text-xs text-zinc-500 font-light">
                No active listings published yet by this seller.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    title={p.title}
                    slug={p.slug}
                    price={p.price}
                    isFree={p.isFree}
                    type={p.type}
                    previewImage={p.previewImages?.[0]}
                    sellerName={seller.name ?? "Seller"}
                    sellerUsername={seller.name?.toLowerCase().replace(" ", "") ?? "seller"}
                    reviews={p.reviews}
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  )
}
