import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { usePrimaryPostCategory } from '@/hooks'
import classNames from 'classnames'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { twMerge } from 'tailwind-merge'
import { PostItemLoading } from '../post'
import { HomePosts } from './homePosts'

interface HomePostListProps {
  className?: string
}

export const HomePostsList = ({ className }: HomePostListProps) => {
  const { data: postCategoryList, isValidating } = usePrimaryPostCategory({
    key: `${SWR_KEY.get_parent_post_category_list}`,
    params: {},
  })

  if (isValidating) {
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
      {isArrayHasValue(postCategoryList) ? (
        <div>
          {postCategoryList?.map((postCategory) => {
            if (postCategory?.role !== 'npp') {
              return (
                <HomePosts
                  key={postCategory?.id}
                  postCategory={postCategory}
                  className="mb-12 last:mb-0"
                />
              )
            }
            return null
          })}
        </div>
      ) : null}
    </div>
  )
}
