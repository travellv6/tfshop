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
  const { data: factories } = await query.graph({
    entity: "factory",
    filters: {
      slug: req.params.slug,
      status: "active",
    },
    fields: req.queryConfig.fields,
  })

  const factory = factories[0]

  if (!factory) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Factory with slug: ${req.params.slug} not found`
    )
  }

  res.status(200).json({ factory })
}
