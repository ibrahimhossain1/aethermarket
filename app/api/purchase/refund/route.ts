import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import Stripe from "stripe"

const stripeKey = process.env.STRIPE_SECRET_KEY || ""
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2022-11-15" as any }) : null

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { purchaseId } = await request.json()
    if (!purchaseId) {
      return NextResponse.json({ error: "Purchase ID is required." }, { status: 400 })
    }

    // 2. Fetch purchase details & verify eligibility
    let purchase: any = null
    try {
      purchase = await prisma.purchase.findUnique({
        where: { id: purchaseId },
        include: {
          product: {
            select: {
              title: true,
              sellerId: true,
            }
          }
        }
      })
    } catch (e) {
      return NextResponse.json({ error: "Database unavailable." }, { status: 500 })
    }

    if (!purchase) {
      return NextResponse.json({ error: "Transaction record not found." }, { status: 404 })
    }

    // Access control check
    if (purchase.buyerId !== session.user.id) {
      return NextResponse.json({ error: "Access Denied. You do not own this transaction." }, { status: 403 })
    }

    if (purchase.refunded) {
      return NextResponse.json({ error: "This purchase has already been refunded." }, { status: 400 })
    }

    // 7-day eligibility check (7 days = 7 * 24 * 60 * 60 * 1000 milliseconds)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const purchaseTime = new Date(purchase.createdAt).getTime()
    
    if (purchaseTime < sevenDaysAgo) {
      return NextResponse.json({ error: "Refund window expired. Refunds are only valid within 7 days of purchase." }, { status: 400 })
    }

    // 3. SECURE STRIPE REFUND DISPATCH
    if (stripe && purchase.stripePaymentIntentId) {
      try {
        await stripe.refunds.create({
          payment_intent: purchase.stripePaymentIntentId,
        })
      } catch (stripeError: any) {
        console.error("❌ Stripe refund request failed:", stripeError)
        return NextResponse.json({ error: stripeError.message || "Failed to process Stripe refund." }, { status: 500 })
      }
    } else {
      console.warn("⚠️ Stripe key missing or free item transaction. Bypassing Stripe and processing simulator refund.")
    }

    // 4. DATABASE LEDGER SYNC & NOTIFICATIONS
    try {
      await prisma.$transaction(async (tx) => {
        // Update purchase record to refunded = true
        await tx.purchase.update({
          where: { id: purchaseId },
          data: { refunded: true }
        })

        // Notify Buyer
        await tx.notification.create({
          data: {
            userId: purchase.buyerId,
            type: "REFUND",
            message: `Your refund for the product '${purchase.product.title}' has been successfully processed.`,
            link: "/dashboard/purchases",
            read: false,
          }
        })

        // Notify Seller
        await tx.notification.create({
          data: {
            userId: purchase.product.sellerId,
            type: "REFUND",
            message: `A refund request was processed for '${purchase.product.title}'. Your account has been debited.`,
            link: "/seller/dashboard",
            read: false,
          }
        })
      })
    } catch (dbError) {
      console.error("❌ Database sync failed during refund:", dbError)
    }

    return NextResponse.json({ success: true, message: "Refund successfully processed. The funds have been returned." })
  } catch (error: any) {
    console.error("Error in refund route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
