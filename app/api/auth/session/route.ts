import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySessionToken } from "@/lib/supabase-admin"
import { auth } from "@/auth"
import prisma, { isDatabaseOffline, flagDatabaseOffline } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export const dynamic = "force-dynamic"

/**
 * GET endpoint to retrieve the currently active cookie session.
 */
export async function GET() {
  try {
    const session = await auth()
    return NextResponse.json(session)
  } catch (error) {
    return NextResponse.json(null)
  }
}

/**
 * POST endpoint to generate an HTTP-Only session cookie from client access token.
 */
export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json()
    
    if (!accessToken) {
      return NextResponse.json({ error: "Missing Access Token" }, { status: 400 })
    }

    // 1. Verify Supabase Access Token (JWT)
    const decodedClaims = await verifySessionToken(accessToken)
    
    if (!decodedClaims.email) {
      return NextResponse.json({ error: "Invalid Token: Missing email payload" }, { status: 400 })
    }

    // 2. Synchronize user in Database with resilient fail-soft check
    let dbUser: any = null
    
    if (isDatabaseOffline()) {
      dbUser = {
        id: "mock-user-id-" + decodedClaims.email.replace(/[^a-zA-Z0-9]/g, ""),
        email: decodedClaims.email,
        name: decodedClaims.name || decodedClaims.email.split("@")[0],
        image: decodedClaims.picture || "",
        role: UserRole.BUYER
      }
    } else {
      try {
        dbUser = await prisma.user.findUnique({
          where: { email: decodedClaims.email }
        })

        if (!dbUser) {
          // Provision a new BUYER account
          dbUser = await prisma.user.create({
            data: {
              email: decodedClaims.email,
              name: decodedClaims.name || decodedClaims.email.split("@")[0],
              image: decodedClaims.picture || "",
              role: UserRole.BUYER,
              emailVerified: new Date(),
            }
          })
        }
      } catch (dbError) {
        console.warn("⚠️ Database connection failed. Flagging DB as offline and serving Sandbox profile:", dbError)
        flagDatabaseOffline()
        
        dbUser = {
          id: "mock-user-id-" + decodedClaims.email.replace(/[^a-zA-Z0-9]/g, ""),
          email: decodedClaims.email,
          name: decodedClaims.name || decodedClaims.email.split("@")[0],
          image: decodedClaims.picture || "",
          role: UserRole.BUYER
        }
      }
    }

    // 3. Set secure HttpOnly cookie containing the Supabase access token (expires in 7 days)
    const cookieStore = cookies()
    cookieStore.set("supabase-session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days in seconds
    })

    const adminEmails = [
      "faysallahmed3@gmail.com",
      "faysalmia7@gmail.com",
      "ibrahimhossainrajon@gmail.com"
    ]
    let finalRole = dbUser.role
    if (adminEmails.includes(dbUser.email.toLowerCase())) {
      finalRole = UserRole.ADMIN
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: finalRole
      } 
    })
  } catch (error: any) {
    console.error("Error setting session cookie:", error)
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 })
  }
}

/**
 * DELETE endpoint to log out the user by wiping the session cookie.
 */
export async function DELETE() {
  try {
    const cookieStore = cookies()
    cookieStore.set("supabase-session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0 // Wipe instantly
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting session:", error)
    return NextResponse.json({ error: "Failed to log out session" }, { status: 500 })
  }
}
