"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useProduct } from "@/hooks/use-products"

export default function ProductDetailPage() {
  const t = useTranslations("product")
  const ct = useTranslations("common")
  const { locale, handle } = useParams()
  const { data: product, isLoading } = useProduct(handle as string)

  const metadata = product?.metadata as Record<string, any> | null
  const factorySlug = metadata?.factory_slug as string | undefined

  return (
    <div>
      {isLoading ? (
        <p className="text-center text-gray-500">{ct("loading")}</p>
      ) : product ? (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={product.title}
                  className="w-full rounded-lg"
                />
              ))
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            {product.description && (
              <p className="text-gray-600">{product.description}</p>
            )}

            {/* MOQ & Stock */}
            <div className="flex gap-4">
              {metadata?.min_order_qty && (
                <span className="rounded bg-green-50 px-3 py-1 text-sm text-green-700">
                  {t("moq", { count: metadata.min_order_qty })}
                </span>
              )}
              {metadata?.is_in_stock && (
                <span className="rounded bg-blue-50 px-3 py-1 text-sm text-blue-700">
                  {t("inStock")}
                </span>
              )}
              {metadata?.sample_available && (
                <span className="rounded bg-purple-50 px-3 py-1 text-sm text-purple-700">
                  {t("sampleAvailable")}
                </span>
              )}
            </div>

            {/* Certifications */}
            {metadata?.certifications && (
              <div>
                <h3 className="mb-2 text-sm font-semibold">{t("certifications")}</h3>
                <div className="flex flex-wrap gap-2">
                  {metadata.certifications.map((cert: string) => (
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

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700">
                {t("addToCart")}
              </button>
              <button className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                {t("requestQuote")}
              </button>
            </div>

            {/* Factory Card */}
            {factorySlug && (
              <div className="mt-8 rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 text-sm font-semibold">{t("factory")}</h3>
                <Link
                  href={`/${locale}/factories/${factorySlug}`}
                  className="text-sm text-brand-600 hover:underline"
                >
                  {t("viewFactory")} →
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">{ct("noResults")}</p>
      )}
    </div>
  )
}
