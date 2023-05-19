import { SWR_KEY } from '@/constants'
import { useCategoryList, useCategoryMinorList } from '@/hooks'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { Spinner } from '../spinner'
import { isArrayHasValue } from '@/helper'
import { CategoryItem } from '.'

interface LeftNavCategoryDropDownProps {
  parent_category_id?: number
  className?: string
  isMinorCategory?: boolean
  handleClick?: (id: number) => void
}

export const LeftNavCategoryDropDown = ({
  parent_category_id,
  className,
  handleClick,
  isMinorCategory = false,
}: LeftNavCategoryDropDownProps) => {
  const { categoryList, isValidating: categoryListLoading } = useCategoryList({
    key: `${SWR_KEY.get_category_list}_${parent_category_id}`,
    shouldFetch: parent_category_id !== undefined && !isMinorCategory,
    params: {
      category_parent_id: parent_category_id,
    },
  })

  const { categoryMinorList, isValidating: categoryMinorListLoading } = useCategoryMinorList({
    key: `${SWR_KEY.get_category_minor_list}_${parent_category_id}`,
    shouldFetch: parent_category_id !== undefined && isMinorCategory,
    params: {
      category_parent_id: parent_category_id,
    },
  })

  return (
    <div className={twMerge(classNames(`w-full`, className))}>
      {categoryListLoading || categoryMinorListLoading ? (
        <div className="flex-center my-24">
          <Spinner />
        </div>
      ) : isArrayHasValue(categoryList) || isArrayHasValue(categoryMinorList) ? (
        <div className="">
          {categoryList?.map((category) => (
            <CategoryItem
              key={category.category_id}
              onClick={() => handleClick?.(category.category_id)}
              data={category}
              className="p-10 border-b border-r border-gray-100 cursor-pointer"
              activeLabelClassName="text-primary"
            />
          ))}

          {categoryMinorList?.map((category) => (
            <CategoryItem
              key={category.category_id}
              onClick={() => handleClick?.(category.category_id)}
              data={category}
              className="p-10 border-b border-r border-gray-100 cursor-pointer"
              activeLabelClassName="text-primary"
            />
          ))}
        </div>
      ) : (
        <div className="p-12">
          <p className="text-center text-text-color text-base">{`Không có dữ liệu`}</p>
        </div>
      )}
    </div>
  )
}
