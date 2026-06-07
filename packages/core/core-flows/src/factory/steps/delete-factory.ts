import { FACTORY_MODULE_NAME } from "@medusajs/factory"
import type { IFactoryModuleService } from "@medusajs/factory"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const deleteFactoryStepId = "delete-factory-step"

export const deleteFactoryStep = createStep(
  deleteFactoryStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IFactoryModuleService>(FACTORY_MODULE_NAME)

    await service.deleteFactories(ids)
    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }
    // Hard delete — cannot restore deleted records
  }
)
