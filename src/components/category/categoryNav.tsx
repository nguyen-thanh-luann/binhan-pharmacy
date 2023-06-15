import { DownIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { isArrayHasValue, isDrugStore } from '@/helper'
import { useCategoryList, useCategoryMinorList, usePrimaryPostCategory, useUser } from '@/hooks'
import { PostCategory } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import ScrollContainer from 'react-indiana-drag-scroll'
import { twMerge } from 'tailwind-merge'
import { Spinner } from '../spinner'
import { CategoryNavDropDownMenu } from './categoryNavDropDownMenu'

interface HeaderCategoryNavProps {
  className?: string
}

export const CategoryNav = ({ className }: HeaderCategoryNavProps) => {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const { userInfo } = useUser({})
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

  const { data: postCategoryList, isValidating: postCategoryLoading } = usePrimaryPostCategory({
    key: `${SWR_KEY.get_parent_post_category_list}`,
    params: {},
  })

  const handleCategoryClick = (id: number, type: 'category' | 'minor_category') => {
    if (type === 'category') {
      router.push(`/search/?category_${id}=${id}`)
    } else {
      router.push(`/search/?minor_category_${id}=${id}`)
    }
    setCurrentCategoryId(undefined)
  }

  const hanldePostCategoryClick = (postCategory: PostCategory) => {
    if (postCategory.role === 'npp' && !isDrugStore(userInfo?.account)) {
      toast.error('Thông tin chỉ dành cho người phụ trách chuyên môn về dược')
    } else {
      router.push({
        pathname: '/post-list',
        query: {
          parent_category: postCategory?.id,
        },
      })
    }
  }

  return (
    <div ref={ref} className={twMerge(classNames(`bg-primary`, className))}>
      <div className="container px-12">
        <div className="relative" onMouseLeave={() => setCurrentCategoryId(undefined)}>
          <div className="flex-between">
            <div className="flex-1 h-header_nav_height">
              {categoryListLoading || categoryMinorListLoading ? (
                <div className="flex-1 flex-center h-header_nav_height">
                  <Spinner />
                </div>
              ) : isArrayHasValue(categoryList || categoryMinorList) ? (
                <ScrollContainer className="flex-1 flex h-header_nav_height gap-12">
                  {categoryList?.map((option, index) => (
                    <div
                      onClick={() => handleCategoryClick(option?.category_id, 'category')}
                      onMouseEnter={() => {
                        setCurrentCategoryId(option?.category_id)
                      }}
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

                  {categoryMinorList.map((option, index) => (
                    <div
                      onClick={() => handleCategoryClick(option?.category_id, 'minor_category')}
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
                </ScrollContainer>
              ) : null}
            </div>

            <div className="flex items-center ml-12 max-w-[300px] overflow-scroll scrollbar-hide">
              {postCategoryLoading ? (
                <div>
                  <Spinner />
                </div>
              ) : (
                <div>
                  {isArrayHasValue(postCategoryList) ? (
                    <div className="flex items-center">
                      <div className={`border-l border-white h-[18px] mx-12`}></div>

                      <ScrollContainer className="flex items-center">
                        {postCategoryList?.map((postCategory, index) => {
                          return postCategory?.role !== 'npp' ? (
                            <div className="flex items-center" key={index}>
                              <div
                                className="cursor-pointer"
                                key={postCategory.id}
                                onClick={() => {
                                  hanldePostCategoryClick(postCategory)
                                }}
                              >
                                <p className="title !text-white">{postCategory?.name}</p>
                              </div>
                            </div>
                          ) : null
                        })}
                      </ScrollContainer>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* dropdown menu */}
          <div
            className={classNames(
              'absolute z-40 left-0 right-0 transition-opacity ease-in-out duration-200',
              currentCategoryId ? 'flex' : 'hidden'
            )}
          >
            <CategoryNavDropDownMenu
              parent_category_id={currentCategoryId}
              isMinorCategory={isCategoryMinor}
              className="transition-opacity ease-in-out duration-200"
              onClose={() => {
                setCurrentCategoryId(undefined)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
