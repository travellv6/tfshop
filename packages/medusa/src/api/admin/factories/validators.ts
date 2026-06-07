import { z } from "@medusajs/framework/zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetFactoryParamsType = z.infer<typeof AdminGetFactoryParams>
export const AdminGetFactoryParams = createSelectParams()

export const AdminGetFactoriesParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  name: z.union([z.string(), z.array(z.string())]).optional(),
  slug: z.union([z.string(), z.array(z.string())]).optional(),
  status: z
    .union([z.string(), z.array(z.string())])
    .optional(),
  location_province: z.union([z.string(), z.array(z.string())]).optional(),
  location_city: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
})

export type AdminGetFactoriesParamsType = z.infer<
  typeof AdminGetFactoriesParams
>
export const AdminGetFactoriesParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(AdminGetFactoriesParamsFields)

export type AdminCreateFactoryType = z.infer<typeof AdminCreateFactory>
export const AdminCreateFactory = z
  .object({
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    cover_image: z.string().optional(),
    location_province: z.string().optional(),
    location_city: z.string().optional(),
    location_address: z.string().optional(),
    established_year: z.number().optional(),
    employee_scale: z.string().optional(),
    monthly_capacity: z.string().optional(),
    main_categories: z.string().optional(),
    certifications: z.array(z.string()).optional(),
    photos: z.array(z.string()).optional(),
    status: z.enum(["active", "inactive", "suspended"]).optional(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()

export type AdminUpdateFactoryType = z.infer<typeof AdminUpdateFactory>
export const AdminUpdateFactory = z
  .object({
    name: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    cover_image: z.string().optional(),
    location_province: z.string().optional(),
    location_city: z.string().optional(),
    location_address: z.string().optional(),
    established_year: z.number().optional(),
    employee_scale: z.string().optional(),
    monthly_capacity: z.string().optional(),
    main_categories: z.string().optional(),
    certifications: z.array(z.string()).optional(),
    photos: z.array(z.string()).optional(),
    status: z.enum(["active", "inactive", "suspended"]).optional(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()
