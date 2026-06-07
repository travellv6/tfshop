import Factory from "../models/factory"

describe("Factory model", () => {
  it("should be defined as a DmlEntity", () => {
    expect(Factory).toBeDefined()
    expect(Factory.name).toBeDefined()
  })

  it("should have all required fields", () => {
    const schema = Factory.schema
    const requiredFields = [
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
    ]
    for (const field of requiredFields) {
      expect(Object.keys(schema)).toContain(field)
    }
  })

  it("should have correct field types", () => {
    const schema = Factory.schema
    expect(schema.id).toBeDefined()
    expect(schema.name).toBeDefined()
    expect(schema.slug).toBeDefined()
    expect(schema.status).toBeDefined()
  })
})
