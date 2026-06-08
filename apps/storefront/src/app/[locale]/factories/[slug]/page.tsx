"use client"

import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/routing"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Award,
  Building2,
  CheckCircle2,
  MapPin,
  MessageSquareText,
  PackageCheck,
  ShieldCheck,
  Star,
} from "lucide-react"
import { useFactory } from "@/hooks/use-factories"
import { useProductsByFactory } from "@/hooks/use-products"
import { ProductCard } from "@/components/product/product-card"
import {
  demoFactories,
  demoProducts,
  heroImage,
  type StorefrontFactory,
  type StorefrontProduct,
} from "@/lib/storefront-data"

export default function FactoryDetailPage() {
  const t = useTranslations("factory")
  const ct = useTranslations("common")
  const { slug } = useParams()
  const router = useRouter()
  const { data: factoryData, isLoading } = useFactory(slug as string)
  const fallbackFactory = demoFactories.find((item) => item.slug === slug)
  const factory = (factoryData || fallbackFactory) as
    | StorefrontFactory
    | undefined
  const { data: productsData } = useProductsByFactory(factory?.id || "")

  const handleRequestQuote = () => {
    const params = new URLSearchParams()
    if (factory?.id) params.set("factory_id", factory.id)
    if (factory?.name) params.set("factory_name", factory.name)
    router.push(`/rfq?${params.toString()}`)
  }

  if (isLoading && !factory) {
    return (
      <div className="page-shell">
        <p className="text-ink-500 text-center">{ct("loading")}</p>
      </div>
    )
  }

  if (!factory) {
    return (
      <div className="page-shell">
        <p className="text-ink-500 text-center">{ct("noResults")}</p>
      </div>
    )
  }

  const products: StorefrontProduct[] = productsData?.products?.length
    ? productsData.products
    : demoProducts

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/factories"
          className="text-brand-700 mb-5 inline-flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("title")}
        </Link>

        <section className="panel overflow-hidden">
          <div className="bg-surface-100 relative h-64 lg:h-80">
            <img
              src={factory.cover_image || heroImage}
              alt={factory.name}
              className="h-full w-full object-cover"
            />
            <div className="from-ink-900/70 absolute inset-0 bg-gradient-to-r to-transparent" />
            <div className="absolute bottom-0 left-0 max-w-3xl p-6 text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Verified Supplier
              </span>
              <h1 className="font-display mt-4 text-4xl font-bold">
                {factory.name}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-white/85">
                <MapPin className="h-4 w-4" />
                {factory.location_city || "Shantou"},{" "}
                {factory.location_province || "Guangdong"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-ink-600 leading-relaxed">
                {factory.description ||
                  "Verified toy manufacturer with export certification support, sample service, and responsive RFQ workflows."}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <FactoryMetric
                  icon={<Building2 className="h-5 w-5" />}
                  label="Established"
                  value={
                    factory.established_year
                      ? String(factory.established_year)
                      : "9 YRS"
                  }
                />
                <FactoryMetric
                  icon={<PackageCheck className="h-5 w-5" />}
                  label="Capacity"
                  value={factory.monthly_capacity || "280,000 pcs"}
                />
                <FactoryMetric
                  icon={<Award className="h-5 w-5" />}
                  label="Employees"
                  value={factory.employee_scale || "100-300"}
                />
                <FactoryMetric
                  icon={<Star className="h-5 w-5" />}
                  label="Rating"
                  value="4.9"
                />
              </div>

              {factory.certifications && factory.certifications.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-ink-900 mb-3 text-lg font-extrabold">
                    {t("certifications")}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {factory.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="bg-brand-50 text-brand-700 rounded px-3 py-1.5 text-sm font-bold"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="border-brand-100 bg-brand-50 rounded-lg border p-5">
              <MessageSquareText className="text-brand-700 mb-3 h-7 w-7" />
              <h2 className="text-ink-900 text-xl font-extrabold">
                Request a factory quote
              </h2>
              <p className="text-ink-600 mt-2 text-sm">
                Send requirements directly to this supplier and compare
                quotation terms in RFQ Center.
              </p>
              <button
                onClick={handleRequestQuote}
                className="btn-primary mt-5 w-full"
              >
                {t("requestQuote")}
              </button>
              <div className="text-ink-700 mt-5 space-y-2 text-sm font-semibold">
                {[
                  "OEM/ODM support",
                  "Sample available",
                  "Certificate files",
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="text-brand-700 h-4 w-4" />
                    {item}
                  </p>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                Factory Catalog
              </p>
              <h2 className="font-display text-ink-900 mt-1 text-2xl font-bold">
                {t("products")}
              </h2>
            </div>
            <Link href="/products" className="text-brand-700 text-sm font-bold">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {products.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function FactoryMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="border-surface-200 bg-surface-50 rounded-lg border p-4">
      <div className="text-brand-700 mb-3">{icon}</div>
      <p className="text-ink-400 text-xs font-bold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-ink-900 mt-1 text-sm font-extrabold">{value}</p>
    </div>
  )
}
