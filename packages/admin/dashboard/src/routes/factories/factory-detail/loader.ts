import { LoaderFunctionArgs } from "react-router-dom"

import { factoriesQueryKeys } from "../../../hooks/api/factories"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const factoryDetailQuery = (id: string) => ({
  queryKey: factoriesQueryKeys.detail(id),
  queryFn: async () =>
    sdk.client.fetch(`/admin/factories/${id}`),
})

export const factoryDetailLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  const id = params.id
  const query = factoryDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}
