import { RightIcon, TimesIcon, logoLg } from '@/assets'
import classNames from 'classnames'
import Link from 'next/link'
import { useState } from 'react'

import { twMerge } from 'tailwind-merge'
import { Image } from '../image'
import { LeftNavCategoryDropDown } from '../category'
import { useCategoryList, useCategoryMinorList, usePrimaryPostCategory, useUser } from '@/hooks'
import { SWR_KEY } from '@/constants'
import { Spinner } from '../spinner'
import { isArrayHasValue, isDrugStore } from '@/helper'
import { useRouter } from 'next/router'
import { PostCategory } from '@/types'
import { toast } from 'react-hot-toast'
interface LeftNavigationProps {
  className?: string
  onClose?: () => void
}

export const LeftNavigation = ({ className, onClose }: LeftNavigationProps) => {
  const [currentCategoryId, setCurrentCategoryId] = useState<number>()
  const [isCategoryMinor, setIsCategoryMinor] = useState<boolean>(false)
  const router = useRouter()
  const { userInfo } = useUser({ shouldFetch: false })

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

  const handleCategoryClick = (id: number) => {
    if (id === currentCategoryId) {
      setCurrentCategoryId(undefined)
      return
    }
    setCurrentCategoryId(id)
  }

  const handleChildCategoryClick = (id: number, type: 'category' | 'minor_category') => {
    if (type === 'category') {
      router.push(`/search/?category_${id}=${id}`)
    } else {
      router.push(`/search/?minor_category_${id}=${id}`)
    }
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
    <div className={twMerge(classNames(`h-full`, className))}>
      <div className="flex-between p-12">
        <div>
          <Link href="/">
            <Image src={logoLg} className="w-[130px] h-[40px]" />
          </Link>
        </div>

        <div
          onClick={onClose}
          className="text-base text-gray-400 cursor-pointer hover:text-gray duration-200 ease-in-out "
        >
          <TimesIcon className="" />
        </div>
      </div>

      <div className="">
        {categoryListLoading || categoryMinorListLoading ? (
          <div className="flex-center my-24">
            <Spinner />
          </div>
        ) : isArrayHasValue(categoryList || categoryMinorList) ? (
          <div>
            {categoryList?.map((category) => (
              <div key={category?.category_id}>
                {/* parent category */}
                <div
                  onClick={() => {
                    handleCategoryClick(category?.category_id)
                    setIsCategoryMinor(false)
                  }}
                  className="flex-between my-auto cursor-pointer w-full p-12 border-b border-gray-100"
                >
                  <p className="text-md text-text-color font-bold line-clamp-1">
                    {category?.category_name}
                  </p>
                  <div className="w-[22px] h-[22px] flex-center duration-200 ease-in-out">
                    <RightIcon
                      className={`text-sm text-text-color duration-200 ease-in-out ${
                        currentCategoryId === category.category_id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* childrent category */}
                <div
                  className={
                    currentCategoryId === category?.category_id ? `flex animate-fade` : `hidden`
                  }
                >
                  <LeftNavCategoryDropDown
                    handleClick={(id) => {
                      handleChildCategoryClick(id, 'category')
                    }}
                    parent_category_id={currentCategoryId}
                  />
                </div>
              </div>
            ))}

            {categoryMinorList?.map((category) => (
              <div key={category?.category_id}>
                {/* parent category */}
                <div
                  onClick={() => {
                    handleCategoryClick(category?.category_id)
                    setIsCategoryMinor(!isCategoryMinor)
                  }}
                  className="flex-between my-auto cursor-pointer w-full p-12 border-b border-gray-100"
                >
                  <p className="text-md text-text-color font-bold line-clamp-1">
                    {category?.category_name}
                  </p>
                  <div className="w-[22px] h-[22px] flex-center duration-200 ease-in-out">
                    <RightIcon
                      className={`text-sm text-text-color duration-200 ease-in-out ${
                        currentCategoryId === category.category_id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* childrent category */}
                <div
                  className={`${
                    currentCategoryId === category?.category_id ? `flex animate-fade` : `hidden`
                  }`}
                >
                  <LeftNavCategoryDropDown
                    parent_category_id={currentCategoryId}
                    isMinorCategory={isCategoryMinor}
                    handleClick={(id) => {
                      handleChildCategoryClick(id, 'minor_category')
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div
          onClick={() => {
            router.push('/drug-stores')
          }}
          className="flex-between my-auto cursor-pointer w-full p-12 border-b border-gray-100"
        >
          <p className="text-md text-text-color font-bold line-clamp-1">Điểm bán</p>
        </div>

        {postCategoryLoading ? (
          <div className="flex-center my-24">
            <Spinner />
          </div>
        ) : isArrayHasValue(postCategoryList) ? (
          <div>
            {postCategoryList?.map((postCategory) => {
              return postCategory?.role !== 'npp' ? (
                <div
                  className="flex-between my-auto cursor-pointer w-full p-12 border-b border-gray-100"
                  key={postCategory.id}
                  onClick={() => {
                    hanldePostCategoryClick(postCategory)
                  }}
                >
                  <p className="text-md text-text-color font-bold line-clamp-1">
                    {postCategory?.name}
                  </p>
                </div>
              ) : null
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
