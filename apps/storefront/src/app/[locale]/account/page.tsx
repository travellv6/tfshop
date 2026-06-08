"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import {
  ArrowRight,
  MapPinned,
  MessageSquareText,
  PackageCheck,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { useCustomer } from "@/hooks/use-customer"

interface AccountEntry {
  href: string
  Icon: typeof PackageCheck
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
      Icon: PackageCheck,
      labelKey: "myOrders",
      descKey: "myOrdersDesc",
    },
    {
      href: "/rfq",
      Icon: MessageSquareText,
      labelKey: "myInquiries",
      descKey: "myInquiriesDesc",
    },
    {
      href: "/account/addresses",
      Icon: MapPinned,
      labelKey: "myAddresses",
      descKey: "myAddressesDesc",
    },
    {
      href: "/account",
      Icon: Settings,
      labelKey: "accountSettings",
      descKey: "accountSettingsDesc",
    },
  ]

  if (isLoading) {
    return (
      <div className="page-shell">
        <p className="text-ink-500 text-center">{ct("loading")}</p>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="bg-surface-50">
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <div className="panel p-8">
            <UserRound className="text-brand-700 mx-auto mb-4 h-10 w-10" />
            <h1 className="font-display text-ink-900 text-3xl font-bold">
              {t("title")}
            </h1>
            <p className="text-ink-500 mt-3">{t("loginPrompt")}</p>
            <Link href="/auth/login" className="btn-primary mt-6">
              {ct("login")}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const firstName = customer.first_name || ""
  const lastName = customer.last_name || ""
  const displayName =
    [firstName, lastName].filter(Boolean).join(" ") || customer.email

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="panel mb-6 overflow-hidden">
          <div className="grid gap-6 bg-white p-6 lg:grid-cols-[1fr_300px] lg:items-center">
            <div className="flex items-center gap-4">
              <div className="bg-brand-50 text-brand-700 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-extrabold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                  Verified Buyer
                </p>
                <h1 className="font-display text-ink-900 mt-1 text-3xl font-bold">
                  {displayName}
                </h1>
                <p className="text-ink-500 text-sm">{customer.email}</p>
              </div>
            </div>
            <div className="bg-brand-50 rounded-lg p-5">
              <ShieldCheck className="text-brand-700 mb-3 h-7 w-7" />
              <p className="text-ink-900 text-sm font-extrabold">
                Buyer protection active
              </p>
              <p className="text-ink-500 mt-1 text-xs">
                Orders, RFQs, and addresses are connected to your TFShop buyer
                profile.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          {entries.map(({ href, Icon, labelKey, descKey }) => (
            <Link
              key={href + labelKey}
              href={href}
              className="panel hover:border-brand-200 hover:bg-brand-50 group flex items-start gap-4 p-5 transition"
            >
              <span className="bg-brand-50 text-brand-700 ring-brand-100 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-ink-900 group-hover:text-brand-700 block font-extrabold">
                  {t(labelKey)}
                </span>
                <span className="text-ink-500 mt-1 block text-sm">
                  {t(descKey)}
                </span>
              </span>
              <ArrowRight className="text-ink-300 group-hover:text-brand-700 h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
