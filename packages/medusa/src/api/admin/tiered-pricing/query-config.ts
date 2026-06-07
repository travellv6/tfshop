export enum Entities {
  tiered_price = "tiered_price",
}

export const defaultAdminTieredPriceFields = [
  "id",
  "variant_id",
  "min_quantity",
  "max_quantity",
  "amount",
  "currency_code",
  "rules",
  "status",
  "metadata",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminTieredPriceFields,
  isList: false,
  entity: Entities.tiered_price,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminTieredPriceFields,
  defaultLimit: 20,
  isList: true,
  entity: Entities.tiered_price,
}
