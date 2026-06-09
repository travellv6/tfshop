"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/routing"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  Factory,
  Heart,
  Minus,
  PackagePlus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react"
import { useProduct } from "@/hooks/use-products"
import { useCart } from "@/lib/cart-context"
import {
  demoProducts,
  productCertifications,
  productFactoryName,
  productImage,
  productMoq,
  productOrigin,
  productPrice,
  responseTime,
  type StorefrontProduct,
} from "@/lib/storefront-data"

export default function ProductDetailPage() {
  const t = useTranslations("product")
  const ct = useTranslations("common")
  const { handle } = useParams()
  const router = useRouter()
  const { data: productData, isLoading } = useProduct(handle as string)
  const { addItem, isLoading: cartLoading } = useCart()

  const product = (productData ||
    demoProducts.find((item) => item.handle === handle)) as
    | StorefrontProduct
    | undefined

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  )
  const [quantity, setQuantity] = useState<number>(
    product ? productMoq(product) : 1
  )
  const [addedToCart, setAddedToCart] = useState(false)

  const metadata = product?.metadata as Record<string, any> | null
  const factorySlug = metadata?.factory_slug as string | undefined
  const factoryId = metadata?.factory_id as string | undefined
  const variants = product?.variants || []
  const hasVariants = variants.length > 0
  const effectiveVariantId =
    selectedVariantId || (variants.length === 1 ? variants[0].id : null)
  const priceDisplay = productPrice(product)

  const optionMap = useMemo(() => {
    if (!hasVariants) return {}
    const map: Record<string, Record<string, string[]>> = {}
    variants.forEach((v: any) => {
      v.options?.forEach((opt: any) => {
        const optTitle = opt.option?.title || t("option")
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
      // CartContext handles cart recovery.
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

  if (isLoading && !product) {
    return (
      <div className="page-shell">
        <div className="flex justify-center py-20">
          <div className="border-brand-200 border-t-brand-700 h-8 w-8 animate-spin rounded-full border-2" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="page-shell">
        <div className="panel p-10 text-center">
          <p className="font-body text-ink-500">{ct("noResults")}</p>
          <Link href="/products" className="btn-primary mt-5">
            {t("backToProducts")}
          </Link>
        </div>
      </div>
    )
  }

  const certs = productCertifications(product)

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="text-brand-700 mb-5 inline-flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("title")}
        </Link>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
          <section className="space-y-4">
            <div className="panel overflow-hidden">
              <div className="relative aspect-square bg-white lg:aspect-[1.08]">
                <img
                  src={productImage(product)}
                  alt={product.title}
                  className="h-full w-full object-contain p-8"
                />
                <button className="text-ink-400 shadow-soft hover:text-coral-500 absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <Heart className="h-5 w-5" />
                </button>
                <span className="bg-coral-50 text-coral-600 ring-coral-100 absolute left-4 top-4 rounded px-3 py-1 text-xs font-extrabold ring-1">
                  {t("hotOpportunity")}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [t("factoryDirectTitle"), t("factoryDirectDesc"), Factory],
                [
                  t("tradeAssuranceTitle"),
                  t("tradeAssuranceDesc"),
                  ShieldCheck,
                ],
                [t("globalDeliveryTitle"), t("globalDeliveryDesc"), Truck],
              ].map(([title, desc, Icon]) => (
                <div key={title as string} className="panel p-4">
                  <Icon className="text-brand-700 mb-3 h-5 w-5" />
                  <p className="text-ink-900 font-bold">{title as string}</p>
                  <p className="text-ink-500 mt-1 text-xs">{desc as string}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="panel p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="bg-brand-50 text-brand-700 rounded-full px-3 py-1 text-xs font-bold">
                  {t("inStock")}
                </span>
                {metadata?.sample_available && (
                  <span className="bg-coral-50 text-coral-700 rounded-full px-3 py-1 text-xs font-bold">
                    {t("sampleAvailable")}
                  </span>
                )}
              </div>
              <h1 className="font-display text-ink-900 text-3xl font-bold leading-tight">
                {product.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="text-ink-700 flex items-center gap-1 font-bold">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {metadata?.rating || "4.9"} {t("rating")}
                </span>
                <span className="text-ink-300">|</span>
                <span className="text-ink-500 font-semibold">
                  {t("response", { time: responseTime(product) })}
                </span>
              </div>
              <p className="text-ink-900 mt-5 text-3xl font-extrabold">
                {priceDisplay}
              </p>
              <p className="text-ink-500 mt-1 text-sm font-semibold">
                {t("moqValue", { count: productMoq(product) })}
              </p>

              {product.description && (
                <p className="text-ink-600 mt-5 leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {certs.map((cert) => (
                  <span
                    key={cert}
                    className="bg-brand-50 text-brand-700 rounded px-2.5 py-1 text-xs font-bold"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </section>

            {hasVariants && (
              <section className="panel p-5">
                <h2 className="text-ink-900 mb-4 text-base font-extrabold">
                  {t("selectVariant")}
                </h2>
                <div className="space-y-4">
                  {Object.entries(optionMap).map(([optionTitle, values]) => (
                    <div key={optionTitle}>
                      <label className="text-ink-500 mb-2 block text-xs font-bold uppercase tracking-wide">
                        {optionTitle}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(values).map((val) => {
                          const isSelected = selectedVariantId
                            ? variants
                                .find((v: any) => v.id === selectedVariantId)
                                ?.options?.find(
                                  (o: any) => o.option?.title === optionTitle
                                )?.value === val
                            : false
                          return (
                            <button
                              key={val}
                              onClick={() => {
                                const matchingVariant = variants.find(
                                  (v: any) =>
                                    v.options?.some(
                                      (o: any) =>
                                        o.option?.title === optionTitle &&
                                        o.value === val
                                    )
                                )
                                setSelectedVariantId(
                                  matchingVariant?.id || null
                                )
                              }}
                              className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                                isSelected
                                  ? "border-brand-600 bg-brand-50 text-brand-700"
                                  : "border-surface-300 text-ink-600 hover:border-brand-200"
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
                {!effectiveVariantId && (
                  <p className="mt-3 text-xs font-semibold text-amber-600">
                    {t("selectVariantHint")}
                  </p>
                )}
              </section>
            )}

            <section className="panel p-5">
              <h2 className="text-ink-900 text-base font-extrabold">
                {t("quantity")}
              </h2>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="border-surface-300 text-ink-600 hover:bg-surface-100 flex h-10 w-10 items-center justify-center rounded-lg border"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="border-surface-300 focus:border-brand-500 focus:ring-brand-100 h-10 w-28 rounded-lg border text-center text-sm font-bold focus:outline-none focus:ring-2"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="border-surface-300 text-ink-600 hover:bg-surface-100 flex h-10 w-10 items-center justify-center rounded-lg border"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!effectiveVariantId || cartLoading}
                  className="btn-primary gap-2"
                >
                  <PackagePlus className="h-4 w-4" />
                  {addedToCart
                    ? t("addedToCart")
                    : cartLoading
                    ? ct("loading")
                    : t("addToCart")}
                </button>
                <button onClick={handleRequestQuote} className="btn-coral">
                  {t("requestQuote")}
                </button>
              </div>
            </section>

            <section className="panel p-5">
              <p className="text-ink-500 text-xs font-bold uppercase tracking-wide">
                {t("factory")}
              </p>
              <h3 className="text-ink-900 mt-2 text-lg font-extrabold">
                {productFactoryName(product)}
              </h3>
              <p className="text-ink-500 mt-1 text-sm">
                {productOrigin(product)}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <span className="bg-surface-100 text-ink-700 rounded px-2 py-2 font-bold">
                  {t("verified")}
                </span>
                <span className="bg-surface-100 text-ink-700 rounded px-2 py-2 font-bold">
                  {t("oemOdm")}
                </span>
              </div>
              {factorySlug && (
                <Link
                  href={`/factories/${factorySlug}`}
                  className="text-brand-700 mt-4 inline-flex items-center gap-2 text-sm font-extrabold"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {t("viewFactory")}
                </Link>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
