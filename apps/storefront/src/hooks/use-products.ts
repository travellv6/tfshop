import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

export function useProducts(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const { products, count } = await sdk.store.product.list(params)
      return { products, count }
    },
  })
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const { products } = await sdk.store.product.list({ handle })
      const product = products[0]
      if (!product) {
        throw new Error(`Product not found: ${handle}`)
      }
      return product
    },
    enabled: !!handle,
  })
}
