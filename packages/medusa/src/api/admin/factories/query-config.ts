export enum Entities {
  factory = "factory",
}

export const defaultAdminFactoryFields = [
  "id",
  "name",
  "slug",
  "description",
  "cover_image",
  "location_province",
  "location_city",
  "location_address",
  "established_year",
  "employee_scale",
  "monthly_capacity",
  "main_categories",
  "certifications",
  "photos",
  "status",
  "metadata",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminFactoryFields,
  isList: false,
  entity: Entities.factory,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminFactoryFields,
  defaultLimit: 20,
  isList: true,
  entity: Entities.factory,
}
