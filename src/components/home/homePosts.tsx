import { Post } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { PostItem, PostItemLoading } from '../post'
import { isArrayHasValue } from '@/helper'
import { Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { NotebookIconOutline } from '@/assets'
import { HomeSlide } from './homeSlide'
import { usePostList } from '@/hooks'
import { SWR_KEY } from '@/constants'

interface HomePostsProps {
  className?: string
}

export const HomePosts = ({ className }: HomePostsProps) => {
  const { data: postList, isValidating: loadingPostList } = usePostList({
    key: SWR_KEY.get_post_list,
  })

  if (loadingPostList) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {Array.from({ length: 4 }).map((_, index) => (
          <PostItemLoading key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className={twMerge(classNames(`mb-24`, className))}>
      {isArrayHasValue(postList) ? (
        <HomeSlide
          title="Sống khỏe mỗi ngày"
          icon={<NotebookIconOutline className="text-primary w-[34px] h-[34px]" />}
        >
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
              {postList?.map((post: Post) => (
                <SwiperSlide key={post.id}>
                  <PostItem data={post} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </HomeSlide>
      ) : null}
    </div>
  )
}
