import { createFactoryWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AdminCreateFactoryType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: factories, metadata } = await query.graph({
    entity: "factory",
    fields: req.queryConfig.fields,
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
  })

  res.status(200).json({
    factories,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateFactoryType>,
  res: MedusaResponse
) => {
  const { result } = await createFactoryWorkflow(req.scope).run({
    input: {
      factories: [req.validatedBody as any],
    },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: factories } = await query.graph({
    entity: "factory",
    fields: req.queryConfig.fields,
    filters: { id: result[0].id },
  })

  res.status(200).json({ factory: factories[0] })
}
