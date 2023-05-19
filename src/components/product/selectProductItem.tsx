import { Product } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'

interface SelectProductItemProps {
  className?: string
  product: Product
  onClick?: (product: Product) => void
  type: 'select' | 'unSelect'
}

export const SelectProductItem = ({
  className,
  product,
  type = 'select',
  onClick,
}: SelectProductItemProps) => {
  return (
    <div
      className={twMerge(
        classNames(`flex-between border border-gray-200 p-8 rounded-lg`, className)
      )}
    >
      <p className="text-md font-bold">{product.product_name}</p>

      <Button
        title={type === 'select' ? 'Thêm' : 'Xóa'}
        className={`rounded-md p-4 px-8 ${type === 'select' ? 'bg-primary-200' : 'bg-gray-200'}`}
        textClassName="text-text-color"
        onClick={() => onClick?.(product)}
      />
    </div>
  )
}
