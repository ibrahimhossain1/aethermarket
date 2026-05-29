"use client"

import * as React from "react"
import { 
  Wallet, 
  Check, 
  X, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  Coins,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react"

interface Payout {
  id: string
  sellerName: string
  sellerEmail: string
  stripeAccountId: string
  amount: number
  status: "PENDING" | "PAID"
  createdAt: string
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = React.useState<Payout[]>([])
  const [loading, setLoading] = React.useState(true)
  const [toastMessage, setToastMessage] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")
  const [processingId, setProcessingId] = React.useState<string | null>(null)

  // Fetch payouts list
  React.useEffect(() => {
    async function loadPayouts() {
      try {
        const res = await fetch("/api/admin/payouts")
        if (!res.ok) throw new Error("Failed to load payout releases.")
        const data = await res.json()
        setPayouts(data.payouts || [])
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to establish secure Connect ledger connection.")
      } finally {
        setLoading(false)
      }
    }
    loadPayouts()
  }, [])

  // Trigger simulated payout release
  const handleRelease = async (payoutId: string, sellerName: string, amount: number) => {
    setProcessingId(payoutId)
    setToastMessage("")
    setErrorMessage("")

    try {
      const res = await fetch("/api/admin/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutId, action: "RELEASE" })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Stripe Connect Node rejected the transfer.")

      setToastMessage(`Successful Transfer! $${(amount / 100).toFixed(2)} USD successfully released to ${sellerName}.`)
      // Update local item status
      setPayouts(prev => prev.map(item => item.id === payoutId ? { ...item, status: "PAID" } : item))
    } catch (err: any) {
      setErrorMessage(err.message || "Stripe Express API node connection rejected.")
    } finally {
      setProcessingId(null)
    }
  }

  // Split payouts into pending and paid
  const pendingPayouts = payouts.filter(p => p.status === "PENDING")
  const paidPayouts = payouts.filter(p => p.status === "PAID")

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Page Header */}
      <div>
        <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest border-b border-zinc-900 pb-3 mb-1">Connect Payout Releases</h2>
        <p className="text-xs text-zinc-550">Review seller available balances, coordinate payouts, and authorize manual transfers.</p>
      </div>

      {/* Toast Alerts */}
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

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* Total Awaiting Release */}
        <div className="rounded-xl border border-zinc-850 p-4 bg-zinc-900/20 flex justify-between items-center">
          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-550 tracking-wider">Awaiting Release</span>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight mt-1">
              ${(pendingPayouts.reduce((sum, p) => sum + p.amount, 0) / 100).toFixed(2)}
            </h3>
          </div>
          <div className="h-9 w-9 rounded-xl bg-zinc-905 border border-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
            <Coins className="h-4.5 w-4.5 text-violet-400" />
          </div>
        </div>

        {/* Processed Payouts */}
        <div className="rounded-xl border border-zinc-850 p-4 bg-zinc-900/20 flex justify-between items-center">
          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-550 tracking-wider">Total Disbursed</span>
            <h3 className="font-display text-2xl font-bold text-emerald-400 tracking-tight mt-1">
              ${(paidPayouts.reduce((sum, p) => sum + p.amount, 0) / 100).toFixed(2)}
            </h3>
          </div>
          <div className="h-9 w-9 rounded-xl bg-zinc-905 border border-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
          </div>
        </div>

      </div>

      {/* Pending Releases Queue */}
      <div className="rounded-xl border border-zinc-850 p-5 bg-zinc-950/30 mt-2">
        <h3 className="font-display text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-3 mb-4 flex items-center gap-2">
          <Wallet className="h-4.5 w-4.5 text-indigo-500" />
          Outstanding Balances Ledger
        </h3>

        {loading ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-zinc-500 font-light">
            <Clock className="h-6 w-6 text-zinc-600 animate-spin" />
            <span className="text-xs">Connecting to Stripe node ledger...</span>
          </div>
        ) : pendingPayouts.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-550 border border-dashed border-zinc-850 rounded-xl">
            No pending payouts found. All active creators are fully paid.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  <th className="pb-3 pl-2">Creator Account</th>
                  <th className="pb-3">Stripe Node ID</th>
                  <th className="pb-3 text-right">Available Balance</th>
                  <th className="pb-3 text-right pr-2">Disbursement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {pendingPayouts.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/10 transition-colors">
                    {/* User */}
                    <td className="py-3.5 pl-2">
                      <span className="font-bold text-zinc-200 block">{item.sellerName}</span>
                      <span className="text-[10px] text-zinc-550 block font-mono mt-0.5">{item.sellerEmail}</span>
                    </td>
                    {/* Stripe Account */}
                    <td className="py-3.5 font-mono text-[10px] text-zinc-500">
                      {item.stripeAccountId}
                    </td>
                    {/* Amount */}
                    <td className="py-3.5 text-right font-bold text-white font-mono">
                      ${(item.amount / 100).toFixed(2)}
                    </td>
                    {/* Release Button */}
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => handleRelease(item.id, item.sellerName, item.amount)}
                        disabled={processingId !== null}
                        className="rounded-lg bg-violet-600 hover:bg-violet-500 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg shadow-violet-500/10 transition flex items-center gap-1 ml-auto"
                      >
                        Release <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Disbursed Statements Ledger */}
      {paidPayouts.length > 0 && (
        <div className="rounded-xl border border-zinc-850 p-5 bg-zinc-950/10 mt-4">
          <h3 className="font-display text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-3 mb-4">
            Recent Disbursed Statements
          </h3>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-[10px] uppercase font-bold text-zinc-650 tracking-wider">
                  <th className="pb-3 pl-2">Creator Account</th>
                  <th className="pb-3">Stripe Node ID</th>
                  <th className="pb-3 text-right">Transfer Reference</th>
                  <th className="pb-3 text-right pr-2">Released Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {paidPayouts.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/10 transition-colors">
                    {/* User */}
                    <td className="py-3.5 pl-2">
                      <span className="font-semibold text-zinc-450 block">{item.sellerName}</span>
                      <span className="text-[9px] text-zinc-600 block font-mono mt-0.5">{item.sellerEmail}</span>
                    </td>
                    {/* Stripe Account */}
                    <td className="py-3.5 font-mono text-[9px] text-zinc-600">
                      {item.stripeAccountId}
                    </td>
                    {/* Reference */}
                    <td className="py-3.5 text-right font-mono text-[9px] text-zinc-550">
                      tr_{item.id}
                    </td>
                    {/* Released Amount */}
                    <td className="py-3.5 text-right pr-2 font-semibold text-emerald-400 font-mono">
                      ${(item.amount / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
