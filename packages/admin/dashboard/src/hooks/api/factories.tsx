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
const FACTORIES_QUERY_KEY = "factories" as const
export const factoriesQueryKeys = queryKeysFactory(FACTORIES_QUERY_KEY)

// Types
export interface FactoryDTO {
  id: string
  name: string
  slug: string
  description?: string | null
  cover_image?: string | null
  location_province?: string | null
  location_city?: string | null
  location_address?: string | null
  established_year?: number | null
  employee_scale?: string | null
  monthly_capacity?: string | null
  main_categories?: string | null
  certifications?: string[] | null
  photos?: string[] | null
  status: "active" | "inactive" | "suspended"
  metadata?: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface FactoryListResponse {
  factories: FactoryDTO[]
  count: number
  offset: number
  limit: number
}

export interface FactoryResponse {
  factory: FactoryDTO
}

export interface FactoryCreatePayload {
  name: string
  slug: string
  description?: string
  cover_image?: string
  location_province?: string
  location_city?: string
  location_address?: string
  established_year?: number
  employee_scale?: string
  monthly_capacity?: string
  main_categories?: string
  certifications?: string[]
  photos?: string[]
  status?: "active" | "inactive" | "suspended"
  metadata?: Record<string, unknown>
}

// Hook: List factories
export const useFactories = (
  query?: Record<string, any>,
  options?: Record<string, any>
) => {
  const { data, ...rest } = useQuery({
    queryKey: factoriesQueryKeys.list(query),
    queryFn: async () =>
      sdk.client.fetch<FactoryListResponse>("/admin/factories", {
        query,
      }),
    ...options,
  })
  return { ...data, ...rest }
}

// Hook: Get factory by ID
export const useFactory = (
  id: string,
  query?: Record<string, any>,
  options?: Record<string, any>
) => {
  const { data, ...rest } = useQuery({
    queryKey: factoriesQueryKeys.detail(id, query),
    queryFn: async () =>
      sdk.client.fetch<FactoryResponse>(`/admin/factories/${id}`),
    enabled: !!id,
    ...options,
  })
  return { ...data, ...rest }
}

// Hook: Create factory
export const useCreateFactory = (
  options?: UseMutationOptions<
    FactoryResponse,
    FetchError,
    FactoryCreatePayload
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.client.fetch<FactoryResponse>("/admin/factories", {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: factoriesQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Hook: Update factory
export const useUpdateFactory = (
  id: string,
  options?: UseMutationOptions<
    FactoryResponse,
    FetchError,
    Partial<FactoryCreatePayload>
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.client.fetch<FactoryResponse>(`/admin/factories/${id}`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: factoriesQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: factoriesQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Hook: Delete factory
export const useDeleteFactory = (
  options?: UseMutationOptions<
    { id: string; deleted: boolean },
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (id) =>
      sdk.client.fetch(`/admin/factories/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: factoriesQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: factoriesQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
