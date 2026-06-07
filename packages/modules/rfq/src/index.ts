import RFQModuleService from "./services"
import { Module } from "@medusajs/framework/utils"

const RFQ_MODULE = "rfq"

const service = RFQModuleService

const moduleDefinition = Module(RFQ_MODULE, {
  service,
})

export default moduleDefinition
export const RFQ_MODULE_NAME = RFQ_MODULE
export const __module = moduleDefinition

// Re-export types
export type {
  RFQDTO,
  RFQMessageDTO,
  CreateRFQDTO,
  UpdateRFQDTO,
  CreateRFQMessageDTO,
  FilterableRFQDTO,
  FilterableRFQMessageDTO,
  RFQStatus,
  SenderType,
  IRFQModuleService,
  InjectedDependencies,
} from "./types"

// Re-export service
export { RFQModuleService }
