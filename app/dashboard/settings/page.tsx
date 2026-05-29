export const dynamic = "force-dynamic"

import * as React from "react"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import SettingsForm from "@/components/settings-form"

export default async function SettingsPage() {
  const session = await auth()
  const userId = session!.user.id

  // Fetch the latest profile data from database
  let user: any = null
  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        bio: true,
        website: true,
        role: true,
      }
    })
  } catch (e) {
    // In-memory mock mapping for offline settings tests
    console.warn("⚠️ Database unavailable. serving local session settings fallbacks.")
    const { MOCK_USERS } = require("@/lib/mockData")
    user = {
      name: session!.user.name,
      email: session!.user.email,
      bio: "Active developer and prompter on Aether.",
      website: null,
      role: session!.user.role,
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Page Header */}
      <div className="border-b border-zinc-900 pb-4">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-xs text-zinc-500 mt-1">Configure your public display details, portfolio links, or apply to become a seller.</p>
      </div>

      {/* Settings Form Wrapper */}
      {user && (
        <SettingsForm initialUser={user} />
      )}

    </div>
  )
}
