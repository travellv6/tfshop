import type { CreateTieredPriceDTO } from "@medusajs/tiered-pricing"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createTieredPriceStep } from "../steps"

export const createTieredPriceWorkflowId = "create-tiered-price-workflow"

type WorkflowInput = { tiered_prices: CreateTieredPriceDTO[] }

export const createTieredPriceWorkflow = createWorkflow(
  createTieredPriceWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const tiered_prices = createTieredPriceStep(input.tiered_prices)
    return new WorkflowResponse(tiered_prices)
  }
)
