import { model } from "@medusajs/framework/utils"

const Factory = model.define("factory", {
  id: model.id({ prefix: "fac" }).primaryKey(),
  name: model.text().searchable(),
  slug: model.text().searchable(),
  description: model.text().nullable(),
  cover_image: model.text().nullable(),
  location_province: model.text().nullable(),
  location_city: model.text().nullable(),
  location_address: model.text().nullable(),
  established_year: model.number().nullable(),
  employee_scale: model.text().nullable(),
  monthly_capacity: model.text().nullable(),
  main_categories: model.text().nullable(),
  certifications: model.json().default({}),
  photos: model.json().default({}),
  status: model.enum(["active", "inactive", "suspended"]).default("active"),
  metadata: model.json().nullable(),
})

export default Factory
