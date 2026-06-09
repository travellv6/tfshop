"use client"

import { useState } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import {
  CheckCircle2,
  CreditCard,
  Landmark,
  Lock,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react"
import { EmptyState } from "@/components/ui/storefront"
import { useCart } from "@/lib/cart-context"
import { sdk } from "@/lib/medusa"
import { fallbackProductImage } from "@/lib/storefront-data"

type FetchResult = Record<string, any>

interface AddressForm {
  email: string
  first_name: string
  last_name: string
  address_1: string
  city: string
  province: string
  postal_code: string
  country_code: string
  phone: string
}

export default function CheckoutPage() {
  const t = useTranslations("checkout")
  const { cart, cartId, refreshCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [address, setAddress] = useState<AddressForm>({
    email: "",
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    province: "",
    postal_code: "",
    country_code: "US",
    phone: "",
  })

  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [selectedShipping, setSelectedShipping] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "bank_transfer"
  >("stripe")

  const stepLabels = [
    t("steps.address"),
    t("steps.shipping"),
    t("steps.payment"),
    t("steps.review"),
  ]

  const countryOptions = [
    ["US", t("countries.US")],
    ["CA", t("countries.CA")],
    ["GB", t("countries.GB")],
    ["DE", t("countries.DE")],
    ["FR", t("countries.FR")],
    ["JP", t("countries.JP")],
    ["CN", t("countries.CN")],
  ] as const

  const updateAddress = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }

  const saveAddress = async () => {
    setIsLoading(true)
    setError("")
    try {
      await sdk.client.fetch<FetchResult>(`/store/carts/${cartId}`, {
        method: "POST",
        body: {
          email: address.email,
          shipping_address: {
            first_name: address.first_name,
            last_name: address.last_name,
            address_1: address.address_1,
            city: address.city,
            province: address.province,
            postal_code: address.postal_code,
            country_code: address.country_code,
            phone: address.phone,
          },
        },
      })
      const result = await sdk.client.fetch<FetchResult>(
        `/store/shipping-options?cart_id=${cartId}`
      )
      setShippingOptions(result.shipping_options || [])
      setStep(2)
    } catch (err: any) {
      setError(err?.message || t("errors.saveAddress"))
    } finally {
      setIsLoading(false)
    }
  }

  const saveShipping = async () => {
    setIsLoading(true)
    setError("")
    try {
      await sdk.client.fetch<FetchResult>(
        `/store/carts/${cartId}/shipping-methods`,
        {
          method: "POST",
          body: { option_id: selectedShipping },
        }
      )
      await refreshCart()
      setStep(3)
    } catch (err: any) {
      setError(err?.message || t("errors.shipping"))
    } finally {
      setIsLoading(false)
    }
  }

  const savePayment = () => {
    setStep(4)
  }

  const completeOrder = async () => {
    setIsLoading(true)
    setError("")
    try {
      if (cart?.payment_collection?.id) {
        await sdk.client.fetch<FetchResult>(
          `/store/payment-collections/${cart.payment_collection.id}/payment-sessions`,
          {
            method: "POST",
            body: {
              provider_id: paymentMethod === "stripe" ? "stripe" : "manual",
            },
          }
        )
      }

      const result = await sdk.client.fetch<FetchResult>(
        `/store/carts/${cartId}/complete`,
        { method: "POST" }
      )
      const order = result.order || result
      if (order?.id) {
        localStorage.removeItem("tfshop_cart_id")
        router.push(`/checkout/success?order_id=${order.id}`)
      } else {
        setError(result.error?.message || t("errors.completion"))
      }
    } catch (err: any) {
      setError(err?.message || t("errors.completeOrder"))
    } finally {
      setIsLoading(false)
    }
  }

  if (!cartId || !cart) {
    return (
      <div className="bg-surface-50">
        <div className="mx-auto max-w-[760px] px-4 py-16 sm:px-6 lg:px-8">
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
      </div>
    )
  }

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="panel mb-6 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                {t("eyebrow")}
              </p>
              <h1 className="font-display text-ink-900 mt-2 text-3xl font-bold">
                {t("title")}
              </h1>
              <p className="text-ink-500 mt-2 max-w-2xl text-sm">
                {t("description")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {stepLabels.map((label, i) => (
                <StepPill
                  key={label}
                  label={label}
                  stepNum={i + 1}
                  currentStep={step}
                />
              ))}
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <main className="panel p-6">
            {step === 1 && (
              <section>
                <SectionTitle
                  icon={<MapPin className="h-5 w-5" />}
                  title={t("shippingAddress")}
                  description={t("shippingAddressDesc")}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label={t("email")}
                    type="email"
                    value={address.email}
                    onChange={(value) => updateAddress("email", value)}
                    placeholder={t("emailPlaceholder")}
                    className="sm:col-span-2"
                  />
                  <FormField
                    label={t("firstName")}
                    value={address.first_name}
                    onChange={(value) => updateAddress("first_name", value)}
                  />
                  <FormField
                    label={t("lastName")}
                    value={address.last_name}
                    onChange={(value) => updateAddress("last_name", value)}
                  />
                  <FormField
                    label={t("address")}
                    value={address.address_1}
                    onChange={(value) => updateAddress("address_1", value)}
                    className="sm:col-span-2"
                  />
                  <FormField
                    label={t("city")}
                    value={address.city}
                    onChange={(value) => updateAddress("city", value)}
                  />
                  <FormField
                    label={t("province")}
                    value={address.province}
                    onChange={(value) => updateAddress("province", value)}
                  />
                  <FormField
                    label={t("postalCode")}
                    value={address.postal_code}
                    onChange={(value) => updateAddress("postal_code", value)}
                  />
                  <div>
                    <label className="text-ink-700 mb-1.5 block text-sm font-bold">
                      {t("country")}
                    </label>
                    <select
                      value={address.country_code}
                      onChange={(e) =>
                        updateAddress("country_code", e.target.value)
                      }
                      className="border-surface-300 text-ink-900 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
                    >
                      {countryOptions.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <FormField
                    label={t("phone")}
                    type="tel"
                    value={address.phone}
                    onChange={(value) => updateAddress("phone", value)}
                    className="sm:col-span-2"
                  />
                </div>
                <ActionBar
                  primaryLabel={isLoading ? t("saving") : t("continueShipping")}
                  onPrimary={saveAddress}
                  primaryDisabled={isLoading}
                />
              </section>
            )}

            {step === 2 && (
              <section>
                <SectionTitle
                  icon={<Truck className="h-5 w-5" />}
                  title={t("shippingMethod")}
                  description={t("shippingMethodDesc")}
                />
                {shippingOptions.length === 0 ? (
                  <div className="border-surface-300 bg-surface-50 text-ink-500 rounded-lg border border-dashed p-8 text-center text-sm">
                    {t("noShippingOptions")}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shippingOptions.map((option: any) => (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition ${
                          selectedShipping === option.id
                            ? "border-brand-500 bg-brand-50 ring-brand-100 ring-2"
                            : "border-surface-200 hover:border-brand-200 bg-white"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={() => setSelectedShipping(option.id)}
                            className="text-brand-700 h-4 w-4"
                          />
                          <span>
                            <span className="text-ink-900 block text-sm font-extrabold">
                              {option.name || option.id}
                            </span>
                            <span className="text-ink-500 text-xs">
                              {t("trackableShipment")}
                            </span>
                          </span>
                        </span>
                        <span className="text-ink-900 text-sm font-extrabold">
                          {option.amount
                            ? formatCurrency(option.amount)
                            : t("free")}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                <ActionBar
                  primaryLabel={isLoading ? t("saving") : t("continuePayment")}
                  onPrimary={saveShipping}
                  primaryDisabled={isLoading || !selectedShipping}
                  secondaryLabel={t("back")}
                  onSecondary={() => setStep(1)}
                />
              </section>
            )}

            {step === 3 && (
              <section>
                <SectionTitle
                  icon={<Lock className="h-5 w-5" />}
                  title={t("paymentMethod")}
                  description={t("paymentMethodDesc")}
                />
                <div className="grid gap-3">
                  <PaymentOption
                    active={paymentMethod === "stripe"}
                    icon={<CreditCard className="h-5 w-5" />}
                    title={t("creditCard")}
                    description={t("creditCardDesc")}
                    onClick={() => setPaymentMethod("stripe")}
                  />
                  <PaymentOption
                    active={paymentMethod === "bank_transfer"}
                    icon={<Landmark className="h-5 w-5" />}
                    title={t("bankTransfer")}
                    description={t("bankTransferDesc")}
                    onClick={() => setPaymentMethod("bank_transfer")}
                  />
                </div>
                <ActionBar
                  primaryLabel={t("reviewOrder")}
                  onPrimary={savePayment}
                  secondaryLabel={t("back")}
                  onSecondary={() => setStep(2)}
                />
              </section>
            )}

            {step === 4 && (
              <section>
                <SectionTitle
                  icon={<PackageCheck className="h-5 w-5" />}
                  title={t("reviewTitle")}
                  description={t("reviewDesc")}
                />

                <div className="border-surface-200 overflow-hidden rounded-lg border">
                  <div className="border-surface-200 bg-surface-50 border-b px-4 py-3">
                    <h3 className="text-ink-900 text-sm font-extrabold">
                      {t("items")}
                    </h3>
                  </div>
                  {(cart?.items || []).map((item: any) => (
                    <div
                      key={item.id}
                      className="border-surface-200 flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
                    >
                      <img
                        src={item.thumbnail || fallbackProductImage}
                        alt={item.title}
                        className="bg-surface-100 h-14 w-14 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-ink-900 truncate text-sm font-extrabold">
                          {item.title}
                        </p>
                        <p className="text-ink-500 text-xs">
                          {t("qty")}: {item.quantity}
                        </p>
                      </div>
                      <p className="text-ink-900 text-sm font-extrabold">
                        {formatCurrency(item.subtotal || 0)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="border-surface-200 rounded-lg border bg-white p-4">
                    <h3 className="text-ink-900 mb-3 text-sm font-extrabold">
                      {t("shippingAddress")}
                    </h3>
                    <p className="text-ink-600 text-sm leading-6">
                      {address.first_name} {address.last_name}
                      <br />
                      {address.address_1}
                      <br />
                      {address.city}, {address.province} {address.postal_code}
                    </p>
                  </div>
                  <div className="border-surface-200 rounded-lg border bg-white p-4">
                    <h3 className="text-ink-900 mb-3 text-sm font-extrabold">
                      {t("payment")}
                    </h3>
                    <p className="text-ink-600 text-sm leading-6">
                      {paymentMethod === "stripe"
                        ? t("creditCardViaStripe")
                        : t("manualBankTransfer")}
                      <br />
                      {t("protectionActive")}
                    </p>
                  </div>
                </div>

                <ActionBar
                  primaryLabel={isLoading ? t("placingOrder") : t("placeOrder")}
                  onPrimary={completeOrder}
                  primaryDisabled={isLoading}
                  secondaryLabel={t("back")}
                  onSecondary={() => setStep(3)}
                />
              </section>
            )}
          </main>

          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}

function StepPill({
  label,
  stepNum,
  currentStep,
}: {
  label: string
  stepNum: number
  currentStep: number
}) {
  const complete = currentStep > stepNum
  const active = currentStep === stepNum

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-extrabold ring-1 ${
        active
          ? "bg-brand-700 ring-brand-700 text-white"
          : complete
          ? "bg-brand-50 text-brand-700 ring-brand-100"
          : "text-ink-400 ring-surface-200 bg-white"
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
          active
            ? "text-brand-700 bg-white"
            : complete
            ? "bg-brand-700 text-white"
            : "bg-surface-100 text-ink-400"
        }`}
      >
        {complete ? <CheckCircle2 className="h-3.5 w-3.5" /> : stepNum}
      </span>
      {label}
    </span>
  )
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <span className="bg-brand-50 text-brand-700 ring-brand-100 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1">
        {icon}
      </span>
      <div>
        <h2 className="text-ink-900 text-xl font-extrabold">{title}</h2>
        <p className="text-ink-500 mt-1 text-sm">{description}</p>
      </div>
    </div>
  )
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className="text-ink-700 mb-1.5 block text-sm font-bold">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-surface-300 text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
      />
    </div>
  )
}

function PaymentOption({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-4 rounded-lg border p-4 text-left transition ${
        active
          ? "border-brand-500 bg-brand-50 ring-brand-100 ring-2"
          : "border-surface-200 hover:border-brand-200 bg-white"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          active ? "bg-brand-700 text-white" : "bg-surface-100 text-ink-500"
        }`}
      >
        {icon}
      </span>
      <span>
        <span className="text-ink-900 block text-sm font-extrabold">
          {title}
        </span>
        <span className="text-ink-500 mt-1 block text-xs leading-5">
          {description}
        </span>
      </span>
    </button>
  )
}

function ActionBar({
  primaryLabel,
  onPrimary,
  primaryDisabled,
  secondaryLabel,
  onSecondary,
}: {
  primaryLabel: string
  onPrimary: () => void
  primaryDisabled?: boolean
  secondaryLabel?: string
  onSecondary?: () => void
}) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      {secondaryLabel && onSecondary && (
        <button type="button" onClick={onSecondary} className="btn-outline">
          {secondaryLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onPrimary}
        disabled={primaryDisabled}
        className="btn-primary"
      >
        {primaryLabel}
      </button>
    </div>
  )
}

function OrderSummary({ cart }: { cart: any }) {
  const t = useTranslations("checkout")
  const protectionItems = [
    t("protectionItems.payment"),
    t("protectionItems.supplier"),
    t("protectionItems.support"),
  ]

  return (
    <aside className="space-y-5">
      <div className="panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-ink-900 text-lg font-extrabold">
            {t("summary")}
          </h2>
          <span className="bg-brand-50 text-brand-700 ring-brand-100 rounded-full px-2.5 py-1 text-xs font-bold ring-1">
            {t("itemsCount", { count: (cart?.items || []).length })}
          </span>
        </div>
        <div className="max-h-[360px] space-y-4 overflow-auto pr-1">
          {(cart?.items || []).map((item: any) => (
            <div key={item.id} className="flex gap-3">
              <img
                src={item.thumbnail || fallbackProductImage}
                alt={item.title}
                className="bg-surface-100 h-14 w-14 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-ink-900 line-clamp-2 text-sm font-bold">
                  {item.title}
                </p>
                <p className="text-ink-500 mt-1 text-xs">
                  {t("qty")} {item.quantity}
                </p>
              </div>
              <p className="text-ink-900 text-sm font-extrabold">
                {formatCurrency(item.subtotal || 0)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-surface-200 mt-5 space-y-3 border-t pt-4 text-sm">
          <TotalLine
            label={t("subtotal")}
            value={formatCurrency(cart?.subtotal || 0)}
          />
          <TotalLine
            label={t("shipping")}
            value={formatCurrency(cart?.shipping_total || 0)}
          />
          <TotalLine
            label={t("tax")}
            value={formatCurrency(cart?.tax_total || 0)}
          />
          <div className="border-surface-200 border-t pt-3">
            <TotalLine
              label={t("total")}
              value={formatCurrency(cart?.total || 0)}
              strong
            />
          </div>
        </div>
      </div>

      <div className="panel p-5">
        <ShieldCheck className="text-brand-700 mb-3 h-7 w-7" />
        <h3 className="text-ink-900 text-sm font-extrabold">
          {t("buyerProtection")}
        </h3>
        <ul className="text-ink-600 mt-3 space-y-2 text-sm">
          {protectionItems.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircle2 className="text-brand-700 h-4 w-4" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

function TotalLine({
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

function formatCurrency(amount: number) {
  return `$${(amount / 100).toFixed(2)}`
}
