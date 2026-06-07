import { RFQ_MODULE_NAME } from "@medusajs/rfq"
import type {
  IRFQModuleService,
  UpdateRFQDTO,
  RFQDTO,
} from "@medusajs/rfq"
import {
  getSelectsAndRelationsFromObjectArray,
  convertItemResponseToUpdateRequest,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const updateRFQStepId = "update-rfq-step"

type UpdateRFQStepInput = {
  selector: Record<string, any>
  update: UpdateRFQDTO
}

export const updateRFQStep = createStep(
  updateRFQStepId,
  async (input: UpdateRFQStepInput, { container }) => {
    const service =
      container.resolve<IRFQModuleService>(RFQ_MODULE_NAME)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      input.update,
    ])
    const dataBeforeUpdate = await service.listRfqs(input.selector, {
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

    const updated = await service.updateRfqs(
      dataBeforeUpdate.map((f: RFQDTO) => ({
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
      container.resolve<IRFQModuleService>(RFQ_MODULE_NAME)

    await service.updateRfqs(
      dataBeforeUpdate.map((data: RFQDTO) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      ) as UpdateRFQDTO[]
    )
  }
)
