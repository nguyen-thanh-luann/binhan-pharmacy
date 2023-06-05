import { SWR_KEY } from '@/constants'
import { formatMoneyVND } from '@/helper'
import { useCreateOrderDone } from '@/hooks'
import { GetOrderDraftRes } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import useSWR from 'swr'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { Spinner } from '../spinner'

interface CartSummaryProps {
  className?: string
}

export const OrderSummary = ({ className }: CartSummaryProps) => {
  const router = useRouter()
  const { data, isValidating } = useSWR<GetOrderDraftRes>(SWR_KEY.orders)
  const { createOrderDone } = useCreateOrderDone()

  const handleCreateOrder = () => {
    createOrderDone({}, (data) => {
      let query = ''
      data?.sale_order_id.forEach((item) => (query += `sale_order_id=${item.sale_order_id}&`))
      router.push(`/checkout-success?${query.slice(0, query.length - 1)}`)
    })
  }

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

  if (!data?.sale_orders?.length) return null

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
        <p className="text-text-color text-lg font-bold leading-9">{`Đơn hàng tạm tính`}</p>
        <p className="text-text-color text-lg font-bold leading-9">
          {formatMoneyVND(amountSubtotal)}
        </p>
      </div>

      {data?.sale_orders?.map((saleOrder) =>
        saleOrder?.category_minor_promotion?.map((promotion) => (
          <div key={promotion?.category_id} className="flex-between p-16 border-b border-gray-200">
            <p className="text-text-color text-base font-semibold leading-9">{`${promotion?.category_name} (-${promotion?.percent}%)`}</p>
            <p className="text-text-color text-base font-semibold leading-9">{`-${formatMoneyVND(
              promotion?.promotion_total
            )}`}</p>
          </div>
        ))
      )}

      <div className="flex-between p-16 border-b border-gray-200">
        <p className="text-text-color text-base font-semibold leading-9">{`Khuyến mãi`}</p>
        {isValidating ? (
          <Spinner />
        ) : (
          <p className="text-text-color text-base font-semibold leading-9">
            {formatMoneyVND(totalPromotion)}
          </p>
        )}
      </div>

      <div className="flex-between p-16">
        <p className="text-text-color text-lg font-bold leading-9">{`Thanh toán`}</p>
        <p className="text-primary text-lg font-bold leading-9">
          {formatMoneyVND(amountTotal)}
        </p>
      </div>

      <div className="p-16 pt-0">
        <Button
          title="Đặt hàng"
          className="bg-primary rounded-[10px] py-10 w-full"
          textClassName="text-md font-medium leading-9 text-white"
          onClick={handleCreateOrder}
        />
      </div>
    </div>
  )
}
