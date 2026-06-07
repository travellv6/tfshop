import { useLoaderData, useParams } from "react-router-dom"

import { useFactory } from "../../../hooks/api/factories"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { FactoryGeneralSection } from "./components/factory-general-section"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { factoryDetailLoader } from "./loader"

export const FactoryDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof factoryDetailLoader>
  >

  const { id } = useParams()
  const {
    factory,
    isLoading,
    isError,
    error,
  } = useFactory(id!, undefined, { initialData })

  const { getWidgets } = useExtension()

  if (isLoading || !factory) {
    return (
      <TwoColumnPageSkeleton
        mainSections={1}
        sidebarSections={1}
      />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <TwoColumnPage
      widgets={{
        after: getWidgets("factory.details.after"),
        before: getWidgets("factory.details.before"),
        sideAfter: getWidgets("factory.details.side.after"),
        sideBefore: getWidgets("factory.details.side.before"),
      }}
      hasOutlet
      data={factory}
    >
      <TwoColumnPage.Main>
        <FactoryGeneralSection factory={factory} />
      </TwoColumnPage.Main>
    </TwoColumnPage>
  )
}
