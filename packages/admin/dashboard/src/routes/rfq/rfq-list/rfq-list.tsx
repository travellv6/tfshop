import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { RFQListTable } from "./components/rfq-list-table"

export const RFQList = () => {
  const { getWidgets } = useExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("rfq.list.after" as any),
        before: getWidgets("rfq.list.before" as any),
      }}
      hasOutlet
    >
      <RFQListTable />
    </SingleColumnPage>
  )
}
