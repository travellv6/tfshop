import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Select, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../components/modals"
import { KeyboundForm } from "../../../components/utilities/keybound-form"
import { VisuallyHidden } from "../../../components/utilities/visually-hidden"
import { useCreateFactory } from "../../../hooks/api/factories"

const CreateFactorySchema = zod.object({
  name: zod.string().min(1),
  slug: zod.string().min(1),
  description: zod.string().optional(),
  status: zod.enum(["active", "inactive", "suspended"]),
  location_province: zod.string().optional(),
  location_city: zod.string().optional(),
  location_address: zod.string().optional(),
  established_year: zod.string().optional(),
  employee_scale: zod.string().optional(),
  monthly_capacity: zod.string().optional(),
  main_categories: zod.string().optional(),
})

export const FactoryCreate = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { mutateAsync, isPending } = useCreateFactory()

  const form = useForm<zod.infer<typeof CreateFactorySchema>>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: "active",
      location_province: "",
      location_city: "",
      location_address: "",
      established_year: "",
      employee_scale: "",
      monthly_capacity: "",
      main_categories: "",
    },
    resolver: zodResolver(CreateFactorySchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        status: data.status,
        location_province: data.location_province || undefined,
        location_city: data.location_city || undefined,
        location_address: data.location_address || undefined,
        established_year: data.established_year
          ? Number(data.established_year)
          : undefined,
        employee_scale: data.employee_scale || undefined,
        monthly_capacity: data.monthly_capacity || undefined,
        main_categories: data.main_categories || undefined,
      },
      {
        onSuccess: ({ factory }) => {
          toast.success(t("factories.toast.created"))
          handleSuccess(`/factories/${factory.id}`)
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
            <VisuallyHidden>{t("factories.create")}</VisuallyHidden>
          </RouteFocusModal.Title>
          <RouteFocusModal.Description asChild>
            <VisuallyHidden>{t("factories.create")}</VisuallyHidden>
          </RouteFocusModal.Description>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex size-full flex-col items-center overflow-auto py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div className="flex flex-col gap-y-2">
              <h2 className="text-ui-fg-base inter-large-semibold">
                {t("factories.sections.general")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-2">
                  <Input
                    type="text"
                    placeholder={t("factories.fields.name")}
                    {...form.register("name", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Input
                    type="text"
                    placeholder={t("factories.fields.slug")}
                    {...form.register("slug", { required: true })}
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-y-2">
                  <Textarea
                    placeholder={t("factories.fields.description")}
                    {...form.register("description")}
                    rows={3}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Select
                    {...form.register("status")}
                    defaultValue="active"
                  >
                    <Select.Trigger>
                      <Select.Value
                        placeholder={t("factories.fields.status")}
                      />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="active">
                        {t("factories.status.active")}
                      </Select.Item>
                      <Select.Item value="inactive">
                        {t("factories.status.inactive")}
                      </Select.Item>
                      <Select.Item value="suspended">
                        {t("factories.status.suspended")}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <h2 className="text-ui-fg-base inter-large-semibold">
                {t("factories.sections.location")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-2">
                  <Input
                    type="text"
                    placeholder={t("factories.fields.location_province")}
                    {...form.register("location_province")}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Input
                    type="text"
                    placeholder={t("factories.fields.location_city")}
                    {...form.register("location_city")}
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-y-2">
                  <Input
                    type="text"
                    placeholder={t("factories.fields.location_address")}
                    {...form.register("location_address")}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <h2 className="text-ui-fg-base inter-large-semibold">
                {t("factories.fields.main_categories")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-2">
                  <Input
                    type="text"
                    placeholder={t("factories.fields.established_year")}
                    {...form.register("established_year")}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Input
                    type="text"
                    placeholder={t("factories.fields.employee_scale")}
                    {...form.register("employee_scale")}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Input
                    type="text"
                    placeholder={t("factories.fields.monthly_capacity")}
                    {...form.register("monthly_capacity")}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Input
                    type="text"
                    placeholder={t("factories.fields.main_categories")}
                    {...form.register("main_categories")}
                  />
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
