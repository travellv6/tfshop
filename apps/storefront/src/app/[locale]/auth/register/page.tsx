"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/routing"
import { ArrowRight, Building2, ShieldCheck, UserPlus } from "lucide-react"
import { useRegister } from "@/hooks/use-customer"

export default function RegisterPage() {
  const t = useTranslations("auth")
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
  })
  const [error, setError] = useState("")
  const { mutateAsync: register, isPending } = useRegister()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (form.password !== form.confirmPassword) {
      setError(t("passwordMismatch"))
      return
    }
    try {
      await register({
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
      })
      router.push("/account")
    } catch (err: any) {
      setError(err?.message || t("registrationFailed"))
    }
  }

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))
  const benefits = ["lowMoq", "verification", "protection"] as const

  return (
    <div className="bg-surface-50">
      <div className="mx-auto grid min-h-[720px] max-w-[1180px] px-4 py-8 sm:px-6 lg:grid-cols-[1fr_500px] lg:px-8">
        <section className="border-surface-200 hidden overflow-hidden rounded-l-lg border border-r-0 bg-white lg:block">
          <div className="relative h-full min-h-[600px]">
            <img
              src="/images/tfshop-hero-toy-catalog.jpg"
              alt={t("registerAlt")}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="via-white/82 absolute inset-0 bg-gradient-to-r from-white to-transparent" />
            <div className="relative flex h-full max-w-lg flex-col justify-between p-10">
              <div>
                <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                  {t("registerEyebrow")}
                </p>
                <h1 className="font-display text-ink-900 mt-4 text-5xl font-bold leading-tight">
                  {t("registerHeroTitle")}
                </h1>
                <p className="text-ink-600 mt-4 max-w-sm text-sm leading-6">
                  {t("registerHeroDesc")}
                </p>
              </div>
              <div className="text-ink-700 grid gap-3 text-sm font-semibold">
                {benefits.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="bg-brand-50 text-brand-700 flex h-8 w-8 items-center justify-center rounded-lg">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    {t(`registerBenefits.${item}`)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="panel flex items-center rounded-lg p-6 sm:p-8 lg:rounded-l-none lg:p-10">
          <div className="w-full">
            <div className="mb-8">
              <span className="bg-brand-50 text-brand-700 ring-brand-100 mb-5 flex h-12 w-12 items-center justify-center rounded-lg ring-1">
                <Building2 className="h-6 w-6" />
              </span>
              <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                {t("buyerOnboarding")}
              </p>
              <h2 className="font-display text-ink-900 mt-2 text-3xl font-bold">
                {t("registerTitle")}
              </h2>
              <p className="text-ink-500 mt-2 text-sm">{t("registerDesc")}</p>
            </div>

            {error && (
              <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="register-first-name"
                    className="text-ink-700 mb-1.5 block text-sm font-bold"
                  >
                    {t("firstName")}
                  </label>
                  <input
                    id="register-first-name"
                    required
                    value={form.first_name}
                    onChange={(e) => update("first_name", e.target.value)}
                    className="border-surface-300 text-ink-900 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="register-last-name"
                    className="text-ink-700 mb-1.5 block text-sm font-bold"
                  >
                    {t("lastName")}
                  </label>
                  <input
                    id="register-last-name"
                    required
                    value={form.last_name}
                    onChange={(e) => update("last_name", e.target.value)}
                    className="border-surface-300 text-ink-900 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="register-email"
                  className="text-ink-700 mb-1.5 block text-sm font-bold"
                >
                  {t("email")}
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="border-surface-300 text-ink-900 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
                  placeholder={t("emailPlaceholder")}
                />
              </div>
              <div>
                <label
                  htmlFor="register-password"
                  className="text-ink-700 mb-1.5 block text-sm font-bold"
                >
                  {t("password")}
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="border-surface-300 text-ink-900 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="text-ink-700 mb-1.5 block text-sm font-bold"
                >
                  {t("confirmPassword")}
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  className="border-surface-300 text-ink-900 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full"
              >
                <UserPlus className="h-4 w-4" />
                {isPending ? t("creatingAccount") : t("registerTitle")}
              </button>
            </form>

            <div className="bg-brand-50 text-ink-600 mt-6 rounded-lg p-4 text-sm">
              {t("alreadyHaveAccount")}{" "}
              <Link
                href="/auth/login"
                className="text-brand-700 inline-flex items-center gap-1 font-extrabold"
              >
                {t("loginTitle")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
