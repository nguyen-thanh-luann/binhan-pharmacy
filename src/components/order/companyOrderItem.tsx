import { StoreIcon } from '@/assets'
import { OrderDraftRes } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { OrderLineProductItem } from './orderLineProductItem'
import { PromotionsAppliedOnOrderView } from './promotionsAppliedOnOrderView'

interface CompanyOrderItemProps {
  data: OrderDraftRes
  className?: string
}

export const CompanyOrderItem = ({ data, className }: CompanyOrderItemProps) => {
  return (
    <div className={twMerge(classNames(`bg-white shadow-shadow-1 rounded-lg`, className))}>
      <div className="p-12 border-b border-gray-200">
        <div className="flex items-center gap-8">
          <StoreIcon className="w-[22px] h-[22px] text-text-color" />

          <p className="text-text-color text-base font-medium leading-8">
            {data?.company_name || 'Công ty mặc định'}
          </p>
        </div>
      </div>

      <div>
        {data?.detail_order?.order_line?.map((orderLine) => (
          <OrderLineProductItem key={orderLine.id} data={orderLine} />
        ))}
      </div>

      {data?.discount ? (
        <PromotionsAppliedOnOrderView className="px-16 pb-8 pt-8" data={data.discount} />
      ) : null}
    </div>
  )
}
