"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { PackageCheck, ShoppingCart, Truck } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { CartItemRow } from "@/components/cart/cart-item"
import { EmptyState } from "@/components/ui/storefront"

export default function CartPage() {
  const t = useTranslations("cart")
  const { cart, isLoading, updateItemQuantity, removeItem, itemCount } =
    useCart()

  const subtotal = cart?.subtotal || 0
  const shipping = cart?.shipping_total || 0
  const total = cart?.total || subtotal + shipping

  if (!cart || itemCount === 0) {
    return (
      <div className="page-shell">
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDesc")}
          action={
            <Link href="/products" className="btn-primary">
              {t("browseProducts")}
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
            {t("eyebrow")}
          </p>
          <h1 className="font-display text-ink-900 mt-2 text-3xl font-bold">
            {t("title")}
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="panel p-5">
            {cart.items?.map((item: any) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={updateItemQuantity}
                onRemove={removeItem}
                isUpdating={isLoading}
              />
            ))}
          </section>

          <aside className="space-y-4">
            <div className="panel p-5">
              <ShoppingCart className="text-brand-700 mb-3 h-6 w-6" />
              <h2 className="text-ink-900 text-lg font-extrabold">
                {t("summary")}
              </h2>
              <div className="mt-5 space-y-3 text-sm">
                <SummaryLine
                  label={t("subtotal")}
                  value={`$${(subtotal / 100).toFixed(2)}`}
                />
                <SummaryLine
                  label={t("shipping")}
                  value={
                    shipping > 0
                      ? `$${(shipping / 100).toFixed(2)}`
                      : t("calculatedAtCheckout")
                  }
                />
                <div className="border-surface-200 border-t pt-3">
                  <SummaryLine
                    label={t("total")}
                    value={`$${(total / 100).toFixed(2)}`}
                    strong
                  />
                </div>
              </div>
              <Link href="/checkout" className="btn-primary mt-5 w-full">
                {t("checkout")}
              </Link>
            </div>
            <div className="border-brand-100 bg-brand-50 rounded-lg border p-5">
              <div className="flex items-center gap-3">
                <PackageCheck className="text-brand-700 h-5 w-5" />
                <p className="text-ink-900 text-sm font-extrabold">
                  {t("assurance")}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Truck className="text-brand-700 h-5 w-5" />
                <p className="text-ink-600 text-sm">{t("freightNote")}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function SummaryLine({
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
