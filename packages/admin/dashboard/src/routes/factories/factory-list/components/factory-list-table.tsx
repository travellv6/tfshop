import { PencilSquare, Trash } from "@medusajs/icons"
import { Button, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../components/common/action-menu"
import { _DataTable } from "../../../../components/table/data-table"
import { FactoryDTO, useDeleteFactory, useFactories } from "../../../../hooks/api/factories"
import { useFactoryTableColumns } from "../../../../hooks/table/columns/use-factory-table-columns"
import { useFactoryTableQuery } from "../../../../hooks/table/query/use-factory-table-query"
import { useDataTable } from "../../../../hooks/use-data-table"

const PAGE_SIZE = 20

export const FactoryListTable = () => {
  const { t } = useTranslation()
  const { raw, searchParams } = useFactoryTableQuery({ pageSize: PAGE_SIZE })

  const {
    factories,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useFactories(searchParams, {
    placeholderData: keepPreviousData,
  })

  const columns = useColumns()

  const { table } = useDataTable({
    data: factories ?? [],
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
        <Heading level="h1">{t("factories.domain")}</Heading>
        <Link to="/factories/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
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
          { key: "name", label: t("fields.name") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
      />
    </Container>
  )
}

const FactoryActions = ({ factory }: { factory: FactoryDTO }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteFactory()

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("factories.confirmDelete"),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: factory.name,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await mutateAsync(factory.id, {
      onSuccess: () => {
        toast.success(
          t("factories.toast.deleted", { name: factory.name })
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
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/factories/${factory.id}/edit`,
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

const columnHelper = createColumnHelper<FactoryDTO>()

const useColumns = () => {
  const base = useFactoryTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <FactoryActions factory={row.original} />
        },
      }),
    ],
    [base]
  )
}
