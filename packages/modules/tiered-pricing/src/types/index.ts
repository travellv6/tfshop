import { DAL, ModulesSdkTypes } from "@medusajs/framework/types"
import { TieredPrice } from "@models"

export type TieredPriceStatus = "active" | "inactive"

export interface TieredPriceDTO {
  id: string
  variant_id: string
  min_quantity: number
  max_quantity: number | null
  amount: string
  currency_code: string
  rules: Record<string, unknown>
  status: TieredPriceStatus
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
}

export interface CreateTieredPriceDTO {
  variant_id: string
  min_quantity: number
  max_quantity?: number | null
  amount: string | number
  currency_code: string
  rules?: Record<string, unknown>
  status?: TieredPriceStatus
  metadata?: Record<string, unknown>
}

export interface UpdateTieredPriceDTO {
  variant_id?: string
  min_quantity?: number
  max_quantity?: number | null
  amount?: string | number
  currency_code?: string
  rules?: Record<string, unknown>
  status?: TieredPriceStatus
  metadata?: Record<string, unknown>
}

export interface FilterableTieredPriceDTO {
  id?: string | string[]
  variant_id?: string | string[]
  currency_code?: string | string[]
  status?: TieredPriceStatus | TieredPriceStatus[]
}

export interface ITieredPricingModuleService {
  retrieveTieredPrice(
    id: string,
    config?: any,
    sharedContext?: any
  ): Promise<TieredPriceDTO>
  listTieredPrices(
    filters?: FilterableTieredPriceDTO,
    config?: any,
    sharedContext?: any
  ): Promise<TieredPriceDTO[]>
  listAndCountTieredPrices(
    filters?: FilterableTieredPriceDTO,
    config?: any,
    sharedContext?: any
  ): Promise<[TieredPriceDTO[], number]>
  createTieredPrices(
    data: CreateTieredPriceDTO[],
    sharedContext?: any
  ): Promise<TieredPriceDTO[]>
  createTieredPrices(
    data: CreateTieredPriceDTO,
    sharedContext?: any
  ): Promise<TieredPriceDTO>
  updateTieredPrices(
    data: UpdateTieredPriceDTO[],
    sharedContext?: any
  ): Promise<TieredPriceDTO[]>
  updateTieredPrices(
    data: UpdateTieredPriceDTO,
    sharedContext?: any
  ): Promise<TieredPriceDTO>
  deleteTieredPrices(ids: string[], sharedContext?: any): Promise<void>
}

export type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  tieredPriceService: ModulesSdkTypes.IMedusaInternalService<typeof TieredPrice>
}
