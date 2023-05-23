import { ArrowLeftIcon, UpIcon } from '@/assets'
import { formatMoneyVND, isObjectHasValue } from '@/helper'
import { useOrderHistoryDetail } from '@/hooks'
import { OrderHistoryDetail as IOrderHistoryDetail } from '@/types'
import classNames from 'classnames'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { CustomImage } from '../customImage'
import { Spinner } from '../spinner'
import { PromotionsAppliedOnOrderView } from './promotionsAppliedOnOrderView'

interface OrderHistoryDetailProps {
  type?: 'history' | 'order'
  sale_order_id: number
  className?: string
  cb?: (params: IOrderHistoryDetail) => void
}

export const OrderHistoryDetail = ({ sale_order_id, className, cb: om }: OrderHistoryDetailProps) => {
  const { data: order, isValidating } = useOrderHistoryDetail({ sale_order_id })

  useEffect(() => {
    if (order) om?.(order)
  }, [order])

  const RenderOrderDetail = () => {
    const [viewOrderDetail, setViewOrderDetail] = useState(true)

    const handleViewOrderDetail = () => {
      setViewOrderDetail(!viewOrderDetail)
    }

    return (
      <div className="mb-12 bg-white p-16 rounded-sm shadow-sm">
        {order?.products?.length || 0 > 0 ? (
          <div className="section">
            <div
              onClick={handleViewOrderDetail}
              className="flex items-center cursor-pointer transition duration-300 ease-in-out mb-12"
            >
              <p className="text-md font-bold mr-8">Chi tiết đơn hàng</p>
              <UpIcon
                className={classNames(
                  'duration-200 ease-in-out text-md',
                  viewOrderDetail ? '' : 'rotate-180'
                )}
              />
            </div>

            <table
              className={classNames(
                'hidden animate-fade product_table w-full transition',
                viewOrderDetail ? 'md:table' : ''
              )}
            >
              <thead>
                <tr className="">
                  <th className="text-start text-md">Sản phẩm</th>
                  <th className="text-start text-md">Đơn vị</th>
                  <th className="text-start text-md">Số lượng</th>
                  <th className="text-start text-md">Giá</th>
                </tr>
              </thead>
              <tbody>
                {order?.products?.map((item) => (
                  <tr key={item.product_id}>
                    <td className="image-group">
                      <div className="flex items-center gap-12 mb-16">
                        <div className="">
                          <CustomImage
                            src={item.image_url?.[0] || ''}
                            className="w-[40px] h-[40px]"
                            imageClassName="w-[40px] h-[40px] object-cover rounded-lg aspect-1"
                          />
                        </div>
                        <p className="title-md font-bold line-clamp-1">{item.name}</p>
                      </div>
                    </td>
                    <td className="text-md">{item.product_uom}</td>
                    <td className="text-md">{item.quantity}</td>
                    <td className="text-md">{formatMoneyVND(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* show in mobile */}
            <div className={`${viewOrderDetail ? 'block' : 'hidden'} md:hidden`}>
              {order?.products?.map((item) => (
                <div key={item.product_id} className="flex gap-12 mb-12">
                  <div className="">
                    <CustomImage
                      src={item.image_url?.[0] || ''}
                      className="w-[40px] h-[40px] object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-md line-clamp-1">{item.name}</p>
                    <p className="text-md">{`x${item.quantity} `}</p>
                    <p className="text-md !text-error">{formatMoneyVND(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {order?.discount ? <PromotionsAppliedOnOrderView data={order.discount} /> : null}

        <div className="border-t border-gray-200 p-12">
          <p className="text-end mb-12">
            <span className="text-text-color font-bold text-md">{`Tổng tiền: `}</span>
            <span className="text-md font-bold text-primary">
              {formatMoneyVND(order?.amount_total || 0)}
            </span>
          </p>
        </div>
      </div>
    )
  }

  if (isValidating)
    return (
      <div className="flex-center">
        <Spinner />
      </div>
    )

  if (!order) return null

  return (
    <div className={twMerge(classNames(`bg-white p-24 rounded-[10px] shadow-shadow-1`, className))}>
      {isObjectHasValue(order) ? (
        <div className="order_history-detail">
          <div className="grid grid-cols-1  lg:grid-cols-3 gap-12 mb-12">
            <div className="bg-white p-16 rounded-sm">
              <p className="text-text-color font-bold text-lg mb-4">Địa chỉ người nhận</p>
              <p className="text-text-color font-bold text-md mb-4">{order.partner_name}</p>
              <p className="text-text-color font-semibold text-md mb-4">{`Địa chỉ: ${order.delivery_address}`}</p>
              <p className="text-text-color font-semibold text-md">{`Số điện thoại: ${order.delivery_phone}`}</p>
            </div>
            <div className="bg-white p-16 rounded-sm">
              <p className="text-text-color font-bold text-lg mb-4">Phương thức vận chuyển</p>
              <p className="mb-4">
                <span className="text-text-color font-semibold text-md">{`COD - Tiền mặt trực tiếp`}</span>
              </p>
              <p className="mb-4">
                <span className="text-text-color font-semibold text-md">{`Tổng tiền: `}</span>
                <span className="font-semibold text-md !text-primary">
                  {formatMoneyVND(order?.amount_total)}
                </span>
              </p>
            </div>
            <div className="bg-white p-16 rounded-sm shadow-sm">
              <p className="text-text-color font-bold text-lg mb-4">Đơn hàng</p>
              <p className="text-text-color font-semibold text-md mb-4">{`Mã đơn hàng: ${order.name}`}</p>
              <p className="text-text-color font-semibold text-md mb-4">{`Trạng thái đơn hàng: ${order.state_name}`}</p>
              <p className="text-text-color font-semibold text-md mb-4">
                {`Trạng thái vận chuyển: ${order.state_delivery_name}`}
              </p>
            </div>
          </div>

          <RenderOrderDetail />

          <Link href={'/purchased-order'}>
            <div className="text-md !text-primary flex items-center hover:opacity-50 duration-150 ease-in-out">
              <ArrowLeftIcon />
              <span className="ml-6 text-primary">Trở lại</span>
            </div>
          </Link>
        </div>
      ) : null}
    </div>
  )
}
