import type { Metadata, Viewport } from "next"
import { Inter, Syne, JetBrains_Mono } from "next/font/google"
import { Providers } from "@/components/providers"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AETHER | Premium Digital Products Marketplace",
  description: "Browse, purchase, and download premium AI prompts, reusable skills, and code templates on Aether, the ultimate developer marketplace.",
  metadataBase: new URL("http://localhost:3000"),
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

import { Suspense } from "react"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="flex min-h-screen flex-col font-sans bg-background text-foreground antialiased selection:bg-violet-600/35 selection:text-white">
        <Providers>
          <Suspense fallback={<div className="h-16 w-full bg-zinc-950/80 border-b border-zinc-805" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
