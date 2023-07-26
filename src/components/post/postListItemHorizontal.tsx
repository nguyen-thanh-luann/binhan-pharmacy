import { generateProductSlug } from '@/helper'
import { Post } from '@/types'
import classNames from 'classnames'
import moment from 'moment'
import { useRouter } from 'next/router'
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
  onClick: onExternalClick,
}: PostItemProps) => {

  const router = useRouter()

  const categoryTag = data?.categories?.[data?.categories?.length - 1]


  return (
    <div
      className={twMerge(
        classNames(`group rounded-[10px] bg-white animate-fade duration-200`, className)
      )}
    >
      <div className="flex gap-12">
        <div className="w-fit" onClick={() => onExternalClick?.(data)}>
          <Image
            src={data?.thumbnail?.thumbnail_url || ''}
            imageClassName={classNames(
              'object-cover aspect-1 rounded-[10px] hover:scale-110 duration-200 ease-in-out h-[150px] w-[150px]',
              imageClassName,
              onExternalClick ? 'cursor-pointer' : ''
            )}
            className={classNames('overflow-hidden rounded-[10px] mb-12', selfImageClassName)}
          />
        </div>

        <div className="flex-1 p-8">
          <p
            onClick={() => onExternalClick?.(data)}
            className={classNames(
              'text-text-color font-bold text-md leading-9 line-clamp-2 hover:text-primary duration-200 ease-in-out mb-8',
              titleClassName,
              onExternalClick ? 'cursor-pointer' : ''
            )}
          >
            {data?.title}
          </p>

          <div className="mb-8 flex gap-8 overflow-scroll scrollbar-hide">
            {/* {data?.categories?.map((category) => (
              <PostCategoryTag data={category?.category_name} onClick={() => {
                 router.push({
                   pathname: '/post-list',
                   query: {
                     ...router.query,
                     category_id: generateProductSlug(category.category_name, category.category_id),
                   },
                 })
              }} />
            ))} */}

            {categoryTag && (
              <PostCategoryTag
                data={categoryTag?.category_name}
                onClick={() => {
                  router.push({
                    pathname: '/post-list',
                    query: {
                      ...router.query,
                      category_id: generateProductSlug(
                        categoryTag.category_name,
                        categoryTag.category_id
                      ),
                    },
                  })
                }}
              />
            )}
          </div>

          <p
            className={classNames(
              'text-text-color text-base leading-9 line-clamp-2 duration-200 ease-in-out',
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
