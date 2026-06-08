import { expect, test, type Page, type Route } from "@playwright/test"

type SmokeRoute = {
  path: string
  text: string | RegExp
}

const smokeRoutes: SmokeRoute[] = [
  { path: "/", text: "Sourcing Toys" },
  { path: "/en", text: "Sourcing Toys" },
  { path: "/zh", text: "Sourcing Toys" },
  { path: "/es", text: "Sourcing Toys" },
  { path: "/ar", text: "Sourcing Toys" },
  { path: "/en/products", text: "Product Finder" },
  {
    path: "/en/products/marble-run-building-blocks",
    text: "Marble Run Building Blocks",
  },
  { path: "/en/factories", text: "Export-ready toy factories" },
  {
    path: "/en/factories/shantou-chenghai-yaxing",
    text: "Shantou Chenghai Yaxing Toys Factory",
  },
  { path: "/en/rfq", text: "Inquiry Pipeline" },
  { path: "/en/rfq/demo-rfq-1001", text: "Transforming Robot Car Toy" },
  { path: "/en/account", text: "Please log in to manage your account" },
  { path: "/en/account/orders", text: "No orders yet" },
  { path: "/en/account/orders/mock-order", text: "Order Detail" },
  { path: "/en/account/addresses", text: "My Addresses" },
  { path: "/en/auth/login", text: "Welcome Back" },
  { path: "/en/auth/register", text: "Buyer Onboarding" },
  { path: "/en/cart", text: "Your cart is empty" },
  { path: "/en/checkout", text: "Your cart is empty" },
  {
    path: "/en/checkout/success?order_id=test_order",
    text: "Order Confirmed",
  },
]

test.beforeEach(async ({ page }) => {
  const clientErrors: string[] = []

  page.on("pageerror", (error) => {
    clientErrors.push(error.message)
  })

  page.on("console", (message) => {
    if (message.type() !== "error") {
      return
    }

    const text = message.text()
    if (
      /favicon|Failed to load resource: the server responded with a status of 404/i.test(
        text
      )
    ) {
      return
    }

    clientErrors.push(text)
  })
  ;(page as Page & { __clientErrors?: string[] }).__clientErrors = clientErrors

  await mockStoreApi(page)
})

test.afterEach(async ({ page }) => {
  const clientErrors =
    (page as Page & { __clientErrors?: string[] }).__clientErrors || []

  expect(clientErrors, clientErrors.join("\n")).toEqual([])
})

for (const route of smokeRoutes) {
  test(`renders ${route.path}`, async ({ page }) => {
    await page.goto(route.path)

    await expect(page.locator("body")).toContainText(route.text)
    await expect(page.getByText("TFShop").first()).toBeVisible()
    await expectVisibleImagesToLoad(page)
    await expectNoHorizontalOverflow(page)
  })
}

test("product workbench supports search, view switching, and RFQ basket flow", async ({
  page,
}) => {
  await page.goto("/en/products")

  const productSearch = page
    .locator('input[placeholder="Search toys, SKU, material, or factory..."]')
    .last()

  await productSearch.fill("teddy")
  const results = page.locator("section.min-w-0")
  await expect(page.getByText("Soft Plush Teddy Bear").first()).toBeVisible()
  await expect(results.getByText("Transforming Robot Car Toy")).toHaveCount(0)

  await page.getByRole("button", { name: "Grid view" }).click()
  await expect(
    page.getByRole("link", { name: /Soft Plush Teddy Bear/ }).first()
  ).toBeVisible()

  await page.getByRole("button", { name: "List view" }).click()

  const basket = page.locator("aside").filter({ hasText: "RFQ Basket" })
  await basket.getByRole("button", { name: "Clear" }).click()
  await expect(
    basket.getByRole("button", { name: "Submit RFQ (0)" })
  ).toBeDisabled()

  await page
    .getByRole("button", { name: /Add to RFQ/ })
    .first()
    .click()
  await expect(
    basket.getByRole("button", { name: "Submit RFQ (1)" })
  ).toBeEnabled()

  await basket.getByRole("button", { name: "Submit RFQ (1)" }).click()
  await expect(page).toHaveURL(/\/en\/rfq\?/)
  await expect(
    page.getByText("You have product info ready for a quote request.")
  ).toBeVisible()
})

test("product detail starts a prefilled quote request", async ({ page }) => {
  await page.goto("/en/products/marble-run-building-blocks")

  await page.getByRole("button", { name: "Request Quote" }).click()

  await expect(page).toHaveURL(/\/en\/rfq\?/)
  await expect(
    page.getByText("You have product info ready for a quote request.")
  ).toBeVisible()
})

test("RFQ form submits successfully against mocked storefront API", async ({
  page,
}) => {
  await page.goto(
    "/en/rfq?product_id=demo-robot&product_title=Transforming%20Robot%20Car%20Toy"
  )

  await page.getByRole("button", { name: "Create Inquiry" }).click()
  await page.getByLabel("Quantity").fill("500")
  await page.getByLabel("Target Price").fill("$1.50")
  await page
    .getByLabel("Requirements")
    .fill("Need export carton marks, EN71 files, and sample timeline.")
  await page.getByRole("button", { name: "Submit Inquiry" }).click()

  await expect(page.getByText("Inquiry submitted successfully!")).toBeVisible()
})

test("address page opens and closes the create form", async ({ page }) => {
  await page.goto("/en/account/addresses")

  await page.getByRole("button", { name: "Add New Address" }).first().click()
  await expect(
    page.getByRole("heading", { name: "Add New Address" })
  ).toBeVisible()

  await page.getByRole("button", { name: "Cancel" }).last().click()
  await expect(page.getByText("No addresses saved yet.")).toBeVisible()
})

test("register form validates password confirmation", async ({ page }) => {
  await page.goto("/en/auth/register")

  await page.getByLabel("First Name").fill("Ada")
  await page.getByLabel("Last Name").fill("Buyer")
  await page.getByLabel("Email").fill("ada@example.com")
  await page.getByLabel("Password", { exact: true }).fill("password-one")
  await page.getByLabel("Confirm Password").fill("password-two")
  await page.getByRole("button", { name: "Register" }).click()

  await expect(page.getByText("Passwords do not match")).toBeVisible()
})

test("mobile menu exposes primary navigation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-mobile", "mobile-only flow")

  await page.goto("/en")
  await page.getByRole("button", { name: "Menu" }).click()

  const productsLink = page.getByRole("link", {
    name: "Products",
    exact: true,
  })

  await expect(productsLink).toBeVisible()
  await productsLink.click()
  await expect(page).toHaveURL(/\/en\/products$/)
})

async function mockStoreApi(page: Page) {
  await page.route("**/store/**", async (route) => {
    const url = new URL(route.request().url())
    const path = url.pathname
    const method = route.request().method()

    if (path.startsWith("/store/products")) {
      return fulfillJson(route, {
        products: [],
        count: 0,
        limit: Number(url.searchParams.get("limit") || 20),
        offset: 0,
      })
    }

    if (path === "/store/factories") {
      return fulfillJson(route, { factories: [], count: 0 })
    }

    if (path.startsWith("/store/factories/")) {
      return fulfillJson(route, { factory: null })
    }

    if (path === "/store/rfq" && method === "POST") {
      return fulfillJson(route, {
        rfq: {
          id: "mock-rfq",
          status: "submitted",
        },
      })
    }

    if (path === "/store/rfq") {
      return fulfillJson(route, { rfqs: [] })
    }

    if (path.endsWith("/messages")) {
      return fulfillJson(route, {
        message: {
          id: "mock-message",
          content: "Thanks, please confirm.",
        },
      })
    }

    if (path.startsWith("/store/rfq/")) {
      const id = path.split("/").pop() || "demo-rfq-1001"

      return fulfillJson(route, {
        rfq: {
          id,
          product_title: "Transforming Robot Car Toy",
          status: "submitted",
          quantity: 500,
          quoted_price: "$1.45 - $1.85",
          target_price: "$1.45 - $1.85",
          requirements:
            "Please quote EXW and FOB Shenzhen pricing with EN71/CPC files.",
          quoted_lead_time: "18-25 days",
          quoted_terms: "30% deposit, 70% before shipment",
          created_at: new Date("2026-01-01T00:00:00Z").toISOString(),
          updated_at: new Date("2026-01-02T00:00:00Z").toISOString(),
          messages: [
            {
              id: "mock-message-1",
              sender_type: "buyer",
              content: "We need a first test order after sample approval.",
              created_at: new Date("2026-01-01T00:00:00Z").toISOString(),
            },
          ],
        },
      })
    }

    if (path === "/store/orders") {
      return fulfillJson(route, { orders: [] })
    }

    if (path.startsWith("/store/orders/")) {
      const id = path.split("/").pop() || "mock-order"

      return fulfillJson(route, {
        order: {
          id,
          display_id: 1001,
          status: "Processing",
          created_at: new Date("2026-01-01T00:00:00Z").toISOString(),
          subtotal: 23500,
          shipping_total: 3000,
          tax_total: 0,
          total: 26500,
          shipping_address: {
            first_name: "Ada",
            last_name: "Buyer",
            address_1: "88 Market Street",
            city: "San Francisco",
            province: "CA",
            postal_code: "94105",
          },
          items: [
            {
              id: "item_mock",
              title: "Marble Run Building Blocks",
              quantity: 100,
              unit_price: 235,
              subtotal: 23500,
            },
          ],
        },
      })
    }

    if (path.includes("/customers/me/addresses")) {
      if (method === "POST") {
        return fulfillJson(route, { address: { id: "addr_mock" } })
      }

      return fulfillJson(route, { addresses: [] })
    }

    if (path.includes("/customers/me")) {
      return fulfillJson(route, { customer: null })
    }

    if (path.includes("/carts")) {
      return fulfillJson(route, {
        cart: {
          id: "cart_mock",
          items: [],
          subtotal: 0,
          shipping_total: 0,
          total: 0,
        },
      })
    }

    return fulfillJson(route, {})
  })

  await page.route("http://localhost:9000/auth/**", async (route) => {
    return fulfillJson(route, { token: "mock-token" })
  })

  await page.route("**/auth/session", async (route) => {
    if (route.request().method() === "DELETE") {
      return route.fulfill({ status: 204 })
    }

    return fulfillJson(route, { token: "mock-token" })
  })
}

async function fulfillJson(route: Route, body: unknown) {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(body),
  })
}

async function expectVisibleImagesToLoad(page: Page) {
  await page.waitForLoadState("domcontentloaded")

  await page.waitForFunction(
    () => {
      return Array.from(document.images)
        .filter((image) => {
          const rect = image.getBoundingClientRect()
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= window.innerHeight &&
            rect.left <= window.innerWidth
          )
        })
        .every((image) => image.complete && image.naturalWidth > 0)
    },
    null,
    { timeout: 15_000 }
  )

  const brokenImages = await page
    .locator("img:visible")
    .evaluateAll((images) =>
      images
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.getAttribute("alt") || image.getAttribute("src"))
    )

  expect(brokenImages).toEqual([])
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const width = Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth
    )

    return width - window.innerWidth
  })

  expect(overflow).toBeLessThanOrEqual(2)
}
