import { SWR_KEY } from '@/constants'
import { useCreateOrder, usePayment } from '@/hooks'
import { ConfirmPaymentMethodResponse, GetOrderDraftRes, Payment } from '@/types'
import classNames from 'classnames'
import useSWR, { useSWRConfig } from 'swr'
import { twMerge } from 'tailwind-merge'
import { PaymentMethod, PaymentMethodLoading } from '../payment'

interface CheckoutPaymentMethodProps {
  className?: string
  order_id: number
}

export const CheckoutPaymentMethod = ({ className, order_id }: CheckoutPaymentMethodProps) => {
  const { data: paymentList = [], isValidating } = usePayment()

  const { mutate: mutateRemote } = useSWRConfig()
  const checkoutPaymentMethod = useSWR(SWR_KEY.checkout_paymet_method)?.data
  const { data: orders } = useSWR<GetOrderDraftRes>(SWR_KEY.orders)

  const { updateOrderDraft } = useCreateOrder()

  const handleAddPayment = (props: Payment) => {
    if (props?.acquirer_id === checkoutPaymentMethod?.acquirer_id) return
    updateOrderDraft({
      params: { acquirer_id: props.acquirer_id, order_id: [order_id] },
      handleSuccess: (res: ConfirmPaymentMethodResponse[]) => {
        mutateRemote(SWR_KEY.checkout_paymet_method, props)

        if (res?.[0]?.amount_total) {
          mutateRemote(SWR_KEY.orders, { ...orders, amount_total: res?.[0]?.amount_total }, false)
        }
      },
    })
  }

  return (
    <div className={twMerge(classNames(`bg-white shadow-shadow-1 rounded-lg p-12`, className))}>
      <p className="text-text-color font-bold text-xl leading-10 mb-12">
        Chọn phương thức thanh toán
      </p>

      <div>
        {isValidating ? (
          <div className="flex flex-col">
            {Array?.from({ length: 4 })?.map((_, index) => (
              <PaymentMethodLoading key={index} />
            ))}
          </div>
        ) : (
          paymentList?.map(
            (item) =>
              item.state === 'enabled' && (
                <PaymentMethod
                  key={item?.acquirer_id}
                  data={item}
                  isCheck={checkoutPaymentMethod?.acquirer_id === item.acquirer_id}
                  hanldeCheck={() => handleAddPayment(item)}
                  className="mb-12 last:mb-0"
                />
              )
          )
        )}
      </div>
    </div>
  )
}
