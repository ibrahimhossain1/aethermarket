"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function MarketplaceSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""

  const type = searchParams.get("type") || "ALL"

  let placeholder = "Search GPT prompts, n8n blueprints, typescript snippets..."
  if (type === "PROMPT") {
    placeholder = "Search system prompts, Claude agents, Midjourney..."
  } else if (type === "SKILL") {
    placeholder = "Search n8n blueprints, Zapier workflows, automated pipelines..."
  } else if (type === "CODE") {
    placeholder = "Search React components, tailwind configs, serverless routes..."
  }

  const [query, setQuery] = React.useState(initialSearch)

  // Keep state in sync with URL queries (e.g. if filters are cleared)
  React.useEffect(() => {
    setQuery(searchParams.get("search") || "")
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    
    if (query.trim()) {
      params.set("search", query.trim())
    } else {
      params.delete("search")
    }
    
    router.push(`/marketplace?${params.toString()}`)
  }

  const handleClear = () => {
    setQuery("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    router.push(`/marketplace?${params.toString()}`)
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative w-full max-w-xl bg-zinc-950/40 rounded-full border border-zinc-800 focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/25 transition-all duration-300 flex items-center p-1.5 shadow-lg shadow-black/40 backdrop-blur-sm"
    >
      <div className="flex-1 flex items-center pl-3.5 gap-2.5">
        <Search className="h-4.5 w-4.5 text-zinc-500 shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-xs sm:text-sm text-zinc-200 placeholder-zinc-550 outline-none pr-3"
        />
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200 transition"
            title="Clear query"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        
        <button
          type="submit"
          className="rounded-full bg-violet-600 hover:bg-violet-500 py-2 px-5 text-[11px] font-bold text-white transition shadow-md shadow-violet-500/20 active:scale-95"
        >
          Search
        </button>
      </div>
    </form>
  )
}
