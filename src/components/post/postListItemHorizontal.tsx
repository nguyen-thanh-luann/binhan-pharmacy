import { Post } from '@/types'
import classNames from 'classnames'
import moment from 'moment'
import { twMerge } from 'tailwind-merge'
import { Image } from '../image'
import { PostCategoryTag } from './postCategoryTag'

interface PostItemProps {
  data: Post
  className?: string
  imageClassName?: string
  selfImageClassName?: string
  titleClassName?: string
  shortContentClassName?: string
  onClick?: (data: Post) => void
}

export const PostListItemHorizontal = ({
  data,
  className,
  imageClassName,
  selfImageClassName,
  titleClassName,
  shortContentClassName,
  onClick: OnExternalClick,
}: PostItemProps) => {
  return (
    <div
      className={twMerge(
        classNames(
          `group rounded-[10px] bg-white animate-fade duration-200`,
          className,
          OnExternalClick ? 'cursor-pointer' : ''
        )
      )}
    >
      <div onClick={() => OnExternalClick?.(data)} className="flex gap-12">
        <div className="w-fit">
          <Image
            src={data?.thumbnail?.thumbnail_url || ''}
            imageClassName={classNames(
              'object-cover aspect-1 rounded-[10px] hover:scale-110 duration-200 ease-in-out h-[150px] w-[150px]',
              imageClassName
            )}
            className={classNames('overflow-hidden rounded-[10px] mb-12', selfImageClassName)}
          />
        </div>

        <div className="flex-1 p-8">
          <p
            className={classNames(
              'text-text-color font-bold text-md leading-9 line-clamp-2 group-hover:text-primary duration-200 ease-in-out mb-8',
              titleClassName
            )}
          >
            {data?.title}
          </p>

          <div className="mb-8 flex gap-8 overflow-scroll scrollbar-hide">
            {data?.categories?.map((category) => (
              <PostCategoryTag data={category?.category_name} />
            ))}
          </div>

          <p
            className={classNames(
              'text-text-color text-base leading-9 line-clamp-2 group-hover:text-primary duration-200 ease-in-out',
              shortContentClassName
            )}
          >
            {data?.short_content}
          </p>

          <p className="text-gray text-sm">{moment(data?.created_at).format('DD/MM/YYYY')}</p>
        </div>
      </div>
    </div>
  )
}
