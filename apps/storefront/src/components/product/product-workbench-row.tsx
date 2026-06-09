"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { CheckCircle2, Heart, MapPin, PackagePlus, Star } from "lucide-react"
import {
  productCertifications,
  productFactoryName,
  productImage,
  productMoq,
  productOrigin,
  productPrice,
  responseTime,
  type StorefrontProduct,
} from "@/lib/storefront-data"

export function ProductWorkbenchRow({
  product,
  onAdd,
}: {
  product: StorefrontProduct
  onAdd: (product: StorefrontProduct) => void
}) {
  const t = useTranslations("product")
  const wt = useTranslations("productWorkbench")
  const [selected, setSelected] = useState(false)
  const certs = productCertifications(product)
  const moq = productMoq(product)

  return (
    <article className="border-surface-200 grid gap-4 border-b bg-white p-4 last:border-b-0 lg:grid-cols-[150px_1fr_220px]">
      <Link
        href={`/products/${product.handle}`}
        className="bg-surface-100 relative aspect-square overflow-hidden rounded-lg"
      >
        <img
          src={productImage(product)}
          alt={product.title}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            setSelected((value) => !value)
          }}
          className="text-ink-500 shadow-soft absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded bg-white/90"
        >
          <Heart
            className={`h-4 w-4 ${
              selected ? "fill-coral-500 text-coral-500" : ""
            }`}
          />
        </button>
      </Link>

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="bg-brand-50 text-brand-700 rounded-full px-2.5 py-1 text-xs font-bold">
            {t("inStock")}
          </span>
          {product.metadata?.sample_available && (
            <span className="bg-coral-50 text-coral-700 rounded-full px-2.5 py-1 text-xs font-bold">
              {t("sampleAvailable")}
            </span>
          )}
        </div>
        <Link
          href={`/products/${product.handle}`}
          className="text-ink-900 hover:text-brand-700 text-lg font-extrabold"
        >
          {product.title}
        </Link>
        <p className="text-ink-400 mt-1 text-xs font-medium">
          {wt("sku", { code: product.id.slice(-6).toUpperCase() })}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {certs.map((cert) => (
            <span
              key={cert}
              className="bg-surface-100 text-ink-600 rounded px-2 py-1 text-[11px] font-semibold"
            >
              {cert}
            </span>
          ))}
          <span className="bg-surface-100 text-ink-600 rounded px-2 py-1 text-[11px] font-semibold">
            {product.metadata?.material || wt("materialFallback")}
          </span>
          <span className="bg-surface-100 text-ink-600 rounded px-2 py-1 text-[11px] font-semibold">
            {product.metadata?.size || "12cm"}
          </span>
        </div>

        <div className="border-surface-200 bg-surface-50 mt-4 grid max-w-xl grid-cols-3 overflow-hidden rounded-lg border text-xs">
          {["500-999", "1,000-2,999", "3,000+"].map((tier, i) => (
            <div
              key={tier}
              className="border-surface-200 border-r p-3 last:border-r-0"
            >
              <p className="text-ink-400">{wt("moqPcs")}</p>
              <p className="text-ink-900 font-bold">{tier}</p>
              <p className="text-ink-400 mt-2">{wt("unitPrice")}</p>
              <p className="text-ink-900 font-extrabold">
                {i === 0
                  ? productPrice(product).split(" - ")[0]
                  : i === 1
                  ? "$1.65"
                  : "$1.45"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="space-y-2 text-sm">
          <p className="text-ink-900 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="text-brand-700 h-4 w-4" />
            {productFactoryName(product)}
          </p>
          <p className="text-ink-500 flex items-center gap-1.5">
            <MapPin className="text-coral-500 h-4 w-4" />
            {productOrigin(product)}
          </p>
          <p className="text-ink-600 flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {product.metadata?.rating || "4.9"} {wt("rating")}
            <span className="text-ink-300">|</span>
            {wt("response", { time: responseTime(product) })}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-ink-600 flex items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              className="border-surface-300 text-brand-700 h-4 w-4 rounded"
            />
            {wt("compare")}
          </label>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="bg-brand-700 shadow-soft hover:bg-brand-800 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white"
          >
            <PackagePlus className="h-4 w-4" />
            {wt("addToRfq")}
          </button>
          <p className="text-ink-400 text-center text-xs">
            {wt("moqValue", { count: moq })}
          </p>
        </div>
      </div>
    </article>
  )
}
