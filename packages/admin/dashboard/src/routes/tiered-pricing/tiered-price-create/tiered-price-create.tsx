import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Select, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../components/modals"
import { KeyboundForm } from "../../../components/utilities/keybound-form"
import { VisuallyHidden } from "../../../components/utilities/visually-hidden"
import { useCreateTieredPrice } from "../../../hooks/api/tiered-pricing"

const CreateTieredPriceSchema = zod.object({
  variant_id: zod.string().min(1),
  min_quantity: zod.string().min(1),
  max_quantity: zod.string().optional(),
  amount: zod.string().min(1),
  currency_code: zod.string().length(3),
  status: zod.enum(["active", "inactive"]),
})

export const TieredPriceCreate = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { mutateAsync, isPending } = useCreateTieredPrice()

  const form = useForm<zod.infer<typeof CreateTieredPriceSchema>>({
    defaultValues: {
      variant_id: "",
      min_quantity: "",
      max_quantity: "",
      amount: "",
      currency_code: "USD",
      status: "active",
    },
    resolver: zodResolver(CreateTieredPriceSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        variant_id: data.variant_id,
        min_quantity: Number(data.min_quantity),
        max_quantity: data.max_quantity ? Number(data.max_quantity) : null,
        amount: data.amount,
        currency_code: data.currency_code,
        status: data.status,
      },
      {
        onSuccess: ({ tiered_price }) => {
          toast.success(t("tieredPricing.toast.created"))
          handleSuccess(`/tiered-pricing/${tiered_price.id}`)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <RouteFocusModal.Title asChild>
            <VisuallyHidden>
              {t("tieredPricing.create")}
            </VisuallyHidden>
          </RouteFocusModal.Title>
          <RouteFocusModal.Description asChild>
            <VisuallyHidden>
              {t("tieredPricing.create")}
            </VisuallyHidden>
          </RouteFocusModal.Description>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex size-full flex-col items-center overflow-auto py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div className="flex flex-col gap-y-2">
              <h2 className="text-ui-fg-base inter-large-semibold">
                {t("tieredPricing.create")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-y-2">
                  <Input
                    type="text"
                    placeholder={t("tieredPricing.fields.variant_id")}
                    {...form.register("variant_id", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Input
                    type="number"
                    placeholder={t("tieredPricing.fields.min_quantity")}
                    {...form.register("min_quantity", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Input
                    type="number"
                    placeholder={t("tieredPricing.fields.max_quantity")}
                    {...form.register("max_quantity")}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Input
                    type="text"
                    placeholder={t("tieredPricing.fields.amount")}
                    {...form.register("amount", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Input
                    type="text"
                    placeholder={t("tieredPricing.fields.currency_code")}
                    {...form.register("currency_code", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Select
                    {...form.register("status")}
                    defaultValue="active"
                  >
                    <Select.Trigger>
                      <Select.Value
                        placeholder={t("tieredPricing.fields.status")}
                      />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="active">
                        {t("tieredPricing.status.active")}
                      </Select.Item>
                      <Select.Item value="inactive">
                        {t("tieredPricing.status.inactive")}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              variant="primary"
              type="submit"
              isLoading={isPending}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
