import {
  DAL,
  InternalModuleDeclaration,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { MedusaService } from "@medusajs/framework/utils"

import { TieredPrice } from "@models"
import type {
  TieredPriceDTO,
  ITieredPricingModuleService,
  InjectedDependencies,
} from "@types"

class TieredPricingModuleService
  extends MedusaService<{
    TieredPrice: { dto: TieredPriceDTO; model: typeof TieredPrice }
  }>({ TieredPrice })
  implements ITieredPricingModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected tieredPriceService_: ModulesSdkTypes.IMedusaInternalService<
    typeof TieredPrice
  >

  constructor(
    { baseRepository, tieredPriceService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.tieredPriceService_ = tieredPriceService
  }
}

export default TieredPricingModuleService
