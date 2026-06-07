import { FetchError } from "@medusajs/js-sdk"
import {
  UseMutationOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

// Query keys
const RFQ_QUERY_KEY = "rfq" as const
export const rfqQueryKeys = queryKeysFactory(RFQ_QUERY_KEY)

// Types
export interface RFQMessageDTO {
  id: string
  rfq_id: string
  sender_type: "buyer" | "seller" | "system"
  content: string
  created_at: string
}

export interface RFQDTO {
  id: string
  product_id: string | null
  product_title: string | null
  variant_id: string | null
  factory_id: string | null
  customer_email: string | null
  quantity: number | null
  target_price: string | null
  requirements: string | null
  status: "submitted" | "reviewing" | "quoted" | "negotiating" | "accepted" | "rejected"
  quoted_price: string | null
  quoted_lead_time: string | null
  quoted_terms: string | null
  messages: RFQMessageDTO[]
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface RFQListResponse {
  rfqs: RFQDTO[]
  count: number
  offset: number
  limit: number
}

export interface RFQResponse {
  rfq: RFQDTO
}

export interface RFQUpdatePayload {
  status?: string
  quoted_price?: string
  quoted_lead_time?: string
  quoted_terms?: string
}

export interface RFQMessagePayload {
  sender_type: "buyer" | "seller"
  content: string
}

// Hook: List RFQs
export const useRFQs = (
  query?: Record<string, any>,
  options?: Record<string, any>
) => {
  const { data, ...rest } = useQuery({
    queryKey: rfqQueryKeys.list(query),
    queryFn: async () =>
      sdk.client.fetch<RFQListResponse>("/admin/rfq", {
        query,
      }),
    ...options,
  })
  return { ...data, ...rest }
}

// Hook: Get RFQ by ID
export const useRFQ = (
  id: string,
  query?: Record<string, any>,
  options?: Record<string, any>
) => {
  const { data, ...rest } = useQuery({
    queryKey: rfqQueryKeys.detail(id, query),
    queryFn: async () =>
      sdk.client.fetch<RFQResponse>(`/admin/rfq/${id}`),
    enabled: !!id,
    ...options,
  })
  return { ...data, ...rest }
}

// Hook: Update RFQ
export const useUpdateRFQ = (
  id: string,
  options?: UseMutationOptions<RFQResponse, FetchError, RFQUpdatePayload>
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.client.fetch<RFQResponse>(`/admin/rfq/${id}`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: rfqQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: rfqQueryKeys.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Hook: Delete RFQ
export const useDeleteRFQ = (
  options?: UseMutationOptions<
    { id: string; deleted: boolean },
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (id) =>
      sdk.client.fetch(`/admin/rfq/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: rfqQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: rfqQueryKeys.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Hook: Add RFQ Message
export const useAddRFQMessage = (
  options?: UseMutationOptions<
    Record<string, any>,
    FetchError,
    { rfq_id: string; payload: RFQMessagePayload }
  >
) => {
  return useMutation({
    mutationFn: ({ rfq_id, payload }) =>
      sdk.client.fetch(`/admin/rfq/${rfq_id}/messages`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: rfqQueryKeys.detail(variables.rfq_id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
