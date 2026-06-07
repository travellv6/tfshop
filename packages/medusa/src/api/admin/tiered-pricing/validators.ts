import { z } from "@medusajs/framework/zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetTieredPriceParamsType = z.infer<
  typeof AdminGetTieredPriceParams
>
export const AdminGetTieredPriceParams = createSelectParams()

export const AdminGetTieredPricesParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  variant_id: z.union([z.string(), z.array(z.string())]).optional(),
  currency_code: z.union([z.string(), z.array(z.string())]).optional(),
  status: z
    .union([z.string(), z.array(z.string())])
    .optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
})

export type AdminGetTieredPricesParamsType = z.infer<
  typeof AdminGetTieredPricesParams
>
export const AdminGetTieredPricesParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(AdminGetTieredPricesParamsFields)

export type AdminCreateTieredPriceType = z.infer<typeof AdminCreateTieredPrice>
export const AdminCreateTieredPrice = z
  .object({
    variant_id: z.string(),
    min_quantity: z.number().int().positive(),
    max_quantity: z.number().int().positive().nullable().optional(),
    amount: z.union([z.string(), z.number()]),
    currency_code: z.string().length(3),
    rules: z.record(z.string(), z.unknown()).optional(),
    status: z.enum(["active", "inactive"]).optional(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()

export type AdminUpdateTieredPriceType = z.infer<typeof AdminUpdateTieredPrice>
export const AdminUpdateTieredPrice = z
  .object({
    variant_id: z.string().optional(),
    min_quantity: z.number().int().positive().optional(),
    max_quantity: z.number().int().positive().nullable().optional(),
    amount: z.union([z.string(), z.number()]).optional(),
    currency_code: z.string().length(3).optional(),
    rules: z.record(z.string(), z.unknown()).optional(),
    status: z.enum(["active", "inactive"]).optional(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()
