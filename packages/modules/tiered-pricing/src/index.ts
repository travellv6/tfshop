import TieredPricingModuleService from "./services"
import { Module } from "@medusajs/framework/utils"

const TIERED_PRICING_MODULE = "tiered-pricing"

const service = TieredPricingModuleService

const moduleDefinition = Module(TIERED_PRICING_MODULE, {
  service,
})

export default moduleDefinition
export const TIERED_PRICING_MODULE_NAME = TIERED_PRICING_MODULE
export const __module = moduleDefinition

// Re-export types
export type {
  TieredPriceDTO,
  CreateTieredPriceDTO,
  UpdateTieredPriceDTO,
  FilterableTieredPriceDTO,
  TieredPriceStatus,
  ITieredPricingModuleService,
} from "./types"

// Re-export service
export { TieredPricingModuleService }
