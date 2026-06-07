import { model } from "@medusajs/framework/utils"

const RFQMessage = model.define("rfq_message", {
  id: model.id({ prefix: "rfqm" }).primaryKey(),
  rfq_id: model.text().searchable(),
  sender_type: model.enum(["buyer", "admin", "system"]).default("buyer"),
  content: model.text(),
  attachments: model.json().default({}),
  internal: model.boolean().default(false),
})

export default RFQMessage
