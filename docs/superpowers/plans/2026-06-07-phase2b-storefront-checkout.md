# Phase 2B: Storefront — Cart, Checkout, Customer Auth, Order Tracking

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the full trading loop to the storefront — cart with MOQ validation, checkout flow, customer registration/login, and order tracking. Uses Medusa's built-in Cart/Order/Customer APIs via SDK.

**Architecture:** Extend the existing `apps/storefront/` Next.js app with new pages and hooks. No backend work needed — Medusa's built-in modules handle Cart, Order, Payment, and Customer operations.

**Tech Stack:** Next.js 14, next-intl, @medusajs/js-sdk, @tanstack/react-query, Tailwind CSS

**Depends on:** Phase 1B (storefront), Phase 2A (tiered pricing for price display)

---

## File Structure

```
apps/storefront/src/
├── hooks/
│   ├── use-cart.ts                        # Cart CRUD hooks
│   ├── use-order.ts                       # Order hooks
│   └── use-customer.ts                    # Customer auth hooks
├── lib/
│   └── cart-context.tsx                   # Cart state context provider
├── components/
│   ├── cart/
│   │   ├── cart-drawer.tsx                # Slide-out cart drawer
│   │   ├── cart-item.tsx                  # Cart line item row
│   │   └── cart-summary.tsx              # Order summary with totals
│   ├── checkout/
│   │   ├── shipping-form.tsx             # Address form
│   │   ├── shipping-method-select.tsx    # Shipping option selector
│   │   └── payment-form.tsx              # Payment method selector
│   └── order/
│       └── order-card.tsx                # Order history card
├── app/[locale]/
│   ├── cart/page.tsx                      # Cart page
│   ├── checkout/page.tsx                  # Checkout page
│   ├── account/
│   │   ├── page.tsx                       # Account dashboard
│   │   ├── orders/page.tsx                # Order history
│   │   └── orders/[id]/page.tsx           # Order detail
│   ├── auth/
│   │   ├── login/page.tsx                 # Login page
│   │   └── register/page.tsx              # Registration page
```

---

## Task 1: Create Cart Context and Hooks

**Files:**
- Create: `apps/storefront/src/lib/cart-context.tsx`
- Create: `apps/storefront/src/hooks/use-cart.ts`

### cart-context.tsx

A React context that holds the current cart ID and provides cart operations. Persists cart ID in localStorage.

```tsx
"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { sdk } from "@/lib/medusa"

interface CartItem {
  variant_id: string
  quantity: number
  metadata?: Record<string, any>
}

interface CartContextType {
  cartId: string | null
  cart: any
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
      const { cart: c } = await sdk.store.cart.retrieve(cartId)
      setCart(c)
    } catch {
      localStorage.removeItem(CART_ID_KEY)
      setCartId(null)
      setCart(null)
    }
  }, [cartId])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

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

  const addItem = useCallback(async (item: CartItem) => {
    setIsLoading(true)
    try {
      const id = await ensureCart()
      await sdk.store.cart.createLineItem(id, { ...item })
      await refreshCart()
    } finally {
      setIsLoading(false)
    }
  }, [ensureCart, refreshCart])

  const updateItemQuantity = useCallback(async (lineItemId: string, quantity: number) => {
    if (!cartId) return
    setIsLoading(true)
    try {
      await sdk.store.cart.updateLineItem(cartId, lineItemId, { quantity })
      await refreshCart()
    } finally {
      setIsLoading(false)
    }
  }, [cartId, refreshCart])

  const removeItem = useCallback(async (lineItemId: string) => {
    if (!cartId) return
    setIsLoading(true)
    try {
      await sdk.store.cart.deleteLineItem(cartId, lineItemId)
      await refreshCart()
    } finally {
      setIsLoading(false)
    }
  }, [cartId, refreshCart])

  return (
    <CartContext.Provider value={{ cartId, cart, isLoading, addItem, updateItemQuantity, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
```

### use-cart.ts

Re-export for convenience + additional query hooks:

```typescript
export { useCart } from "@/lib/cart-context"
```

Commit: `git commit -m "feat(storefront): add cart context provider with CRUD operations"`

---

## Task 2: Create Cart UI Components and Page

**Files:**
- Create: `apps/storefront/src/components/cart/cart-item.tsx`
- Create: `apps/storefront/src/components/cart/cart-summary.tsx`
- Create: `apps/storefront/src/app/[locale]/cart/page.tsx`
- Modify: `apps/storefront/src/app/[locale]/layout.tsx` — wrap with CartProvider
- Modify: `apps/storefront/src/components/layout/header.tsx` — add cart icon with item count

### cart-item.tsx

A row showing product thumbnail, title, quantity controls, and line total.

### cart-summary.tsx

Shows subtotal, shipping estimate, and total with a "Proceed to Checkout" button.

### cart/page.tsx

Full cart page. Lists all items, shows summary, validates MOQ (if metadata.min_order_qty exists, show warning if quantity is below MOQ).

### layout.tsx modification

Wrap children with `<CartProvider>` inside `<QueryProvider>`.

### header.tsx modification

Add a cart icon/link next to the language switcher showing the cart item count.

Add translations for cart to all 4 message files:
- `common.cart`: "Cart" / "购物车" / "Carrito" / "السلة"
- Cart page labels: "Your Cart", "Empty Cart", "Subtotal", "Shipping", "Total", "Checkout"

Commit: `git commit -m "feat(storefront): add cart page with item management"`

---

## Task 3: Create Customer Auth Pages

**Files:**
- Create: `apps/storefront/src/hooks/use-customer.ts`
- Create: `apps/storefront/src/app/[locale]/auth/login/page.tsx`
- Create: `apps/storefront/src/app/[locale]/auth/register/page.tsx`

### use-customer.ts

```typescript
import { useQuery, useMutation } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

export function useCustomer() {
  return useQuery({
    queryKey: ["customer"],
    queryFn: async () => {
      try {
        const { customer } = await sdk.store.customer.retrieve()
        return customer
      } catch {
        return null
      }
    },
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return sdk.auth.login("customer", "emailpass", { email, password })
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: async ({ email, password, first_name, last_name }: {
      email: string; password: string; first_name: string; last_name: string
    }) => {
      // Step 1: Register auth identity
      const { jwt } = await sdk.auth.register("customer", "emailpass", {
        email,
        password,
      })
      // Step 2: Create customer record
      const { customer } = await sdk.store.customer.create({
        email,
        first_name,
        last_name,
      })
      return { jwt, customer }
    },
  })
}
```

### login/page.tsx

Simple email/password login form. On success, store token and redirect to account page.

### register/page.tsx

Registration form with email, password, first name, last name. On success, redirect to account page.

Add translations for auth pages to all 4 message files.

Commit: `git commit -m "feat(storefront): add customer login and registration pages"`

---

## Task 4: Create Checkout Page

**Files:**
- Create: `apps/storefront/src/hooks/use-shipping.ts`
- Create: `apps/storefront/src/components/checkout/shipping-form.tsx`
- Create: `apps/storefront/src/components/checkout/shipping-method-select.tsx`
- Create: `apps/storefront/src/components/checkout/payment-form.tsx`
- Create: `apps/storefront/src/app/[locale]/checkout/page.tsx`

### Checkout Flow (multi-step form on one page):

1. **Shipping Address**: First name, last name, address, city, province, postal code, country, phone
2. **Shipping Method**: List available shipping options, select one
3. **Payment Method**: Select Stripe (credit card) or Bank Transfer (T/T)
4. **Review & Confirm**: Show order summary, confirm button
5. **Complete**: POST to `/store/carts/:id/complete`, redirect to order confirmation

### shipping-form.tsx

Address form using @medusajs/js-sdk `sdk.store.cart.update(cartId, { shipping_address, email })`.

### shipping-method-select.tsx

List shipping options for the cart's region. Uses `sdk.store.shippingOption.list(cartId)`.

### payment-form.tsx

For Stripe: Creates payment session via `sdk.store.paymentCollection.createPaymentSession(paymentCollectionId, { provider_id: "stripe" })`. Then uses Stripe.js Elements for card input. For Bank Transfer: Shows bank account info and instructions.

### checkout/page.tsx

Orchestrates the multi-step checkout. On complete, calls `sdk.store.cart.complete(cartId)`.

Add checkout translations to all 4 message files.

Commit: `git commit -m "feat(storefront): add checkout page with address, shipping, and payment"`

---

## Task 5: Create Order Tracking Pages

**Files:**
- Create: `apps/storefront/src/hooks/use-order.ts`
- Create: `apps/storefront/src/components/order/order-card.tsx`
- Create: `apps/storefront/src/app/[locale]/account/page.tsx`
- Create: `apps/storefront/src/app/[locale]/account/orders/page.tsx`
- Create: `apps/storefront/src/app/[locale]/account/orders/[id]/page.tsx`
- Create: `apps/storefront/src/app/[locale]/checkout/success/page.tsx`

### use-order.ts

```typescript
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { orders } = await sdk.store.order.list()
      return orders
    },
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { order } = await sdk.store.order.retrieve(id)
      return order
    },
    enabled: !!id,
  })
}
```

### account/page.tsx

Customer dashboard showing: name, email, buyer tier (future), quick links to orders.

### account/orders/page.tsx

Order history list with order number, date, status, total.

### account/orders/[id]/page.tsx

Order detail: items, shipping address, payment info, status timeline, tracking number.

### checkout/success/page.tsx

Order confirmation page after successful checkout. Shows order number and estimated delivery.

Add translations for orders/account to all 4 message files.

Commit: `git commit -m "feat(storefront): add order tracking and account pages"`

---

## Task 6: Update Header with Cart and Auth State

**Files:**
- Modify: `apps/storefront/src/components/layout/header.tsx`

Update header to show:
- Cart icon with item count badge
- "Login" / "Register" links when not authenticated
- User name + "Account" + "Logout" when authenticated

Commit: `git commit -m "feat(storefront): update header with cart icon and auth state"`

---

## Task 7: Build and Verify

```bash
cd /Users/svan/app/tfshop/apps/storefront && npx next build
```

Report build status. Fix any errors.
