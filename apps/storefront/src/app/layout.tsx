import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TFShop — China Toy Factory Direct",
  description:
    "Direct from Chinese toy factories. Low MOQ, factory prices, global shipping.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
