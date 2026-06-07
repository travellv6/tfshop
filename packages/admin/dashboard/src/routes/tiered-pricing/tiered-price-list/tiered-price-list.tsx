import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { TieredPriceListTable } from "./components/tiered-price-list-table"

export const TieredPriceList = () => {
  const { getWidgets } = useExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("tiered_pricing.list.after" as any),
        before: getWidgets("tiered_pricing.list.before" as any),
      }}
      hasOutlet
    >
      <TieredPriceListTable />
    </SingleColumnPage>
  )
}
