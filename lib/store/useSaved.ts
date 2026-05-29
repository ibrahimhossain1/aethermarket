import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SavedItem {
  id: string
  title: string
  price: number
  type: "PROMPT" | "SKILL" | "CODE"
  slug: string
  sellerName: string
  previewImage?: string
}

interface SavedState {
  items: SavedItem[]
  toggleSaved: (item: SavedItem) => void
  removeItem: (id: string) => void
  isSaved: (id: string) => boolean
}

export const useSaved = create<SavedState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleSaved: (item) => {
        const exists = get().items.some((i) => i.id === item.id)
        if (exists) {
          set({ items: get().items.filter((i) => i.id !== item.id) })
        } else {
          set({ items: [...get().items, item] })
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },
      isSaved: (id) => get().items.some((item) => item.id === id),
    }),
    {
      name: "aether-saved-storage",
    }
  )
)
