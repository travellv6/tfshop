import { useQueryParams } from "../../use-query-params"

type UseRFQTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useRFQTableQuery = ({
  prefix,
  pageSize = 20,
}: UseRFQTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "q", "order", "status", "created_at", "updated_at"],
    prefix
  )

  const { offset, q, order, status, created_at, updated_at } = queryObject
  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    order,
    status: status || undefined,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
