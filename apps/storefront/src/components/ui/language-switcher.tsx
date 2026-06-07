"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter, routing, type Locale } from "@/i18n/routing"

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
    // 使用 next-intl 的 replaceLocale 替换路径中的 locale
    router.replace(pathname, { locale: newLocale as Locale })
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
