"use client"

import { useTranslations } from "next-intl"
import { useFactories } from "@/hooks/use-factories"
import { FactoryCard } from "@/components/factory/factory-card"

export default function FactoryListPage() {
  const t = useTranslations()
  const { data, isLoading } = useFactories({ limit: 20 })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t("factory.title")}</h1>

      {isLoading ? (
        <p className="text-center text-gray-500">{t("common.loading")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {data?.factories?.map((factory) => (
            <FactoryCard key={factory.id} factory={factory} />
          ))}
        </div>
      )}

      {data?.factories?.length === 0 && (
        <p className="text-center text-gray-500">{t("common.noResults")}</p>
      )}
    </div>
  )
}
