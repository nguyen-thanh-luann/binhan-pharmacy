import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { isObjectHasValue } from '@/helper'
import { orderAPI } from '@/services'
import { OrderFilterParams, OrderHistory, OrderHistoryDetail } from '@/types'
import useSWR from 'swr'

interface OrderHistorySWR {
  data: {
    sales_summary: { total_sale: number; total_amount: number }
    sale_orders: OrderHistory[]
  }
  error: any
  isValidating: boolean
  getDetailOrderHistory: (id: number, cb?: (orderDetail: OrderHistoryDetail) => void) => void
  changePage: (offset: number, cb?: Function) => void
  filterOrderHistory: (props: OrderFilterParams) => void
}

const fetcher = async (limit = DEFAULT_LIMIT, offset = 0) => {
  try {
    const res: any = await orderAPI.getOrderHistoryList({
      limit,
      offset: offset * limit,
    })
    return isObjectHasValue(res?.result?.data)
      ? res.result.data
      : {
          sales_summary: { total_sale: 0, total_amount: 0 },
          sale_orders: [],
        }
  } catch (err) {
    console.log(err)
  }
}

const useOrderHistory = (limit = DEFAULT_LIMIT): OrderHistorySWR => {
  const { data, isValidating, error, mutate } = useSWR(
    SWR_KEY.get_order_history_list,
    () => fetcher(limit, 0),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  const filterOrderHistory = async (props: OrderFilterParams) => {
    try {
      const res: any = await orderAPI.getOrderHistoryList({ booking_type: 'state', ...props })
      if (res?.result?.success) {
        mutate(res?.result?.data, false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getDetailOrderHistory = async (
    sale_order_id: number,
    cb?: (order: OrderHistoryDetail) => void
  ) => {
    try {
      const res: any = await orderAPI.getOrderHistoryDetail({ sale_order_id })
      if (res?.result?.success) cb && cb(res.result?.data?.info_booking)
    } catch (error) {
      console.log(error)
    }
  }

  const changePage = async (offset: number, cb?: Function) => {
    const orderList = await fetcher(limit, offset)
    cb && cb()
    mutate(orderList, false)
  }

  return {
    data,
    error,
    isValidating,
    getDetailOrderHistory,
    changePage,
    filterOrderHistory,
  }
}

export { useOrderHistory }
