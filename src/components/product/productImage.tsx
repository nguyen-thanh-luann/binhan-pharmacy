import { useState } from 'react'
import { isArrayHasValue, isRemoteImageUrl } from '@/helper'
import { useDispatch, useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { selectPreviewImageUrl, setPreviewImageUrl } from '@/store'
import { Image } from '../image'
import { API_URL } from '@/constants'
import { ImageShower } from '../imageShower'
import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'
import { ImageId } from '@/types'

interface IProductImage {
  images_ids?: ImageId[]
  representation_image: ImageId
  type: 'modal' | 'detail' | 'variation'
  isStock?: boolean
  className?: string
}

export const ProductImg = ({ type, className, representation_image, images_ids = [] }: IProductImage) => {
  const dispatch = useDispatch()
  const [swiper, setSwiper] = useState<any>({})
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const previewImageUrl = useSelector(selectPreviewImageUrl)
  const imageList = [representation_image, ...images_ids]

  return (
    <>
      <div className={twMerge(classNames(`relative ${type === 'modal' ? '' : ''}`, className))}>
        <div className="mb-12">
          <Swiper
            slidesPerView={1}
            loop={false}
            onInit={(ev) => {
              ev.init()
              setSwiper(ev)
            }}
            onSlideChange={(e) => setActiveIndex(e.activeIndex)}
          >
            {isArrayHasValue(imageList)
              ? imageList.map((img, index) => (
                  <SwiperSlide
                    className="cursor-pointer mx-auto"
                    onClick={() => dispatch(setPreviewImageUrl(`${img?.image_url}`))}
                    key={index}
                  >
                    <div>
                      <Image
                        src={
                          isRemoteImageUrl(img?.image_url || '')
                            ? img?.image_url || ''
                            : `${API_URL}${img?.image_url}`
                        }
                        className="rounded-md object-cover w-[440px] h-[440px] aspect-1 mx-auto"
                      />
                    </div>
                  </SwiperSlide>
                ))
              : null}
          </Swiper>
        </div>

        <div className="flex gap-12 overflow-scroll scrollbar-hide">
          {imageList.map((img, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  swiper?.slideTo(index)
                }}
                className={`w-[64px] min-w-[64px] border border-gray-300 rounded-lg cursor-pointer duration-150 ease-in-out ${
                  index === activeIndex ? '!border-primary' : ''
                }`}
              >
                <Image
                  src={
                    isRemoteImageUrl(img?.image_url || '')
                      ? img?.image_url || ''
                      : `${API_URL}${img?.image_url}`
                  }
                  className="rounded-lg object-cover h-[64px]"
                  imageClassName="rounded-lg object-cover"
                />
              </div>
            )
          })}
        </div>

        {previewImageUrl ? <ImageShower url={previewImageUrl} /> : null}
      </div>
    </>
  )
}

export default ProductImg
