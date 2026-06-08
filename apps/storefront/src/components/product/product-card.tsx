"use client"

import { Link } from "@/i18n/routing"
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
      href="/products/${product.handle}"
      className="group flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-100">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-ink-300">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
            <span className="font-body text-xs">Photo coming soon</span>
          </div>
        )}
        {/* MOQ Badge */}
        {moq && (
          <span className="absolute bottom-2 left-2 badge-amber text-[10px]">
            {t("moq", { count: moq })}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-body text-sm font-semibold leading-snug text-ink-900 transition-colors group-hover:text-brand-700 line-clamp-2">
          {product.title}
        </h3>
        <div className="mt-auto pt-3">
          {price && (
            <p className="font-display text-base font-bold text-brand-700">
              {price}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
