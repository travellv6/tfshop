import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteTieredPriceStep } from "../steps"

export const deleteTieredPriceWorkflowId = "delete-tiered-price-workflow"

type WorkflowInput = { ids: string[] }

export const deleteTieredPriceWorkflow = createWorkflow(
  deleteTieredPriceWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const result = deleteTieredPriceStep(input.ids)
    return new WorkflowResponse(result)
  }
)
