import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateTieredPrice,
  AdminGetTieredPriceParams,
  AdminGetTieredPricesParams,
  AdminUpdateTieredPrice,
} from "./validators"

export const adminTieredPricingRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/tiered-pricing/*",
    policies: [
      {
        resource: Entities.tiered_price,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/tiered-pricing",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTieredPricesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.tiered_price,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/tiered-pricing",
    middlewares: [
      validateAndTransformBody(AdminCreateTieredPrice),
      validateAndTransformQuery(
        AdminGetTieredPriceParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.tiered_price,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/tiered-pricing/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTieredPriceParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/tiered-pricing/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateTieredPrice),
      validateAndTransformQuery(
        AdminGetTieredPriceParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.tiered_price,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/tiered-pricing/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.tiered_price,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
