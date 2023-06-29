import { isArrayHasValue } from '@/helper'
import { selectPreviewImageUrl, setPreviewImageUrl } from '@/store'
import { ImageId } from '@/types'
import classNames from 'classnames'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'
import { CustomImage } from '../customImage'
import { ImageShower } from '../imageShower'

interface IProductImage {
  images_ids?: ImageId[]
  representation_image: ImageId
  type: 'modal' | 'detail' | 'variation'
  isStock?: boolean
  className?: string
}

export const ProductImg = ({
  type,
  className,
  representation_image,
  images_ids = [],
}: IProductImage) => {
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
                      <CustomImage
                        src={img?.image_url}
                        className="rounded-md w-[440px] h-[440px] mx-auto"
                        imageClassName="rounded-md object-cover w-[440px] h-[440px] aspect-1 mx-auto"
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
                <CustomImage
                  src={img?.image_url}
                  className="rounded-lg h-[64px]"
                  imageClassName="rounded-lg aspect-1 object-cover h-[64px]"
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
