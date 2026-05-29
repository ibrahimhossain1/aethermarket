export const dynamic = "force-dynamic"

import * as React from "react"
import Link from "next/link"
import { getProducts } from "@/lib/data"
import ProductCard from "@/components/product-card"
import { 
  Sparkles, 
  ArrowRight, 
  Terminal, 
  Workflow, 
  Cpu, 
  Search, 
  Users, 
  Coins, 
  DownloadCloud, 
  Gauge 
} from "lucide-react"

export default async function Home() {
  // Fetch featured products (limit to top 4 published listings)
  const products = await getProducts()
  const featuredProducts = products.slice(0, 4)

  return (
    <div className="relative w-full overflow-hidden">
      
      {/* BACKGROUND GRAPHIC ACCENTS */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-violet-800/5 rounded-full blur-[140px] -z-10"></div>

      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        
        {/* Animated Badge */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-800/40 bg-violet-950/20 px-4 py-1.5 text-xs font-semibold text-violet-400 mb-6 uppercase tracking-wider animate-fade-in">
          <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
          The Premier Developer & Creator Exchange
        </div>

        {/* Display Heading */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[0.95] max-w-4xl mx-auto">
          Power Your Projects With Vetted{" "}
          <span className="bg-gradient-to-r from-violet-400 via-violet-600 to-indigo-400 bg-clip-text text-transparent">
            AI Assets
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Aether is the dark-mode e-commerce exchange whitelisting advanced LLM prompts, modular automated workflows, and high-performance serverless code templates.
        </p>

        {/* Search Panel */}
        <div className="mx-auto max-w-md md:max-w-2xl bg-zinc-900/40 p-2 rounded-2xl border border-zinc-800/60 backdrop-blur-md shadow-2xl mb-12">
          <form action="/marketplace" method="GET" className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-zinc-500" />
              <input
                type="text"
                name="search"
                placeholder="Search GPT prompts, n8n blueprints, Next.js templates..."
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 py-3.5 pl-11 pr-4 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-violet-600"
              />
            </div>
            <button 
              type="submit" 
              className="w-full sm:w-auto rounded-xl bg-violet-600 hover:bg-violet-500 px-6 py-3.5 text-xs font-semibold text-white transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Search Catalog
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Quick category badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-400">Popular Queries:</span>
          <Link href="/marketplace?search=GPT-4o" className="rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 hover:text-white transition">GPT-4o prompts</Link>
          <Link href="/marketplace?search=n8n" className="rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 hover:text-white transition">n8n Blueprints</Link>
          <Link href="/marketplace?search=Next.js" className="rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 hover:text-white transition">Next.js boilerplate</Link>
        </div>

      </section>

      {/* 2. STATS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 border-y border-zinc-900 bg-zinc-950/40 backdrop-blur-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-zinc-900 bg-zinc-950/20">
            <Coins className="h-5 w-5 text-violet-400" />
            <span className="font-display text-2xl font-bold text-white tracking-tight">$14,500+</span>
            <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Gross Sales (GMV)</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-zinc-900 bg-zinc-950/20">
            <DownloadCloud className="h-5 w-5 text-emerald-400" />
            <span className="font-display text-2xl font-bold text-white tracking-tight">4,800+</span>
            <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Vetted Downloads</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-zinc-900 bg-zinc-950/20">
            <Users className="h-5 w-5 text-indigo-400" />
            <span className="font-display text-2xl font-bold text-white tracking-tight">1,200+</span>
            <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Verified Creators</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-zinc-900 bg-zinc-950/20">
            <Gauge className="h-5 w-5 text-amber-400" />
            <span className="font-display text-2xl font-bold text-white tracking-tight">&lt;5ms</span>
            <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Asset Delivery API</span>
          </div>

        </div>
      </section>

      {/* 3. THREE CATEGORY GATEWAYS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            Explore Dedicated Product Ecosystems
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Choose a specialized department to narrow down your search for production-ready components.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: AI Prompts */}
          <Link 
            href="/marketplace?type=PROMPT"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-violet-600 hover:shadow-xl hover:shadow-violet-650/5"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-bl-[100px] -z-10 group-hover:bg-violet-600/15 transition"></div>
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-950/60 border border-violet-800/40 text-violet-400 mb-4 group-hover:scale-105 transition">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                AI Prompts
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                Engineered system instructions and master scripts designed for GPT-4o, Claude 3.5 Sonnet, and Gemini Pro. Skip the prompt trial-and-error.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-white transition flex items-center gap-1">
              Browse Prompts <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Card 2: Reusable Workflows */}
          <Link 
            href="/marketplace?type=SKILL"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-[100px] -z-10 group-hover:bg-indigo-500/15 transition"></div>
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 mb-4 group-hover:scale-105 transition">
                <Workflow className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                Skills & Workflows
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                Pre-configured automated blueprints and JSON pipelines for n8n, Make.com, and Zapier. Seamless API bindings for Slack, Stripe, and social webhooks.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-white transition flex items-center gap-1">
              Browse Blueprints <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Card 3: Code Templates */}
          <Link 
            href="/marketplace?type=CODE"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-[100px] -z-10 group-hover:bg-emerald-500/15 transition"></div>
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 mb-4 group-hover:scale-105 transition">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Code Snippets
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                TypeScript serverless routes, fully typed Next.js App Router boilerplate layouts, responsive Tailwind CSS cards, and Express security scripts.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-white transition flex items-center gap-1">
              Browse Snippets <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-900">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              Curated Masterpieces
            </h2>
            <p className="text-xs text-zinc-400">
              Vetted assets with high conversion rates and flawless community ratings.
            </p>
          </div>
          <Link 
            href="/marketplace" 
            className="rounded-full border border-zinc-800 hover:border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5"
          >
            Browse All Marketplace <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((p) => (
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
      </section>

      {/* 5. SELLER CTA SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-900">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-8 sm:p-12 lg:p-16 text-center shadow-2xl">
          
          {/* Internal blur glows */}
          <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-violet-600/10 rounded-full blur-[80px] -z-10"></div>
          <div className="absolute -top-10 -left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] -z-10"></div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Earn 85% Commission on Your Code & Prompts
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed font-light">
            Monetize your engineered prompts, custom automated workflows, and components. Register a seller account, integrate Stripe Connect, and begin selling in under 5 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/auth/signup" 
              className="w-full sm:w-auto rounded-full bg-white text-zinc-950 hover:bg-zinc-100 px-6 py-3 text-xs font-semibold shadow-lg transition-colors whitespace-nowrap"
            >
              Get Started Free
            </Link>
            <Link 
              href="/marketplace" 
              className="w-full sm:w-auto rounded-full border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 px-6 py-3 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              Explore Creator Guidelines <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}
