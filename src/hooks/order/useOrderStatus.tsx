import { SWR_KEY } from '@/constants'
import { orderAPI } from '@/services'
import { OrderStatusRes } from '@/types'
import useSWR from 'swr'

interface useStatusOrderRes {
  data: OrderStatusRes | undefined
  isValidating: boolean
}

export const useStatusOrder = (): useStatusOrderRes => {
  const { data, isValidating } = useSWR(
    SWR_KEY.get_order_status,
    () => orderAPI.getStatusOrder().then((res: any) => res?.result || []),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  return {
    data,
    isValidating,
  }
}
