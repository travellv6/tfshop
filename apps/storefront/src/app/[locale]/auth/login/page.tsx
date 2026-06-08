"use client"

import { useState } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from "lucide-react"
import { useLogin } from "@/hooks/use-customer"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { mutateAsync: login, isPending } = useLogin()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await login({ email, password })
      router.push("/account")
    } catch {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="bg-surface-50">
      <div className="mx-auto grid min-h-[680px] max-w-[1180px] px-4 py-8 sm:px-6 lg:grid-cols-[1fr_460px] lg:px-8">
        <section className="border-surface-200 hidden overflow-hidden rounded-l-lg border border-r-0 bg-white lg:block">
          <div className="relative h-full min-h-[560px]">
            <img
              src="/images/tfshop-hero-toy-catalog.png"
              alt="TFShop verified toy catalog"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="via-white/78 absolute inset-0 bg-gradient-to-r from-white to-transparent" />
            <div className="relative flex h-full max-w-lg flex-col justify-between p-10">
              <div>
                <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                  Buyer Workspace
                </p>
                <h1 className="font-display text-ink-900 mt-4 text-5xl font-bold leading-tight">
                  Source toys directly from verified factories.
                </h1>
                <p className="text-ink-600 mt-4 max-w-sm text-sm leading-6">
                  Continue RFQs, monitor orders, and keep supplier quotes in one
                  secure buying account.
                </p>
              </div>
              <div className="text-ink-700 grid gap-3 text-sm font-semibold">
                {[
                  "Factory-direct pricing",
                  "Secure RFQ history",
                  "Global delivery support",
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
                <UserRound className="h-6 w-6" />
              </span>
              <p className="text-brand-700 text-xs font-bold uppercase tracking-wide">
                Welcome Back
              </p>
              <h2 className="font-display text-ink-900 mt-2 text-3xl font-bold">
                Login
              </h2>
              <p className="text-ink-500 mt-2 text-sm">
                Access your RFQ center, orders, saved suppliers, and buyer
                protection tools.
              </p>
            </div>

            {error && (
              <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="text-ink-700 mb-1.5 block text-sm font-bold"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-surface-300 text-ink-900 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
                  placeholder="buyer@company.com"
                />
              </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="text-ink-700 mb-1.5 block text-sm font-bold"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-surface-300 text-ink-900 focus:border-brand-500 focus:ring-brand-100 w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full"
              >
                <LockKeyhole className="h-4 w-4" />
                {isPending ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="bg-brand-50 text-ink-600 mt-6 rounded-lg p-4 text-sm">
              New to TFShop?{" "}
              <Link
                href="/auth/register"
                className="text-brand-700 inline-flex items-center gap-1 font-extrabold"
              >
                Create a buyer account
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
