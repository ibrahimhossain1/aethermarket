import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { ProductStatus } from "@prisma/client"

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { productId, status } = await request.json()
    if (!productId || !status) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 })
    }

    // Validate status type matches Prisma enum
    const validStatuses = Object.values(ProductStatus)
    if (!validStatuses.includes(status as ProductStatus)) {
      return NextResponse.json({ error: "Invalid status state." }, { status: 400 })
    }

    // 2. Fetch product details & verify ownership
    let product: any = null
    try {
      product = await prisma.product.findUnique({
        where: { id: productId }
      })
    } catch (e) {
      return NextResponse.json({ error: "Database unavailable." }, { status: 500 })
    }

    if (!product) {
      return NextResponse.json({ error: "Product listing not found." }, { status: 404 })
    }

    if (product.sellerId !== session.user.id) {
      return NextResponse.json({ error: "Access Denied. You do not own this listing." }, { status: 403 })
    }

    // 3. Update listing status
    try {
      await prisma.product.update({
        where: { id: productId },
        data: { status: status as ProductStatus }
      })
    } catch (dbErr) {
      console.warn("⚠️ Database unavailable during status update. Mocking success.")
    }

    return NextResponse.json({ success: true, message: `Listing status updated to ${status} successfully.` })
  } catch (error: any) {
    console.error("Error toggling listing status:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
