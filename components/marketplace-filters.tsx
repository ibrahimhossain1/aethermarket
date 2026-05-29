"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, Star, RotateCcw, Sliders, ChevronDown } from "lucide-react"

export default function MarketplaceFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Local state initialized from URL searchParams
  const [search, setSearch] = React.useState(searchParams.get("search") || "")
  const [type, setType] = React.useState(searchParams.get("type") || "ALL")
  const [category, setCategory] = React.useState(searchParams.get("category") || "ALL")
  const [minRating, setMinRating] = React.useState(searchParams.get("minRating") || "0")
  const [isFree, setIsFree] = React.useState(searchParams.get("isFree") === "true")
  const [minPrice, setMinPrice] = React.useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = React.useState(searchParams.get("maxPrice") || "")
  const [sort, setSort] = React.useState(searchParams.get("sort") || "newest")

  const categories = ["ALL", "Development", "Marketing", "Automation", "Design Systems", "Entertainment"]

  // Trigger query parameter update
  const applyFilters = React.useCallback(() => {
    const params = new URLSearchParams()
    
    if (search.trim()) params.set("search", search.trim())
    if (type !== "ALL") params.set("type", type)
    if (category !== "ALL") params.set("category", category)
    if (minRating !== "0") params.set("minRating", minRating)
    if (isFree) params.set("isFree", "true")
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (sort !== "newest") params.set("sort", sort)

    router.push(`${pathname}?${params.toString()}`)
  }, [search, type, category, minRating, isFree, minPrice, maxPrice, sort, pathname, router])

  // Automatically apply filters when parameters that don't need submit buttons change
  React.useEffect(() => {
    applyFilters()
  }, [type, category, minRating, isFree, sort, applyFilters])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const handleClearAll = () => {
    setSearch("")
    setType("ALL")
    setCategory("ALL")
    setMinRating("0")
    setIsFree(false)
    setMinPrice("")
    setMaxPrice("")
    setSort("newest")
    router.push(pathname)
  }

  return (
    <aside className="w-full lg:w-64 flex flex-col gap-6 shrink-0 bg-zinc-950/20 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
      
      {/* 1. Header & Reset */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-100 uppercase tracking-wider">
          <Sliders className="h-4 w-4 text-violet-500" />
          Filter Engine
        </div>
        <button 
          onClick={handleClearAll}
          className="text-[10px] font-semibold text-zinc-500 hover:text-rose-400 transition flex items-center gap-1 uppercase tracking-widest"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* 2. Full-Text Search Input */}
      <div>
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Refine keywords</h4>
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            placeholder="Type and press Enter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-2.5 pl-3.5 pr-10 text-xs text-zinc-200 placeholder-zinc-650 outline-none transition focus:border-violet-600 focus:ring-1 focus:ring-violet-500/20"
          />
          <button type="submit" className="absolute right-3 top-3 text-zinc-500 hover:text-violet-400">
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* 3. Product Type Tabs */}
      <div>
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Product Type</h4>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-850">
          {["ALL", "PROMPT", "SKILL", "CODE"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-lg py-1.5 text-[10px] font-bold transition uppercase tracking-wider ${
                type === t 
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/10" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t === "SKILL" ? "Workflow" : t.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Category Dropdown */}
      <div>
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Category</h4>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none rounded-xl bg-zinc-900/60 border border-zinc-800 py-2.5 px-3.5 text-xs text-zinc-300 outline-none focus:border-violet-600 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-zinc-900 text-zinc-300">
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      {/* 5. Price Filters */}
      <div className="border-t border-zinc-900 pt-4">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Price Structure</h4>
        
        {/* Free Toggle */}
        <label className="flex items-center justify-between cursor-pointer rounded-xl bg-zinc-900/40 border border-zinc-850 p-2.5 hover:border-zinc-700 transition mb-3">
          <span className="text-xs text-zinc-300">Free items only</span>
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => {
              setIsFree(e.target.checked)
              if (e.target.checked) {
                setMinPrice("")
                setMaxPrice("")
              }
            }}
            className="h-3.5 w-3.5 rounded border-zinc-800 bg-zinc-900 text-violet-600 focus:ring-violet-500"
          />
        </label>

        {/* Price Inputs */}
        {!isFree && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2 text-[10px] font-semibold text-zinc-650">$</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={applyFilters}
                className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 py-1.5 pl-5 pr-2 text-xs text-zinc-300 outline-none focus:border-violet-600"
              />
            </div>
            <span className="text-zinc-600 text-xs">—</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2 text-[10px] font-semibold text-zinc-650">$</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={applyFilters}
                className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 py-1.5 pl-5 pr-2 text-xs text-zinc-300 outline-none focus:border-violet-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* 6. Ratings Filters */}
      <div className="border-t border-zinc-900 pt-4">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Minimum Rating</h4>
        <div className="flex flex-col gap-2">
          {["0", "4", "3"].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex items-center gap-2 rounded-xl p-2 text-left border text-xs transition ${
                minRating === r 
                  ? "bg-violet-950/20 border-violet-850 text-violet-400 font-semibold" 
                  : "bg-zinc-900/20 border-transparent text-zinc-450 hover:bg-zinc-900/60"
              }`}
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-3 w-3 ${
                      r !== "0" && star <= parseInt(r) 
                        ? "fill-amber-500 text-amber-500" 
                        : "text-zinc-700"
                    }`} 
                  />
                ))}
              </div>
              <span className="text-[10px]">
                {r === "0" ? "All Ratings" : `${r}.0 & Up`}
              </span>
            </button>
          ))}
        </div>
      </div>

    </aside>
  )
}
