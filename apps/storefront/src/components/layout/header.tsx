"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useCart } from "@/lib/cart-context"
import { useCustomer } from "@/hooks/use-customer"

export function Header() {
  const t = useTranslations("nav")
  const ct = useTranslations("common")
  const at = useTranslations("account")
  const locale = useLocale()
  const { itemCount } = useCart()
  const { data: customer } = useCustomer()

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
            <Link
              href={`/${locale}/rfq`}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {t("rfq")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href={`/${locale}/cart`} className="relative text-sm text-gray-600">
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 rounded-full bg-brand-600 px-1 text-[10px] text-white">
                {itemCount}
              </span>
            )}
          </Link>
          {customer ? (
            <Link href={`/${locale}/account`} className="text-sm text-gray-600 hover:text-gray-900">
              {at("title")}
            </Link>
          ) : (
            <Link href={`/${locale}/auth/login`} className="text-sm text-gray-600 hover:text-gray-900">
              {ct("login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
