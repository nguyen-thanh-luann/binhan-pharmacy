import { DownIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useCategoryList, useCategoryMinorList } from '@/hooks'
import classNames from 'classnames'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Spinner } from '../spinner'
import { CategoryNavDropDownMenu } from './categoryNavDropDownMenu'

interface HeaderCategoryNavProps {
  className?: string
}

export const CategoryNav = ({ className }: HeaderCategoryNavProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [currentCategoryId, setCurrentCategoryId] = useState<number | undefined>()
  const [isCategoryMinor, setIsCategoryMinor] = useState<boolean>(false)
  const { categoryList, isValidating: categoryListLoading } = useCategoryList({
    key: SWR_KEY.get_category_list,
    params: {},
  })

  const { categoryMinorList, isValidating: categoryMinorListLoading } = useCategoryMinorList({
    key: SWR_KEY.get_category_minor_list,
    params: {},
  })

  // useCategoryMinorList
  const handleCategoryClick = (id: number) => {
    setCurrentCategoryId(id)
  }

  return (
    <div ref={ref} className={twMerge(classNames(`bg-primary`, className))}>
      <div className="container px-12">
        <div className="relative" onMouseLeave={() => setCurrentCategoryId(undefined)}>
          <div className="flex items-center justify-between">
            <div className="flex-1 flex h-header_nav_height gap-24 overflow-scroll scrollbar-hide">
              {categoryListLoading || categoryMinorListLoading ? (
                <div className="flex-1 flex-center">
                  <Spinner />
                </div>
              ) : isArrayHasValue(categoryList || categoryMinorList) ? (
                <div className="flex-1 flex h-header_nav_height gap-12 overflow-scroll scrollbar-hide">
                  {categoryList?.map((option, index) => (
                    <div
                      onClick={() => handleCategoryClick(option?.category_id)}
                      onMouseEnter={() => {
                        setCurrentCategoryId(option?.category_id)
                      }}
                      className="flex items-center gap-6 py-6 px-8 my-auto cursor-pointer min-w-fit"
                      key={index}
                    >
                      <p className="title !text-white uppercase h-[22px] flex-center select-none">
                        {option?.category_name}
                      </p>
                      <div className="w-[22px] h-[22px] flex-center">
                        <DownIcon className="title !text-white" />
                      </div>
                    </div>
                  ))}

                  {[...categoryMinorList].map((option, index) => (
                    <div
                      onClick={() => handleCategoryClick(option?.category_id)}
                      onMouseEnter={() => {
                        setIsCategoryMinor(true)
                        setCurrentCategoryId(option?.category_id)
                      }}
                      onMouseLeave={() => setIsCategoryMinor(false)}
                      className="flex items-center gap-6 py-6 px-8 my-auto cursor-pointer min-w-fit"
                      key={index}
                    >
                      <p className="title !text-white uppercase h-[22px] flex-center">
                        {option?.category_name}
                      </p>
                      <div className="w-[22px] h-[22px] flex-center">
                        <DownIcon className="title !text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex items-center ml-12">
              <Link href="/" className="title !text-white">
                Góc nhà thuốc
              </Link>

              <div className={`border-l border-white h-[18px] mx-12`}></div>

              <Link href="/" className="title !text-white">
                Sống khỏe mỗi ngày
              </Link>
            </div>
          </div>

          {/* dropdown menu */}
          <div
            className={`absolute z-40 left-0 right-0 ${
              currentCategoryId ? 'flex' : 'hidden'
            } transition-opacity ease-in-out duration-200`}
          >
            <CategoryNavDropDownMenu
              parent_category_id={currentCategoryId}
              isMinorCategory={isCategoryMinor}
              className="transition-opacity ease-in-out duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
