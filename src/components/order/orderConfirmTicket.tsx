import { OrderTicketProduct, Spinner } from '@/components'
import { formatMoneyVND } from '@/helper'
import { useOrderHistoryDetail } from '@/hooks'
import Link from 'next/link'

interface OrderConfirmTicketProps {
  sale_order_id: number
}

export const OrderConfirmTicket = ({ sale_order_id }: OrderConfirmTicketProps) => {
  const { data, isValidating } = useOrderHistoryDetail({
    sale_order_id: Number(sale_order_id) || 0,
  })
  return (
    <div>
      {isValidating ? (
        <div className="flex-center my-24">
          <Spinner />
        </div>
      ) : (
        <div className="bg-white border rounded-lg border-gray-100">
          <div className="flex items-center justify-between p-12 border-b border-gray-200">
            <p className="text-md text-text-color font-bold">{`Mã đơn hàng: ${data?.name}`}</p>

            <Link
              href={`/purchased-order/?sale_order_id=${sale_order_id}`}
              className="text-primary text-md font-semibold"
            >
              Xem đơn hàng
            </Link>
          </div>

          <div className="p-12">
            {data?.products?.map((product) => (
              <OrderTicketProduct data={product} key={product?.product_id} />
            ))}
          </div>

          <div className="p-12">
            <p className="text-end text-text-color font-bold text-md">
              Tổng tiền:{' '}
              <span className="text-primary">{formatMoneyVND(data?.amount_total || 0)}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
