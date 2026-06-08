"use client"

import { useState } from "react"
import { Link } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquareText,
  PackageCheck,
  Plus,
  ShieldCheck,
} from "lucide-react"
import { useRFQs } from "@/hooks/use-rfq"
import { RFQForm } from "@/components/rfq/rfq-form"
import { useCustomer } from "@/hooks/use-customer"
import { StatusPill } from "@/components/ui/storefront"
import { demoRfqs, statusClass } from "@/lib/storefront-data"
import { formatStorefrontDate, formatStorefrontNumber } from "@/lib/format"

export default function RFQListPage() {
  const t = useTranslations("rfq")
  const ct = useTranslations("common")
  const searchParams = useSearchParams()
  const { data: rfqsData, isLoading } = useRFQs()
  const { data: customer } = useCustomer()

  const [showForm, setShowForm] = useState(false)

  const prefilledProductId = searchParams.get("product_id") || undefined
  const prefilledProductTitle = searchParams.get("product_title") || undefined
  const prefilledVariantId = searchParams.get("variant_id") || undefined
  const prefilledFactoryId = searchParams.get("factory_id") || undefined
  const hasPrefill = prefilledProductId || prefilledFactoryId
  const rfqs = rfqsData?.length ? rfqsData : demoRfqs()

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-5 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="panel p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                  RFQ Center
                </p>
                <h1 className="font-display text-ink-900 mt-2 text-3xl font-bold">
                  {t("myInquiries")}
                </h1>
                <p className="text-ink-500 mt-2 max-w-2xl text-sm">
                  Compare quotes, message suppliers, and keep each sourcing
                  project moving from request to accepted terms.
                </p>
              </div>
              <button
                onClick={() => setShowForm((value) => !value)}
                className="btn-primary gap-2"
              >
                <Plus className="h-4 w-4" />
                {showForm ? t("cancel") : t("submit")}
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[
                ["Active RFQs", rfqs.length.toString(), FileText],
                ["Unread Quotes", "3", MessageSquareText],
                ["Avg. Response", "< 6h", Clock3],
                ["Protected", "100%", ShieldCheck],
              ].map(([label, value, Icon]) => (
                <div
                  key={label as string}
                  className="border-surface-200 bg-surface-50 rounded-lg border p-4"
                >
                  <Icon className="text-brand-700 mb-3 h-5 w-5" />
                  <p className="text-ink-900 text-2xl font-extrabold">
                    {value as string}
                  </p>
                  <p className="text-ink-500 mt-1 text-xs font-semibold">
                    {label as string}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel bg-brand-700 p-6 text-white">
            <PackageCheck className="text-brand-100 mb-4 h-8 w-8" />
            <h2 className="text-xl font-extrabold">Trade Assurance</h2>
            <p className="text-brand-100 mt-2 text-sm">
              RFQs are only sent to selected suppliers. Payments, quality, and
              delivery can be protected through TFShop buyer support.
            </p>
            <div className="mt-5 space-y-2 text-sm font-semibold">
              {[
                "Secure payments",
                "Quality guaranteed",
                "On-time delivery",
              ].map((item) => (
                <p key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="text-brand-100 h-4 w-4" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        {hasPrefill && !showForm && (
          <div className="border-brand-200 bg-brand-50 mb-5 rounded-lg border p-4">
            <p className="text-brand-800 text-sm font-semibold">
              {t("prefillHint")}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-700 hover:bg-brand-800 mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white"
            >
              {t("openForm")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {showForm && (
          <div className="panel mb-5 p-6">
            <div className="mb-5">
              <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                New sourcing request
              </p>
              <h2 className="text-ink-900 mt-1 text-xl font-extrabold">
                Tell suppliers what you need
              </h2>
            </div>
            <RFQForm
              productId={prefilledProductId}
              productTitle={prefilledProductTitle}
              variantId={prefilledVariantId}
              factoryId={prefilledFactoryId}
              customerEmail={customer?.email}
            />
          </div>
        )}

        <div className="panel overflow-hidden">
          <div className="border-surface-200 flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="text-ink-900 text-lg font-extrabold">
                Inquiry Pipeline
              </h2>
              <p className="text-ink-500 text-sm">
                {rfqs.length} active sourcing conversations
              </p>
            </div>
            <Link
              href="/products"
              className="btn-outline hidden sm:inline-flex"
            >
              Add products
            </Link>
          </div>

          {isLoading && !rfqs.length ? (
            <p className="text-ink-500 p-8 text-center">{ct("loading")}</p>
          ) : rfqs.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-surface-50 text-ink-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-5 py-3 font-bold">{t("product")}</th>
                    <th className="px-5 py-3 font-bold">{t("quantity")}</th>
                    <th className="px-5 py-3 font-bold">{t("statusLabel")}</th>
                    <th className="px-5 py-3 font-bold">{t("quotedPrice")}</th>
                    <th className="px-5 py-3 font-bold">{t("createdAt")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rfqs.map((rfq: any) => (
                    <tr
                      key={rfq.id}
                      className="border-surface-200 hover:bg-brand-50/40 border-t bg-white transition"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/rfq/${rfq.id}`}
                          className="text-ink-900 hover:text-brand-700 font-extrabold"
                        >
                          {rfq.product_title || t("product")}
                        </Link>
                      </td>
                      <td className="text-ink-700 px-5 py-4 font-semibold">
                        {typeof rfq.quantity === "number"
                          ? formatStorefrontNumber(rfq.quantity)
                          : rfq.quantity || "-"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill className={statusClass(rfq.status)}>
                          {t(`status.${rfq.status}`)}
                        </StatusPill>
                      </td>
                      <td className="text-ink-900 px-5 py-4 font-semibold">
                        {rfq.quoted_price || "-"}
                      </td>
                      <td className="text-ink-500 px-5 py-4">
                        {formatStorefrontDate(rfq.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-ink-500 p-8 text-center">
              {t("noInquiries")}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
