import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface MockPurchaseItem {
  id: string
  buyerId: string
  productId: string
  stripePaymentIntentId: string | null
  amount: number
  platformFee: number
  refunded: boolean
  createdAt: string
  product: {
    id: string
    title: string
    price: number
    isFree: boolean
    type: "PROMPT" | "SKILL" | "CODE"
    slug: string
    previewImages?: string[]
    seller?: {
      id: string
      name: string | null
      image?: string | null
    }
  }
}

interface MockPurchasesState {
  purchases: MockPurchaseItem[]
  addPurchase: (purchase: MockPurchaseItem) => void
  refundPurchase: (purchaseId: string) => void
  setPurchases: (purchases: MockPurchaseItem[]) => void
}

export const useMockPurchases = create<MockPurchasesState>()(
  persist(
    (set, get) => ({
      purchases: [],
      addPurchase: (purchase) => {
        const exists = get().purchases.some((p) => p.productId === purchase.productId)
        if (!exists) {
          set({ purchases: [purchase, ...get().purchases] })
        }
      },
      refundPurchase: (purchaseId) => {
        set({
          purchases: get().purchases.map((p) => 
            p.id === purchaseId ? { ...p, refunded: true } : p
          )
        })
      },
      setPurchases: (purchases) => set({ purchases }),
    }),
    {
      name: "aether-mock-purchases-storage",
    }
  )
)
