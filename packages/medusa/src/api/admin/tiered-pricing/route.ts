import { createTieredPriceWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AdminCreateTieredPriceType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: tiered_prices, metadata } = await query.graph({
    entity: "tiered_price",
    fields: req.queryConfig.fields,
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
  })

  res.status(200).json({
    tiered_prices,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateTieredPriceType>,
  res: MedusaResponse
) => {
  const { result } = await createTieredPriceWorkflow(req.scope).run({
    input: {
      tiered_prices: [req.validatedBody as any],
    },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: tiered_prices } = await query.graph({
    entity: "tiered_price",
    fields: req.queryConfig.fields,
    filters: { id: result[0].id },
  })

  res.status(200).json({ tiered_price: tiered_prices[0] })
}
