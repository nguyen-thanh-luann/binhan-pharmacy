import { SWR_KEY } from '@/constants'
import { formatMoneyVND, getPromotionValueReq, sumMoneyAndTotalProductInCart } from '@/helper'
import { useCreateOrder } from '@/hooks'
import { promotionAPI } from '@/services'
import { GetProductsInCartRes, GetShoppingCartRes, UserInfo } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { Spinner } from '../spinner'

interface CartSummaryProps {
  className?: string
}

export const CartSummary = ({ className }: CartSummaryProps) => {
  const router = useRouter()
  const { cache, mutate: mutateRemote } = useSWRConfig()
  const customer_id = useSWR<UserInfo>(SWR_KEY.get_user_information)?.data?.account?.partner_id
  const { data: shoppingcart } = useSWR<GetShoppingCartRes>(SWR_KEY.cart_list)
  const { createOrderDraft } = useCreateOrder()
  const { data: totalPromotion = 0, isValidating } = useSWR(
    SWR_KEY.cartSummary,
    () => cartSummaryFetcher(),
    { revalidateOnMount: false }
  )

  const { totalAmount, totalProduct, isLoading } = useMemo(() => {
    return sumMoneyAndTotalProductInCart(shoppingcart)
  }, [shoppingcart])

  async function cartSummaryFetcher() {
    const cart: GetProductsInCartRes = cache.get(SWR_KEY.cart_list)?.data
    if (!customer_id || !cart?.result?.length) return 0

    try {
      const order_data = getPromotionValueReq(cart)
      if (!order_data?.length) return 0

      const res = await promotionAPI.getPromotionValue({
        customer_id,
        order_data,
        only_promotion_total: true,
      })
      return res.data?.promotion_total || 0
    } catch (error) {
      console.log(error)
      return 0
    }
  }

  const hanldeCreateOrderDraft = () => {
    createOrderDraft((orders) => {
      mutateRemote(SWR_KEY.checkout_carrier_method, undefined, false)
      mutateRemote(SWR_KEY.checkout_paymet_method, undefined, false)

      router.push({
        pathname: `/checkout`,
        query: { order_ids: orders.map((item) => item.order_id) },
      })
    })
  }

  return (
    <div
      className={twMerge(
        classNames(
          'sticky top-header_group_height bg-white rounded-[10px] shadow-shadow-1',
          className
        )
      )}
    >
      <div className="flex-between p-16 border-b border-gray-200">
        <p className="text-text-color text-lg font-semibold leading-9">{`Đơn hàng tạm tính`}</p>
        <p className="text-text-color text-lg font-semibold leading-9">
          {formatMoneyVND(totalAmount)}
        </p>
      </div>

      <div className="flex-between p-16 border-b border-gray-200">
        <p className="text-text-color text-base font-medium leading-9">{`Khuyến mãi tổng`}</p>
        {isValidating ? (
          <Spinner />
        ) : (
          <p className="text-text-color text-lg font-semibold leading-9">
            {formatMoneyVND(totalPromotion)}
          </p>
        )}
      </div>

      <div className="flex-between p-16">
        <p className="text-text-color text-lg font-semibold leading-9">{`Thanh toán`}</p>
        <p className="text-primary text-lg font-semibold leading-9">
          {formatMoneyVND(totalAmount - totalPromotion)}
        </p>
      </div>

      <div className="p-16 pt-0">
        <Button
          disabled={isLoading}
          loading={isLoading}
          title={`Đặt hàng (${totalProduct})`}
          className="bg-primary rounded-[10px] py-10 w-full"
          textClassName="text-md font-medium leading-9 text-white"
          onClick={hanldeCreateOrderDraft}
        />
      </div>
    </div>
  )
}
