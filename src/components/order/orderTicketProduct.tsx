import { ProductOrderHistory } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { Image } from '../image'
import { API_URL } from '@/constants'
import { empty } from '@/assets'
import { formatMoneyVND } from '@/helper'

interface OrderTicketProductProps {
  data: ProductOrderHistory
  className?: string
}

export const OrderTicketProduct = ({ data, className }: OrderTicketProductProps) => {
  return (
    <div className={twMerge(classNames(`flex border-b border-gray-200 py-12`, className))}>
      <div className="mr-8">
        <Image
          src={data?.image_url?.length > 0 ? `${API_URL}${data?.image_url?.[0]}` : empty}
          imageClassName="w-[62px] h-[62px] object-cover"
        />
      </div>

      <div className="flex-1">
        <p className="text-text-color text-md line-clamp-2 font-semibold">{data?.name}</p>

        <p className="text-text-color text-md line-clamp-1">{`x${data?.quantity}`}</p>

        <p className="text-primary text-md line-clamp-1 font-bold">{formatMoneyVND(data?.price)}</p>
      </div>
    </div>
  )
}
