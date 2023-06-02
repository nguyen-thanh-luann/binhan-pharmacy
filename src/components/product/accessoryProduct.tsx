import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'

import { SWR_KEY } from '@/constants'
import { useAccessoryProduct } from '@/hooks'
import { Product } from '@/types'
import { Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { HomeSlide } from '../home'
import { ProductItem } from './productItem'
import { ProductItemLoading } from './productItemLoading'

interface AccessoryProductProps {
  className?: string
  product_id: number
}

export const AccessoryProduct = ({ className, product_id }: AccessoryProductProps) => {
  const { products, isValidating } = useAccessoryProduct({
    key: `${SWR_KEY.get_accessory_product}_${product_id}`,
    params: {
      product_id,
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

  if (!products || products?.length === 0) return null

  return (
    <div className={twMerge(classNames(`bg-white p-12`, className))}>
      <HomeSlide title="Sản phẩm mua cùng">
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
            {products.map((product: Product) => (
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
