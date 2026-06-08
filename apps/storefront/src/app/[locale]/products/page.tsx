"use client"

import { useMemo, useState } from "react"
import { Link, useRouter } from "@/i18n/routing"
import {
  ArrowRight,
  Check,
  Grid2X2,
  ListFilter,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import { ProductCard } from "@/components/product/product-card"
import { ProductWorkbenchRow } from "@/components/product/product-workbench-row"
import { EmptyState, Rating } from "@/components/ui/storefront"
import {
  categories,
  demoFactories,
  demoProducts,
  productImage,
  productMoq,
  productPrice,
  rfqBasketProducts,
  type StorefrontProduct,
} from "@/lib/storefront-data"
import { formatStorefrontNumber } from "@/lib/format"

export default function ProductListPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"list" | "grid">("list")
  const [basket, setBasket] = useState<StorefrontProduct[]>(rfqBasketProducts)
  const { data, isLoading } = useProducts({
    limit: 20,
    q: search || undefined,
  })

  const products: StorefrontProduct[] = data?.products?.length
    ? data.products
    : demoProducts

  const filteredProducts = useMemo(() => {
    if (!search) return products
    const term = search.toLowerCase()
    return products.filter((product) =>
      product.title.toLowerCase().includes(term)
    )
  }, [products, search])

  const addToBasket = (product: StorefrontProduct) => {
    setBasket((current) =>
      current.some((item) => item.id === product.id)
        ? current
        : [...current, product]
    )
  }

  const removeFromBasket = (id: string) => {
    setBasket((current) => current.filter((item) => item.id !== id))
  }

  const submitRfq = () => {
    const firstProduct = basket[0]
    const params = new URLSearchParams()
    if (firstProduct?.id) params.set("product_id", firstProduct.id)
    if (firstProduct?.title) params.set("product_title", firstProduct.title)
    router.push(`/rfq?${params.toString()}`)
  }

  const totalQty = basket.reduce(
    (sum, product) =>
      sum + Number((product as any).quantity || productMoq(product)),
    0
  )

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <section className="mb-5 grid gap-4 lg:grid-cols-[320px_1fr_260px]">
          <div className="panel p-4">
            <p className="text-ink-500 text-xs font-semibold">Welcome back,</p>
            <h1 className="text-ink-900 mt-1 text-xl font-extrabold">
              Global Imports LLC
            </h1>
            <span className="bg-brand-50 text-brand-700 mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold">
              Verified Buyer
            </span>
            <div className="mt-5">
              <div className="text-ink-500 mb-2 flex justify-between text-xs font-medium">
                <span>Credit Line: USD 50,000</span>
                <span>Used: USD 12,350</span>
              </div>
              <div className="bg-surface-200 h-2 overflow-hidden rounded-full">
                <div className="bg-brand-700 h-full w-2/5 rounded-full" />
              </div>
            </div>
          </div>

          <div className="panel divide-surface-200 grid grid-cols-2 divide-x p-4 md:grid-cols-4">
            {[
              ["Active Inquiries", "8"],
              ["Unread Quotes", "3"],
              ["Saved Searches", "12"],
              ["Watchlist", "24"],
            ].map(([label, value]) => (
              <div key={label} className="px-4 py-2">
                <p className="text-ink-500 text-xs font-semibold">{label}</p>
                <p className="text-ink-900 mt-2 text-3xl font-extrabold">
                  {value}
                </p>
                <Link
                  href="/rfq"
                  className="text-brand-700 mt-3 inline-flex items-center gap-1 text-xs font-bold"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="panel p-4">
            <p className="text-ink-500 text-xs font-semibold">Market Insight</p>
            <p className="text-ink-900 mt-2 text-sm font-extrabold">
              Trending: Building Blocks
            </p>
            <div className="from-brand-50 to-brand-100 mt-5 h-16 rounded-lg bg-gradient-to-r via-white" />
            <p className="text-brand-700 mt-3 text-xs font-bold">+24% demand</p>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)_300px] xl:grid-cols-[240px_minmax(0,1fr)_320px]">
          <aside className="space-y-4">
            <div className="panel p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-ink-900 text-lg font-extrabold">
                  Product Finder
                </h2>
                <SlidersHorizontal className="text-brand-700 h-5 w-5" />
              </div>
              <div className="mb-5 grid grid-cols-2 gap-2">
                <button className="border-surface-300 text-ink-700 rounded-lg border px-3 py-2 text-xs font-bold">
                  Clear
                </button>
                <button className="border-brand-300 text-brand-700 rounded-lg border px-3 py-2 text-xs font-bold">
                  Save Search
                </button>
              </div>
              <div className="space-y-5">
                <FilterBlock title="My Saved Searches">
                  <button className="text-ink-700 block text-left text-xs font-semibold">
                    Low MOQ Action Figures
                    <span className="text-ink-400 block font-normal">
                      312 results
                    </span>
                  </button>
                  <button className="text-ink-700 block text-left text-xs font-semibold">
                    Eco-friendly Wooden Toys
                    <span className="text-ink-400 block font-normal">
                      180 results
                    </span>
                  </button>
                </FilterBlock>
                <FilterBlock title="Category">
                  {categories.slice(0, 6).map((category, i) => (
                    <label
                      key={category.label}
                      className="text-ink-600 flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked={i === 0}
                          className="border-surface-300 text-brand-700 h-4 w-4 rounded"
                        />
                        {category.label}
                      </span>
                      <span className="text-ink-400">{category.count}</span>
                    </label>
                  ))}
                </FilterBlock>
                <FilterBlock title="MOQ (pcs)">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="input-field px-3 py-2"
                      defaultValue="100"
                    />
                    <input
                      className="input-field px-3 py-2"
                      defaultValue="5000"
                    />
                  </div>
                  <div className="bg-brand-100 mt-3 h-2 rounded-full">
                    <div className="bg-brand-700 h-2 w-3/4 rounded-full" />
                  </div>
                </FilterBlock>
                <FilterBlock title="Certification">
                  {["EN71", "CPC", "ASTM F963", "CE"].map((cert) => (
                    <label
                      key={cert}
                      className="text-ink-600 flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="border-surface-300 text-brand-700 h-4 w-4 rounded"
                        />
                        {cert}
                      </span>
                      <span className="text-ink-400">1,980</span>
                    </label>
                  ))}
                </FilterBlock>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="panel overflow-hidden">
              <div className="border-surface-200 border-b p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="relative flex-1">
                    <Search className="text-ink-400 absolute left-3 top-3 h-5 w-5" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="input-field h-11 pl-10"
                      placeholder="Search toys, SKU, material, or factory..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-ink-700 text-sm font-bold">
                      {filteredProducts.length || 0} results
                    </span>
                    <select className="border-surface-300 text-ink-700 h-10 rounded-lg border bg-white px-3 text-sm font-semibold">
                      <option>Best Match</option>
                      <option>Lowest MOQ</option>
                      <option>Fastest Response</option>
                    </select>
                    <button
                      onClick={() => setView("grid")}
                      aria-label="Grid view"
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                        view === "grid"
                          ? "border-brand-300 bg-brand-50 text-brand-700"
                          : "border-surface-300 text-ink-500"
                      }`}
                    >
                      <Grid2X2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      aria-label="List view"
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                        view === "list"
                          ? "border-brand-300 bg-brand-50 text-brand-700"
                          : "border-surface-300 text-ink-500"
                      }`}
                    >
                      <ListFilter className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Action Figures", "MOQ <= 5000", "EN71", "In Stock"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="bg-surface-100 text-ink-600 rounded-lg px-3 py-1.5 text-xs font-bold"
                      >
                        {tag}
                      </span>
                    )
                  )}
                  <button className="text-brand-700 text-xs font-bold">
                    Clear all
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4 p-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-surface-100 h-40 animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : filteredProducts.length ? (
                view === "list" ? (
                  <div>
                    {filteredProducts.map((product) => (
                      <ProductWorkbenchRow
                        key={product.id}
                        product={product}
                        onAdd={addToBasket}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )
              ) : (
                <div className="p-6">
                  <EmptyState
                    title="No matching products"
                    description="Try removing a filter or searching another toy category."
                  />
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="panel p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-ink-900 text-lg font-extrabold">
                  RFQ Basket
                  <span className="bg-brand-700 ml-2 rounded-full px-2 py-0.5 text-xs text-white">
                    {basket.length}
                  </span>
                </h2>
                <button
                  onClick={() => setBasket([])}
                  className="text-ink-400 hover:text-coral-600 text-xs font-bold"
                >
                  Clear
                </button>
              </div>
              <div className="bg-surface-50 mb-4 rounded-lg p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-500">Est. Total Qty</span>
                  <strong>{formatStorefrontNumber(totalQty)} pcs</strong>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-ink-500">Target Price Range</span>
                  <strong>$1.45 - $8.90</strong>
                </div>
              </div>
              <button
                onClick={submitRfq}
                disabled={!basket.length}
                className="btn-coral w-full"
              >
                Submit RFQ ({basket.length})
              </button>
              <button className="btn-outline mt-2 w-full">
                Request Sample
              </button>
              <div className="mt-4 space-y-3">
                {basket.map((product) => (
                  <div
                    key={product.id}
                    className="border-surface-200 flex gap-3 border-b pb-3 last:border-b-0"
                  >
                    <img
                      src={productImage(product)}
                      alt={product.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-ink-900 line-clamp-2 text-xs font-extrabold">
                        {product.title}
                      </p>
                      <p className="text-ink-500 mt-1 text-xs">
                        MOQ: {productMoq(product)} pcs
                      </p>
                      <p className="text-brand-700 text-xs font-bold">
                        {productPrice(product)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromBasket(product.id)}
                      className="text-ink-300 hover:text-coral-600 h-6 w-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-brand-800 text-sm font-extrabold">
                  Verified Suppliers
                </h2>
                <Link
                  href="/factories"
                  className="text-brand-700 text-xs font-bold"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {demoFactories.slice(0, 3).map((factory) => (
                  <Link
                    key={factory.id}
                    href={`/factories/${factory.slug}`}
                    className="border-surface-200 hover:border-brand-200 hover:bg-brand-50 block rounded-lg border p-3 transition"
                  >
                    <img
                      src={
                        factory.cover_image ||
                        "/images/tfshop-hero-toy-catalog.jpg"
                      }
                      alt={factory.name}
                      className="mb-3 h-20 w-full rounded-lg object-cover"
                    />
                    <p className="text-ink-900 text-sm font-extrabold">
                      {factory.name}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <Rating value="4.9" count="128" />
                      <span className="bg-brand-50 text-brand-700 rounded px-2 py-1 font-bold">
                        Verified
                      </span>
                    </div>
                    <div className="text-ink-600 mt-3 grid grid-cols-2 gap-2 text-xs">
                      <span>98% On-time</span>
                      <span>&lt;2h Response</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="bg-brand-50 text-ink-600 mt-4 rounded-lg p-3 text-xs">
                <p className="text-brand-800 mb-2 flex items-center gap-2 font-extrabold">
                  <Check className="h-4 w-4" /> Trade Assurance
                </p>
                Secure payments, quality guaranteed, on-time delivery, and
                after-sales support.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function FilterBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border-surface-200 border-t pt-4">
      <h3 className="text-ink-900 mb-3 text-xs font-extrabold uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}
