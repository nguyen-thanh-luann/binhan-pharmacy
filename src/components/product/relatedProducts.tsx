import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'

import { DEFAULT_LIMIT_PRODUCT, SWR_KEY } from '@/constants'
import { useProductByCategoryMajor } from '@/hooks'
import { Product } from '@/types'
import { Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { HomeSlide } from '../home'
import { ProductItem } from './productItem'
import { ProductItemLoading } from './productItemLoading'

interface ViewedProductsProps {
  className?: string
  category_id: number
}

export const RelatedProducts = ({ className, category_id }: ViewedProductsProps) => {

  const { response, isValidating } = useProductByCategoryMajor({
    key: `${SWR_KEY.get_product_list_by_category_major}_${category_id}`,
    params: {
      category_id,
      limit: DEFAULT_LIMIT_PRODUCT,
    },
  })

  if (isValidating) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-12">
        {Array.from({ length: 5 }).map((_, index) => (
          <ProductItemLoading key={index} />
        ))}
      </div>
    )
  }

  if (response?.product_data?.length === 0) return null

  return (
    <div className={twMerge(classNames(`bg-white p-12`, className))}>
      <HomeSlide title="Sản phẩm tương tự">
        <Swiper
          slidesPerView={5}
          spaceBetween={12}
          slidesPerGroup={1}
          navigation={true}
          allowTouchMove={false}
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
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
        >
          <div>
            {response?.product_data.map((product: Product) => (
              <div key={product?.product_id} className="">
                <SwiperSlide key={product.product_id}>
                  <ProductItem data={product} className="relative" />
                </SwiperSlide>
              </div>
            ))}
          </div>
        </Swiper>
      </HomeSlide>
    </div>
  )
}
