import { PromotionRes } from '@/types'
import { twMerge } from 'tailwind-merge'
import { ProductGiftItem } from './productGiftItem'

type Props = {
  data: PromotionRes[]
  className?: string
}

export const PromotionsAppliedOnCartView = ({ data, className }: Props) => {
  return (
    <div className={twMerge('flex flex-wrap gap-8', className)}>
      {data.map((item) => {
        if (item.promotion_type === 'bogo_sale' && item?.free_product?.length) {
          return item.free_product.map((product) => (
            <>
              <ProductGiftItem
                className="basis-full"
                key={product.product_id}
                data={product}
                label={item?.promotion_name}
              />
            </>
          ))
        }

        // return (
        //   <CouponItem
        //     className=""
        //     key={item.promotion_id}
        //     label={item?.selected_range_line?.range_name || item.promotion_name}
        //   />
        // )

        return null
      })}
    </div>
  )
}
