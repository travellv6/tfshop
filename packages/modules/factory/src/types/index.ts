import { DAL, ModulesSdkTypes } from "@medusajs/framework/types"
import { Factory } from "@models"

export type FactoryStatus = "active" | "inactive" | "suspended"

export interface FactoryDTO {
  id: string
  name: string
  slug: string
  description?: string | null
  cover_image?: string | null
  location_province?: string | null
  location_city?: string | null
  location_address?: string | null
  established_year?: number | null
  employee_scale?: string | null
  monthly_capacity?: string | null
  main_categories?: string | null
  certifications?: string[] | null
  photos?: string[] | null
  status: FactoryStatus
  metadata?: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
}

export interface CreateFactoryDTO {
  name: string
  slug: string
  description?: string
  cover_image?: string
  location_province?: string
  location_city?: string
  location_address?: string
  established_year?: number
  employee_scale?: string
  monthly_capacity?: string
  main_categories?: string
  certifications?: string[]
  photos?: string[]
  status?: FactoryStatus
  metadata?: Record<string, unknown>
}

export interface UpdateFactoryDTO {
  name?: string
  slug?: string
  description?: string
  cover_image?: string
  location_province?: string
  location_city?: string
  location_address?: string
  established_year?: number
  employee_scale?: string
  monthly_capacity?: string
  main_categories?: string
  certifications?: string[]
  photos?: string[]
  status?: FactoryStatus
  metadata?: Record<string, unknown>
}

export interface FilterableFactoryDTO {
  id?: string | string[]
  name?: string
  slug?: string
  status?: FactoryStatus | FactoryStatus[]
  location_province?: string
  location_city?: string
}

export interface IFactoryModuleService {
  retrieveFactory(
    id: string,
    config?: any,
    sharedContext?: any
  ): Promise<FactoryDTO>
  listFactories(
    filters?: FilterableFactoryDTO,
    config?: any,
    sharedContext?: any
  ): Promise<FactoryDTO[]>
  listAndCountFactories(
    filters?: FilterableFactoryDTO,
    config?: any,
    sharedContext?: any
  ): Promise<[FactoryDTO[], number]>
  createFactories(
    data: CreateFactoryDTO[],
    sharedContext?: any
  ): Promise<FactoryDTO[]>
  createFactories(
    data: CreateFactoryDTO,
    sharedContext?: any
  ): Promise<FactoryDTO>
  updateFactories(
    data: UpdateFactoryDTO[],
    sharedContext?: any
  ): Promise<FactoryDTO[]>
  updateFactories(
    data: UpdateFactoryDTO,
    sharedContext?: any
  ): Promise<FactoryDTO>
  deleteFactories(ids: string[], sharedContext?: any): Promise<void>
}

export type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  factoryService: ModulesSdkTypes.IMedusaInternalService<typeof Factory>
}
