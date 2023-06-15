import { RightIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useCategoryMinorList } from '@/hooks'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { CategoryItemLoading } from '../category/categoryItemLoading'

export const FilterByCategoryMinor = () => {
  const [showCategories, setShowCategories] = useState<number[]>([])

  const router = useRouter()

  const { categoryMinorList, isValidating: categoryMinorListLoading } = useCategoryMinorList({
    key: SWR_KEY.get_category_minor_list_filter,
    params: {
      position_view: 'left_menu',
    },
  })

  const hanldeCategorySelect = (category_id: number) => {
    const _category_id = category_id.toString()
    const category = `minor_category_${_category_id}`
    const categories: any = router.query?.[category]

    let query = router.query

    if (!categories) {
      query[category] = _category_id
    } else {
      if (typeof categories === 'string') {
        if (categories === _category_id) {
          delete query[category]
        } else {
          query[category] = [_category_id]
        }
      } else if (typeof categories === 'object') {
        if (categories?.includes(_category_id)) {
          query[category] = categories.filter((item: string) => item !== _category_id)
        } else {
          query[category] = [_category_id]
        }
      } else {
        query[category] = _category_id
      }
    }

    router.push({
      query: { ...query },
    })
  }

  const hanldeShowCategories = (category_id: number) => {
    const index = showCategories?.findIndex((c) => c === category_id)

    if (index !== -1) {
      setShowCategories([...showCategories.filter((c) => c != category_id)])
      return
    }

    setShowCategories([...showCategories, category_id])
  }

  const isActive = (category_id: string): boolean => {
    const categoriesActive = router?.query?.[`minor_category_${category_id}`]

    if (!categoriesActive) return false

    if (typeof categoriesActive === 'string') {
      return categoriesActive === category_id
    } else {
      return !!categoriesActive.find((item) => item === category_id)
    }
  }

  return (
    <div>
      {categoryMinorListLoading ? (
        <div className="p-8">
          {Array?.from({ length: 7 }).map((_, index) => (
            <div key={index} className="mb-8">
              <CategoryItemLoading />
            </div>
          ))}
        </div>
      ) : isArrayHasValue(categoryMinorList) ? (
        <div>
          {categoryMinorList?.map((category) => {
            const isShow = showCategories?.findIndex((c) => c === category?.category_id) !== -1

            return (
              <div key={category?.category_id} className="bg-white">
                {isArrayHasValue(category?.child_ids) ? (
                  <div className="">
                    <div className="border-b border-gray-200 p-8 flex-between cursor-pointer">
                      <p
                        onClick={() => hanldeCategorySelect(category?.category_id)}
                        className={classNames(
                          ' font-bold text-md hover:text-primary',
                          isActive(category?.category_id?.toString())
                            ? 'text-primary'
                            : 'text-text-color'
                        )}
                      >
                        {category?.category_name}
                      </p>

                      <div
                        className="flex flex-1 justify-end"
                        onClick={() => hanldeShowCategories(category?.category_id)}
                      ></div>
                      <RightIcon className={`${isShow ? 'rotate-90' : ''} duration-200`} />
                    </div>

                    <div className={`pl-12 animate-fade ${isShow ? 'block' : 'hidden'}`}>
                      {category?.child_ids?.map((child) => {
                        return (
                          <div
                            key={child?.category_id}
                            className="flex gap-12 items-center p-8 cursor-pointer"
                            onClick={() => hanldeCategorySelect(child.category_id)}
                          >
                            <p
                              className={` font-semibold text-md ${
                                isActive(child?.category_id?.toString())
                                  ? 'text-primary'
                                  : 'text-text-color'
                              }`}
                            >
                              {child?.category_name}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
