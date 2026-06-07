import { createRFQWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AdminCreateRFQType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: rfqs, metadata } = await query.graph({
    entity: "rfq",
    fields: req.queryConfig.fields,
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
  })

  res.status(200).json({
    rfqs,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateRFQType>,
  res: MedusaResponse
) => {
  const { result } = await createRFQWorkflow(req.scope).run({
    input: {
      rfqs: [req.validatedBody as any],
    },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: rfqs } = await query.graph({
    entity: "rfq",
    fields: req.queryConfig.fields,
    filters: { id: result[0].id },
  })

  res.status(200).json({ rfq: rfqs[0] })
}
