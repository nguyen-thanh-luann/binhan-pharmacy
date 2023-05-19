import { SWR_KEY } from '@/constants'
import { orderAPI } from '@/services'
import { OrderHistoryDetail as IOrderHistoryDetail } from '@/types'
import useSWR from 'swr'

interface useOrderHistoryDetailProps {
  sale_order_id: number
}

const useOrderHistoryDetail = ({ sale_order_id }: useOrderHistoryDetailProps) => {
  const { data, isValidating } = useSWR<IOrderHistoryDetail | undefined>(
    sale_order_id ? `${SWR_KEY.get_order_history_detail}_${sale_order_id}` : null,
    () =>
      orderAPI
        .getOrderHistoryDetail({ sale_order_id: Number(sale_order_id) })
        .then((res: any) => res?.result?.data?.info_booking)
        .catch((err) => console.log(err))
  )

  return {
    data,
    isValidating,
  }
}

export { useOrderHistoryDetail }
