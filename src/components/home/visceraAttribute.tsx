import { SWR_KEY } from '@/constants'
import { useViceraAttribute } from '@/hooks'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'

import { NotebookIconOutline } from '@/assets'
import { isArrayHasValue } from '@/helper'
import { VisceraAttribute as IVisceraAttribute, VisceraAttributeRes } from '@/types'
import { useRouter } from 'next/router'
import { Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { VisceraAttributeItem, VisceraAttributeItemLoading } from '../attribute'
import { HomeSlide } from './homeSlide'
import { CustomImage } from '../customImage'

interface VisceraAttributeProps {
  className?: string
}

export const VisceraAttribute = ({ className }: VisceraAttributeProps) => {
  const router = useRouter()
  const { data, isValidating } = useViceraAttribute({
    key: `${SWR_KEY.get_viscera_attribute}`,
  })

  const viewAttribute: VisceraAttributeRes | undefined = data?.[0]

  if (isValidating) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
        {Array.from({ length: 6 }).map((_, index) => (
          <VisceraAttributeItemLoading key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className={twMerge(classNames('', className))}>
      {isArrayHasValue(data) ? (
        <HomeSlide
          title={data?.[0]?.attribute_name || 'Danh mục sản phẩm'}
          icon={
            data?.[0]?.attribute_icon?.url ? (
              <CustomImage
                src={data?.[0]?.attribute_icon?.url || ''}
                imageClassName="w-[32px] h-[32px] object-cover rounded-full"
              />
            ) : (
              <NotebookIconOutline className="text-primary w-[34px] h-[34px]" />
            )
          }
          className="bg-white rounded-[10px] mb-24 md:p-24"
          sectionClassName=""
        >
          <Swiper
            slidesPerView={6}
            spaceBetween={12}
            slidesPerGroup={1}
            navigation={true}
            pagination={{
              clickable: true,
            }}
            loop={true}
            modules={[Pagination, Navigation]}
            breakpoints={{
              300: {
                slidesPerView: 2,
              },
              900: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 6,
              },
            }}
          >
            <div>
              {data &&
                data?.[0]?.value_ids.map((att: IVisceraAttribute, index) => (
                  <SwiperSlide key={att.value_id}>
                    <VisceraAttributeItem
                      data={att}
                      className={classNames(
                        'cursor-pointer',
                        index % 2 === 0 ? 'bg-att-viscera-even-bg' : 'bg-att-viscera-odd-bg'
                      )}
                      onClick={() => {
                        router.push(
                          `/search?attributes_${viewAttribute?.attribute_id}=${att.value_id}`
                        )
                      }}
                    />
                  </SwiperSlide>
                ))}
            </div>
          </Swiper>
        </HomeSlide>
      ) : null}
    </div>
  )
}
