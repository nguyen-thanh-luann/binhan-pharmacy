import { PromotionProductItemRes } from '@/types'
import classNames from 'classnames'
import React from 'react'

interface ProductPromotionProps {
  data: PromotionProductItemRes
  className?: string
}

export const ProductPromotionItem = ({ data, className }: ProductPromotionProps) => {
  if (!data) return null

  return (
    <div className={classNames('', className)}>
      {data?.promotion_level === 'special_promotion' ? (
        <div>
          <p className="text-md text-red font-bold">{data?.promotion_name}</p>
        </div>
      ) : (
        <div className="flex gap-8 items-start">
          <div className="w-12 min-w-[12px] mt-6 h-12 rounded-full bg-orange"></div>
          <p className="text-md">{data?.promotion_name}</p>
        </div>
      )}
    </div>
  )
}
