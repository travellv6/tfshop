# Phase 3B: Storefront — RFQ Center, Buyer Tier Display, Logistics Tracking

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Add the RFQ (询价) buyer experience to the storefront — inquiry forms, communication center, and basic logistics tracking. Uses the RFQ Store API from Phase 3A.

**Architecture:** Extend `apps/storefront/` with RFQ hooks, inquiry form on product detail page, and dedicated RFQ center pages.

**Tech Stack:** Next.js 14, next-intl, @tanstack/react-query, Tailwind CSS

**Depends on:** Phase 3A (RFQ Store API)

---

## Task 1: Create RFQ Data Hooks

**File: `apps/storefront/src/hooks/use-rfq.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

export interface RFQItem {
  id: string
  product_title: string | null
  status: string
  quantity: number | null
  quoted_price: string | null
  created_at: string
}

export interface RFQMessage {
  id: string
  sender_type: "buyer" | "admin" | "system"
  content: string
  created_at: string
}

export function useRFQs() {
  return useQuery({
    queryKey: ["rfqs"],
    queryFn: async () => {
      const result = await sdk.client.fetch<Record<string, any>>("/store/rfq")
      return (result.rfqs || []) as RFQItem[]
    },
  })
}

export function useRFQ(id: string) {
  return useQuery({
    queryKey: ["rfq", id],
    queryFn: async () => {
      const result = await sdk.client.fetch<Record<string, any>>(`/store/rfq/${id}`)
      return result.rfq || result
    },
    enabled: !!id,
  })
}

export function useCreateRFQ() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      product_id?: string; product_title?: string; variant_id?: string
      factory_id?: string; quantity?: number; target_price?: string
      requirements?: Record<string, any>; customer_email: string
    }) => sdk.client.fetch("/store/rfq", { method: "POST", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rfqs"] }),
  })
}

export function useAddRFQMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ rfq_id, content }: { rfq_id: string; content: string }) =>
      sdk.client.fetch(`/store/rfq/${rfq_id}/messages`, {
        method: "POST",
        body: { sender_type: "buyer", content },
      }),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["rfq", vars.rfq_id] }),
  })
}
```

Commit: `git commit -m "feat(storefront): add RFQ data hooks"`

---

## Task 2: Add RFQ Button to Product Detail Page

**Modify: `apps/storefront/src/app/[locale]/products/[handle]/page.tsx`**

Add a "Request Quote" button that opens a simple modal/form. The form collects: quantity, target price, and requirements (textarea). On submit, calls `useCreateRFQ`.

Create a simple RFQ form component:

**File: `apps/storefront/src/components/rfq/rfq-form.tsx`**

```tsx
"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useCreateRFQ } from "@/hooks/use-rfq"

interface RFQFormProps {
  productId?: string
  productTitle?: string
  variantId?: string
  factoryId?: string
  customerEmail: string
  onSuccess?: () => void
}

export function RFQForm({ productId, productTitle, variantId, factoryId, customerEmail, onSuccess }: RFQFormProps) {
  const t = useTranslations("rfq")
  const [quantity, setQuantity] = useState("")
  const [targetPrice, setTargetPrice] = useState("")
  const [requirements, setRequirements] = useState("")
  const { mutateAsync: createRFQ, isPending } = useCreateRFQ()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createRFQ({
      product_id: productId,
      product_title: productTitle,
      variant_id: variantId,
      factory_id: factoryId,
      quantity: quantity ? parseInt(quantity) : undefined,
      target_price: targetPrice || undefined,
      requirements: { details: requirements },
      customer_email: customerEmail,
    })
    setSubmitted(true)
    onSuccess?.()
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-center">
        <p className="text-sm text-green-700">✅ Inquiry submitted! We'll respond within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Quantity</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g. 100" className="w-full rounded-lg border px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Target Price (per unit)</label>
        <input type="text" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)}
          placeholder="e.g. $3.50" className="w-full rounded-lg border px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Requirements</label>
        <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)}
          placeholder="Customization needs, material requirements, packaging, etc."
          className="w-full rounded-lg border px-3 py-2 text-sm" rows={3} />
      </div>
      <button type="submit" disabled={isPending}
        className="w-full rounded-lg bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
        {isPending ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  )
}
```

Commit: `git commit -m "feat(storefront): add RFQ form component"`

---

## Task 3: Create RFQ Center Pages

**File: `apps/storefront/src/app/[locale]/rfq/page.tsx`** — RFQ list (buyer's inquiries)

```tsx
"use client"

import Link from "next/link"
import { useLocale } from "next-intl"
import { useRFQs } from "@/hooks/use-rfq"

const statusLabels: Record<string, { label: string; color: string }> = {
  submitted: { label: "Submitted", color: "bg-yellow-100 text-yellow-800" },
  reviewing: { label: "Under Review", color: "bg-blue-100 text-blue-800" },
  quoted: { label: "Quoted", color: "bg-green-100 text-green-800" },
  negotiating: { label: "Negotiating", color: "bg-orange-100 text-orange-800" },
  accepted: { label: "Accepted", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
}

export default function RFQListPage() {
  const { data: rfqs, isLoading } = useRFQs()
  const locale = useLocale()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Inquiries</h1>
      {isLoading ? (
        <p className="text-center py-10 text-gray-500">Loading...</p>
      ) : rfqs && rfqs.length > 0 ? (
        <div className="space-y-3">
          {rfqs.map((rfq) => {
            const status = statusLabels[rfq.status] || { label: rfq.status, color: "bg-gray-100 text-gray-800" }
            return (
              <Link key={rfq.id} href={`/${locale}/rfq/${rfq.id}`}
                className="block rounded-lg border p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{rfq.product_title || "General Inquiry"}</p>
                    <p className="text-xs text-gray-500">
                      {rfq.quantity ? `${rfq.quantity} pcs` : "N/A"} · {new Date(rfq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded px-2 py-0.5 text-xs ${status.color}`}>{status.label}</span>
                    {rfq.quoted_price && (
                      <p className="mt-1 text-sm font-medium text-green-700">{rfq.quoted_price}</p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-center py-10 text-gray-500">No inquiries yet. Browse products and submit a quote request!</p>
      )}
    </div>
  )
}
```

**File: `apps/storefront/src/app/[locale]/rfq/[id]/page.tsx`** — RFQ detail with message thread

```tsx
"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useRFQ, useAddRFQMessage } from "@/hooks/use-rfq"

export default function RFQDetailPage() {
  const { id } = useParams()
  const { data: rfq, isLoading } = useRFQ(id as string)
  const { mutateAsync: sendMessage, isPending } = useAddRFQMessage()
  const [message, setMessage] = useState("")

  if (isLoading) return <p className="text-center py-20 text-gray-500">Loading...</p>
  if (!rfq) return <p className="text-center py-20 text-gray-500">Not found</p>

  const handleSend = async () => {
    if (!message.trim()) return
    await sendMessage({ rfq_id: id as string, content: message })
    setMessage("")
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* RFQ Header */}
      <div className="mb-6 rounded-lg border p-4">
        <h1 className="text-xl font-bold">{rfq.product_title || "Inquiry"}</h1>
        <p className="text-sm text-gray-500">Status: {rfq.status} · Qty: {rfq.quantity || "N/A"}</p>
        {rfq.quoted_price && (
          <div className="mt-2 rounded bg-green-50 p-2">
            <p className="text-sm font-medium text-green-800">Quoted: {rfq.quoted_price}</p>
            {rfq.quoted_lead_time && <p className="text-xs text-green-700">Lead time: {rfq.quoted_lead_time}</p>}
          </div>
        )}
        {rfq.requirements?.details && (
          <p className="mt-2 text-sm text-gray-600">{rfq.requirements.details}</p>
        )}
      </div>

      {/* Message Thread */}
      <div className="space-y-3 mb-4">
        {(rfq.messages || []).map((msg: any) => (
          <div key={msg.id} className={`rounded-lg p-3 text-sm ${
            msg.sender_type === "buyer" ? "bg-brand-50 ml-8" : "bg-gray-50 mr-8"
          }`}>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium">{msg.sender_type === "buyer" ? "You" : "TFShop Team"}</span>
              <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</span>
            </div>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      {!["accepted", "rejected", "cancelled"].includes(rfq.status) && (
        <div className="flex gap-2">
          <input value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} disabled={isPending || !message.trim()}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            Send
          </button>
        </div>
      )}
    </div>
  )
}
```

Commit: `git commit -m "feat(storefront): add RFQ center with inquiry list and message thread"`

---

## Task 4: Add RFQ Translations and Nav Links

### Update all 4 message files with RFQ translations:

**en.json** additions:
```json
"rfq": {
  "title": "Request for Quote",
  "submit": "Submit Inquiry",
  "myInquiries": "My Inquiries",
  "quantity": "Quantity",
  "targetPrice": "Target Price",
  "requirements": "Requirements",
  "success": "Inquiry submitted! We'll respond within 24 hours.",
  "status": {
    "submitted": "Submitted",
    "reviewing": "Under Review",
    "quoted": "Quoted",
    "negotiating": "Negotiating",
    "accepted": "Accepted",
    "rejected": "Rejected"
  }
}
```

**zh.json**, **es.json**, **ar.json** — equivalent translations.

### Update header navigation — add "Inquiries" link for logged-in users.

### Update product detail page — make the "Request Quote" button open the RFQ form inline.

Commit: `git commit -m "feat(storefront): add RFQ translations and navigation"`

---

## Task 5: Build and Verify

```bash
cd /Users/svan/app/tfshop/apps/storefront && npx next build
```
