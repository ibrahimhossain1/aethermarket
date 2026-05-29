import * as React from "react"
import Link from "next/link"
import { Layers, ShieldCheck, HelpCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950 text-zinc-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand & Intro */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text font-display text-xl font-bold tracking-wider text-transparent">
                AETHER
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500 max-w-xs">
              Aether is the premium digital e-commerce marketplace whitelisting robust AI prompts, automated skills/workflows, and production-ready code snippets.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-white transition">
                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-white transition">
                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Browse Products */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-widest mb-4">Browse</h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <Link href="/marketplace" className="hover:text-zinc-200 transition">All Products</Link>
              </li>
              <li>
                <Link href="/marketplace?type=PROMPT" className="hover:text-zinc-200 transition">AI Prompts</Link>
              </li>
              <li>
                <Link href="/marketplace?type=SKILL" className="hover:text-zinc-200 transition">Skills & Workflows</Link>
              </li>
              <li>
                <Link href="/marketplace?type=CODE" className="hover:text-zinc-200 transition">Code snippets</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sellers & Builders */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-widest mb-4">Sellers</h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <Link href="/seller/dashboard" className="hover:text-zinc-200 transition">Seller Hub</Link>
              </li>
              <li>
                <Link href="/seller/dashboard/listings/new" className="hover:text-zinc-200 transition">Add New Listing</Link>
              </li>
              <li>
                <Link href="/seller/dashboard/payouts" className="hover:text-zinc-200 transition">Payout Settings</Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-zinc-200 transition">Seller Guidelines</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Support */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-widest mb-4">Aether Marketplace</h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />
                  Secured by Stripe
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <Layers className="h-3.5 w-3.5 text-indigo-400" />
                  Signed Supabase URLS
                </span>
              </li>
              <li>
                <Link href="/help" className="flex items-center gap-1.5 hover:text-zinc-200 transition">
                  <HelpCircle className="h-3.5 w-3.5 text-zinc-500" />
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Horizontal Line & Lower Row */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-zinc-600">
            &copy; {new Date().getFullYear()} Aether Inc. All rights reserved. Built for creators, developers, and AI enthusiasts.
          </p>
          <div className="flex items-center gap-6 text-[10px] text-zinc-600">
            <Link href="/terms" className="hover:text-zinc-400 transition">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-zinc-400 transition">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
