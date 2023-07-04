import { SWR_KEY } from '@/constants'
import { orderAPI } from '@/services'
import { Delivery } from '@/types'
import useSWR, { KeyedMutator } from 'swr'
import { useAsync } from '../common'

interface ConfirmDeliveryProps {
  delivery: {
    carrier_id: number
    shipping_fee?: number
    delivery_message?: string
  }
  showScreenLoading?: boolean
  handleSuccess: Function
}

interface DeliverySWR {
  data: Delivery[]
  error: any
  isValidating: boolean
  confirmDelivery: (props: ConfirmDeliveryProps) => void
  mutate: KeyedMutator<any>
}

interface UseDeliveryProps {
  order_id: number
}

const useDelivery = ({ order_id }: UseDeliveryProps): DeliverySWR => {
  const { asyncHandler } = useAsync()

  const { data, error, isValidating, mutate } = useSWR(
    order_id ? `${SWR_KEY.get_delivery}${order_id}` : null,
    () =>
      orderAPI.getDeliveryMethods({ sale_id: order_id }).then((res: any) => res.result?.data || [])
  )

  const confirmDelivery = async ({ handleSuccess, delivery }: ConfirmDeliveryProps) => {
    asyncHandler({
      fetcher: orderAPI.confirmDeliveryMethod({
        sale_carrier: [
          {
            carrier_id: delivery.carrier_id,
            sale_id: order_id,
            delivery_price: delivery?.shipping_fee || 0,
          },
        ],
        payment_type: '2',
        required_note: 'DUOC_PHEP_KIEM_TRA_HANG',
        delivery_message: delivery?.delivery_message || '',
      }),
      onSuccess: (res) => {
        handleSuccess?.(res)
      },
      config: { showSuccessMsg: false },
    })
  }

  return {
    data,
    error,
    isValidating,
    confirmDelivery,
    mutate,
  }
}

export { useDelivery }
