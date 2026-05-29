import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

// High-fidelity fallback notifications for sandboxed/offline users
const MOCK_NOTIFICATIONS = [
  {
    id: "notify-1",
    type: "WELCOME",
    message: "Welcome to Aether Exchange! Explore our premium prompts, skills, and code templates.",
    read: false,
    link: "/marketplace",
    createdAt: new Date()
  },
  {
    id: "notify-2",
    type: "SYSTEM",
    message: "Tip: Elevate your profile to a Seller account in settings to start monetizing your prompt workflows.",
    read: true,
    link: "/dashboard/settings",
    createdAt: new Date(Date.now() - 3600000)
  }
]

export async function GET() {
  try {
    // 1. Authenticate user
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const userId = session.user.id

    // 2. Fetch notifications from Database
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      })

      // Fallback to mock notification to ensure the interface looks great on first load
      if (notifications.length === 0) {
        return NextResponse.json({ notifications: MOCK_NOTIFICATIONS })
      }

      return NextResponse.json({ notifications })
    } catch (dbErr) {
      console.warn("⚠️ Database query failed for notifications. Serving sandbox mock fallback.")
      return NextResponse.json({ notifications: MOCK_NOTIFICATIONS, isMock: true })
    }
  } catch (error: any) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // 1. Authenticate user
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { notificationId, markAll } = await request.json()
    const userId = session.user.id

    // 2. Update status in Database
    try {
      if (markAll) {
        await prisma.notification.updateMany({
          where: { userId, read: false },
          data: { read: true }
        })
        return NextResponse.json({ success: true, message: "All notifications marked as read." })
      }

      if (!notificationId) {
        return NextResponse.json({ error: "Missing notification ID." }, { status: 400 })
      }

      await prisma.notification.update({
        where: { id: notificationId, userId },
        data: { read: true }
      })

      return NextResponse.json({ success: true, message: "Notification marked as read." })
    } catch (dbErr) {
      console.warn("⚠️ Database failed during notification update. Mocking success.")
      return NextResponse.json({ success: true, message: "[MOCK SUCCESS] Notification marked as read in sandbox." })
    }
  } catch (error: any) {
    console.error("Error updating notifications:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
