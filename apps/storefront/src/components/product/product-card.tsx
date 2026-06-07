"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"

interface ProductCardProps {
  product: {
    id: string
    handle: string
    title: string
    thumbnail?: string | null
    metadata?: Record<string, any> | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("product")
  const locale = useLocale()

  const metadata = product.metadata as Record<string, any> | null
  const moq = metadata?.min_order_qty
  const price = metadata?.price_range

  return (
    <Link
      href={`/${locale}/products/${product.handle}`}
      className="group rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
    >
      <div className="mb-3 aspect-square overflow-hidden rounded-md bg-gray-100">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <h3 className="truncate text-sm font-medium text-gray-900 group-hover:text-brand-600">
        {product.title}
      </h3>
      {price && (
        <p className="mt-1 text-sm font-semibold text-brand-600">{price}</p>
      )}
      {moq && (
        <p className="mt-0.5 text-xs text-green-600">
          {t("moq", { count: moq })}
        </p>
      )}
    </Link>
  )
}
