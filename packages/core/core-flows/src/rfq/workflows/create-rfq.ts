import type { CreateRFQDTO } from "@medusajs/rfq"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createRFQStep } from "../steps"

export const createRFQWorkflowId = "create-rfq-workflow"

type WorkflowInput = { rfqs: CreateRFQDTO[] }

export const createRFQWorkflow = createWorkflow(
  createRFQWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const rfqs = createRFQStep(input.rfqs)
    return new WorkflowResponse(rfqs)
  }
)
