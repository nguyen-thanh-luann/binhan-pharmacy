import { UpIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { formatMoneyVND, sumMoneyAndTotalProductInCart } from '@/helper'
import { cartAPI } from '@/services'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { CartSummaryMobileDetail } from './cartSummaryMobileDetail'
import { Button } from '../button'
import { useCreateOrder } from '@/hooks'
import { GetShoppingCartRes } from '@/types'

export const CartSummaryMobile = () => {
  const router = useRouter()
  const [showCartSummaryDetail, setShowCartSummaryDetail] = useState<boolean>(false)
  const { data: shoppingcart } = useSWR<GetShoppingCartRes>(SWR_KEY.cart_list)

  const { totalAmount, totalProduct, isLoading } = useMemo(() => {
    return sumMoneyAndTotalProductInCart(shoppingcart)
  }, [shoppingcart])

  const { data: cartLength } = useSWR(SWR_KEY.cart_count, () =>
    cartAPI.getCartLength().then((res) => res?.data?.cart_product_count)
  )

  const toggleCartSummaryDetail = () => {
    setShowCartSummaryDetail(!showCartSummaryDetail)
  }

  const { createOrderDraft } = useCreateOrder()

  const hanldeCreateOrderDraft = () => {
    createOrderDraft((orders) => {
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
            <p className="text-base text-text-color font-bold">{formatMoneyVND(totalAmount)}</p>

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
            disabled={isLoading}
            loading={isLoading}
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
