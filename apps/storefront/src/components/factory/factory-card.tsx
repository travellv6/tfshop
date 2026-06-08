"use client"

import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import type { Factory } from "@/hooks/use-factories"

export function FactoryCard({ factory }: { factory: Factory }) {
  const t = useTranslations("factory")
  const locale = useLocale()

  return (
    <Link
      href="/factories/${factory.slug}"
      className="group rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
    >
      <div className="mb-3 h-32 overflow-hidden rounded-md bg-gray-100">
        {factory.cover_image ? (
          <img
            src={factory.cover_image}
            alt={factory.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-gray-400">
            🏭
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand-600">
        {factory.name}
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        {factory.location_city}, {factory.location_province}
      </p>
      {factory.established_year && (
        <p className="mt-0.5 text-xs text-gray-400">
          {t("established", { year: factory.established_year })}
        </p>
      )}
      {factory.certifications && factory.certifications.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {factory.certifications.slice(0, 3).map((cert) => (
            <span
              key={cert}
              className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600"
            >
              {cert}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
