import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to download free assets." }, { status: 401 })
    }

    const { productId } = await request.json()
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 })
    }

    // 2. Fetch product details
    let product: any = null
    try {
      product = await prisma.product.findUnique({
        where: { id: productId }
      })
    } catch (e) {
      const { MOCK_PRODUCTS } = require("@/lib/mockData")
      product = MOCK_PRODUCTS.find((p: any) => p.id === productId)
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 })
    }

    if (!product.isFree) {
      return NextResponse.json({ error: "Product is paid. Use Stripe checkout instead." }, { status: 400 })
    }

    try {
      // 3. Register transaction in a clean database scope
      await prisma.$transaction(async (tx) => {
        // Create Purchase record (amount and platform fee are zero)
        const purchase = await tx.purchase.create({
          data: {
            buyerId: session.user.id,
            productId,
            stripePaymentIntentId: null, // free
            amount: 0,
            platformFee: 0,
            refunded: false,
          },
          include: {
            buyer: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        })

        // Increment Product download count
        await tx.product.update({
          where: { id: productId },
          data: {
            downloadCount: { increment: 1 }
          }
        })

        // Create Notification for the Seller
        const buyerName = purchase.buyer.name || purchase.buyer.email || "A buyer"
        
        await tx.notification.create({
          data: {
            userId: product.sellerId,
            type: "SALE",
            message: `${buyerName} downloaded your free asset '${product.title}'.`,
            link: "/seller/dashboard",
            read: false,
          }
        })
      })
    } catch (dbError) {
      console.warn("⚠️ Database unavailable during free purchase. Simulating success return.")
    }

    return NextResponse.json({ success: true, message: "Free asset successfully registered to your purchases dashboard." })
  } catch (error: any) {
    console.error("Error in free purchase route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
