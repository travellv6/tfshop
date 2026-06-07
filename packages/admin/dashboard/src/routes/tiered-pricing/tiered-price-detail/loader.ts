import { LoaderFunctionArgs } from "react-router-dom"

import { tieredPricingQueryKeys } from "../../../hooks/api/tiered-pricing"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const tieredPriceDetailQuery = (id: string) => ({
  queryKey: tieredPricingQueryKeys.detail(id),
  queryFn: async () =>
    sdk.client.fetch(`/admin/tiered-pricing/${id}`),
})

export const tieredPriceDetailLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  const id = params.id
  const query = tieredPriceDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}
