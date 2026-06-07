import type { CreateFactoryDTO } from "@medusajs/factory"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createFactoryStep } from "../steps"

export const createFactoryWorkflowId = "create-factory-workflow"

type WorkflowInput = { factories: CreateFactoryDTO[] }

export const createFactoryWorkflow = createWorkflow(
  createFactoryWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const factories = createFactoryStep(input.factories)
    return new WorkflowResponse(factories)
  }
)
