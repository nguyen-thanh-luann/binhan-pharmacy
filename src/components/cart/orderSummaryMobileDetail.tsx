import { TimesIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { formatMoneyVND } from '@/helper'
import { GetOrderDraftRes } from '@/types'
import { useMemo } from 'react'
import useSWR from 'swr'

interface ICartSummaryMobileDetail {
  onClose?: Function
}

export const OrderSummaryMobileDetail = ({ onClose }: ICartSummaryMobileDetail) => {
  const { data } = useSWR<GetOrderDraftRes>(SWR_KEY.orders)

  const { totalPromotion, amountSubtotal, amountTotal } = useMemo(() => {
    let totalPromotion = 0
    let amountSubtotal = 0
    let amountTotal = 0

    if (!data?.sale_orders?.length) {
      return {
        totalPromotion,
        amountSubtotal,
        amountTotal,
      }
    }

    data.sale_orders.forEach((item) => {
      amountSubtotal += item.amount_subtotal
      totalPromotion += item.promotion_total
      amountTotal += item.amount_total
    })

    return { totalPromotion, amountSubtotal, amountTotal }
  }, [data])

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

        <div className="max-h-[40vh] overflow-scroll">
          {/* subtotal */}
          <div className="flex items-center justify-between mb-12 title-md">
            <p className="text-base text-text-color font-semibold">{`Tạm tính`}</p>
            <p className="text-base text-text-color font-semibold">
              {formatMoneyVND(amountSubtotal)}
            </p>
          </div>

          {data?.sale_orders?.map((saleOrder) =>
            saleOrder?.category_minor_promotion?.map((promotion) => (
              <div key={promotion?.category_id} className="flex-between mb-12 title-md">
                <p className="text-text-color text-base font-semibold leading-9">{`${promotion?.category_name} (-${promotion?.percent}%)`}</p>
                <p className="text-text-color text-base font-semibold leading-9">{`-${formatMoneyVND(
                  promotion?.promotion_total
                )}`}</p>
              </div>
            ))
          )}

          {/* total promotion */}
          <div className="flex items-center justify-between mb-12 title-md">
            <p className="text-base text-text-color font-semibold">{`Khuyến mãi`}</p>
            <p className="text-base text-text-color font-semibold">
              {formatMoneyVND(totalPromotion)}
            </p>
          </div>

          {/* total */}
          <div className="flex items-center justify-between mb-12 title-md">
            <p className="text-base text-text-color font-semibold">{`Tổng`}</p>
            <p className="text-base text-text-color font-semibold">{formatMoneyVND(amountTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
