export const dynamic = "force-dynamic"

import * as React from "react"
import ListingCreateForm from "@/components/listing-create-form"

export default function NewListingPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Form Page Header */}
      <div className="border-b border-zinc-900 pb-4">
        <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest leading-none">Register New Listing</h2>
        <p className="text-xs text-zinc-550 mt-1.5">Map your prompt blueprints, automation workflows, or snippets to the exchange index.</p>
      </div>

      {/* Creation form */}
      <ListingCreateForm />

    </div>
  )
}
