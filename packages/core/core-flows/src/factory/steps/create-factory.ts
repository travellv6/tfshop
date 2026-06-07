import { FACTORY_MODULE_NAME } from "@medusajs/factory"
import type {
  IFactoryModuleService,
  CreateFactoryDTO,
} from "@medusajs/factory"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createFactoryStepId = "create-factory-step"

export const createFactoryStep = createStep(
  createFactoryStepId,
  async (data: CreateFactoryDTO[], { container }) => {
    const service = container.resolve<IFactoryModuleService>(FACTORY_MODULE_NAME)

    const created = await service.createFactories(data)
    return new StepResponse(
      created,
      created.map((f) => f.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IFactoryModuleService>(FACTORY_MODULE_NAME)
    await service.deleteFactories(createdIds)
  }
)
