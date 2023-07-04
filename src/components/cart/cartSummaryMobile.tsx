import { UpIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { formatMoneyVND, getPromotionValueReq, sumMoneyAndTotalProductInCart } from '@/helper'
import { cartAPI, promotionAPI } from '@/services'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { CartSummaryMobileDetail } from './cartSummaryMobileDetail'
import { Button } from '../button'
import { useCreateOrder } from '@/hooks'
import { GetProductsInCartRes, GetShoppingCartRes, UserInfo } from '@/types'

export const CartSummaryMobile = () => {
  const router = useRouter()
  const { cache, mutate: mutateRemote } = useSWRConfig()
  const [showCartSummaryDetail, setShowCartSummaryDetail] = useState<boolean>(false)
  const { data: shoppingcart } = useSWR<GetShoppingCartRes>(SWR_KEY.cart_list)
  const customer_id = useSWR<UserInfo>(SWR_KEY.get_user_information)?.data?.account?.partner_id

  const { totalAmount, totalProduct, isLoading } = useMemo(() => {
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

  const { data: cartLength } = useSWR(SWR_KEY.cart_count, () =>
    cartAPI.getCartLength().then((res) => res?.data?.cart_product_count)
  )

  const toggleCartSummaryDetail = () => {
    setShowCartSummaryDetail(!showCartSummaryDetail)
  }

  const { createOrderDraft } = useCreateOrder()

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
    <div className={`fixed w-full z-40 bottom-bottom_nav_height `}>
      <div>
        {showCartSummaryDetail ? (
          <CartSummaryMobileDetail
            onClose={() => {
              toggleCartSummaryDetail()
            }}
            subTotal={totalAmount}
            totalPromotion={totalPromotion}
            total={totalAmount - totalPromotion}
          />
        ) : null}
      </div>
      <div className="relative">
        <div className="h-cart_summary_mobile_height bg-white border-t border-gray-200 p-12 flex items-center justify-between">
          <div
            onClick={() => {
              if (cartLength || 0 > 0) {
                toggleCartSummaryDetail()
              }
            }}
            className="flex-1 flex items-center"
          >
            <p className="text-base text-text-color font-bold">
              {formatMoneyVND(totalAmount - totalPromotion)}
            </p>

            {cartLength || 0 > 0 ? (
              <div className="cursor-pointer">
                <UpIcon
                  className={`${
                    showCartSummaryDetail ? '' : 'rotate-180'
                  } text-gray text-sm ml-8 duration-200 ease-in-out`}
                />
              </div>
            ) : null}
          </div>

          <Button
            disabled={isLoading || isValidating}
            loading={isLoading || isValidating}
            title={`Đặt hàng (${totalProduct})`}
            className="bg-primary rounded-[10px] py-10 flex-1"
            textClassName="text-base font-medium leading-9 text-white"
            onClick={hanldeCreateOrderDraft}
          />
        </div>
      </div>
    </div>
  )
}
