"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useCart } from "@/lib/cart-context"
import { useCustomer } from "@/hooks/use-customer"
import { useState } from "react"
import {
  Bell,
  Camera,
  ChevronDown,
  Factory,
  Globe2,
  Heart,
  HelpCircle,
  Menu,
  Search,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  WalletCards,
} from "lucide-react"

export function Header() {
  const t = useTranslations("nav")
  const ht = useTranslations("header")
  const ct = useTranslations("common")
  const at = useTranslations("account")
  const { itemCount } = useCart()
  const { data: customer } = useCustomer()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/factories", label: t("factories") },
    { href: "/products", label: t("newArrivals") },
    { href: "/products", label: t("lowMoq") },
    { href: "/products", label: t("readyToShip") },
    { href: "/rfq", label: t("rfq") },
  ]

  return (
    <header className="border-surface-200 sticky top-0 z-50 border-b bg-white/95 backdrop-blur-xl">
      <div className="border-surface-100 text-ink-700 hidden border-b bg-white text-xs font-medium lg:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-2">
          <div className="flex items-center gap-8">
            <span className="inline-flex items-center gap-2">
              <Globe2 className="h-3.5 w-3.5" /> {ht("shipsWorldwide")}
            </span>
            <span className="inline-flex items-center gap-2">
              <PackageIcon /> {ht("lowMoq")}
            </span>
            <span className="inline-flex items-center gap-2">
              <Factory className="h-3.5 w-3.5" /> {ht("factoryPricing")}
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" /> {ht("securePayments")}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/factories" className="hover:text-brand-700">
              {ht("forSuppliers")}
            </Link>
            <span className="inline-flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" /> {ht("helpCenter")}
            </span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
          <span className="text-brand-700 block text-2xl font-extrabold leading-none tracking-tight sm:text-3xl">
            TFShop
          </span>
          <span className="text-brand-700 hidden text-[11px] font-semibold sm:block">
            {ct("brandTagline")}
          </span>
        </Link>

        <button className="btn-ghost bg-surface-100 hidden gap-2 px-4 lg:inline-flex">
          <Menu className="h-4 w-4" />
          {ht("categories")}
        </button>

        <div className="relative hidden flex-1 lg:block">
          <input
            className="border-surface-300 focus:border-brand-600 focus:ring-brand-100 h-12 w-full rounded-lg border bg-white pl-5 pr-24 text-sm outline-none transition focus:ring-2"
            placeholder={ht("searchPlaceholder")}
          />
          <button className="bg-brand-700 hover:bg-brand-800 absolute right-0 top-0 flex h-12 w-14 items-center justify-center rounded-r-lg text-white">
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <button className="border-surface-200 text-ink-400 absolute right-14 top-0 hidden h-12 w-12 items-center justify-center border-l xl:flex">
            <Camera className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/rfq" className="btn-ghost hidden gap-2 lg:inline-flex">
            <WalletCards className="h-4 w-4" />
            {ht("rfq")}
          </Link>
          <button className="btn-ghost relative hidden h-10 w-10 p-0 lg:inline-flex">
            <Bell className="h-5 w-5" />
            <span className="bg-coral-500 absolute -right-1 -top-1 rounded-full px-1.5 text-[10px] font-bold text-white">
              3
            </span>
          </button>
          <button className="btn-ghost hidden h-10 w-10 p-0 lg:inline-flex">
            <Heart className="h-5 w-5" />
          </button>
          <Link href="/cart" className="btn-ghost relative h-10 w-10 p-0">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="bg-coral-500 shadow-coral absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          {customer ? (
            <Link
              href="/account"
              className="border-surface-200 text-ink-800 hover:border-brand-200 hover:bg-brand-50 hidden items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-semibold transition sm:flex"
            >
              <span className="bg-surface-100 text-brand-700 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
                {(customer.first_name || customer.email)[0].toUpperCase()}
              </span>
              <span className="hidden xl:inline">{at("title")}</span>
              <ChevronDown className="hidden h-4 w-4 xl:block" />
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="bg-ink-900 hover:bg-ink-800 hidden rounded-lg px-4 py-2 text-sm font-semibold text-white transition sm:block"
            >
              {ct("login")}
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="hover:bg-surface-100 flex h-10 w-10 items-center justify-center rounded-lg transition-colors lg:hidden"
            aria-label={ht("menu")}
          >
            <Menu className="text-ink-700 h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="border-surface-100 hidden border-t bg-white lg:block">
        <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-6 py-2">
          {navItems.map((item, i) => (
            <Link
              key={`${item.href}-${item.label}-${i}`}
              href={item.href}
              className="text-ink-700 hover:bg-surface-100 hover:text-brand-700 rounded-lg px-4 py-2 text-sm font-semibold transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="animate-slide-up border-surface-200 border-t bg-white px-4 py-3 lg:hidden">
          <div className="relative mb-3">
            <input
              className="border-surface-300 focus:border-brand-600 h-11 w-full rounded-lg border bg-white pl-4 pr-11 text-sm outline-none"
              placeholder={ht("mobileSearchPlaceholder")}
            />
            <Search className="text-ink-400 absolute right-3 top-3 h-5 w-5" />
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-body text-ink-600 hover:bg-surface-100 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {customer ? (
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="font-body text-ink-600 hover:bg-surface-100 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
              >
                {at("title")}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="font-body text-ink-600 hover:bg-surface-100 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
              >
                {ct("login")}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

function PackageIcon() {
  return <ShoppingCart className="h-3.5 w-3.5" />
}
