import { useCreateOrder, usePayment } from '@/hooks'
import { selectOrderPayment, setOrderPayment } from '@/store'
import { Payment } from '@/types'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { twMerge } from 'tailwind-merge'
import { PaymentMethod, PaymentMethodLoading } from '../payment'

interface CheckoutPaymentMethodProps {
  className?: string
  order_id: number
}

export const CheckoutPaymentMethod = ({ className, order_id }: CheckoutPaymentMethodProps) => {
  const { data: paymentList = [], isValidating } = usePayment()
  const dispatch = useDispatch()
  const { updateOrderDraft } = useCreateOrder()
  const payment = useSelector(selectOrderPayment)

  const handleAddPayment = (props: Payment) => {
    if (props?.acquirer_id === payment?.acquirer_id) return
    updateOrderDraft({
      params: { acquirer_id: props.acquirer_id, order_id: [order_id] },
      handleSuccess: () => {
        dispatch(setOrderPayment(props))
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
                  isCheck={payment?.acquirer_id === item.acquirer_id}
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
