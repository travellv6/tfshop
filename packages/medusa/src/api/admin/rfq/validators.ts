import { z } from "@medusajs/framework/zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetRFQParamsType = z.infer<typeof AdminGetRFQParams>
export const AdminGetRFQParams = createSelectParams()

export const AdminGetRFQsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  customer_id: z.union([z.string(), z.array(z.string())]).optional(),
  customer_email: z.union([z.string(), z.array(z.string())]).optional(),
  product_id: z.union([z.string(), z.array(z.string())]).optional(),
  factory_id: z.union([z.string(), z.array(z.string())]).optional(),
  status: z
    .union([z.string(), z.array(z.string())])
    .optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
})

export type AdminGetRFQsParamsType = z.infer<typeof AdminGetRFQsParams>
export const AdminGetRFQsParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(AdminGetRFQsParamsFields)

export type AdminCreateRFQType = z.infer<typeof AdminCreateRFQ>
export const AdminCreateRFQ = z
  .object({
    customer_id: z.string().optional(),
    customer_email: z.string(),
    product_id: z.string().optional(),
    product_title: z.string().optional(),
    variant_id: z.string().optional(),
    factory_id: z.string().optional(),
    status: z
      .enum([
        "draft",
        "submitted",
        "reviewing",
        "quoted",
        "negotiating",
        "accepted",
        "rejected",
        "expired",
        "cancelled",
      ])
      .optional(),
    quantity: z.number().int().positive().optional(),
    target_price: z.string().optional(),
    currency_code: z.string().length(3).optional(),
    requirements: z.record(z.string(), z.unknown()).optional(),
    quoted_price: z.string().optional(),
    quoted_lead_time: z.string().optional(),
    quoted_terms: z.record(z.string(), z.unknown()).optional(),
    notes: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()

export type AdminUpdateRFQType = z.infer<typeof AdminUpdateRFQ>
export const AdminUpdateRFQ = z
  .object({
    customer_id: z.string().optional(),
    customer_email: z.string().optional(),
    product_id: z.string().nullable().optional(),
    product_title: z.string().nullable().optional(),
    variant_id: z.string().nullable().optional(),
    factory_id: z.string().nullable().optional(),
    status: z
      .enum([
        "draft",
        "submitted",
        "reviewing",
        "quoted",
        "negotiating",
        "accepted",
        "rejected",
        "expired",
        "cancelled",
      ])
      .optional(),
    quantity: z.number().int().positive().nullable().optional(),
    target_price: z.string().nullable().optional(),
    currency_code: z.string().length(3).optional(),
    requirements: z.record(z.string(), z.unknown()).optional(),
    quoted_price: z.string().nullable().optional(),
    quoted_lead_time: z.string().nullable().optional(),
    quoted_terms: z.record(z.string(), z.unknown()).optional(),
    notes: z.string().nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()

export type AdminAddRFQMessageType = z.infer<typeof AdminAddRFQMessage>
export const AdminAddRFQMessage = z
  .object({
    sender_type: z.enum(["admin"]).default("admin"),
    content: z.string(),
    attachments: z.record(z.string(), z.unknown()).optional(),
    internal: z.boolean().optional(),
  })
  .strict()

export type AdminGetRFQMessagesParamsType = z.infer<
  typeof AdminGetRFQMessagesParams
>
export const AdminGetRFQMessagesParams = createFindParams({
  limit: 50,
  offset: 0,
})
