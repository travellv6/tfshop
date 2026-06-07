import { TIERED_PRICING_MODULE_NAME } from "@medusajs/tiered-pricing"
import type {
  ITieredPricingModuleService,
  CreateTieredPriceDTO,
} from "@medusajs/tiered-pricing"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createTieredPriceStepId = "create-tiered-price-step"

export const createTieredPriceStep = createStep(
  createTieredPriceStepId,
  async (data: CreateTieredPriceDTO[], { container }) => {
    const service =
      container.resolve<ITieredPricingModuleService>(TIERED_PRICING_MODULE_NAME)

    const created = await service.createTieredPrices(data)
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
      container.resolve<ITieredPricingModuleService>(TIERED_PRICING_MODULE_NAME)
    await service.deleteTieredPrices(createdIds)
  }
)
