"use client"

import Link from "next/link"
import { useLocale } from "next-intl"
import { useCustomer } from "@/hooks/use-customer"

export default function AccountPage() {
  const { data: customer, isLoading } = useCustomer()
  const locale = useLocale()

  if (isLoading) {
    return (
      <p className="py-20 text-center text-gray-500">Loading...</p>
    )
  }

  if (!customer) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">Account</h1>
        <p className="mb-6 text-gray-500">
          Please login to view your account
        </p>
        <Link
          href={`/${locale}/auth/login`}
          className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Account</h1>
      <div className="rounded-lg border p-6">
        <p className="text-lg font-medium">
          {customer.first_name} {customer.last_name}
        </p>
        <p className="text-sm text-gray-500">{customer.email}</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Link
          href={`/${locale}/account/orders`}
          className="rounded-lg border p-4 hover:bg-gray-50"
        >
          <h3 className="font-medium">My Orders</h3>
          <p className="text-sm text-gray-500">
            View order history and track shipments
          </p>
        </Link>
      </div>
    </div>
  )
}
