"use client"

import { useTranslations } from "next-intl"
import { useProducts } from "@/hooks/use-products"
import { useFactories } from "@/hooks/use-factories"
import { ProductCard } from "@/components/product/product-card"
import { FactoryCard } from "@/components/factory/factory-card"

export default function HomePage() {
  const t = useTranslations("home")
  const { data: productsData } = useProducts({ limit: 8 })
  const { data: factoriesData } = useFactories({ limit: 4 })

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-8 py-16 text-center text-white">
        <h1 className="text-3xl font-bold md:text-4xl">{t("heroTitle")}</h1>
        <p className="mt-3 text-lg opacity-90">{t("heroSubtitle")}</p>
      </section>

      {/* Low MOQ Zone */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            🔥 {t("lowMoqZone")}
          </h2>
          <span className="text-sm text-gray-500">{t("lowMoqSubtitle")}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {productsData?.products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recommended Factories */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          🏭 {t("recommendedFactories")}
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {factoriesData?.factories?.map((factory) => (
            <FactoryCard key={factory.id} factory={factory} />
          ))}
        </div>
      </section>
    </div>
  )
}
