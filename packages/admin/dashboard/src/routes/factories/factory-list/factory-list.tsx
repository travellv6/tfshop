import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { FactoryListTable } from "./components/factory-list-table"

export const FactoryList = () => {
  const { getWidgets } = useExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("factory.list.after" as any),
        before: getWidgets("factory.list.before" as any),
      }}
      hasOutlet
    >
      <FactoryListTable />
    </SingleColumnPage>
  )
}
