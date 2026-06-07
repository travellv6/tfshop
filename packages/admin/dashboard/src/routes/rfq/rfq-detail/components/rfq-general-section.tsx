import { useState } from "react"
import {
  Badge,
  Button,
  Container,
  Heading,
  Input,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
  RFQDTO,
  useUpdateRFQ,
  useDeleteRFQ,
  useAddRFQMessage,
} from "../../../../hooks/api/rfq"

type RFQGeneralSectionProps = {
  rfq: RFQDTO
}

const statusColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "blue"
    case "reviewing":
      return "orange"
    case "quoted":
      return "purple"
    case "negotiating":
      return "orange"
    case "accepted":
      return "green"
    case "rejected":
      return "red"
    default:
      return "grey"
  }
}

export const RFQGeneralSection = ({ rfq }: RFQGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const updateRFQ = useUpdateRFQ(rfq.id)
  const { mutateAsync: deleteRFQ } = useDeleteRFQ()
  const addMessage = useAddRFQMessage()

  const [quotedPrice, setQuotedPrice] = useState(rfq.quoted_price || "")
  const [quotedLeadTime, setQuotedLeadTime] = useState(
    rfq.quoted_lead_time || ""
  )
  const [quotedTerms, setQuotedTerms] = useState(rfq.quoted_terms || "")
  const [replyContent, setReplyContent] = useState("")

  const handleStatusUpdate = async (status: string) => {
    await updateRFQ.mutateAsync(
      { status },
      {
        onSuccess: () => {
          toast.success(t("rfq.toast.updated"))
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  const handleQuoteSubmit = async () => {
    await updateRFQ.mutateAsync(
      {
        quoted_price: quotedPrice,
        quoted_lead_time: quotedLeadTime,
        quoted_terms: quotedTerms,
        status: "quoted",
      },
      {
        onSuccess: () => {
          toast.success(t("rfq.toast.quoteSubmitted"))
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  const handleDelete = async () => {
    await deleteRFQ(rfq.id, {
      onSuccess: () => {
        toast.success(t("rfq.toast.deleted"))
        navigate("/rfq", { replace: true })
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  const handleReply = async () => {
    if (!replyContent.trim()) return
    await addMessage.mutateAsync(
      {
        rfq_id: rfq.id,
        payload: { sender_type: "seller", content: replyContent },
      },
      {
        onSuccess: () => {
          setReplyContent("")
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* RFQ Info */}
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading>
            {rfq.product_title || t("rfq.title")}
          </Heading>
          <div className="flex items-center gap-x-4">
            <Badge
              size="2xsmall"
              rounded="full"
              color={statusColor(rfq.status)}
            >
              {t(`rfq.status.${rfq.status}`)}
            </Badge>
          </div>
        </div>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("rfq.fields.customer_email")}
          </Text>
          <Text size="small" leading="compact">
            {rfq.customer_email || "-"}
          </Text>
        </div>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("rfq.fields.product_title")}
          </Text>
          <Text size="small" leading="compact">
            {rfq.product_title || "-"}
          </Text>
        </div>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("rfq.fields.quantity")}
          </Text>
          <Text size="small" leading="compact">
            {rfq.quantity ?? "-"}
          </Text>
        </div>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("rfq.fields.target_price")}
          </Text>
          <Text size="small" leading="compact">
            {rfq.target_price || "-"}
          </Text>
        </div>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("rfq.fields.requirements")}
          </Text>
          <Text size="small" leading="compact">
            {rfq.requirements || "-"}
          </Text>
        </div>
      </Container>

      {/* Status Actions */}
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">{t("rfq.fields.status")}</Heading>
        </div>
        <div className="flex flex-wrap gap-2 px-6 py-4">
          {rfq.status !== "reviewing" && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => handleStatusUpdate("reviewing")}
            >
              {t("rfq.status.reviewing")}
            </Button>
          )}
          {rfq.status !== "negotiating" && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => handleStatusUpdate("negotiating")}
            >
              {t("rfq.status.negotiating")}
            </Button>
          )}
          <Button
            size="small"
            variant="transparent"
            onClick={() => handleStatusUpdate("accepted")}
          >
            {t("rfq.status.accepted")}
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={() => handleStatusUpdate("rejected")}
          >
            {t("rfq.status.rejected")}
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={handleDelete}
          >
            {t("actions.delete")}
          </Button>
        </div>
      </Container>

      {/* Quote Form */}
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">{t("rfq.submitQuote")}</Heading>
        </div>
        <div className="flex flex-col gap-y-4 px-6 py-4">
          <div>
            <Text size="small" weight="plus" className="mb-1">
              {t("rfq.fields.quoted_price")}
            </Text>
            <Input
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
              placeholder="e.g. $5.00/pc"
            />
          </div>
          <div>
            <Text size="small" weight="plus" className="mb-1">
              {t("rfq.fields.quoted_lead_time")}
            </Text>
            <Input
              value={quotedLeadTime}
              onChange={(e) => setQuotedLeadTime(e.target.value)}
              placeholder="e.g. 15 days"
            />
          </div>
          <div>
            <Text size="small" weight="plus" className="mb-1">
              {t("rfq.internalNote")}
            </Text>
            <Textarea
              value={quotedTerms}
              onChange={(e) => setQuotedTerms(e.target.value)}
              rows={3}
            />
          </div>
          <Button
            size="small"
            onClick={handleQuoteSubmit}
            isLoading={updateRFQ.isPending}
          >
            {t("rfq.submitQuote")}
          </Button>
        </div>
      </Container>

      {/* Messages */}
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">{t("rfq.messages")}</Heading>
        </div>
        <div className="max-h-96 space-y-3 overflow-y-auto px-6 py-4">
          {rfq.messages && rfq.messages.length > 0 ? (
            rfq.messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg p-3 ${
                  msg.sender_type === "buyer"
                    ? "bg-ui-bg-subtle"
                    : msg.sender_type === "seller"
                      ? "bg-ui-bg-base"
                      : "bg-ui-tag-yellow-bg"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <Text size="xsmall" weight="plus" className="text-ui-fg-subtle">
                    {msg.sender_type === "buyer"
                      ? t("rfq.fields.customer_email")
                      : msg.sender_type === "seller"
                        ? t("rfq.reply")
                        : "System"}
                  </Text>
                  <Text size="xsmall" className="text-ui-fg-muted">
                    {new Date(msg.created_at).toLocaleString()}
                  </Text>
                </div>
                <Text size="small">{msg.content}</Text>
              </div>
            ))
          ) : (
            <Text size="small" className="text-ui-fg-subtle">
              {t("rfq.messages")}
            </Text>
          )}
        </div>
        <div className="flex gap-3 px-6 py-4">
          <div className="flex-1">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={2}
              placeholder={t("rfq.reply")}
            />
          </div>
          <Button
            size="small"
            onClick={handleReply}
            disabled={!replyContent.trim()}
            isLoading={addMessage.isPending}
          >
            {t("rfq.reply")}
          </Button>
        </div>
      </Container>
    </div>
  )
}
