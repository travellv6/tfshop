export interface StorefrontProduct {
  id: string
  handle: string
  title: string
  thumbnail?: string | null
  description?: string | null
  metadata?: Record<string, any> | null
  variants?: any[] | null
  images?: { url: string }[] | null
}

export interface StorefrontFactory {
  id: string
  name: string
  slug: string
  description?: string | null
  cover_image?: string | null
  location_province?: string | null
  location_city?: string | null
  established_year?: number | null
  employee_scale?: string | null
  monthly_capacity?: string | null
  main_categories?: string | null
  certifications?: string[] | null
  photos?: string[] | null
  status?: string
}

export const heroImage = "/images/tfshop-hero-toy-catalog.jpg"
export const fallbackProductImage = "/images/products/building-blocks.jpg"

export const categories = [
  { label: "Building Blocks", count: "1,320", icon: "blocks" },
  { label: "Action Figures & Playsets", count: "2,450", icon: "bot" },
  { label: "Dolls & Accessories", count: "980", icon: "sparkles" },
  { label: "RC Toys & Vehicles", count: "540", icon: "truck" },
  { label: "Educational Toys", count: "1,120", icon: "book" },
  { label: "Outdoor & Sports", count: "760", icon: "trophy" },
  { label: "Baby & Preschool", count: "680", icon: "baby" },
  { label: "Arts & Crafts", count: "890", icon: "palette" },
]

export const trustFeatures = [
  { title: "Factory Direct", desc: "Best prices guaranteed", icon: "tag" },
  { title: "Verified Factories", desc: "Audited & certified", icon: "shield" },
  { title: "Quality Assurance", desc: "Strict QC process", icon: "award" },
  { title: "On-time Delivery", desc: "Reliable & trackable", icon: "truck" },
  { title: "Secure Payments", desc: "Multiple safe options", icon: "lock" },
  { title: "24/7 Support", desc: "Sourcing experts", icon: "headphones" },
]

export const marketplaceStats = [
  { value: "2,000+", label: "Verified Factories" },
  { value: "100,000+", label: "Products" },
  { value: "50+", label: "Countries Served" },
  { value: "98%", label: "On-time Delivery Rate" },
]

export const demoProducts: StorefrontProduct[] = [
  {
    id: "demo-marble-run",
    handle: "marble-run-building-blocks",
    title: "Marble Run Building Blocks",
    thumbnail: fallbackProductImage,
    description:
      "Colorful STEM marble-run block set with low MOQ and export-ready packaging.",
    metadata: {
      min_order_qty: 50,
      price_range: "$2.35 - $2.85",
      certifications: ["EN71", "CPC"],
      factory_name: "Shantou Chenghai Yaxing Toys Factory",
      factory_slug: "shantou-chenghai-yaxing",
      origin: "Guangdong, China",
      rating: "4.9",
      response_time: "< 2h",
      is_in_stock: true,
      sample_available: true,
      material: "ABS Plastic",
      size: "18cm",
    },
  },
  {
    id: "demo-robot",
    handle: "transforming-robot-car-toy",
    title: "Transforming Robot Car Toy",
    thumbnail: fallbackProductImage,
    description:
      "Action figure and vehicle playset for wholesale buyers and gifting channels.",
    metadata: {
      min_order_qty: 500,
      price_range: "$1.45 - $1.85",
      certifications: ["EN71", "CPC"],
      factory_name: "Shantou Chenghai Yaxing Toys Factory",
      factory_slug: "shantou-chenghai-yaxing",
      origin: "Guangdong, China",
      rating: "4.9",
      response_time: "< 2h",
      is_in_stock: true,
      sample_available: true,
      material: "ABS Plastic",
      size: "12cm",
    },
  },
  {
    id: "demo-teddy",
    handle: "soft-plush-teddy-bear",
    title: "Soft Plush Teddy Bear",
    thumbnail: fallbackProductImage,
    description:
      "Soft plush toy with gift-ready finishing, ideal for seasonal retail programs.",
    metadata: {
      min_order_qty: 300,
      price_range: "$1.75 - $2.35",
      certifications: ["EN71", "CPC"],
      factory_name: "Yangzhou Home Ka Crafts Ltd.",
      factory_slug: "yangzhou-home-ka-crafts",
      origin: "Jiangsu, China",
      rating: "4.7",
      response_time: "< 6h",
      is_in_stock: true,
      sample_available: true,
      material: "Polyester",
      size: "25cm",
    },
  },
  {
    id: "demo-rc-car",
    handle: "remote-control-off-road-car",
    title: "2.4G Remote Control Car",
    thumbnail: fallbackProductImage,
    description:
      "Durable RC off-road vehicle with export battery options and fast sample support.",
    metadata: {
      min_order_qty: 200,
      price_range: "$6.80 - $8.90",
      certifications: ["EN71", "CE"],
      factory_name: "Shantou Aib Trading Co., Ltd.",
      factory_slug: "shantou-aib-trading",
      origin: "Guangdong, China",
      rating: "4.9",
      response_time: "< 1h",
      is_in_stock: true,
      sample_available: true,
      material: "ABS Plastic",
      size: "1:16 Scale",
    },
  },
]

export const demoFactories: StorefrontFactory[] = [
  {
    id: "demo-factory-yaxing",
    name: "Shantou Chenghai Yaxing Toys Factory",
    slug: "shantou-chenghai-yaxing",
    description:
      "Verified toy manufacturer focused on blocks, action figures, and educational toys.",
    cover_image: heroImage,
    location_city: "Shantou",
    location_province: "Guangdong",
    established_year: 2016,
    employee_scale: "100-300",
    monthly_capacity: "280,000 pcs",
    certifications: ["EN71", "CPC", "ASTM"],
    status: "verified",
  },
  {
    id: "demo-factory-qunxing",
    name: "Qunxing Toys (Shantou) Co., Ltd.",
    slug: "qunxing-toys-shantou",
    description:
      "Factory-direct supplier for building-block sets, licensed-style playsets, and OEM/ODM lines.",
    cover_image: heroImage,
    location_city: "Shantou",
    location_province: "Guangdong",
    established_year: 2010,
    employee_scale: "300-500",
    monthly_capacity: "500,000 pcs",
    certifications: ["EN71", "CPC", "FSC"],
    status: "verified",
  },
  {
    id: "demo-factory-homeka",
    name: "Yangzhou Home Ka Crafts Ltd.",
    slug: "yangzhou-home-ka-crafts",
    description:
      "Plush and soft-toy factory with export packaging, sample support, and QC documentation.",
    cover_image: heroImage,
    location_city: "Yangzhou",
    location_province: "Jiangsu",
    established_year: 2018,
    employee_scale: "50-100",
    monthly_capacity: "120,000 pcs",
    certifications: ["EN71", "ASTM", "CE"],
    status: "verified",
  },
]

export const rfqBasketProducts = demoProducts.slice(0, 4).map((product, i) => ({
  ...product,
  quantity: [500, 300, 300, 1050][i],
}))

export function productMeta(product?: StorefrontProduct | null) {
  return (product?.metadata || {}) as Record<string, any>
}

export function productImage(product?: StorefrontProduct | null) {
  return product?.thumbnail || product?.images?.[0]?.url || fallbackProductImage
}

export function productPrice(product?: StorefrontProduct | null) {
  const meta = productMeta(product)
  const firstPrice = (product?.variants?.[0] as any)?.prices?.[0]

  if (firstPrice?.amount) {
    return `$${(firstPrice.amount / 100).toFixed(2)}`
  }

  return meta.price_range || "$1.45 - $8.90"
}

export function productMoq(product?: StorefrontProduct | null) {
  return productMeta(product).min_order_qty || 50
}

export function productCertifications(product?: StorefrontProduct | null) {
  const certs = productMeta(product).certifications
  return Array.isArray(certs) && certs.length ? certs : ["EN71", "CPC"]
}

export function productFactoryName(product?: StorefrontProduct | null) {
  return productMeta(product).factory_name || "Verified Toy Factory"
}

export function productOrigin(product?: StorefrontProduct | null) {
  return productMeta(product).origin || "Guangdong, China"
}

export function responseTime(product?: StorefrontProduct | null) {
  return productMeta(product).response_time || "< 3h"
}

export function statusClass(status?: string) {
  switch (status) {
    case "submitted":
      return "bg-brand-50 text-brand-700 ring-brand-100"
    case "reviewing":
      return "bg-amber-50 text-amber-700 ring-amber-100"
    case "quoted":
      return "bg-coral-50 text-coral-700 ring-coral-100"
    case "negotiating":
      return "bg-orange-50 text-orange-700 ring-orange-100"
    case "accepted":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100"
    case "rejected":
      return "bg-red-50 text-red-700 ring-red-100"
    default:
      return "bg-slate-50 text-slate-700 ring-slate-100"
  }
}

export function demoRfqs() {
  return [
    {
      id: "demo-rfq-1001",
      product_title: "Transforming Robot Car Toy",
      status: "submitted",
      quantity: 500,
      quoted_price: "$1.45 - $1.85",
      created_at: "2026-01-08T08:00:00.000Z",
    },
    {
      id: "demo-rfq-1002",
      product_title: "City Castle Building Blocks Set",
      status: "quoted",
      quantity: 300,
      quoted_price: "$2.45",
      created_at: "2026-01-07T08:00:00.000Z",
    },
  ]
}
