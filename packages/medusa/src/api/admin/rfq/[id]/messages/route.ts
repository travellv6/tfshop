import { addRFQMessageWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AdminAddRFQMessageType } from "../../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: messages, metadata } = await query.graph({
    entity: "rfq_message",
    fields: req.queryConfig.fields,
    filters: {
      rfq_id: req.params.id,
    },
    pagination: req.queryConfig.pagination,
  })

  res.status(200).json({
    messages,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminAddRFQMessageType>,
  res: MedusaResponse
) => {
  const { result } = await addRFQMessageWorkflow(req.scope).run({
    input: {
      messages: [
        {
          ...req.validatedBody,
          rfq_id: req.params.id,
        },
      ],
    },
  })

  res.status(200).json({ message: result[0] })
}
