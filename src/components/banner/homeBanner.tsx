import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useBanner } from '@/hooks'
import classNames from 'classnames'
import { Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'
import { CustomImage } from '../customImage'

interface HomeBannerProps {
  className?: string
}

export const HomeBanner = ({ className }: HomeBannerProps) => {

  const { data: bannerList, isValidating: bannerListLoading } = useBanner({
    key: `${SWR_KEY.get_main_banner}`,
    params: {
      banner_size: '4:1',
    },
  })


  if (!bannerListLoading && !bannerList ) return null

  return (
    <div className={twMerge(classNames('', className))}>
      {bannerListLoading ? (
        <div className="animate-pulse bg-gray-200 aspect-[2/1] md:aspect-[4/1]"></div>
      ) : isArrayHasValue(bannerList) ? (
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
            {bannerList.map((banner, index) => (
              <SwiperSlide key={index}>
                <div className="">
                  <CustomImage
                    // src={`${banners?.[0]?.banner_cloud_storage_id?.url}`}
                    src={`${banner?.banner_cloud_storage_id?.url || ''}`}
                    alt="banner"
                    imageClassName="object-cover w-full aspect-[2/1] md:aspect-[4/1]"
                  />
                </div>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      ) : (
        <div className="animate-pulse bg-gray-200 aspect-[2/1] md:aspect-[4/1]"></div>
      )}
    </div>
  )
}
