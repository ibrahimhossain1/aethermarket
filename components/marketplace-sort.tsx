"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ArrowUpDown } from "lucide-react"

export default function MarketplaceSort() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [sort, setSort] = React.useState(searchParams.get("sort") || "newest")

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSort(val)

    const params = new URLSearchParams(searchParams.toString())
    if (val === "newest") {
      params.delete("sort")
    } else {
      params.set("sort", val)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-1.5 backdrop-blur-sm">
      <ArrowUpDown className="h-3.5 w-3.5 text-zinc-500" />
      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest hidden sm:inline-block">Sort</span>
      <select
        value={sort}
        onChange={handleSortChange}
        className="bg-transparent text-xs text-zinc-300 outline-none cursor-pointer pr-1"
      >
        <option value="newest" className="bg-zinc-900 text-zinc-300">Newest</option>
        <option value="popular" className="bg-zinc-900 text-zinc-300">Most Popular</option>
        <option value="price-low" className="bg-zinc-900 text-zinc-300">Price: Low to High</option>
        <option value="price-high" className="bg-zinc-900 text-zinc-300">Price: High to Low</option>
      </select>
    </div>
  )
}
