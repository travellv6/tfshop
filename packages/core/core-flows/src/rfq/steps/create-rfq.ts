import { RFQ_MODULE_NAME } from "@medusajs/rfq"
import type {
  IRFQModuleService,
  CreateRFQDTO,
} from "@medusajs/rfq"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createRFQStepId = "create-rfq-step"

export const createRFQStep = createStep(
  createRFQStepId,
  async (data: CreateRFQDTO[], { container }) => {
    const service =
      container.resolve<IRFQModuleService>(RFQ_MODULE_NAME)

    const created = await service.createRfqs(data)
    return new StepResponse(
      created,
      created.map((f) => f.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service =
      container.resolve<IRFQModuleService>(RFQ_MODULE_NAME)
    await service.deleteRfqs(createdIds)
  }
)
