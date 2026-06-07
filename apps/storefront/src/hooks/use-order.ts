import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

type FetchResult = Record<string, any>

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const result = await sdk.client.fetch<FetchResult>("/store/orders")
      return (result.orders || []) as any[]
    },
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const result = await sdk.client.fetch<FetchResult>(
        `/store/orders/${id}`
      )
      return (result.order || result) as any
    },
    enabled: !!id,
  })
}
