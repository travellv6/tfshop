import { FACTORY_MODULE_NAME } from "@medusajs/factory"
import type {
  IFactoryModuleService,
  UpdateFactoryDTO,
  FactoryDTO,
} from "@medusajs/factory"
import {
  getSelectsAndRelationsFromObjectArray,
  convertItemResponseToUpdateRequest,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const updateFactoryStepId = "update-factory-step"

type UpdateFactoryStepInput = {
  selector: Record<string, any>
  update: UpdateFactoryDTO
}

export const updateFactoryStep = createStep(
  updateFactoryStepId,
  async (input: UpdateFactoryStepInput, { container }) => {
    const service = container.resolve<IFactoryModuleService>(FACTORY_MODULE_NAME)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      input.update,
    ])
    const dataBeforeUpdate = await service.listFactories(input.selector, {
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

    const updated = await service.updateFactories(
      dataBeforeUpdate.map((f: FactoryDTO) => ({
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

    const service = container.resolve<IFactoryModuleService>(FACTORY_MODULE_NAME)

    await service.updateFactories(
      dataBeforeUpdate.map((data: FactoryDTO) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      ) as UpdateFactoryDTO[]
    )
  }
)
