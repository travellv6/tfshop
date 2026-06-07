import { RFQ_MODULE_NAME } from "@medusajs/rfq"
import type {
  IRFQModuleService,
  CreateRFQMessageDTO,
} from "@medusajs/rfq"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const addRFQMessageStepId = "add-rfq-message-step"

export const addRFQMessageStep = createStep(
  addRFQMessageStepId,
  async (data: CreateRFQMessageDTO[], { container }) => {
    const service =
      container.resolve<IRFQModuleService>(RFQ_MODULE_NAME)

    const created = await service.createRFQMessages(data)
    return new StepResponse(
      created,
      created.map((c: any) => c.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service =
      container.resolve<IRFQModuleService>(RFQ_MODULE_NAME)
    await service.deleteRFQMessages(createdIds)
  }
)
