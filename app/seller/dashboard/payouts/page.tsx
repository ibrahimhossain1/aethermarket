export const dynamic = "force-dynamic"

import * as React from "react"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import PayoutsOnboardButton from "@/components/payouts-onboard-button"
import { 
  Wallet, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  Coins
} from "lucide-react"

export default async function PayoutsPage() {
  const session = await auth()
  const sellerId = session!.user.id

  // Fetch the latest user profile state to check stripeAccountId
  let user: any = null
  try {
    user = await prisma.user.findUnique({
      where: { id: sellerId },
      select: { stripeAccountId: true }
    })
  } catch (e) {
    console.warn("⚠️ Database connection failed. serving local session settings fallbacks.")
    user = { stripeAccountId: session!.user.stripeAccountId }
  }

  const isConnected = !!user?.stripeAccountId

  // Mock Payout Logs (will fetch dynamically in production)
  const mockPayouts = [
    { id: "po_1payout888", amount: 48000, status: "PAID", target: "Visa ending in 4242", date: "2026-05-15" },
    { id: "po_2payout999", amount: 92000, status: "PAID", target: "Visa ending in 4242", date: "2026-05-20" }
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* 1. Page Header */}
      <div className="border-b border-zinc-900 pb-4">
        <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest leading-none">Payout Nodes</h2>
        <p className="text-xs text-zinc-550 mt-1.5">Manage your linked banking accounts, view transfer statements, and check Stripe balances.</p>
      </div>

      {/* 2. DYNAMIC LAYOUT BASED ON ONBOARDING CONNECTION */}
      {!isConnected ? (
        // STATE A: NOT CONNECTED -> ONBOARDING BANNER
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 p-8 flex flex-col gap-6">
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-950/50 border border-indigo-900/40 text-indigo-400 flex items-center justify-center shrink-0">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white tracking-tight">Setup Bank Transfers</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">We use Stripe Connect Express to handle secure, instantaneous bank transfers globally.</p>
            </div>
          </div>

          <div className="bg-zinc-900/30 rounded-xl border border-zinc-850 p-5 text-xs text-zinc-500 leading-relaxed font-light">
            <span className="font-bold text-zinc-300 block mb-2 uppercase tracking-wide text-[10px]">Onboarding Prerequisites:</span>
            <ul className="list-disc list-inside flex flex-col gap-1.5 pl-1">
              <li>
                You will be redirected to Stripe's secure identity portal to input standard verification details (tax ID, business bio, or phone number).
              </li>
              <li>
                You can link a standard <span className="font-bold text-white">US checking account</span> or a supported debit card for instant deposits.
              </li>
              <li>
                Revenues are compiled daily and deposited automatically every Monday (transfer time varies based on linked bank nodes).
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <PayoutsOnboardButton />
          </div>

        </div>
      ) : (
        // STATE B: CONNECTED -> BALANCE SUMMARY & PAYOUT RECORDS
        <div className="flex flex-col gap-6 w-full">
          
          {/* Linked Bank Card Indicator */}
          <div className="rounded-2xl border border-emerald-900/50 bg-emerald-950/10 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  Bank Connection Active
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-mono truncate max-w-[250px] sm:max-w-md">
                  Stripe Connected Node ID: {user.stripeAccountId}
                </p>
              </div>
            </div>
            
            <a 
              href="https://dashboard.stripe.com" 
              target="_blank" 
              rel="noreferrer"
              className="rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-3.5 py-1.5 text-[9px] font-bold text-zinc-300 hover:text-white transition flex items-center gap-1 shrink-0"
            >
              Stripe Login <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          {/* Quick Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Available Balance */}
            <div className="rounded-xl border border-zinc-850 p-4 bg-zinc-900/20 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-zinc-550 tracking-wider">Available Stripe Balance</span>
                <h3 className="font-display text-2xl font-bold text-white tracking-tight mt-1">$145.20</h3>
              </div>
              <div className="h-9 w-9 rounded-xl bg-zinc-905 border border-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                <Coins className="h-4.5 w-4.5 text-emerald-400" />
              </div>
            </div>

            {/* Pending Payout */}
            <div className="rounded-xl border border-zinc-850 p-4 bg-zinc-900/20 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-zinc-550 tracking-wider">Pending Transfer</span>
                <h3 className="font-display text-2xl font-bold text-white tracking-tight mt-1">$24.50</h3>
              </div>
              <div className="h-9 w-9 rounded-xl bg-zinc-905 border border-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                <Wallet className="h-4.5 w-4.5 text-violet-400" />
              </div>
            </div>

          </div>

          {/* Historical Payout Ledger */}
          <div className="rounded-xl border border-zinc-850 p-5 bg-zinc-950/30 mt-4">
            <h3 className="font-display text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-3 mb-4 flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
              Transfer History
            </h3>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    <th className="pb-3 pl-2">Transfer Date</th>
                    <th className="pb-3">Reference ID</th>
                    <th className="pb-3">Deposit Node</th>
                    <th className="pb-3 text-right pr-2">Paid Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {mockPayouts.map((po) => (
                    <tr key={po.id} className="hover:bg-zinc-900/10 transition-colors">
                      {/* Date */}
                      <td className="py-3.5 pl-2 text-zinc-300 font-semibold flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-zinc-650" />
                        {new Date(po.date).toLocaleDateString()}
                      </td>
                      {/* Reference */}
                      <td className="py-3.5 font-mono text-[10px] text-zinc-500">
                        {po.id}
                      </td>
                      {/* Deposit target */}
                      <td className="py-3.5 text-zinc-450 font-light">
                        {po.target}
                      </td>
                      {/* Amount */}
                      <td className="py-3.5 text-right pr-2 font-bold text-white font-mono">
                        ${(po.amount / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}
