import { ArrowLeftIcon, UpIcon } from '@/assets'
import { API_URL } from '@/constants'
import { formatMoneyVND, isObjectHasValue } from '@/helper'
import { useOrderHistoryDetail } from '@/hooks'
import { selectPreviewImageUrl, setPreviewImageUrl } from '@/store'
import { OrderHistoryDetail as IOrderHistoryDetail } from '@/types'
import classNames from 'classnames'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { twMerge } from 'tailwind-merge'
import { CustomImage } from '../customImage'
import { Image } from '../image'
import { ImageShower } from '../imageShower'
import { OrderProductLoading } from './orderProductLoading'
import { PromotionsAppliedOnOrderView } from './promotionsAppliedOnOrderView'

interface OrderHistoryDetailProps {
  type?: 'history' | 'order'
  sale_order_id: number
  className?: string
  cb?: (params: IOrderHistoryDetail) => void
}

export const OrderHistoryDetail = ({ sale_order_id, className, cb }: OrderHistoryDetailProps) => {
  const { data: order, isValidating } = useOrderHistoryDetail({ sale_order_id })
  const dispatch = useDispatch()
  const previewImageUrl = useSelector(selectPreviewImageUrl)

  useEffect(() => {
    if (order) cb?.(order)
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
                  'duration-200 ease-in-out text-base',
                  viewOrderDetail ? '' : 'rotate-180'
                )}
              />
            </div>

            <table
              className={classNames(
                'hidden animate-fade table-auto ml-12',
                viewOrderDetail ? 'md:table' : ''
              )}
            >
              <thead>
                <tr>
                  <th className="text-md text-start">Sản phẩm</th>
                  <th className="text-md text-start">Đơn vị</th>
                  <th className="text-md text-start">Số lượng</th>
                  <th className="text-md text-start">Giá</th>
                </tr>
              </thead>
              <tbody>
                {order?.products?.map((item) => (
                  <tr key={item.product_id}>
                    <td className="">
                      <div className="flex items-center gap-12 mb-16">
                        <CustomImage
                          src={item.image_url?.[0] || ''}
                          className="w-[40px] h-[40px]"
                          imageClassName="w-[40px] max-w-[40px] h-[40px] object-cover rounded-lg aspect-1"
                        />
                        <p className="text-md font-bold line-clamp-2">{item.name}</p>
                      </div>
                    </td>
                    <td className="text-md min-w-[100px]">{item.product_uom}</td>
                    <td className="text-md min-w-[100px]">{item.quantity}</td>
                    <td className="text-md min-w-[100px]">{formatMoneyVND(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* show in mobile */}
            <div className={`${viewOrderDetail ? 'block ml-12' : 'hidden'} md:hidden`}>
              {order?.products?.map((item) => (
                <div key={item.product_id} className="flex gap-12 mb-12">
                  <div className="">
                    <CustomImage
                      src={item.image_url?.[0] || ''}
                      className="w-[40px] h-[40px] object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-md line-clamp-2">{item.name}</p>
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
          {order?.category_minor_promotion?.map((promotion) => (
            <div key={promotion?.category_id} className="flex-between mb-8 last:mb-0">
              <p className="text-text-color text-md font-semibold">{`${promotion?.category_name} (-${promotion?.percent}%)`}</p>
              <p className="text-text-color text-md font-semibold">{`-${formatMoneyVND(
                promotion?.promotion_total
              )}`}</p>
            </div>
          ))}

          <p className="flex-between">
            <span className="text-text-color font-bold text-md">{`Tổng tiền`}</span>
            <span className="text-md font-bold text-red">
              {formatMoneyVND(order?.amount_total || 0)}
            </span>
          </p>
        </div>
      </div>
    )
  }

  if (isValidating)
    return (
      <div className="bg-white p-12">
        {Array?.from({ length: 4 }).map((_, index) => (
          <OrderProductLoading key={index} />
        ))}
      </div>
    )

  if (!order) return null

  return (
    <div className={twMerge(classNames(`bg-white p-24 rounded-[10px] shadow-shadow-1`, className))}>
      {isObjectHasValue(order) ? (
        <div className="order_history-detail">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            <div className="bg-white p-16 rounded-sm">
              <p className="text-text-color font-bold text-lg mb-4">Địa chỉ người nhận</p>
              <p className="text-text-color font-bold text-md mb-4">{order.delivery_name}</p>
              <p className="text-text-color font-semibold text-md mb-4">{`Địa chỉ: ${order.delivery_address}`}</p>
              <p className="text-text-color font-semibold text-md">{`Số điện thoại: ${order.delivery_phone}`}</p>
            </div>

            <div className="bg-white p-16 rounded-sm">
              <p className="text-text-color font-bold text-lg mb-4">Phương thức thanh toán</p>
              <p className="mb-4">
                <span className="text-text-color font-semibold text-md">
                  {order?.payment_method?.payment_name}
                </span>

                {order?.payment_method?.payment_type === 'bank' && (
                  <div>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        const imageUrl = order?.payment_method?.payment_info?.qr_code
                        if (imageUrl) {
                          dispatch(setPreviewImageUrl(`${imageUrl}`))
                        }
                      }}
                    >
                      <Image
                        src={
                          order?.payment_method?.payment_info?.qr_code
                            ? `${API_URL}${order?.payment_method?.payment_info?.qr_code}`
                            : ''
                        }
                        imageClassName="w-[100px] h-[100px] object-contain"
                        className="w-[100px]"
                      />
                    </div>
                    <p className="text-md">{order?.payment_method?.payment_info?.bank_name}</p>
                    <p className="text-md font-bold mb-4">
                      {`Chủ tài khoản: ${order?.payment_method?.payment_info?.bank_account_holder}`}
                    </p>

                    <p className="text-md font-bold mb-4">
                      {`Số tài khoản: ${order?.payment_method?.payment_info?.bank_code}`}
                    </p>

                    <p className="text-md font-bold mb-4">
                      {`Chi nhánh: ${order?.payment_method?.payment_info?.bank_branch}`}
                    </p>
                  </div>
                )}
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

          {previewImageUrl ? <ImageShower url={previewImageUrl} /> : null}
        </div>
      ) : null}
    </div>
  )
}
