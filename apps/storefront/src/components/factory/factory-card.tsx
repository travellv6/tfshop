"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import type { Factory } from "@/hooks/use-factories"
import { Factory as FactoryIcon, MapPin, ShieldCheck, Star } from "lucide-react"
import { heroImage } from "@/lib/storefront-data"

export function FactoryCard({ factory }: { factory: Factory }) {
  const t = useTranslations("factory")

  return (
    <Link
      href={`/factories/${factory.slug}`}
      className="border-surface-200 hover:border-brand-200 hover:shadow-card group flex h-full flex-col overflow-hidden rounded-lg border bg-white transition hover:-translate-y-0.5"
    >
      <div className="bg-surface-100 relative h-36 overflow-hidden">
        <img
          src={factory.cover_image || heroImage}
          alt={factory.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="text-brand-700 shadow-soft absolute left-3 top-3 inline-flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-[11px] font-bold">
          <ShieldCheck className="h-3 w-3" />
          Verified
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-ink-900 group-hover:text-brand-700 line-clamp-2 text-sm font-extrabold">
          {factory.name}
        </h3>
        <p className="text-ink-500 mt-2 flex items-center gap-1 text-xs font-medium">
          <MapPin className="text-coral-500 h-3.5 w-3.5" />
          {factory.location_city || "Shantou"},{" "}
          {factory.location_province || "Guangdong"}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <span className="bg-surface-100 text-ink-600 rounded px-2 py-1">
            {factory.established_year
              ? t("established", { year: factory.established_year })
              : "9 YRS"}
          </span>
          <span className="bg-surface-100 text-ink-600 rounded px-2 py-1">
            Factory
          </span>
        </div>
        {factory.certifications && factory.certifications.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {factory.certifications.slice(0, 3).map((cert) => (
              <span
                key={cert}
                className="bg-brand-50 text-brand-700 rounded px-1.5 py-0.5 text-[10px] font-bold"
              >
                {cert}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-end justify-between pt-4 text-xs">
          <span className="text-ink-700 inline-flex items-center gap-1 font-bold">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            4.9
          </span>
          <span className="text-ink-500 inline-flex items-center gap-1">
            <FactoryIcon className="h-3.5 w-3.5" />
            View profile
          </span>
        </div>
      </div>
    </Link>
  )
}
