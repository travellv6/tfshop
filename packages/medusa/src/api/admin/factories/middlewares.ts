import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateFactory,
  AdminGetFactoryParams,
  AdminGetFactoriesParams,
  AdminUpdateFactory,
} from "./validators"

export const adminFactoryRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/factories/*",
    policies: [
      {
        resource: Entities.factory,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/factories",
    middlewares: [
      validateAndTransformQuery(
        AdminGetFactoriesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.factory,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/factories",
    middlewares: [
      validateAndTransformBody(AdminCreateFactory),
      validateAndTransformQuery(
        AdminGetFactoryParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.factory,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/factories/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetFactoryParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/factories/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateFactory),
      validateAndTransformQuery(
        AdminGetFactoryParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.factory,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/factories/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.factory,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
