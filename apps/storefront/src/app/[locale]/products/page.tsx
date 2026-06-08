"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { useProducts } from "@/hooks/use-products"
import { ProductCard } from "@/components/product/product-card"

export default function ProductListPage() {
  const t = useTranslations("product")
  const ct = useTranslations("common")
  const [search, setSearch] = useState("")
  const { data, isLoading } = useProducts({
    limit: 20,
    q: search || undefined,
  })

  const products = data?.products || []

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink-900">
          {t("title")}
        </h1>
        <p className="mt-2 font-body text-ink-500">
          Browse our catalog of factory-direct toys
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ct("search")}
          className="input-field pl-12 py-4"
        />
      </div>

      {/* Results Count */}
      {!isLoading && products.length > 0 && (
        <p className="mb-6 font-body text-sm text-ink-500">
          {products.length} {products.length === 1 ? "product" : "products"} found
        </p>
      )}

      {/* Product Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-brand-200 border-t-brand-600" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`animate-slide-up opacity-0 stagger-${Math.min((i % 4) + 1, 4)}`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">🔍</span>
          <h3 className="font-display text-lg font-bold text-ink-700">
            {ct("noResults")}
          </h3>
          <p className="mt-2 font-body text-sm text-ink-400">
            Try adjusting your search terms
          </p>
        </div>
      )}
    </div>
  )
}
