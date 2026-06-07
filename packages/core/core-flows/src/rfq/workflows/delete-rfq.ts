import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteRFQStep } from "../steps"

export const deleteRFQWorkflowId = "delete-rfq-workflow"

type WorkflowInput = { ids: string[] }

export const deleteRFQWorkflow = createWorkflow(
  deleteRFQWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const result = deleteRFQStep(input.ids)
    return new WorkflowResponse(result)
  }
)
