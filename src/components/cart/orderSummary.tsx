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

  const { totalProduct, totalPromotion } = useMemo(() => {
    let totalProduct = 0
    let totalPromotion = 0

    if (!data?.sale_orders?.length) {
      return {
        totalProduct,
        totalPromotion,
      }
    }

    data.sale_orders.forEach((item) => {
      totalPromotion += item.promotion_total
      item?.detail_order?.order_line?.forEach(() => {
        totalProduct += 1
      })
    })

    return { totalProduct, totalPromotion }
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
        <p className="text-text-color text-lg font-semibold leading-9">{`Đơn hàng tạm tính`}</p>
        <p className="text-text-color text-lg font-semibold leading-9">
          {formatMoneyVND(data?.amount_total || 0)}
        </p>
      </div>

      {/* <div className="flex-between p-16 border-b border-gray-200">
        <p className="text-text-color text-base font-medium leading-9">{`CK đơn nhóm thường dùng`}</p>
        <p className="text-text-color text-base font-medium leading-9">{formatMoneyVND(0)}</p>
      </div>

      <div className="flex-between p-16 border-b border-gray-200">
        <p className="text-text-color text-base font-medium leading-9">{`Ck đơn nhóm tư vấn`}</p>
        <p className="text-text-color text-base font-medium leading-9">{formatMoneyVND(0)}</p>
      </div> */}

      <div className="flex-between p-16 border-b border-gray-200">
        <p className="text-text-color text-base font-medium leading-9">{`Khuyến mãi`}</p>
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
          {formatMoneyVND(data?.amount_total - totalPromotion)}
        </p>
      </div>

      <div className="p-16">
        <Button
          title={`Đặt hàng (${totalProduct})`}
          className="bg-primary rounded-[10px] py-10 w-full"
          textClassName="text-md font-medium leading-9 text-white"
          onClick={handleCreateOrder}
        />
      </div>
    </div>
  )
}
