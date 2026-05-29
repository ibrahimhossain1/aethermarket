import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import Stripe from "stripe"
import { resend } from "@/lib/resend"
import PurchaseReceiptEmail from "@/components/emails/purchase-receipt"

const stripeKey = process.env.STRIPE_SECRET_KEY || ""
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2022-11-15" as any }) : null

export async function POST(request: Request) {
  if (!stripe || !webhookSecret) {
    console.warn("⚠️ Stripe webhook secret or key is missing. Skipping webhook constructs.")
    return NextResponse.json({ received: false, error: "Stripe configuration disabled" }, { status: 400 })
  }

  const payload = await request.text()
  const sig = request.headers.get("stripe-signature") || ""

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret)
  } catch (err: any) {
    console.error("❌ Webhook Signature verification failed:", err.message)
    return NextResponse.json({ received: false, error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle successful checkout payments
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata

    if (metadata && metadata.productId && metadata.buyerId) {
      const { productId, buyerId, platformFee } = metadata
      const paymentIntentId = session.payment_intent as string || session.id
      const amountTotal = session.amount_total || 0
      const parsedPlatformFee = platformFee ? parseInt(platformFee) : Math.round(amountTotal * 0.15)

      try {
        await prisma.$transaction(async (tx) => {
          // 1. Create Purchase record
          const purchase = await tx.purchase.create({
            data: {
              buyerId,
              productId,
              stripePaymentIntentId: paymentIntentId,
              amount: amountTotal,
              platformFee: parsedPlatformFee,
              refunded: false,
            },
            include: {
              product: {
                select: {
                  title: true,
                  sellerId: true,
                }
              },
              buyer: {
                select: {
                  name: true,
                  email: true,
                }
              }
            }
          })

          // 2. Increment Product download count
          await tx.product.update({
            where: { id: productId },
            data: {
              downloadCount: { increment: 1 }
            }
          })

          // 3. Create Notification for the Seller
          const buyerName = purchase.buyer.name || purchase.buyer.email || "A buyer"
          const displayAmount = (amountTotal / 100).toFixed(2)
          
          await tx.notification.create({
            data: {
              userId: purchase.product.sellerId,
              type: "SALE",
              message: `Congratulations! ${buyerName} purchased your listing '${purchase.product.title}' for $${displayAmount}.`,
              link: "/seller/dashboard",
              read: false,
            }
          })
        })

        console.log(`✅ Successful purchase recorded in DB for Product ID: ${productId}, Buyer ID: ${buyerId}`)

        // 4. Dispatch Email Receipt using Resend
        try {
          const purchaseDetails = await prisma.purchase.findUnique({
            where: { stripePaymentIntentId: paymentIntentId },
            include: {
              product: { select: { title: true } },
              buyer: { select: { name: true, email: true } }
            }
          })

          if (purchaseDetails) {
            const secureDownloadUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/download/${purchaseDetails.id}`
            const displayPrice = `$${(purchaseDetails.amount / 100).toFixed(2)}`
            
            await resend.emails.send({
              from: "Aether Exchange <noreply@aether.net>",
              to: purchaseDetails.buyer.email,
              subject: `Receipt: ${purchaseDetails.product.title} - Aether Exchange`,
              react: PurchaseReceiptEmail({
                buyerName: purchaseDetails.buyer.name || "Valued Developer",
                productTitle: purchaseDetails.product.title,
                pricePaid: displayPrice,
                downloadUrl: secureDownloadUrl,
                purchaseId: purchaseDetails.id
              })
            })
          }
        } catch (emailErr) {
          console.warn("⚠️ Transactional receipt email dispatch failed.", emailErr)
        }
      } catch (dbError) {
        console.error("❌ Database transaction failed during Stripe webhook processing:", dbError)
        return NextResponse.json({ received: false, error: "Database transaction failed" }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
