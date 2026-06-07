import { PencilSquare, Plus, Trash } from "@medusajs/icons"
import { Button, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../components/common/action-menu"
import { _DataTable } from "../../../../components/table/data-table"
import {
  TieredPriceDTO,
  useDeleteTieredPrice,
  useTieredPrices,
} from "../../../../hooks/api/tiered-pricing"
import { useTieredPriceTableColumns } from "../../../../hooks/table/columns/use-tiered-price-table-columns"
import { useTieredPriceTableQuery } from "../../../../hooks/table/query/use-tiered-price-table-query"
import { useDataTable } from "../../../../hooks/use-data-table"

const PAGE_SIZE = 20

export const TieredPriceListTable = () => {
  const { t } = useTranslation()
  const { raw, searchParams } = useTieredPriceTableQuery({
    pageSize: PAGE_SIZE,
  })

  const {
    tiered_prices,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useTieredPrices(searchParams, {
    placeholderData: keepPreviousData,
  })

  const columns = useColumns()

  const { table } = useDataTable({
    data: tiered_prices ?? [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">{t("tieredPricing.domain")}</Heading>
        <Button variant="secondary" size="small" asChild>
          <Link to="/tiered-pricing/create">
            <Plus />
            {t("actions.create")}
          </Link>
        </Button>
      </div>

      <_DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        pagination
        search
        navigateTo={(row) => row.id}
        isLoading={isLoading}
        queryObject={raw}
        orderBy={[
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
      />
    </Container>
  )
}

const TieredPriceActions = ({
  tieredPrice,
}: {
  tieredPrice: TieredPriceDTO
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteTieredPrice()

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("tieredPricing.delete"),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: tieredPrice.id,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await mutateAsync(tieredPrice.id, {
      onSuccess: () => {
        toast.success(t("tieredPricing.toast.deleted"))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/tiered-pricing/${tieredPrice.id}`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<TieredPriceDTO>()

const useColumns = () => {
  const base = useTieredPriceTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <TieredPriceActions tieredPrice={row.original} />
        },
      }),
    ],
    [base]
  )
}
