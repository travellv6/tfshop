export const defaultStoreFactoryFields = [
  "id",
  "name",
  "slug",
  "description",
  "cover_image",
  "location_province",
  "location_city",
  "established_year",
  "employee_scale",
  "monthly_capacity",
  "main_categories",
  "certifications",
  "photos",
  "status",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreFactoryFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultStoreFactoryFields,
  defaultLimit: 20,
  isList: true,
}
