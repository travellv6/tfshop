import { createColumnHelper } from "@tanstack/react-table"

import { Badge } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { FactoryDTO } from "../../../hooks/api/factories"
import {
  TextCell,
  TextHeader,
} from "../../../components/table/table-cells/common/text-cell"

const columnHelper = createColumnHelper<FactoryDTO>()

const statusColor = (status: string) => {
  switch (status) {
    case "active":
      return "green"
    case "inactive":
      return "grey"
    case "suspended":
      return "red"
    default:
      return "grey"
  }
}

export const useFactoryTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <TextHeader text={t("factories.fields.name")} />,
        cell: ({ row }) => {
          const name = row.original.name
          const slug = row.original.slug
          return (
            <div className="flex h-full w-full flex-col justify-center">
              <span className="truncate">{name}</span>
              <span className="text-ui-fg-subtle truncate text-xs">
                {slug}
              </span>
            </div>
          )
        },
      }),
      columnHelper.accessor("location_city", {
        header: () => <TextHeader text={t("factories.fields.location_city")} />,
        cell: ({ getValue }) => {
          const value = getValue()
          return <TextCell text={value ?? undefined} />
        },
      }),
      columnHelper.accessor("main_categories", {
        header: () => (
          <TextHeader text={t("factories.fields.main_categories")} />
        ),
        cell: ({ getValue }) => {
          const value = getValue()
          return <TextCell text={value ?? undefined} />
        },
      }),
      columnHelper.accessor("established_year", {
        header: () => (
          <TextHeader text={t("factories.fields.established_year")} />
        ),
        cell: ({ getValue }) => {
          const value = getValue()
          return <TextCell text={value ? String(value) : undefined} />
        },
      }),
      columnHelper.accessor("status", {
        header: () => <TextHeader text={t("factories.fields.status")} />,
        cell: ({ getValue }) => {
          const status = getValue()
          return (
            <div className="flex h-full w-full items-center">
              <Badge
                size="2xsmall"
                rounded="full"
                color={statusColor(status)}
              >
                {t(`factories.status.${status}`)}
              </Badge>
            </div>
          )
        },
      }),
    ],
    [t]
  )
}
