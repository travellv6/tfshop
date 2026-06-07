"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import Link from "next/link"
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
  const locale = useLocale()

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
      router.push(`/${locale}/account`)
    } catch (err: any) {
      setError(err?.message || "Registration failed")
    }
  }

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Register</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">First Name</label>
            <input
              required
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Last Name</label>
            <input
              required
              value={form.last_name}
              onChange={(e) => update("last_name", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {isPending ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href={`/${locale}/auth/login`}
          className="text-brand-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  )
}
