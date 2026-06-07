import { LoaderFunctionArgs } from "react-router-dom"

import { rfqQueryKeys } from "../../../hooks/api/rfq"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const rfqDetailQuery = (id: string) => ({
  queryKey: rfqQueryKeys.detail(id),
  queryFn: async () =>
    sdk.client.fetch(`/admin/rfq/${id}`),
})

export const rfqDetailLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  const id = params.id
  const query = rfqDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}
