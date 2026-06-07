"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import { sdk } from "@/lib/medusa"

interface CartItem {
  variant_id: string
  quantity: number
  metadata?: Record<string, unknown>
}

interface CartContextType {
  cartId: string | null
  cart: any
  itemCount: number
  isLoading: boolean
  addItem: (item: CartItem) => Promise<void>
  updateItemQuantity: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

const CART_ID_KEY = "tfshop_cart_id"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null)
  const [cart, setCart] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedId = localStorage.getItem(CART_ID_KEY)
    if (storedId) {
      setCartId(storedId)
    }
  }, [])

  const refreshCart = useCallback(async () => {
    if (!cartId) return
    try {
      const { cart: retrievedCart } = await sdk.store.cart.retrieve(cartId)
      setCart(retrievedCart)
    } catch {
      localStorage.removeItem(CART_ID_KEY)
      setCartId(null)
      setCart(null)
    }
  }, [cartId])

  useEffect(() => {
    if (cartId) refreshCart()
  }, [cartId, refreshCart])

  const ensureCart = useCallback(async () => {
    if (cartId) return cartId
    const { cart: newCart } = await sdk.store.cart.create({
      currency_code: "usd",
    })
    setCartId(newCart.id)
    setCart(newCart)
    localStorage.setItem(CART_ID_KEY, newCart.id)
    return newCart.id
  }, [cartId])

  const addItem = useCallback(
    async (item: CartItem) => {
      setIsLoading(true)
      try {
        const id = await ensureCart()
        await sdk.store.cart.createLineItem(id, item as any)
        await refreshCart()
      } finally {
        setIsLoading(false)
      }
    },
    [ensureCart, refreshCart]
  )

  const updateItemQuantity = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cartId) return
      setIsLoading(true)
      try {
        await sdk.store.cart.updateLineItem(cartId, lineItemId, {
          quantity,
        } as any)
        await refreshCart()
      } finally {
        setIsLoading(false)
      }
    },
    [cartId, refreshCart]
  )

  const removeItem = useCallback(
    async (lineItemId: string) => {
      if (!cartId) return
      setIsLoading(true)
      try {
        await sdk.store.cart.deleteLineItem(cartId, lineItemId)
        await refreshCart()
      } finally {
        setIsLoading(false)
      }
    },
    [cartId, refreshCart]
  )

  const itemCount =
    cart?.items?.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    ) || 0

  return (
    <CartContext.Provider
      value={{
        cartId,
        cart,
        itemCount,
        isLoading,
        addItem,
        updateItemQuantity,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
