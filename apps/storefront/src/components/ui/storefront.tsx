"use client"

import type { LucideIcon } from "lucide-react"
import {
  Award,
  Baby,
  Blocks,
  BookOpen,
  Bot,
  Camera,
  CheckCircle2,
  ChevronRight,
  Factory,
  Headphones,
  Heart,
  Lock,
  Mail,
  MapPin,
  Menu,
  PackageCheck,
  Palette,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Truck,
  Trophy,
  UserRound,
  WalletCards,
} from "lucide-react"

export const iconMap: Record<string, LucideIcon> = {
  award: Award,
  baby: Baby,
  blocks: Blocks,
  book: BookOpen,
  bot: Bot,
  camera: Camera,
  check: CheckCircle2,
  chevron: ChevronRight,
  factory: Factory,
  headphones: Headphones,
  heart: Heart,
  lock: Lock,
  mail: Mail,
  map: MapPin,
  menu: Menu,
  package: PackageCheck,
  palette: Palette,
  search: Search,
  shield: ShieldCheck,
  cart: ShoppingCart,
  sparkles: Sparkles,
  star: Star,
  tag: Tag,
  truck: Truck,
  trophy: Trophy,
  user: UserRound,
  wallet: WalletCards,
}

export function IconBadge({
  icon,
  className = "",
}: {
  icon: string
  className?: string
}) {
  const Icon = iconMap[icon] || Sparkles

  return (
    <span
      className={`bg-brand-50 text-brand-700 ring-brand-100 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ${className}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-brand-700 mb-2 text-xs font-semibold uppercase tracking-wide">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-ink-900 text-2xl font-bold sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="text-ink-500 mt-1 max-w-2xl text-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function StatusPill({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}
    >
      {children}
    </span>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="border-surface-300 rounded-lg border border-dashed bg-white p-10 text-center">
      <div className="bg-brand-50 text-brand-700 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
        <PackageCheck className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="font-display text-ink-900 text-lg font-bold">{title}</h3>
      {description && (
        <p className="text-ink-500 mx-auto mt-2 max-w-sm text-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Rating({
  value = "4.9",
  count = "128",
}: {
  value?: string
  count?: string
}) {
  return (
    <span className="text-ink-700 inline-flex items-center gap-1 text-xs font-medium">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      {value} <span className="text-ink-400">({count})</span>
    </span>
  )
}
