import { MenuIcon, RightIcon } from '@/assets'
import { isArrayHasValue, isProductDescContainChild } from '@/helper'
import { ProductDescription } from '@/types'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface DescriptionMenuProps {
  className?: string
  data: ProductDescription[] | []
  isActive?: boolean
  currentDescId?: number
  onClick?: (data: ProductDescription) => void
  toggleParentDescMenu?: (id: number) => void
}

export const DescriptionMenu = ({
  data,
  className,
  currentDescId = 0,
  onClick,
}: DescriptionMenuProps) => {
  const [showChilds, setShowChilds] = useState<boolean>(false)
  const [activeDescId, setActiveDescId] = useState<number>(currentDescId)

  const handleParentCategoryClick = (data: ProductDescription) => {
    if (!isArrayHasValue(data?.child || [])) {
      onClick?.(data)
    } else {
      // toggle  children category menu
      if (showChilds || activeDescId !== 0) {
        setShowChilds(!showChilds)
        setActiveDescId(0)
      } else {
        setShowChilds(true)
        setActiveDescId(currentDescId)
      }
    }
  }

  useEffect(() => {
    setActiveDescId(currentDescId)
  }, [currentDescId])

  return (
    <div className={twMerge(classNames(`bg-white`, className))}>
      <div className="p-10 flex items-center gap-12 border-b border-gray-200">
        <MenuIcon className="text-text-color w-32 h-32" />

        <p className="title_lg">{`Nội dung chính`}</p>
      </div>

      <div className="">
        {isArrayHasValue(data)
          ? data?.map((category) => {
              const isVisible = isProductDescContainChild(category, activeDescId) || showChilds

              return (
                <div key={category.category_id}>
                  {/* parent category */}
                  <div
                    onClick={() => handleParentCategoryClick(category)}
                    className="flex-between border-b border-gray-200 p-10 cursor-pointer group"
                  >
                    <p
                      className={classNames(
                        'text-md font-bold group-hover:text-primary duration-200 ease-in-out',
                        category.category_id === activeDescId ? '!text-primary' : ''
                      )}
                    >
                      {category.category_name}
                    </p>

                    {isArrayHasValue(category?.child) ? (
                      <div className="w-[22px] h-[22px] flex-center duration-200 ease-in-out">
                        <RightIcon
                          className={classNames(
                            'text-sm text-text-color duration-200 ease-in-out',
                            isVisible ? 'rotate-90' : ''
                          )}
                        />
                      </div>
                    ) : null}
                  </div>

                  {/* children category */}
                  <div className={classNames('animate-fade', isVisible ? 'flex' : 'hidden')}>
                    {isArrayHasValue(category.child) ? (
                      <div className="px-12 w-full">
                        {category?.child?.map((item) => {
                          return (
                            <div
                              key={item.category_id}
                              onClick={() => handleParentCategoryClick?.(item)}
                              className="p-12 border-b last:border-none border-gray-200 w-full cursor-pointer group"
                            >
                              <p
                                className={classNames(
                                  'text_md group-hover:text-primary duration-200 ease-in-out',
                                  activeDescId === item?.category_id ? '!text-primary' : ''
                                )}
                              >
                                {item.category_name}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })
          : null}
      </div>
    </div>
  )
}
