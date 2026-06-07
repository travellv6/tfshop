"use client"

import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { routing, type Locale } from "@/i18n/routing"

const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ar: "العربية",
  zh: "中文",
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const handleChange = (newLocale: string) => {
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/"))
  }

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeLabels[loc]}
        </option>
      ))}
    </select>
  )
}
