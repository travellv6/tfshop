import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TFShop",
  description: "TFShop",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
