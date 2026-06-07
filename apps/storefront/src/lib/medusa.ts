import Medusa from "@medusajs/js-sdk"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
export const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export const sdk = new Medusa({
  baseUrl: BACKEND_URL,
  auth: {
    type: "session",
  },
  publishableKey: PUBLISHABLE_KEY || undefined,
})
