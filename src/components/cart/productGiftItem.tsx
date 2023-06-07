import { empty } from '@/assets'
import { toImageUrl } from '@/helper'
import { PromotionFreeProduct } from '@/types'
import classNames from 'classnames'
import { Image } from '../image'

type Props = {
  data: PromotionFreeProduct
  className?: string
  label?: string
}

export const ProductGiftItem = ({ data, className, label = 'Quà tặng' }: Props) => {
  return (
    <div className={classNames(className)}>
      <div className="flex items-start w-fit px-12 py-4">
        <div className="mr-12">
          <Image
            src={
              data?.representation_image?.image_url
                ? toImageUrl(data?.representation_image?.image_url)
                : empty
            }
            alt=""
            className="w-[48px] h-[48px] rounded-lg"
            imageClassName="rounded-lg aspect-1 object-cover"
          />
        </div>

        <div className="flex-1">
          <p className="text-sm border border-primary rounded-md min-w-fit w-fit px-4 text-primary">
            {label}
          </p>
          <p className="text-base font-semibold line-clamp-2">{data.product_name}</p>
          <p className="text-base font-semibold line-clamp-2">{`x ${data?.quantity} ${data?.uom_id?.uom_name}`}</p>
        </div>
      </div>
    </div>
  )
}
