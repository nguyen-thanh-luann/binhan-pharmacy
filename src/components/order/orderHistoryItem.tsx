import { formatMoneyVND } from '@/helper'
import { OrderHistory } from '@/types'
import React from 'react'
import { Button } from '../button'
import { NoteIconOutline } from '@/assets'
import { CustomImage } from '../customImage'

interface OrderHistoryItemProps {
  data: OrderHistory
  onClick?: Function
}

export const OrderHistoryItem = ({ data, onClick: onExternalClick }: OrderHistoryItemProps) => {
  return (
    <div className="bg-white p-16 rounded-lg mb-20 last:mb-0 shadow-shadow-1">
      <div className="border-b border-gray-200 pb-12 flex items-center flex-between flex-wrap">
        <div className="flex items-center">
          <NoteIconOutline className="mr-8 font-bold" />
          <p className="text-md font-bold text-text-color">{`Mã đơn hàng: ${data?.name}`}</p>

          <p className="rounded-lg p-4 px-12 bg-primary-100 text-primary ml-8">
            {data?.state_name}
          </p>
        </div>

        <div>
          <p className="text-md font-bold">{`Ngày đặt hàng: ${data?.create_date}`}</p>
        </div>
      </div>

      <div className="py-12">
        {data?.product?.slice(0, 2)?.map((product) => (
          <div
            key={product.product_id}
            className="flex gap-12 mb-12 last:mb-0 border-b last:border-none border-gray-200 py-8"
          >
            <div className="">
              <CustomImage
                src={product.image_url?.[0] || ''}
                imageClassName="w-[80px] h-[80px] rounded-lg object-cover aspect-1"
              />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold line-clamp-2 mb-8">{product?.name}</p>
              <p className="text-base font-bold line-clamp-2 mb-8 text-red">
                {formatMoneyVND(product?.price)}
              </p>
              <p className="text-base font-bold line-clamp-2">{`Số lượng: ${product?.quantity}`}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="py-12 border-t border-gray-200">
        <p className="text-end mb-12">
          <span className="text-md text-text-color">{`Tổng tiền: `}</span>
          <span className="text-md font-bold text-red">{formatMoneyVND(data.amount_total)}</span>
        </p>

        <div className="flex justify-end">
          <Button
            onClick={() => {
              onExternalClick?.()
            }}
            title="Xem chi tiết"
            className="bg-primary rounded-md px-12"
            textClassName="text-white text-md"
          />
        </div>
      </div>
    </div>
  )
}
