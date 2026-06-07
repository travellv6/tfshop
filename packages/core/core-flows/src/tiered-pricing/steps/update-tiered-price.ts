import { TIERED_PRICING_MODULE_NAME } from "@medusajs/tiered-pricing"
import type {
  ITieredPricingModuleService,
  UpdateTieredPriceDTO,
  TieredPriceDTO,
} from "@medusajs/tiered-pricing"
import {
  getSelectsAndRelationsFromObjectArray,
  convertItemResponseToUpdateRequest,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const updateTieredPriceStepId = "update-tiered-price-step"

type UpdateTieredPriceStepInput = {
  selector: Record<string, any>
  update: UpdateTieredPriceDTO
}

export const updateTieredPriceStep = createStep(
  updateTieredPriceStepId,
  async (input: UpdateTieredPriceStepInput, { container }) => {
    const service =
      container.resolve<ITieredPricingModuleService>(TIERED_PRICING_MODULE_NAME)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      input.update,
    ])
    const dataBeforeUpdate = await service.listTieredPrices(input.selector, {
      relations,
      select: selects,
    })

    if (!dataBeforeUpdate.length) {
      return new StepResponse([], {
        dataBeforeUpdate: [],
        selects,
        relations,
      })
    }

    const updated = await service.updateTieredPrices(
      dataBeforeUpdate.map((f: TieredPriceDTO) => ({
        ...input.update,
        id: f.id,
      }))
    )

    return new StepResponse(updated, {
      dataBeforeUpdate,
      selects,
      relations,
    })
  },
  async (revertInput, { container }) => {
    if (!revertInput) {
      return
    }

    const { dataBeforeUpdate, selects, relations } = revertInput

    if (!dataBeforeUpdate?.length) {
      return
    }

    const service =
      container.resolve<ITieredPricingModuleService>(TIERED_PRICING_MODULE_NAME)

    await service.updateTieredPrices(
      dataBeforeUpdate.map((data: TieredPriceDTO) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      ) as UpdateTieredPriceDTO[]
    )
  }
)
