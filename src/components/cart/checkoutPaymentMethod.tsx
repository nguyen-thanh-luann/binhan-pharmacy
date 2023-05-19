import { useCreateOrder, usePayment } from '@/hooks'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { InputCheckbox } from '../inputs'
import { Image } from '../image'
import { Payment } from '@/types'
import { companyIconSm } from '@/assets'
import { useDispatch, useSelector } from 'react-redux'
import { selectOrderPayment, setOrderPayment } from '@/store'

interface CheckoutPaymentMethodProps {
  className?: string
  order_id: number
}

export const CheckoutPaymentMethod = ({ className, order_id }: CheckoutPaymentMethodProps) => {
  const { data: paymentList = [] } = usePayment()
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
      <p className="text-text-color capitalize font-bold text-xl leading-10 mb-12">
        Chọn phương thức thanh toán
      </p>

      <div>
        {paymentList?.map(
          (item) =>
            item.state === 'enabled' && (
              <li
                key={item.acquirer_id}
                onClick={() => handleAddPayment(item)}
                className={`flex items-center cursor-pointer mb-12 gap-8 last:mb-0`}
              >
                <InputCheckbox
                  type="radio"
                  isChecked={payment?.acquirer_id === item.acquirer_id}
                  onCheck={() => handleAddPayment(item)}
                  className="rounded-full"
                />

                <div className="">
                  <Image
                    src={item?.image_url || companyIconSm}
                    className="w-[24px] h-[24px] object-cover"
                  />
                </div>

                <p className="text-md font-bold text-text-color line-clamp-1">{item.name}</p>
              </li>
            )
        )}
      </div>
    </div>
  )
}
