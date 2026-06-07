import { z } from "@medusajs/framework/zod"
import {
  createFindParams,
  createSelectParams,
} from "../../utils/validators"

export type StoreGetRFQParamsType = z.infer<typeof StoreGetRFQParams>
export const StoreGetRFQParams = createSelectParams()

export const StoreGetRFQsParamsFields = z.object({
  status: z
    .union([z.string(), z.array(z.string())])
    .optional(),
})

export type StoreGetRFQsParamsType = z.infer<typeof StoreGetRFQsParams>
export const StoreGetRFQsParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(StoreGetRFQsParamsFields)

export type StoreCreateRFQType = z.infer<typeof StoreCreateRFQ>
export const StoreCreateRFQ = z
  .object({
    customer_email: z.string(),
    product_id: z.string().optional(),
    product_title: z.string().optional(),
    variant_id: z.string().optional(),
    factory_id: z.string().optional(),
    quantity: z.number().int().positive().optional(),
    target_price: z.string().optional(),
    currency_code: z.string().length(3).optional(),
    requirements: z.record(z.string(), z.unknown()).optional(),
    notes: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()

export type StoreAddRFQMessageType = z.infer<typeof StoreAddRFQMessage>
export const StoreAddRFQMessage = z
  .object({
    content: z.string(),
    attachments: z.record(z.string(), z.unknown()).optional(),
  })
  .strict()

export type StoreGetRFQMessagesParamsType = z.infer<
  typeof StoreGetRFQMessagesParams
>
export const StoreGetRFQMessagesParams = createFindParams({
  limit: 50,
  offset: 0,
})
