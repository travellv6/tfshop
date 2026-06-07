import type { UpdateFactoryDTO } from "@medusajs/factory"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateFactoryStep } from "../steps"

export const updateFactoryWorkflowId = "update-factory-workflow"

type WorkflowInput = {
  selector: Record<string, any>
  update: UpdateFactoryDTO
}

export const updateFactoryWorkflow = createWorkflow(
  updateFactoryWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const factories = updateFactoryStep(input)
    return new WorkflowResponse(factories)
  }
)
