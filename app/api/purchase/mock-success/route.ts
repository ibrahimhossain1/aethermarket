import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { resend } from "@/lib/resend"
import PurchaseReceiptEmail from "@/components/emails/purchase-receipt"

export const dynamic = "force-dynamic"

declare global {
  var mockPurchases: any[] | undefined
}


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const buyerId = searchParams.get("buyerId")

    if (!productId || !buyerId) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 })
    }

    // Fetch product details
    let product: any = null
    try {
      product = await prisma.product.findUnique({
        where: { id: productId }
      })
    } catch (e) {
      // Ignore DB errors and check in-memory MOCK_PRODUCTS
    }

    if (!product) {
      const { MOCK_PRODUCTS } = require("@/lib/mockData")
      product = MOCK_PRODUCTS.find((p: any) => p.id === productId)
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 })
    }

    const platformFee = Math.round(product.price * 0.15)
    const paymentIntentId = "mock_stripe_sim_" + Math.random().toString(36).substring(2, 10)

      // Register purchase inside a transaction
      let purchaseRecord: any = null

      try {
        await prisma.$transaction(async (tx) => {
          // 1. Create Purchase record
          const purchase = await tx.purchase.create({
            data: {
              buyerId,
              productId,
              stripePaymentIntentId: paymentIntentId,
              amount: product.price,
              platformFee,
              refunded: false,
            },
            include: {
              buyer: {
                select: {
                  name: true,
                  email: true,
                }
              },
              product: {
                select: {
                  title: true
                }
              }
            }
          })

          purchaseRecord = purchase

          // 2. Increment Product download count
          await tx.product.update({
            where: { id: productId },
            data: {
              downloadCount: { increment: 1 }
            }
          })

          // 3. Create Notification for the Seller
          const buyerName = purchase.buyer.name || purchase.buyer.email || "A buyer"
          const displayAmount = (product.price / 100).toFixed(2)
          
          await tx.notification.create({
            data: {
              userId: product.sellerId,
              type: "SALE",
              message: `[SIMULATOR] ${buyerName} purchased your listing '${product.title}' for $${displayAmount}.`,
              link: "/seller/dashboard",
              read: false,
            }
          })
        })

        // 4. Dispatch Email Receipt using Resend
        if (purchaseRecord) {
          try {
            const secureDownloadUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/download/${purchaseRecord.id}`
            const displayPrice = `$${(purchaseRecord.amount / 100).toFixed(2)}`
            
            await resend.emails.send({
              from: "Aether Exchange <noreply@aether.net>",
              to: purchaseRecord.buyer.email,
              subject: `Receipt: ${purchaseRecord.product.title} - Aether Exchange`,
              react: PurchaseReceiptEmail({
                buyerName: purchaseRecord.buyer.name || "Valued Developer",
                productTitle: purchaseRecord.product.title,
                pricePaid: displayPrice,
                downloadUrl: secureDownloadUrl,
                purchaseId: purchaseRecord.id
              })
            })
          } catch (emailErr) {
            console.warn("⚠️ Transactional receipt email dispatch failed during mock purchase.", emailErr)
          }
        }
      } catch (dbError) {
        console.warn("⚠️ Database unavailable during mock transaction. Mocking redirect behavior anyway.", dbError)
        
        // Register mock purchase in memory
        if (!globalThis.mockPurchases) {
          globalThis.mockPurchases = []
        }
        const alreadyPurchased = globalThis.mockPurchases.some(
          (p: any) => p.productId === productId && p.buyerId === buyerId
        )
        if (!alreadyPurchased) {
          globalThis.mockPurchases.unshift({
            id: paymentIntentId,
            buyerId,
            productId: product.id,
            stripePaymentIntentId: paymentIntentId,
            amount: product.price,
            platformFee,
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

    // Redirect to purchases dashboard with success flag
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    return NextResponse.redirect(`${baseUrl}/dashboard/purchases?success=true&mock=true`)
  } catch (error: any) {
    console.error("Error in mock success route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
