import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import Stripe from "stripe"
import { getProductBySlug } from "@/lib/data"

// Initialize Stripe (optional fallback)
const stripeKey = process.env.STRIPE_SECRET_KEY || ""
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2022-11-15" as any }) : null

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to purchase." }, { status: 401 })
    }

    const { productId } = await request.json()
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 })
    }

    // 2. Fetch product details
    let product: any = null
    try {
      product = await prisma.product.findUnique({
        where: { id: productId },
        include: { seller: true }
      })
    } catch (e) {
      // Fallback in case of database absence during local checks
      const { MOCK_PRODUCTS } = require("@/lib/mockData")
      product = MOCK_PRODUCTS.find((p: any) => p.id === productId)
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 })
    }

    if (product.isFree) {
      return NextResponse.json({ error: "Product is free. Use the free download flow instead." }, { status: 400 })
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const platformFee = Math.round(product.price * 0.15) // 15% platform commission

    // 3. SECURE AUTHENTIC STRIPE DEPLOYMENT
    if (stripe) {
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.title,
                description: product.description.substring(0, 100) + "...",
                images: product.previewImages?.[0] ? [product.previewImages[0]] : undefined
              },
              unit_amount: product.price,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/dashboard/purchases?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/marketplace/${product.slug}?canceled=true`,
        customer_email: session.user.email || undefined,
        metadata: {
          productId: product.id,
          buyerId: session.user.id,
          platformFee: platformFee.toString(),
        },
      })

      return NextResponse.json({ url: stripeSession.url })
    } else {
      // 4. STRIPE SANDBOX SIMULATOR FALLBACK
      console.warn("⚠️ STRIPE_SECRET_KEY is missing. Invoking transaction sandbox simulator.")
      
      // Return a special success redirect route that registers a simulator purchase directly
      const mockSuccessUrl = `${baseUrl}/api/purchase/mock-success?productId=${product.id}&buyerId=${session.user.id}`
      return NextResponse.json({ url: mockSuccessUrl })
    }
  } catch (error: any) {
    console.error("Error in checkout route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
