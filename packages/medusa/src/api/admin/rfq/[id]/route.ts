import {
  deleteRFQWorkflow,
  updateRFQWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { AdminUpdateRFQType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: rfqs } = await query.graph({
    entity: "rfq",
    filters: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  const rfq = rfqs[0]

  if (!rfq) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `RFQ with id: ${req.params.id} not found`
    )
  }

  res.status(200).json({ rfq })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateRFQType>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: existing } = await query.graph({
    entity: "rfq",
    filters: { id: req.params.id },
    fields: ["id"],
  })

  if (!existing[0]) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `RFQ with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateRFQWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody as any,
    },
  })

  const { data: rfqs } = await query.graph({
    entity: "rfq",
    filters: { id: result[0].id },
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ rfq: rfqs[0] })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  await deleteRFQWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "rfq",
    deleted: true,
  })
}
