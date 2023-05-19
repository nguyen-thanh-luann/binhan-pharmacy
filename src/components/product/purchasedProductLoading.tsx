import { StarIconOutline } from '@/assets'
import classNames from 'classnames'
import React from 'react'

interface PurchasedProductLoadingProps {
  className?: string
}

export const PurchasedProductLoading = ({ className }: PurchasedProductLoadingProps) => {
  return (
    <div
      className={classNames(
        'animate-pulse rounded-md bg-white border border-gray-100 p-12',
        className
      )}
    >
      <div className="flex mb-24 gap-12">
        <div className="w-[45px] h-[45px] rounded-md bg-gray-300"></div>
        <div>
          <div className="w-[200px] mb-8 h-12 rounded-full bg-gray-300"></div>
          <div className="w-[150px] h-8 rounded-full bg-gray-300"></div>
        </div>
      </div>
      <div className="flex justify-center gap-8 h-[50px] items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIconOutline key={index} className="w-[25px] h-[25px]" />
        ))}
      </div>
    </div>
  )
}
