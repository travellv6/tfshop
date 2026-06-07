import { z } from "@medusajs/framework/zod"
import {
  createFindParams,
  createSelectParams,
} from "../../utils/validators"

export type StoreGetFactoryParamsType = z.infer<typeof StoreGetFactoryParams>
export const StoreGetFactoryParams = createSelectParams()

export const StoreGetFactoriesParamsFields = z.object({
  location_province: z.string().optional(),
  location_city: z.string().optional(),
  q: z.string().optional(),
})

export type StoreGetFactoriesParamsType = z.infer<
  typeof StoreGetFactoriesParams
>
export const StoreGetFactoriesParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(StoreGetFactoriesParamsFields)
