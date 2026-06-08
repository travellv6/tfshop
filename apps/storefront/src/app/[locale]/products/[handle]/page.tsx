"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { useProduct } from "@/hooks/use-products"
import { useCart } from "@/lib/cart-context"

export default function ProductDetailPage() {
  const t = useTranslations("product")
  const ct = useTranslations("common")
  const { handle } = useParams()
  const router = useRouter()
  const { data: product, isLoading } = useProduct(handle as string)
  const { addItem, isLoading: cartLoading } = useCart()

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const metadata = product?.metadata as Record<string, any> | null
  const factorySlug = metadata?.factory_slug as string | undefined
  const factoryId = metadata?.factory_id as string | undefined

  const variants = product?.variants || []
  const hasVariants = variants.length > 0
  const effectiveVariantId = selectedVariantId || (variants.length === 1 ? variants[0].id : null)

  // 获取当前 variant 的价格
  const currentVariant = variants.find((v: any) => v.id === effectiveVariantId)
  const currentPrice = (currentVariant as any)?.prices?.[0]
  const priceDisplay = currentPrice
    ? `$${(currentPrice.amount / 100).toFixed(2)}`
    : metadata?.price_range || null

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
      // CartContext 内部处理
    }
  }

  const handleRequestQuote = () => {
    const params = new URLSearchParams()
    if (product?.id) params.set("product_id", product.id)
    if (product?.title) params.set("product_title", product.title)
    if (effectiveVariantId) params.set("variant_id", effectiveVariantId)
    if (factoryId) params.set("factory_id", factoryId)
    router.push(`/rfq?${params.toString()}`)
  }

  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1))
  const incrementQty = () => setQuantity((q) => q + 1)

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-brand-200 border-t-brand-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="text-5xl mb-4">🔍</span>
        <p className="font-body text-ink-500">{ct("noResults")}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 font-body text-sm text-ink-400">
        <Link href="/" className="transition-colors hover:text-ink-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="transition-colors hover:text-ink-600">{t("title")}</Link>
        <span>/</span>
        <span className="text-ink-700">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image Section */}
        <div className="space-y-4 animate-fade-in">
          {product.images && product.images.length > 0 ? (
            <div className="overflow-hidden rounded-3xl bg-surface-100">
              <img
                src={product.images[0].url}
                alt={product.title}
                className="aspect-square w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center rounded-3xl bg-surface-100">
              <svg className="h-20 w-20 text-ink-200" fill="none" viewBox="0 0 24 24" strokeWidth={0.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              <p className="mt-3 font-body text-sm text-ink-300">Photo coming soon</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-6 animate-slide-up">
          {/* Title & Price */}
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900">
              {product.title}
            </h1>
            {priceDisplay && (
              <p className="mt-3 font-display text-2xl font-bold text-brand-700">
                {priceDisplay}
              </p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="font-body leading-relaxed text-ink-600">
              {product.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {metadata?.min_order_qty && (
              <span className="badge-amber">{t("moq", { count: metadata.min_order_qty })}</span>
            )}
            {metadata?.is_in_stock && (
              <span className="badge-brand">{t("inStock")}</span>
            )}
            {metadata?.sample_available && (
              <span className="badge bg-purple-100 text-purple-700">Sample</span>
            )}
          </div>

          {/* Certifications */}
          {metadata?.certifications && (
            <div>
              <h3 className="mb-2 font-body text-sm font-semibold text-ink-700">{t("certifications")}</h3>
              <div className="flex flex-wrap gap-2">
                {metadata.certifications.map((cert: string) => (
                  <span key={cert} className="rounded-lg bg-surface-100 px-3 py-1.5 font-body text-xs font-medium text-ink-600">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Variant Selector */}
          {hasVariants && (
            <div className="rounded-2xl border border-surface-200 p-5">
              <h3 className="mb-4 font-display text-base font-bold text-ink-900">
                {t("selectVariant")}
              </h3>
              <div className="space-y-4">
                {Object.entries(optionMap).map(([optionTitle, values]) => (
                  <div key={optionTitle}>
                    <label className="mb-2 block font-body text-xs font-semibold uppercase tracking-wide text-ink-500">
                      {optionTitle}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(values).map((val) => {
                        const isSelected = selectedVariantId
                          ? variants.find((v: any) => v.id === selectedVariantId)?.options?.find(
                              (o: any) => o.option?.title === optionTitle
                            )?.value === val
                          : false
                        return (
                          <button
                            key={val}
                            onClick={() => {
                              const matchingVariant = variants.find((v: any) =>
                                v.options?.some(
                                  (o: any) =>
                                    o.option?.title === optionTitle && o.value === val
                                )
                              )
                              setSelectedVariantId(matchingVariant?.id || null)
                            }}
                            className={`rounded-xl border-2 px-4 py-2 font-body text-sm font-medium transition-all ${
                              isSelected
                                ? "border-brand-500 bg-brand-50 text-brand-700"
                                : "border-surface-200 text-ink-600 hover:border-ink-300"
                            }`}
                          >
                            {val}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {hasVariants && !effectiveVariantId && (
                <p className="mt-3 font-body text-xs text-amber-600">{t("selectVariantHint")}</p>
              )}
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="space-y-4 rounded-2xl border border-surface-200 p-5">
            <h3 className="font-display text-base font-bold text-ink-900">{t("quantity")}</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={decrementQty}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-300 font-body text-lg text-ink-600 transition-colors hover:bg-surface-100"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-10 w-20 rounded-xl border border-surface-300 text-center font-body text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
              <button
                onClick={incrementQty}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-300 font-body text-lg text-ink-600 transition-colors hover:bg-surface-100"
              >
                +
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!effectiveVariantId || cartLoading}
                className="btn-primary flex-1"
              >
                {addedToCart ? "✓ " + t("addedToCart") : cartLoading ? ct("loading") : t("addToCart")}
              </button>
              <button
                onClick={handleRequestQuote}
                className="btn-outline"
              >
                {t("requestQuote")}
              </button>
            </div>
          </div>

          {/* Factory Card */}
          {factorySlug && (
            <div className="card flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-100 text-2xl">
                🏭
              </span>
              <div className="flex-1">
                <h3 className="font-body text-xs font-semibold uppercase tracking-wide text-ink-500">
                  {t("factory")}
                </h3>
                <Link
                  href="/factories/${factorySlug}"
                  className="font-body text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
                >
                  {t("viewFactory")} →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
