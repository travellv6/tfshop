import type { CreateRFQMessageDTO } from "@medusajs/rfq"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { addRFQMessageStep } from "../steps"

export const addRFQMessageWorkflowId = "add-rfq-message-workflow"

type WorkflowInput = { messages: CreateRFQMessageDTO[] }

export const addRFQMessageWorkflow = createWorkflow(
  addRFQMessageWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const messages = addRFQMessageStep(input.messages)
    return new WorkflowResponse(messages)
  }
)
