import { PromotionRes } from '@/types'
import { twMerge } from 'tailwind-merge'
import { CouponItem } from './couponItem'
import { ProductGiftItem } from './productGiftItem'
import ScrollContainer from 'react-indiana-drag-scroll'

type Props = {
  data: PromotionRes[]
  className?: string
}

export const PromotionsAppliedOnCartView = ({ data, className }: Props) => {
  return (
    <div className={twMerge('flex flex-wrap flex-col gap-8', className)}>
      <ScrollContainer className="flex gap-8">
        {data?.map((item) => {
          if (item?.promotion_type !== 'bogo_sale') {
            return (
              <CouponItem
                className="min-w-fit"
                key={item.promotion_id}
                label={item?.selected_range_line?.range_name || item.promotion_name}
              />
            )
          }

          return null
        })}
      </ScrollContainer>

      <div className="">
        {data
          ?.filter?.((c) => c.promotion_type === 'bogo_sale')
          ?.map((item) => {
            if (item?.free_product?.length) {
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
            } else {
              return null
            }
          })}
      </div>

      {/* {data.map((item) => {
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

        return (
          <CouponItem
            className=""
            key={item.promotion_id}
            label={item?.selected_range_line?.range_name || item.promotion_name}
          />
        )
      })} */}
    </div>
  )
}
