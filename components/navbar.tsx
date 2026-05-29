"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession, signOut } from "@/components/providers"
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  Menu, 
  X,
  Sparkles,
  ShieldCheck,
  TrendingUp
} from "lucide-react"
import { useCart } from "@/lib/store/useCart"
import { useSaved } from "@/lib/store/useSaved"

export default function Navbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  
  const cartItems = useCart((state) => state.items)
  const savedItems = useSaved((state) => state.items)
  
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false)

  // Sync state search query with URL params
  React.useEffect(() => {
    const currentSearch = searchParams.get("search")
    if (currentSearch) {
      setSearchQuery(currentSearch)
    } else {
      setSearchQuery("")
    }
  }, [searchParams])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/marketplace")
    }
    setIsMobileMenuOpen(false)
  }

  interface NotificationItem {
    id: string
    type: string
    message: string
    read: boolean
    link: string | null
    createdAt: string | Date
  }

  const [notifications, setNotifications] = React.useState<NotificationItem[]>([])

  React.useEffect(() => {
    if (!session) {
      setNotifications([])
      return
    }

    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications")
        if (res.ok) {
          const data = await res.json()
          setNotifications(data.notifications || [])
        }
      } catch (err) {
        console.error("Failed to load notifications:", err)
      }
    }

    fetchNotifications()
    // Poll notifications every 45 seconds to keep it fresh
    const interval = setInterval(fetchNotifications, 45000)
    return () => clearInterval(interval)
  }, [session])

  const unreadNotificationsCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = async (id: string, link: string | null) => {
    // Optimistic UI update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id })
      })
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }

    setIsNotificationsOpen(false)
    if (link) {
      router.push(link)
    }
  }

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true })
      })
    } catch (err) {
      console.error("Failed to mark all as read:", err)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-400 via-violet-600 to-indigo-500 bg-clip-text font-display text-2xl font-bold tracking-wider text-transparent transition hover:opacity-90">
              AETHER
            </span>
            <span className="hidden rounded-full border border-violet-800/50 bg-violet-950/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-violet-400 sm:inline-block">
              Market
            </span>
          </Link>
        </div>

        {/* NAVIGATION LINKS & DYNAMIC CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Main nav items */}
          <nav className="hidden lg:flex lg:items-center lg:gap-6">
            <Link href="/marketplace" className="text-sm font-medium text-zinc-300 transition hover:text-white">
              Browse
            </Link>
            <Link href="/marketplace?type=PROMPT" className="text-sm font-medium text-zinc-400 transition hover:text-white">
              AI Prompts
            </Link>
            <Link href="/marketplace?type=SKILL" className="text-sm font-medium text-zinc-400 transition hover:text-white">
              Workflows
            </Link>
            <Link href="/marketplace?type=CODE" className="text-sm font-medium text-zinc-400 transition hover:text-white">
              Snippets
            </Link>
          </nav>

          {/* Divider */}
          <span className="hidden h-5 w-px bg-zinc-800 lg:block"></span>

          {/* Saved Wishlist Button */}
          <Link 
            href="/dashboard/saved" 
            className="relative p-2 text-zinc-400 transition hover:text-zinc-200 hover:bg-zinc-900/40 rounded-full"
            title="Saved Items"
          >
            <Heart className="h-5 w-5" />
            {savedItems.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-semibold text-white">
                {savedItems.length}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <button 
            onClick={() => useCart.getState().openCart()}
            className="relative p-2 text-zinc-400 transition hover:text-zinc-200 hover:bg-zinc-900/40 rounded-full"
            title="Shopping Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-semibold text-white animate-pulse">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-zinc-400 transition hover:text-zinc-200 hover:bg-zinc-900/40 rounded-full"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 rounded-full bg-emerald-500"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-800 bg-zinc-900/95 p-2 shadow-2xl backdrop-blur-md z-50">
                <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
                  <span className="text-xs font-semibold text-zinc-200">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-[9px] font-bold text-violet-450 hover:text-violet-400 uppercase tracking-wider transition"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-zinc-500">No notifications yet</div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => handleNotificationClick(n.id, n.link)}
                        className={`flex flex-col gap-1 rounded-lg px-3 py-2 cursor-pointer transition ${n.read ? "hover:bg-zinc-800/40" : "bg-violet-950/20 hover:bg-violet-900/20"}`}
                      >
                        <p className="text-xs text-zinc-200">{n.message}</p>
                        <span className="text-[9px] text-zinc-550 font-light">
                          {typeof n.createdAt === 'string' ? new Date(n.createdAt).toLocaleDateString() : n.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC USER MENU */}
          <div className="relative ml-2">
            {session ? (
              <div>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center justify-center h-9 w-9 rounded-full border border-zinc-800 bg-zinc-900 outline-none hover:border-zinc-700 transition"
                >
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name ?? "User"} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-violet-400">
                      {(session.user.name ?? session.user.email ?? "U").substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden z-50">
                    <div className="bg-zinc-950/40 border-b border-zinc-800 px-4 py-3">
                      <p className="text-xs font-semibold text-zinc-200 truncate">{session.user.name ?? "Aether Member"}</p>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">{session.user.email}</p>
                    </div>

                    <div className="p-1">
                      <Link 
                        href="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-400 transition hover:text-white hover:bg-zinc-800"
                      >
                        <LayoutDashboard className="h-4.5 w-4.5" />
                        Buyer Dashboard
                      </Link>

                      {(session.user.role === "SELLER" || session.user.role === "ADMIN") ? (
                        <Link 
                          href="/seller/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex flex-row items-center justify-between rounded-lg px-3 py-2 text-xs text-zinc-400 transition hover:text-white hover:bg-zinc-800"
                        >
                          <span className="flex items-center gap-2">
                            <TrendingUp className="h-4.5 w-4.5" />
                            Seller Analytics
                          </span>
                          <span className="rounded-full bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-400 uppercase tracking-wider">
                            Active
                          </span>
                        </Link>
                      ) : (
                        <Link 
                          href="/dashboard/settings"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-400 transition hover:text-white hover:bg-zinc-800"
                        >
                          <Sparkles className="h-4.5 w-4.5 text-violet-400 animate-pulse" />
                          <span className="text-violet-400 font-medium">Become a Seller</span>
                        </Link>
                      )}

                      {session.user.role === "ADMIN" && (
                        <Link 
                          href="/admin"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-400 transition hover:text-white hover:bg-zinc-800"
                        >
                          <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" />
                          <span className="text-indigo-400">Admin Control</span>
                        </Link>
                      )}

                      <Link 
                        href="/dashboard/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-400 transition hover:text-white hover:bg-zinc-800"
                      >
                        <Settings className="h-4.5 w-4.5" />
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-zinc-800 p-1 bg-zinc-950/30">
                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false)
                          signOut({ callbackUrl: "/" })
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                      >
                        <LogOut className="h-4.5 w-4.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex sm:items-center sm:gap-3">
                <Link href="/auth/signin" className="text-xs font-semibold text-zinc-400 transition hover:text-zinc-200">
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-400 transition hover:text-zinc-200 hover:bg-zinc-900/40 rounded-full lg:hidden"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 lg:hidden animate-in fade-in slide-in-from-top duration-200">
          
          {/* Navigation Links */}
          <nav className="flex flex-col gap-3">
            <Link 
              href="/marketplace" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg bg-zinc-900 px-4 py-3.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800 transition"
            >
              Browse All
            </Link>
            <Link 
              href="/marketplace?type=PROMPT" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg bg-zinc-905 px-4 py-3.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900 transition"
            >
              AI Prompts
            </Link>
            <Link 
              href="/marketplace?type=SKILL" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg bg-zinc-905 px-4 py-3.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900 transition"
            >
              Workflows & Skills
            </Link>
            <Link 
              href="/marketplace?type=CODE" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg bg-zinc-905 px-4 py-3.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900 transition"
            >
              Code Templates
            </Link>
          </nav>

          {!session && (
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-zinc-800">
              <Link 
                href="/auth/signin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex justify-center rounded-lg border border-zinc-800 bg-zinc-900 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex justify-center rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
