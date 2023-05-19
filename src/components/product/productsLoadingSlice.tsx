import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { ProductItemLoading } from './productItemLoading'

interface ProductsLoadingSliceProps {
  className?: string
  renderCount?: number
}

export const ProductsLoadingSlice = ({ className, renderCount = 4 }: ProductsLoadingSliceProps) => {
  return (
    <div
      className={twMerge(
        classNames(`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12`, className)
      )}
    >
      {Array.from({ length: renderCount }).map((_, index) => (
        <ProductItemLoading key={index} />
      ))}
    </div>
  )
}
