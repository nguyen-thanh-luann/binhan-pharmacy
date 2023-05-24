import { DraftOrderLine } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { Image } from '../image'
import { API_URL } from '@/constants'
import { formatMoneyVND } from '@/helper'
import { empty } from '@/assets'

interface OrderLineProductItemProps {
  data: DraftOrderLine
  className?: string
}

export const OrderLineProductItem = ({ data, className }: OrderLineProductItemProps) => {
 
  return (
    <div
      className={twMerge(
        classNames(`flex items-center gap-8 p-16 border-b border-gray-200`, className)
      )}
    >
      <div className="mr-10">
        <Image
          className="w-60 h-60"
          imageClassName="w-60 h-60 object-cover"
          src={data?.image ? `${API_URL}${data?.image || ''}`: empty}
        />
      </div>

      <div className="flex-1">
        <p className="text-base text-text-color font-semibold leading-8 line-clamp-2">
          {data?.name}
        </p>

        {/* variant */}
        <div>
          {data?.attributes?.length > 0 ? (
            <div>
              {data?.attributes?.map((item, index) => (
                <div key={index} className="flex items-center gap-8">
                  <p className="text-primary text-base min-w-fit line-clamp-1">
                    {`${item?.name}: ${item?.value_name}`}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="min-w-fit">
        <p className="text-md text-primary font-bold leading-8 line-clamp-1">
          {formatMoneyVND(data?.price_unit)}
        </p>
      </div>

      <div className="min-w-fit">
        <p className="text-md text-text-color font-bold leading-8 line-clamp-1">
          {`x${data?.quantity} ${data?.product_uom}`}
        </p>
      </div>
    </div>
  )
}
