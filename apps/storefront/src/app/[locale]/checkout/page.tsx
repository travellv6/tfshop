"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { useCart } from "@/lib/cart-context"
import { sdk } from "@/lib/medusa"

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

const STEP_LABELS = ["Address", "Shipping", "Payment", "Review"] as const

export default function CheckoutPage() {
  const { cart, cartId, refreshCart } = useCart()
  const router = useRouter()
  const locale = useLocale()
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
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "bank_transfer">(
    "stripe"
  )

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
      setError(err?.message || "Failed to save address")
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
      setError(err?.message || "Failed to add shipping method")
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
              provider_id:
                paymentMethod === "stripe" ? "stripe" : "manual",
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
        setError(result.error?.message || "Order completion failed")
      }
    } catch (err: any) {
      setError(err?.message || "Failed to complete order")
    } finally {
      setIsLoading(false)
    }
  }

  if (!cartId || !cart) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold">Checkout</h1>

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-2">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1
          const isActive = step === stepNum
          const isComplete = step > stepNum
          return (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className={`h-px w-8 ${
                    isComplete ? "bg-brand-600" : "bg-gray-300"
                  }`}
                />
              )}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  isActive
                    ? "bg-brand-600 text-white"
                    : isComplete
                      ? "bg-brand-100 text-brand-700"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isComplete ? "✓" : stepNum}
              </div>
              <span
                className={`text-sm ${
                  isActive
                    ? "font-medium text-gray-900"
                    : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Address */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={address.email}
                onChange={(e) => updateAddress("email", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={address.first_name}
                onChange={(e) => updateAddress("first_name", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={address.last_name}
                onChange={(e) => updateAddress("last_name", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={address.address_1}
                onChange={(e) => updateAddress("address_1", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => updateAddress("city", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                State / Province
              </label>
              <input
                type="text"
                value={address.province}
                onChange={(e) => updateAddress("province", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                value={address.postal_code}
                onChange={(e) => updateAddress("postal_code", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                value={address.country_code}
                onChange={(e) => updateAddress("country_code", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="JP">Japan</option>
                <option value="CN">China</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={address.phone}
                onChange={(e) => updateAddress("phone", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
          <button
            onClick={saveAddress}
            disabled={isLoading}
            className="w-full rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Continue to Shipping"}
          </button>
        </div>
      )}

      {/* Step 2: Shipping */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Shipping Method</h2>
          {shippingOptions.length === 0 ? (
            <p className="text-gray-500">
              No shipping options available for your region.
            </p>
          ) : (
            <div className="space-y-3">
              {shippingOptions.map((option: any) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 ${
                    selectedShipping === option.id
                      ? "border-brand-600 bg-brand-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={selectedShipping === option.id}
                      onChange={() => setSelectedShipping(option.id)}
                      className="h-4 w-4 text-brand-600"
                    />
                    <span className="text-sm font-medium">
                      {option.name || option.id}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {option.amount
                      ? `$${(option.amount / 100).toFixed(2)}`
                      : "Free"}
                  </span>
                </label>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="rounded-lg border px-6 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={saveShipping}
              disabled={isLoading || !selectedShipping}
              className="flex-1 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Continue to Payment"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Payment Method</h2>
          <div className="space-y-3">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                paymentMethod === "stripe"
                  ? "border-brand-600 bg-brand-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={() => setPaymentMethod("stripe")}
                className="h-4 w-4 text-brand-600"
              />
              <div>
                <span className="text-sm font-medium">Credit Card</span>
                <p className="text-xs text-gray-500">
                  Pay securely with Stripe
                </p>
              </div>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                paymentMethod === "bank_transfer"
                  ? "border-brand-600 bg-brand-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="bank_transfer"
                checked={paymentMethod === "bank_transfer"}
                onChange={() => setPaymentMethod("bank_transfer")}
                className="h-4 w-4 text-brand-600"
              />
              <div>
                <span className="text-sm font-medium">Bank Transfer</span>
                <p className="text-xs text-gray-500">
                  Pay via bank transfer (manual)
                </p>
              </div>
            </label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="rounded-lg border px-6 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={savePayment}
              className="flex-1 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Review Order
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Review Your Order</h2>

          {/* Cart items */}
          <div className="rounded-lg border">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-medium">Items</h3>
            </div>
            {(cart?.items || []).map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
              >
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-10 w-10 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  ${((item.subtotal || 0) / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="rounded-lg border p-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${((cart?.subtotal || 0) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  ${((cart?.shipping_total || 0) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-1 font-semibold">
                <span>Total</span>
                <span>${((cart?.total || 0) / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address summary */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Shipping Address</h3>
            <p className="text-sm text-gray-600">
              {address.first_name} {address.last_name}
            </p>
            <p className="text-sm text-gray-600">{address.address_1}</p>
            <p className="text-sm text-gray-600">
              {address.city}, {address.province} {address.postal_code}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="rounded-lg border px-6 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={completeOrder}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
