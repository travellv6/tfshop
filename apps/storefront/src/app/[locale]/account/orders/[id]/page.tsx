"use client"

import { useParams } from "next/navigation"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ArrowLeft, MapPin, PackageCheck, ReceiptText } from "lucide-react"
import { useOrder } from "@/hooks/use-order"
import { StatusPill } from "@/components/ui/storefront"
import { fallbackProductImage } from "@/lib/storefront-data"
import { formatStorefrontDate } from "@/lib/format"

export default function OrderDetailPage() {
  const t = useTranslations("orderDetail")
  const ct = useTranslations("common")
  const { id } = useParams()
  const { data: order, isLoading } = useOrder(id as string)

  if (isLoading) {
    return (
      <div className="page-shell">
        <p className="text-ink-500 py-20 text-center">{ct("loading")}</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="page-shell">
        <div className="panel p-10 text-center">
          <p className="text-ink-500">{t("notFound")}</p>
          <Link href="/account/orders" className="btn-primary mt-5">
            {t("back")}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[980px] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/account/orders"
          className="text-brand-700 mb-5 inline-flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Link>

        <section className="panel mb-5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                {t("eyebrow")}
              </p>
              <h1 className="font-display text-ink-900 mt-2 text-3xl font-bold">
                {t("orderNumber", {
                  id: order.display_id || order.id.slice(-8),
                })}
              </h1>
              <p className="text-ink-500 mt-1 text-sm">
                {t("placedOn", {
                  date: formatStorefrontDate(order.created_at),
                })}
              </p>
            </div>
            <StatusPill className="bg-brand-50 text-brand-700 ring-brand-100">
              {order.status || t("processing")}
            </StatusPill>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <section className="panel p-5">
            <h2 className="text-ink-900 mb-4 flex items-center gap-2 text-lg font-extrabold">
              <PackageCheck className="text-brand-700 h-5 w-5" />
              {t("items")}
            </h2>
            <div className="divide-surface-200 divide-y">
              {(order.items || []).map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <img
                    src={item.thumbnail || fallbackProductImage}
                    alt={item.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-ink-900 font-bold">{item.title}</p>
                    <p className="text-ink-500 text-sm">
                      {t("qty")}: {item.quantity}
                    </p>
                  </div>
                  <p className="text-ink-900 font-extrabold">
                    $
                    {(
                      (item.subtotal || item.unit_price * item.quantity) / 100
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            {order.shipping_address && (
              <div className="panel p-5">
                <h2 className="text-ink-900 mb-3 flex items-center gap-2 text-sm font-extrabold">
                  <MapPin className="text-brand-700 h-4 w-4" />
                  {t("shippingAddress")}
                </h2>
                <p className="text-ink-600 text-sm">
                  {order.shipping_address.first_name}{" "}
                  {order.shipping_address.last_name}
                </p>
                <p className="text-ink-600 text-sm">
                  {order.shipping_address.address_1}
                </p>
                <p className="text-ink-600 text-sm">
                  {order.shipping_address.city}
                  {order.shipping_address.province &&
                    `, ${order.shipping_address.province}`}{" "}
                  {order.shipping_address.postal_code}
                </p>
              </div>
            )}

            <div className="panel p-5">
              <h2 className="text-ink-900 mb-4 flex items-center gap-2 text-sm font-extrabold">
                <ReceiptText className="text-brand-700 h-4 w-4" />
                {t("totals")}
              </h2>
              <div className="space-y-3 text-sm">
                <Line
                  label={t("subtotal")}
                  value={`$${((order.subtotal || 0) / 100).toFixed(2)}`}
                />
                <Line
                  label={t("shipping")}
                  value={`$${((order.shipping_total || 0) / 100).toFixed(2)}`}
                />
                <Line
                  label={t("tax")}
                  value={`$${((order.tax_total || 0) / 100).toFixed(2)}`}
                />
                <div className="border-surface-200 border-t pt-3">
                  <Line
                    label={t("total")}
                    value={`$${((order.total || 0) / 100).toFixed(2)}`}
                    strong
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Line({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className={strong ? "text-ink-900 font-extrabold" : "text-ink-500"}>
        {label}
      </span>
      <span
        className={
          strong ? "text-ink-900 font-extrabold" : "text-ink-900 font-bold"
        }
      >
        {value}
      </span>
    </div>
  )
}
