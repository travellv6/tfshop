"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  PackageCheck,
  Send,
  ShieldCheck,
} from "lucide-react"
import { useRFQ, useAddRFQMessage } from "@/hooks/use-rfq"
import { StatusPill } from "@/components/ui/storefront"
import { demoRfqs, statusClass } from "@/lib/storefront-data"

export default function RFQDetailPage() {
  const t = useTranslations("rfq")
  const params = useParams()
  const id = params.id as string
  const [replyContent, setReplyContent] = useState("")

  const { data: rfqData, isLoading } = useRFQ(id)
  const addMessage = useAddRFQMessage()

  const fallback = useMemo(() => {
    const listItem = demoRfqs().find((item) => item.id === id) || demoRfqs()[0]
    return {
      ...listItem,
      product_id: null,
      variant_id: null,
      factory_id: null,
      customer_email: "buyer@example.com",
      target_price: "$1.45 - $1.85",
      requirements:
        "Please quote EXW and FOB Shenzhen pricing for mixed color cartons with EN71/CPC documents.",
      quoted_lead_time: "18-25 days",
      quoted_terms: "30% deposit, 70% before shipment",
      updated_at: listItem.created_at,
      messages: [
        {
          id: "m1",
          rfq_id: listItem.id,
          sender_type: "buyer" as const,
          content:
            "We are looking for a first test order with sample approval before mass production.",
          created_at: listItem.created_at,
        },
        {
          id: "m2",
          rfq_id: listItem.id,
          sender_type: "seller" as const,
          content:
            "Thanks. We can support samples within 5 days and provide EN71/CPC files with the quote.",
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
    }
  }, [id])

  const rfq = rfqData || fallback

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    await addMessage.mutateAsync({ rfq_id: id, content: replyContent })
    setReplyContent("")
  }

  if (isLoading && !rfq) {
    return (
      <div className="page-shell">
        <p className="text-ink-500">{t("loading")}</p>
      </div>
    )
  }

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/rfq"
          className="text-brand-700 mb-5 inline-flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          RFQ Center
        </Link>

        <section className="panel mb-5 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                Inquiry #{rfq.id.slice(-8)}
              </p>
              <h1 className="font-display text-ink-900 mt-2 text-3xl font-bold">
                {rfq.product_title || t("title")}
              </h1>
              <p className="text-ink-500 mt-2 max-w-2xl text-sm">
                {rfq.requirements || "No detailed requirements provided yet."}
              </p>
            </div>
            <StatusPill className={statusClass(rfq.status)}>
              {t(`status.${rfq.status}`)}
            </StatusPill>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              icon={<PackageCheck className="h-5 w-5" />}
              label={t("quantity")}
              value={
                rfq.quantity ? `${rfq.quantity.toLocaleString()} pcs` : "-"
              }
            />
            <Metric
              icon={<Clock3 className="h-5 w-5" />}
              label={t("leadTime")}
              value={rfq.quoted_lead_time || "-"}
            />
            <Metric
              icon={<CheckCircle2 className="h-5 w-5" />}
              label={t("quotedPrice")}
              value={rfq.quoted_price || rfq.target_price || "-"}
            />
            <Metric
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Terms"
              value={rfq.quoted_terms || "Pending"}
            />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="panel overflow-hidden">
            <div className="border-surface-200 flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-ink-900 text-lg font-extrabold">
                  {t("messages")}
                </h2>
                <p className="text-ink-500 text-sm">
                  Buyer and supplier conversation
                </p>
              </div>
              <MessageSquareText className="text-brand-700 h-5 w-5" />
            </div>

            <div className="bg-surface-50 max-h-[520px] space-y-4 overflow-y-auto p-5">
              {rfq.messages?.length ? (
                rfq.messages.map((msg) => {
                  const isBuyer = msg.sender_type === "buyer"
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isBuyer ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`shadow-soft max-w-[80%] rounded-lg p-4 ${
                          isBuyer
                            ? "bg-brand-700 text-white"
                            : msg.sender_type === "seller"
                            ? "text-ink-700 bg-white"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between gap-4 text-xs font-bold opacity-80">
                          <span>
                            {isBuyer
                              ? t("you")
                              : msg.sender_type === "seller"
                              ? t("seller")
                              : t("system")}
                          </span>
                          <span>
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-ink-400 text-sm">{t("noMessages")}</p>
              )}
            </div>

            <form
              onSubmit={handleReply}
              className="border-surface-200 flex gap-3 border-t bg-white p-4"
            >
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={t("replyPlaceholder")}
                className="input-field flex-1"
              />
              <button
                type="submit"
                disabled={addMessage.isPending || !replyContent.trim()}
                className="btn-primary gap-2 px-5"
              >
                <Send className="h-4 w-4" />
                {t("reply")}
              </button>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="panel p-5">
              <h3 className="text-ink-900 text-lg font-extrabold">
                Quote Snapshot
              </h3>
              <div className="mt-4 space-y-3 text-sm">
                <Info
                  label={t("targetPrice")}
                  value={rfq.target_price || "-"}
                />
                <Info
                  label={t("quotedPrice")}
                  value={rfq.quoted_price || "-"}
                />
                <Info
                  label={t("leadTime")}
                  value={rfq.quoted_lead_time || "-"}
                />
                <Info
                  label="Updated"
                  value={new Date(rfq.updated_at).toLocaleDateString()}
                />
              </div>
            </div>
            <div className="border-brand-100 bg-brand-50 rounded-lg border p-5">
              <ShieldCheck className="text-brand-700 mb-3 h-6 w-6" />
              <h3 className="text-ink-900 font-extrabold">Buyer Protection</h3>
              <p className="text-ink-600 mt-2 text-sm">
                Confirm samples, certificates, payment terms, and shipping
                before accepting the final quote.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="border-surface-200 bg-surface-50 rounded-lg border p-4">
      <div className="text-brand-700 mb-3">{icon}</div>
      <p className="text-ink-400 text-xs font-bold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-ink-900 mt-1 text-sm font-extrabold">{value}</p>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-surface-200 flex items-center justify-between gap-4 border-b pb-3 last:border-b-0">
      <span className="text-ink-500">{label}</span>
      <strong className="text-ink-900 text-right">{value}</strong>
    </div>
  )
}
