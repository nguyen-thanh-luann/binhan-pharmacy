import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { productAPI } from '@/services'
import { Product } from '@/types'
import classNames from 'classnames'
import { Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import useSWR from 'swr'
import { twMerge } from 'tailwind-merge'
import { NotFound } from '../notFound'
import { ProductItem, ProductItemLoading } from '../product'

interface ProductsOnNavCategoryProps {
  category_id: number
  className?: string
  category_type: 'major' | 'minor'
  shouldFetch?: boolean
}

export const ProductsOnNavCategory = ({
  category_id,
  className,
  category_type,
  shouldFetch = true,
}: ProductsOnNavCategoryProps) => {
  const { data, isValidating } = useSWR(
    `${
      category_type === 'major'
        ? `${SWR_KEY.get_product_list_by_category_major}_${category_id}`
        : `${SWR_KEY.get_product_list_by_attribute_minor}_${category_id}`
    }`,
    !shouldFetch
      ? null
      : category_type === 'major'
      ? () => productAPI.getProductsByCategoryMajor({ category_id }).then((res) => res?.data)
      : () => productAPI.getProductsByCategoryMinor({ category_id }).then((res) => res?.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return (
    <div className={twMerge(classNames(``, className))}>
      {isValidating || isArrayHasValue(data?.product_data) ? (
        <Swiper
          slidesPerView={4}
          spaceBetween={12}
          slidesPerGroup={1}
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
          breakpoints={{
            300: {
              slidesPerView: 2,
            },
            900: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          <div>
            {isValidating
              ? Array?.from({ length: 4 }).map((_, index) => (
                  <SwiperSlide key={index}>
                    <ProductItemLoading />
                  </SwiperSlide>
                ))
              : data?.product_data?.map((product: Product) => (
                  <SwiperSlide key={product.product_id}>
                    <ProductItem data={product} />
                  </SwiperSlide>
                ))}
          </div>
        </Swiper>
      ) : (
        <div>
          <NotFound notify="Sản phẩm đang được cập nhật!" />
        </div>
      )}
    </div>
  )
}
