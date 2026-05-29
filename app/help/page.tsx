import * as React from "react"
import Link from "next/link"
import { HelpCircle, ArrowLeft, Shield, Mail, CreditCard, Download } from "lucide-react"

export const metadata = {
  title: "Help & FAQs - Aether Exchange",
  description: "Get support, learn how to buy and sell AI prompts, workflows, and snippets on Aether.",
}

export default function HelpPage() {
  const faqs = [
    {
      icon: <Download className="h-5 w-5 text-violet-400" />,
      question: "How do I download my purchased assets?",
      answer: "Once your checkout is successful (or you click free instant download), you will be redirected to your 'My Purchased Assets' dashboard. From there, you can securely download your digital products (as .zip, .txt, or .yaml files) immediately."
    },
    {
      icon: <CreditCard className="h-5 w-5 text-indigo-400" />,
      question: "Is checkout secure?",
      answer: "Yes, 100%. All transactions are processed securely through Stripe Connect. We never store your credit card details or bank account information."
    },
    {
      icon: <Shield className="h-5 w-5 text-violet-450" />,
      question: "What is your refund policy?",
      answer: "We offer a 7-day refund guarantee for all purchased digital assets if they are broken, inaccurate, or fail to operate. You can easily request a refund with a single click directly from your Purchases dashboard."
    },
    {
      icon: <HelpCircle className="h-5 w-5 text-violet-400" />,
      question: "How do I become a seller?",
      answer: "You can become a verified seller in just one click! Navigate to your settings page under your profile dropdown, and click 'Become a Seller'. You can then onboard your Stripe account and start listing your AI prompt engineering templates, n8n workflows, or Next.js components."
    }
  ]

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Back Button */}
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-550 hover:text-zinc-300 transition uppercase tracking-wider mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Exchange
      </Link>

      {/* Header */}
      <div className="border-b border-zinc-900 pb-6 mb-12">
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">Help Center & FAQs</h1>
        <p className="text-sm text-zinc-500 mt-2">Find answers to frequently asked questions about the Aether developer exchange ecosystem.</p>
      </div>

      {/* FAQs list */}
      <div className="flex flex-col gap-6">
        {faqs.map((faq, idx) => (
          <div 
            key={idx}
            className="rounded-2xl border border-zinc-900 bg-zinc-950/45 p-6 backdrop-blur-sm"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                {faq.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-150 leading-snug">{faq.question}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-light mt-2.5">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help CTA Contact Card */}
      <div className="mt-16 rounded-2xl border border-dashed border-zinc-850 p-8 text-center bg-radial-glow/10">
        <Mail className="mx-auto h-8 w-8 text-violet-400 mb-3" />
        <h3 className="font-display text-base font-bold text-zinc-200">Still have questions?</h3>
        <p className="text-xs text-zinc-550 max-w-sm mx-auto mt-2 mb-6">
          Our global support agents are here to help you solve your product checkout or integration pipelines.
        </p>
        <a 
          href="mailto:support@aether.net" 
          className="rounded-full bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-xs font-semibold text-white transition shadow-md shadow-violet-500/10 inline-block"
        >
          Contact Support Team
        </a>
      </div>

    </div>
  )
}
