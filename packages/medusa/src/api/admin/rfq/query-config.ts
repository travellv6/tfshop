export enum Entities {
  rfq = "rfq",
  rfq_message = "rfq_message",
}

export const defaultAdminRFQFields = [
  "id",
  "customer_id",
  "customer_email",
  "product_id",
  "product_title",
  "variant_id",
  "factory_id",
  "status",
  "quantity",
  "target_price",
  "currency_code",
  "requirements",
  "quoted_price",
  "quoted_lead_time",
  "quoted_terms",
  "notes",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminRFQMessageFields = [
  "id",
  "rfq_id",
  "sender_type",
  "content",
  "attachments",
  "internal",
  "created_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminRFQFields,
  isList: false,
  entity: Entities.rfq,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminRFQFields,
  defaultLimit: 20,
  isList: true,
  entity: Entities.rfq,
}

export const listMessagesTransformQueryConfig = {
  defaults: defaultAdminRFQMessageFields,
  defaultLimit: 50,
  isList: true,
  entity: Entities.rfq_message,
}
