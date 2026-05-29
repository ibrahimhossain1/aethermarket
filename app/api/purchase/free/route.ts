import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma, { isDatabaseOffline } from "@/lib/prisma"

export const dynamic = "force-dynamic"

declare global {
  var mockPurchases: any[] | undefined
}


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
    } catch (dbError: any) {
      console.error("❌ Free purchase transaction failed:", dbError)
      if (!isDatabaseOffline()) {
        return NextResponse.json({ error: dbError.message || "Database transaction failed." }, { status: 500 })
      }
      console.warn("⚠️ Database unavailable during free purchase. Simulating success return by registering mock purchase in sandbox mode.")
      
      // Register mock purchase in memory
      if (!globalThis.mockPurchases) {
        globalThis.mockPurchases = []
      }
      const alreadyPurchased = globalThis.mockPurchases.some(
        (p: any) => p.productId === productId && p.buyerId === session.user.id
      )
      if (!alreadyPurchased) {
        globalThis.mockPurchases.unshift({
          id: `mock-purchase-id-${Date.now()}`,
          buyerId: session.user.id,
          productId: product.id,
          stripePaymentIntentId: null,
          amount: product.price,
          platformFee: Math.round(product.price * 0.15),
          refunded: false,
          createdAt: new Date(),
          product: {
            ...product,
            seller: {
              id: product.sellerId,
              name: product.seller?.name || "Creator",
              image: product.seller?.image || ""
            }
          }
        })
      }
    }

    return NextResponse.json({ success: true, message: "Free asset successfully registered to your purchases dashboard." })
  } catch (error: any) {
    console.error("Error in free purchase route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
