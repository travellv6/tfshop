import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateRFQ,
  AdminGetRFQParams,
  AdminGetRFQsParams,
  AdminUpdateRFQ,
  AdminAddRFQMessage,
  AdminGetRFQMessagesParams,
} from "./validators"

export const adminRFQRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/rfq/*",
    policies: [
      {
        resource: Entities.rfq,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/rfq",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRFQsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.rfq,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/rfq",
    middlewares: [
      validateAndTransformBody(AdminCreateRFQ),
      validateAndTransformQuery(
        AdminGetRFQParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.rfq,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/rfq/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRFQParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/rfq/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateRFQ),
      validateAndTransformQuery(
        AdminGetRFQParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.rfq,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/rfq/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.rfq,
        operation: PolicyOperation.delete,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/rfq/:id/messages",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRFQMessagesParams,
        QueryConfig.listMessagesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/rfq/:id/messages",
    middlewares: [
      validateAndTransformBody(AdminAddRFQMessage),
    ],
    policies: [
      {
        resource: Entities.rfq,
        operation: PolicyOperation.update,
      },
    ],
  },
]
