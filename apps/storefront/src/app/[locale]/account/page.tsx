"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useCustomer } from "@/hooks/use-customer"

// 功能入口配置
interface AccountEntry {
  href: string
  icon: string
  labelKey: string
  descKey: string
}

export default function AccountPage() {
  const t = useTranslations("account")
  const ct = useTranslations("common")
  const { data: customer, isLoading } = useCustomer()

  const entries: AccountEntry[] = [
    {
      href: "/account/orders",
      icon: "📦",
      labelKey: "myOrders",
      descKey: "myOrdersDesc",
    },
    {
      href: "/rfq",
      icon: "💬",
      labelKey: "myInquiries",
      descKey: "myInquiriesDesc",
    },
    {
      href: "/account/addresses",
      icon: "📍",
      labelKey: "myAddresses",
      descKey: "myAddressesDesc",
    },
    {
      href: "/account/settings",
      icon: "⚙️",
      labelKey: "accountSettings",
      descKey: "accountSettingsDesc",
    },
  ]

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-gray-500">{ct("loading")}</p>
      </div>
    )
  }

  // 未登录
  if (!customer) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold">{t("title")}</h1>
        <p className="mb-6 text-gray-500">{t("loginPrompt")}</p>
        <Link
          href="/auth/login"
          className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          {ct("login")}
        </Link>
      </div>
    )
  }

  // 已登录
  const firstName = customer.first_name || ""
  const lastName = customer.last_name || ""
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || customer.email

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* 用户信息卡 */}
      <div className="rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold">{displayName}</h1>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
        </div>
      </div>

      {/* 功能入口网格 */}
      <div className="grid grid-cols-2 gap-4">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="group rounded-lg border border-gray-200 p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-2 text-2xl">{entry.icon}</div>
            <h3 className="font-medium text-gray-900 group-hover:text-brand-600">
              {t(entry.labelKey)}
            </h3>
            <p className="mt-1 text-xs text-gray-500">{t(entry.descKey)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
