"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Factory,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import { useFactories } from "@/hooks/use-factories"
import { ProductCard } from "@/components/product/product-card"
import { FactoryCard } from "@/components/factory/factory-card"
import { IconBadge, SectionHeader, iconMap } from "@/components/ui/storefront"
import {
  categories,
  demoFactories,
  demoProducts,
  heroImage,
  marketplaceStats,
  trustFeatures,
  type StorefrontFactory,
  type StorefrontProduct,
} from "@/lib/storefront-data"

export default function HomePage() {
  const t = useTranslations("home")
  const categoryT = useTranslations("catalog.categories")
  const { data: productsData, isLoading: productsLoading } = useProducts({
    limit: 8,
  })
  const { data: factoriesData } = useFactories({ limit: 4 })
  const products: StorefrontProduct[] = productsData?.products?.length
    ? productsData.products
    : demoProducts
  const factories: StorefrontFactory[] = factoriesData?.factories?.length
    ? factoriesData.factories
    : demoFactories
  const heroBullets = ["lowMoq", "sample", "certs", "odm"] as const
  const statLabels = [
    t("stats.verifiedFactories"),
    t("stats.products"),
    t("stats.countries"),
    t("stats.onTimeDelivery"),
  ]

  return (
    <div className="bg-surface-50">
      <section className="border-surface-200 border-b bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
          <aside className="border-surface-200 hidden overflow-hidden rounded-lg border bg-white lg:block">
            <div className="border-surface-200 bg-surface-100 text-ink-900 flex items-center gap-2 border-b px-4 py-3 text-sm font-extrabold">
              <Search className="text-brand-700 h-4 w-4" />
              {t("allCategories")}
            </div>
            <nav className="py-2">
              {categories.map((category) => {
                const Icon = iconMap[category.icon]
                return (
                  <Link
                    key={category.label}
                    href="/products"
                    className="text-ink-700 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition"
                  >
                    <span className="flex items-center gap-3">
                      {Icon && <Icon className="text-brand-700 h-4 w-4" />}
                      {categoryT(category.key)}
                    </span>
                    <ChevronRight className="text-ink-300 h-4 w-4" />
                  </Link>
                )
              })}
            </nav>
            <div className="bg-brand-50 m-3 rounded-lg p-4">
              <p className="text-ink-900 text-sm font-extrabold">
                {t("sourcingHelpTitle")}
              </p>
              <p className="text-ink-500 mt-1 text-xs">
                {t("sourcingHelpDesc")}
              </p>
              <Link
                href="/rfq"
                className="bg-brand-100 text-brand-800 mt-3 inline-flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-extrabold"
              >
                {t("sourcingHelpAction")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>

          <div className="border-surface-200 relative overflow-hidden rounded-lg border bg-white">
            <img
              src={heroImage}
              alt={t("heroAlt")}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/10" />
            <div className="relative max-w-xl px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
              <span className="bg-brand-50 text-brand-800 ring-brand-100 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1">
                <ShieldCheck className="h-4 w-4" />
                {t("lowMoqZone")}
              </span>
              <h1 className="font-display text-ink-900 mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                {t("heroTitleLine1")}
                <br />
                {t("heroTitleLine2")}{" "}
                <span className="bg-brand-100 text-brand-800 rounded px-2">
                  {t("heroTitleHighlight")}
                </span>
              </h1>
              <p className="text-ink-600 mt-5 max-w-md text-base leading-relaxed sm:text-lg">
                {t("heroCopy")}
              </p>

              <div className="text-ink-700 mt-7 grid gap-3 text-sm font-semibold sm:grid-cols-2">
                {heroBullets.map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="text-brand-700 h-4 w-4" />
                    {t(`heroBullets.${item}`)}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/products" className="btn-coral px-7">
                  {t("exploreProducts")}
                </Link>
                <Link href="/rfq" className="btn-outline px-7">
                  {t("submitRfq")}
                </Link>
              </div>
              <div className="text-ink-500 mt-8 flex items-center gap-3 text-sm">
                <UsersRound className="text-brand-700 h-5 w-5" />
                {t("trustedByPrefix")}{" "}
                <strong className="text-brand-800">2,500+</strong>{" "}
                {t("trustedBySuffix")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-surface-200 border-b bg-white">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-0 px-4 py-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-6 lg:px-8">
          {trustFeatures.map((item) => (
            <div
              key={item.title}
              className="border-surface-200 flex items-center gap-3 px-3 py-3 lg:border-r lg:last:border-r-0"
            >
              <IconBadge icon={item.icon} className="h-9 w-9 bg-white" />
              <div>
                <p className="text-ink-900 text-sm font-extrabold">
                  {t(`trustFeatures.${item.key}.title`)}
                </p>
                <p className="text-ink-500 text-xs">
                  {t(`trustFeatures.${item.key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container">
        <SectionHeader
          eyebrow={t("bestsellers")}
          title={t("bestsellersTitle")}
          description={t("bestsellersDesc")}
          action={
            <Link
              href="/products"
              className="text-brand-700 hover:text-brand-800 hidden items-center gap-2 text-sm font-extrabold sm:inline-flex"
            >
              {t("viewAllProducts")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        {productsLoading && !products.length ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-100 h-72 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 xl:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white">
        <div className="section-container">
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="border-surface-200 bg-brand-50 rounded-lg border p-6">
              <div className="grid gap-6 sm:grid-cols-4">
                {marketplaceStats.map((stat, index) => (
                  <div key={stat.label}>
                    <p className="text-brand-800 text-3xl font-extrabold">
                      {stat.value}
                    </p>
                    <p className="text-ink-600 mt-1 text-sm font-semibold">
                      {statLabels[index]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-surface-200 rounded-lg border bg-white p-6">
              <p className="text-ink-900 text-lg font-extrabold">
                {t("newBuyerTitle")}
              </p>
              <p className="text-ink-500 mt-1 text-sm">{t("newBuyerDesc")}</p>
              <Link href="/auth/register" className="btn-primary mt-5 w-full">
                {t("createAccount")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container">
        <SectionHeader
          eyebrow={t("suppliersEyebrow")}
          title={t("suppliersTitle")}
          description={t("suppliersDesc")}
          action={
            <Link
              href="/factories"
              className="text-brand-700 hover:text-brand-800 hidden items-center gap-2 text-sm font-extrabold sm:inline-flex"
            >
              {t("exploreFactories")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {factories.slice(0, 3).map((factory) => (
            <FactoryCard key={factory.id} factory={factory as any} />
          ))}
        </div>
      </section>

      <section className="bg-ink-900">
        <div className="section-container">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <Factory className="text-brand-300 mb-5 h-10 w-10" />
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                {t("ctaTitle")}
              </h2>
              <p className="text-ink-300 mt-4 max-w-2xl text-base leading-relaxed">
                {t("ctaDesc")}
              </p>
            </div>
            <div className="rounded-lg bg-white p-5">
              <p className="text-ink-500 text-sm font-bold">
                {t("ctaCardTitle")}
              </p>
              <p className="text-ink-900 mt-2 text-2xl font-extrabold">
                {t("ctaCardMetric")}
              </p>
              <Link href="/rfq" className="btn-coral mt-5 w-full">
                {t("ctaAction")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
