import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useCategoryList, useCategoryMinorList } from '@/hooks'
import { Category } from '@/types'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { CategoryItem } from '.'

import { Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { CategoryItemLoading } from './categoryItemLoading'

interface CategoryNavChildsProps {
  parent_category_id?: number
  className?: string
  isMinorCategory?: boolean
  onChildCategoryClick?: (data: Category) => void
}

export const CategoryNavChilds = ({
  parent_category_id,
  className,
  onChildCategoryClick,
  isMinorCategory = false,
}: CategoryNavChildsProps) => {
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
    <div className={twMerge(classNames(`bg-white w-full p-12`, className))}>
      {categoryListLoading || categoryMinorListLoading ? (
        <div className="flex gap-8">
          {Array?.from({ length: 4 }).map((_, index) => (
            <CategoryItemLoading key={index}/>
          ))}
        </div>
      ) : isArrayHasValue(categoryList) || isArrayHasValue(categoryMinorList) ? (
        <div className="categoryNavChilds">
          <Swiper
            slidesPerView={3.8}
            spaceBetween={12}
            slidesPerGroup={2}
            navigation={true}
            pagination={{
              clickable: true,
            }}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination, Navigation]}
          >
            <div>
              {categoryList?.map((category) => (
                <SwiperSlide key={category.category_id}>
                  <CategoryItem
                    onClick={() => onChildCategoryClick?.(category)}
                    data={category}
                    className="w-full cursor-pointer border border-gray-200 rounded-full p-10 hover:border-primary duration-200"
                    labelClassName="line-clamp-1"
                  />
                </SwiperSlide>
              ))}

              {categoryMinorList?.map((category) => (
                <SwiperSlide key={category.category_id}>
                  <CategoryItem
                    onClick={() => onChildCategoryClick?.(category)}
                    data={category}
                    className="w-full cursor-pointer border border-gray-200 rounded-full p-10 hover:border-primary duration-200"
                    labelClassName="line-clamp-1"
                  />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
      ) : null}
    </div>
  )
}
