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
  imagePhotoClassName?: string
  titleClassName?: string
  shortContentClassName?: string
  onClick?: (data: Post) => void
}

export const PostListItemVertical = ({
  data,
  className,
  imageClassName,
  imagePhotoClassName,
  titleClassName,
  shortContentClassName,
  onClick: onExternalClick,
}: PostItemProps) => {
  const router = useRouter()

  return (
    <div
      className={twMerge(
        classNames(
          `group rounded-[10px] overflow-hidden bg-white animate-fade duration-200`,
          className
        )
      )}
    >
      <div>
        <Image
          onClick={() => onExternalClick?.(data)}
          src={data?.thumbnail?.thumbnail_url || ''}
          imageClassName={classNames(
            'object-cover aspect-1 rounded-[10px] hover:scale-110 duration-200 ease-in-out h-[390px]',
            imageClassName,
            onExternalClick ? 'cursor-pointer' : ''
          )}
          className={classNames(
            'h-[390px] overflow-hidden rounded-[10px] mb-12',
            imagePhotoClassName
          )}
        />

        <div className="p-12">
          <p className="text-gray text-sm">{moment(data?.created_at).format('DD/MM/YYYY')}</p>

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
            {data?.categories?.map((category) => (
              <PostCategoryTag
                data={category?.category_name}
                onClick={() => {
                  router.push({
                    pathname: '/post-list',
                    query: {
                      ...router.query,
                      category_id: generateProductSlug(
                        category.category_name,
                        category.category_id
                      ),
                    },
                  })
                }}
              />
            ))}
          </div>

          <p
            className={classNames(
              'text-text-color text-base leading-9 line-clamp-2 duration-200 ease-in-out',
              shortContentClassName
            )}
          >
            {data?.short_content}
          </p>
        </div>
      </div>
    </div>
  )
}
