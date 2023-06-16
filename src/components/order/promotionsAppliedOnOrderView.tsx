import { PromotionOrderRes } from '@/types'
import React from 'react'
import { CouponItem, ProductGiftItem } from '../cart'
import classNames from 'classnames'

type Props = {
  data: PromotionOrderRes[]
  className?: string
}

export const PromotionsAppliedOnOrderView = ({ data, className }: Props) => {
  return (
    <div className={classNames('', className)}>
      <p className="text-md font-bold">Thông tin khuyến mãi</p>

      <div className="ml-12">
        {data.map((item) => (
          <div
            key={item.promotion_id}
            className="mb-8 py-8 border-b border-solid border-gray-200 last:border-b-0"
          >
            <p className="text-base mb-8 line-clamp-1 font-bold">{item.promotion_name}</p>

            {item.promotion_type === 'bogo_sale' && item?.free_product?.length ? (
              item.free_product.map((product) => (
                <ProductGiftItem
                  key={product.product_id}
                  className="mb-0 last:mb-0"
                  data={product}
                  label={item?.promotion_name}
                />
              ))
            ) : item.promotion_type === 'range' ? (
              <div>
                {item.range_line?.range_discount_type !== 'free_product' ? (
                  <CouponItem
                    className={classNames(item?.free_product?.length && 'mb-8')}
                    label={item.range_line.range_name}
                  />
                ) : null}

                {item?.free_product?.length
                  ? item.free_product.map((product) => (
                      <ProductGiftItem
                        key={product.product_id}
                        className={classNames()}
                        data={product}
                        label={item?.promotion_name}
                      />
                    ))
                  : null}
              </div>
            ) : (
              <CouponItem label={item.promotion_name} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
