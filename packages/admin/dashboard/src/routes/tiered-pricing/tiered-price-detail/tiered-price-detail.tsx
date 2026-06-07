import { useLoaderData, useParams } from "react-router-dom"

import { TwoColumnPage } from "../../../components/layout/pages"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { useTieredPrice } from "../../../hooks/api/tiered-pricing"
import { useExtension } from "../../../providers/extension-provider"
import { TieredPriceGeneralSection } from "./components/tiered-price-general-section"
import { tieredPriceDetailLoader } from "./loader"

export const TieredPriceDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof tieredPriceDetailLoader>
  >

  const { id } = useParams()
  const {
    tiered_price: tieredPrice,
    isLoading,
    isError,
    error,
  } = useTieredPrice(id!, undefined, { initialData })

  const { getWidgets } = useExtension()

  if (isLoading || !tieredPrice) {
    return (
      <TwoColumnPageSkeleton
        mainSections={1}
        sidebarSections={0}
      />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <TwoColumnPage
      widgets={{
        after: getWidgets("tiered_pricing.details.after" as any),
        before: getWidgets("tiered_pricing.details.before" as any),
        sideAfter: getWidgets("tiered_pricing.details.side.after" as any),
        sideBefore: getWidgets("tiered_pricing.details.side.before" as any),
      }}
      hasOutlet
      data={tieredPrice}
    >
      <TwoColumnPage.Main>
        <TieredPriceGeneralSection tieredPrice={tieredPrice} />
      </TwoColumnPage.Main>
    </TwoColumnPage>
  )
}
