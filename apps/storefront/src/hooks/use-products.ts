import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

const PRODUCT_FIELDS = [
  "id",
  "title",
  "subtitle",
  "description",
  "handle",
  "thumbnail",
  "metadata",
  "*options",
  "*options.values",
  "*images",
  "*variants",
  "*variants.options",
].join(",")

function withProductFields(params?: Record<string, any>) {
  return {
    ...(params || {}),
    fields: params?.fields || PRODUCT_FIELDS,
  }
}

export function useProducts(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const { products, count } = await sdk.store.product.list(
        withProductFields(params)
      )
      return { products, count }
    },
  })
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const { products } = await sdk.store.product.list(
        withProductFields({ handle })
      )
      const product = products[0]
      if (!product) {
        throw new Error(`Product not found: ${handle}`)
      }
      return product
    },
    enabled: !!handle,
  })
}

export function useProductsByFactory(factoryId: string) {
  return useQuery({
    queryKey: ["products", "factory", factoryId],
    queryFn: async () => {
      const { products } = await sdk.store.product.list(
        withProductFields({ limit: 100 })
      )
      const factoryProducts = products.filter(
        (product: any) => product.metadata?.factory_id === factoryId
      )

      return {
        products: factoryProducts.slice(0, 12),
        count: factoryProducts.length,
      }
    },
    enabled: !!factoryId,
  })
}
