"use client"

interface CartItemRowProps {
  item: {
    id: string
    title: string
    thumbnail?: string | null
    quantity: number
    unit_price: number
    subtotal?: number
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  isUpdating: boolean
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}: CartItemRowProps) {
  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No img
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium">{item.title}</h3>
        <p className="text-xs text-gray-500">
          ${(item.unit_price / 100).toFixed(2)} / pc
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="h-7 w-7 rounded border text-sm"
        >
          −
        </button>
        <span className="w-8 text-center text-sm">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={isUpdating}
          className="h-7 w-7 rounded border text-sm"
        >
          +
        </button>
      </div>
      <p className="w-20 text-right text-sm font-medium">
        $
        {(
          (item.subtotal || item.unit_price * item.quantity) / 100
        ).toFixed(2)}
      </p>
      <button
        onClick={() => onRemove(item.id)}
        disabled={isUpdating}
        className="text-xs text-red-500 hover:underline"
      >
        Remove
      </button>
    </div>
  )
}
