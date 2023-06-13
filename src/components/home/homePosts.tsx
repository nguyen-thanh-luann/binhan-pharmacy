import { NotebookIconOutline } from '@/assets'
import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { usePostList, useUser } from '@/hooks'
import { Post, PostCategory } from '@/types'
import classNames from 'classnames'
import { Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'
import { PostItem, PostItemLoading } from '../post'
import { HomeSlide } from './homeSlide'

interface HomePostsProps {
  className?: string
  postCategory?: PostCategory
}

export const HomePosts = ({ className, postCategory }: HomePostsProps) => {
  const { userInfo } = useUser({ shouldFetch: false })

  const { data: postList, isValidating: loadingPostList } = usePostList({
    key: `${SWR_KEY.get_post_list}_${userInfo?.account?.partner_id}`,
  })

  if (loadingPostList) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 my-32">
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
          className="md:p-24"
          title={postCategory?.name || 'Tin tức'}
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
              {postList
                ?.filter((post) => post?.role !== 'npp')
                ?.map((post: Post) => (
                  <SwiperSlide key={post.id}>
                    <PostItem data={post} parent_category={postCategory?.id} />
                  </SwiperSlide>
                ))}
            </div>
          </Swiper>
        </HomeSlide>
      ) : null}
    </div>
  )
}
