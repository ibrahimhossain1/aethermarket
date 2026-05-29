import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import Stripe from "stripe"

const stripeKey = process.env.STRIPE_SECRET_KEY || ""
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2022-11-15" as any }) : null

export async function POST(request: Request) {
  try {
    // 1. Authenticate seller session
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { id: userId, email } = session.user

    // 2. SECURE STRIPE CONNECT ONBOARDING
    if (stripe) {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

      // Create a new Connected Account (Express)
      const account = await stripe.accounts.create({
        type: "express",
        email: email || undefined,
        capabilities: {
          transfers: { requested: true },
        },
      })

      // Update user with the pending stripeAccountId
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { stripeAccountId: account.id }
        })
      } catch (dbErr) {
        console.warn("⚠️ Database unavailable during Connect Account update.")
      }

      // Generate account links for onboarding redirection
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${baseUrl}/seller/dashboard/payouts?refresh=true`,
        return_url: `${baseUrl}/seller/dashboard/payouts?stripe_connected=true`,
        type: "account_onboarding",
      })

      return NextResponse.json({ url: accountLink.url })
    } else {
      // 3. ONBOARDING SANDBOX SIMULATOR FALLBACK
      console.warn("⚠️ Stripe secret key missing. Simulating Stripe Connect Express onboarding.")
      
      const mockStripeAccountId = "acct_stripe_connect_simulated_done"
      
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { stripeAccountId: mockStripeAccountId }
        })
      } catch (dbErr) {
        console.warn("⚠️ Database unavailable during mock Connect onboarding.")
      }

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
      return NextResponse.json({ url: `${baseUrl}/seller/dashboard/payouts?stripe_connected=true&mock=true` })
    }
  } catch (error: any) {
    console.error("Error in Stripe Connect onboarding:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
