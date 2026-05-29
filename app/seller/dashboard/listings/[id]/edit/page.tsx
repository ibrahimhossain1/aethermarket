import * as React from "react"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import ListingEditForm from "@/components/listing-edit-form"

interface EditListingPageProps {
  params: {
    id: string
  }
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = params
  
  // 1. Authenticate user
  const session = await auth()
  const sellerId = session!.user.id

  // 2. Fetch the listing
  let product: any = null
  try {
    product = await prisma.product.findUnique({
      where: { id },
    })
  } catch (err) {
    console.warn("⚠️ Database connection failed during edit page load. Serving mock fallbacks.")
    const { MOCK_PRODUCTS } = require("@/lib/mockData")
    product = MOCK_PRODUCTS.find((p: any) => p.id === id)
  }

  if (!product) {
    notFound()
  }

  // 3. Verify ownership
  if (product.sellerId !== sellerId) {
    redirect("/seller/dashboard/listings?error=access_denied")
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Page Header */}
      <div className="border-b border-zinc-900 pb-4">
        <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest leading-none">Modify Asset Listing</h2>
        <p className="text-xs text-zinc-550 mt-1.5 font-light">Pre-populate, adjust parameters, prices, or files for your marketplace product.</p>
      </div>

      {/* Edit Form */}
      <ListingEditForm product={product} />

    </div>
  )
}
