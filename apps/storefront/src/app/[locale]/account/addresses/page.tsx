"use client"

import { useState } from "react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  MapPin,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react"
import { EmptyState, StatusPill } from "@/components/ui/storefront"
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
  type Address,
  type AddressInput,
} from "@/hooks/use-addresses"

const EMPTY_FORM: AddressInput = {
  first_name: "",
  last_name: "",
  phone: "",
  address_1: "",
  address_2: "",
  city: "",
  province: "",
  postal_code: "",
  country_code: "CN",
}

export default function AddressesPage() {
  const t = useTranslations("address")
  const ct = useTranslations("common")
  const at = useTranslations("account")
  const { data: addresses = [], isLoading } = useAddresses()
  const createMutation = useCreateAddress()
  const updateMutation = useUpdateAddress()
  const deleteMutation = useDeleteAddress()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<AddressInput>(EMPTY_FORM)

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (addr: Address) => {
    setEditingId(addr.id)
    setForm({
      first_name: addr.first_name,
      last_name: addr.last_name,
      phone: addr.phone || "",
      company: addr.company || "",
      address_1: addr.address_1,
      address_2: addr.address_2 || "",
      city: addr.city,
      province: addr.province || "",
      postal_code: addr.postal_code,
      country_code: addr.country_code,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm(t("confirmDelete"))) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const updateField = (field: keyof AddressInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="bg-surface-50">
      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/account"
          className="text-brand-700 mb-5 inline-flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          {at("title")}
        </Link>

        <section className="panel mb-6 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                {t("eyebrow")}
              </p>
              <h1 className="font-display text-ink-900 mt-2 text-3xl font-bold">
                {t("title")}
              </h1>
              <p className="text-ink-500 mt-2 max-w-2xl text-sm">
                {t("description")}
              </p>
            </div>
            <button onClick={openCreate} className="btn-coral">
              <Plus className="h-4 w-4" />
              {t("addNew")}
            </button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
          <main className="space-y-5">
            {showForm && (
              <form onSubmit={handleSubmit} className="panel p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-ink-900 text-lg font-extrabold">
                      {editingId ? t("update") : t("addNew")}
                    </h2>
                    <p className="text-ink-500 mt-1 text-sm">{t("formDesc")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-ink-400 hover:bg-surface-100 hover:text-ink-700 flex h-9 w-9 items-center justify-center rounded-lg transition"
                    aria-label={t("cancel")}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label={t("firstName")}
                    value={form.first_name}
                    onChange={(value) => updateField("first_name", value)}
                    required
                  />
                  <Field
                    label={t("lastName")}
                    value={form.last_name}
                    onChange={(value) => updateField("last_name", value)}
                    required
                  />
                  <Field
                    label={t("phone")}
                    value={form.phone || ""}
                    onChange={(value) => updateField("phone", value)}
                    type="tel"
                  />
                  <Field
                    label={t("country")}
                    value={form.country_code}
                    onChange={(value) => updateField("country_code", value)}
                    required
                  />
                  <Field
                    label={t("address1")}
                    value={form.address_1}
                    onChange={(value) => updateField("address_1", value)}
                    className="sm:col-span-2"
                    required
                  />
                  <Field
                    label={t("address2")}
                    value={form.address_2 || ""}
                    onChange={(value) => updateField("address_2", value)}
                    className="sm:col-span-2"
                  />
                  <Field
                    label={t("city")}
                    value={form.city}
                    onChange={(value) => updateField("city", value)}
                    required
                  />
                  <Field
                    label={t("province")}
                    value={form.province || ""}
                    onChange={(value) => updateField("province", value)}
                  />
                  <Field
                    label={t("postalCode")}
                    value={form.postal_code}
                    onChange={(value) => updateField("postal_code", value)}
                    required
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting
                      ? ct("loading")
                      : editingId
                      ? t("update")
                      : t("save")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-outline"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </form>
            )}

            {isLoading ? (
              <div className="panel text-ink-500 p-10 text-center">
                {ct("loading")}
              </div>
            ) : addresses.length > 0 ? (
              <div className="grid gap-4">
                {addresses.map((addr: Address) => (
                  <article key={addr.id} className="panel p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <span className="bg-brand-50 text-brand-700 ring-brand-100 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1">
                          <MapPin className="h-5 w-5" />
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-ink-900 font-extrabold">
                              {addr.first_name} {addr.last_name}
                            </h2>
                            {addr.is_default_shipping && (
                              <StatusPill className="bg-brand-50 text-brand-700 ring-brand-100">
                                {t("default")}
                              </StatusPill>
                            )}
                          </div>
                          {addr.phone && (
                            <p className="text-ink-500 mt-2 text-sm font-medium">
                              {addr.phone}
                            </p>
                          )}
                          <p className="text-ink-600 mt-2 text-sm leading-6">
                            {addr.address_1}
                            {addr.address_2 ? `, ${addr.address_2}` : ""}
                            <br />
                            {addr.city}
                            {addr.province ? `, ${addr.province}` : ""}{" "}
                            {addr.postal_code}
                            <br />
                            {addr.country_code}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 sm:justify-end">
                        <button
                          onClick={() => openEdit(addr)}
                          className="border-surface-200 text-ink-500 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 flex h-9 w-9 items-center justify-center rounded-lg border transition"
                          aria-label={t("edit")}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(addr.id)}
                          disabled={deleteMutation.isPending}
                          className="border-surface-200 text-ink-400 flex h-9 w-9 items-center justify-center rounded-lg border transition hover:border-red-100 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          aria-label={t("delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title={t("noAddresses")}
                description={t("noAddressesDesc")}
                action={
                  <button onClick={openCreate} className="btn-primary">
                    <Plus className="h-4 w-4" />
                    {t("addNew")}
                  </button>
                }
              />
            )}
          </main>

          <aside className="space-y-5">
            <div className="panel p-5">
              <ShieldCheck className="text-brand-700 mb-3 h-7 w-7" />
              <h2 className="text-ink-900 text-sm font-extrabold">
                {t("assuranceTitle")}
              </h2>
              <p className="text-ink-500 mt-2 text-sm leading-6">
                {t("assuranceDesc")}
              </p>
            </div>
            <div className="panel overflow-hidden">
              <div className="border-surface-200 bg-brand-50 border-b px-5 py-4">
                <p className="text-brand-800 text-sm font-extrabold">
                  {t("coverageTitle")}
                </p>
              </div>
              <div className="divide-surface-200 grid grid-cols-2 divide-x">
                <div className="p-5">
                  <p className="text-ink-900 text-3xl font-black">
                    {addresses.length}
                  </p>
                  <p className="text-ink-400 mt-1 text-xs font-bold uppercase tracking-wide">
                    {t("saved")}
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-ink-900 text-3xl font-black">
                    {
                      addresses.filter(
                        (addr: Address) => addr.is_default_shipping
                      ).length
                    }
                  </p>
                  <p className="text-ink-400 mt-1 text-xs font-bold uppercase tracking-wide">
                    {t("default")}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  className = "",
  type = "text",
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
  type?: string
  required?: boolean
}) {
  return (
    <div className={className}>
      <label className="text-ink-700 mb-1.5 block text-sm font-bold">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-surface-300 text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
      />
    </div>
  )
}
