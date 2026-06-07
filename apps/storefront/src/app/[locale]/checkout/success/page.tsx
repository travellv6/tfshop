"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useLocale } from "next-intl"
import { Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const locale = useLocale()

  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <div className="mb-4 text-5xl">&#x2705;</div>
      <h1 className="mb-2 text-2xl font-bold">Order Confirmed!</h1>
      <p className="mb-6 text-gray-600">
        Your order has been placed successfully.
        {orderId && (
          <span>
            {" "}
            Order ID: <strong>{orderId}</strong>
          </span>
        )}
      </p>
      <div className="flex justify-center gap-4">
        {orderId && (
          <Link
            href={`/${locale}/account/orders/${orderId}`}
            className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            View Order
          </Link>
        )}
        <Link
          href={`/${locale}/products`}
          className="rounded-lg border px-6 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-gray-500">Loading...</div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
