import { TimesIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { formatMoneyVND, getPromotionValueReq, sumMoneyAndTotalProductInCart } from '@/helper'
import { promotionAPI } from '@/services'
import { GetProductsInCartRes, GetShoppingCartRes, UserInfo } from '@/types'
import { useMemo } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { Spinner } from '../spinner'

interface ICartSummaryMobileDetail {
  onClose?: Function
}

export const CartSummaryMobileDetail = ({ onClose }: ICartSummaryMobileDetail) => {
  const { data: shoppingcart } = useSWR<GetShoppingCartRes>(SWR_KEY.cart_list)
  const { cache } = useSWRConfig()
  const customer_id = useSWR<UserInfo>(SWR_KEY.get_user_information)?.data?.account?.partner_id

  const { totalAmount } = useMemo(() => {
    return sumMoneyAndTotalProductInCart(shoppingcart)
  }, [shoppingcart])

  const { data: totalPromotion = 0, isValidating } = useSWR(
    SWR_KEY.cartSummary,
    () => cartSummaryFetcher(),
    { revalidateOnMount: false }
  )

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

  return (
    <div className="relative h-[100vh] bg-black-400 animate-fade">
      <div className="absolute bottom-0 p-12 bg-white min-h-[150px] w-full rounded-tl-2xl rounded-tr-2xl duration-150 ease-in-out">
        <div className="relative mb-18">
          <p className="text-md font-semibold text-center">{'Đơn hàng'}</p>
          <div
            className="absolute top-4 right-4 cursor-pointer"
            onClick={() => {
              onClose && onClose()
            }}
          >
            <TimesIcon className="text-sm text-gray" />
          </div>
        </div>

        {/* subtotal */}
        <div className="flex items-center justify-between mb-12 title-md">
          <p className="text-base text-text-color font-semibold">{`Tạm tính`}</p>
          <p className="text-base text-text-color font-semibold">{formatMoneyVND(totalAmount)}</p>
        </div>

        {/* total promotion */}
        <div className="flex items-center justify-between mb-12 title-md">
          <p className="text-base text-text-color font-semibold">{`Khuyến mãi`}</p>
          <p className="text-base text-text-color font-semibold">
            {isValidating ? <Spinner /> : formatMoneyVND(totalPromotion)}
          </p>
        </div>

        {/* total */}
        <div className="flex items-center justify-between mb-12 title-md">
          <p className="text-base text-text-color font-semibold">{`Tổng`}</p>
          <p className="text-base text-text-color font-semibold">
            {formatMoneyVND(totalAmount - totalPromotion)}
          </p>
        </div>
      </div>
    </div>
  )
}
