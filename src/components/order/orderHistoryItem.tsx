import { formatMoneyVND } from '@/helper'
import { OrderHistory } from '@/types'
import React from 'react'
import { Button } from '../button'
import { NoteIconOutline } from '@/assets'

interface OrderHistoryItemProps {
  data: OrderHistory
  onClick?: Function
}

export const OrderHistoryItem = ({ data, onClick: onExternalClick }: OrderHistoryItemProps) => {

  return (
    <div className="bg-white p-16 rounded-lg shadow-sm mb-20 last:mb-0 shadow-shadow-1">
      <div className="border-b border-gray-200 pb-12 flex items-center">
        <NoteIconOutline className='mr-8'/>
        <p className="text-md font-bold text-text-color">{`Mã đơn hàng: ${data?.name}`}</p>
      </div>

      <div className="py-12">
        <p className="mb-12">
          <span className="title-md !text-gray">{`Trạng thái đơn hàng: `}</span>
          <span className="title-md">{data.state_name}</span>
        </p>

        <p className="mb-12">
          <span className="title-md !text-gray">{`Cửa hàng: `}</span>
          <span className="title-md">{data.company_name}</span>
        </p>

        <p className="mb-12">
          <span className="title-md !text-gray">{`Ngày đặt hàng: `}</span>
          <span className="title-md">{data.create_date}</span>
        </p>

        <p className="mb-12">
          <span className="title-md !text-gray">{`Trạng thái đơn hàng: `}</span>
          <span className="title-md">{data.state_delivery_name}</span>
        </p>

        <p className="">
          <span className="title-md !text-gray">{`Trạng thái thanh toán: `}</span>
          <span className="title-md">{data.state_paid_name}</span>
        </p>
      </div>

      <div className="py-12 border-t border-gray-200">
        <p className="text-end mb-12">
          <span className="title-md !text-gray">{`Tổng tiền: `}</span>
          <span className="title-md">{formatMoneyVND(data.amount_total)}</span>
        </p>

        <div className="flex justify-end">
          <Button
            onClick={() => {
              onExternalClick?.()
            }}
            title='Xem chi tiết'
            className="bg-primary rounded-md px-12"
            textClassName='text-white text-md'
          />
        </div>
      </div>
    </div>
  )
}
