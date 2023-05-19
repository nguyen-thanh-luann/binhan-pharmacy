import { Banner } from '@/types'
import { Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { CustomImage } from '../customImage'

interface HomeBannerProps {
  isLoading?: boolean
  banners: Banner[] | null
}

export const HomeBanner = ({ banners, isLoading }: HomeBannerProps) => {
  
  if (!isLoading && banners === null) return null

  return (
    <div>
      {isLoading ? (
        <div className="animate-pulse bg-gray-200 aspect-w-3 aspect-h-1"></div>
      ) : banners !== null ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={1}
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
        >
          <div>
            {banners.map((banner, index) => (
              <SwiperSlide key={index}>
                <div className="">
                  <CustomImage
                    // src={`${banners?.[0]?.banner_cloud_storage_id?.url}`}
                    src={`${banner?.banner_cloud_storage_id?.url || ''}`}
                    alt="banner"
                    imageClassName="object-cover w-full aspect-[3/1] md:aspect-[4/1]"
                  />
                </div>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      ) : (
        <div className="animate-pulse bg-gray-200 aspect-w-3 aspect-h-1"></div>
      )}
    </div>
  )
}
