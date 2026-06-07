import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import * as QueryConfig from "./query-config"
import {
  StoreGetRFQParams,
  StoreGetRFQsParams,
  StoreCreateRFQ,
  StoreAddRFQMessage,
  StoreGetRFQMessagesParams,
} from "./validators"

export const storeRFQRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/rfq",
    middlewares: [
      validateAndTransformQuery(
        StoreGetRFQsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/rfq",
    middlewares: [
      validateAndTransformBody(StoreCreateRFQ),
      validateAndTransformQuery(
        StoreGetRFQParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/rfq/:id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetRFQParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/rfq/:id/messages",
    middlewares: [
      validateAndTransformQuery(
        StoreGetRFQMessagesParams,
        QueryConfig.listMessagesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/rfq/:id/messages",
    middlewares: [
      validateAndTransformBody(StoreAddRFQMessage),
    ],
  },
]
