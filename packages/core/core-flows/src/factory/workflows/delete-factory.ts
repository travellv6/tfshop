import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteFactoryStep } from "../steps"

export const deleteFactoryWorkflowId = "delete-factory-workflow"

type WorkflowInput = { ids: string[] }

export const deleteFactoryWorkflow = createWorkflow(
  deleteFactoryWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const result = deleteFactoryStep(input.ids)
    return new WorkflowResponse(result)
  }
)
