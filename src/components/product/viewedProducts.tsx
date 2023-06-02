import { selectViewedProducts } from '@/store'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { twMerge } from 'tailwind-merge'

import { Product } from '@/types'
import { Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { HomeSlide } from '../home'
import { ProductItem } from './productItem'

interface ViewedProductsProps {
  className?: string
}

export const ViewedProducts = ({ className }: ViewedProductsProps) => {
  const viewedProducts = useSelector(selectViewedProducts)
  
  if (!viewedProducts || viewedProducts?.length === 0) return null


  return (
    <div className={twMerge(classNames(`bg-white p-12`, className))}>
      <HomeSlide title="Sản phẩm đã xem">
        <Swiper
          slidesPerView={5}
          spaceBetween={12}
          slidesPerGroup={1}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          allowTouchMove={false}
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
            {viewedProducts.map((product: Product) => (
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
