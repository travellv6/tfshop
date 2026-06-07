"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useRFQs } from "@/hooks/use-rfq"

const statusColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "bg-blue-100 text-blue-800"
    case "reviewing":
      return "bg-yellow-100 text-yellow-800"
    case "quoted":
      return "bg-purple-100 text-purple-800"
    case "negotiating":
      return "bg-orange-100 text-orange-800"
    case "accepted":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function RFQListPage() {
  const t = useTranslations("rfq")
  const locale = useParams().locale as string
  const { data: rfqs, isLoading } = useRFQs()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {t("myInquiries")}
      </h1>

      {isLoading && (
        <p className="text-gray-500">{t("loading")}</p>
      )}

      {rfqs && rfqs.length === 0 && (
        <p className="text-gray-500">{t("noInquiries")}</p>
      )}

      {rfqs && rfqs.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t("product")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t("quantity")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t("statusLabel")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t("quotedPrice")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t("createdAt")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rfqs.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <Link
                      href={`/${locale}/rfq/${rfq.id}`}
                      className="text-brand-600 hover:text-brand-800"
                    >
                      {rfq.product_title || "-"}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {rfq.quantity ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(rfq.status)}`}
                    >
                      {t(`status.${rfq.status}`)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {rfq.quoted_price || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(rfq.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
