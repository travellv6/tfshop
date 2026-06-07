import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk, PUBLISHABLE_KEY } from "@/lib/medusa"

const authHeaders: Record<string, string> = {}
if (PUBLISHABLE_KEY) {
  authHeaders["x-publishable-api-key"] = PUBLISHABLE_KEY
}

export interface RFQItem {
  id: string
  product_title: string | null
  status: string
  quantity: number | null
  quoted_price: string | null
  created_at: string
}

export interface RFQDetail {
  id: string
  product_id: string | null
  product_title: string | null
  variant_id: string | null
  factory_id: string | null
  customer_email: string | null
  quantity: number | null
  target_price: string | null
  requirements: string | null
  status: string
  quoted_price: string | null
  quoted_lead_time: string | null
  quoted_terms: string | null
  messages: RFQMessage[]
  created_at: string
  updated_at: string
}

export interface RFQMessage {
  id: string
  rfq_id: string
  sender_type: "buyer" | "seller" | "system"
  content: string
  created_at: string
}

export function useRFQs() {
  return useQuery({
    queryKey: ["rfqs"],
    queryFn: async () => {
      const result = await sdk.client.fetch<Record<string, any>>("/store/rfq", {
        headers: authHeaders,
      })
      return (result.rfqs || []) as RFQItem[]
    },
  })
}

export function useRFQ(id: string) {
  return useQuery({
    queryKey: ["rfq", id],
    queryFn: async () => {
      const result = await sdk.client.fetch<Record<string, any>>(
        `/store/rfq/${id}`,
        { headers: authHeaders }
      )
      return (result.rfq || result) as RFQDetail
    },
    enabled: !!id,
  })
}

export function useCreateRFQ() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Record<string, any>) =>
      sdk.client.fetch("/store/rfq", {
        method: "POST",
        body: data,
        headers: authHeaders,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rfqs"] }),
  })
}

export function useAddRFQMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      rfq_id,
      content,
    }: {
      rfq_id: string
      content: string
    }) =>
      sdk.client.fetch(`/store/rfq/${rfq_id}/messages`, {
        method: "POST",
        body: { sender_type: "buyer", content },
        headers: authHeaders,
      }),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ["rfq", vars.rfq_id] }),
  })
}
