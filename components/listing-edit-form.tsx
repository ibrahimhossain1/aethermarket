"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Save, 
  HelpCircle, 
  Sparkles, 
  Terminal, 
  Workflow, 
  Cpu, 
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronLeft
} from "lucide-react"

interface ListingEditFormProps {
  product: {
    id: string
    title: string
    description: string
    type: "PROMPT" | "SKILL" | "CODE"
    category: string
    subcategory: string | null
    tags: string[]
    price: number
    isFree: boolean
    previewContent: string | null
    assetKey: string
    previewImages: string[]
    targetModel: string | null
    language: string | null
    framework: string | null
    metadata: any
  }
}

export default function ListingEditForm({ product }: ListingEditFormProps) {
  const router = useRouter()

  // Form Fields State (Pre-populated)
  const [title, setTitle] = React.useState(product.title)
  const [description, setDescription] = React.useState(product.description)
  const [category, setCategory] = React.useState(product.category)
  const [subcategory, setSubcategory] = React.useState(product.subcategory || "")
  const [tags, setTags] = React.useState(product.tags.join(", "))
  const [price, setPrice] = React.useState((product.price / 100).toString())
  const [isFree, setIsFree] = React.useState(product.isFree)
  const [previewContent, setPreviewContent] = React.useState(product.previewContent || "")
  const [assetKey, setAssetKey] = React.useState(product.assetKey)
  const [previewImage, setPreviewImage] = React.useState(product.previewImages?.[0] || "")

  // Type-specific states
  const [targetModel, setTargetModel] = React.useState(product.targetModel || "GPT-4o")
  const [language, setLanguage] = React.useState(product.language || "TypeScript")
  const [framework, setFramework] = React.useState(product.framework || "Next.js 14")
  
  // Workflow specifics
  const [tool, setTool] = React.useState(product.metadata?.compatibleTools?.[0] || "n8n")
  const [trigger, setTrigger] = React.useState(product.metadata?.triggerType || "Webhook Listener")
  const [inputFormat, setInputFormat] = React.useState(product.metadata?.inputFormat || "JSON payload")
  const [outputFormat, setOutputFormat] = React.useState(product.metadata?.outputFormat || "Discord notification")

  const [loading, setLoading] = React.useState(false)
  const [successMsg, setSuccessMsg] = React.useState("")
  const [errorMsg, setErrorMsg] = React.useState("")

  const categories = ["Development", "Marketing", "Automation", "Design Systems", "Entertainment"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !description || !assetKey) {
      alert("Please complete all required fields.")
      return
    }

    setLoading(true)
    setSuccessMsg("")
    setErrorMsg("")

    // Assemble metadata payload based on types
    let metadata: any = {}
    if (product.type === "SKILL") {
      metadata = {
        compatibleTools: [tool],
        triggerType: trigger,
        inputFormat,
        outputFormat
      }
    } else if (product.type === "PROMPT") {
      metadata = {
        tokensCount: "Custom Prompt",
        instructionLevel: "All Levels"
      }
    } else if (product.type === "CODE") {
      metadata = {
        dependenciesList: ["react"],
        compatibilityNotes: "Node 20 LTS"
      }
    }

    try {
      const response = await fetch("/api/listings/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: product.id,
          title,
          description,
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
        setErrorMsg(data.error || "Failed to save listing.")
      }
    } catch (err) {
      console.error("Error saving listing:", err)
      setErrorMsg("A connection error occurred. Failed to save updates.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6">
      
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white px-3.5 py-1.5 text-[9px] font-bold text-zinc-450 transition flex items-center justify-center gap-1.5 self-start"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Listings
      </button>

      {/* Alerts */}
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
        
        {/* Type Badge */}
        <div className="flex flex-col gap-2 bg-zinc-950/40 p-4 rounded-xl border border-zinc-900">
          <span className="text-[9px] uppercase font-bold text-zinc-550 tracking-wider">Asset Product Type</span>
          <div className="flex items-center gap-2 text-xs text-zinc-300 font-bold mt-1 uppercase tracking-wider">
            {product.type === "PROMPT" && <Cpu className="h-4.5 w-4.5 text-violet-400" />}
            {product.type === "SKILL" && <Workflow className="h-4.5 w-4.5 text-emerald-450" />}
            {product.type === "CODE" && <Terminal className="h-4.5 w-4.5 text-indigo-400" />}
            {product.type}
            <span className="text-[10px] text-zinc-550 font-normal lowercase ml-1.5">(Product type cannot be changed after creation)</span>
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
            placeholder="Outline what makes your asset unique..."
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
          {product.type === "PROMPT" && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Target LLM Model</label>
              <input
                type="text"
                value={targetModel}
                onChange={(e) => setTargetModel(e.target.value)}
                className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
              />
            </div>
          )}

          {/* Code specific details */}
          {product.type === "CODE" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Programming Language</label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Code Framework</label>
                <input
                  type="text"
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
                />
              </div>
            </div>
          )}

          {/* Workflow specific details */}
          {product.type === "SKILL" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Automation Tool</label>
                <input
                  type="text"
                  value={tool}
                  onChange={(e) => setTool(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Workflow Trigger</label>
                <input
                  type="text"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Input Object Structure</label>
                <input
                  type="text"
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 outline-none focus:border-violet-600 transition"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Output Delivery Schema</label>
                <input
                  type="text"
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
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-violet-600 transition"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-violet-600 transition"
          />
        </div>

        {/* 20% Preview content */}
        <div className="flex flex-col gap-2 border-t border-zinc-900 pt-4">
          <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Public Code/Prompt Preview (First 20%)</label>
          <textarea
            placeholder="Input raw preview text..."
            rows={5}
            value={previewContent}
            onChange={(e) => setPreviewContent(e.target.value)}
            className="w-full rounded-xl bg-zinc-905 border border-zinc-800 py-3 px-4 text-xs text-zinc-300 font-mono outline-none resize-none focus:border-violet-600 transition"
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
              value={assetKey}
              onChange={(e) => setAssetKey(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/60 border border-zinc-850 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-violet-600 transition"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Product Visual Thumbnail URL</label>
            <input
              type="url"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/60 border border-zinc-850 py-3 px-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-violet-600 transition"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-zinc-900 pt-4 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 py-3.5 text-xs font-semibold text-white transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Save className="h-4.5 w-4.5" />
            {loading ? "Saving Changes..." : "Save Product Details"}
          </button>
        </div>

      </form>

    </div>
  )
}
