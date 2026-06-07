import { NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import { routing, type Locale } from "@/i18n/routing"
import { QueryProvider } from "@/providers/query-provider"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const RTL_LOCALES: Locale[] = ["ar"]

// 直接根据 locale 加载翻译文件，不依赖 getMessages() 的 requestLocale（SSG 期间不可靠）
async function loadMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default
  } catch {
    return (await import("../../messages/en.json")).default
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  const messages = await loadMessages(locale)
  const isRTL = RTL_LOCALES.includes(locale as Locale)

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body className="min-h-screen bg-white antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <CartProvider>
              <Header />
              <main className="mx-auto max-w-7xl px-4 py-8">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
