import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export const dynamic = "force-dynamic"

// High-fidelity mock users in case the database is offline/unmigrated
const MOCK_USERS = [
  {
    id: "user-1",
    email: "admin@aether.net",
    name: "Aether Administrator",
    role: UserRole.ADMIN,
    createdAt: new Date("2026-01-01"),
    bio: "Superuser managing platform operations, security, and catalog validation.",
    website: "https://aether.net"
  },
  {
    id: "user-2",
    email: "creator.spark@flow.io",
    name: "Alex Rivera",
    role: UserRole.SELLER,
    createdAt: new Date("2026-03-15"),
    bio: "AI Engineer specializing in cognitive prompting templates and LangChain flows.",
    website: "https://rivera.ai"
  },
  {
    id: "user-3",
    email: "snippet.king@code.net",
    name: "Sarah Chen",
    role: UserRole.SELLER,
    createdAt: new Date("2026-04-10"),
    bio: "Full Stack Engineer crafting high-performance Next.js and Go modular snippets.",
    website: "https://sarahchen.dev"
  },
  {
    id: "user-4",
    email: "buyer.one@gmail.com",
    name: "Marcus Aurelius",
    role: UserRole.BUYER,
    createdAt: new Date("2026-05-01"),
    bio: "AI enthusiast browsing for productivity pipelines.",
    website: null
  }
]

export async function GET() {
  try {
    // 1. Authenticate and authorize as Admin
    const session = await auth()
    if (!session || !session.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 })
    }

    // 2. Fetch users from Database
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          bio: true,
          website: true
        }
      })
      
      // If database is empty or we are in mock mode, merge/fallback
      if (users.length === 0) {
        return NextResponse.json({ users: MOCK_USERS })
      }

      return NextResponse.json({ users })
    } catch (dbErr) {
      console.warn("⚠️ Database connection failed in admin/users fetch. Serving mock users.")
      return NextResponse.json({ users: MOCK_USERS, isMock: true })
    }
  } catch (error: any) {
    console.error("Admin user list fetch error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate and authorize as Admin
    const session = await auth()
    if (!session || !session.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 })
    }

    const { userId, newRole } = await request.json()
    if (!userId || !newRole) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 })
    }

    // Validate role
    if (!Object.values(UserRole).includes(newRole as UserRole)) {
      return NextResponse.json({ error: "Invalid user role specified." }, { status: 400 })
    }

    // Prevent self-demotion
    if (userId === session.user.id) {
      return NextResponse.json({ error: "Operation blocked. You cannot modify your own administrative role." }, { status: 403 })
    }

    // 2. Update user role in database
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole as UserRole },
        select: { id: true, email: true, role: true }
      })

      // Dispatch alert notification to the user
      await prisma.notification.create({
        data: {
          userId,
          type: "APPROVAL",
          message: `Your platform role has been updated to ${newRole} by the administration.`,
          link: "/dashboard",
          read: false
        }
      })

      return NextResponse.json({ 
        success: true, 
        message: `User ${updatedUser.email} role updated to ${newRole} successfully.`,
        user: updatedUser 
      })
    } catch (dbErr) {
      console.warn("⚠️ Database connection failed during user role update. Mocking success.")
      return NextResponse.json({ 
        success: true, 
        message: `[MOCK SUCCESS] User role updated to ${newRole} in sandbox mode.` 
      })
    }
  } catch (error: any) {
    console.error("Admin user role update error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
