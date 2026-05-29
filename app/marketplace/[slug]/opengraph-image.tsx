import { ImageResponse } from "next/og"
import prisma from "@/lib/prisma"

export const runtime = "edge"
export const alt = "Aether Digital Exchange"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

interface Props {
  params: {
    slug: string
  }
}

export default async function Image({ params }: Props) {
  const { slug } = params
  
  let title = "Aether Workspace Asset"
  let category = "Exchange Listing"
  let priceText = "Premium Asset"

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { title: true, category: true, price: true, isFree: true }
    })
    
    if (product) {
      title = product.title
      category = product.category
      priceText = product.isFree ? "FREE" : `$${(product.price / 100).toFixed(2)}`
    }
  } catch (err) {
    console.warn("⚠️ Database query failed during OG image generation. Serving sandbox parameters.")
    const { MOCK_PRODUCTS } = require("@/lib/mockData")
    const mock = MOCK_PRODUCTS.find((p: any) => p.slug === slug)
    if (mock) {
      title = mock.title
      category = mock.category
      priceText = mock.isFree ? "FREE" : `$${(mock.price / 100).toFixed(2)}`
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "radial-gradient(circle at center, #180828 0%, #0a0a0a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "60px"
        }}
      >
        {/* Sleek outer glowing border */}
        <div
          style={{
            position: "absolute",
            inset: "25px",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            borderRadius: "24px",
            pointerEvents: "none"
          }}
        />

        {/* Small floating category indicator */}
        <div
          style={{
            background: "rgba(124, 58, 237, 0.15)",
            border: "1px solid rgba(124, 58, 237, 0.4)",
            borderRadius: "9999px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: "bold",
            color: "#c084fc",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "35px"
          }}
        >
          {category}
        </div>

        {/* Title of the product listing */}
        <div
          style={{
            fontSize: "58px",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
            maxWidth: "950px",
            lineHeight: "1.25",
            letterSpacing: "-1px",
            marginBottom: "40px"
          }}
        >
          {title}
        </div>

        {/* Price & Brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px"
          }}
        >
          {/* Price bubble */}
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#10b981",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "12px",
              padding: "10px 24px"
            }}
          >
            {priceText}
          </div>

          <div style={{ fontSize: "20px", color: "#52525b" }}>•</div>

          {/* Platform name */}
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#a1a1aa",
              letterSpacing: "3px"
            }}
          >
            AETHER EXCHANGE
          </div>
        </div>

        {/* Dynamic bottom branding details */}
        <div
          style={{
            position: "absolute",
            bottom: "55px",
            fontSize: "12px",
            color: "#52525b",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
        >
          Verified Secure Signed Digital Assets
        </div>
      </div>
    ),
    {
      ...size
    }
  )
}
