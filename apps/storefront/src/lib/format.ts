const storefrontDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

const storefrontDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
})

const storefrontNumberFormatter = new Intl.NumberFormat("en-US")

function parseDate(value?: string | null) {
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatStorefrontDate(value?: string | null) {
  const date = parseDate(value)
  return date ? storefrontDateFormatter.format(date) : "-"
}

export function formatStorefrontDateTime(value?: string | null) {
  const date = parseDate(value)
  return date ? storefrontDateTimeFormatter.format(date) : "-"
}

export function formatStorefrontNumber(value?: number | null) {
  return typeof value === "number"
    ? storefrontNumberFormatter.format(value)
    : "-"
}
