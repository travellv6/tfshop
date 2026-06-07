import { PencilSquare, Trash } from "@medusajs/icons"
import {
  Badge,
  Container,
  Heading,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { FactoryDTO, useDeleteFactory } from "../../../../../hooks/api/factories"

type FactoryGeneralSectionProps = {
  factory: FactoryDTO
}

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

export const FactoryGeneralSection = ({
  factory,
}: FactoryGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const { mutateAsync } = useDeleteFactory()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("factories.confirmDelete"),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: factory.name,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(factory.id, {
      onSuccess: () => {
        toast.success(t("factories.toast.deleted"))
        navigate("/factories", { replace: true })
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{factory.name}</Heading>

        <div className="flex items-center gap-x-4">
          <Badge size="2xsmall" rounded="full" color={statusColor(factory.status)}>
            {t(`factories.status.${factory.status}`)}
          </Badge>

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
        </div>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("factories.fields.slug")}
        </Text>
        <Text size="small" leading="compact">
          {factory.slug}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.description")}
        </Text>
        <Text size="small" leading="compact">
          {factory.description || "-"}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("factories.fields.location_province")}
        </Text>
        <Text size="small" leading="compact">
          {factory.location_province || "-"}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("factories.fields.location_city")}
        </Text>
        <Text size="small" leading="compact">
          {factory.location_city || "-"}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("factories.fields.location_address")}
        </Text>
        <Text size="small" leading="compact">
          {factory.location_address || "-"}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("factories.fields.established_year")}
        </Text>
        <Text size="small" leading="compact">
          {factory.established_year || "-"}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("factories.fields.employee_scale")}
        </Text>
        <Text size="small" leading="compact">
          {factory.employee_scale || "-"}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("factories.fields.monthly_capacity")}
        </Text>
        <Text size="small" leading="compact">
          {factory.monthly_capacity || "-"}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("factories.fields.main_categories")}
        </Text>
        <Text size="small" leading="compact">
          {factory.main_categories || "-"}
        </Text>
      </div>
    </Container>
  )
}
