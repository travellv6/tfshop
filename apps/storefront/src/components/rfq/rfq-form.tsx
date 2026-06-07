"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useCreateRFQ } from "@/hooks/use-rfq"

interface RFQFormProps {
  productId?: string
  productTitle?: string
  variantId?: string
  factoryId?: string
  customerEmail?: string
}

export function RFQForm({
  productId,
  productTitle,
  variantId,
  factoryId,
  customerEmail,
}: RFQFormProps) {
  const t = useTranslations("rfq")
  const [quantity, setQuantity] = useState("")
  const [targetPrice, setTargetPrice] = useState("")
  const [requirements, setRequirements] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const createRFQ = useCreateRFQ()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createRFQ.mutateAsync({
      product_id: productId,
      product_title: productTitle,
      variant_id: variantId,
      factory_id: factoryId,
      customer_email: customerEmail,
      quantity: Number(quantity),
      target_price: targetPrice,
      notes: requirements,
      requirements: {},
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-medium text-green-800">{t("success")}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t("product")}
        </label>
        <p className="mt-1 text-sm text-gray-500">{productTitle}</p>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          {t("quantity")}
        </label>
        <input
          id="quantity"
          type="number"
          min={1}
          required
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div>
        <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-700">
          {t("targetPrice")}
        </label>
        <input
          id="targetPrice"
          type="text"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          placeholder="e.g. $5.00/pc"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div>
        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
          {t("requirements")}
        </label>
        <textarea
          id="requirements"
          rows={4}
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder={t("requirementsPlaceholder")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <button
        type="submit"
        disabled={createRFQ.isPending}
        className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {createRFQ.isPending ? t("submitting") : t("submit")}
      </button>
    </form>
  )
}
