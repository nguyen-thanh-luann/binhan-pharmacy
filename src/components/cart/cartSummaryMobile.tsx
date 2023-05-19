import { UpIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { formatMoneyVND } from '@/helper'
import { cartAPI } from '@/services'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import { CartSummaryMobileDetail } from './cartSummaryMobileDetail'
import { Button } from '../button'
import { useCreateOrder } from '@/hooks'

export const CartSummaryMobile = () => {
  const router = useRouter()
  const [showCartSummaryDetail, setShowCartSummaryDetail] = useState<boolean>(false)
  const { data: cartLength } = useSWR(SWR_KEY.get_cart_length, () =>
    cartAPI.getCartLength().then((res) => res?.data?.cart_product_count)
  )

  const toggleCartSummaryDetail = () => {
    setShowCartSummaryDetail(!showCartSummaryDetail)
  }

  const { totalMoney, totalProduct, createOrderDraft } = useCreateOrder()

  const hanldeCreateOrderDraft = () => {
    createOrderDraft(() => {
      router.push('/checkout')
    })
  }

  const hanldeCreateOrder = () => {
    // createOrderDone({}, (data) => {
    //   let query = ''
    //   data?.sale_order_id.forEach((item) => (query += `sale_order_id=${item.sale_order_id}&`))
    //   router.push(`/checkout-success?${query.slice(0, query.length - 1)}`)
    // })
  }

  return (
    <div className={`fixed w-full z-40 bottom-0`}>
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
            <p className="text-base text-text-color font-bold">{formatMoneyVND(totalMoney)}</p>

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
            title={`Đặt hàng (${totalProduct})`}
            className="bg-primary rounded-[10px] py-10 flex-1"
            textClassName="text-base font-medium leading-9 text-white"
            onClick={() => {
              if (router.pathname === '/checkout') {
                hanldeCreateOrder()
              } else {
                hanldeCreateOrderDraft()
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
