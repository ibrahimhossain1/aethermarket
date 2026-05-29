"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  HelpCircle, 
  Sparkles, 
  Terminal, 
  Workflow, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock
} from "lucide-react"

export default function ListingCreateForm() {
  const router = useRouter()

  // Form Fields State
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [type, setType] = React.useState<"PROMPT" | "SKILL" | "CODE">("PROMPT")
  const [category, setCategory] = React.useState("Development")
  const [subcategory, setSubcategory] = React.useState("")
  const [tags, setTags] = React.useState("")
  const [price, setPrice] = React.useState("9.99")
  const [isFree, setIsFree] = React.useState(false)
  const [previewContent, setPreviewContent] = React.useState("")
  const [assetKey, setAssetKey] = React.useState("")
  const [previewImage, setPreviewImage] = React.useState("")

  // Type-specific states
  const [targetModel, setTargetModel] = React.useState("GPT-4o") // for prompts
  const [language, setLanguage] = React.useState("TypeScript") // for code
  const [framework, setFramework] = React.useState("Next.js 14") // for code
  
  // Workflow specifics
  const [tool, setTool] = React.useState("n8n")
  const [trigger, setTrigger] = React.useState("Webhook Listener")
  const [inputFormat, setInputFormat] = React.useState("JSON payload")
  const [outputFormat, setOutputFormat] = React.useState("Discord notification")

  const [loading, setLoading] = React.useState(false)
  const [successMsg, setSuccessMsg] = React.useState("")
  const [errorMsg, setErrorMsg] = React.useState("")

  const categories = ["Development", "Marketing", "Automation", "Design Systems", "Entertainment"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !description || !assetKey) {
      alert("Please complete all required whitelisted fields.")
      return
    }

    setLoading(true)
    setSuccessMsg("")
    setErrorMsg("")

    // Assemble metadata payload based on types
    let metadata: any = {}
    if (type === "SKILL") {
      metadata = {
        compatibleTools: [tool],
        triggerType: trigger,
        inputFormat,
        outputFormat
      }
    } else if (type === "PROMPT") {
      metadata = {
        tokensCount: "Custom Prompt",
        instructionLevel: "All Levels"
      }
    } else if (type === "CODE") {
      metadata = {
        dependenciesList: ["react"],
        compatibilityNotes: "Node 20 LTS"
      }
    }

    try {
      const response = await fetch("/api/listings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          type,
          category,
          subcategory: subcategory || undefined,
          tags,
          price: isFree ? "0" : price,
          isFree,
          previewContent,
          assetKey,
          previewImages: previewImage ? [previewImage] : undefined,
          targetModel,
          language,
          framework,
          metadata
        })
      })

      const data = await response.json()
      if (response.ok) {
        setSuccessMsg(data.message)
        setTimeout(() => {
          router.push("/seller/dashboard/listings")
          router.refresh()
        }, 1500)
      } else {
        setErrorMsg(data.error || "Failed to create listing.")
      }
    } catch (err) {
      console.error("Error creating listing:", err)
      setErrorMsg("A connection error occurred. Failed to submit listing.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6">
      
      {/* 1. Alerts */}
      {successMsg && (
        <div className="rounded-xl border border-emerald-900 bg-emerald-950/20 p-4 text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-rose-900 bg-rose-950/20 p-4 text-xs font-semibold text-rose-400 flex items-center gap-2">
          <HelpCircle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-zinc-300">
        
        {/* Type selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Asset Product Type</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "PROMPT", label: "AI Prompt", icon: Cpu },
              { id: "SKILL", label: "Workflow", icon: Workflow },
              { id: "CODE", label: "Code Snippet", icon: Terminal }
            ].map((t) => {
              const Icon = t.icon
              const isSelected = type === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as any)}
                  className={`rounded-xl border p-3 flex flex-col items-center gap-2 text-center text-xs font-bold transition-all ${
                    isSelected 
                      ? "bg-violet-950/20 border-violet-700 text-violet-400" 
                      : "bg-zinc-900/30 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Product Title</label>
          <input
            type="text"
            placeholder="e.g. Next.js 14 Dashboard Layout Boilerplate"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-violet-600 transition"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Listing Description</label>
          <textarea
            placeholder="Outline what makes your asset unique. List features, instructions, and integration details..."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none resize-none focus:border-violet-600 transition"
            required
          />
        </div>

        {/* Pricing Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end border-t border-zinc-900 pt-4">
          
          <label className="flex items-center justify-between cursor-pointer rounded-xl bg-zinc-900/40 border border-zinc-855 p-3 hover:border-zinc-700 transition h-[45px]">
            <span className="text-xs text-zinc-300">Set as free asset</span>
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-violet-600 focus:ring-violet-500"
            />
          </label>

          {!isFree && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Price (in USD)</label>
              <div className="relative w-full">
                <span className="absolute left-3.5 top-3 text-xs font-semibold text-zinc-550">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.99"
                  max="499.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 pl-7 pr-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
                  required
                />
              </div>
            </div>
          )}

        </div>

        {/* Dynamic Parameter Specs */}
        <div className="border-t border-zinc-900 pt-4 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-2">
            Department Details
          </h4>

          {/* Prompt specific details */}
          {type === "PROMPT" && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Target LLM Model</label>
              <input
                type="text"
                placeholder="e.g. Claude 3.5 Sonnet / GPT-4o"
                value={targetModel}
                onChange={(e) => setTargetModel(e.target.value)}
                className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
              />
            </div>
          )}

          {/* Code specific details */}
          {type === "CODE" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Programming Language</label>
                <input
                  type="text"
                  placeholder="e.g. TypeScript"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Code Framework</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js 14 App Router"
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
                />
              </div>
            </div>
          )}

          {/* Workflow specific details */}
          {type === "SKILL" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Automation Tool</label>
                <input
                  type="text"
                  placeholder="e.g. n8n / Make.com"
                  value={tool}
                  onChange={(e) => setTool(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Workflow Trigger</label>
                <input
                  type="text"
                  placeholder="e.g. Webhook POST Listener"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Input Object Structure</label>
                <input
                  type="text"
                  placeholder="e.g. Stripe Webhook JSON"
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Output Delivery Schema</label>
                <input
                  type="text"
                  placeholder="e.g. Discord Embed Notification"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
                />
              </div>
            </div>
          )}

        </div>

        {/* Global Metadata (Category & Tags) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-900 pt-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Product Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-xl bg-zinc-905 border border-zinc-800 py-3 px-4 text-xs text-zinc-300 outline-none focus:border-violet-600 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-zinc-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Subcategory (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Agentic Systems"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-violet-600 transition"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Tags (comma-separated, max 10)</label>
          <input
            type="text"
            placeholder="e.g. Next.js, n8n, Claude, System Prompt"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-violet-600 transition"
          />
        </div>

        {/* 20% Preview content */}
        <div className="flex flex-col gap-2 border-t border-zinc-900 pt-4">
          <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Public Code/Prompt Preview (First 20%)</label>
          <textarea
            placeholder="Input the first 20% plain text of your asset here (e.g. the core prompt system role, or n8n workflow nodes). Non-buyers will see this block as a read-only preview before buying..."
            rows={5}
            value={previewContent}
            onChange={(e) => setPreviewContent(e.target.value)}
            className="w-full rounded-xl bg-zinc-905 border border-zinc-800 py-3 px-4 text-xs text-zinc-300 font-mono placeholder-zinc-650 outline-none resize-none focus:border-violet-600 transition"
            required
          />
        </div>

        {/* Secure Download File Details */}
        <div className="rounded-2xl border border-zinc-850 p-5 bg-zinc-950/40 flex flex-col gap-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200 uppercase tracking-widest border-b border-zinc-900 pb-2.5">
            <Lock className="h-4.5 w-4.5 text-violet-400" />
            Secure Private Storage
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Private Storage Asset Key</label>
            <input
              type="text"
              placeholder="e.g. prompts/multi-agent-orchestration.txt"
              value={assetKey}
              onChange={(e) => setAssetKey(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/60 border border-zinc-850 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-violet-600 transition"
              required
            />
            <span className="text-[9px] text-zinc-650 font-light">Input the whitelisted Supabase Storage asset file path. Buyers will download using temporary expiring secure signed URLs pointing to this key.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Product Visual Thumbnail URL (Optional)</label>
            <input
              type="url"
              placeholder="e.g. https://images.unsplash.com/photo-..."
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/60 border border-zinc-850 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-violet-600 transition"
            />
            <span className="text-[9px] text-zinc-650 font-light">Input a high-quality visual screenshot URL (like a direct Unsplash link) to act as the primary listing card cover.</span>
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-zinc-900 pt-4 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 py-3.5 text-xs font-semibold text-white transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? "Registering Listing..." : "Register Product Listing"}
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>

      </form>

    </div>
  )
}
