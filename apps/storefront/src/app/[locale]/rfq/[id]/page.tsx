"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useRFQ, useAddRFQMessage } from "@/hooks/use-rfq"

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

export default function RFQDetailPage() {
  const t = useTranslations("rfq")
  const params = useParams()
  const id = params.id as string
  const [replyContent, setReplyContent] = useState("")

  const { data: rfq, isLoading } = useRFQ(id)
  const addMessage = useAddRFQMessage()

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    await addMessage.mutateAsync({ rfq_id: id, content: replyContent })
    setReplyContent("")
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    )
  }

  if (!rfq) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-gray-500">{t("notFound")}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* RFQ Info Section */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            {rfq.product_title || t("title")}
          </h1>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusColor(rfq.status)}`}
          >
            {t(`status.${rfq.status}`)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">{t("quantity")}:</span>{" "}
            <span className="text-gray-500">{rfq.quantity ?? "-"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">
              {t("targetPrice")}:
            </span>{" "}
            <span className="text-gray-500">{rfq.target_price || "-"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">
              {t("requirements")}:
            </span>{" "}
            <span className="text-gray-500">
              {rfq.requirements || "-"}
            </span>
          </div>
          {rfq.quoted_price && (
            <div>
              <span className="font-medium text-gray-700">
                {t("quotedPrice")}:
              </span>{" "}
              <span className="font-semibold text-green-600">
                {rfq.quoted_price}
              </span>
            </div>
          )}
          {rfq.quoted_lead_time && (
            <div>
              <span className="font-medium text-gray-700">
                {t("leadTime")}:
              </span>{" "}
              <span className="text-gray-500">{rfq.quoted_lead_time}</span>
            </div>
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t("messages")}
        </h2>

        <div className="mb-6 max-h-96 space-y-3 overflow-y-auto">
          {rfq.messages && rfq.messages.length > 0 ? (
            rfq.messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg p-3 ${
                  msg.sender_type === "buyer"
                    ? "ml-8 bg-brand-50"
                    : msg.sender_type === "seller"
                      ? "mr-8 bg-gray-50"
                      : "bg-yellow-50"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    {msg.sender_type === "buyer"
                      ? t("you")
                      : msg.sender_type === "seller"
                        ? t("seller")
                        : t("system")}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{msg.content}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">{t("noMessages")}</p>
          )}
        </div>

        {/* Reply Form */}
        <form onSubmit={handleReply} className="flex gap-3">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={t("replyPlaceholder")}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={addMessage.isPending || !replyContent.trim()}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {t("reply")}
          </button>
        </form>
      </div>
    </div>
  )
}
