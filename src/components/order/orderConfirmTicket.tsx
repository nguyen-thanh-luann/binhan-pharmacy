import { Image, OrderTicketProduct, Spinner } from '@/components'
import { API_URL } from '@/constants'
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
        <div className="">
          {data?.payment_method?.payment_type === 'bank' && (
            <div className="bg-white border rounded-lg border-gray-100 p-12 mb-12">
              <p className="text-md text-text-color font-bold mb-12">{`Thông tin thanh toán`}</p>

              <div className="flex flex-col md:flex-row gap-24">
                <div className="flex justify-center">
                  <Image
                    src={
                      data?.payment_method?.payment_info?.qr_code
                        ? `${API_URL}${data?.payment_method?.payment_info?.qr_code}`
                        : ''
                    }
                    imageClassName="w-[150px] h-[150px] object-cover"
                    className="w-[150px]"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-md font-bold mb-12">
                    {data?.payment_method?.payment_info?.bank_name}
                  </p>

                  <p className="text-md font-bold mb-12">
                    {`Chủ tài khoản: ${data?.payment_method?.payment_info?.bank_account_holder}`}
                  </p>

                  <p className="text-md font-bold mb-12">
                    {`Số tài khoản: ${data?.payment_method?.payment_info?.bank_code}`}
                  </p>

                  <p className="text-md font-bold mb-12">
                    {`Chi nhánh: ${data?.payment_method?.payment_info?.bank_branch}`}
                  </p>
                </div>
              </div>
            </div>
          )}

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
        </div>
      )}
    </div>
  )
}
