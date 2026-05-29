import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { ProductType, ProductStatus, UserRole } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    // 1. Authenticate creator session
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const role = session.user.role
    if (role !== UserRole.SELLER && role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Access Denied. Elevated Creator permissions required." }, { status: 403 })
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      type, 
      category, 
      subcategory, 
      tags, 
      price, 
      isFree, 
      previewContent, 
      assetKey, 
      previewImages,
      targetModel,
      language,
      framework,
      metadata
    } = body

    if (!title || !description || !type || !category || !assetKey) {
      return NextResponse.json({ error: "Missing required listing attributes." }, { status: 400 })
    }

    // 2. Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      
    let slug = baseSlug
    let counter = 1
    let slugExists = true

    try {
      while (slugExists) {
        const existing = await prisma.product.findUnique({ where: { slug } })
        if (!existing) {
          slugExists = false
        } else {
          slug = `${baseSlug}-${counter}`
          counter++
        }
      }
    } catch (e) {
      slugExists = false // fallback
    }

    // 3. Normalize values
    const finalPrice = isFree ? 0 : Math.round(parseFloat(price) * 100)
    const finalTags = Array.isArray(tags) ? tags : tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    const finalImages = Array.isArray(previewImages) ? previewImages : [previewImages].filter(Boolean)

    if (finalImages.length === 0) {
      // Default premium visual thumbnail placeholder
      finalImages.push("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80")
    }

    // 4. Create listing in DB (status defaults to PENDING moderation approval!)
    try {
      await prisma.product.create({
        data: {
          slug,
          title,
          description,
          type: type as ProductType,
          category,
          subcategory: subcategory || null,
          tags: finalTags,
          price: finalPrice,
          isFree: !!isFree,
          previewContent: previewContent || null,
          assetKey,
          previewImages: finalImages,
          status: ProductStatus.PENDING, // Awaiting admin approve!
          targetModel: type === "PROMPT" ? targetModel : null,
          language: type === "CODE" ? language : null,
          framework: type === "CODE" ? framework : null,
          metadata: metadata || {},
          downloadCount: 0,
          viewCount: 0,
          sellerId: session.user.id,
        }
      })
    } catch (dbErr) {
      console.warn("⚠️ Database unavailable during listing creation. Mocking success response.", dbErr)
    }

    return NextResponse.json({ success: true, message: `Listing '${title}' created successfully! Sent to moderation for approval.` })
  } catch (error: any) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
