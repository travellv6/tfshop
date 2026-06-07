# Phase 3A: RFQ (Request for Quote) Custom Module

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create the RFQ (询价) custom module — the core B2B inquiry system that allows buyers to submit quote requests for products, and platform admins to respond with pricing, lead times, and terms. Supports multi-round communication.

**Architecture:** Custom Medusa module at `packages/modules/rfq/` following the established pattern. Two main models: `RFQ` (the inquiry) and `RFQMessage` (communication thread). Workflows for create/update/respond/close. Admin API for management, Store API for buyer submission.

**Tech Stack:** Medusa DML, MedusaService, createStep/createWorkflow, @medusajs/framework/utils

**Depends on:** Phase 1A (module pattern), Phase 2A (tiered pricing pattern)

---

## File Structure

```
packages/modules/rfq/
├── package.json, tsconfig.json, jest.config.js
└── src/
    ├── models/
    │   ├── rfq.ts                    # RFQ 主表
    │   ├── rfq-message.ts            # 沟通消息
    │   └── index.ts
    ├── types/index.ts
    ├── services/
    │   ├── rfq-module-service.ts
    │   └── index.ts
    └── index.ts

packages/core/core-flows/src/rfq/
├── steps/ (create, update, add-message, update-status)
├── workflows/ (create, update, add-message, update-status)
└── index.ts

packages/medusa/src/api/admin/rfq/ (CRUD + respond)
packages/medusa/src/api/store/rfq/ (submit + list own)
```

---

## Task 1: Scaffold @medusajs/rfq Module + Models

**Create module scaffold** — package.json, tsconfig.json, jest.config.js (copy from factory/tiered-pricing)

**Create RFQ Model:**

```typescript
// packages/modules/rfq/src/models/rfq.ts
import { model } from "@medusajs/framework/utils"

const RFQ = model.define("rfq", {
  id: model.id({ prefix: "rfq" }).primaryKey(),
  customer_id: model.text().searchable(),
  customer_email: model.text().searchable(),
  product_id: model.text().searchable().nullable(),
  product_title: model.text().nullable(),
  variant_id: model.text().nullable(),
  factory_id: model.text().searchable().nullable(),
  status: model.enum([
    "draft", "submitted", "reviewing",
    "quoted", "negotiating", "accepted",
    "rejected", "expired", "cancelled"
  ]).default("submitted"),
  quantity: model.number().nullable(),
  target_price: model.text().nullable(),
  currency_code: model.text().default("usd"),
  requirements: model.json().default({}),  // customization details, specs, etc.
  quoted_price: model.text().nullable(),
  quoted_lead_time: model.text().nullable(),
  quoted_terms: model.json().default({}),
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default RFQ
```

**Create RFQMessage Model:**

```typescript
// packages/modules/rfq/src/models/rfq-message.ts
import { model } from "@medusajs/framework/utils"

const RFQMessage = model.define("rfq_message", {
  id: model.id({ prefix: "rfqm" }).primaryKey(),
  rfq_id: model.text().searchable(),
  sender_type: model.enum(["buyer", "admin", "system"]).default("buyer"),
  content: model.text(),
  attachments: model.json().default({}),
  internal: model.boolean().default(false),  // admin-only internal notes
})

export default RFQMessage
```

**Types:**

```typescript
// packages/modules/rfq/src/types/index.ts
export type RFQStatus = "draft" | "submitted" | "reviewing" | "quoted" | "negotiating" | "accepted" | "rejected" | "expired" | "cancelled"
export type SenderType = "buyer" | "admin" | "system"

export interface RFQDTO {
  id: string
  customer_id: string
  customer_email: string
  product_id: string | null
  product_title: string | null
  variant_id: string | null
  factory_id: string | null
  status: RFQStatus
  quantity: number | null
  target_price: string | null
  currency_code: string
  requirements: Record<string, unknown>
  quoted_price: string | null
  quoted_lead_time: string | null
  quoted_terms: Record<string, unknown>
  notes: string | null
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
}

export interface RFQMessageDTO {
  id: string
  rfq_id: string
  sender_type: SenderType
  content: string
  attachments: Record<string, unknown>
  internal: boolean
  created_at: Date
}

export interface CreateRFQDTO {
  customer_id?: string
  customer_email: string
  product_id?: string
  product_title?: string
  variant_id?: string
  factory_id?: string
  status?: RFQStatus
  quantity?: number
  target_price?: string
  currency_code?: string
  requirements?: Record<string, unknown>
  notes?: string
  metadata?: Record<string, unknown>
}

export interface CreateRFQMessageDTO {
  rfq_id: string
  sender_type: SenderType
  content: string
  attachments?: Record<string, unknown>
  internal?: boolean
}

export interface FilterableRFQDTO {
  id?: string | string[]
  customer_id?: string | string[]
  status?: RFQStatus | RFQStatus[]
  product_id?: string | string[]
  factory_id?: string | string[]
}

export interface IRFQModuleService {
  create(data: CreateRFQDTO[]): Promise<RFQDTO[]>
  update(id: string, data: any): Promise<RFQDTO>
  delete(ids: string[]): Promise<void>
  list(filters?: FilterableRFQDTO, config?: any): Promise<RFQDTO[]>
  retrieve(id: string, config?: any): Promise<RFQDTO>
  createMessages(data: CreateRFQMessageDTO[]): Promise<RFQMessageDTO[]>
  listMessages(rfqId: string): Promise<RFQMessageDTO[]>
}
```

**Service** extends `MedusaService<{ RFQ, RFQMessage }>({ RFQ, RFQMessage })` with auto-generated CRUD.

**Module entry:** `Module("rfq", { service: RFQModuleService })`

Commit: `git commit -m "feat(rfq): add RFQ module with models, types, and service"`

---

## Task 2: Create RFQ Workflows

Steps and workflows for:
1. `createRFQStep/Workflow` — buyer submits RFQ
2. `updateRFQStatusStep/Workflow` — admin changes status (reviewing → quoted → etc.)
3. `addRFQMessageStep/Workflow` — both buyer and admin can add messages
4. `submitRFQQuoteStep/Workflow` — admin submits a quote (updates quoted_price, quoted_lead_time, quoted_terms, status → "quoted")

Follow factory/tiered-pricing workflow patterns.

Register in core-flows: export from `src/index.ts`, add dependency in `package.json`.

Commit: `git commit -m "feat(rfq): add workflow steps and workflows"`

---

## Task 3: Create Admin and Store API Routes

**Admin API** (`packages/medusa/src/api/admin/rfq/`):
- `GET /admin/rfq` — list all RFQs (filterable by status, customer, factory)
- `GET /admin/rfq/:id` — RFQ detail with messages
- `POST /admin/rfq/:id/status` — update status
- `POST /admin/rfq/:id/quote` — submit quote (admin response)
- `POST /admin/rfq/:id/messages` — add admin message
- `DELETE /admin/rfq/:id` — delete RFQ

**Store API** (`packages/medusa/src/api/store/rfq/`):
- `POST /store/rfq` — buyer submits RFQ
- `GET /store/rfq` — list buyer's RFQs (filtered by customer_id)
- `GET /store/rfq/:id` — RFQ detail with messages
- `POST /store/rfq/:id/messages` — buyer adds message

Follow factory/tiered-pricing API patterns. Use Zod validators, query-config, middlewares.

Commit: `git commit -m "feat(rfq): add admin and store API routes"`

---

## Task 4: Build and Verify

```bash
yarn workspace @medusajs/rfq build
yarn workspace @medusajs/core-flows build
```
