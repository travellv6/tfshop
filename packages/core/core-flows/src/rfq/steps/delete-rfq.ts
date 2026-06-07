import { RFQ_MODULE_NAME } from "@medusajs/rfq"
import type { IRFQModuleService } from "@medusajs/rfq"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const deleteRFQStepId = "delete-rfq-step"

export const deleteRFQStep = createStep(
  deleteRFQStepId,
  async (ids: string[], { container }) => {
    const service =
      container.resolve<IRFQModuleService>(RFQ_MODULE_NAME)

    await service.deleteRfqs(ids)
    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }
    // Hard delete — cannot restore deleted records
  }
)
