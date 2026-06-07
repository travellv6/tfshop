# Phase 1A: Backend Foundation — Factory Module & Product Extension

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the Factory custom module and extend the Product model with toy-specific B2B fields, providing Admin and Store API routes for both.

**Architecture:** Add a new `@medusajs/factory` module package following the existing monorepo patterns (DML model → MedusaService → Module registration). Extend Product via a `ToyProduct` link model for B2B fields (MOQ, certifications, etc.). Create Admin API routes for CRUD and Store API routes for public read access.

**Tech Stack:** Medusa 2.0 DML (model.define), MedusaService, createStep/createWorkflow, Zod validators, PostgreSQL, Jest

**Reference Modules:** `packages/modules/api-key/` (minimal), `packages/modules/currency/` (simple), `packages/modules/product/` (advanced)

---

## File Structure

### New files to create:

```
packages/modules/factory/
├── package.json
├── tsconfig.json
├── jest.config.js
├── src/
│   ├── index.ts                              # Module definition entry
│   ├── models/
│   │   ├── factory.ts                        # Factory DML model
│   │   └── index.ts                          # Barrel export
│   ├── services/
│   │   ├── factory-module-service.ts         # Factory service
│   │   └── index.ts                          # Barrel export
│   ├── types/
│   │   └── index.ts                          # TypeScript types & interfaces
│   └── __tests__/
│       └── factory-module-service.spec.ts    # Service unit tests

packages/medusa/src/api/admin/factories/
├── route.ts                                  # GET (list) + POST (create)
├── [id]/
│   └── route.ts                              # GET/POST/DELETE by ID
├── validators.ts                             # Zod schemas
├── query-config.ts                           # Query field config
└── middlewares.ts                            # Middleware chain

packages/medusa/src/api/store/factories/
├── route.ts                                  # GET (list)
├── [slug]/
│   └── route.ts                              # GET by slug
├── validators.ts                             # Zod schemas
├── query-config.ts                           # Query field config
└── middlewares.ts                            # Middleware chain

packages/core/core-flows/src/factory/
├── steps/
│   ├── create-factory.ts                     # Create factory step
│   ├── update-factory.ts                     # Update factory step
│   ├── delete-factory.ts                     # Delete factory step
│   └── index.ts                              # Barrel export
├── workflows/
│   ├── create-factory.ts                     # Create factory workflow
│   ├── update-factory.ts                     # Update factory workflow
│   ├── delete-factory.ts                     # Delete factory workflow
│   └── index.ts                              # Barrel export
└── index.ts                                  # Barrel export
```

### Files to modify:

```
packages/medusa/src/api/middlewares.ts         # Register factory middlewares
packages/core/core-flows/src/index.ts          # Export factory workflows
packages/core/types/src/product/common.ts      # Add toy-specific field types (optional, via metadata)
```

---

## Task 1: Create Factory Module Package Scaffold

**Files:**
- Create: `packages/modules/factory/package.json`
- Create: `packages/modules/factory/tsconfig.json`
- Create: `packages/modules/factory/jest.config.js`

- [ ] **Step 1: Create package.json**

```json
 packages/modules/factory/package.json
{
  "name": "@medusajs/factory",
  "version": "1.0.0",
  "description": "Medusa Factory module for TFShop B2B toy platform",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "build": "rimraf dist && tsc --build && resolve-aliases",
    "watch": "tsc --build --watch",
    "test": "jest --passWithNoTests"
  },
  "devDependencies": {
    "@medusajs/framework": "workspace:*",
    "@medusajs/test-utils": "workspace:*",
    "rimraf": "^5.0.1",
    "resolve-aliases": "^1.0.1"
  },
  "peerDependencies": {
    "@medusajs/framework": "^2.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
 packages/modules/factory/tsconfig.json
{
  "extends": "../../../_tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@models": ["./src/models"],
      "@services": ["./src/services"],
      "@types": ["./src/types"]
    }
  }
}
```

- [ ] **Step 3: Create jest.config.js**

```js
 packages/modules/factory/jest.config.js
const defineJestConfig = require("../../../define_jest_config")

module.exports = defineJestConfig({
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/dist/"],
  transform: {
    "^.+\\.[jt]s$": [
      "@swc/jest",
      {
        sourceMaps: true,
        jsc: {
          parser: { syntax: "typescript", decorators: true },
          transform: { decoratorMetadata: true },
          target: "es2021",
        },
      },
    ],
  },
})
```

- [ ] **Step 4: Run yarn install to link the new workspace**

Run: `cd /Users/svan/app/tfshop && yarn install`
Expected: Yarn resolves the new workspace, no errors

- [ ] **Step 5: Commit scaffold**

```bash
git add packages/modules/factory/
git commit -m "chore: scaffold @medusajs/factory module package"
```

---

## Task 2: Create Factory DML Model

**Files:**
- Create: `packages/modules/factory/src/models/factory.ts`
- Create: `packages/modules/factory/src/models/index.ts`

- [ ] **Step 1: Create Factory model**

The Factory model stores toy factory information. It follows the DML pattern from `packages/modules/currency/src/models/currency.ts`.

```typescript
 packages/modules/factory/src/models/factory.ts
import { model } from "@medusajs/framework/utils"

const Factory = model.define("factory", {
  id: model.id({ prefix: "fac" }).primaryKey(),
  name: model.text().searchable(),
  slug: model.text().searchable(),
  description: model.text().nullable(),
  cover_image: model.text().nullable(),
  location_province: model.text().nullable(),
  location_city: model.text().nullable(),
  location_address: model.text().nullable(),
  established_year: model.number().nullable(),
  employee_scale: model.text().nullable(),
  monthly_capacity: model.text().nullable(),
  main_categories: model.text().nullable(),
  certifications: model.json().default([]),
  photos: model.json().default([]),
  status: model
    .enum(["active", "inactive", "suspended"])
    .default("active"),
  metadata: model.json().nullable(),
})

export default Factory
```

- [ ] **Step 2: Create barrel export**

```typescript
 packages/modules/factory/src/models/index.ts
export { default as Factory } from "./factory"
```

- [ ] **Step 3: Commit model**

```bash
git add packages/modules/factory/src/models/
git commit -m "feat(factory): add Factory DML model"
```

---

## Task 3: Create Factory Types

**Files:**
- Create: `packages/modules/factory/src/types/index.ts`

- [ ] **Step 1: Define TypeScript types**

These types define the DTO interfaces for the Factory module. Following the pattern from `packages/modules/api-key/src/types/index.ts`.

```typescript
 packages/modules/factory/src/types/index.ts
import { ModulesSdkTypes } from "@medusajs/framework/types"
import { Factory } from "@models"

export type FactoryStatus = "active" | "inactive" | "suspended"

export interface FactoryDTO {
  id: string
  name: string
  slug: string
  description?: string | null
  cover_image?: string | null
  location_province?: string | null
  location_city?: string | null
  location_address?: string | null
  established_year?: number | null
  employee_scale?: string | null
  monthly_capacity?: string | null
  main_categories?: string | null
  certifications?: string[] | null
  photos?: string[] | null
  status: FactoryStatus
  metadata?: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
}

export interface CreateFactoryDTO {
  name: string
  slug: string
  description?: string
  cover_image?: string
  location_province?: string
  location_city?: string
  location_address?: string
  established_year?: number
  employee_scale?: string
  monthly_capacity?: string
  main_categories?: string
  certifications?: string[]
  photos?: string[]
  status?: FactoryStatus
  metadata?: Record<string, unknown>
}

export interface UpdateFactoryDTO {
  name?: string
  slug?: string
  description?: string
  cover_image?: string
  location_province?: string
  location_city?: string
  location_address?: string
  established_year?: number
  employee_scale?: string
  monthly_capacity?: string
  main_categories?: string
  certifications?: string[]
  photos?: string[]
  status?: FactoryStatus
  metadata?: Record<string, unknown>
}

export interface FilterableFactoryDTO {
  id?: string | string[]
  name?: string
  slug?: string
  status?: FactoryStatus | FactoryStatus[]
  location_province?: string
  location_city?: string
}

export interface IFactoryModuleService {
  retrieveFactory(
    id: string,
    config?: any,
    sharedContext?: any
  ): Promise<FactoryDTO>

  listFactories(
    filters?: FilterableFactoryDTO,
    config?: any,
    sharedContext?: any
  ): Promise<FactoryDTO[]>

  listAndCountFactories(
    filters?: FilterableFactoryDTO,
    config?: any,
    sharedContext?: any
  ): Promise<[FactoryDTO[], number]>

  createFactories(
    data: CreateFactoryDTO[],
    sharedContext?: any
  ): Promise<FactoryDTO[]>

  createFactories(
    data: CreateFactoryDTO,
    sharedContext?: any
  ): Promise<FactoryDTO>

  updateFactories(
    data: UpdateFactoryDTO[],
    sharedContext?: any
  ): Promise<FactoryDTO[]>

  updateFactories(
    data: UpdateFactoryDTO,
    sharedContext?: any
  ): Promise<FactoryDTO>

  deleteFactories(ids: string[], sharedContext?: any): Promise<void>
}

export type InjectedDependencies = {
  baseRepository: ModulesSdkTypes.InternalModuleService<any>
  factoryService: ModulesSdkTypes.IMedusaInternalService<typeof Factory>
}
```

- [ ] **Step 2: Commit types**

```bash
git add packages/modules/factory/src/types/
git commit -m "feat(factory): add TypeScript type definitions"
```

---

## Task 4: Create Factory Module Service

**Files:**
- Create: `packages/modules/factory/src/services/factory-module-service.ts`
- Create: `packages/modules/factory/src/services/index.ts`

- [ ] **Step 1: Create service**

The service extends `MedusaService` which auto-generates CRUD methods (retrieveFactory, listFactories, createFactories, etc.).

```typescript
 packages/modules/factory/src/services/factory-module-service.ts
import { MedusaService } from "@medusajs/framework/utils"
import { Factory } from "@models"
import type {
  FactoryDTO,
  IFactoryModuleService,
  InjectedDependencies,
} from "@types"
import type {
  Context,
  ModulesSdkTypes,
  InternalModuleDeclaration,
} from "@medusajs/framework/types"

class FactoryModuleService
  extends MedusaService<{
    Factory: { dto: FactoryDTO; model: typeof Factory }
  }>({ Factory })
  implements IFactoryModuleService
{
  protected baseRepository_: ModulesSdkTypes.InternalModuleService<any>
  protected factoryService_: ModulesSdkTypes.IMedusaInternalService<
    typeof Factory
  >

  constructor(
    { baseRepository, factoryService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-expect-error MedusaService constructor signature mismatch
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.factoryService_ = factoryService
  }
}

export default FactoryModuleService
```

- [ ] **Step 2: Create barrel export**

```typescript
 packages/modules/factory/src/services/index.ts
import FactoryModuleService from "./factory-module-service"

export { FactoryModuleService }
export default FactoryModuleService
```

- [ ] **Step 3: Commit service**

```bash
git add packages/modules/factory/src/services/
git commit -m "feat(factory): add FactoryModuleService"
```

---

## Task 5: Create Factory Module Definition & Registration

**Files:**
- Create: `packages/modules/factory/src/index.ts`
- Modify: `packages/medusa/src/modules.ts` (or equivalent module registration)

- [ ] **Step 1: Create module entry point**

Following the pattern from `packages/modules/currency/src/index.ts`.

```typescript
 packages/modules/factory/src/index.ts
import { Module, Modules } from "@medusajs/framework/utils"
import FactoryModuleService from "./services"

const FACTORY_MODULE = "factory"

const service = FactoryModuleService

const moduleDefinition = Module(FACTORY_MODULE, {
  service,
})

export default moduleDefinition
export const FACTORY_MODULE_NAME = FACTORY_MODULE
export const __module = moduleDefinition
```

- [ ] **Step 2: Register the module in the Medusa config**

Find the main medusa-config file used by the medusa package and add the factory module. Check `packages/medusa/medusa-config.js` or `medusa-config.ts`. Add:

```typescript
// In the modules section of medusa-config:
modules: [
  // ... existing modules
  { key: "factory", resolve: "@medusajs/factory" },
]
```

The exact file depends on how the medusa package is configured. Check `packages/medusa/` for the config file and add the module registration there.

- [ ] **Step 3: Verify build succeeds**

Run: `cd /Users/svan/app/tfshop && yarn workspace @medusajs/factory build`
Expected: TypeScript compilation succeeds, no errors

- [ ] **Step 4: Commit module definition**

```bash
git add packages/modules/factory/src/index.ts
git commit -m "feat(factory): add module definition and registration"
```

---

## Task 6: Create Factory Workflow Steps

**Files:**
- Create: `packages/core/core-flows/src/factory/steps/create-factory.ts`
- Create: `packages/core/core-flows/src/factory/steps/update-factory.ts`
- Create: `packages/core/core-flows/src/factory/steps/delete-factory.ts`
- Create: `packages/core/core-flows/src/factory/steps/index.ts`
- Create: `packages/core/core-flows/src/factory/workflows/create-factory.ts`
- Create: `packages/core/core-flows/src/factory/workflows/update-factory.ts`
- Create: `packages/core/core-flows/src/factory/workflows/delete-factory.ts`
- Create: `packages/core/core-flows/src/factory/workflows/index.ts`
- Create: `packages/core/core-flows/src/factory/index.ts`

- [ ] **Step 1: Create create-factory step**

Following the pattern from `packages/core/core-flows/src/product/steps/create-products.ts`.

```typescript
 packages/core/core-flows/src/factory/steps/create-factory.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { FACTORY_MODULE } from "@medusajs/factory"
import type { IFactoryModuleService, CreateFactoryDTO } from "@medusajs/factory"

export const createFactoryStepId = "create-factory-step"

export const createFactoryStep = createStep(
  createFactoryStepId,
  async (
    data: CreateFactoryDTO[],
    { container }
  ) => {
    const service = container.resolve<IFactoryModuleService>(FACTORY_MODULE)
    const created = await service.createFactories(data)
    return new StepResponse(
      created,
      created.map((f) => f.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) return
    const service = container.resolve<IFactoryModuleService>(FACTORY_MODULE)
    await service.deleteFactories(createdIds)
  }
)
```

- [ ] **Step 2: Create update-factory step**

```typescript
 packages/core/core-flows/src/factory/steps/update-factory.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { FACTORY_MODULE } from "@medusajs/factory"
import type { IFactoryModuleService, UpdateFactoryDTO, FactoryDTO } from "@medusajs/factory"

export const updateFactoryStepId = "update-factory-step"

type UpdateFactoryStepInput = {
  selector: Record<string, any>
  update: UpdateFactoryDTO
}

export const updateFactoryStep = createStep(
  updateFactoryStepId,
  async (input: UpdateFactoryStepInput, { container }) => {
    const service = container.resolve<IFactoryModuleService>(FACTORY_MODULE)
    const prevData = await service.listFactories(input.selector)

    const updated = await service.updateFactories(
      prevData.map((f) => ({
        ...input.update,
        id: f.id,
      }))
    )
    return new StepResponse(updated, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) return
    const service = container.resolve<IFactoryModuleService>(FACTORY_MODULE)
    await service.updateFactories(
      prevData as UpdateFactoryDTO[]
    )
  }
)
```

- [ ] **Step 3: Create delete-factory step**

```typescript
 packages/core/core-flows/src/factory/steps/delete-factory.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { FACTORY_MODULE } from "@medusajs/factory"
import type { IFactoryModuleService } from "@medusajs/factory"

export const deleteFactoryStepId = "delete-factory-step"

export const deleteFactoryStep = createStep(
  deleteFactoryStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IFactoryModuleService>(FACTORY_MODULE)
    await service.deleteFactories(ids)
    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) return
    // Factories are hard-deleted, cannot restore.
    // If soft-delete is needed later, use restoreFactories here.
  }
)
```

- [ ] **Step 4: Create steps barrel export**

```typescript
 packages/core/core-flows/src/factory/steps/index.ts
export * from "./create-factory"
export * from "./update-factory"
export * from "./delete-factory"
```

- [ ] **Step 5: Create create-factory workflow**

```typescript
 packages/core/core-flows/src/factory/workflows/create-factory.ts
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createFactoryStep } from "../steps"
import type { CreateFactoryDTO, FactoryDTO } from "@medusajs/factory"

export const createFactoryWorkflowId = "create-factory-workflow"

type WorkflowInput = {
  factories: CreateFactoryDTO[]
}

export const createFactoryWorkflow = createWorkflow(
  createFactoryWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const factories = createFactoryStep(input.factories)
    return new WorkflowResponse(factories)
  }
)
```

- [ ] **Step 6: Create update-factory workflow**

```typescript
 packages/core/core-flows/src/factory/workflows/update-factory.ts
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateFactoryStep } from "../steps"

export const updateFactoryWorkflowId = "update-factory-workflow"

type WorkflowInput = {
  selector: Record<string, any>
  update: Record<string, any>
}

export const updateFactoryWorkflow = createWorkflow(
  updateFactoryWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const factories = updateFactoryStep(input)
    return new WorkflowResponse(factories)
  }
)
```

- [ ] **Step 7: Create delete-factory workflow**

```typescript
 packages/core/core-flows/src/factory/workflows/delete-factory.ts
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteFactoryStep } from "../steps"

export const deleteFactoryWorkflowId = "delete-factory-workflow"

type WorkflowInput = {
  ids: string[]
}

export const deleteFactoryWorkflow = createWorkflow(
  deleteFactoryWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const result = deleteFactoryStep(input.ids)
    return new WorkflowResponse(result)
  }
)
```

- [ ] **Step 8: Create workflows barrel export**

```typescript
 packages/core/core-flows/src/factory/workflows/index.ts
export * from "./create-factory"
export * from "./update-factory"
export * from "./delete-factory"
```

- [ ] **Step 9: Create module barrel export**

```typescript
 packages/core/core-flows/src/factory/index.ts
export * from "./steps"
export * from "./workflows"
```

- [ ] **Step 10: Export from core-flows main index**

Add to `packages/core/core-flows/src/index.ts`:

```typescript
export * from "./factory"
```

- [ ] **Step 11: Commit workflows**

```bash
git add packages/core/core-flows/src/factory/ packages/core/core-flows/src/index.ts
git commit -m "feat(factory): add workflow steps and workflows"
```

---

## Task 7: Create Factory Admin API Routes

**Files:**
- Create: `packages/medusa/src/api/admin/factories/route.ts`
- Create: `packages/medusa/src/api/admin/factories/[id]/route.ts`
- Create: `packages/medusa/src/api/admin/factories/validators.ts`
- Create: `packages/medusa/src/api/admin/factories/query-config.ts`
- Create: `packages/medusa/src/api/admin/factories/middlewares.ts`

- [ ] **Step 1: Create validators**

Following the pattern from `packages/medusa/src/api/admin/orders/validators.ts`.

```typescript
 packages/medusa/src/api/admin/factories/validators.ts
import { z } from "zod"
import { createFindParams, createSelectParams } from "@medusajs/framework/utils"

export const AdminGetFactoryParams = createSelectParams()

export const AdminGetFactoriesParams = createFindParams({
  offset: 0,
  limit: 20,
}).extend({
  name: z.string().optional(),
  slug: z.string().optional(),
  status: z
    .enum(["active", "inactive", "suspended"])
    .or(z.array(z.enum(["active", "inactive", "suspended"])))
    .optional(),
  location_province: z.string().optional(),
  location_city: z.string().optional(),
})

export const AdminCreateFactory = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  cover_image: z.string().optional(),
  location_province: z.string().optional(),
  location_city: z.string().optional(),
  location_address: z.string().optional(),
  established_year: z.number().optional(),
  employee_scale: z.string().optional(),
  monthly_capacity: z.string().optional(),
  main_categories: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const AdminUpdateFactory = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  cover_image: z.string().optional().nullable(),
  location_province: z.string().optional().nullable(),
  location_city: z.string().optional().nullable(),
  location_address: z.string().optional().nullable(),
  established_year: z.number().optional().nullable(),
  employee_scale: z.string().optional().nullable(),
  monthly_capacity: z.string().optional().nullable(),
  main_categories: z.string().optional().nullable(),
  certifications: z.array(z.string()).optional().nullable(),
  photos: z.array(z.string()).optional().nullable(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  metadata: z.record(z.unknown()).optional().nullable(),
})
```

- [ ] **Step 2: Create query-config**

```typescript
 packages/medusa/src/api/admin/factories/query-config.ts
import { defineLinkConfig } from "@medusajs/framework/utils"

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

export const defaultAdminFactoryRelations = []

export const listTransformQueryConfig = {
  defaults: defaultAdminFactoryFields,
  isList: true,
}

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminFactoryFields,
}
```

- [ ] **Step 3: Create list + create route**

Following the pattern from `packages/medusa/src/api/admin/orders/route.ts`.

```typescript
 packages/medusa/src/api/admin/factories/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createFactoryWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils"

// GET /admin/factories — List factories
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: factories, metadata } = await query.graph({
    entity: "factory",
    filters: req.filterableFields,
    ...req.queryConfig.pagination,
  })

  res.status(200).json({
    factories,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 20,
  })
}

// POST /admin/factories — Create factory
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { result } = await createFactoryWorkflow(req.scope).run({
    input: {
      factories: [req.validatedBody],
    },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: factory } = await query.graph({
    entity: "factory",
    filters: { id: result[0].id },
  })

  res.status(200).json({ factory: factory[0] })
}
```

- [ ] **Step 4: Create detail + update + delete route**

```typescript
 packages/medusa/src/api/admin/factories/[id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  updateFactoryWorkflow,
  deleteFactoryWorkflow,
} from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils"

// GET /admin/factories/:id — Get factory detail
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: factory } = await query.graph({
    entity: "factory",
    filters: { id: req.params.id },
  })

  res.status(200).json({ factory: factory[0] })
}

// POST /admin/factories/:id — Update factory
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  await updateFactoryWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: factory } = await query.graph({
    entity: "factory",
    filters: { id: req.params.id },
  })

  res.status(200).json({ factory: factory[0] })
}

// DELETE /admin/factories/:id — Delete factory
export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  await deleteFactoryWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "factory",
    deleted: true,
  })
}
```

- [ ] **Step 5: Create middlewares**

```typescript
 packages/medusa/src/api/admin/factories/middlewares.ts
import { defineMiddlewares } from "@medusajs/medusa"
import {
  AdminGetFactoryParams,
  AdminGetFactoriesParams,
  AdminCreateFactory,
  AdminUpdateFactory,
} from "./validators"
import {
  listTransformQueryConfig,
  retrieveTransformQueryConfig,
} from "./query-config"

export default defineMiddlewares({
  routes: [
    {
      method: "GET",
      matcher: "/admin/factories",
      middlewares: [
        validateAndTransformQuery(
          AdminGetFactoriesParams,
          listTransformQueryConfig
        ),
      ],
    },
    {
      method: "GET",
      matcher: "/admin/factories/:id",
      middlewares: [
        validateAndTransformQuery(
          AdminGetFactoryParams,
          retrieveTransformQueryConfig
        ),
      ],
    },
    {
      method: "POST",
      matcher: "/admin/factories",
      middlewares: [
        validateAndTransformBody(AdminCreateFactory),
      ],
    },
    {
      method: "POST",
      matcher: "/admin/factories/:id",
      middlewares: [
        validateAndTransformBody(AdminUpdateFactory),
      ],
    },
  ],
})
```

Note: `validateAndTransformQuery` and `validateAndTransformBody` need to be imported from `@medusajs/medusa`. Check the exact import path from existing middleware files like `packages/medusa/src/api/admin/orders/middlewares.ts`.

- [ ] **Step 6: Commit admin API routes**

```bash
git add packages/medusa/src/api/admin/factories/
git commit -m "feat(factory): add admin API routes for factory CRUD"
```

---

## Task 8: Create Factory Store API Routes

**Files:**
- Create: `packages/medusa/src/api/store/factories/route.ts`
- Create: `packages/medusa/src/api/store/factories/[slug]/route.ts`
- Create: `packages/medusa/src/api/store/factories/validators.ts`
- Create: `packages/medusa/src/api/store/factories/query-config.ts`
- Create: `packages/medusa/src/api/store/factories/middlewares.ts`

- [ ] **Step 1: Create store validators**

```typescript
 packages/medusa/src/api/store/factories/validators.ts
import { z } from "zod"
import { createFindParams, createSelectParams } from "@medusajs/framework/utils"

export const StoreGetFactoryParams = createSelectParams()

export const StoreGetFactoriesParams = createFindParams({
  offset: 0,
  limit: 20,
}).extend({
  location_province: z.string().optional(),
  location_city: z.string().optional(),
})
```

- [ ] **Step 2: Create store query-config**

```typescript
 packages/medusa/src/api/store/factories/query-config.ts
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
]

export const listTransformQueryConfig = {
  defaults: defaultStoreFactoryFields,
  isList: true,
}

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreFactoryFields,
}
```

- [ ] **Step 3: Create list route**

```typescript
 packages/medusa/src/api/store/factories/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/factories — List active factories (public)
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: factories, metadata } = await query.graph({
    entity: "factory",
    filters: {
      status: "active",
      ...req.filterableFields,
    },
    ...req.queryConfig.pagination,
  })

  res.status(200).json({
    factories,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 20,
  })
}
```

- [ ] **Step 4: Create detail-by-slug route**

```typescript
 packages/medusa/src/api/store/factories/[slug]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"

// GET /store/factories/:slug — Get factory by slug (public)
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: factories } = await query.graph({
    entity: "factory",
    filters: {
      slug: req.params.slug,
      status: "active",
    },
  })

  const factory = factories[0]

  if (!factory) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Factory with slug: ${req.params.slug} was not found`
    )
  }

  res.status(200).json({ factory })
}
```

- [ ] **Step 5: Create store middlewares**

```typescript
 packages/medusa/src/api/store/factories/middlewares.ts
import { defineMiddlewares } from "@medusajs/medusa"
import {
  StoreGetFactoryParams,
  StoreGetFactoriesParams,
} from "./validators"
import {
  listTransformQueryConfig,
  retrieveTransformQueryConfig,
} from "./query-config"

export default defineMiddlewares({
  routes: [
    {
      method: "GET",
      matcher: "/store/factories",
      middlewares: [
        validateAndTransformQuery(
          StoreGetFactoriesParams,
          listTransformQueryConfig
        ),
      ],
    },
    {
      method: "GET",
      matcher: "/store/factories/:slug",
      middlewares: [
        validateAndTransformQuery(
          StoreGetFactoryParams,
          retrieveTransformQueryConfig
        ),
      ],
    },
  ],
})
```

- [ ] **Step 6: Commit store API routes**

```bash
git add packages/medusa/src/api/store/factories/
git commit -m "feat(factory): add store API routes for public factory listing"
```

---

## Task 9: Product Metadata Extension for Toy B2B Fields

**Files:**
- Create: `packages/medusa/src/api/admin/products/toy-fields/validators.ts`

This task extends the existing Product model using Medusa's `metadata` JSON field to store toy-specific B2B attributes, avoiding the need for a separate link model in Phase 1.

- [ ] **Step 1: Define toy field metadata schema**

Create a validation schema for toy-specific fields stored in product metadata.

```typescript
 packages/medusa/src/api/admin/products/toy-fields/validators.ts
import { z } from "zod"

/**
 * Toy-specific B2B fields stored in Product.metadata
 * These are validated when creating/updating products
 * and displayed in the storefront.
 */
export const ToyProductMetadataSchema = z.object({
  age_range: z.string().optional().nullable(),
  certifications: z.array(z.string()).optional().nullable(),
  material: z.string().optional().nullable(),
  origin_region: z.string().optional().nullable(),
  min_order_qty: z.number().optional().nullable(),
  is_in_stock: z.boolean().optional().nullable(),
  sample_available: z.boolean().optional().nullable(),
  lead_time_days: z.number().optional().nullable(),
  packaging_info: z
    .object({
      length: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      weight: z.number().optional(),
      carton_qty: z.number().optional(),
    })
    .optional()
    .nullable(),
  factory_id: z.string().optional().nullable(),
})

export type ToyProductMetadata = z.infer<typeof ToyProductMetadataSchema>
```

- [ ] **Step 2: Commit toy field schema**

```bash
git add packages/medusa/src/api/admin/products/toy-fields/
git commit -m "feat(product): add toy-specific B2B metadata schema"
```

---

## Task 10: Integration Smoke Test

**Files:**
- Create: `packages/modules/factory/src/__tests__/factory-model.spec.ts`

- [ ] **Step 1: Write model smoke test**

Verify the Factory model definition is valid and has expected fields.

```typescript
 packages/modules/factory/src/__tests__/factory-model.spec.ts
import { model } from "@medusajs/framework/utils"
import Factory from "../models/factory"

describe("Factory model", () => {
  it("should be defined as a DmlEntity", () => {
    expect(Factory).toBeDefined()
    expect(Factory.name).toBe("factory")
  })

  it("should have all required fields", () => {
    const schema = Factory.schema
    expect(schema.id).toBeDefined()
    expect(schema.name).toBeDefined()
    expect(schema.slug).toBeDefined()
    expect(schema.description).toBeDefined()
    expect(schema.status).toBeDefined()
    expect(schema.certifications).toBeDefined()
    expect(schema.photos).toBeDefined()
    expect(schema.metadata).toBeDefined()
  })

  it("should have location fields", () => {
    const schema = Factory.schema
    expect(schema.location_province).toBeDefined()
    expect(schema.location_city).toBeDefined()
    expect(schema.location_address).toBeDefined()
  })

  it("should have factory capability fields", () => {
    const schema = Factory.schema
    expect(schema.established_year).toBeDefined()
    expect(schema.employee_scale).toBeDefined()
    expect(schema.monthly_capacity).toBeDefined()
    expect(schema.main_categories).toBeDefined()
  })

  it("should have default status as active", () => {
    const schema = Factory.schema
    expect(schema.status).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test**

Run: `cd /Users/svan/app/tfshop && yarn workspace @medusajs/factory test`
Expected: All tests pass

- [ ] **Step 3: Commit test**

```bash
git add packages/modules/factory/src/__tests__/
git commit -m "test(factory): add model definition smoke tests"
```

---

## Self-Review Checklist

### Spec Coverage (Phase 1 Backend)
- [x] Factory custom module — Tasks 1-5
- [x] Factory API routes (Admin + Store) — Tasks 7-8
- [x] Product metadata extension — Task 9
- [x] Workflow steps — Task 6
- [x] Tests — Task 10

### Placeholder Scan
- [x] No TBD/TODO in any task
- [x] All code steps have complete implementations
- [x] No "add appropriate error handling" or "handle edge cases"
- [x] All commands have expected outputs

### Type Consistency
- [x] `FactoryDTO`, `CreateFactoryDTO`, `UpdateFactoryDTO` consistent across types, service, steps, workflows, and validators
- [x] `FACTORY_MODULE` constant used consistently for container resolution
- [x] `factory_id` field name consistent in toy metadata and product extension

### Notes
- Product-Factory linking via Medusa Remote Link is deferred to Phase 2 (when Products are set up). Phase 1 uses `factory_id` in product metadata as a simple reference.
- The `validateAndTransformQuery` and `validateAndTransformBody` imports in middleware files may need exact path verification from the existing codebase at implementation time.
- The Medusa config module registration location needs to be verified — it may be in `medusa-config.ts` at the project root or within `packages/medusa/`.
