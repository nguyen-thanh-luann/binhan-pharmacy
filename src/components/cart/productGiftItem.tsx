import { giftIcon } from '@/assets'
import { toImageUrl } from '@/helper'
import { PromotionFreeProduct } from '@/types'
import classNames from 'classnames'
import { Image } from '../image'

type Props = {
  data: PromotionFreeProduct
  className?: string
}

export const ProductGiftItem = ({ data, className }: Props) => {
  return (
    <div className={classNames(className)}>
      <div className="flex items-start border w-fit px-12 py-4 rounded-lg border-primary bg-primary-100">
        <div className="flex items-center">
          <Image src={giftIcon} className="w-20 h-20 object-contain mr-8" alt="" />

          <div className="mr-12">
            <Image
              src={toImageUrl(data?.representation_image?.image_url)}
              alt=""
              className="w-[38px] h-[38px] object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold line-clamp-2">{data.product_name}</p>
          <div className="flex items-center">
            <p className="text-sm mr-8">Đơn vị: {data.uom_id.uom_name}</p>
            <p className="text-sm">x {data.quantity}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
