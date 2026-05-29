import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required registration parameters." }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 })
    }

    // 1. Verify if user already exists
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json({ error: "An account with this email address already exists." }, { status: 400 })
      }
    } catch (dbErr) {
      console.error("⚠️ Database connection failed during user check:", dbErr)
      return NextResponse.json({ error: "Database is currently offline. Unable to complete registration at this time." }, { status: 500 })
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // 3. Create User in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.BUYER
      }
    })

    // 4. Create welcome notification
    try {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "WELCOME",
          message: "Welcome to Aether Exchange! Explore our premium prompts, skills, and code templates.",
          link: "/marketplace",
          read: false
        }
      })
    } catch (notifyErr) {
      console.warn("⚠️ Welcome notification dispatch failed.", notifyErr)
    }

    return NextResponse.json({ 
      success: true, 
      message: "Congratulations! Your account has been created. Proceeding to Sign In..." 
    })
  } catch (error: any) {
    console.error("Custom registration error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
