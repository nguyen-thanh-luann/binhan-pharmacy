import { SWR_KEY } from '@/constants'
import { useDelivery } from '@/hooks'
import { ConfirmDeliveryCarrierResponse, Delivery, GetOrderDraftRes } from '@/types'
import classNames from 'classnames'
import useSWR, { useSWRConfig } from 'swr'
import { twMerge } from 'tailwind-merge'
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
  const { mutate: mutateRemote } = useSWRConfig()
  const checkoutCarrierMethod = useSWR(SWR_KEY.checkout_carrier_method)?.data
  const { data: orders } = useSWR<GetOrderDraftRes>(SWR_KEY.orders)

  const { confirmDelivery, data, isValidating } = useDelivery({ order_id })

  const handleAddDelivery = (deliveryProps: Delivery) => {
    if (checkoutCarrierMethod?.carrier_id === deliveryProps?.carrier_id) return

    confirmDelivery({
      delivery: {
        carrier_id: deliveryProps.carrier_id,
      },
      handleSuccess: (res: ConfirmDeliveryCarrierResponse[]) => {
        mutateRemote(SWR_KEY.checkout_carrier_method, { company_id, ...deliveryProps })

        if (res?.[0]?.amount_total) {
          mutateRemote(SWR_KEY.orders, { ...orders, amount_total: res?.[0]?.amount_total }, false)
        }
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
              isActive={checkoutCarrierMethod?.carrier_id === item.carrier_id}
            />
          ))
        )}
      </div>
    </div>
  )
}
