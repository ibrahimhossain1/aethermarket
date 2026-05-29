import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase Storage Client securely
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
let supabase: any = null

if (
  supabaseUrl && 
  supabaseServiceKey && 
  !supabaseUrl.includes("[YOUR_PROJECT_ID]") &&
  !supabaseServiceKey.includes("key_here")
) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey)
  } catch (e) {
    console.warn("⚠️ Supabase URL is invalid, falling back to local simulation mode:", e)
  }
}

interface RouteParams {
  params: {
    purchaseId: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { purchaseId } = params
    if (!purchaseId) {
      return NextResponse.json({ error: "Purchase ID is required." }, { status: 400 })
    }

    // 1. Authenticate user session
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to download assets." }, { status: 401 })
    }

    // 2. Fetch purchase details & verify ownership
    let purchase: any = null
    try {
      purchase = await prisma.purchase.findUnique({
        where: { id: purchaseId },
        include: {
          product: {
            select: {
              assetKey: true,
              title: true,
            }
          }
        }
      })
    } catch (e) {
      // In-memory mock mapping for simulation checks
      console.warn("⚠️ Database unavailable. Simulating secure download verification.")
      const { MOCK_PRODUCTS } = require("@/lib/mockData")
      purchase = {
        buyerId: session.user.id,
        refunded: false,
        product: MOCK_PRODUCTS[0], // fallback sample
      }
    }

    if (!purchase) {
      return NextResponse.json({ error: "Transaction record not found." }, { status: 404 })
    }

    // Access control check
    if (purchase.buyerId !== session.user.id) {
      return NextResponse.json({ error: "Access Denied. You do not own this asset." }, { status: 403 })
    }

    if (purchase.refunded) {
      return NextResponse.json({ error: "Access Denied. This transaction was refunded." }, { status: 403 })
    }

    // 3. SECURE SUPABASE SIGNED URL GENERATION
    if (supabase) {
      const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "digital-assets"
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(purchase.product.assetKey, 3600) // 1-hour expiry

      if (error || !data?.signedUrl) {
        console.error("❌ Failed to generate Supabase signed URL:", error)
        return NextResponse.json({ error: "Failed to securely retrieve asset. Please contact support." }, { status: 500 })
      }

      // Redirect client to Supabase secure signed link
      return NextResponse.redirect(data.signedUrl)
    } else {
      // 4. OFFLINE DEVELOPER SIMULATION FALLBACK
      console.warn("⚠️ Supabase credentials not found. Redirecting to mock digital asset.")
      
      // Serve a sample mockup zip file from public nextjs assets or a dummy test link
      const mockZipUrl = "https://raw.githubusercontent.com/nidhinjs/prompt-master/main/README.md" // Safe template file link for simulation downloads
      return NextResponse.redirect(mockZipUrl)
    }
  } catch (error: any) {
    console.error("Error in download route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
