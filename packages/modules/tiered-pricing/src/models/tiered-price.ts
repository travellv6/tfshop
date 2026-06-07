import { model } from "@medusajs/framework/utils"

const TieredPrice = model.define("tiered_price", {
  id: model.id({ prefix: "tp" }).primaryKey(),
  variant_id: model.text().searchable(),
  min_quantity: model.number(),
  max_quantity: model.number().nullable(),
  amount: model.bigNumber(),
  currency_code: model.text().searchable(),
  rules: model.json().default({}),
  status: model.enum(["active", "inactive"]).default("active"),
  metadata: model.json().nullable(),
})

export default TieredPrice
