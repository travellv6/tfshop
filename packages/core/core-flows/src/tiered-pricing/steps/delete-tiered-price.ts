import { TIERED_PRICING_MODULE_NAME } from "@medusajs/tiered-pricing"
import type { ITieredPricingModuleService } from "@medusajs/tiered-pricing"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const deleteTieredPriceStepId = "delete-tiered-price-step"

export const deleteTieredPriceStep = createStep(
  deleteTieredPriceStepId,
  async (ids: string[], { container }) => {
    const service =
      container.resolve<ITieredPricingModuleService>(TIERED_PRICING_MODULE_NAME)

    await service.deleteTieredPrices(ids)
    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }
    // Hard delete — cannot restore deleted records
  }
)
