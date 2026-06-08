"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { useFactory } from "@/hooks/use-factories"
import { useProductsByFactory } from "@/hooks/use-products"
import { ProductCard } from "@/components/product/product-card"

export default function FactoryDetailPage() {
  const t = useTranslations("factory")
  const ct = useTranslations("common")
  const { locale, slug } = useParams()
  const router = useRouter()
  const { data: factory, isLoading } = useFactory(slug as string)
  const { data: productsData } = useProductsByFactory(factory?.id || "")

  const handleRequestQuote = () => {
    const params = new URLSearchParams()
    if (factory?.id) params.set("factory_id", factory.id)
    if (factory?.name) params.set("factory_name", factory.name)
    router.push(`/rfq?${params.toString()}`)
  }

  if (isLoading) {
    return <p className="text-center text-gray-500">{ct("loading")}</p>
  }

  if (!factory) {
    return <p className="text-center text-gray-500">{ct("noResults")}</p>
  }

  const products = productsData?.products || []

  return (
    <div className="space-y-8">
      {/* 工厂头部 */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* 封面图 */}
        <div className="md:col-span-1">
          {factory.cover_image ? (
            <img
              src={factory.cover_image}
              alt={factory.name}
              className="w-full rounded-lg"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100 text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* 工厂信息 */}
        <div className="space-y-4 md:col-span-2">
          <h1 className="text-3xl font-bold">{factory.name}</h1>
          {factory.description && (
            <p className="text-gray-600">{factory.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            {factory.location_province && (
              <div>
                <span className="text-gray-500">{t("location")}:</span>{" "}
                {factory.location_city
                  ? `${factory.location_city}, ${factory.location_province}`
                  : factory.location_province}
              </div>
            )}
            {factory.established_year && (
              <div>
                <span className="text-gray-500">{t("established", { year: factory.established_year })}</span>
              </div>
            )}
            {factory.monthly_capacity && (
              <div>
                {t("capacity", { capacity: factory.monthly_capacity })}
              </div>
            )}
            {factory.employee_scale && (
              <div>
                <span className="text-gray-500">Employees:</span>{" "}
                {factory.employee_scale}
              </div>
            )}
          </div>

          {/* 认证标签 */}
          {factory.certifications && factory.certifications.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">{t("certifications")}</h3>
              <div className="flex flex-wrap gap-2">
                {factory.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 询价按钮 */}
          <button
            onClick={handleRequestQuote}
            className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {t("requestQuote")}
          </button>
        </div>
      </div>

      {/* 工厂相册 */}
      {factory.photos && factory.photos.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold">{ct("viewAll")}</h2>
          <div className="grid grid-cols-3 gap-4">
            {factory.photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`${factory.name} photo ${i + 1}`}
                className="w-full rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* 工厂产品 */}
      <div>
        <h2 className="mb-4 text-xl font-bold">{t("products")}</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">{ct("noResults")}</p>
        )}
      </div>
    </div>
  )
}
