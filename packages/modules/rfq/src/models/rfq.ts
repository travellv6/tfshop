import { model } from "@medusajs/framework/utils"

const RFQ = model.define("rfq", {
  id: model.id({ prefix: "rfq" }).primaryKey(),
  customer_id: model.text().searchable(),
  customer_email: model.text().searchable(),
  product_id: model.text().searchable().nullable(),
  product_title: model.text().nullable(),
  variant_id: model.text().nullable(),
  factory_id: model.text().searchable().nullable(),
  status: model
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
    .default("submitted"),
  quantity: model.number().nullable(),
  target_price: model.text().nullable(),
  currency_code: model.text().default("usd"),
  requirements: model.json().default({}),
  quoted_price: model.text().nullable(),
  quoted_lead_time: model.text().nullable(),
  quoted_terms: model.json().default({}),
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default RFQ
