import type { UpdateTieredPriceDTO } from "@medusajs/tiered-pricing"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateTieredPriceStep } from "../steps"

export const updateTieredPriceWorkflowId = "update-tiered-price-workflow"

type WorkflowInput = {
  selector: Record<string, any>
  update: UpdateTieredPriceDTO
}

export const updateTieredPriceWorkflow = createWorkflow(
  updateTieredPriceWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const tiered_prices = updateTieredPriceStep(input)
    return new WorkflowResponse(tiered_prices)
  }
)
