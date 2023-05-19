import React from 'react'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import {LeftIcon, RightIcon } from '@/assets'
import ReactPaginate, { ReactPaginateProps } from 'react-paginate'

export type PaginationProps = ReactPaginateProps & {}

export const Pagination = ({className, ...props }: PaginationProps) => {
  return (
    <ReactPaginate
      previousLabel={<LeftIcon />}
      nextLabel={<RightIcon />}
      nextClassName=""
      breakClassName=""
      pageClassName=""
      activeLinkClassName="text-[white] bg-primary rounded-sm duration-150 ease-in-out"
      {...props}
      className={twMerge(classNames('flex items-center justify-center duration-200 ease-in-out', className))}
      pageLinkClassName="px-2 py-1 mx-4"
    />
  )
}
