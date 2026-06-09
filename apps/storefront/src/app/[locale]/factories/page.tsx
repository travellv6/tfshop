"use client"

import { useTranslations } from "next-intl"
import { Factory, Search, ShieldCheck } from "lucide-react"
import { useFactories } from "@/hooks/use-factories"
import { FactoryCard } from "@/components/factory/factory-card"
import { SectionHeader } from "@/components/ui/storefront"
import { demoFactories, type StorefrontFactory } from "@/lib/storefront-data"

export default function FactoryListPage() {
  const t = useTranslations()
  const ft = useTranslations("factoriesPage")
  const { data, isLoading } = useFactories({ limit: 20 })
  const factories: StorefrontFactory[] = data?.factories?.length
    ? data.factories
    : demoFactories

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="panel mb-6 overflow-hidden">
          <div className="grid gap-6 bg-white p-6 lg:grid-cols-[1fr_340px] lg:items-center">
            <div>
              <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                {ft("eyebrow")}
              </p>
              <h1 className="font-display text-ink-900 mt-2 text-4xl font-bold">
                {t("factory.title")}
              </h1>
              <p className="text-ink-500 mt-3 max-w-2xl text-sm leading-relaxed">
                {ft("description")}
              </p>
            </div>
            <div className="bg-brand-50 rounded-lg p-5">
              <ShieldCheck className="text-brand-700 mb-3 h-8 w-8" />
              <p className="text-ink-900 text-2xl font-extrabold">2,000+</p>
              <p className="text-ink-600 text-sm font-semibold">
                {ft("supplierStat")}
              </p>
            </div>
          </div>
          <div className="border-surface-200 bg-surface-50 border-t p-4">
            <div className="relative max-w-xl">
              <Search className="text-ink-400 absolute left-3 top-3 h-5 w-5" />
              <input
                className="input-field h-11 pl-10"
                placeholder={ft("searchPlaceholder")}
              />
            </div>
          </div>
        </section>

        <SectionHeader
          eyebrow={ft("sectionEyebrow")}
          title={ft("sectionTitle")}
          description={ft("sectionDesc")}
        />

        {isLoading && !factories.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-100 h-80 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : factories.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {factories.map((factory) => (
              <FactoryCard key={factory.id} factory={factory as any} />
            ))}
          </div>
        ) : (
          <div className="panel p-10 text-center">
            <Factory className="text-brand-700 mx-auto mb-3 h-8 w-8" />
            <p className="text-ink-500">{t("common.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
