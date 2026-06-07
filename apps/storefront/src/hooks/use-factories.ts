import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

export interface Factory {
  id: string
  name: string
  slug: string
  description?: string | null
  cover_image?: string | null
  location_province?: string | null
  location_city?: string | null
  established_year?: number | null
  employee_scale?: string | null
  monthly_capacity?: string | null
  main_categories?: string | null
  certifications?: string[] | null
  photos?: string[] | null
  status: string
}

export function useFactories(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["factories", params],
    queryFn: async () => {
      const result = await sdk.client.fetch<{
        factories: Factory[]
        count: number
      }>("/store/factories", {
        query: params,
      })
      return result
    },
  })
}

export function useFactory(slug: string) {
  return useQuery({
    queryKey: ["factory", slug],
    queryFn: async () => {
      const { factory } = await sdk.client.fetch<{ factory: Factory }>(
        `/store/factories/${slug}`
      )
      return factory
    },
    enabled: !!slug,
  })
}
