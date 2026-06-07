import {
  deleteTieredPriceWorkflow,
  updateTieredPriceWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { AdminUpdateTieredPriceType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: tiered_prices } = await query.graph({
    entity: "tiered_price",
    filters: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  const tiered_price = tiered_prices[0]

  if (!tiered_price) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `TieredPrice with id: ${req.params.id} not found`
    )
  }

  res.status(200).json({ tiered_price })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateTieredPriceType>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: existing } = await query.graph({
    entity: "tiered_price",
    filters: { id: req.params.id },
    fields: ["id"],
  })

  if (!existing[0]) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `TieredPrice with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateTieredPriceWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody as any,
    },
  })

  const { data: tiered_prices } = await query.graph({
    entity: "tiered_price",
    filters: { id: result[0].id },
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ tiered_price: tiered_prices[0] })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  await deleteTieredPriceWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "tiered_price",
    deleted: true,
  })
}
