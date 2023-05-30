import { RightIcon } from '@/assets'
import { isArrayHasValue, isProductDescContainChild } from '@/helper'
import { useModal } from '@/hooks'
import { ProductDescription } from '@/types'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface DescriptionMenuMobileProps {
  className?: string
  data: ProductDescription[] | []
  isActive?: boolean
  currentDescId?: number
  onClick?: (data: ProductDescription) => void
  toggleParentDescMenu?: (id: number) => void
}

export const DescriptionMenuMobile = ({
  data,
  className,
  currentDescId = 0,
  onClick,
}: DescriptionMenuMobileProps) => {
  const [showChilds, setShowChilds] = useState<boolean>(false)
  const [activeDescId, setActiveDescId] = useState<number>(currentDescId)
  const [activeTitle, setActiveTitle] = useState<string>('')
  const { visible: isExpand, toggle: toggleExpand } = useModal()

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

  useEffect(() => {
    getActiveTitle(activeDescId)
  }, [activeDescId])

  const getActiveTitle = (id: number) => {
    if (!data) return

    data?.forEach((category) => {
      if (category.category_id === id) {
        setActiveTitle(category.category_name)
      }

      category?.child?.forEach((child) => {
        if (child.category_id === id) {
          setActiveTitle(child.category_name)
        }
      })
    })
  }

  return (
    <div className={twMerge(classNames(`bg-white`, className))}>
      {isArrayHasValue(data) ? (
        <div>
          <div
            onClick={toggleExpand}
            className="p-10 flex-between gap-12 border-b border-gray-200 cursor-pointer duration-150 ease-in-out bg-gray-100"
          >
            <p className="text-md">{activeTitle}</p>

            <RightIcon
              className={classNames('w-12 h-12 duration-150', isExpand ? 'rotate-90' : '')}
            />
          </div>

          {isExpand ? (
            <div className={classNames('animate-fade')}>
              {data?.map((category) => {
                const isVisible = isProductDescContainChild(category, activeDescId) || showChilds

                return (
                  <div>
                    <div
                      onClick={() => handleParentCategoryClick(category)}
                      className="p-10 cursor-pointer flex-between"
                    >
                      <p
                        className={classNames(
                          'text-md group-hover:text-primary duration-200 ease-in-out',
                          category.category_id === activeDescId ? '!text-primary' : ''
                        )}
                      >
                        {category?.category_name}
                      </p>

                      <RightIcon
                        className={classNames(
                          'text-sm text-text-color duration-200 ease-in-out',
                          isVisible ? 'rotate-90' : ''
                        )}
                      />
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
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
