import { validateAndTransformQuery } from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import * as QueryConfig from "./query-config"
import {
  StoreGetFactoryParams,
  StoreGetFactoriesParams,
} from "./validators"

export const storeFactoryRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/factories",
    middlewares: [
      validateAndTransformQuery(
        StoreGetFactoriesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/factories/:slug",
    middlewares: [
      validateAndTransformQuery(
        StoreGetFactoryParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
