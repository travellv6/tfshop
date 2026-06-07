"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useLocale } from "next-intl"
import { useOrder } from "@/hooks/use-order"

export default function OrderDetailPage() {
  const { id } = useParams()
  const locale = useLocale()
  const { data: order, isLoading } = useOrder(id as string)

  if (isLoading) {
    return (
      <p className="py-20 text-center text-gray-500">Loading...</p>
    )
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Order not found</p>
        <Link
          href={`/${locale}/account/orders`}
          className="mt-4 inline-block text-sm text-brand-600 hover:underline"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Order #{order.display_id || order.id.slice(-8)}
        </h1>
        <Link
          href={`/${locale}/account/orders`}
          className="text-sm text-brand-600 hover:underline"
        >
          Back to Orders
        </Link>
      </div>

      {/* Status */}
      <div className="mb-6 rounded-lg border p-4">
        <div className="flex justify-between">
          <span className="font-medium">Status</span>
          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
            {order.status || "Processing"}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Placed on {new Date(order.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">Items</h2>
        {(order.items || []).map((item: any) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border-b py-3"
          >
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-12 w-12 rounded object-cover"
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium">
              $
              {(
                (item.subtotal ||
                  item.unit_price * item.quantity) / 100
              ).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      {order.shipping_address && (
        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-2 text-sm font-medium">
            Shipping Address
          </h2>
          <p className="text-sm text-gray-600">
            {order.shipping_address.first_name}{" "}
            {order.shipping_address.last_name}
          </p>
          <p className="text-sm text-gray-600">
            {order.shipping_address.address_1}
          </p>
          <p className="text-sm text-gray-600">
            {order.shipping_address.city}
            {order.shipping_address.province &&
              `, ${order.shipping_address.province}`}{" "}
            {order.shipping_address.postal_code}
          </p>
        </div>
      )}

      {/* Totals */}
      <div className="rounded-lg border p-4">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              ${((order.subtotal || 0) / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              ${((order.shipping_total || 0) / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>
              ${((order.tax_total || 0) / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-1 font-semibold">
            <span>Total</span>
            <span>${((order.total || 0) / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
