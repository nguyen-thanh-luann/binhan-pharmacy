import { MenuIcon, RightIcon } from '@/assets'
import { isArrayHasValue, isProductDescContainChild } from '@/helper'
import { ProductDescription, ProductDescriptionChild } from '@/types'
import classNames from 'classnames'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface DescriptionMenuProps {
  className?: string
  data: ProductDescription[] | []
  isActive?: boolean
  currentDescId?: number
  onClick?: (data: ProductDescription) => void
  onChildClick?: (data: ProductDescriptionChild) => void
}

export const DescriptionMenu = ({
  data,
  className,
  currentDescId,
  onClick,
  onChildClick,
}: DescriptionMenuProps) => {
  const [showChilds, setShowChilds] = useState<boolean>(false)

  const handleParentCategoryClick = (data: ProductDescription) => {
    
    if (!isArrayHasValue(data?.child || [])) {
      onClick?.(data)
    } else {
      setShowChilds(!showChilds)
    }
  }

  return (
    <div className={twMerge(classNames(`bg-white`, className))}>
      <div className="p-10 flex items-center gap-12 border-b border-gray-200">
        <MenuIcon className="text-text-color w-32 h-32" />

        <p className="title_lg">{`Nội dung chính`}</p>
      </div>

      <div className="">
        {isArrayHasValue(data)
          ? data?.map((category) => (
              <div key={category.category_id}>
                {/* parent category */}
                <div
                  onClick={() => handleParentCategoryClick(category)}
                  className="flex-between border-b border-gray-200 p-10 cursor-pointer group"
                >
                  <p
                    className={`text_md group-hover:text-primary duration-200 ease-in-out ${
                      category.category_id === currentDescId ? '!text-primary' : ''
                    }`}
                  >
                    {category.category_name}
                  </p>

                  {isArrayHasValue(category?.child) ? (
                    <div className="w-[22px] h-[22px] flex-center duration-200 ease-in-out">
                      <RightIcon
                        className={`text-sm text-text-color duration-200 ease-in-out ${
                          currentDescId === category.category_id ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  ) : null}
                </div>

                {/* children category */}

                <div
                  className={
                    currentDescId == category.category_id ||
                    isProductDescContainChild(category, currentDescId || 0) ||
                    showChilds
                      ? 'flex'
                      : 'hidden'
                  }
                >
                  {isArrayHasValue(category.child) ? (
                    <div className="px-12 w-full">
                      {category?.child?.map((item) => (
                        <div
                          key={item.category_id}
                          onClick={() => onChildClick?.(item)}
                          className="p-12 border-b border-gray-200 w-full cursor-pointer group"
                        >
                          <p
                            className={`text_md group-hover:text-primary duration-200 ease-in-out ${
                              currentDescId === item?.category_id ? '!text-primary' : ''
                            }`}
                          >
                            {item.category_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  )
}
