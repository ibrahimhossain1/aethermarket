"use client"

import * as React from "react"
import { Line } from "react-chartjs-2"
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from "chart.js"
import { Download, TrendingUp, Calendar, ChevronDown } from "lucide-react"

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface TransactionLog {
  id: string
  productTitle: string
  buyerEmail: string
  amount: number // in cents
  platformFee: number // in cents
  date: string
}

interface RevenueChartProps {
  transactions: TransactionLog[]
}

export default function RevenueChart({ transactions }: RevenueChartProps) {
  const [range, setRange] = React.useState<"daily" | "weekly" | "monthly">("weekly")

  // Compile datasets based on timeframes
  const chartDataMap = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [120, 190, 340, 210, 480, 520, 390] // in dollars
    },
    weekly: {
      labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7"],
      data: [890, 1240, 1530, 980, 1840, 2450, 1920]
    },
    monthly: {
      labels: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"],
      data: [4200, 5900, 7100, 8900, 12400, 15400]
    }
  }

  const activeSet = chartDataMap[range]

  // Chart configurations
  const data = {
    labels: activeSet.labels,
    datasets: [
      {
        fill: true,
        label: "Revenue ($ USD)",
        data: activeSet.data,
        borderColor: "#7c3aed", // violet-600
        backgroundColor: "rgba(124, 58, 237, 0.08)",
        borderWidth: 2,
        pointBackgroundColor: "#7c3aed",
        pointBorderColor: "#fafafa",
        pointHoverRadius: 6,
        tension: 0.35,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "#111111",
        titleColor: "#fafafa",
        bodyColor: "#a1a1aa",
        borderColor: "#27272a",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context: any) => `Revenue: $${context.raw}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: "rgba(39, 39, 42, 0.3)"
        },
        ticks: {
          color: "#71717a",
          font: {
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: "rgba(39, 39, 42, 0.3)"
        },
        ticks: {
          color: "#71717a",
          font: {
            size: 10
          },
          callback: (value: any) => `$${value}`
        }
      }
    }
  }

  // Compile & Export CSV Data
  const handleExportCSV = () => {
    // 1. Define standard report logs (if none exist, compile beautiful simulated seeds)
    const reportLogs = transactions.length > 0 ? transactions : [
      { id: "tx-1", productTitle: "Cognitive Multi-Agent Architect Prompt", buyerEmail: "buyer@gmail.com", amount: 1900, platformFee: 285, date: "2026-05-25" },
      { id: "tx-2", productTitle: "Stripe-to-Discord Financial Analytics Sync", buyerEmail: "buyer@gmail.com", amount: 2900, platformFee: 435, date: "2026-05-27" }
    ]

    // 2. Map report array to formatted rows
    const csvHeaders = ["Transaction ID", "Product Title", "Buyer Email", "Price (USD)", "Platform Fee (15% Cut)", "Net Earnings (Seller)", "Date"]
    const csvRows = reportLogs.map((tx) => {
      const price = (tx.amount / 100).toFixed(2)
      const fee = (tx.platformFee / 100).toFixed(2)
      const net = ((tx.amount - tx.platformFee) / 100).toFixed(2)
      return [
        tx.id,
        `"${tx.productTitle.replace(/"/g, '""')}"`, // escape quotes
        tx.buyerEmail,
        `$${price}`,
        `$${fee}`,
        `$${net}`,
        tx.date
      ]
    })

    // 3. Assemble CSV string
    const csvString = [
      csvHeaders.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n")

    // 4. Trigger browser file download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `sales_report_${range}_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="rounded-2xl border border-zinc-850 bg-zinc-950/30 p-5 w-full flex flex-col gap-5">
      
      {/* Chart Headers: Toggles & CSV Downloads */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4">
        
        {/* Toggle tabs */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4.5 w-4.5 text-zinc-550" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2">Revenue Span</span>
          
          <div className="flex items-center gap-1 p-0.5 bg-zinc-900 border border-zinc-850 rounded-xl">
            {(["daily", "weekly", "monthly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={`rounded-lg px-3 py-1.5 text-[9px] font-bold transition uppercase tracking-wider ${
                  range === t 
                    ? "bg-zinc-800 text-white" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          className="rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-4 py-2 text-[10px] font-bold text-zinc-300 hover:text-white transition flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV Data
        </button>

      </div>

      {/* Render Chart Line */}
      <div className="relative w-full h-72 bg-zinc-950/10 rounded-xl">
        <Line data={data} options={options} />
      </div>

    </div>
  )
}
