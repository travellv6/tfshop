import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const customerId = req.auth_context?.actor_id

  const { data: rfqs } = await query.graph({
    entity: "rfq",
    filters: {
      id: req.params.id,
      customer_id: customerId,
    },
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
