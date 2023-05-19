import { cartEmpty } from '@/assets'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { NotFound } from '../notFound'

interface CartEmptyProps {
  className?: string
}

export const CartEmpty = ({ className }: CartEmptyProps) => {
  const router = useRouter()
  
  return (
    <div className={twMerge(classNames('mt-50 max-w-[90%] mx-auto', className))}>
      <NotFound
        image={cartEmpty}
        imageClassName="w-[300px] h-[230px] md:w-[500px] md:h-[403px] mb-24"
        notify="Bạn chưa có sản phẩm nào trong giỏ, đặt hàng ngay!"
        notifyClassName="text-text-color !text-md md:!text-xl leading-10 !font-semibold text-center"
      />

      <Button
        onClick={() => {
          router.push('/')
        }}
        title="Đặt hàng"
        className="rounded-[12px] bg-primary mx-auto mt-32 py-12 w-[364px] max-w-[90%]"
        textClassName='text-white text-md font-semibold'
      />
    </div>
  )
}
