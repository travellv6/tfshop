import {
  DAL,
  InternalModuleDeclaration,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { MedusaService } from "@medusajs/framework/utils"

import { Factory } from "@models"
import type {
  FactoryDTO,
  IFactoryModuleService,
  InjectedDependencies,
} from "@types"

class FactoryModuleService
  extends MedusaService<{
    Factory: { dto: FactoryDTO; model: typeof Factory }
  }>({ Factory })
  implements IFactoryModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected factoryService_: ModulesSdkTypes.IMedusaInternalService<
    typeof Factory
  >

  constructor(
    { baseRepository, factoryService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.factoryService_ = factoryService
  }
}

export default FactoryModuleService
