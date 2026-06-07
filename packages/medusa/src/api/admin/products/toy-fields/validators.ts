import { z } from "zod"

export const ToyProductMetadataSchema = z.object({
  age_range: z.string().optional().nullable(),
  certifications: z.array(z.string()).optional().nullable(),
  material: z.string().optional().nullable(),
  origin_region: z.string().optional().nullable(),
  min_order_qty: z.number().optional().nullable(),
  is_in_stock: z.boolean().optional().nullable(),
  sample_available: z.boolean().optional().nullable(),
  lead_time_days: z.number().optional().nullable(),
  packaging_info: z
    .object({
      length: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      weight: z.number().optional(),
      carton_qty: z.number().optional(),
    })
    .optional()
    .nullable(),
  factory_id: z.string().optional().nullable(),
})

export type ToyProductMetadata = z.infer<typeof ToyProductMetadataSchema>
