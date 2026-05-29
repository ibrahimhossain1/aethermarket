import prisma, { isDatabaseOffline, flagDatabaseOffline } from "@/lib/prisma"
import { MOCK_PRODUCTS, MOCK_USERS, MockProduct, MockUser } from "./mockData"
import { ProductType, ProductStatus, UserRole } from "@prisma/client"

declare global {
  var mockPurchases: any[] | undefined
}


export interface GetProductsFilters {
  type?: string
  category?: string
  search?: string
  minRating?: number
  priceRange?: [number, number] // in cents
  isFree?: boolean
  sort?: string
}

/**
 * Get all published products matching the filters and search parameters.
 * Falls back to high-fidelity mock data if the database is not connected.
 */
export async function getProducts(filters: GetProductsFilters = {}): Promise<any[]> {
  try {
    if (isDatabaseOffline()) {
      throw new Error("DB offline")
    }
    const { type, category, search, minRating, priceRange, isFree, sort } = filters

    // 1. Build Prisma query conditions
    const where: any = {
      status: ProductStatus.PUBLISHED,
    }

    if (type && type !== "ALL") {
      where.type = type as ProductType
    }

    if (category && category !== "ALL") {
      where.category = category
    }

    if (isFree !== undefined) {
      where.isFree = isFree
    }

    if (priceRange) {
      where.price = {
        gte: priceRange[0],
        lte: priceRange[1],
      }
    }

    // Postgres Full-Text Search or simple contains
    if (search && search.trim() !== "") {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ]
    }

    // 2. Build sorting rules
    let orderBy: any = { createdAt: "desc" } // default newest

    if (sort === "popular") {
      orderBy = { downloadCount: "desc" }
    } else if (sort === "price-low") {
      orderBy = { price: "asc" }
    } else if (sort === "price-high") {
      orderBy = { price: "desc" }
    }

    // Fetch from database
    let products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            bio: true,
            website: true,
            createdAt: true,
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            body: true,
            createdAt: true,
          }
        }
      }
    })

    // Compute and apply ratings filter in-memory if minRating is specified
    if (minRating && minRating > 0) {
      products = products.filter((p) => {
        if (p.reviews.length === 0) return false
        const avg = p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        return avg >= minRating
      })
    }

    return products
  } catch (error) {
    console.warn("⚠️ Database connection failed in getProducts. Serving high-fidelity mock data fallback.")
    flagDatabaseOffline()
    
    // In-memory mock filtering
    let products = [...MOCK_PRODUCTS]
    const { type, category, search, minRating, priceRange, isFree, sort } = filters

    if (type && type !== "ALL") {
      products = products.filter((p) => p.type === type)
    }

    if (category && category !== "ALL") {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    }

    if (isFree !== undefined) {
      products = products.filter((p) => p.isFree === isFree)
    }

    if (priceRange) {
      products = products.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    }

    if (search && search.trim() !== "") {
      const q = search.toLowerCase()
      products = products.filter(
        (p) => 
          p.title.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    // Average rating filtering
    if (minRating && minRating > 0) {
      products = products.filter((p) => {
        if (p.reviews.length === 0) return false
        const avg = p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        return avg >= minRating
      })
    }

    // Sorting
    if (sort === "popular") {
      products.sort((a, b) => b.downloadCount - a.downloadCount)
    } else if (sort === "price-low") {
      products.sort((a, b) => a.price - b.price)
    } else if (sort === "price-high") {
      products.sort((a, b) => b.price - a.price)
    } else {
      // default: newest
      products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }

    return products
  }
}

/**
 * Get a single published product by its unique slug.
 */
export async function getProductBySlug(slug: string): Promise<any | null> {
  try {
    if (isDatabaseOffline()) {
      throw new Error("DB offline")
    }
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            bio: true,
            website: true,
            createdAt: true,
          }
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          include: {
            buyer: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    })

    return product
  } catch (error) {
    console.warn(`⚠️ DB error in getProductBySlug for slug '${slug}'. Serving mock fallback.`)
    flagDatabaseOffline()
    const mockProduct = MOCK_PRODUCTS.find((p) => p.slug === slug)
    if (!mockProduct) return null

    // Transform mock reviews structure to match Prisma's include
    const reviews = mockProduct.reviews.map((r) => ({
      id: r.id,
      buyerId: r.buyerId,
      productId: r.productId,
      rating: r.rating,
      body: r.body,
      sellerReply: r.sellerReply,
      createdAt: r.createdAt,
      buyer: {
        id: r.buyerId,
        name: r.buyerName,
        image: r.buyerImage
      }
    }))

    return {
      ...mockProduct,
      reviews
    }
  }
}

/**
 * Get products related to the current product (same category, sorted by rating).
 */
export async function getRelatedProducts(productId: string, category: string, limit: number = 3): Promise<any[]> {
  try {
    if (isDatabaseOffline()) {
      throw new Error("DB offline")
    }
    const products = await prisma.product.findMany({
      where: {
        category,
        status: ProductStatus.PUBLISHED,
        id: { not: productId }
      },
      take: limit,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        reviews: true
      }
    })
    return products
  } catch (error) {
    return MOCK_PRODUCTS
      .filter((p) => p.category === category && p.id !== productId)
      .slice(0, limit)
  }
}

/**
 * Resolve a seller profile and their listings by seller username or email.
 */
export async function getSellerByUsername(username: string): Promise<{ seller: any; listings: any[] } | null> {
  try {
    if (isDatabaseOffline()) {
      throw new Error("DB offline")
    }
    // Standard URL friendly username check
    const normalizedUsername = username.replace("@", "").toLowerCase()
    
    // Find the user by name (case-insensitive) or email prefix
    const seller = await prisma.user.findFirst({
      where: {
        OR: [
          { name: { contains: normalizedUsername, mode: "insensitive" } },
          { email: { startsWith: normalizedUsername } }
        ],
        role: { in: [UserRole.SELLER, UserRole.ADMIN] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        bio: true,
        website: true,
        createdAt: true,
      }
    })

    if (!seller) return null

    const listings = await prisma.product.findMany({
      where: {
        sellerId: seller.id,
        status: ProductStatus.PUBLISHED
      },
      orderBy: { createdAt: "desc" },
      include: {
        reviews: true
      }
    })

    return { seller, listings }
  } catch (error) {
    console.warn(`⚠️ DB error in getSellerByUsername for '${username}'. Serving mock fallback.`)
    const normalizedUsername = username.replace("@", "").toLowerCase()
    
    // Find mock seller match
    const mockSeller = Object.values(MOCK_USERS).find(
      (u) => 
        (u.name?.toLowerCase().includes(normalizedUsername)) ||
        u.email.toLowerCase().startsWith(normalizedUsername)
    )

    if (!mockSeller) return null

    const listings = MOCK_PRODUCTS.filter((p) => p.sellerId === mockSeller.id)

    return { 
      seller: mockSeller, 
      listings 
    }
  }
}

/**
 * Fetch purchases made by a specific buyer (for their dashboard).
 */
export async function getBuyerPurchases(buyerId: string): Promise<any[]> {
  try {
    if (isDatabaseOffline()) {
      throw new Error("DB offline")
    }
    const purchases = await prisma.purchase.findMany({
      where: { buyerId },
      include: {
        product: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    return purchases
  } catch (error) {
    console.warn("⚠️ Database connection failed. Serving mock purchases fallback in sandbox mode.")
    
    // Support dynamic mock purchases in globalThis
    if (!globalThis.mockPurchases) {
      globalThis.mockPurchases = []
    }
    
    const userMockPurchases = globalThis.mockPurchases.filter((p: any) => p.buyerId === buyerId)
    
    if (userMockPurchases.length === 0) {
      // Seed with initial high-fidelity purchases
      const initialPurchases = MOCK_PRODUCTS.slice(0, 3).map((product, idx) => ({
        id: `mock-purchase-id-${idx + 1}`,
        buyerId,
        productId: product.id,
        stripePaymentIntentId: null,
        amount: product.price,
        platformFee: Math.round(product.price * 0.15),
        refunded: false,
        createdAt: new Date(Date.now() - 3600000 * 24 * (idx + 1)), // 1-3 days ago
        product: {
          ...product,
          seller: {
            id: product.sellerId,
            name: product.seller.name || "Creator",
            image: product.seller.image || ""
          }
        }
      }))
      globalThis.mockPurchases.push(...initialPurchases)
      return initialPurchases
    }
    
    return userMockPurchases
  }
}

/**
 * Fetch wishlisted products for a user.
 */
export async function getBuyerSaved(userId: string): Promise<any[]> {
  try {
    if (isDatabaseOffline()) {
      throw new Error("DB offline")
    }
    const saved = await prisma.savedProduct.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            reviews: true
          }
        }
      },
      orderBy: { savedAt: "desc" }
    })
    return saved.map(s => s.product)
  } catch (error) {
    return []
  }
}
