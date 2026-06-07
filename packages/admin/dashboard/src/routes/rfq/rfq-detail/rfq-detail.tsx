import { useLoaderData, useParams } from "react-router-dom"

import { useRFQ } from "../../../hooks/api/rfq"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { RFQGeneralSection } from "./components/rfq-general-section"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { rfqDetailLoader } from "./loader"

export const RFQDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof rfqDetailLoader>
  >

  const { id } = useParams()
  const {
    rfq,
    isLoading,
    isError,
    error,
  } = useRFQ(id!, undefined, { initialData })

  const { getWidgets } = useExtension()

  if (isLoading || !rfq) {
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
        after: getWidgets("rfq.details.after" as any),
        before: getWidgets("rfq.details.before" as any),
        sideAfter: getWidgets("rfq.details.side.after" as any),
        sideBefore: getWidgets("rfq.details.side.before" as any),
      }}
      hasOutlet
      data={rfq}
    >
      <TwoColumnPage.Main>
        <RFQGeneralSection rfq={rfq} />
      </TwoColumnPage.Main>
    </TwoColumnPage>
  )
}
