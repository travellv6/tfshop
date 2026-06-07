"use client"

import Link from "next/link"
import { useLocale } from "next-intl"
import { useCart } from "@/lib/cart-context"
import { CartItemRow } from "@/components/cart/cart-item"

export default function CartPage() {
  const { cart, isLoading, updateItemQuantity, removeItem, itemCount } =
    useCart()
  const locale = useLocale()

  const subtotal = cart?.subtotal || 0
  const shipping = cart?.shipping_total || 0
  const total = cart?.total || subtotal + shipping

  if (!cart || itemCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-gray-500">Your cart is empty</p>
        <Link
          href={`/${locale}/products`}
          className="mt-4 text-brand-600 hover:underline"
        >
          Browse products &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          {cart.items?.map((item: any) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={updateItemQuantity}
              onRemove={removeItem}
              isUpdating={isLoading}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shipping > 0
                  ? `$${(shipping / 100).toFixed(2)}`
                  : "Calculated at checkout"}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
          </div>
          <Link
            href={`/${locale}/checkout`}
            className="mt-4 block rounded-lg bg-brand-600 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
