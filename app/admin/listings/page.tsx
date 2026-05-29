"use client"

import * as React from "react"
import { 
  Layers, 
  Check, 
  X, 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  FileCode,
  Sparkles
} from "lucide-react"

interface Listing {
  id: string
  title: string
  slug: string
  type: "PROMPT" | "SKILL" | "CODE"
  category: string
  price: number
  isFree: boolean
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "ARCHIVED"
  createdAt: string
  seller: {
    name: string | null
    email: string
  }
  description: string
}

export default function CatalogApprovalPage() {
  const [listings, setListings] = React.useState<Listing[]>([])
  const [loading, setLoading] = React.useState(true)
  const [toastMessage, setToastMessage] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")
  const [processingId, setProcessingId] = React.useState<string | null>(null)

  // Fetch pending listings
  React.useEffect(() => {
    async function loadListings() {
      try {
        const res = await fetch("/api/admin/listings?status=PENDING")
        if (!res.ok) throw new Error("Failed to fetch pending listings queue.")
        const data = await res.json()
        setListings(data.listings || [])
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to load approval queue.")
      } finally {
        setLoading(false)
      }
    }
    loadListings()
  }, [])

  // Approve listing (sets status to PUBLISHED)
  const handleApprove = async (productId: string, title: string) => {
    setProcessingId(productId)
    setToastMessage("")
    setErrorMessage("")

    try {
      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, newStatus: "PUBLISHED" })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to approve listing.")

      setToastMessage(`Excellent! "${title}" has been whitelisted and is now live on the public Aether Marketplace.`)
      // Remove from pending list
      setListings(prev => prev.filter(item => item.id !== productId))
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during listing approval.")
    } finally {
      setProcessingId(null)
    }
  }

  // Reject/Archive listing (sets status to ARCHIVED)
  const handleReject = async (productId: string, title: string) => {
    if (!confirm(`Are you sure you want to reject and archive "${title}"?`)) {
      return
    }

    setProcessingId(productId)
    setToastMessage("")
    setErrorMessage("")

    try {
      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, newStatus: "ARCHIVED" })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to reject listing.")

      setToastMessage(`Listing "${title}" rejected and archived successfully.`)
      // Remove from pending list
      setListings(prev => prev.filter(item => item.id !== productId))
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during listing rejection.")
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Page Header */}
      <div>
        <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest border-b border-zinc-900 pb-3 mb-1">Catalog Approval Ledger</h2>
        <p className="text-xs text-zinc-550">Review, preview, and whitelist pending seller submissions to maintain quality control.</p>
      </div>

      {/* Toast Alerts */}
      {toastMessage && (
        <div className="rounded-xl border border-emerald-900 bg-emerald-950/20 p-4 text-xs font-semibold text-emerald-400 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          {toastMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-rose-900 bg-rose-950/20 p-4 text-xs font-semibold text-rose-400 flex items-center gap-2 animate-fadeIn">
          <XCircle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Pending Items Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-2 text-zinc-500 font-light border border-dashed border-zinc-850 rounded-2xl">
          <Clock className="h-8 w-8 text-zinc-600 animate-spin" />
          <span className="text-xs">Accessing curation pipeline queue...</span>
        </div>
      ) : listings.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center gap-2 border border-dashed border-zinc-850 rounded-2xl">
          <Check className="h-8 w-8 text-emerald-400 border border-emerald-950 bg-emerald-950/20 rounded-full p-1" />
          <span className="text-xs text-zinc-200 font-medium">All Caught Up!</span>
          <span className="text-[10px] text-zinc-500">There are no pending submissions awaiting administrator audit.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          
          <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider font-mono flex items-center gap-1.5 pl-1">
            <Clock className="h-4 w-4 text-indigo-400 animate-pulse" />
            {listings.length} Submissions Awaiting Approval
          </div>

          <div className="grid grid-cols-1 gap-5">
            {listings.map((item) => (
              <div 
                key={item.id}
                className="rounded-2xl border border-zinc-850 bg-zinc-950/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6 transition hover:border-zinc-800"
              >
                
                {/* 1. Details Area */}
                <div className="flex flex-col gap-3 max-w-2xl flex-1">
                  
                  {/* Category & Type Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                      item.type === "CODE" 
                        ? "bg-indigo-950/40 text-indigo-400 border border-indigo-900/30" 
                        : item.type === "SKILL" 
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" 
                          : "bg-violet-950/40 text-violet-400 border border-violet-900/30"
                    }`}>
                      {item.type === "CODE" ? <FileCode className="h-2.5 w-2.5" /> : <Sparkles className="h-2.5 w-2.5" />}
                      {item.type}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono tracking-wider bg-zinc-900/80 border border-zinc-850 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-200 font-mono pl-1">
                      {item.price === 0 ? "FREE" : `$${(item.price / 100).toFixed(2)}`}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                      {item.title}
                      <a 
                        href={`/marketplace/${item.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-zinc-550 hover:text-white transition inline-block"
                        title="Open product detail page preview"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </h3>
                    
                    <div 
                      className="text-[11px] text-zinc-450 leading-relaxed font-light mt-1.5 max-h-16 overflow-y-auto pr-2 border-l border-zinc-900 pl-2.5"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>

                  {/* Creator Metadata */}
                  <div className="flex items-center gap-2 border-t border-zinc-900/50 pt-2.5 mt-0.5">
                    <div className="text-[10px] text-zinc-500">
                      Creator: <span className="text-zinc-350 font-semibold">{item.seller?.name || "Anonymous Creator"}</span>
                      <span className="text-zinc-650 font-mono pl-1">({item.seller?.email})</span>
                    </div>
                    <span className="text-zinc-700 font-light">•</span>
                    <div className="text-[10px] text-zinc-600 font-light">
                      Submitted {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                </div>

                {/* 2. Actions Area */}
                <div className="flex sm:flex-col items-stretch justify-center gap-2.5 shrink-0 self-center sm:self-auto w-full sm:w-auto">
                  
                  <button
                    onClick={() => handleApprove(item.id, item.title)}
                    disabled={processingId !== null}
                    className="rounded-full bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-[11px] font-semibold text-white shadow-lg shadow-emerald-500/10 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    <Check className="h-4 w-4" />
                    Approve Asset
                  </button>

                  <button
                    onClick={() => handleReject(item.id, item.title)}
                    disabled={processingId !== null}
                    className="rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-5 py-2.5 text-[11px] font-semibold text-rose-450 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    <X className="h-4 w-4 text-rose-500" />
                    Reject Listing
                  </button>

                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  )
}
