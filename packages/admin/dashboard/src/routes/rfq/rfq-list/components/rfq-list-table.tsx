import { Trash } from "@medusajs/icons"
import { Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../components/common/action-menu"
import { RFQDTO, useDeleteRFQ, useRFQs } from "../../../../hooks/api/rfq"
import { useRFQTableColumns } from "../../../../hooks/table/columns/use-rfq-table-columns"
import { useRFQTableQuery } from "../../../../hooks/table/query/use-rfq-table-query"
import { useDataTable } from "../../../../hooks/use-data-table"

const PAGE_SIZE = 20

export const RFQListTable = () => {
  const { t } = useTranslation()
  const { raw, searchParams } = useRFQTableQuery({ pageSize: PAGE_SIZE })

  const {
    rfqs,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useRFQs(searchParams, {
    placeholderData: keepPreviousData,
  })

  const columns = useColumns()

  const { table } = useDataTable({
    data: rfqs ?? [],
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
        <Heading level="h1">{t("rfq.domain")}</Heading>
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

const RFQActions = ({ rfq }: { rfq: RFQDTO }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteRFQ()

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("rfq.toast.deleted"),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: rfq.product_title || rfq.id,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await mutateAsync(rfq.id, {
      onSuccess: () => {
        toast.success(
          t("rfq.toast.deleted")
        )
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

const columnHelper = createColumnHelper<RFQDTO>()

const useColumns = () => {
  const base = useRFQTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <RFQActions rfq={row.original} />
        },
      }),
    ],
    [base]
  )
}
