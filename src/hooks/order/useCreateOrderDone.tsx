import { SWR_KEY } from '@/constants'
import { getProductsCheckedInCart } from '@/helper'
import { cartAPI, orderAPI } from '@/services'
import {
  resetOrderData,
  selectOrderAddress,
  selectOrderLineDelivery,
  selectOrderPayment,
  setBackdropVisible,
} from '@/store'
import {
  createOrderDoneFunction,
  CreateOrderDoneRes,
  CreateOrderDoneWithTransactionConfirmedFunction,
  GetOrderDraftRes,
  OrderLineDelivery,
  Payment,
  ShippingAddressV2,
} from '@/types'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import useSWR, { useSWRConfig } from 'swr'
import { useAsync } from '../common'

export const useCreateOrderDone = () => {
  const { mutate, cache } = useSWRConfig()
  const { asyncHandler } = useAsync()
  const dispatch = useDispatch()
  const orderAddress: ShippingAddressV2 = useSelector(selectOrderAddress)
  const orderLineDelivery: OrderLineDelivery = useSelector(selectOrderLineDelivery)
  const orderPayment: Payment = useSelector(selectOrderPayment)
  const orders = useSWR<GetOrderDraftRes>(SWR_KEY.orders)?.data?.sale_orders

  const checkDataValid = (): boolean => {
    if (!checkOrderAddressValid(orderAddress)) {
      toast.error('Vui lòng chọn địa chỉ giao hàng hợp lệ!')
      return false
    }

    if (!orderLineDelivery?.carrier_id) {
      toast.error('Vui lòng chọn phương thức vận chuyển!')
      return false
    }

    if (!orderPayment?.acquirer_id) {
      toast.error('Vui lòng chọn phương thức thanh toán!')
      return false
    }

    return true
  }

  const checkOrderAddressValid = (orderAddress: ShippingAddressV2) => {
    if (
      orderAddress?.id &&
      orderAddress?.state_id.id &&
      orderAddress?.district_id.id &&
      orderAddress?.ward_id.id
    ) {
      return true
    }
    return false
  }

  const deleteCheckedProducts = () => {
    const cart = cache.get(SWR_KEY.cart_list)?.data
    const products = getProductsCheckedInCart(cart)
    if (products?.length) {
      cartAPI
        .deleteCartProduct({
          cart_product_ids: products.map((item) => item.shopping_cart_product_id),
          category_type: 'category_minor',
        })
        .then(() => {
          mutate(SWR_KEY.cart_count)
          mutate(SWR_KEY.cart_list)
        })
        .catch((err) => console.log(err))
    }
  }

  const createOrderDone = async (
    { date_order, note, tag_ids }: createOrderDoneFunction,
    cb?: (_: CreateOrderDoneRes) => void
  ) => {
    if (!checkDataValid() || !orders?.length) return

    const order_id = orders.filter((item) => item.order_id)?.map((item) => item.order_id)
    dispatch(dispatch(setBackdropVisible(true)))

    try {
      const res: any = await orderAPI?.updateOrderDraft({
        order_id,
        partner_shipping_id: orderAddress?.id || null,
      })

      dispatch(dispatch(setBackdropVisible(false)))

      if (!res?.result) {
        toast.error(res?.result?.message || 'Có lỗi xảy ra')
        return
      }

      asyncHandler({
        fetcher: orderAPI.createOrderDone({
          order_id,
          date_order,
          note,
          tag_ids: tag_ids?.length ? tag_ids.map((item) => item.id) : [],
        }),
        onSuccess: (data: any) => {
          cb?.(data)
          dispatch(resetOrderData())
          deleteCheckedProducts()
          setTimeout(() => {
            mutate(SWR_KEY.orders, [], false)
          }, 4000)
        },
        config: {
          successMsg: 'Tạo đơn hàng thành công',
        },
      })
    } catch (e) {
      console.log(e)
      dispatch(dispatch(setBackdropVisible(false)))
    }
  }

  const createOrderDoneWithTransactionConfirmed = async (
    { date_order, note, tag_ids, order_id }: CreateOrderDoneWithTransactionConfirmedFunction,
    cb?: (_: CreateOrderDoneRes) => void
  ) => {
    if (!checkDataValid() || !order_id?.length) return

    dispatch(dispatch(setBackdropVisible(true)))

    try {
      const res: any = await orderAPI?.updateOrderDraft({
        order_id,
        partner_shipping_id: orderAddress?.id || null,
      })

      dispatch(dispatch(setBackdropVisible(false)))

      if (!res?.result) {
        toast.error(res?.result?.message || 'Có lỗi xảy ra')
        return
      }

      asyncHandler({
        fetcher: orderAPI.createOrderDone({
          order_id,
          date_order,
          note,
          tag_ids: tag_ids?.length ? tag_ids.map((item) => item.id) : [],
        }),
        onSuccess: (data: any) => {
          cb?.(data)
          dispatch(resetOrderData())
          deleteCheckedProducts()
          setTimeout(() => {
            mutate(SWR_KEY.orders, [], false)
          }, 4000)
        },
        config: {
          successMsg: 'Tạo đơn hàng thành công',
        },
      })
    } catch (e) {
      console.log(e)
      dispatch(dispatch(setBackdropVisible(false)))
    }
  }

  return {
    createOrderDone,
    createOrderDoneWithTransactionConfirmed,
  }
}
