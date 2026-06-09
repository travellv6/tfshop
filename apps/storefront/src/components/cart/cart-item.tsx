"use client"

import { useTranslations } from "next-intl"
import { Minus, Plus, Trash2 } from "lucide-react"
import { fallbackProductImage } from "@/lib/storefront-data"

interface CartItemRowProps {
  item: {
    id: string
    title: string
    thumbnail?: string | null
    quantity: number
    unit_price: number
    subtotal?: number
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  isUpdating: boolean
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}: CartItemRowProps) {
  const t = useTranslations("product")

  return (
    <div className="border-surface-200 grid gap-4 border-b py-4 last:border-b-0 sm:grid-cols-[88px_1fr_auto_auto] sm:items-center">
      <div className="bg-surface-100 h-20 w-20 overflow-hidden rounded-lg sm:h-24 sm:w-24">
        <img
          src={item.thumbnail || fallbackProductImage}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <h3 className="text-ink-900 font-bold">{item.title}</h3>
        <p className="text-ink-500 mt-1 text-sm font-medium">
          ${(item.unit_price / 100).toFixed(2)} {t("perPiece")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="border-surface-300 text-ink-600 hover:bg-surface-100 flex h-8 w-8 items-center justify-center rounded-lg border disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-ink-900 w-10 text-center text-sm font-bold">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={isUpdating}
          className="border-surface-300 text-ink-600 hover:bg-surface-100 flex h-8 w-8 items-center justify-center rounded-lg border disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <p className="text-ink-900 text-right text-sm font-extrabold">
          $
          {((item.subtotal || item.unit_price * item.quantity) / 100).toFixed(
            2
          )}
        </p>
        <button
          onClick={() => onRemove(item.id)}
          disabled={isUpdating}
          className="text-ink-300 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
