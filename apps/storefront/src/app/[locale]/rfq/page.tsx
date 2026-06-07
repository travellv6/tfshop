"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { useRFQs } from "@/hooks/use-rfq"
import { RFQForm } from "@/components/rfq/rfq-form"

function statusColor(status: string): string {
  switch (status) {
    case "submitted":
      return "bg-blue-50 text-blue-700"
    case "reviewing":
      return "bg-yellow-50 text-yellow-700"
    case "quoted":
      return "bg-green-50 text-green-700"
    case "negotiating":
      return "bg-orange-50 text-orange-700"
    case "accepted":
      return "bg-emerald-50 text-emerald-700"
    case "rejected":
      return "bg-red-50 text-red-700"
    default:
      return "bg-gray-50 text-gray-700"
  }
}

export default function RFQListPage() {
  const t = useTranslations("rfq")
  const ct = useTranslations("common")
  const { locale } = useParams()
  const searchParams = useSearchParams()
  const { data: rfqs, isLoading } = useRFQs()

  const [showForm, setShowForm] = useState(false)

  // 从 URL 参数预填
  const prefilledProductId = searchParams.get("product_id") || undefined
  const prefilledProductTitle = searchParams.get("product_title") || undefined
  const prefilledVariantId = searchParams.get("variant_id") || undefined
  const prefilledFactoryId = searchParams.get("factory_id") || undefined

  // 如果有 URL 参数且表单未显示，自动打开表单
  const hasPrefill = prefilledProductId || prefilledFactoryId

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("myInquiries")}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          {showForm ? t("cancel") : t("submit")}
        </button>
      </div>

      {/* RFQ 创建表单 */}
      {showForm && (
        <div className="rounded-lg border border-gray-200 p-6">
          <RFQForm
            productId={prefilledProductId}
            productTitle={prefilledProductTitle}
            variantId={prefilledVariantId}
            factoryId={prefilledFactoryId}
          />
        </div>
      )}

      {/* 自动预填提示 */}
      {hasPrefill && !showForm && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
          <p className="text-sm text-brand-700">
            {t("prefillHint")}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {t("openForm")}
          </button>
        </div>
      )}

      {/* RFQ 列表 */}
      {isLoading ? (
        <p className="text-center text-gray-500">{ct("loading")}</p>
      ) : rfqs && rfqs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">{t("product")}</th>
                <th className="px-4 py-3 font-medium">{t("quantity")}</th>
                <th className="px-4 py-3 font-medium">{t("statusLabel")}</th>
                <th className="px-4 py-3 font-medium">{t("quotedPrice")}</th>
                <th className="px-4 py-3 font-medium">{t("createdAt")}</th>
              </tr>
            </thead>
            <tbody>
              {rfqs.map((rfq: any) => (
                <tr key={rfq.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/${locale}/rfq/${rfq.id}`}
                      className="text-brand-600 hover:underline"
                    >
                      {rfq.product_title || t("product")}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{rfq.quantity}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs ${statusColor(rfq.status)}`}>
                      {t(`status.${rfq.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {rfq.quoted_price ? `$${rfq.quoted_price}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(rfq.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">{t("noInquiries")}</p>
      )}
    </div>
  )
}
