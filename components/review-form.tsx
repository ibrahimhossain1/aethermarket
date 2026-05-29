"use client"

import * as React from "react"
import { Star, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ReviewFormProps {
  productId: string
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const router = useRouter()
  const [rating, setRating] = React.useState(5)
  const [hoverRating, setHoverRating] = React.useState<number | null>(null)
  const [body, setBody] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [successMsg, setSuccessMsg] = React.useState("")
  const [errorMsg, setErrorMsg] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (body.trim().length < 5) {
      setErrorMsg("Review comments must be at least 5 characters long.")
      return
    }

    setLoading(true)
    setSuccessMsg("")
    setErrorMsg("")

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId,
          rating,
          body
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        setSuccessMsg(data.message || "Review submitted successfully!")
        setBody("")
        setRating(5)
        router.refresh()
      } else {
        setErrorMsg(data.error || "Failed to post review.")
      }
    } catch (err) {
      console.error("Error submitting review form:", err)
      setErrorMsg("A connection error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-850 bg-zinc-950/40 p-5 sm:p-6 flex flex-col gap-4 mt-6">
      
      <div className="border-b border-zinc-900 pb-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Leave a Verified Review</h4>
        <p className="text-[10px] text-zinc-550 mt-0.5">Share your feedback to help other developers discover high-quality assets.</p>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-emerald-900 bg-emerald-950/20 p-4 text-[10px] sm:text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-rose-900 bg-rose-950/20 p-4 text-[10px] sm:text-xs font-semibold text-rose-450 flex items-center gap-2">
          <AlertCircle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Rating Star Selection */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase font-bold text-zinc-550 tracking-wider">Asset Score</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-0.5 outline-none transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
              >
                <Star 
                  className={`h-5 w-5 ${
                    star <= (hoverRating ?? rating) 
                      ? "fill-amber-500 text-amber-500" 
                      : "text-zinc-700"
                  }`} 
                />
              </button>
            ))}
            <span className="text-[10px] font-bold text-zinc-400 font-mono ml-2">
              {hoverRating ?? rating} / 5
            </span>
          </div>
        </div>

        {/* Comment input */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase font-bold text-zinc-550 tracking-wider">Feedback Comment</span>
          <textarea
            rows={3}
            placeholder="Introduce your experience, deployment speed, or customization detail..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-xl bg-zinc-900/40 border border-zinc-850 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none resize-none transition focus:border-violet-600 focus:bg-zinc-900/60"
            required
          />
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-[10px] font-bold text-white shadow-lg shadow-violet-500/20 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
            {loading ? "Posting..." : "Publish Review"}
          </button>
        </div>

      </form>

    </div>
  )
}
