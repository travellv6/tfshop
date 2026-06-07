import { FetchError } from "@medusajs/js-sdk"
import {
  UseMutationOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const TIERED_PRICING_QUERY_KEY = "tiered_pricing" as const
export const tieredPricingQueryKeys = queryKeysFactory(
  TIERED_PRICING_QUERY_KEY
)

export interface TieredPriceDTO {
  id: string
  variant_id: string
  min_quantity: number
  max_quantity: number | null
  amount: string
  currency_code: string
  rules: Record<string, unknown>
  status: "active" | "inactive"
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface TieredPriceListResponse {
  tiered_prices: TieredPriceDTO[]
  count: number
  offset: number
  limit: number
}

export interface TieredPriceResponse {
  tiered_price: TieredPriceDTO
}

export interface TieredPriceCreatePayload {
  variant_id: string
  min_quantity: number
  max_quantity?: number | null
  amount: string
  currency_code: string
  rules?: Record<string, unknown>
  status?: "active" | "inactive"
  metadata?: Record<string, unknown>
}

// Hook: List tiered prices
export const useTieredPrices = (
  query?: Record<string, any>,
  options?: Record<string, any>
) => {
  const { data, ...rest } = useQuery({
    queryKey: tieredPricingQueryKeys.list(query),
    queryFn: async () =>
      sdk.client.fetch<TieredPriceListResponse>("/admin/tiered-pricing", {
        query,
      }),
    ...options,
  })
  return { ...data, ...rest }
}

// Hook: Get tiered price by ID
export const useTieredPrice = (
  id: string,
  query?: Record<string, any>,
  options?: Record<string, any>
) => {
  const { data, ...rest } = useQuery({
    queryKey: tieredPricingQueryKeys.detail(id, query),
    queryFn: async () =>
      sdk.client.fetch<TieredPriceResponse>(`/admin/tiered-pricing/${id}`),
    enabled: !!id,
    ...options,
  })
  return { ...data, ...rest }
}

// Hook: Create tiered price
export const useCreateTieredPrice = (
  options?: UseMutationOptions<
    TieredPriceResponse,
    FetchError,
    TieredPriceCreatePayload
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.client.fetch<TieredPriceResponse>("/admin/tiered-pricing", {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: tieredPricingQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Hook: Update tiered price
export const useUpdateTieredPrice = (
  id: string,
  options?: UseMutationOptions<
    TieredPriceResponse,
    FetchError,
    Partial<TieredPriceCreatePayload>
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.client.fetch<TieredPriceResponse>(`/admin/tiered-pricing/${id}`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: tieredPricingQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: tieredPricingQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Hook: Delete tiered price
export const useDeleteTieredPrice = (
  options?: UseMutationOptions<
    { id: string; deleted: boolean },
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (id) =>
      sdk.client.fetch(`/admin/tiered-pricing/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: tieredPricingQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: tieredPricingQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
