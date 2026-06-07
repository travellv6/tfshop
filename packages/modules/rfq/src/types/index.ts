import {
  DAL,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { Rfq, RfqMessage } from "@models"

export type RFQStatus =
  | "draft"
  | "submitted"
  | "reviewing"
  | "quoted"
  | "negotiating"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled"

export type SenderType = "buyer" | "admin" | "system"

export interface RFQDTO {
  id: string
  customer_id: string
  customer_email: string
  product_id: string | null
  product_title: string | null
  variant_id: string | null
  factory_id: string | null
  status: RFQStatus
  quantity: number | null
  target_price: string | null
  currency_code: string
  requirements: Record<string, unknown>
  quoted_price: string | null
  quoted_lead_time: string | null
  quoted_terms: Record<string, unknown>
  notes: string | null
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
}

export interface RFQMessageDTO {
  id: string
  rfq_id: string
  sender_type: SenderType
  content: string
  attachments: Record<string, unknown>
  internal: boolean
  created_at: Date
}

export interface CreateRFQDTO {
  customer_id?: string
  customer_email: string
  product_id?: string
  product_title?: string
  variant_id?: string
  factory_id?: string
  status?: RFQStatus
  quantity?: number
  target_price?: string
  currency_code?: string
  requirements?: Record<string, unknown>
  quoted_price?: string
  quoted_lead_time?: string
  quoted_terms?: Record<string, unknown>
  notes?: string
  metadata?: Record<string, unknown>
}

export interface UpdateRFQDTO {
  id: string
  customer_id?: string
  customer_email?: string
  product_id?: string | null
  product_title?: string | null
  variant_id?: string | null
  factory_id?: string | null
  status?: RFQStatus
  quantity?: number | null
  target_price?: string | null
  currency_code?: string
  requirements?: Record<string, unknown>
  quoted_price?: string | null
  quoted_lead_time?: string | null
  quoted_terms?: Record<string, unknown>
  notes?: string | null
  metadata?: Record<string, unknown> | null
}

export interface CreateRFQMessageDTO {
  rfq_id: string
  sender_type: SenderType
  content: string
  attachments?: Record<string, unknown>
  internal?: boolean
}

export interface FilterableRFQDTO {
  id?: string | string[]
  customer_id?: string | string[]
  status?: RFQStatus | RFQStatus[]
  product_id?: string | string[]
  factory_id?: string | string[]
  customer_email?: string | string[]
}

export interface FilterableRFQMessageDTO {
  id?: string | string[]
  rfq_id?: string | string[]
  sender_type?: SenderType | SenderType[]
}

export interface IRFQModuleService {
  retrieveRfq(
    id: string,
    config?: any,
    sharedContext?: any
  ): Promise<RFQDTO>
  listRfqs(
    filters?: FilterableRFQDTO,
    config?: any,
    sharedContext?: any
  ): Promise<RFQDTO[]>
  listAndCountRfqs(
    filters?: FilterableRFQDTO,
    config?: any,
    sharedContext?: any
  ): Promise<[RFQDTO[], number]>
  createRfqs(
    data: CreateRFQDTO[],
    sharedContext?: any
  ): Promise<RFQDTO[]>
  createRfqs(
    data: CreateRFQDTO,
    sharedContext?: any
  ): Promise<RFQDTO>
  updateRfqs(
    data: UpdateRFQDTO[],
    sharedContext?: any
  ): Promise<RFQDTO[]>
  updateRfqs(
    data: UpdateRFQDTO,
    sharedContext?: any
  ): Promise<RFQDTO>
  deleteRfqs(ids: string[], sharedContext?: any): Promise<void>

  retrieveRfqMessage(
    id: string,
    config?: any,
    sharedContext?: any
  ): Promise<RFQMessageDTO>
  listRfqMessages(
    filters?: FilterableRFQMessageDTO,
    config?: any,
    sharedContext?: any
  ): Promise<RFQMessageDTO[]>
  listAndCountRfqMessages(
    filters?: FilterableRFQMessageDTO,
    config?: any,
    sharedContext?: any
  ): Promise<[RFQMessageDTO[], number]>
  createRfqMessages(
    data: CreateRFQMessageDTO[],
    sharedContext?: any
  ): Promise<RFQMessageDTO[]>
  createRfqMessages(
    data: CreateRFQMessageDTO,
    sharedContext?: any
  ): Promise<RFQMessageDTO>
  deleteRfqMessages(ids: string[], sharedContext?: any): Promise<void>
}

export type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  rfqService: ModulesSdkTypes.IMedusaInternalService<typeof Rfq>
  rfqMessageService: ModulesSdkTypes.IMedusaInternalService<typeof RfqMessage>
}
