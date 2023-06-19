import React from 'react'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import {LeftIcon, RightIcon } from '@/assets'
import ReactPaginate, { ReactPaginateProps } from 'react-paginate'

export type PaginationProps = ReactPaginateProps & {}

export const Pagination = ({className, ...props }: PaginationProps) => {
  return (
    <ReactPaginate
      previousLabel={<LeftIcon className='w-[32px]'/>}
      nextLabel={<RightIcon className='w-[32px]'/>}
      nextClassName=""
      breakClassName=""
      pageClassName=""
      activeLinkClassName="text-[white] bg-primary rounded-[10px] w-[32px] duration-150 ease-in-out"
      {...props}
      className={twMerge(classNames('flex items-center justify-center duration-200 ease-in-out', className))}
      pageLinkClassName="border border-gray-200 rounded-[8px] px-[10px] py-[6px] mx-4"
    />
  )
}
