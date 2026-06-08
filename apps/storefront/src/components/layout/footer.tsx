import Link from "next/link"

interface FooterProps {
  locale: string
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="border-t border-surface-200 bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-base text-white">
                🧸
              </span>
              <span className="font-display text-lg font-bold text-white">
                TFShop
              </span>
            </Link>
            <p className="mt-4 font-body text-sm leading-relaxed text-ink-400">
              China Toy Factory Direct Supply Platform.
              Connecting global buyers with verified manufacturers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink-300">
              Marketplace
            </h4>
            <nav className="mt-4 flex flex-col gap-2">
              <Link
                href={`/${locale}/products`}
                className="font-body text-sm text-ink-400 transition-colors hover:text-white"
              >
                Browse Products
              </Link>
              <Link
                href={`/${locale}/factories`}
                className="font-body text-sm text-ink-400 transition-colors hover:text-white"
              >
                Find Factories
              </Link>
              <Link
                href={`/${locale}/rfq`}
                className="font-body text-sm text-ink-400 transition-colors hover:text-white"
              >
                Request Quote
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink-300">
              Account
            </h4>
            <nav className="mt-4 flex flex-col gap-2">
              <Link
                href={`/${locale}/auth/login`}
                className="font-body text-sm text-ink-400 transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                href={`/${locale}/auth/register`}
                className="font-body text-sm text-ink-400 transition-colors hover:text-white"
              >
                Register
              </Link>
              <Link
                href={`/${locale}/account`}
                className="font-body text-sm text-ink-400 transition-colors hover:text-white"
              >
                My Account
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink-300">
              Contact
            </h4>
            <div className="mt-4 space-y-2">
              <p className="font-body text-sm text-ink-400">
                📧 support@toyfactory.cc
              </p>
              <p className="font-body text-sm text-ink-400">
                🌍 Shantou, Guangdong, China
              </p>
              <p className="font-body text-sm text-ink-400">
                🕐 Mon-Sat 9:00-18:00 CST
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-800 pt-6 sm:flex-row">
          <p className="font-body text-xs text-ink-500">
            © {new Date().getFullYear()} TFShop. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="font-body text-xs text-ink-500 hover:text-ink-300 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="font-body text-xs text-ink-500 hover:text-ink-300 cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
