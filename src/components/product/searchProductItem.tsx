import { SearchIcon, TimesIcon } from '@/assets'
import { Product } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ProductSearchItemProps {
  onChange?: (_: Product) => void
  onDelete?: (_: number) => void
  data: Product
  className?: string
}

export const SearchProductItem = ({
  data,
  onChange,
  onDelete,
  className,
}: ProductSearchItemProps) => {
  return (
    <div
      className={twMerge(
        classNames(
          `flex items-center cursor-pointer p-8 rounded-md bg-white hover:bg-gray-200 active:opacity-50 duration-150 ease-in-out`,
          className
        )
      )}
    >
      <div>
        <SearchIcon className='text-base text-gray mr-8'/>
      </div>

      <div
        className="flex-1"
        onClick={() => {
          onChange?.(data)
        }}
      >
        <p className="text-base text-text-color line-clamp-2">{data?.product_name}</p>
      </div>

      {onDelete ? (
        <div
          onClick={() => {
            onDelete?.(data?.product_id)
          }}
        >
          <TimesIcon className="text-base text-gray" />
        </div>
      ) : null}
    </div>
  )
}
