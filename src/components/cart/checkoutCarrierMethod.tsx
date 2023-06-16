import { useDelivery } from '@/hooks'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { Delivery, OrderLineDelivery } from '@/types'
import { useDispatch, useSelector } from 'react-redux'
import { selectOrderLineDelivery, setOrderLineDelivery } from '@/store'
import { DeliveryMethod, DeliveryMethodLoading } from '../delivery'

interface CheckoutCarrierMethodProps {
  className?: string
  order_id: number
  company_id: number
}

export const CheckoutCarrierMethod = ({
  className,
  order_id,
  company_id,
}: CheckoutCarrierMethodProps) => {
  const dispatch = useDispatch()
  const orderLineDelivery: OrderLineDelivery = useSelector(selectOrderLineDelivery)

  const { confirmDelivery, data, isValidating } = useDelivery({ order_id })

  const handleAddDelivery = (deliveryProps: Delivery) => {
    if (orderLineDelivery?.carrier_id === deliveryProps?.carrier_id) return

    confirmDelivery({
      delivery: {
        carrier_id: deliveryProps.carrier_id,
      },
      handleSuccess: () => {
        dispatch(setOrderLineDelivery({ company_id, ...deliveryProps }))
      },
    })
  }

  return (
    <div className={twMerge(classNames(`bg-white shadow-shadow-1 rounded-lg p-12`, className))}>
      <p className="text-text-color font-bold text-xl leading-10 mb-12">
        Chọn phương thức vận chuyển
      </p>

      <div>
        {isValidating ? (
          <div className="flex flex-col">
            {Array?.from({ length: 4 })?.map((_, index) => (
              <DeliveryMethodLoading key={index} />
            ))}
          </div>
        ) : (
          data?.map((item) => (
            <DeliveryMethod
              disabled={!item.shipping_active}
              key={item.carrier_id}
              addDelivery={handleAddDelivery}
              delivery={item}
              isActive={orderLineDelivery?.carrier_id === item.carrier_id}
            />
          ))
        )}
      </div>
    </div>
  )
}
