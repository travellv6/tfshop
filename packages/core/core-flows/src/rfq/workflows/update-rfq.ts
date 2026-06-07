import type { UpdateRFQDTO } from "@medusajs/rfq"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateRFQStep } from "../steps"

export const updateRFQWorkflowId = "update-rfq-workflow"

type WorkflowInput = {
  selector: Record<string, any>
  update: UpdateRFQDTO
}

export const updateRFQWorkflow = createWorkflow(
  updateRFQWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const rfqs = updateRFQStep(input)
    return new WorkflowResponse(rfqs)
  }
)
