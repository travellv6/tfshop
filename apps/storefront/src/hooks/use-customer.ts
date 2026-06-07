import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk, PUBLISHABLE_KEY } from "@/lib/medusa"

export function useCustomer() {
  return useQuery({
    queryKey: ["customer"],
    queryFn: async () => {
      try {
        const { customer } = await sdk.store.customer.retrieve()
        return customer
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
      return sdk.auth.login("customer", "emailpass", { email, password })
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
      // Step 1: Register auth identity → get token
      const token = (await sdk.auth.register("customer", "emailpass", {
        email,
        password,
      })) as unknown as string

      // Step 2: Create customer record using the token
      const { customer } = await sdk.store.customer.create(
        { email, first_name, last_name },
        {},
        {
          Authorization: `Bearer ${token}`,
          ...(PUBLISHABLE_KEY && { "x-publishable-api-key": PUBLISHABLE_KEY }),
        }
      )

      // Step 3: Login to establish session
      await sdk.auth.login("customer", "emailpass", { email, password })

      return { auth: { token }, customer }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] })
    },
  })
}
