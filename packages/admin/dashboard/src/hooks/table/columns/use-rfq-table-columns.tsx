import { createColumnHelper } from "@tanstack/react-table"

import { Badge } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { RFQDTO } from "../../../hooks/api/rfq"
import {
  TextCell,
  TextHeader,
} from "../../../components/table/table-cells/common/text-cell"

const columnHelper = createColumnHelper<RFQDTO>()

const statusColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "blue"
    case "reviewing":
      return "orange"
    case "quoted":
      return "purple"
    case "negotiating":
      return "orange"
    case "accepted":
      return "green"
    case "rejected":
      return "red"
    default:
      return "grey"
  }
}

export const useRFQTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("product_title", {
        header: () => (
          <TextHeader text={t("rfq.fields.product_title")} />
        ),
        cell: ({ getValue }) => {
          const value = getValue()
          return <TextCell text={value ?? undefined} />
        },
      }),
      columnHelper.accessor("customer_email", {
        header: () => (
          <TextHeader text={t("rfq.fields.customer_email")} />
        ),
        cell: ({ getValue }) => {
          const value = getValue()
          return <TextCell text={value ?? undefined} />
        },
      }),
      columnHelper.accessor("quantity", {
        header: () => (
          <TextHeader text={t("rfq.fields.quantity")} />
        ),
        cell: ({ getValue }) => {
          const value = getValue()
          return <TextCell text={value ? String(value) : undefined} />
        },
      }),
      columnHelper.accessor("status", {
        header: () => <TextHeader text={t("rfq.fields.status")} />,
        cell: ({ getValue }) => {
          const status = getValue()
          return (
            <div className="flex h-full w-full items-center">
              <Badge
                size="2xsmall"
                rounded="full"
                color={statusColor(status)}
              >
                {t(`rfq.status.${status}`)}
              </Badge>
            </div>
          )
        },
      }),
      columnHelper.accessor("quoted_price", {
        header: () => (
          <TextHeader text={t("rfq.fields.quoted_price")} />
        ),
        cell: ({ getValue }) => {
          const value = getValue()
          return <TextCell text={value ?? undefined} />
        },
      }),
      columnHelper.accessor("created_at", {
        header: () => <TextHeader text={t("fields.createdAt")} />,
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <TextCell
              text={value ? new Date(value).toLocaleDateString() : undefined}
            />
          )
        },
      }),
    ],
    [t]
  )
}
