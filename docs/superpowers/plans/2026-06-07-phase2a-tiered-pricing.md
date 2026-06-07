# Phase 2A: Tiered Pricing Custom Module

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Tiered Pricing custom module that allows each Product Variant to have multiple price tiers based on quantity (MOQ-based bulk pricing). This is the key B2B differentiation feature.

**Architecture:** Custom Medusa module at `packages/modules/tiered-pricing/` following the exact pattern established by the Factory module in Phase 1A. Uses DML model definition, MedusaService base class, and links to Product Variant via Medusa's module linking system.

**Tech Stack:** Medusa DML, MedusaService, createStep/createWorkflow, @medusajs/framework/utils

**Depends on:** Phase 1A (module pattern established)

---

## File Structure

```
packages/modules/tiered-pricing/
├── package.json
├── tsconfig.json
├── jest.config.js
└── src/
    ├── models/
    │   ├── tiered-price.ts
    │   └── index.ts
    ├── types/
    │   └── index.ts
    ├── services/
    │   ├── tiered-pricing-module-service.ts
    │   └── index.ts
    └── index.ts

packages/core/core-flows/src/tiered-pricing/
├── steps/
│   ├── create-tiered-price.ts
│   ├── update-tiered-price.ts
│   ├── delete-tiered-price.ts
│   └── index.ts
├── workflows/
│   ├── create-tiered-price.ts
│   ├── update-tiered-price.ts
│   ├── delete-tiered-price.ts
│   └── index.ts
└── index.ts

packages/medusa/src/api/admin/tiered-pricing/
├── validators.ts
├── query-config.ts
├── route.ts
├── [id]/route.ts
└── middlewares.ts
```

---

## Task 1: Scaffold @medusajs/tiered-pricing Module Package

**Files:**
- Create: `packages/modules/tiered-pricing/package.json`
- Create: `packages/modules/tiered-pricing/tsconfig.json`
- Create: `packages/modules/tiered-pricing/jest.config.js`

- [ ] **Step 1: Create package.json**

Follow the exact pattern from `packages/modules/factory/package.json`:

```json
{
  "name": "@medusajs/tiered-pricing",
  "version": "0.0.1",
  "description": "Tiered pricing module for TFShop B2B platform",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc --build ./tsconfig.json",
    "watch": "tsc --watch",
    "test": "jest --passWithNoTests"
  },
  "devDependencies": {
    "@medusajs/framework": "workspace:*",
    "@medusajs/test-utils": "workspace:*",
    "typescript": "^5.0.0",
    "rimraf": "^5.0.0",
    "tsc-alias": "^1.8.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

Copy from `packages/modules/factory/tsconfig.json` — extends `../../../_tsconfig.base.json` with `@models`, `@services`, `@types` path aliases.

- [ ] **Step 3: Create jest.config.js**

Copy from `packages/modules/factory/jest.config.js`.

- [ ] **Step 4: Commit scaffold**

```bash
git add packages/modules/tiered-pricing/
git commit -m "chore: scaffold @medusajs/tiered-pricing module package"
```

---

## Task 2: Create TieredPrice DML Model

**Files:**
- Create: `packages/modules/tiered-pricing/src/models/tiered-price.ts`
- Create: `packages/modules/tiered-pricing/src/models/index.ts`

- [ ] **Step 1: Create model**

```typescript
 packages/modules/tiered-pricing/src/models/tiered-price.ts
import { model } from "@medusajs/framework/utils"

const TieredPrice = model.define("tiered_price", {
  id: model.id({ prefix: "tp" }).primaryKey(),
  variant_id: model.text().searchable(),
  min_quantity: model.number(),
  max_quantity: model.number().nullable(),
  amount: model.bigNumber(),
  currency_code: model.text().searchable(),
  rules: model.json().default({}),
  status: model.enum(["active", "inactive"]).default("active"),
  metadata: model.json().nullable(),
})
  .indexes([
    {
      on: ["variant_id", "currency_code", "status"],
    },
  ])

export default TieredPrice
```

Key design:
- `variant_id`: links to Medusa Product Variant (not a FK, just stored text for now — module links come later)
- `min_quantity` / `max_quantity`: defines the quantity range for this tier (e.g., 20-99 pieces)
- `amount`: the unit price for this tier
- `currency_code`: prices are per-currency
- `max_quantity` nullable: means "and above" (no upper limit)

- [ ] **Step 2: Create models/index.ts**

```typescript
export { default as TieredPrice } from "./tiered-price"
```

- [ ] **Step 3: Commit model**

```bash
git add packages/modules/tiered-pricing/src/models/
git commit -m "feat(tiered-pricing): add TieredPrice DML model"
```

---

## Task 3: Create TypeScript Type Definitions

**Files:**
- Create: `packages/modules/tiered-pricing/src/types/index.ts`

- [ ] **Step 1: Create types**

```typescript
 packages/modules/tiered-pricing/src/types/index.ts
import { ModulesSdkTypes } from "@medusajs/framework/types"
import { DAL } from "@medusajs/framework/types"

export type TieredPriceStatus = "active" | "inactive"

export interface TieredPriceDTO {
  id: string
  variant_id: string
  min_quantity: number
  max_quantity: number | null
  amount: string
  currency_code: string
  rules: Record<string, unknown>
  status: TieredPriceStatus
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
}

export interface CreateTieredPriceDTO {
  variant_id: string
  min_quantity: number
  max_quantity?: number | null
  amount: string | number
  currency_code: string
  rules?: Record<string, unknown>
  status?: TieredPriceStatus
  metadata?: Record<string, unknown>
}

export interface UpdateTieredPriceDTO {
  variant_id?: string
  min_quantity?: number
  max_quantity?: number | null
  amount?: string | number
  currency_code?: string
  rules?: Record<string, unknown>
  status?: TieredPriceStatus
  metadata?: Record<string, unknown>
}

export interface FilterableTieredPriceDTO {
  id?: string | string[]
  variant_id?: string | string[]
  currency_code?: string | string[]
  status?: TieredPriceStatus | TieredPriceStatus[]
}

export interface ITieredPricingModuleService {
  create(data: CreateTieredPriceDTO[]): Promise<TieredPriceDTO[]>
  update(data: UpdateTieredPriceDTO[]): Promise<TieredPriceDTO[]>
  delete(ids: string[]): Promise<void>
  list(filters?: FilterableTieredPriceDTO, config?: Record<string, any>): Promise<TieredPriceDTO[]>
  retrieve(id: string, config?: Record<string, any>): Promise<TieredPriceDTO>
}

export interface InjectedDependencies {
  baseRepository: DAL.RepositoryService
}
```

- [ ] **Step 2: Commit types**

```bash
git add packages/modules/tiered-pricing/src/types/
git commit -m "feat(tiered-pricing): add TypeScript type definitions"
```

---

## Task 4: Create TieredPricingModuleService

**Files:**
- Create: `packages/modules/tiered-pricing/src/services/tiered-pricing-module-service.ts`
- Create: `packages/modules/tiered-pricing/src/services/index.ts`

- [ ] **Step 1: Create service**

Follow the exact pattern from Factory module service:

```typescript
 packages/modules/tiered-pricing/src/services/tiered-pricing-module-service.ts
import { MedusaService } from "@medusajs/framework/utils"
import TieredPrice from "../models/tiered-price"
import type {
  TieredPriceDTO,
  ITieredPricingModuleService,
  InjectedDependencies,
} from "../types"

type InjectedDependencies_ = {
  baseRepository: any
}

class TieredPricingModuleService
  extends MedusaService<{
    TieredPrice: { dto: TieredPriceDTO; model: typeof TieredPrice }
  }>({ TieredPrice })
  implements ITieredPricingModuleService
{
  constructor(container: InjectedDependencies_) {
    super(...arguments)
  }
}

export default TieredPricingModuleService
```

- [ ] **Step 2: Create services/index.ts**

```typescript
export { default as TieredPricingModuleService } from "./tiered-pricing-module-service"
```

- [ ] **Step 3: Commit service**

```bash
git add packages/modules/tiered-pricing/src/services/
git commit -m "feat(tiered-pricing): add TieredPricingModuleService"
```

---

## Task 5: Create Module Definition Entry Point

**Files:**
- Create: `packages/modules/tiered-pricing/src/index.ts`

- [ ] **Step 1: Create entry point**

Follow the Factory module pattern:

```typescript
 packages/modules/tiered-pricing/src/index.ts
import { Module, Modules } from "@medusajs/framework/utils"
import { TieredPricingModuleService } from "./services"

export const TIERED_PRICING_MODULE = "tiered-pricing"

export default Module(TIERED_PRICING_MODULE, {
  service: TieredPricingModuleService,
})
```

- [ ] **Step 2: Commit entry point**

```bash
git add packages/modules/tiered-pricing/src/index.ts
git commit -m "feat(tiered-pricing): add module definition entry point"
```

---

## Task 6: Create Workflow Steps and Workflows

**Files:**
- Create: `packages/core/core-flows/src/tiered-pricing/steps/create-tiered-price.ts`
- Create: `packages/core/core-flows/src/tiered-pricing/steps/update-tiered-price.ts`
- Create: `packages/core/core-flows/src/tiered-pricing/steps/delete-tiered-price.ts`
- Create: `packages/core/core-flows/src/tiered-pricing/steps/index.ts`
- Create: `packages/core/core-flows/src/tiered-pricing/workflows/create-tiered-price.ts`
- Create: `packages/core/core-flows/src/tiered-pricing/workflows/update-tiered-price.ts`
- Create: `packages/core/core-flows/src/tiered-pricing/workflows/delete-tiered-price.ts`
- Create: `packages/core/core-flows/src/tiered-pricing/workflows/index.ts`
- Create: `packages/core/core-flows/src/tiered-pricing/index.ts`
- Modify: `packages/core/core-flows/src/index.ts` — add export
- Modify: `packages/core/core-flows/package.json` — add dependency

Follow the EXACT pattern from the factory workflows in Phase 1A.

Step pattern:
```typescript
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { TIERED_PRICING_MODULE } from "../../../modules/tiered-pricing/src"

export const createTieredPriceStep = createStep(
  "create-tiered-price-step",
  async (data: any[], { container }) => {
    const service = container.resolve(TIERED_PRICING_MODULE)
    const created = await service.create(data)
    return new StepResponse(created, created.map((c: any) => c.id))
  },
  async (ids: string[], { container }) => {
    if (!ids?.length) return
    const service = container.resolve(TIERED_PRICING_MODULE)
    await service.delete(ids)
  }
)
```

Workflow pattern:
```typescript
import { createWorkflow, WorkflowData, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createTieredPriceStep } from "../steps/create-tiered-price"

export const createTieredPriceWorkflow = createWorkflow(
  "create-tiered-price",
  (input: WorkflowData<any[]>) => {
    const result = createTieredPriceStep(input)
    return new WorkflowResponse(result)
  }
)
```

Commit each group:
1. Steps: `git commit -m "feat(tiered-pricing): add workflow steps"`
2. Workflows + exports: `git commit -m "feat(tiered-pricing): add workflows"`

---

## Task 7: Create Admin API Routes for Tiered Pricing

**Files:**
- Create: `packages/medusa/src/api/admin/tiered-pricing/validators.ts`
- Create: `packages/medusa/src/api/admin/tiered-pricing/query-config.ts`
- Create: `packages/medusa/src/api/admin/tiered-pricing/route.ts` — POST (create) + GET (list)
- Create: `packages/medusa/src/api/admin/tiered-pricing/[id]/route.ts` — GET (detail) + POST (update) + DELETE
- Create: `packages/medusa/src/api/admin/tiered-pricing/middlewares.ts`

Follow the Factory admin API pattern from Phase 1A exactly. Key differences:
- Validators include `variant_id`, `min_quantity`, `max_quantity`, `amount`, `currency_code`
- Query config includes appropriate fields
- GET list supports filtering by `variant_id` and `currency_code`

Commit: `git commit -m "feat(tiered-pricing): add admin API routes for CRUD"`

---

## Task 8: Build and Verify

- [ ] **Step 1: Build tiered-pricing module**

```bash
cd /Users/svan/app/tfshop && yarn workspace @medusajs/tiered-pricing build
```

- [ ] **Step 2: Build core-flows**

```bash
yarn workspace @medusajs/core-flows build
```

- [ ] **Step 3: Verify no TypeScript errors**

Report build status.
