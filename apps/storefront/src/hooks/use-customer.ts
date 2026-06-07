import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"

type FetchResult = Record<string, any>

export function useCustomer() {
  return useQuery({
    queryKey: ["customer"],
    queryFn: async () => {
      try {
        const result = await sdk.client.fetch<FetchResult>(
          "/store/customers/me"
        )
        return result.customer || result
      } catch {
        return null
      }
    },
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      return sdk.client.fetch<FetchResult>("/auth/customer/emailpass", {
        method: "POST",
        body: { email, password },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      email,
      password,
      first_name,
      last_name,
    }: {
      email: string
      password: string
      first_name: string
      last_name: string
    }) => {
      // Step 1: Register auth identity
      const authResult = await sdk.client.fetch<FetchResult>(
        "/auth/customer/emailpass/register",
        {
          method: "POST",
          body: { email, password },
        }
      )
      // Step 2: Create customer record (uses JWT from registration)
      const customerResult = await sdk.client.fetch<FetchResult>(
        "/store/customers",
        {
          method: "POST",
          body: { email, first_name, last_name },
        }
      )
      return {
        auth: authResult,
        customer: customerResult.customer || customerResult,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] })
    },
  })
}
