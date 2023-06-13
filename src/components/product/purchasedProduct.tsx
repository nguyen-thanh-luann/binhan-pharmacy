import { RatingRes } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { CustomImage } from '../customImage'
import { Star } from '../star'
import { Button } from '../button'

interface PurchasedProductProps {
  data: RatingRes
  className?: string
  onSelect?: (props: RatingRes) => void
}

export const PurchasedProduct = ({ className, data, onSelect }: PurchasedProductProps) => {
  const hasRating = data?.comment_rating?.comment_id

  console.log({ data })

  return (
    <div
      className={classNames(
        'rounded-md bg-white border border-gray-200 shadow-shadow-1 p-12',
        className
      )}
    >
      <div className="border-b border-gray-200 mb-8">
        <p className="text-base font-bold leading-9">{`Đơn hàng: ${data?.sale_order?.sale_name}`}</p>
        {/* {data?.sale_order?.company_id?.company_name && (
          <p className="text-base font-bold">{`Công ty: ${data?.sale_order?.company_id?.company_name}`}</p>
        )} */}
      </div>

      <div className="flex mb-12">
        <div className="flex items-center gap-12">
          <CustomImage
            src={data?.product?.representation_image?.image_url}
            imageClassName="w-[60px] h-[60px] rounded-md object-cover aspect-1"
          />
          <div className="">
            <p className="mb-8 text-md font-bold line-clamp-1">{data?.product?.product_name}</p>
            <Star readonly ratingValue={data?.product?.star_rating * 20} size={18} />
          </div>
        </div>
      </div>

      <div className="flex justify-center h-[50px]">
        <Button
          onClick={() => onSelect?.(data)}
          title={hasRating ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá'}
          className="rounded-md px-12 h-fit border border-primary bg-primary my-auto"
          textClassName="text-white text-base font-bold"
        />
      </div>
    </div>
  )
}
