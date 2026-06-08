"use client"

import { Link } from "@/i18n/routing"
import { ArrowRight, PackageCheck } from "lucide-react"
import { useOrders } from "@/hooks/use-order"
import { EmptyState, StatusPill } from "@/components/ui/storefront"

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders()

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[980px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
            Buyer Account
          </p>
          <h1 className="font-display text-ink-900 mt-2 text-3xl font-bold">
            My Orders
          </h1>
        </div>

        {isLoading ? (
          <p className="text-ink-500 py-10 text-center">Loading...</p>
        ) : orders && orders.length > 0 ? (
          <div className="panel divide-surface-200 divide-y overflow-hidden">
            {orders.map((order: any) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="hover:bg-brand-50 grid gap-4 p-5 transition sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <span className="bg-brand-50 text-brand-700 flex h-11 w-11 items-center justify-center rounded-lg">
                    <PackageCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-ink-900 font-extrabold">
                      Order #{order.display_id || order.id.slice(-8)}
                    </p>
                    <p className="text-ink-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <StatusPill className="bg-brand-50 text-brand-700 ring-brand-100">
                  {order.status || "Processing"}
                </StatusPill>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p className="text-ink-900 font-extrabold">
                    ${((order.total || 0) / 100).toFixed(2)}
                  </p>
                  <ArrowRight className="text-ink-300 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No orders yet"
            description="Your completed orders will appear here after checkout."
            action={
              <Link href="/products" className="btn-primary">
                Browse products
              </Link>
            }
          />
        )}
      </div>
    </div>
  )
}
