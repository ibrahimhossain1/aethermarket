"use client"

import * as React from "react"
import { 
  Users, 
  Shield, 
  UserMinus, 
  UserCheck, 
  Sparkles, 
  Globe, 
  Search,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react"

interface User {
  id: string
  email: string
  name: string | null
  role: "BUYER" | "SELLER" | "ADMIN"
  createdAt: string
  bio: string | null
  website: string | null
}

export default function UserModerationPage() {
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [toastMessage, setToastMessage] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")
  const [processingId, setProcessingId] = React.useState<string | null>(null)

  // Fetch users on mount
  React.useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users")
        if (!res.ok) throw new Error("Failed to fetch users.")
        const data = await res.json()
        setUsers(data.users || [])
      } catch (err: any) {
        setErrorMessage(err.message || "Could not connect to user registry.")
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  // Toggle user role (e.g. elevate buyer to seller, or demote seller back to buyer)
  const handleRoleToggle = async (userId: string, currentRole: "BUYER" | "SELLER" | "ADMIN") => {
    setProcessingId(userId)
    setToastMessage("")
    setErrorMessage("")

    // Calculate new role
    let newRole: "BUYER" | "SELLER" | "ADMIN" = "BUYER"
    if (currentRole === "BUYER") {
      newRole = "SELLER"
    } else if (currentRole === "SELLER") {
      newRole = "ADMIN"
    } else {
      newRole = "BUYER"
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update user role.")

      setToastMessage(data.message)
      // Update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during role modification.")
    } finally {
      setProcessingId(null)
    }
  }

  // Ban/Delete user (simulated)
  const handleBanUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to ban user ${email}? This will suspend their marketplace listings.`)) {
      return
    }

    setProcessingId(userId)
    setToastMessage("")
    setErrorMessage("")

    try {
      // Toggling to BUYER or simulating database ban
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole: "BUYER" }) // demotes to Buyer
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to moderate user.")

      setToastMessage(`Suspension check executed. ${email} has been demoted and flagged in sandbox.`)
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to execute user moderation.")
    } finally {
      setProcessingId(null)
    }
  }

  // Filter users based on search
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Page Header */}
      <div>
        <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest border-b border-zinc-900 pb-3 mb-1">User Moderation Hub</h2>
        <p className="text-xs text-zinc-550">Promote/demote roles, audit seller authorization states, and manage accounts.</p>
      </div>

      {/* Toast Messages */}
      {toastMessage && (
        <div className="rounded-xl border border-emerald-900 bg-emerald-950/20 p-4 text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          {toastMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-rose-900 bg-rose-950/20 p-4 text-xs font-semibold text-rose-400 flex items-center gap-2">
          <XCircle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Search Filter */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-550" />
        <input
          type="text"
          placeholder="Filter by name or email address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 py-2.5 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none transition focus:border-violet-600"
        />
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-2 text-zinc-500 font-light border border-dashed border-zinc-850 rounded-2xl">
          <Clock className="h-8 w-8 text-zinc-600 animate-spin" />
          <span className="text-xs">Loading user registry index...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500 font-light border border-dashed border-zinc-850 rounded-2xl">
          No registered users matched your current query parameters.
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-850 p-5 bg-zinc-950/30 overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-900 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                <th className="pb-3 pl-2">User Details</th>
                <th className="pb-3">Security Role</th>
                <th className="pb-3">Joined Date</th>
                <th className="pb-3">Biography & Web Link</th>
                <th className="pb-3 text-right pr-2">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-900/10 transition-colors">
                  {/* Name and Email */}
                  <td className="py-3.5 pl-2">
                    <span className="font-bold text-zinc-200 block text-xs">{u.name || "Unnamed Account"}</span>
                    <span className="text-[10px] text-zinc-550 block mt-0.5 font-mono">{u.email}</span>
                  </td>
                  {/* Security Role Tag */}
                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                      u.role === "ADMIN" 
                        ? "bg-rose-950/40 text-rose-400 border border-rose-900/30" 
                        : u.role === "SELLER" 
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" 
                          : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                    }`}>
                      <Shield className="h-3 w-3 shrink-0" />
                      {u.role}
                    </span>
                  </td>
                  {/* Joined Date */}
                  <td className="py-3.5 text-zinc-400 font-light">
                    {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  {/* Bio & Link */}
                  <td className="py-3.5 max-w-[220px]">
                    <span className="text-zinc-500 block truncate font-light text-[11px]" title={u.bio || ""}>
                      {u.bio || "No profile bio declared."}
                    </span>
                    {u.website && (
                      <a 
                        href={u.website} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-violet-400 hover:underline inline-flex items-center gap-1 text-[9px] mt-0.5"
                      >
                        <Globe className="h-2.5 w-2.5" />
                        {u.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="py-3.5 text-right pr-2">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        disabled={processingId !== null}
                        className="rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 text-[10px] font-bold text-zinc-300 hover:text-white transition flex items-center gap-1"
                        title="Rotate security roles"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                        Cycle Role
                      </button>
                      
                      <button
                        onClick={() => handleBanUser(u.id, u.email)}
                        disabled={processingId !== null || u.role === "ADMIN"}
                        className="rounded-lg bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 hover:border-rose-800 px-3 py-1.5 text-[10px] font-bold text-rose-400 transition flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Ban user from platform"
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}
