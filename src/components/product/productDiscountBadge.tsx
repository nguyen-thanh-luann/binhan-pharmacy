import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ProductDiscountBadgeProps{
  data: string
  className?: string
  textClassName?: string
}

export const ProductDiscountBadge = ({data, className, textClassName}: ProductDiscountBadgeProps) => {
  return (
    <div className={twMerge(classNames('discount_badge flex-center overflow-hidden', className))}>
      <p className={twMerge(classNames('text-red font-bold text-sm line-clamp-1', textClassName))}>{data}</p>
    </div>
  )
}
