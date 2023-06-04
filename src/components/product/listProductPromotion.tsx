import { PromotionProductItemRes } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { ProductPromotionItem } from './productPromotion'
import { useModal } from '@/hooks'
import { Image } from '../image'
import { UpIcon, bigSale } from '@/assets'
import { isArrayHasValue } from '@/helper'
import moment from 'moment'

interface ListProductPromotionProps {
  data: PromotionProductItemRes[]
  className?: string
}

export const ListProductPromotion = ({ data, className }: ListProductPromotionProps) => {
  const { visible, toggle } = useModal()

  if (!isArrayHasValue(data)) return null

  return (
    <div className={classNames('', className)}>
      <div onClick={toggle} className="flex items-center gap-8 cursor-pointer mb-12">
        <div className="">
          <Image src={bigSale} imageClassName="w-[50px] h-[50px] object-cover" />
        </div>

        <div className="border rounded-lg border-primary p-12">
          <p className="text-md line-clamp-1">{`Từ ${moment(data?.[0]?.date_start).format(
            'DD/MM'
          )} đến ${moment(data?.[0]?.date_end).format('DD/MM')} Hết hạn ${moment(
            data?.[0]?.date_end
          ).diff(moment(data?.[0]?.date_start), 'days')} ngày`}</p>
        </div>

        <div>
          <UpIcon className={classNames(visible ? '' : 'rotate-180', 'duration-200')} />
        </div>
      </div>

      <div
        className={classNames(
          visible ? 'block' : 'hidden',
          'animate-fade max-h-[300px] overflow-scroll scrollbar-hide'
        )}
      >
        {data?.map((productPromotion) => (
          <ProductPromotionItem key={productPromotion?.promotion_id} data={productPromotion} />
        ))}
      </div>
    </div>
  )
}
