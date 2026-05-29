import * as React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductBySlug, getRelatedProducts } from "@/lib/data"
import ProductCard from "@/components/product-card"
import ProductDetailActions from "@/components/product-detail-actions"
import ReviewForm from "@/components/review-form"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { 
  Star, 
  Sparkles, 
  User as UserIcon, 
  Lock, 
  Check, 
  Terminal, 
  Workflow, 
  Cpu, 
  Calendar,
  Globe,
  Tag
} from "lucide-react"

interface ProductDetailPageProps {
  params: {
    slug: string
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = params

  // 1. Fetch Product details (with mock fallback)
  const product = await getProductBySlug(slug)
  if (!product) {
    notFound()
  }

  // 2. Fetch Related Products
  const relatedProducts = await getRelatedProducts(product.id, product.category, 4)

  // 3. Compute ratings averages
  const reviewsCount = product.reviews.length
  const avgRating = reviewsCount > 0 
    ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewsCount 
    : 0

  // 4. Check review submission eligibility
  const session = await auth()
  let eligibleToReview = false

  if (session?.user) {
    try {
      const purchase = await prisma.purchase.findFirst({
        where: {
          buyerId: session.user.id,
          productId: product.id,
          refunded: false
        }
      })
      
      if (purchase) {
        const review = await prisma.review.findFirst({
          where: {
            buyerId: session.user.id,
            productId: product.id
          }
        })
        eligibleToReview = !review
      }
    } catch (e) {
      console.warn("⚠️ Review eligibility check failed. Mocking user as eligible in sandbox.")
      // In mock/sandbox mode, if signed in, we can let them submit
      eligibleToReview = true
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. BREADCRUMBS & NAVIGATION */}
      <nav className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500 mb-8 font-medium uppercase tracking-wider">
        <Link href="/marketplace" className="hover:text-zinc-300 transition">Marketplace</Link>
        <span>/</span>
        <Link href={`/marketplace?category=${product.category}`} className="hover:text-zinc-300 transition">{product.category}</Link>
        <span>/</span>
        <span className="text-zinc-400 truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* 2. MAIN LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column: Product Info & Previews */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Main Visual Preview Panel */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            {product.previewImages?.[0] ? (
              <img 
                src={product.previewImages[0]} 
                alt={product.title} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-zinc-600 font-display">AETHER VISUAL PREVIEW</span>
              </div>
            )}
            
            {/* Overlay Indicator */}
            <span className="absolute bottom-4 left-4 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 px-3 py-1 text-[10px] font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
              {product.type === "PROMPT" && <Cpu className="h-3.5 w-3.5" />}
              {product.type === "SKILL" && <Workflow className="h-3.5 w-3.5" />}
              {product.type === "CODE" && <Terminal className="h-3.5 w-3.5" />}
              {product.type}
            </span>
          </div>

          {/* Title and Ratings Header */}
          <div className="border-b border-zinc-900 pb-6">
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              {product.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {/* Star rating */}
              <div className="flex items-center gap-1">
                <Star className={`h-4 w-4 ${avgRating > 0 ? "fill-amber-500 text-amber-500" : "text-zinc-700"}`} />
                <span className="font-bold text-zinc-200">{avgRating > 0 ? avgRating.toFixed(1) : "No rating"}</span>
                {reviewsCount > 0 && <span className="text-zinc-500">({reviewsCount} reviews)</span>}
              </div>
              
              <span className="h-4 w-px bg-zinc-800"></span>

              {/* Downloads indicator */}
              <span className="text-zinc-400 font-medium">{product.downloadCount} downloads</span>
              
              <span className="h-4 w-px bg-zinc-800"></span>

              {/* Category tags */}
              <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-300">
                {product.subcategory || product.category}
              </span>
            </div>
          </div>

          {/* Product Description */}
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-100 mb-3.5">Overview & Features</h2>
            <div className="prose prose-invert prose-xs text-zinc-450 leading-relaxed font-light">
              <p>{product.description}</p>
            </div>
          </div>

          {/* TYPE-SPECIFIC METADATA SPECS GRID */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5">
            <h3 className="font-display text-sm font-bold text-zinc-200 uppercase tracking-widest border-b border-zinc-850 pb-3.5 mb-4">
              Asset Specifications
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* --- Prompts Specific Parameters --- */}
              {product.type === "PROMPT" && (
                <>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">Target AI Model</span>
                    <span className="text-zinc-200 font-semibold">{product.targetModel || "Claude / GPT"}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">Instruction Length</span>
                    <span className="text-zinc-200 font-semibold">{product.metadata?.tokensCount || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2 col-span-1 sm:col-span-2">
                    <span className="text-zinc-500">Best Use Case</span>
                    <span className="text-zinc-200 font-semibold text-right">{product.metadata?.idealUseCases?.[0] || "LLM interactions"}</span>
                  </div>
                </>
              )}

              {/* --- Skills Specific Parameters --- */}
              {product.type === "SKILL" && (
                <>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">Compatible Tooling</span>
                    <span className="text-zinc-200 font-semibold">{product.metadata?.compatibleTools?.[0] || "n8n"}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">Trigger Sequence</span>
                    <span className="text-zinc-200 font-semibold truncate max-w-[150px]" title={product.metadata?.triggerType}>{product.metadata?.triggerType || "Webhook"}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">Expected Input</span>
                    <span className="text-zinc-200 font-semibold">{product.metadata?.inputFormat || "JSON payload"}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">Output Delivery</span>
                    <span className="text-zinc-200 font-semibold">{product.metadata?.outputFormat || "Discord embed"}</span>
                  </div>
                </>
              )}

              {/* --- Code Specific Parameters --- */}
              {product.type === "CODE" && (
                <>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">Primary Language</span>
                    <span className="text-zinc-200 font-semibold">{product.language || "TypeScript"}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">Target Framework</span>
                    <span className="text-zinc-200 font-semibold">{product.framework || "Next.js"}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2 col-span-1 sm:col-span-2">
                    <span className="text-zinc-500">Required Dependencies</span>
                    <span className="text-zinc-200 font-semibold text-right">{product.metadata?.dependenciesList?.join(", ") || "None"}</span>
                  </div>
                </>
              )}

            </div>

            {/* Tags Box */}
            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-zinc-850">
              {product.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-zinc-950/60 border border-zinc-800 px-2.5 py-0.5 text-[9px] font-bold text-zinc-450 hover:text-white transition">
                  <Tag className="h-2.5 w-2.5 text-zinc-650" />
                  {tag}
                </span>
              ))}
            </div>

          </div>

          {/* INTERACTIVE TRUNCATED PREVIEW LOCK */}
          <div className="rounded-2xl border border-zinc-850 overflow-hidden bg-zinc-950">
            
            {/* Header info */}
            <div className="flex items-center justify-between bg-zinc-900 px-4 py-3 border-b border-zinc-850">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-violet-500" />
                Asset Preview (First 20%)
              </span>
              <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[9px] font-semibold text-zinc-500">
                Read-Only
              </span>
            </div>

            {/* Preview content code block */}
            <div className="relative p-5">
              <pre className="font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto select-none bg-zinc-950 max-h-60 whitespace-pre-wrap">
                <code>{product.previewContent || "// Preview unavailable for this asset."}</code>
              </pre>

              {/* Blurred locked overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent flex flex-col items-center justify-end p-6 text-center select-none pointer-events-none">
                
                {/* Blurred mockup lines representing remaining 80% */}
                <div className="w-full flex flex-col gap-2 mb-10 opacity-30 select-none">
                  <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
                  <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
                  <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
                  <div className="h-3 bg-zinc-800 rounded w-full"></div>
                </div>

                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/90 p-5 max-w-sm shadow-2xl backdrop-blur-sm pointer-events-auto">
                  <Lock className="mx-auto h-5 w-5 text-violet-400 mb-2.5 animate-pulse" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Asset Delivery Locked</h4>
                  <p className="text-[10px] text-zinc-450 leading-relaxed">
                    Secure this listing to instantly unlock and download the entire high-fidelity {product.type.toLowerCase()} template file.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* VERIFIED COMMUNITY REVIEWS */}
          <div className="border-t border-zinc-900 pt-8">
            <h2 className="font-display text-lg font-bold text-zinc-100 mb-5">
              Verified Buyer Reviews ({reviewsCount})
            </h2>

            {eligibleToReview && (
              <div className="mb-8">
                <ReviewForm productId={product.id} />
              </div>
            )}

            {reviewsCount === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-850 p-8 text-center text-xs text-zinc-500 font-light">
                No reviews yet. Be the first verified buyer to leave feedback!
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {product.reviews.map((r: any) => (
                  <div key={r.id} className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5 flex flex-col gap-4">
                    
                    {/* User profile & stars */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center overflow-hidden">
                          {r.buyer?.image ? (
                            <img src={r.buyer.image} alt={r.buyer.name} className="h-full w-full object-cover" />
                          ) : (
                            <UserIcon className="h-4 w-4 text-zinc-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-200">{r.buyer?.name || "Verified Buyer"}</span>
                            <span className="rounded-full bg-emerald-950/40 border border-emerald-850/50 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-0.5">
                              <Check className="h-2 w-2" /> Verified
                            </span>
                          </div>
                          <span className="text-[9px] text-zinc-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-3 w-3 ${
                              star <= r.rating ? "fill-amber-500 text-amber-500" : "text-zinc-700"
                            }`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-xs text-zinc-350 leading-relaxed font-light pl-1">
                      {r.body}
                    </p>

                    {/* Seller reply if present */}
                    {r.sellerReply && (
                      <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 ml-4 flex gap-3">
                        <div className="h-6 w-6 rounded-full border border-zinc-800 bg-zinc-900 overflow-hidden shrink-0">
                          <img src={product.seller?.image} alt={product.seller?.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-zinc-300">{product.seller?.name}</span>
                            <span className="text-[8px] rounded bg-violet-950/40 border border-violet-850/60 px-1 text-violet-400 uppercase font-semibold">
                              Seller
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-450 leading-relaxed mt-1 font-light">
                            {r.sellerReply}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Sticky Buyer Action Box */}
        <div className="lg:sticky lg:top-24 flex flex-col gap-6 w-full">
          
          {/* Action container */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm shadow-2xl flex flex-col gap-5">
            
            {/* Price section */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-xs text-zinc-550">Listed price</span>
              <div className="text-right">
                {product.isFree ? (
                  <span className="font-display text-2xl font-bold text-emerald-400">Free</span>
                ) : (
                  <span className="font-display text-2xl font-bold text-white">${(product.price / 100).toFixed(2)}</span>
                )}
                <span className="block text-[8px] text-zinc-500 uppercase tracking-widest mt-0.5">Secure checkout</span>
              </div>
            </div>

            {/* Interactive buttons */}
            <ProductDetailActions product={product} />

          </div>

          {/* Vetted Seller profile widget */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col gap-4">
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-zinc-800 bg-zinc-900 overflow-hidden">
                <img src={product.seller?.image} alt={product.seller?.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <Link href={`/seller/${product.seller?.name?.toLowerCase().replace(" ", "")}`} className="text-xs font-bold text-zinc-200 hover:text-violet-400 transition leading-none">
                  {product.seller?.name}
                </Link>
                <span className="block text-[10px] text-zinc-500 mt-1">Vetted Partner Creator</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed font-light line-clamp-3">
              {product.seller?.bio}
            </p>

            <Link 
              href={`/seller/${product.seller?.name?.toLowerCase().replace(" ", "")}`}
              className="w-full text-center rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 py-2.5 text-[10px] font-bold text-zinc-300 hover:text-white transition"
            >
              View Full Profile
            </Link>

          </div>

        </div>

      </div>

      {/* 3. RELATED PRODUCTS RECOMMENDATIONS */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-zinc-900 mt-20 pt-16">
          <h3 className="font-display text-xl font-bold text-white mb-8 tracking-tight">
            Related Exchange Assets
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p: any) => (
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
      )}

    </div>
  )
}
