export const defaultStoreRFQFields = [
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
  "created_at",
  "updated_at",
]

export const defaultStoreRFQMessageFields = [
  "id",
  "rfq_id",
  "sender_type",
  "content",
  "attachments",
  "created_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreRFQFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultStoreRFQFields,
  defaultLimit: 20,
  isList: true,
}

export const listMessagesTransformQueryConfig = {
  defaults: defaultStoreRFQMessageFields,
  defaultLimit: 50,
  isList: true,
}
