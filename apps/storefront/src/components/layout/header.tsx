"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/ui/language-switcher"

export function Header() {
  const t = useTranslations("nav")
  const locale = useLocale()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href={`/${locale}`} className="text-xl font-bold text-brand-600">
            🧸 TFShop
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href={`/${locale}/products`}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {t("products")}
            </Link>
            <Link
              href={`/${locale}/factories`}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {t("factories")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <span className="text-sm text-gray-600">{t("login")}</span>
        </div>
      </div>
    </header>
  )
}
