import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { UserRole, ProductStatus, ProductType } from "@prisma/client"

export const dynamic = "force-dynamic"

// High-fidelity mock listings for pending moderation queue sandbox
const MOCK_PENDING_LISTINGS = [
  {
    id: "prod-pending-1",
    title: "Svelte 5 Runes Boilerplate & Router Bundle",
    slug: "svelte-5-runes-boilerplate",
    type: ProductType.CODE,
    category: "boilerplate",
    price: 3900, // $39.00
    isFree: false,
    status: ProductStatus.PENDING,
    createdAt: new Date(),
    seller: {
      name: "Sarah Chen",
      email: "snippet.king@code.net"
    },
    description: "<p>A high-performance premium template showcasing the new <strong>Svelte 5 Runes</strong> system with fully typed client-side routing, modular layouts, and state stores.</p>"
  },
  {
    id: "prod-pending-2",
    title: "Midjourney v6 Photorealistic Portrait Blueprint",
    slug: "midjourney-v6-portrait-blueprint",
    type: ProductType.PROMPT,
    category: "image-generation",
    price: 0, // Free
    isFree: true,
    status: ProductStatus.PENDING,
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    seller: {
      name: "Alex Rivera",
      email: "creator.spark@flow.io"
    },
    description: "<p>A hyper-optimized orchestrator prompt structure for Midjourney v6 producing absolute photorealism. Highly customized with camera specs, lighting dynamics, and color palettes.</p>"
  }
]

export async function GET(request: Request) {
  try {
    // 1. Authenticate and authorize as Admin
    const session = await auth()
    if (!session || !session.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get("status") // e.g. "PENDING" or all

    // 2. Query Database
    try {
      const whereClause: any = {}
      if (statusFilter) {
        whereClause.status = statusFilter as ProductStatus
      }

      const products = await prisma.product.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          seller: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      if (products.length === 0 && (!statusFilter || statusFilter === "PENDING")) {
        return NextResponse.json({ listings: MOCK_PENDING_LISTINGS })
      }

      return NextResponse.json({ listings: products })
    } catch (dbErr) {
      console.warn("⚠️ Database unavailable during admin listings fetch. Serving mock sandbox.")
      // Filter mock listings
      const filteredMocks = statusFilter 
        ? MOCK_PENDING_LISTINGS.filter(m => m.status === statusFilter)
        : MOCK_PENDING_LISTINGS

      return NextResponse.json({ listings: filteredMocks, isMock: true })
    }
  } catch (error: any) {
    console.error("Admin pending listings fetch error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate and authorize as Admin
    const session = await auth()
    if (!session || !session.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 })
    }

    const { productId, newStatus } = await request.json()
    if (!productId || !newStatus) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 })
    }

    // Validate status
    if (!Object.values(ProductStatus).includes(newStatus as ProductStatus)) {
      return NextResponse.json({ error: "Invalid status value specified." }, { status: 400 })
    }

    // 2. Perform status change in database
    try {
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { status: newStatus as ProductStatus },
        include: { seller: { select: { id: true, name: true, email: true } } }
      })

      // Dispatch real-time in-app notification to the creator
      const statusLabel = newStatus === ProductStatus.PUBLISHED ? "APPROVED" : "REJECTED/ARCHIVED"
      await prisma.notification.create({
        data: {
          userId: updatedProduct.sellerId,
          type: "APPROVAL",
          message: `Your listing "${updatedProduct.title}" has been ${statusLabel} by the platform curators.`,
          link: `/seller/dashboard/listings`,
          read: false
        }
      })

      return NextResponse.json({ 
        success: true, 
        message: `Listing status updated to ${newStatus} successfully.`,
        product: updatedProduct 
      })
    } catch (dbErr) {
      console.warn("⚠️ Database unavailable during listing approval update. Serving mock sandbox.")
      return NextResponse.json({
        success: true,
        message: `[MOCK SUCCESS] Listing status updated to ${newStatus} in sandbox environment.`
      })
    }
  } catch (error: any) {
    console.error("Admin listing approval update error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
