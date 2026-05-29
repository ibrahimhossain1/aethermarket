import { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://aether.net"

  // Static routes
  const routes = [
    "",
    "/marketplace",
    "/auth/signin",
    "/auth/signup"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8
  }))

  // Dynamic Product routes
  try {
    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true }
    })

    const productRoutes = products.map((prod) => ({
      url: `${baseUrl}/marketplace/${prod.slug}`,
      lastModified: prod.updatedAt.toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6
    }))

    return [...routes, ...productRoutes]
  } catch (err) {
    console.warn("⚠️ Database offline during sitemap generation. Serving static routes.")
    // Fallback to our premium mock assets
    const { MOCK_PRODUCTS } = require("@/lib/mockData")
    const mockRoutes = MOCK_PRODUCTS.map((prod: any) => ({
      url: `${baseUrl}/marketplace/${prod.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6
    }))

    return [...routes, ...mockRoutes]
  }
}
