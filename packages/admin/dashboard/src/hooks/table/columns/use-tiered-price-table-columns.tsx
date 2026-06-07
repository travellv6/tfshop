import { createColumnHelper } from "@tanstack/react-table"

import { Badge } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { TieredPriceDTO } from "../../api/tiered-pricing"
import {
  TextCell,
  TextHeader,
} from "../../../components/table/table-cells/common/text-cell"

const columnHelper = createColumnHelper<TieredPriceDTO>()

const statusColor = (status: string) => {
  switch (status) {
    case "active":
      return "green"
    case "inactive":
      return "grey"
    default:
      return "grey"
  }
}

export const useTieredPriceTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("variant_id", {
        header: () => (
          <TextHeader text={t("tieredPricing.fields.variant_id")} />
        ),
        cell: ({ getValue }) => {
          const value = getValue()
          const truncated =
            value.length > 8 ? `${value.substring(0, 8)}...` : value
          return <TextCell text={truncated} />
        },
      }),
      columnHelper.accessor("min_quantity", {
        header: () => (
          <TextHeader text={t("tieredPricing.fields.min_quantity")} />
        ),
        cell: ({ getValue }) => {
          return <TextCell text={String(getValue())} />
        },
      }),
      columnHelper.accessor("max_quantity", {
        header: () => (
          <TextHeader text={t("tieredPricing.fields.max_quantity")} />
        ),
        cell: ({ getValue }) => {
          const value = getValue()
          return <TextCell text={value !== null ? String(value) : "∞"} />
        },
      }),
      columnHelper.accessor("amount", {
        header: () => (
          <TextHeader text={t("tieredPricing.fields.amount")} />
        ),
        cell: ({ row }) => {
          const amount = row.original.amount
          const formatted = `$${parseFloat(amount).toFixed(2)}`
          return <TextCell text={formatted} />
        },
      }),
      columnHelper.accessor("currency_code", {
        header: () => (
          <TextHeader text={t("tieredPricing.fields.currency_code")} />
        ),
        cell: ({ getValue }) => {
          return <TextCell text={getValue().toUpperCase()} />
        },
      }),
      columnHelper.accessor("status", {
        header: () => (
          <TextHeader text={t("tieredPricing.fields.status")} />
        ),
        cell: ({ getValue }) => {
          const status = getValue()
          return (
            <div className="flex h-full w-full items-center">
              <Badge
                size="2xsmall"
                rounded="full"
                color={statusColor(status)}
              >
                {t(`tieredPricing.status.${status}`)}
              </Badge>
            </div>
          )
        },
      }),
    ],
    [t]
  )
}
