import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  title: string
  price: number // in cents
  type: "PROMPT" | "SKILL" | "CODE"
  slug: string
  sellerName: string
  previewImage?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  totalPrice: () => number
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const exists = get().items.some((i) => i.id === item.id)
        if (!exists) {
          set({ items: [...get().items, item], isOpen: true }) // Automatically open cart drawer when item is added!
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },
      clearCart: () => set({ items: [] }),
      isInCart: (id) => get().items.some((item) => item.id === id),
      totalPrice: () => get().items.reduce((total, item) => total + item.price, 0),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: "aether-cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
)
