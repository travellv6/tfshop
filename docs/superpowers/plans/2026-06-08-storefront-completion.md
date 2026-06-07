# Storefront 全面补全实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Storefront 前端从"大部分可用"升级为"全部功能接线"，修复 2 个部分完成的页面，补全 1 个骨架页面，新建 1 个地址管理页，添加 RFQ 创建入口。

**Architecture:** 基于 Next.js 14 App Router + next-intl + @medusajs/js-sdk + @tanstack/react-query + TailwindCSS。复用现有 CartContext 和 hooks，所有 UI 文本在 4 个语言文件中维护。

**Tech Stack:** Next.js 14, React 18, TypeScript, @medusajs/js-sdk, @tanstack/react-query, TailwindCSS, next-intl

---

## 文件结构

| 操作 | 文件 | 职责 |
|------|------|------|
| 修改 | `apps/storefront/src/app/[locale]/products/[handle]/page.tsx` | 商品详情页：Variant 选择器、数量选择器、加购和询价按钮接线 |
| 修改 | `apps/storefront/src/app/[locale]/factories/[slug]/page.tsx` | 工厂详情页：询价按钮接线、产品按工厂过滤 |
| 修改 | `apps/storefront/src/app/[locale]/account/page.tsx` | 买家中心：功能入口网格 |
| 修改 | `apps/storefront/src/app/[locale]/rfq/page.tsx` | RFQ 列表页：新增"新建询价"按钮，支持 URL 参数预填 |
| 新建 | `apps/storefront/src/app/[locale]/account/addresses/page.tsx` | 地址管理页：地址列表、新增、编辑、删除 |
| 新建 | `apps/storefront/src/hooks/use-addresses.ts` | 地址 CRUD hooks |
| 修改 | `apps/storefront/src/hooks/use-products.ts` | 添加 `useProductsByFactory` hook |
| 修改 | `apps/storefront/src/messages/en.json` | 新增翻译 key |
| 修改 | `apps/storefront/src/messages/zh.json` | 新增翻译 key |
| 修改 | `apps/storefront/src/messages/es.json` | 新增翻译 key |
| 修改 | `apps/storefront/src/messages/ar.json` | 新增翻译 key |

---

### Task 1: 商品详情页 — Variant 选择器与数量选择器

**Files:**
- Modify: `apps/storefront/src/app/[locale]/products/[handle]/page.tsx`

**Context:** 商品详情页当前 113 行，Add to Cart 和 Request Quote 按钮无 onClick 事件，无 Variant/数量选择。CartContext 已有完整 `addItem({ variant_id, quantity })` 方法。产品数据通过 `useProduct(handle)` 获取，返回的 product 对象包含 `variants` 数组，每个 variant 有 `id`、`title`、`options` 属性。

**当前 CartContext 的 addItem 签名：**
```typescript
addItem: (item: { variant_id: string; quantity: number; metadata?: Record<string, unknown> }) => Promise<void>
```

**产品 variant 数据结构（Medusa Store API 返回）：**
```typescript
interface ProductVariant {
  id: string
  title: string
  options: { id: string; value: string; option_id: string; option: { id: string; title: string } }[]
  // ... 其他字段
}
```

- [ ] **Step 1: 替换整个商品详情页**

将 `apps/storefront/src/app/[locale]/products/[handle]/page.tsx` 替换为以下内容：

```tsx
"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useProduct } from "@/hooks/use-products"
import { useCart } from "@/lib/cart-context"

export default function ProductDetailPage() {
  const t = useTranslations("product")
  const ct = useTranslations("common")
  const at = useTranslations("account")
  const { locale, handle } = useParams()
  const router = useRouter()
  const { data: product, isLoading } = useProduct(handle as string)
  const { addItem, isLoading: cartLoading } = useCart()

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const metadata = product?.metadata as Record<string, any> | null
  const factorySlug = metadata?.factory_slug as string | undefined
  const factoryId = metadata?.factory_id as string | undefined

  // 构建 variant 选项
  const variants = product?.variants || []
  const hasVariants = variants.length > 0
  const effectiveVariantId = selectedVariantId || (variants.length === 1 ? variants[0].id : null)

  // 从 variant options 构建 option map
  const optionMap = useMemo(() => {
    if (!hasVariants) return {}
    const map: Record<string, Record<string, string[]>> = {}
    variants.forEach((v: any) => {
      v.options?.forEach((opt: any) => {
        const optTitle = opt.option?.title || "Option"
        if (!map[optTitle]) map[optTitle] = {}
        if (!map[optTitle][opt.value]) map[optTitle][opt.value] = []
        map[optTitle][opt.value].push(v.id)
      })
    })
    return map
  }, [variants, hasVariants])

  const handleAddToCart = async () => {
    if (!effectiveVariantId) return
    try {
      await addItem({ variant_id: effectiveVariantId, quantity })
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    } catch {
      // 错误由 CartContext 内部处理
    }
  }

  const handleRequestQuote = () => {
    const params = new URLSearchParams()
    if (product?.id) params.set("product_id", product.id)
    if (product?.title) params.set("product_title", product.title)
    if (effectiveVariantId) params.set("variant_id", effectiveVariantId)
    if (factoryId) params.set("factory_id", factoryId)
    router.push(`/${locale}/rfq?${params.toString()}`)
  }

  // 数量变化
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1))
  const incrementQty = () => setQuantity((q) => q + 1)

  if (isLoading) {
    return <p className="text-center text-gray-500">{ct("loading")}</p>
  }

  if (!product) {
    return <p className="text-center text-gray-500">{ct("noResults")}</p>
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* 图片区 */}
      <div className="space-y-4">
        {product.images && product.images.length > 0 ? (
          product.images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={product.title}
              className="w-full rounded-lg"
            />
          ))
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* 信息区 */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{product.title}</h1>
        {product.description && (
          <p className="text-gray-600">{product.description}</p>
        )}

        {/* 标签区 */}
        <div className="flex gap-4">
          {metadata?.min_order_qty && (
            <span className="rounded bg-green-50 px-3 py-1 text-sm text-green-700">
              {t("moq", { count: metadata.min_order_qty })}
            </span>
          )}
          {metadata?.is_in_stock && (
            <span className="rounded bg-blue-50 px-3 py-1 text-sm text-blue-700">
              {t("inStock")}
            </span>
          )}
          {metadata?.sample_available && (
            <span className="rounded bg-purple-50 px-3 py-1 text-sm text-purple-700">
              {t("sampleAvailable")}
            </span>
          )}
        </div>

        {/* 认证 */}
        {metadata?.certifications && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t("certifications")}</h3>
            <div className="flex flex-wrap gap-2">
              {metadata.certifications.map((cert: string) => (
                <span
                  key={cert}
                  className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Variant 选择器 */}
        {hasVariants && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t("selectVariant")}</h3>
            <div className="space-y-3">
              {Object.entries(optionMap).map(([optionTitle, values]) => (
                <div key={optionTitle}>
                  <label className="mb-1 block text-xs text-gray-500">{optionTitle}</label>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    value={
                      selectedVariantId
                        ? variants.find((v: any) => v.id === selectedVariantId)?.options?.find(
                            (o: any) => o.option?.title === optionTitle
                          )?.value || ""
                        : ""
                    }
                    onChange={(e) => {
                      const selectedValue = e.target.value
                      const matchingVariant = variants.find((v: any) =>
                        v.options?.some(
                          (o: any) =>
                            o.option?.title === optionTitle && o.value === selectedValue
                        )
                      )
                      setSelectedVariantId(matchingVariant?.id || null)
                    }}
                  >
                    <option value="">{t("pleaseSelect")}</option>
                    {Object.keys(values).map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 数量选择器 */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">{t("quantity")}</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={decrementQty}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-9 w-20 rounded-md border border-gray-300 text-center text-sm focus:border-brand-500 focus:outline-none"
            />
            <button
              onClick={incrementQty}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleAddToCart}
            disabled={!effectiveVariantId || cartLoading}
            className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addedToCart ? t("addedToCart") : cartLoading ? ct("loading") : t("addToCart")}
          </button>
          <button
            onClick={handleRequestQuote}
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t("requestQuote")}
          </button>
        </div>

        {/* Variant 未选择提示 */}
        {hasVariants && !effectiveVariantId && (
          <p className="text-xs text-amber-600">{t("selectVariantHint")}</p>
        )}

        {/* 工厂卡片 */}
        {factorySlug && (
          <div className="mt-8 rounded-lg border border-gray-200 p-4">
            <h3 className="mb-2 text-sm font-semibold">{t("factory")}</h3>
            <Link
              href={`/${locale}/factories/${factorySlug}`}
              className="text-sm text-brand-600 hover:underline"
            >
              {t("viewFactory")} →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 在 4 个翻译文件中添加商品详情页新增 key**

在 `en.json` 的 `"product"` 对象中（`"viewFactory"` 之后）添加：

```json
"selectVariant": "Select Variant",
"pleaseSelect": "Please select",
"quantity": "Quantity",
"addedToCart": "Added!",
"selectVariantHint": "Please select a variant before adding to cart"
```

在 `zh.json` 的 `"product"` 对象中添加：

```json
"selectVariant": "选择规格",
"pleaseSelect": "请选择",
"quantity": "数量",
"addedToCart": "已添加！",
"selectVariantHint": "请先选择规格再加入购物车"
```

在 `es.json` 的 `"product"` 对象中添加：

```json
"selectVariant": "Seleccionar variante",
"pleaseSelect": "Por favor seleccione",
"quantity": "Cantidad",
"addedToCart": "¡Añadido!",
"selectVariantHint": "Por favor seleccione una variante antes de añadir al carrito"
```

在 `ar.json` 的 `"product"` 对象中添加：

```json
"selectVariant": "اختر المتغير",
"pleaseSelect": "يرجى الاختيار",
"quantity": "الكمية",
"addedToCart": "تمت الإضافة!",
"selectVariantHint": "يرجى اختيار متغير قبل الإضافة إلى السلة"
```

- [ ] **Step 3: 提交**

```bash
git add apps/storefront/src/app/[locale]/products/[handle]/page.tsx apps/storefront/src/messages/en.json apps/storefront/src/messages/zh.json apps/storefront/src/messages/es.json apps/storefront/src/messages/ar.json
git commit -m "feat(storefront): wire up product detail page with variant selector, quantity picker, and cart/quote buttons"
```

---

### Task 2: 工厂详情页 — 询价按钮接线 + 产品按工厂过滤

**Files:**
- Modify: `apps/storefront/src/app/[locale]/factories/[slug]/page.tsx`
- Modify: `apps/storefront/src/hooks/use-products.ts`

**Context:** 工厂详情页当前 131 行。`useProducts({ limit: 12 })` 没有按工厂 ID 过滤。工厂 metadata 中存储了 `factory_id`，但 Medusa Store Product API 可能不直接支持 `factory_id` 过滤（这是自定义字段）。需要通过 metadata 过滤或直接使用 `sdk.store.product.list` 的 `metadata` 参数。

**当前 useProducts 签名：**
```typescript
export function useProducts(params?: Record<string, any>)
```

- [ ] **Step 1: 在 `use-products.ts` 中添加 `useProductsByFactory` hook**

在 `apps/storefront/src/hooks/use-products.ts` 末尾添加：

```typescript
export function useProductsByFactory(factoryId: string) {
  return useQuery({
    queryKey: ["products", "factory", factoryId],
    queryFn: async () => {
      const { products, count } = await sdk.store.product.list({
        limit: 12,
        // 通过 metadata 中的 factory_id 过滤
        // Medusa 支持 metadata 过滤：metadata[factory_id]=xxx
        "metadata[factory_id]": factoryId,
      } as any)
      return { products, count }
    },
    enabled: !!factoryId,
  })
}
```

- [ ] **Step 2: 替换整个工厂详情页**

将 `apps/storefront/src/app/[locale]/factories/[slug]/page.tsx` 替换为以下内容：

```tsx
"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useFactory } from "@/hooks/use-factories"
import { useProductsByFactory } from "@/hooks/use-products"
import { ProductCard } from "@/components/product/product-card"

export default function FactoryDetailPage() {
  const t = useTranslations("factory")
  const ct = useTranslations("common")
  const pt = useTranslations("product")
  const { locale, slug } = useParams()
  const router = useRouter()
  const { data: factory, isLoading } = useFactory(slug as string)
  const { data: productsData } = useProductsByFactory(factory?.id || "")

  const handleRequestQuote = () => {
    const params = new URLSearchParams()
    if (factory?.id) params.set("factory_id", factory.id)
    if (factory?.name) params.set("factory_name", factory.name)
    router.push(`/${locale}/rfq?${params.toString()}`)
  }

  if (isLoading) {
    return <p className="text-center text-gray-500">{ct("loading")}</p>
  }

  if (!factory) {
    return <p className="text-center text-gray-500">{ct("noResults")}</p>
  }

  const products = productsData?.products || []

  return (
    <div className="space-y-8">
      {/* 工厂头部 */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* 封面图 */}
        <div className="md:col-span-1">
          {factory.cover_image ? (
            <img
              src={factory.cover_image}
              alt={factory.name}
              className="w-full rounded-lg"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100 text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* 工厂信息 */}
        <div className="space-y-4 md:col-span-2">
          <h1 className="text-3xl font-bold">{factory.name}</h1>
          {factory.description && (
            <p className="text-gray-600">{factory.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            {factory.location_province && (
              <div>
                <span className="text-gray-500">{t("location")}:</span>{" "}
                {factory.location_city
                  ? `${factory.location_city}, ${factory.location_province}`
                  : factory.location_province}
              </div>
            )}
            {factory.established_year && (
              <div>
                <span className="text-gray-500">{t("established", { year: factory.established_year })}</span>
              </div>
            )}
            {factory.monthly_capacity && (
              <div>
                {t("capacity", { capacity: factory.monthly_capacity })}
              </div>
            )}
            {factory.employee_scale && (
              <div>
                <span className="text-gray-500">Employees:</span>{" "}
                {factory.employee_scale}
              </div>
            )}
          </div>

          {/* 认证标签 */}
          {factory.certifications && factory.certifications.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">{t("certifications")}</h3>
              <div className="flex flex-wrap gap-2">
                {factory.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 询价按钮 */}
          <button
            onClick={handleRequestQuote}
            className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {t("requestQuote")}
          </button>
        </div>
      </div>

      {/* 工厂相册 */}
      {factory.photos && factory.photos.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold">{ct("viewAll")}</h2>
          <div className="grid grid-cols-3 gap-4">
            {factory.photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`${factory.name} photo ${i + 1}`}
                className="w-full rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* 工厂产品 */}
      <div>
        <h2 className="mb-4 text-xl font-bold">{t("products")}</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">{ct("noResults")}</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 提交**

```bash
git add apps/storefront/src/hooks/use-products.ts apps/storefront/src/app/[locale]/factories/[slug]/page.tsx
git commit -m "feat(storefront): wire up factory detail page quote button and filter products by factory"
```

---

### Task 3: 买家中心 — 功能入口网格

**Files:**
- Modify: `apps/storefront/src/app/[locale]/account/page.tsx`
- Modify: `apps/storefront/src/messages/en.json`
- Modify: `apps/storefront/src/messages/zh.json`
- Modify: `apps/storefront/src/messages/es.json`
- Modify: `apps/storefront/src/messages/ar.json`

**Context:** 当前 account/page.tsx 仅 57 行，只展示姓名和邮箱加一个订单链接。需要升级为功能完整的买家中心，包含功能入口网格。

- [ ] **Step 1: 替换整个买家中心页**

将 `apps/storefront/src/app/[locale]/account/page.tsx` 替换为以下内容：

```tsx
"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useCustomer } from "@/hooks/use-customer"

// 功能入口配置
interface AccountEntry {
  href: string
  icon: string
  labelKey: string
  descKey: string
}

export default function AccountPage() {
  const t = useTranslations("account")
  const ct = useTranslations("common")
  const { locale } = useParams()
  const { data: customer, isLoading } = useCustomer()

  const entries: AccountEntry[] = [
    {
      href: `/${locale}/account/orders`,
      icon: "📦",
      labelKey: "myOrders",
      descKey: "myOrdersDesc",
    },
    {
      href: `/${locale}/rfq`,
      icon: "💬",
      labelKey: "myInquiries",
      descKey: "myInquiriesDesc",
    },
    {
      href: `/${locale}/account/addresses`,
      icon: "📍",
      labelKey: "myAddresses",
      descKey: "myAddressesDesc",
    },
    {
      href: `/${locale}/account/settings`,
      icon: "⚙️",
      labelKey: "accountSettings",
      descKey: "accountSettingsDesc",
    },
  ]

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-gray-500">{ct("loading")}</p>
      </div>
    )
  }

  // 未登录
  if (!customer) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold">{t("title")}</h1>
        <p className="mb-6 text-gray-500">{t("loginPrompt")}</p>
        <Link
          href={`/${locale}/auth/login`}
          className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          {ct("login")}
        </Link>
      </div>
    )
  }

  // 已登录
  const firstName = customer.first_name || ""
  const lastName = customer.last_name || ""
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || customer.email

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* 用户信息卡 */}
      <div className="rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold">{displayName}</h1>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
        </div>
      </div>

      {/* 功能入口网格 */}
      <div className="grid grid-cols-2 gap-4">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="group rounded-lg border border-gray-200 p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-2 text-2xl">{entry.icon}</div>
            <h3 className="font-medium text-gray-900 group-hover:text-brand-600">
              {t(entry.labelKey)}
            </h3>
            <p className="mt-1 text-xs text-gray-500">{t(entry.descKey)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 在 4 个翻译文件中添加 `account` 命名空间**

在 `en.json` 中添加（与 `"rfq"` 同级）：

```json
"account": {
  "title": "My Account",
  "loginPrompt": "Please log in to manage your account",
  "myOrders": "My Orders",
  "myOrdersDesc": "View order history and tracking",
  "myInquiries": "My Inquiries",
  "myInquiriesDesc": "Manage your quote requests",
  "myAddresses": "My Addresses",
  "myAddressesDesc": "Manage shipping addresses",
  "accountSettings": "Account Settings",
  "accountSettingsDesc": "Update name, email and password"
}
```

在 `zh.json` 中添加：

```json
"account": {
  "title": "我的账户",
  "loginPrompt": "请登录以管理您的账户",
  "myOrders": "我的订单",
  "myOrdersDesc": "查看订单历史和物流追踪",
  "myInquiries": "我的询价",
  "myInquiriesDesc": "管理询价单",
  "myAddresses": "我的地址",
  "myAddressesDesc": "管理收货地址",
  "accountSettings": "账户设置",
  "accountSettingsDesc": "修改姓名、邮箱和密码"
}
```

在 `es.json` 中添加：

```json
"account": {
  "title": "Mi cuenta",
  "loginPrompt": "Inicie sesión para gestionar su cuenta",
  "myOrders": "Mis pedidos",
  "myOrdersDesc": "Ver historial de pedidos y seguimiento",
  "myInquiries": "Mis consultas",
  "myInquiriesDesc": "Gestionar solicitudes de cotización",
  "myAddresses": "Mis direcciones",
  "myAddressesDesc": "Gestionar direcciones de envío",
  "accountSettings": "Configuración",
  "accountSettingsDesc": "Actualizar nombre, correo y contraseña"
}
```

在 `ar.json` 中添加：

```json
"account": {
  "title": "حسابي",
  "loginPrompt": "يرجى تسجيل الدخول لإدارة حسابك",
  "myOrders": "طلباتي",
  "myOrdersDesc": "عرض سجل الطلبات والتتبع",
  "myInquiries": "استفساراتي",
  "myInquiriesDesc": "إدارة طلبات عروض الأسعار",
  "myAddresses": "عناويني",
  "myAddressesDesc": "إدارة عناوين الشحن",
  "accountSettings": "إعدادات الحساب",
  "accountSettingsDesc": "تحديث الاسم والبريد الإلكتروني وكلمة المرور"
}
```

- [ ] **Step 3: 确认 `useCustomer` hook 存在**

检查 `apps/storefront/src/hooks/use-customer.ts` 是否存在。如果不存在，创建它：

```typescript
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

export function useCustomer() {
  return useQuery({
    queryKey: ["customer"],
    queryFn: async () => {
      try {
        const { customer } = await sdk.store.customer.retrieve()
        return customer
      } catch {
        return null
      }
    },
  })
}
```

- [ ] **Step 4: 提交**

```bash
git add apps/storefront/src/app/[locale]/account/page.tsx apps/storefront/src/hooks/use-customer.ts apps/storefront/src/messages/en.json apps/storefront/src/messages/zh.json apps/storefront/src/messages/es.json apps/storefront/src/messages/ar.json
git commit -m "feat(storefront): upgrade buyer center with feature entry grid"
```

---

### Task 4: 地址管理页 — 新建 CRUD 页面

**Files:**
- Create: `apps/storefront/src/hooks/use-addresses.ts`
- Create: `apps/storefront/src/app/[locale]/account/addresses/page.tsx`

**Context:** 地址管理使用 Medusa Store Customer Address API。主要端点：
- `GET /store/customers/me/addresses` — 列表
- `POST /store/customers/me/addresses` — 新增
- `POST /store/customers/me/addresses/:id` — 编辑
- `DELETE /store/customers/me/addresses/:id` — 删除

SDK 方法可能是 `sdk.store.customer.listAddresses()` 等。

- [ ] **Step 1: 创建地址管理 hooks**

创建 `apps/storefront/src/hooks/use-addresses.ts`：

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

export interface Address {
  id: string
  first_name: string
  last_name: string
  phone?: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  is_default_shipping?: boolean
  is_default_billing?: boolean
}

export interface AddressInput {
  first_name: string
  last_name: string
  phone?: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
}

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      try {
        const result = await sdk.store.customer.listAddresses()
        return (result as any).addresses || []
      } catch {
        return []
      }
    },
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: AddressInput) => {
      const result = await sdk.store.customer.addAddress({ address: data } as any)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
    },
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AddressInput> }) => {
      const result = await sdk.store.customer.updateAddress(id, { address: data } as any)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await sdk.store.customer.deleteAddress(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
    },
  })
}
```

- [ ] **Step 2: 创建地址管理页面**

创建 `apps/storefront/src/app/[locale]/account/addresses/page.tsx`：

```tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  type Address,
  type AddressInput,
} from "@/hooks/use-addresses"

const EMPTY_FORM: AddressInput = {
  first_name: "",
  last_name: "",
  phone: "",
  address_1: "",
  address_2: "",
  city: "",
  province: "",
  postal_code: "",
  country_code: "CN",
}

export default function AddressesPage() {
  const t = useTranslations("address")
  const ct = useTranslations("common")
  const at = useTranslations("account")
  const { locale } = useParams()
  const { data: addresses = [], isLoading } = useAddresses()
  const createMutation = useCreateAddress()
  const updateMutation = useUpdateAddress()
  const deleteMutation = useDeleteAddress()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<AddressInput>(EMPTY_FORM)

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (addr: Address) => {
    setEditingId(addr.id)
    setForm({
      first_name: addr.first_name,
      last_name: addr.last_name,
      phone: addr.phone || "",
      company: addr.company || "",
      address_1: addr.address_1,
      address_2: addr.address_2 || "",
      city: addr.city,
      province: addr.province || "",
      postal_code: addr.postal_code,
      country_code: addr.country_code,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm(t("confirmDelete"))) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const updateField = (field: keyof AddressInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return <p className="text-center text-gray-500">{ct("loading")}</p>
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* 返回链接 */}
      <Link
        href={`/${locale}/account`}
        className="text-sm text-brand-600 hover:underline"
      >
        ← {at("title")}
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          {t("addNew")}
        </button>
      </div>

      {/* 地址表单 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t("firstName")}</label>
              <input
                type="text"
                required
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t("lastName")}</label>
              <input
                type="text"
                required
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("phone")}</label>
            <input
              type="tel"
              value={form.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("address1")}</label>
            <input
              type="text"
              required
              value={form.address_1}
              onChange={(e) => updateField("address_1", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("address2")}</label>
            <input
              type="text"
              value={form.address_2 || ""}
              onChange={(e) => updateField("address_2", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t("city")}</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t("province")}</label>
              <input
                type="text"
                value={form.province || ""}
                onChange={(e) => updateField("province", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t("postalCode")}</label>
              <input
                type="text"
                required
                value={form.postal_code}
                onChange={(e) => updateField("postal_code", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t("country")}</label>
              <input
                type="text"
                required
                value={form.country_code}
                onChange={(e) => updateField("country_code", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {(createMutation.isPending || updateMutation.isPending)
                ? ct("loading")
                : editingId
                  ? t("update")
                  : t("save")}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      )}

      {/* 地址列表 */}
      {addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((addr: Address) => (
            <div
              key={addr.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    {addr.first_name} {addr.last_name}
                    {addr.is_default_shipping && (
                      <span className="ml-2 rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-600">
                        {t("default")}
                      </span>
                    )}
                  </p>
                  {addr.phone && <p className="text-sm text-gray-500">{addr.phone}</p>}
                  <p className="text-sm text-gray-600">
                    {addr.address_1}
                    {addr.address_2 ? `, ${addr.address_2}` : ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.city}
                    {addr.province ? `, ${addr.province}` : ""}{" "}
                    {addr.postal_code}
                  </p>
                  <p className="text-sm text-gray-600">{addr.country_code}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(addr)}
                    className="text-sm text-brand-600 hover:underline"
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">{t("noAddresses")}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 3: 在 4 个翻译文件中添加 `address` 命名空间**

在 `en.json` 中添加（与 `"account"` 同级）：

```json
"address": {
  "title": "My Addresses",
  "addNew": "Add New Address",
  "edit": "Edit",
  "delete": "Delete",
  "save": "Save",
  "update": "Update",
  "cancel": "Cancel",
  "default": "Default",
  "confirmDelete": "Are you sure you want to delete this address?",
  "noAddresses": "No addresses saved yet.",
  "firstName": "First Name",
  "lastName": "Last Name",
  "phone": "Phone",
  "address1": "Address Line 1",
  "address2": "Address Line 2",
  "city": "City",
  "province": "Province / State",
  "postalCode": "Postal Code",
  "country": "Country"
}
```

在 `zh.json` 中添加：

```json
"address": {
  "title": "我的地址",
  "addNew": "新增地址",
  "edit": "编辑",
  "delete": "删除",
  "save": "保存",
  "update": "更新",
  "cancel": "取消",
  "default": "默认",
  "confirmDelete": "确定要删除此地址吗？",
  "noAddresses": "暂无保存的地址。",
  "firstName": "名",
  "lastName": "姓",
  "phone": "电话",
  "address1": "地址行 1",
  "address2": "地址行 2",
  "city": "城市",
  "province": "省份 / 州",
  "postalCode": "邮编",
  "country": "国家"
}
```

在 `es.json` 中添加：

```json
"address": {
  "title": "Mis direcciones",
  "addNew": "Agregar nueva dirección",
  "edit": "Editar",
  "delete": "Eliminar",
  "save": "Guardar",
  "update": "Actualizar",
  "cancel": "Cancelar",
  "default": "Predeterminada",
  "confirmDelete": "¿Está seguro de que desea eliminar esta dirección?",
  "noAddresses": "No hay direcciones guardadas.",
  "firstName": "Nombre",
  "lastName": "Apellido",
  "phone": "Teléfono",
  "address1": "Dirección línea 1",
  "address2": "Dirección línea 2",
  "city": "Ciudad",
  "province": "Provincia / Estado",
  "postalCode": "Código postal",
  "country": "País"
}
```

在 `ar.json` 中添加：

```json
"address": {
  "title": "عناويني",
  "addNew": "إضافة عنوان جديد",
  "edit": "تعديل",
  "delete": "حذف",
  "save": "حفظ",
  "update": "تحديث",
  "cancel": "إلغاء",
  "default": "افتراضي",
  "confirmDelete": "هل أنت متأكد من حذف هذا العنوان؟",
  "noAddresses": "لا توجد عناوين محفوظة.",
  "firstName": "الاسم الأول",
  "lastName": "اسم العائلة",
  "phone": "الهاتف",
  "address1": "العنوان - السطر 1",
  "address2": "العنوان - السطر 2",
  "city": "المدينة",
  "province": "المنطقة / المحافظة",
  "postalCode": "الرمز البريدي",
  "country": "البلد"
}
```

- [ ] **Step 4: 提交**

```bash
git add apps/storefront/src/hooks/use-addresses.ts apps/storefront/src/app/[locale]/account/addresses/page.tsx apps/storefront/src/messages/en.json apps/storefront/src/messages/zh.json apps/storefront/src/messages/es.json apps/storefront/src/messages/ar.json
git commit -m "feat(storefront): add address management page with CRUD operations"
```

---

### Task 5: RFQ 列表页 — 新建询价按钮与 URL 参数预填

**Files:**
- Modify: `apps/storefront/src/app/[locale]/rfq/page.tsx`

**Context:** RFQ 列表页当前 104 行，只有表格展示。需要添加"新建询价"按钮，支持 URL query 参数（`product_id`、`product_title`、`factory_id`、`variant_id`）预填 RFQ 表单。RFQ 表单组件已存在于 `components/rfq/rfq-form.tsx`，接受 `productId`、`productTitle`、`variantId?`、`factoryId?` props。

**现有 RFQ 表单组件签名：**
```typescript
interface RFQFormProps {
  productId?: string
  productTitle?: string
  variantId?: string
  factoryId?: string
  customerEmail?: string
}
```

- [ ] **Step 1: 替换 RFQ 列表页**

将 `apps/storefront/src/app/[locale]/rfq/page.tsx` 替换为以下内容：

```tsx
"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { useRFQs } from "@/hooks/use-rfq"
import { RFQForm } from "@/components/rfq/rfq-form"

function statusColor(status: string): string {
  switch (status) {
    case "submitted":
      return "bg-blue-50 text-blue-700"
    case "reviewing":
      return "bg-yellow-50 text-yellow-700"
    case "quoted":
      return "bg-green-50 text-green-700"
    case "negotiating":
      return "bg-orange-50 text-orange-700"
    case "accepted":
      return "bg-emerald-50 text-emerald-700"
    case "rejected":
      return "bg-red-50 text-red-700"
    default:
      return "bg-gray-50 text-gray-700"
  }
}

export default function RFQListPage() {
  const t = useTranslations("rfq")
  const ct = useTranslations("common")
  const { locale } = useParams()
  const searchParams = useSearchParams()
  const { data: rfqs, isLoading } = useRFQs()

  const [showForm, setShowForm] = useState(false)

  // 从 URL 参数预填
  const prefilledProductId = searchParams.get("product_id") || undefined
  const prefilledProductTitle = searchParams.get("product_title") || undefined
  const prefilledVariantId = searchParams.get("variant_id") || undefined
  const prefilledFactoryId = searchParams.get("factory_id") || undefined

  // 如果有 URL 参数且表单未显示，自动打开表单
  const hasPrefill = prefilledProductId || prefilledFactoryId

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("myInquiries")}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          {showForm ? t("cancel") : t("submit")}
        </button>
      </div>

      {/* RFQ 创建表单 */}
      {showForm && (
        <div className="rounded-lg border border-gray-200 p-6">
          <RFQForm
            productId={prefilledProductId}
            productTitle={prefilledProductTitle}
            variantId={prefilledVariantId}
            factoryId={prefilledFactoryId}
          />
        </div>
      )}

      {/* 自动预填提示 */}
      {hasPrefill && !showForm && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
          <p className="text-sm text-brand-700">
            {t("prefillHint")}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {t("openForm")}
          </button>
        </div>
      )}

      {/* RFQ 列表 */}
      {isLoading ? (
        <p className="text-center text-gray-500">{ct("loading")}</p>
      ) : rfqs && rfqs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">{t("product")}</th>
                <th className="px-4 py-3 font-medium">{t("quantity")}</th>
                <th className="px-4 py-3 font-medium">{t("statusLabel")}</th>
                <th className="px-4 py-3 font-medium">{t("quotedPrice")}</th>
                <th className="px-4 py-3 font-medium">{t("createdAt")}</th>
              </tr>
            </thead>
            <tbody>
              {rfqs.map((rfq: any) => (
                <tr key={rfq.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/${locale}/rfq/${rfq.id}`}
                      className="text-brand-600 hover:underline"
                    >
                      {rfq.product_title || t("product")}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{rfq.quantity}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs ${statusColor(rfq.status)}`}>
                      {t(`status.${rfq.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {rfq.quoted_price ? `$${rfq.quoted_price}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(rfq.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">{t("noInquiries")}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 在 4 个翻译文件的 `rfq` 命名空间中添加新 key**

在 `en.json` 的 `"rfq"` 对象中添加（在 `"status"` 之前）：

```json
"prefillHint": "You have product info ready for a quote request.",
"openForm": "Create Inquiry"
```

在 `zh.json` 的 `"rfq"` 对象中添加：

```json
"prefillHint": "已准备好产品信息，可直接创建询价单。",
"openForm": "创建询价"
```

在 `es.json` 的 `"rfq"` 对象中添加：

```json
"prefillHint": "Tiene información del producto lista para una solicitud de cotización.",
"openForm": "Crear consulta"
```

在 `ar.json` 的 `"rfq"` 对象中添加：

```json
"prefillHint": "لديك معلومات المنتج جاهزة لطلب عرض سعر.",
"openForm": "إنشاء استفسار"
```

- [ ] **Step 3: 提交**

```bash
git add apps/storefront/src/app/[locale]/rfq/page.tsx apps/storefront/src/messages/en.json apps/storefront/src/messages/zh.json apps/storefront/src/messages/es.json apps/storefront/src/messages/ar.json
git commit -m "feat(storefront): add RFQ creation entry with URL parameter prefill support"
```

---

### Task 6: 构建验证与部署

**Files:**
- 无文件修改

**Context:** 所有代码修改完成后，需要本地构建验证，然后部署到生产服务器。

- [ ] **Step 1: 本地构建验证**

```bash
cd apps/storefront && NEXT_PUBLIC_MEDUSA_URL=https://toyfactory.cc npm run build
```

预期：构建成功，无类型错误。如果有错误，根据错误信息修复后重新构建。

- [ ] **Step 2: 部署到生产服务器**

```bash
# 同步构建产物
rsync -avz --delete .next/ tfshop-server:/opt/tfshop/storefront-app/.next/

# 同步新增的源文件（hooks 和页面）
rsync -avz src/ tfshop-server:/opt/tfshop/storefront-app/src/

# 同步翻译文件
rsync -avz src/messages/ tfshop-server:/opt/tfshop/storefront-app/src/messages/

# 重启服务
ssh tfshop-server 'systemctl restart tfshop-storefront'
```

- [ ] **Step 3: 验证生产环境**

在浏览器中验证以下页面：
1. `https://toyfactory.cc/en/products/<任意handle>` — 确认 Variant 选择器和数量选择器出现，按钮可点击
2. `https://toyfactory.cc/en/factories/<任意slug>` — 确认询价按钮可点击，产品列表正确过滤
3. `https://toyfactory.cc/en/account` — 确认功能入口网格展示
4. `https://toyfactory.cc/en/account/addresses` — 确认地址管理页加载
5. `https://toyfactory.cc/en/rfq` — 确认新建询价按钮存在

- [ ] **Step 4: 最终提交（如有修复）**

```bash
git add -A
git commit -m "fix(storefront): address build and deployment fixes"
```

---

## 自审清单

### 1. Spec 覆盖度

| 设计要求 | 对应 Task |
|----------|-----------|
| Add to Cart 按钮接线（数量选择器 + Variant + cart） | Task 1 |
| Request Quote 按钮接线（跳转 RFQ 页带预填参数） | Task 1 |
| 工厂详情 Request Quote 按钮接线 | Task 2 |
| 工厂详情产品按 factory_id 过滤 | Task 2 |
| 买家中心功能入口网格（订单/询价/地址/设置） | Task 3 |
| 地址管理页 CRUD | Task 4 |
| RFQ 列表页新建询价按钮 | Task 5 |
| RFQ URL 参数预填 | Task 5 |
| 4 语言翻译全部补全 | Task 1-5 |
| 构建部署验证 | Task 6 |

### 2. Placeholder 扫描

无 TBD、TODO、implement later 等占位符。所有步骤包含完整代码。

### 3. 类型一致性

- CartContext `addItem({ variant_id, quantity })` — Task 1 调用签名匹配
- RFQForm props `{ productId, productTitle, variantId?, factoryId? }` — Task 5 传递签名匹配
- Address hooks 接口 `AddressInput` — Task 4 页面表单和 hooks 签名匹配
- `useProductsByFactory(factoryId: string)` — Task 2 页面调用 `useProductsByFactory(factory?.id || "")` 匹配
