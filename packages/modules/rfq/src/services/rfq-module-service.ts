import {
  DAL,
  InternalModuleDeclaration,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { MedusaService } from "@medusajs/framework/utils"

import { RFQ, RFQMessage } from "@models"
import type {
  RFQDTO,
  RFQMessageDTO,
  InjectedDependencies,
} from "@types"

class RFQModuleService extends MedusaService<{
  RFQ: { dto: RFQDTO; model: typeof RFQ }
  RFQMessage: { dto: RFQMessageDTO; model: typeof RFQMessage }
}>({ RFQ, RFQMessage }) {
  protected baseRepository_: DAL.RepositoryService
  protected rfqService_: ModulesSdkTypes.IMedusaInternalService<typeof RFQ>
  protected rfqMessageService_: ModulesSdkTypes.IMedusaInternalService<
    typeof RFQMessage
  >

  constructor(
    { baseRepository, rfqService, rfqMessageService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.rfqService_ = rfqService
    this.rfqMessageService_ = rfqMessageService
  }
}

export default RFQModuleService
