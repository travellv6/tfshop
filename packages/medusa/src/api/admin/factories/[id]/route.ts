import {
  deleteFactoryWorkflow,
  updateFactoryWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { AdminUpdateFactoryType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: factories } = await query.graph({
    entity: "factory",
    filters: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  const factory = factories[0]

  if (!factory) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Factory with id: ${req.params.id} not found`
    )
  }

  res.status(200).json({ factory })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateFactoryType>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: existing } = await query.graph({
    entity: "factory",
    filters: { id: req.params.id },
    fields: ["id"],
  })

  if (!existing[0]) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Factory with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateFactoryWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody as any,
    },
  })

  const { data: factories } = await query.graph({
    entity: "factory",
    filters: { id: result[0].id },
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ factory: factories[0] })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  await deleteFactoryWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "factory",
    deleted: true,
  })
}
