"use client"

import Link from "next/link"
import { useLocale } from "next-intl"
import { useOrders } from "@/hooks/use-order"

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders()
  const locale = useLocale()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
      {isLoading ? (
        <p className="py-10 text-center text-gray-500">Loading...</p>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Link
              key={order.id}
              href={`/${locale}/account/orders/${order.id}`}
              className="block rounded-lg border p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">
                    Order #{order.display_id || order.id.slice(-8)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${((order.total || 0) / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.status || "Processing"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-gray-500">No orders yet</p>
      )}
    </div>
  )
}
