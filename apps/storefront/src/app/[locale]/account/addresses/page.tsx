"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
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
  const { locale } = useParams()
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

  if (isLoading) {
    return <p className="text-center text-gray-500">{ct("loading")}</p>
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* 返回链接 */}
      <Link
        href={`/${locale}/account`}
        className="text-sm text-brand-600 hover:underline"
      >
        ← {at("title")}
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          {t("addNew")}
        </button>
      </div>

      {/* 地址表单 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t("firstName")}</label>
              <input
                type="text"
                required
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t("lastName")}</label>
              <input
                type="text"
                required
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("phone")}</label>
            <input
              type="tel"
              value={form.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("address1")}</label>
            <input
              type="text"
              required
              value={form.address_1}
              onChange={(e) => updateField("address_1", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("address2")}</label>
            <input
              type="text"
              value={form.address_2 || ""}
              onChange={(e) => updateField("address_2", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t("city")}</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t("province")}</label>
              <input
                type="text"
                value={form.province || ""}
                onChange={(e) => updateField("province", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t("postalCode")}</label>
              <input
                type="text"
                required
                value={form.postal_code}
                onChange={(e) => updateField("postal_code", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t("country")}</label>
              <input
                type="text"
                required
                value={form.country_code}
                onChange={(e) => updateField("country_code", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {(createMutation.isPending || updateMutation.isPending)
                ? ct("loading")
                : editingId
                  ? t("update")
                  : t("save")}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      )}

      {/* 地址列表 */}
      {addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((addr: Address) => (
            <div
              key={addr.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    {addr.first_name} {addr.last_name}
                    {addr.is_default_shipping && (
                      <span className="ml-2 rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-600">
                        {t("default")}
                      </span>
                    )}
                  </p>
                  {addr.phone && <p className="text-sm text-gray-500">{addr.phone}</p>}
                  <p className="text-sm text-gray-600">
                    {addr.address_1}
                    {addr.address_2 ? `, ${addr.address_2}` : ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.city}
                    {addr.province ? `, ${addr.province}` : ""}{" "}
                    {addr.postal_code}
                  </p>
                  <p className="text-sm text-gray-600">{addr.country_code}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(addr)}
                    className="text-sm text-brand-600 hover:underline"
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">{t("noAddresses")}</p>
      )}
    </div>
  )
}
