"use client"

import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { useProducts } from "@/hooks/use-products"
import { useFactories } from "@/hooks/use-factories"
import { ProductCard } from "@/components/product/product-card"
import { FactoryCard } from "@/components/factory/factory-card"

export default function HomePage() {
  const t = useTranslations("home")
  const locale = useLocale()
  const { data: productsData } = useProducts({ limit: 8 })
  const { data: factoriesData } = useFactories({ limit: 4 })
  const products = productsData?.products || []
  const factories = factoriesData?.factories || []

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-ink-900">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-pattern opacity-60" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-coral-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-3xl">
            <div className="animate-fade-in">
              <span className="badge-brand mb-6 inline-block">
                {t("lowMoqZone")}
              </span>
            </div>

            <h1 className="animate-slide-up font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>

            <p className="mt-6 animate-slide-up max-w-xl font-body text-lg leading-relaxed text-ink-300 stagger-1">
              {t("heroSubtitle")}
            </p>

            <div className="mt-10 flex flex-wrap gap-4 animate-slide-up stagger-2">
              <Link
                href="/products"
                className="btn-coral text-base px-8 py-4"
              >
                {t("browseProducts")}
              </Link>
              <Link
                href="/rfq"
                className="btn-outline border-white/20 text-white hover:bg-white/10 text-base px-8 py-4"
              >
                {t("requestQuote")}
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-14 flex flex-wrap gap-8 animate-fade-in stagger-3">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400">
                  🏭
                </span>
                <div>
                  <p className="font-body text-sm font-semibold text-white">500+</p>
                  <p className="font-body text-xs text-ink-400">Verified Factories</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400">
                  🌍
                </span>
                <div>
                  <p className="font-body text-sm font-semibold text-white">120+</p>
                  <p className="font-body text-xs text-ink-400">Countries Served</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400">
                  ⚡
                </span>
                <div>
                  <p className="font-body text-sm font-semibold text-white">Low MOQ</p>
                  <p className="font-body text-xs text-ink-400">From 50 Pieces</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      {products.length > 0 && (
        <section className="section-container">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="badge-amber mb-3">
                🔥 Hot Picks
              </span>
              <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
                {t("lowMoqZone")}
              </h2>
              <p className="mt-2 font-body text-sm text-ink-500">
                {t("lowMoqSubtitle")}
              </p>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 font-body text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 sm:flex"
            >
              View all
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.map((product, i) => (
              <div
                key={product.id}
                className={`animate-slide-up opacity-0 stagger-${Math.min(i + 1, 6)}`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============ WHY TFSHOP ============ */}
      <section className="bg-surface-100">
        <div className="section-container">
          <div className="mb-12 text-center">
            <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
              Why Choose TFShop?
            </h2>
            <p className="mt-3 font-body text-ink-500">
              Direct from factory, transparent pricing, low MOQ
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🏭",
                title: "Factory Direct",
                desc: "Connect directly with verified Chinese toy manufacturers. No middlemen.",
                color: "bg-brand-50 text-brand-600",
              },
              {
                icon: "💰",
                title: "Transparent Pricing",
                desc: "See tiered pricing upfront. The more you buy, the more you save.",
                color: "bg-coral-50 text-coral-600",
              },
              {
                icon: "📦",
                title: "Low MOQ",
                desc: "Start with as few as 50 pieces. Perfect for small businesses testing new products.",
                color: "bg-amber-50 text-amber-600",
              },
              {
                icon: "🛡️",
                title: "Quality Guaranteed",
                desc: "All products meet international safety standards. Certified factories only.",
                color: "bg-purple-50 text-purple-600",
              },
              {
                icon: "🚀",
                title: "Fast Shipping",
                desc: "Express shipping worldwide. Real-time tracking on every order.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: "💬",
                title: "24/7 Support",
                desc: "Dedicated account managers. RFQ response within 24 hours.",
                color: "bg-teal-50 text-teal-600",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`card group animate-slide-up opacity-0 stagger-${Math.min(i + 1, 6)}`}
              >
                <span className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${item.color}`}>
                  {item.icon}
                </span>
                <h3 className="font-display text-lg font-bold text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RECOMMENDED FACTORIES ============ */}
      {factories.length > 0 && (
        <section className="section-container">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="badge-brand mb-3">
                🏭 Featured
              </span>
              <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
                {t("recommendedFactories")}
              </h2>
            </div>
            <Link
              href="/factories"
              className="hidden items-center gap-1 font-body text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 sm:flex"
            >
              View all
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {factories.map((factory, i) => (
              <div
                key={factory.id}
                className={`animate-slide-up opacity-0 stagger-${Math.min(i + 1, 4)}`}
              >
                <FactoryCard factory={factory} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============ CTA SECTION ============ */}
      <section className="relative overflow-hidden bg-brand-700">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="relative section-container text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to Source Smarter?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-brand-100">
            Join thousands of buyers who trust TFShop for factory-direct toy sourcing.
            Start with a quote request today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/rfq"
              className="btn-coral text-base px-8 py-4"
            >
              Request a Quote
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-body text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
