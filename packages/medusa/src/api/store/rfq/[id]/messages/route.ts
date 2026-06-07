import { addRFQMessageWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { StoreAddRFQMessageType } from "../../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const customerId = req.auth_context?.actor_id

  // Verify ownership
  const { data: rfqs } = await query.graph({
    entity: "rfq",
    filters: {
      id: req.params.id,
      customer_id: customerId,
    },
    fields: ["id"],
  })

  if (!rfqs[0]) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `RFQ with id: ${req.params.id} not found`
    )
  }

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
  req: AuthenticatedMedusaRequest<StoreAddRFQMessageType>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const customerId = req.auth_context?.actor_id

  // Verify ownership
  const { data: rfqs } = await query.graph({
    entity: "rfq",
    filters: {
      id: req.params.id,
      customer_id: customerId,
    },
    fields: ["id"],
  })

  if (!rfqs[0]) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `RFQ with id: ${req.params.id} not found`
    )
  }

  const { result } = await addRFQMessageWorkflow(req.scope).run({
    input: {
      messages: [
        {
          rfq_id: req.params.id,
          sender_type: "buyer",
          content: req.validatedBody.content,
          attachments: req.validatedBody.attachments ?? {},
        },
      ],
    },
  })

  res.status(200).json({ message: result[0] })
}
