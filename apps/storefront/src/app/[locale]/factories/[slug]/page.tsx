"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useFactory } from "@/hooks/use-factories"
import { useProducts } from "@/hooks/use-products"
import { ProductCard } from "@/components/product/product-card"

export default function FactoryDetailPage() {
  const t = useTranslations("factory")
  const ct = useTranslations("common")
  const { slug } = useParams()
  const { data: factory, isLoading } = useFactory(slug as string)
  const { data: productsData } = useProducts(
    factory?.id ? { limit: 12 } : undefined
  )

  if (isLoading) return <p className="text-center text-gray-500">{ct("loading")}</p>
  if (!factory) return <p className="text-center text-gray-500">{ct("noResults")}</p>

  return (
    <div className="space-y-8">
      {/* Factory Header */}
      <div className="rounded-xl bg-gray-50 p-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Cover Image */}
          <div className="md:col-span-1">
            {factory.cover_image ? (
              <img
                src={factory.cover_image}
                alt={factory.name}
                className="rounded-lg"
              />
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg bg-gray-200 text-5xl">
                🏭
              </div>
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold">{factory.name}</h1>
            {factory.description && (
              <p className="mt-2 text-gray-600">{factory.description}</p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              {factory.location_city && (
                <div>
                  <span className="font-medium">{t("location")}:</span>{" "}
                  {factory.location_city}, {factory.location_province}
                </div>
              )}
              {factory.established_year && (
                <div>
                  <span className="font-medium">{t("established")}:</span>{" "}
                  {t("established", { year: factory.established_year })}
                </div>
              )}
              {factory.monthly_capacity && (
                <div>
                  <span className="font-medium">{t("capacity")}:</span>{" "}
                  {t("capacity", { capacity: factory.monthly_capacity })}
                </div>
              )}
              {factory.employee_scale && (
                <div>
                  <span className="font-medium">Employees:</span>{" "}
                  {factory.employee_scale}
                </div>
              )}
            </div>

            {/* Certifications */}
            {factory.certifications && factory.certifications.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold">{t("certifications")}</h3>
                <div className="flex flex-wrap gap-2">
                  {factory.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-600"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button className="mt-6 rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700">
              {t("requestQuote")}
            </button>
          </div>
        </div>
      </div>

      {/* Factory Photos */}
      {factory.photos && Array.isArray(factory.photos) && factory.photos.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-bold">Factory Gallery</h2>
          <div className="grid grid-cols-3 gap-4">
            {(factory.photos as string[]).map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`${factory.name} photo ${i + 1}`}
                className="rounded-lg"
              />
            ))}
          </div>
        </section>
      )}

      {/* Factory Products */}
      <section>
        <h2 className="mb-4 text-lg font-bold">{t("products")}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {productsData?.products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {(!productsData?.products || productsData.products.length === 0) && (
          <p className="text-center text-sm text-gray-500">No products yet</p>
        )}
      </section>
    </div>
  )
}
