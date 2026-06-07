import FactoryModuleService from "./services"
import { Module } from "@medusajs/framework/utils"

const FACTORY_MODULE = "factory"

const service = FactoryModuleService

const moduleDefinition = Module(FACTORY_MODULE, {
  service,
})

export default moduleDefinition
export const FACTORY_MODULE_NAME = FACTORY_MODULE
export const __module = moduleDefinition

// Re-export types
export type {
  FactoryDTO,
  CreateFactoryDTO,
  UpdateFactoryDTO,
  FilterableFactoryDTO,
  FactoryStatus,
  IFactoryModuleService,
} from "./types"

// Re-export service
export { FactoryModuleService }
