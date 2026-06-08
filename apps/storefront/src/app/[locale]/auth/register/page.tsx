"use client"

import { useState } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { ArrowRight, Building2, ShieldCheck, UserPlus } from "lucide-react"
import { useRegister } from "@/hooks/use-customer"

export default function RegisterPage() {
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
      setError("Passwords do not match")
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
      setError(err?.message || "Registration failed")
    }
  }

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="bg-surface-50">
      <div className="mx-auto grid min-h-[720px] max-w-[1180px] px-4 py-8 sm:px-6 lg:grid-cols-[1fr_500px] lg:px-8">
        <section className="border-surface-200 hidden overflow-hidden rounded-l-lg border border-r-0 bg-white lg:block">
          <div className="relative h-full min-h-[600px]">
            <img
              src="/images/tfshop-hero-toy-catalog.png"
              alt="TFShop toy sourcing workspace"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="via-white/82 absolute inset-0 bg-gradient-to-r from-white to-transparent" />
            <div className="relative flex h-full max-w-lg flex-col justify-between p-10">
              <div>
                <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                  Verified Buyer Program
                </p>
                <h1 className="font-display text-ink-900 mt-4 text-5xl font-bold leading-tight">
                  Build a sourcing desk for your toy business.
                </h1>
                <p className="text-ink-600 mt-4 max-w-sm text-sm leading-6">
                  Create an account to request samples, organize quotes, and
                  purchase from audited toy factories.
                </p>
              </div>
              <div className="text-ink-700 grid gap-3 text-sm font-semibold">
                {[
                  "Low MOQ from 50 pcs",
                  "Factory verification included",
                  "RFQ and order protection",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="bg-brand-50 text-brand-700 flex h-8 w-8 items-center justify-center rounded-lg">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    {item}
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
                Buyer Onboarding
              </p>
              <h2 className="font-display text-ink-900 mt-2 text-3xl font-bold">
                Register
              </h2>
              <p className="text-ink-500 mt-2 text-sm">
                Start with a buyer profile and unlock supplier quotes, samples,
                and factory-direct checkout.
              </p>
            </div>

            {error && (
              <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-ink-700 mb-1.5 block text-sm font-bold">
                    First Name
                  </label>
                  <input
                    required
                    value={form.first_name}
                    onChange={(e) => update("first_name", e.target.value)}
                    className="border-surface-300 text-ink-900 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
                  />
                </div>
                <div>
                  <label className="text-ink-700 mb-1.5 block text-sm font-bold">
                    Last Name
                  </label>
                  <input
                    required
                    value={form.last_name}
                    onChange={(e) => update("last_name", e.target.value)}
                    className="border-surface-300 text-ink-900 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label className="text-ink-700 mb-1.5 block text-sm font-bold">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="border-surface-300 text-ink-900 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
                  placeholder="buyer@company.com"
                />
              </div>
              <div>
                <label className="text-ink-700 mb-1.5 block text-sm font-bold">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="border-surface-300 text-ink-900 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
                />
              </div>
              <div>
                <label className="text-ink-700 mb-1.5 block text-sm font-bold">
                  Confirm Password
                </label>
                <input
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
                {isPending ? "Creating account..." : "Register"}
              </button>
            </form>

            <div className="bg-brand-50 text-ink-600 mt-6 rounded-lg p-4 text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-brand-700 inline-flex items-center gap-1 font-extrabold"
              >
                Login
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
