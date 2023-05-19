import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useCategoryList, useCategoryMinorList } from '@/hooks'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { CategoryItem } from '.'
import { NotFound } from '../notFound'
import { Spinner } from '../spinner'
import { CategoryNavChilds } from './categoryNavChilds'
import { ProductsOnNavCategory } from '../home'

interface CategoryNavDropDownMenuProps {
  parent_category_id?: number
  className?: string
  isMinorCategory?: boolean
}

export const CategoryNavDropDownMenu = ({
  parent_category_id,
  className,
  isMinorCategory = false,
}: CategoryNavDropDownMenuProps) => {
  const [currentCategoryId, setCurrentCategoryId] = useState<number | undefined>(0)

  const { categoryList, isValidating: categoryListLoading } = useCategoryList({
    key: `${SWR_KEY.get_category_list}_${parent_category_id}`,
    shouldFetch: parent_category_id !== undefined && !isMinorCategory,
    params: {
      category_parent_id: parent_category_id,
    },
  })

  const {categoryMinorList, isValidating: categoryMinorListLoading } = useCategoryMinorList({
    key: `${SWR_KEY.get_category_minor_list}_${parent_category_id}`,
    shouldFetch: parent_category_id !== undefined && isMinorCategory,
    params: {
      category_parent_id: parent_category_id,
    },
  })

  useEffect(() => {
    setCurrentCategoryId(
      categoryList?.[0]?.category_id || categoryMinorList?.[0]?.category_id
    )
  }, [categoryList, parent_category_id])

  return (
    <div
      className={twMerge(
        classNames(
          `bg-white shadow-shadow-1 rounded-bl-[10px] rounded-br-[10px] 
          w-full h-category_dropdown_height `,
          className
        )
      )}
    >
      {categoryListLoading || categoryMinorListLoading ? (
        <div className="flex-center my-24">
          <Spinner />
        </div>
      ) : isArrayHasValue(categoryList) || isArrayHasValue(categoryMinorList) ? (
        <div>
          <div className="grid grid-cols-4">
            <div className="col-span-1 h-category_dropdown_height overflow-scroll scrollbar-hide">
              {categoryList?.map((category) => (
                <div
                  key={category.category_id}
                  onMouseEnter={() => {
                    setCurrentCategoryId(category.category_id)
                  }}
                >
                  <CategoryItem
                    onClick={() => setCurrentCategoryId(category.category_id)}
                    data={category}
                    isActive={category.category_id === currentCategoryId}
                    className="p-10 border-b border-r border-gray-100 cursor-pointer"
                    activeLabelClassName="text-primary"
                  />
                </div>
              ))}

              {categoryMinorList?.map((category) => (
                <div
                  key={category.category_id}
                  onMouseEnter={() => {
                    setCurrentCategoryId(category.category_id)
                  }}
                >
                  <CategoryItem
                    onClick={() => setCurrentCategoryId(category.category_id)}
                    data={category}
                    isActive={category.category_id === currentCategoryId}
                    className="p-10 border-b border-r border-gray-100 cursor-pointer"
                    activeLabelClassName="text-primary"
                  />
                </div>
              ))}
            </div>

            <div className="col-span-3 h-category_dropdown_height overflow-scroll scrollbar-hide">
              {/* child category list */}
              <div>
                <CategoryNavChilds
                  onChildCategoryClick={(data) => console.log(data.category_id)}
                  parent_category_id={currentCategoryId}
                />
              </div>

              {/* product list */}
              <div className="p-12 h-full">
                <ProductsOnNavCategory
                  category_id={currentCategoryId || 0}
                  category_type={isMinorCategory ? 'minor' : 'major'}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NotFound className="h-full" notify={`Không tìm thấy dữ liệu`} />
      )}
    </div>
  )
}
