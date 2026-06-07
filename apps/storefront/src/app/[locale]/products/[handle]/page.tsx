"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useProduct } from "@/hooks/use-products"
import { useCart } from "@/lib/cart-context"

export default function ProductDetailPage() {
  const t = useTranslations("product")
  const ct = useTranslations("common")
  const { locale, handle } = useParams()
  const router = useRouter()
  const { data: product, isLoading } = useProduct(handle as string)
  const { addItem, isLoading: cartLoading } = useCart()

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const metadata = product?.metadata as Record<string, any> | null
  const factorySlug = metadata?.factory_slug as string | undefined
  const factoryId = metadata?.factory_id as string | undefined

  // 构建 variant 选项
  const variants = product?.variants || []
  const hasVariants = variants.length > 0
  const effectiveVariantId = selectedVariantId || (variants.length === 1 ? variants[0].id : null)

  // 从 variant options 构建 option map
  const optionMap = useMemo(() => {
    if (!hasVariants) return {}
    const map: Record<string, Record<string, string[]>> = {}
    variants.forEach((v: any) => {
      v.options?.forEach((opt: any) => {
        const optTitle = opt.option?.title || "Option"
        if (!map[optTitle]) map[optTitle] = {}
        if (!map[optTitle][opt.value]) map[optTitle][opt.value] = []
        map[optTitle][opt.value].push(v.id)
      })
    })
    return map
  }, [variants, hasVariants])

  const handleAddToCart = async () => {
    if (!effectiveVariantId) return
    try {
      await addItem({ variant_id: effectiveVariantId, quantity })
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    } catch {
      // 错误由 CartContext 内部处理
    }
  }

  const handleRequestQuote = () => {
    const params = new URLSearchParams()
    if (product?.id) params.set("product_id", product.id)
    if (product?.title) params.set("product_title", product.title)
    if (effectiveVariantId) params.set("variant_id", effectiveVariantId)
    if (factoryId) params.set("factory_id", factoryId)
    router.push(`/${locale}/rfq?${params.toString()}`)
  }

  // 数量变化
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1))
  const incrementQty = () => setQuantity((q) => q + 1)

  if (isLoading) {
    return <p className="text-center text-gray-500">{ct("loading")}</p>
  }

  if (!product) {
    return <p className="text-center text-gray-500">{ct("noResults")}</p>
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* 图片区 */}
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

      {/* 信息区 */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{product.title}</h1>
        {product.description && (
          <p className="text-gray-600">{product.description}</p>
        )}

        {/* 标签区 */}
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

        {/* 认证 */}
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

        {/* Variant 选择器 */}
        {hasVariants && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t("selectVariant")}</h3>
            <div className="space-y-3">
              {Object.entries(optionMap).map(([optionTitle, values]) => (
                <div key={optionTitle}>
                  <label className="mb-1 block text-xs text-gray-500">{optionTitle}</label>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    value={
                      selectedVariantId
                        ? variants.find((v: any) => v.id === selectedVariantId)?.options?.find(
                            (o: any) => o.option?.title === optionTitle
                          )?.value || ""
                        : ""
                    }
                    onChange={(e) => {
                      const selectedValue = e.target.value
                      const matchingVariant = variants.find((v: any) =>
                        v.options?.some(
                          (o: any) =>
                            o.option?.title === optionTitle && o.value === selectedValue
                        )
                      )
                      setSelectedVariantId(matchingVariant?.id || null)
                    }}
                  >
                    <option value="">{t("pleaseSelect")}</option>
                    {Object.keys(values).map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 数量选择器 */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">{t("quantity")}</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={decrementQty}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-9 w-20 rounded-md border border-gray-300 text-center text-sm focus:border-brand-500 focus:outline-none"
            />
            <button
              onClick={incrementQty}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleAddToCart}
            disabled={!effectiveVariantId || cartLoading}
            className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addedToCart ? t("addedToCart") : cartLoading ? ct("loading") : t("addToCart")}
          </button>
          <button
            onClick={handleRequestQuote}
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t("requestQuote")}
          </button>
        </div>

        {/* Variant 未选择提示 */}
        {hasVariants && !effectiveVariantId && (
          <p className="text-xs text-amber-600">{t("selectVariantHint")}</p>
        )}

        {/* 工厂卡片 */}
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
  )
}
