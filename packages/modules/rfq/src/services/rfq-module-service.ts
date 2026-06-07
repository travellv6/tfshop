import {
  DAL,
  InternalModuleDeclaration,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { MedusaService } from "@medusajs/framework/utils"

import { Rfq, RfqMessage } from "@models"
import type {
  RFQDTO,
  RFQMessageDTO,
  InjectedDependencies,
} from "@types"

class RFQModuleService extends MedusaService<{
  Rfq: { dto: RFQDTO; model: typeof Rfq }
  RfqMessage: { dto: RFQMessageDTO; model: typeof RfqMessage }
}>({ Rfq, RfqMessage }) {
  protected baseRepository_: DAL.RepositoryService
  protected rfqService_: ModulesSdkTypes.IMedusaInternalService<typeof Rfq>
  protected rfqMessageService_: ModulesSdkTypes.IMedusaInternalService<
    typeof RfqMessage
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
