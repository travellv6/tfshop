"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Heart, PackageCheck } from "lucide-react"
import {
  productCertifications,
  productImage,
  productMoq,
  productPrice,
  type StorefrontProduct,
} from "@/lib/storefront-data"

interface ProductCardProps {
  product: StorefrontProduct
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const t = useTranslations("product")
  const moq = productMoq(product)
  const price = productPrice(product)
  const certs = productCertifications(product)

  return (
    <Link
      href={`/products/${product.handle}`}
      className="border-surface-200 hover:border-brand-200 hover:shadow-card group flex h-full flex-col overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="bg-surface-100 relative aspect-square overflow-hidden">
        <img
          src={productImage(product)}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="border-coral-200 bg-coral-50 text-coral-600 absolute left-3 top-3 rounded border px-2 py-1 text-[11px] font-bold">
          Best Seller
        </span>
        <span className="text-ink-400 shadow-soft group-hover:text-coral-500 absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition">
          <Heart className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-ink-900 group-hover:text-brand-700 line-clamp-2 text-sm font-bold leading-snug transition-colors">
          {product.title}
        </h3>
        <p className="text-ink-400 mt-2 text-xs font-medium">
          {t("moq", { count: moq })}
        </p>
        <p className="text-ink-900 mt-1 text-sm font-extrabold">{price}</p>
        {!compact && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {certs.slice(0, 2).map((cert) => (
              <span
                key={cert}
                className="bg-brand-50 text-brand-700 inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-bold"
              >
                <PackageCheck className="h-3 w-3" aria-hidden="true" />
                {cert}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-4">
          <span className="border-brand-200 bg-brand-50 text-brand-700 group-hover:bg-brand-700 inline-flex w-full items-center justify-center rounded-lg border px-3 py-2 text-xs font-bold transition group-hover:text-white">
            View details
          </span>
        </div>
      </div>
    </Link>
  )
}
