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
import { ActionMenu } from "../../../../components/common/action-menu"
import {
  TieredPriceDTO,
  useDeleteTieredPrice,
} from "../../../../hooks/api/tiered-pricing"

type TieredPriceGeneralSectionProps = {
  tieredPrice: TieredPriceDTO
}

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

export const TieredPriceGeneralSection = ({
  tieredPrice,
}: TieredPriceGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const { mutateAsync } = useDeleteTieredPrice()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("tieredPricing.delete"),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: tieredPrice.id,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(tieredPrice.id, {
      onSuccess: () => {
        toast.success(t("tieredPricing.toast.deleted"))
        navigate("/tiered-pricing", { replace: true })
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>
          {t("tieredPricing.title")} - {tieredPrice.id.slice(0, 8)}
        </Heading>

        <div className="flex items-center gap-x-4">
          <Badge
            size="2xsmall"
            rounded="full"
            color={statusColor(tieredPrice.status)}
          >
            {tieredPrice.status === "active" &&
              t("tieredPricing.status.active")}
            {tieredPrice.status === "inactive" &&
              t("tieredPricing.status.inactive")}
          </Badge>

          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    icon: <PencilSquare />,
                    label: t("actions.edit"),
                    to: `/tiered-pricing/${tieredPrice.id}/edit`,
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
          {t("tieredPricing.fields.variant_id")}
        </Text>
        <Text size="small" leading="compact">
          {tieredPrice.variant_id}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("tieredPricing.fields.min_quantity")}
        </Text>
        <Text size="small" leading="compact">
          {tieredPrice.min_quantity}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("tieredPricing.fields.max_quantity")}
        </Text>
        <Text size="small" leading="compact">
          {tieredPrice.max_quantity ?? "-"}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("tieredPricing.fields.amount")}
        </Text>
        <Text size="small" leading="compact">
          {tieredPrice.amount} {tieredPrice.currency_code}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("tieredPricing.fields.currency_code")}
        </Text>
        <Text size="small" leading="compact">
          {tieredPrice.currency_code}
        </Text>
      </div>
    </Container>
  )
}
