"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Link } from "@/i18n/routing"
import {
  ArrowRight,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
} from "lucide-react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[980px] px-4 py-12 sm:px-6 lg:px-8">
        <section className="panel overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
            <div className="p-8 sm:p-10">
              <span className="bg-brand-50 text-brand-700 ring-brand-100 mb-5 flex h-14 w-14 items-center justify-center rounded-lg ring-1">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                Order Confirmed
              </p>
              <h1 className="font-display text-ink-900 mt-2 text-4xl font-bold">
                Your factory order is placed.
              </h1>
              <p className="text-ink-600 mt-4 max-w-xl text-sm leading-6">
                The order has been recorded successfully. Supplier coordination,
                fulfillment status, and buyer protection details will stay tied
                to this order.
              </p>

              {orderId && (
                <div className="border-surface-200 bg-surface-50 mt-6 rounded-lg border p-4">
                  <p className="text-ink-400 text-xs font-bold uppercase tracking-wide">
                    Order ID
                  </p>
                  <p className="text-ink-900 mt-1 break-all font-mono text-sm font-bold">
                    {orderId}
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {orderId && (
                  <Link
                    href={`/account/orders/${orderId}`}
                    className="btn-primary"
                  >
                    <PackageCheck className="h-4 w-4" />
                    View Order
                  </Link>
                )}
                <Link href="/products" className="btn-outline">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <aside className="border-surface-200 bg-brand-50 border-t p-8 lg:border-l lg:border-t-0">
              <ShieldCheck className="text-brand-700 mb-4 h-8 w-8" />
              <h2 className="text-ink-900 text-lg font-extrabold">
                What happens next
              </h2>
              <div className="mt-5 space-y-4">
                {[
                  [
                    "Supplier receives order",
                    "We send the confirmed order details.",
                  ],
                  [
                    "Fulfillment starts",
                    "Factory status updates appear in your account.",
                  ],
                  ["Support stays open", "Buyer protection remains connected."],
                ].map(([title, detail]) => (
                  <div
                    key={title}
                    className="ring-brand-100 rounded-lg bg-white p-4 ring-1"
                  >
                    <p className="text-ink-900 text-sm font-extrabold">
                      {title}
                    </p>
                    <p className="text-ink-500 mt-1 text-xs leading-5">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface-50 text-ink-500 py-20 text-center">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
