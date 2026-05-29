export const dynamic = "force-dynamic"

import * as React from "react"
import { Suspense } from "react"
import { getProducts } from "@/lib/data"
import ProductCard from "@/components/product-card"
import MarketplaceFilters from "@/components/marketplace-filters"
import MarketplaceSort from "@/components/marketplace-sort"
import MarketplaceSearch from "@/components/marketplace-search"
import { Sparkles, ShoppingBag, SearchSlash } from "lucide-react"

interface MarketplacePageProps {
  searchParams: {
    search?: string
    type?: string
    category?: string
    minRating?: string
    sort?: string
    isFree?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  // 1. Process query parameters into typed filters
  const search = searchParams.search || ""
  const type = searchParams.type || "ALL"
  const category = searchParams.category || "ALL"
  const minRating = searchParams.minRating ? parseInt(searchParams.minRating) : 0
  const sort = searchParams.sort || "newest"
  const isFree = searchParams.isFree === "true" ? true : undefined

  let priceRange: [number, number] | undefined = undefined
  const minP = searchParams.minPrice ? parseFloat(searchParams.minPrice) : NaN
  const maxP = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : NaN

  if (!isNaN(minP) || !isNaN(maxP)) {
    priceRange = [
      isNaN(minP) ? 0 : Math.round(minP * 100),
      isNaN(maxP) ? 99999999 : Math.round(maxP * 100),
    ]
  }

  // 2. Fetch products from DB (with fail-soft mock fallback)
  const products = await getProducts({
    search,
    type,
    category,
    minRating,
    sort,
    isFree,
    priceRange,
  })

  // Determine dynamic headers based on 'type' query param
  let headerTitle = "Unified Assets Exchange"
  let headerDesc = "Discover vetted AI prompts, serverless blueprints, and high-performance developer templates."
  let badgeText = "Vetted Digital Library"
  let themeGlowColor = "from-zinc-950 via-zinc-950/80 to-violet-950/20"
  let badgeColorClass = "text-violet-400 border-violet-900/30 bg-violet-950/10"

  if (type === "PROMPT") {
    headerTitle = "Generative AI Prompts"
    headerDesc = "Engineered system instructions and master scripts designed for GPT-4o, Claude 3.5, and Midjourney."
    badgeText = "Prompt Engineering"
    themeGlowColor = "from-zinc-950 via-zinc-950/80 to-purple-950/20"
    badgeColorClass = "text-purple-400 border-purple-900/30 bg-purple-950/10"
  } else if (type === "SKILL") {
    headerTitle = "Workflows & Skills"
    headerDesc = "Pre-configured automation blueprints, n8n JSON nodes, and serverless workflow orchestrations."
    badgeText = "Modular Automation"
    themeGlowColor = "from-zinc-950 via-zinc-950/80 to-indigo-950/20"
    badgeColorClass = "text-indigo-400 border-indigo-900/30 bg-indigo-950/10"
  } else if (type === "CODE") {
    headerTitle = "Developer Snippets"
    headerDesc = "High-performance TypeScript serverless routes, Tailwind UI components, and Next.js templates."
    badgeText = "Typed Codebases"
    themeGlowColor = "from-zinc-950 via-zinc-950/80 to-emerald-950/20"
    badgeColorClass = "text-emerald-400 border-emerald-900/30 bg-emerald-950/10"
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. STUNNING DYNAMIC HERO BANNER */}
      <div className={`relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br ${themeGlowColor} p-6 sm:p-8 md:p-10 mb-10 shadow-2xl backdrop-blur-md`}>
        {/* Glow circles inside the card */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-violet-600/5 rounded-full blur-[80px] -z-10 animate-pulse"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] -z-10"></div>
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4 transition-all duration-300 ${badgeColorClass}`}>
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              {badgeText}
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-none">
              {headerTitle}
            </h1>
            
            <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-xl font-light leading-relaxed">
              {headerDesc}
            </p>
          </div>

          <div className="w-full lg:w-auto shrink-0 flex items-center">
            <div className="w-full lg:w-[450px]">
              <Suspense fallback={<div className="w-full h-12 bg-zinc-900/60 rounded-full animate-pulse border border-zinc-800" />}>
                <MarketplaceSearch />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RESULTS SUMMARY & SORT BAR */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <ShoppingBag className="h-4 w-4 text-zinc-500" />
          <span className="font-bold text-zinc-300">{products.length}</span>
          <span>{products.length === 1 ? "listing" : "listings"} found</span>
        </div>
        
        {/* top-right sorting select dropdown */}
        <MarketplaceSort />
      </div>

      {/* 3. COLUMNS WRAPPER */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Filter Sidebar */}
        <Suspense fallback={<div className="w-full lg:w-64 h-[400px] bg-zinc-950/20 border border-zinc-800 rounded-2xl animate-pulse" />}>
          <MarketplaceFilters />
        </Suspense>

        {/* Right Column: Listing Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            // No Results Card
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 p-12 text-center h-[50vh] min-h-[320px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 mb-4 animate-bounce">
                <SearchSlash className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-zinc-200">No assets found</h3>
              <p className="text-xs text-zinc-550 max-w-sm mt-2 mb-6">
                We couldn't find any products matching your search keywords or active filters. Try adjusting your filters or search keywords.
              </p>
              <a 
                href="/marketplace"
                className="rounded-full bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-xs font-semibold text-white transition shadow-md shadow-violet-500/10"
              >
                Clear Search & Filters
              </a>
            </div>
          ) : (
            // Product Grid
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  slug={p.slug}
                  price={p.price}
                  isFree={p.isFree}
                  type={p.type}
                  previewImage={p.previewImages?.[0]}
                  sellerName={p.seller?.name ?? "Seller"}
                  sellerUsername={p.seller?.name?.toLowerCase().replace(" ", "") ?? "seller"}
                  reviews={p.reviews}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
