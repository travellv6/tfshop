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

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ct("search")}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <p className="text-center text-gray-500">{ct("loading")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {data?.products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {data?.products?.length === 0 && (
        <p className="text-center text-gray-500">{ct("noResults")}</p>
      )}
    </div>
  )
}
