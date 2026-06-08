"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useCart } from "@/lib/cart-context"
import { useCustomer } from "@/hooks/use-customer"
import { useState } from "react"

export function Header() {
  const t = useTranslations("nav")
  const ct = useTranslations("common")
  const at = useTranslations("account")
  const { itemCount } = useCart()
  const { data: customer } = useCustomer()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { href: "/products", label: t("products") },
    { href: "/factories", label: t("factories") },
    { href: "/rfq", label: t("rfq") },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-lg text-white shadow-soft">
            🧸
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink-900">
            TFShop
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 font-body text-sm font-medium text-ink-600 transition-colors hover:bg-surface-100 hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-surface-100"
          >
            <svg
              className="h-5 w-5 text-ink-700"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-[10px] font-bold text-white shadow-coral">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {customer ? (
            <Link
              href="/account"
              className="hidden items-center gap-2 rounded-xl border border-surface-200 px-4 py-2 font-body text-sm font-medium text-ink-700 transition-all hover:border-brand-300 hover:bg-brand-50 sm:flex"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {(customer.first_name || customer.email)[0].toUpperCase()}
              </span>
              {at("title")}
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="hidden rounded-xl bg-ink-900 px-4 py-2 font-body text-sm font-semibold text-white transition-all hover:bg-ink-800 sm:block"
            >
              {ct("login")}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-surface-100 md:hidden"
            aria-label="Menu"
          >
            <svg className="h-5 w-5 text-ink-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-surface-200 bg-white px-4 py-3 md:hidden animate-slide-up">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 font-body text-sm font-medium text-ink-600 transition-colors hover:bg-surface-100"
              >
                {item.label}
              </Link>
            ))}
            {customer ? (
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 font-body text-sm font-medium text-ink-600 transition-colors hover:bg-surface-100"
              >
                {at("title")}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 font-body text-sm font-medium text-ink-600 transition-colors hover:bg-surface-100"
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
