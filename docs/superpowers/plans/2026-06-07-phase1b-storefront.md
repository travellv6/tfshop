# Phase 1B: Next.js Storefront — i18n + Core Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a multilingual Next.js storefront with 4-language support (EN/ES/AR/ZH), RTL for Arabic, and core pages for browsing products and factories via Medusa Store API.

**Architecture:** A standalone Next.js 14+ project at `apps/storefront/` within the monorepo. Uses `next-intl` for i18n with App Router `[locale]` segment. Calls Medusa backend Store API via `@medusajs/js-sdk`. No SSR data fetching complexity in Phase 1 — client-side rendering with TanStack Query.

**Tech Stack:** Next.js 14 (App Router), next-intl, Tailwind CSS, @medusajs/js-sdk, @tanstack/react-query

**Depends on:** Plan 1A (Factory Store API at `/store/factories`, Product Store API at `/store/products`)

---

## File Structure

```
apps/storefront/
├── package.json
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── middleware.ts                              # next-intl locale routing
├── src/
│   ├── i18n/
│   │   ├── routing.ts                        # Locale routing config
│   │   └── request.ts                        # getRequestConfig
│   ├── lib/
│   │   ├── medusa.ts                         # Medusa SDK client
│   │   └── query-client.ts                   # TanStack Query client
│   ├── providers/
│   │   └── query-provider.tsx                # React Query provider
│   ├── app/
│   │   ├── layout.tsx                        # Root layout (HTML shell)
│   │   ├── [locale]/
│   │   │   ├── layout.tsx                    # Locale layout (providers, header, footer)
│   │   │   ├── page.tsx                      # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx                  # Product list
│   │   │   │   └── [handle]/
│   │   │   │       └── page.tsx              # Product detail
│   │   │   ├── factories/
│   │   │   │   ├── page.tsx                  # Factory list
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx              # Factory detail
│   │   │   └── globals.css                   # Tailwind imports
│   │   └── not-found.tsx                     # 404 page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx                    # Top nav + language switcher
│   │   │   └── footer.tsx                    # Footer
│   │   ├── product/
│   │   │   ├── product-card.tsx              # Product grid card
│   │   │   ├── product-grid.tsx              # Product grid layout
│   │   │   └── product-filters.tsx           # Filter sidebar
│   │   ├── factory/
│   │   │   ├── factory-card.tsx              # Factory grid card
│   │   │   └── factory-detail-section.tsx    # Factory info section
│   │   └── ui/
│   │       ├── language-switcher.tsx          # Language dropdown
│   │       ├── search-bar.tsx                # Search input
│   │       └── badge.tsx                     # Status/tag badge
│   ├── hooks/
│   │   ├── use-products.ts                   # Product list/detail hooks
│   │   └── use-factories.ts                  # Factory list/detail hooks
│   └── messages/
│       ├── en.json                           # English translations
│       ├── es.json                           # Spanish translations
│       ├── ar.json                           # Arabic translations
│       └── zh.json                           # Chinese translations
```

---

## Task 1: Initialize Next.js Storefront Project

**Files:**
- Create: `apps/storefront/package.json`
- Create: `apps/storefront/next.config.mjs`
- Create: `apps/storefront/tsconfig.json`
- Create: `apps/storefront/tailwind.config.ts`
- Create: `apps/storefront/postcss.config.mjs`

- [ ] **Step 1: Create package.json**

```json
 apps/storefront/package.json
{
  "name": "@tfshop/storefront",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 8000",
    "build": "next build",
    "start": "next start -p 8000",
    "lint": "next lint"
  },
  "dependencies": {
    "@medusajs/js-sdk": "^2.0.0",
    "@tanstack/react-query": "^5.0.0",
    "next": "^14.2.0",
    "next-intl": "^3.22.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  }
}
```

Note: `@medusajs/js-sdk` version should match the version used in the monorepo. Check with `grep '"version"' packages/js-sdk/package.json` and use `workspace:*` if the package exists locally, or the matching npm version.

- [ ] **Step 2: Create next.config.mjs**

```javascript
 apps/storefront/next.config.mjs
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withNextIntl(nextConfig)
```

- [ ] **Step 3: Create tsconfig.json**

```json
 apps/storefront/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create tailwind.config.ts**

```typescript
 apps/storefront/tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 5: Create postcss.config.mjs**

```javascript
 apps/storefront/postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
```

- [ ] **Step 6: Add workspace to root package.json**

Modify `/Users/svan/app/tfshop/package.json` to add `"apps/*"` to the workspaces array:

```json
"workspaces": {
  "packages": [
    "apps/*",
    "packages/medusa",
    ...existing entries...
  ]
}
```

- [ ] **Step 7: Run yarn install**

Run: `cd /Users/svan/app/tfshop && yarn install`
Expected: Workspace resolved, dependencies installed

- [ ] **Step 8: Commit scaffold**

```bash
git add apps/storefront/ package.json
git commit -m "chore: scaffold @tfshop/storefront Next.js project"
```

---

## Task 2: Set Up i18n with next-intl (4 Languages + RTL)

**Files:**
- Create: `apps/storefront/src/i18n/routing.ts`
- Create: `apps/storefront/src/i18n/request.ts`
- Create: `apps/storefront/middleware.ts`
- Create: `apps/storefront/src/messages/en.json`
- Create: `apps/storefront/src/messages/es.json`
- Create: `apps/storefront/src/messages/ar.json`
- Create: `apps/storefront/src/messages/zh.json`

- [ ] **Step 1: Create locale routing config**

```typescript
 apps/storefront/src/i18n/routing.ts
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "es", "ar", "zh"],
  defaultLocale: "en",
})

export type Locale = (typeof routing.locales)[number]
```

- [ ] **Step 2: Create request config**

```typescript
 apps/storefront/src/i18n/request.ts
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 3: Create middleware for locale routing**

```typescript
 apps/storefront/middleware.ts
import createMiddleware from "next-intl/middleware"
import { routing } from "./src/i18n/routing"

export default createMiddleware(routing)

export const config = {
  matcher: ["/", "/(en|es|ar|zh)/:path*"],
}
```

- [ ] **Step 4: Create English translations**

```json
 apps/storefront/src/messages/en.json
{
  "common": {
    "search": "Search products, categories, factories...",
    "login": "Login",
    "register": "Register",
    "viewAll": "View All",
    "loading": "Loading...",
    "noResults": "No results found"
  },
  "nav": {
    "home": "Home",
    "products": "Products",
    "factories": "Factories",
    "about": "About"
  },
  "home": {
    "heroTitle": "China Toy Factory Direct Supply Platform",
    "heroSubtitle": "Factory Prices · Low MOQ · Global Shipping",
    "featuredCategories": "Featured Categories",
    "lowMoqZone": "Low MOQ Zone",
    "lowMoqSubtitle": "Minimum order as low as 20 pieces",
    "recommendedFactories": "Recommended Factories"
  },
  "product": {
    "title": "Products",
    "moq": "MOQ: {count} pcs",
    "priceRange": "{min} - {max}",
    "perPiece": "/pc",
    "inStock": "In Stock",
    "preOrder": "Pre-order",
    "sampleAvailable": "Sample Available",
    "addToCart": "Add to Cart",
    "requestQuote": "Request Quote",
    "certifications": "Certifications",
    "factory": "Factory",
    "viewFactory": "View Factory",
    "filters": {
      "category": "Category",
      "moq": "MOQ",
      "certification": "Certification",
      "priceRange": "Price Range",
      "origin": "Origin",
      "inStock": "In Stock Only"
    }
  },
  "factory": {
    "title": "Factories",
    "viewProducts": "View Products",
    "requestQuote": "Request Quote",
    "established": "Est. {year}",
    "capacity": "Capacity: {capacity}/month",
    "certifications": "Certifications",
    "location": "Location",
    "products": "Products"
  },
  "tieredPricing": {
    "title": "Tiered Pricing",
    "tier": "Tier {n}",
    "pieces": "{min} - {max} pcs",
    "piecesAndAbove": "{min}+ pcs"
  }
}
```

- [ ] **Step 5: Create Spanish translations**

```json
 apps/storefront/src/messages/es.json
{
  "common": {
    "search": "Buscar productos, categorías, fábricas...",
    "login": "Iniciar sesión",
    "register": "Registrarse",
    "viewAll": "Ver todo",
    "loading": "Cargando...",
    "noResults": "No se encontraron resultados"
  },
  "nav": {
    "home": "Inicio",
    "products": "Productos",
    "factories": "Fábricas",
    "about": "Acerca de"
  },
  "home": {
    "heroTitle": "Plataforma de suministro directo de fábricas de juguetes de China",
    "heroSubtitle": "Precios de fábrica · MOQ bajo · Envío global",
    "featuredCategories": "Categorías destacadas",
    "lowMoqZone": "Zona de MOQ bajo",
    "lowMoqSubtitle": "Pedido mínimo desde 20 piezas",
    "recommendedFactories": "Fábricas recomendadas"
  },
  "product": {
    "title": "Productos",
    "moq": "MOQ: {count} uds",
    "priceRange": "{min} - {max}",
    "perPiece": "/ud",
    "inStock": "En stock",
    "preOrder": "Bajo pedido",
    "sampleAvailable": "Muestra disponible",
    "addToCart": "Añadir al carrito",
    "requestQuote": "Solicitar cotización",
    "certifications": "Certificaciones",
    "factory": "Fábrica",
    "viewFactory": "Ver fábrica",
    "filters": {
      "category": "Categoría",
      "moq": "MOQ",
      "certification": "Certificación",
      "priceRange": "Rango de precios",
      "origin": "Origen",
      "inStock": "Solo en stock"
    }
  },
  "factory": {
    "title": "Fábricas",
    "viewProducts": "Ver productos",
    "requestQuote": "Solicitar cotización",
    "established": "Fund. {year}",
    "capacity": "Capacidad: {capacity}/mes",
    "certifications": "Certificaciones",
    "location": "Ubicación",
    "products": "Productos"
  },
  "tieredPricing": {
    "title": "Precios escalonados",
    "tier": "Nivel {n}",
    "pieces": "{min} - {max} uds",
    "piecesAndAbove": "{min}+ uds"
  }
}
```

- [ ] **Step 6: Create Arabic translations (RTL)**

```json
 apps/storefront/src/messages/ar.json
{
  "common": {
    "search": "البحث عن المنتجات والفئات والمصانع...",
    "login": "تسجيل الدخول",
    "register": "تسجيل",
    "viewAll": "عرض الكل",
    "loading": "جاري التحميل...",
    "noResults": "لم يتم العثور على نتائج"
  },
  "nav": {
    "home": "الرئيسية",
    "products": "المنتجات",
    "factories": "المصانع",
    "about": "حول"
  },
  "home": {
    "heroTitle": "منصة التوريد المباشر من مصانع الألعاب الصينية",
    "heroSubtitle": "أسعار المصنع · حد أدنى منخفض · شحن عالمي",
    "featuredCategories": "الفئات المميزة",
    "lowMoqZone": "منطقة الحد الأدنى المنخفض",
    "lowMoqSubtitle": "الحد الأدنى للطلب من 20 قطعة",
    "recommendedFactories": "المصانع الموصى بها"
  },
  "product": {
    "title": "المنتجات",
    "moq": "الحد الأدنى: {count} قطعة",
    "priceRange": "{min} - {max}",
    "perPiece": "/قطعة",
    "inStock": "متوفر",
    "preOrder": "طلب مسبق",
    "sampleAvailable": "عينة متاحة",
    "addToCart": "أضف إلى السلة",
    "requestQuote": "طلب عرض سعر",
    "certifications": "الشهادات",
    "factory": "المصنع",
    "viewFactory": "عرض المصنع",
    "filters": {
      "category": "الفئة",
      "moq": "الحد الأدنى",
      "certification": "الشهادة",
      "priceRange": "نطاق السعر",
      "origin": "المنشأ",
      "inStock": "المتوفر فقط"
    }
  },
  "factory": {
    "title": "المصانع",
    "viewProducts": "عرض المنتجات",
    "requestQuote": "طلب عرض سعر",
    "established": "تأسس {year}",
    "capacity": "السعة: {capacity}/شهر",
    "certifications": "الشهادات",
    "location": "الموقع",
    "products": "المنتجات"
  },
  "tieredPricing": {
    "title": "تسعير متدرج",
    "tier": "المستوى {n}",
    "pieces": "{min} - {max} قطعة",
    "piecesAndAbove": "{min}+ قطعة"
  }
}
```

- [ ] **Step 7: Create Chinese translations**

```json
 apps/storefront/src/messages/zh.json
{
  "common": {
    "search": "搜索产品、品类、工厂...",
    "login": "登录",
    "register": "注册",
    "viewAll": "查看全部",
    "loading": "加载中...",
    "noResults": "未找到结果"
  },
  "nav": {
    "home": "首页",
    "products": "产品",
    "factories": "工厂",
    "about": "关于"
  },
  "home": {
    "heroTitle": "中国玩具工厂直供平台",
    "heroSubtitle": "源头价格 · 低起订量 · 全球发货",
    "featuredCategories": "热门品类",
    "lowMoqZone": "低 MOQ 专区",
    "lowMoqSubtitle": "起订量低至 20 件",
    "recommendedFactories": "推荐工厂"
  },
  "product": {
    "title": "产品",
    "moq": "起订量: {count} 件",
    "priceRange": "{min} - {max}",
    "perPiece": "/件",
    "inStock": "现货",
    "preOrder": "需预订",
    "sampleAvailable": "可寄样",
    "addToCart": "加入购物车",
    "requestQuote": "询价",
    "certifications": "认证",
    "factory": "工厂",
    "viewFactory": "查看工厂",
    "filters": {
      "category": "分类",
      "moq": "起订量",
      "certification": "认证",
      "priceRange": "价格区间",
      "origin": "产地",
      "inStock": "仅看现货"
    }
  },
  "factory": {
    "title": "工厂",
    "viewProducts": "查看产品",
    "requestQuote": "询价",
    "established": "成立 {year} 年",
    "capacity": "月产能: {capacity}",
    "certifications": "认证资质",
    "location": "地址",
    "products": "产品"
  },
  "tieredPricing": {
    "title": "阶梯价格",
    "tier": "第 {n} 阶",
    "pieces": "{min} - {max} 件",
    "piecesAndAbove": "{min} 件以上"
  }
}
```

- [ ] **Step 8: Commit i18n setup**

```bash
git add apps/storefront/src/i18n/ apps/storefront/src/messages/ apps/storefront/middleware.ts
git commit -m "feat(storefront): set up next-intl i18n with EN/ES/AR/ZH translations"
```

---

## Task 3: Create Medusa SDK Client and Query Provider

**Files:**
- Create: `apps/storefront/src/lib/medusa.ts`
- Create: `apps/storefront/src/lib/query-client.ts`
- Create: `apps/storefront/src/providers/query-provider.tsx`

- [ ] **Step 1: Create Medusa SDK client**

```typescript
 apps/storefront/src/lib/medusa.ts
import Medusa from "@medusajs/js-sdk"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

export const sdk = new Medusa({
  baseUrl: BACKEND_URL,
  auth: {
    type: "session",
  },
})
```

- [ ] **Step 2: Create TanStack Query client**

```typescript
 apps/storefront/src/lib/query-client.ts
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

- [ ] **Step 3: Create Query Provider**

```tsx
 apps/storefront/src/providers/query-provider.tsx
"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/query-client"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

- [ ] **Step 4: Commit client setup**

```bash
git add apps/storefront/src/lib/ apps/storefront/src/providers/
git commit -m "feat(storefront): add Medusa SDK client and Query provider"
```

---

## Task 4: Create Root Layout and Locale Layout (with RTL support)

**Files:**
- Create: `apps/storefront/src/app/layout.tsx`
- Create: `apps/storefront/src/app/[locale]/layout.tsx`
- Create: `apps/storefront/src/app/[locale]/globals.css`
- Create: `apps/storefront/src/app/not-found.tsx`

- [ ] **Step 1: Create root layout**

```tsx
 apps/storefront/src/app/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TFShop — China Toy Factory Direct",
  description:
    "Direct from Chinese toy factories. Low MOQ, factory prices, global shipping.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
```

- [ ] **Step 2: Create locale layout with RTL support**

```tsx
 apps/storefront/src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing, type Locale } from "@/i18n/routing"
import { QueryProvider } from "@/providers/query-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const RTL_LOCALES: Locale[] = ["ar"]

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  const messages = await getMessages()
  const isRTL = RTL_LOCALES.includes(locale as Locale)

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body className="min-h-screen bg-white antialiased">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-8">
              {children}
            </main>
            <Footer />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Create globals.css with Tailwind**

```css
 apps/storefront/src/app/[locale]/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-gray-900;
  }
}

/* RTL adjustments */
[dir="rtl"] .flip-rtl {
  transform: scaleX(-1);
}
```

- [ ] **Step 4: Create not-found page**

```tsx
 apps/storefront/src/app/not-found.tsx
export default function NotFound() {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <h1 className="text-4xl font-bold">404 — Page Not Found</h1>
        </div>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Commit layouts**

```bash
git add apps/storefront/src/app/
git commit -m "feat(storefront): add root and locale layouts with RTL support"
```

---

## Task 5: Create Layout Components (Header + Language Switcher + Footer)

**Files:**
- Create: `apps/storefront/src/components/layout/header.tsx`
- Create: `apps/storefront/src/components/layout/footer.tsx`
- Create: `apps/storefront/src/components/ui/language-switcher.tsx`

- [ ] **Step 1: Create language switcher**

```tsx
 apps/storefront/src/components/ui/language-switcher.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { routing, type Locale } from "@/i18n/routing"

const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ar: "العربية",
  zh: "中文",
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const handleChange = (newLocale: string) => {
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/"))
  }

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeLabels[loc]}
        </option>
      ))}
    </select>
  )
}
```

- [ ] **Step 2: Create header**

```tsx
 apps/storefront/src/components/layout/header.tsx
"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/ui/language-switcher"

export function Header() {
  const t = useTranslations("nav")
  const locale = useLocale()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href={`/${locale}`} className="text-xl font-bold text-brand-600">
            🧸 TFShop
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href={`/${locale}/products`}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {t("products")}
            </Link>
            <Link
              href={`/${locale}/factories`}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {t("factories")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <span className="text-sm text-gray-600">{t("login")}</span>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Create footer**

```tsx
 apps/storefront/src/components/layout/footer.tsx
export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TFShop — China Toy Factory Direct Supply Platform
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Commit layout components**

```bash
git add apps/storefront/src/components/
git commit -m "feat(storefront): add header, footer, and language switcher"
```

---

## Task 6: Create Data Hooks (Products + Factories)

**Files:**
- Create: `apps/storefront/src/hooks/use-products.ts`
- Create: `apps/storefront/src/hooks/use-factories.ts`

- [ ] **Step 1: Create product hooks**

These hooks call the Medusa Store API via the SDK. The SDK's `sdk.store.product` methods are built-in; factory calls use `sdk.client.fetch` since factory is a custom endpoint.

```typescript
 apps/storefront/src/hooks/use-products.ts
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

export function useProducts(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const { products, count } = await sdk.store.product.list(params)
      return { products, count }
    },
  })
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const { products } = await sdk.store.product.list({ handle })
      const product = products[0]
      if (!product) {
        throw new Error(`Product not found: ${handle}`)
      }
      return product
    },
    enabled: !!handle,
  })
}
```

- [ ] **Step 2: Create factory hooks**

Factory endpoints are custom (from Plan 1A), so we use `sdk.client.fetch` directly.

```typescript
 apps/storefront/src/hooks/use-factories.ts
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

export interface Factory {
  id: string
  name: string
  slug: string
  description?: string | null
  cover_image?: string | null
  location_province?: string | null
  location_city?: string | null
  established_year?: number | null
  employee_scale?: string | null
  monthly_capacity?: string | null
  main_categories?: string | null
  certifications?: string[] | null
  photos?: string[] | null
  status: string
}

export function useFactories(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["factories", params],
    queryFn: async () => {
      const result = await sdk.client.fetch<{
        factories: Factory[]
        count: number
      }>("/store/factories", {
        query: params,
      })
      return result
    },
  })
}

export function useFactory(slug: string) {
  return useQuery({
    queryKey: ["factory", slug],
    queryFn: async () => {
      const { factory } = await sdk.client.fetch<{ factory: Factory }>(
        `/store/factories/${slug}`
      )
      return factory
    },
    enabled: !!slug,
  })
}
```

- [ ] **Step 3: Commit hooks**

```bash
git add apps/storefront/src/hooks/
git commit -m "feat(storefront): add product and factory data hooks"
```

---

## Task 7: Create Homepage

**Files:**
- Create: `apps/storefront/src/app/[locale]/page.tsx`
- Create: `apps/storefront/src/components/product/product-card.tsx`
- Create: `apps/storefront/src/components/factory/factory-card.tsx`

- [ ] **Step 1: Create product card component**

```tsx
 apps/storefront/src/components/product/product-card.tsx
"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"

interface ProductCardProps {
  product: {
    id: string
    handle: string
    title: string
    thumbnail?: string | null
    metadata?: Record<string, any> | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("product")
  const locale = useLocale()

  const metadata = product.metadata as Record<string, any> | null
  const moq = metadata?.min_order_qty
  const price = metadata?.price_range

  return (
    <Link
      href={`/${locale}/products/${product.handle}`}
      className="group rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
    >
      <div className="mb-3 aspect-square overflow-hidden rounded-md bg-gray-100">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <h3 className="truncate text-sm font-medium text-gray-900 group-hover:text-brand-600">
        {product.title}
      </h3>
      {price && (
        <p className="mt-1 text-sm font-semibold text-brand-600">{price}</p>
      )}
      {moq && (
        <p className="mt-0.5 text-xs text-green-600">
          {t("moq", { count: moq })}
        </p>
      )}
    </Link>
  )
}
```

- [ ] **Step 2: Create factory card component**

```tsx
 apps/storefront/src/components/factory/factory-card.tsx
"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import type { Factory } from "@/hooks/use-factories"

export function FactoryCard({ factory }: { factory: Factory }) {
  const t = useTranslations("factory")
  const locale = useLocale()

  return (
    <Link
      href={`/${locale}/factories/${factory.slug}`}
      className="group rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
    >
      <div className="mb-3 h-32 overflow-hidden rounded-md bg-gray-100">
        {factory.cover_image ? (
          <img
            src={factory.cover_image}
            alt={factory.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-gray-400">
            🏭
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand-600">
        {factory.name}
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        {factory.location_city}, {factory.location_province}
      </p>
      {factory.established_year && (
        <p className="mt-0.5 text-xs text-gray-400">
          {t("established", { year: factory.established_year })}
        </p>
      )}
      {factory.certifications && factory.certifications.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {factory.certifications.slice(0, 3).map((cert) => (
            <span
              key={cert}
              className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600"
            >
              {cert}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
```

- [ ] **Step 3: Create homepage**

```tsx
 apps/storefront/src/app/[locale]/page.tsx
"use client"

import { useTranslations } from "next-intl"
import { useProducts } from "@/hooks/use-products"
import { useFactories } from "@/hooks/use-factories"
import { ProductCard } from "@/components/product/product-card"
import { FactoryCard } from "@/components/factory/factory-card"

export default function HomePage() {
  const t = useTranslations("home")
  const pt = useTranslations("product")
  const { data: productsData } = useProducts({ limit: 8 })
  const { data: factoriesData } = useFactories({ limit: 4 })

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-8 py-16 text-center text-white">
        <h1 className="text-3xl font-bold md:text-4xl">{t("heroTitle")}</h1>
        <p className="mt-3 text-lg opacity-90">{t("heroSubtitle")}</p>
      </section>

      {/* Low MOQ Zone */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            🔥 {t("lowMoqZone")}
          </h2>
          <span className="text-sm text-gray-500">{t("lowMoqSubtitle")}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {productsData?.products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recommended Factories */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          🏭 {t("recommendedFactories")}
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {factoriesData?.factories?.map((factory) => (
            <FactoryCard key={factory.id} factory={factory} />
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Commit homepage**

```bash
git add apps/storefront/src/app/[locale]/page.tsx apps/storefront/src/components/product/ apps/storefront/src/components/factory/
git commit -m "feat(storefront): add homepage with product grid and factory cards"
```

---

## Task 8: Create Product List Page

**Files:**
- Create: `apps/storefront/src/app/[locale]/products/page.tsx`

- [ ] **Step 1: Create product list page**

```tsx
 apps/storefront/src/app/[locale]/products/page.tsx
"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { useProducts } from "@/hooks/use-products"
import { ProductCard } from "@/components/product/product-card"

export default function ProductListPage() {
  const t = useTranslations("product")
  const [search, setSearch] = useState("")
  const { data, isLoading } = useProducts({
    limit: 20,
    q: search || undefined,
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("title")}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {data?.products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {data?.products?.length === 0 && (
        <p className="text-center text-gray-500">{t("noResults")}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit product list**

```bash
git add apps/storefront/src/app/[locale]/products/
git commit -m "feat(storefront): add product list page with search"
```

---

## Task 9: Create Product Detail Page

**Files:**
- Create: `apps/storefront/src/app/[locale]/products/[handle]/page.tsx`

- [ ] **Step 1: Create product detail page**

```tsx
 apps/storefront/src/app/[locale]/products/[handle]/page.tsx
"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useProduct } from "@/hooks/use-products"
import { useFactory } from "@/hooks/use-factories"

export default function ProductDetailPage() {
  const t = useTranslations("product")
  const ft = useTranslations("factory")
  const { locale, handle } = useParams()
  const { data: product, isLoading } = useProduct(handle as string)

  const metadata = product?.metadata as Record<string, any> | null
  const factoryId = metadata?.factory_id as string | undefined
  const factorySlug = metadata?.factory_slug as string | undefined

  return (
    <div>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : product ? (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Images */}
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

          {/* Info */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            {product.description && (
              <p className="text-gray-600">{product.description}</p>
            )}

            {/* MOQ & Stock */}
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

            {/* Certifications */}
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

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700">
                {t("addToCart")}
              </button>
              <button className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                {t("requestQuote")}
              </button>
            </div>

            {/* Factory Card */}
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
      ) : (
        <p className="text-center text-gray-500">{t("noResults")}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit product detail**

```bash
git add apps/storefront/src/app/[locale]/products/[handle]/
git commit -m "feat(storefront): add product detail page"
```

---

## Task 10: Create Factory List and Detail Pages

**Files:**
- Create: `apps/storefront/src/app/[locale]/factories/page.tsx`
- Create: `apps/storefront/src/app/[locale]/factories/[slug]/page.tsx`

- [ ] **Step 1: Create factory list page**

```tsx
 apps/storefront/src/app/[locale]/factories/page.tsx
"use client"

import { useTranslations } from "next-intl"
import { useFactories } from "@/hooks/use-factories"
import { FactoryCard } from "@/components/factory/factory-card"

export default function FactoryListPage() {
  const t = useTranslations()
  const { data, isLoading } = useFactories({ limit: 20 })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t("factory.title")}</h1>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {data?.factories?.map((factory) => (
            <FactoryCard key={factory.id} factory={factory} />
          ))}
        </div>
      )}

      {data?.factories?.length === 0 && (
        <p className="text-center text-gray-500">{t("common.noResults")}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create factory detail page**

```tsx
 apps/storefront/src/app/[locale]/factories/[slug]/page.tsx
"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useFactory } from "@/hooks/use-factories"
import { useProducts } from "@/hooks/use-products"
import { ProductCard } from "@/components/product/product-card"

export default function FactoryDetailPage() {
  const t = useTranslations("factory")
  const { slug } = useParams()
  const { data: factory, isLoading } = useFactory(slug as string)
  const { data: productsData } = useProducts({
    limit: 12,
    metadata: factory?.id ? { factory_id: factory.id } : undefined,
  })

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>
  if (!factory) return <p className="text-center text-gray-500">Not found</p>

  return (
    <div className="space-y-8">
      {/* Factory Header */}
      <div className="rounded-xl bg-gray-50 p-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Cover Image */}
          <div className="md:col-span-1">
            {factory.cover_image ? (
              <img
                src={factory.cover_image}
                alt={factory.name}
                className="rounded-lg"
              />
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg bg-gray-200 text-5xl">
                🏭
              </div>
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold">{factory.name}</h1>
            {factory.description && (
              <p className="mt-2 text-gray-600">{factory.description}</p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              {factory.location_city && (
                <div>
                  <span className="font-medium">{t("location")}:</span>{" "}
                  {factory.location_city}, {factory.location_province}
                </div>
              )}
              {factory.established_year && (
                <div>
                  <span className="font-medium">{t("established")}:</span>{" "}
                  {t("established", { year: factory.established_year })}
                </div>
              )}
              {factory.monthly_capacity && (
                <div>
                  <span className="font-medium">{t("capacity")}:</span>{" "}
                  {t("capacity", { capacity: factory.monthly_capacity })}
                </div>
              )}
              {factory.employee_scale && (
                <div>
                  <span className="font-medium">Employees:</span>{" "}
                  {factory.employee_scale}
                </div>
              )}
            </div>

            {/* Certifications */}
            {factory.certifications && factory.certifications.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold">{t("certifications")}</h3>
                <div className="flex flex-wrap gap-2">
                  {factory.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-600"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button className="mt-6 rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700">
              {t("requestQuote")}
            </button>
          </div>
        </div>
      </div>

      {/* Factory Photos */}
      {factory.photos && factory.photos.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-bold">Factory Gallery</h2>
          <div className="grid grid-cols-3 gap-4">
            {factory.photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`${factory.name} photo ${i + 1}`}
                className="rounded-lg"
              />
            ))}
          </div>
        </section>
      )}

      {/* Factory Products */}
      <section>
        <h2 className="mb-4 text-lg font-bold">{t("products")}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {productsData?.products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {(!productsData?.products || productsData.products.length === 0) && (
          <p className="text-center text-sm text-gray-500">No products yet</p>
        )}
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Commit factory pages**

```bash
git add apps/storefront/src/app/[locale]/factories/
git commit -m "feat(storefront): add factory list and detail pages"
```

---

## Task 11: Verify and Smoke Test

- [ ] **Step 1: Create .env.local**

```
 apps/storefront/.env.local
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
```

- [ ] **Step 2: Run dev server**

Run: `cd /Users/svan/app/tfshop/apps/storefront && yarn dev`
Expected: Next.js dev server starts on http://localhost:8000

- [ ] **Step 3: Verify pages load**

Open browser to:
- http://localhost:8000 — redirects to /en
- http://localhost:8000/es — Spanish homepage
- http://localhost:8000/ar — Arabic homepage (RTL)
- http://localhost:8000/zh — Chinese homepage
- http://localhost:8000/en/products — Product list
- http://localhost:8000/en/factories — Factory list

- [ ] **Step 4: Final commit**

```bash
git add apps/storefront/
git commit -m "feat(storefront): complete Phase 1B storefront with i18n"
```

---

## Self-Review

### Spec Coverage (Phase 1 Storefront)
- [x] Next.js + next-intl multilingual framework — Tasks 1-4
- [x] Homepage — Task 7
- [x] Product list + Product detail — Tasks 8-9
- [x] Factory list + Factory detail — Task 10
- [x] Language switching (EN/ES/AR/ZH) — Task 5
- [x] RTL support for Arabic — Task 4 (html dir="rtl")
- [x] Responsive layout — All components use Tailwind responsive classes

### Continuity with Plan 1A
- [x] Factory Store API endpoints match: `/store/factories` (list), `/store/factories/:slug` (detail)
- [x] Factory TypeScript type matches Plan 1A's `FactoryDTO`
- [x] Product metadata fields match Plan 1A's `ToyProductMetadata` (min_order_qty, certifications, factory_id, etc.)
- [x] Medusa SDK client uses same backend URL (localhost:9000)

### Placeholder Scan
- [x] No TBD/TODO in any task
- [x] All code steps have complete implementations
- [x] All file paths are exact

### Type Consistency
- [x] `Factory` interface in `use-factories.ts` matches `FactoryDTO` from Plan 1A
- [x] Product metadata field names (min_order_qty, certifications, factory_id, etc.) match Plan 1A's `ToyProductMetadataSchema`
- [x] API response shapes match Plan 1A route handlers (`{ factories, count }`, `{ factory }`)
