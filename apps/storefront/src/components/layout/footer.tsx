import Link from "next/link"
import { Factory, Headphones, Mail, MapPin, ShieldCheck } from "lucide-react"

interface FooterProps {
  locale: string
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="border-surface-200 border-t bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-brand-100 bg-brand-50 mb-10 grid gap-4 rounded-lg border p-5 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-brand-700 h-5 w-5" />
            <div>
              <p className="text-ink-900 text-sm font-bold">Trade Assurance</p>
              <p className="text-ink-500 text-xs">
                Secure payments and QC support
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Factory className="text-brand-700 h-5 w-5" />
            <div>
              <p className="text-ink-900 text-sm font-bold">Factory Direct</p>
              <p className="text-ink-500 text-xs">Verified toy manufacturers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Headphones className="text-brand-700 h-5 w-5" />
            <div>
              <p className="text-ink-900 text-sm font-bold">Sourcing Support</p>
              <p className="text-ink-500 text-xs">
                RFQ response within 24 hours
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={`/${locale}`} className="inline-flex flex-col">
              <span className="text-brand-700 text-2xl font-extrabold leading-none tracking-tight">
                TFShop
              </span>
              <span className="text-brand-700 text-[11px] font-semibold">
                China Toy Factory Direct
              </span>
            </Link>
            <p className="font-body text-ink-400 mt-4 text-sm leading-relaxed">
              China Toy Factory Direct Supply Platform. Connecting global buyers
              with verified manufacturers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-ink-900 text-sm font-bold uppercase tracking-wider">
              Marketplace
            </h4>
            <nav className="mt-4 flex flex-col gap-2">
              <Link
                href={`/${locale}/products`}
                className="font-body text-ink-500 hover:text-brand-700 text-sm transition-colors"
              >
                Browse Products
              </Link>
              <Link
                href={`/${locale}/factories`}
                className="font-body text-ink-500 hover:text-brand-700 text-sm transition-colors"
              >
                Find Factories
              </Link>
              <Link
                href={`/${locale}/rfq`}
                className="font-body text-ink-500 hover:text-brand-700 text-sm transition-colors"
              >
                Request Quote
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-ink-900 text-sm font-bold uppercase tracking-wider">
              Account
            </h4>
            <nav className="mt-4 flex flex-col gap-2">
              <Link
                href={`/${locale}/auth/login`}
                className="font-body text-ink-500 hover:text-brand-700 text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                href={`/${locale}/auth/register`}
                className="font-body text-ink-500 hover:text-brand-700 text-sm transition-colors"
              >
                Register
              </Link>
              <Link
                href={`/${locale}/account`}
                className="font-body text-ink-500 hover:text-brand-700 text-sm transition-colors"
              >
                My Account
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-ink-900 text-sm font-bold uppercase tracking-wider">
              Contact
            </h4>
            <div className="mt-4 space-y-2">
              <p className="font-body text-ink-500 flex items-center gap-2 text-sm">
                <Mail className="text-brand-700 h-4 w-4" />{" "}
                support@toyfactory.cc
              </p>
              <p className="font-body text-ink-500 flex items-center gap-2 text-sm">
                <MapPin className="text-brand-700 h-4 w-4" /> Shantou,
                Guangdong, China
              </p>
              <p className="font-body text-ink-500 flex items-center gap-2 text-sm">
                <Headphones className="text-brand-700 h-4 w-4" /> Mon-Sat
                9:00-18:00 CST
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-surface-200 mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="font-body text-ink-500 text-xs">
            © {new Date().getFullYear()} TFShop. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="font-body text-ink-500 hover:text-brand-700 cursor-pointer text-xs transition-colors">
              Privacy Policy
            </span>
            <span className="font-body text-ink-500 hover:text-brand-700 cursor-pointer text-xs transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
