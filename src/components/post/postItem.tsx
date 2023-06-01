import { generateProductSlug } from '@/helper'
import { Post } from '@/types'
import classNames from 'classnames'
import moment from 'moment'
import { twMerge } from 'tailwind-merge'
import { Image } from '../image'
import Link from 'next/link'

interface PostItemProps {
  data: Post
  className?: string
  imageClassName?: string
  imagePhotoClassName?: string
  titleClassName?: string
  shortContentClassName?: string
}

export const PostItem = ({
  data,
  className,
  imageClassName,
  imagePhotoClassName,
  titleClassName,
  shortContentClassName,
}: PostItemProps) => {
  const postSlug = `/post-detail?slug=${generateProductSlug(data?.title, data?.id)}`

  return (
    <div className={twMerge(classNames(`group rounded-[10px] overflow-hidden`, className))}>
      <Link href={postSlug}>
        <div>
          <Image
            src={data?.thumbnail?.thumbnail_url}
            imageClassName={classNames(
              'object-cover aspect-1 rounded-[10px] hover:scale-110 duration-200 ease-in-out',
              imageClassName
            )}
            className={classNames(
              'h-[210px] overflow-hidden rounded-[10px] mb-12',
              imagePhotoClassName
            )}
          />

          <div className="">
            <p className="text-gray text-sm">{moment(data?.created_at).format('DD/MM/YYYY')}</p>
            <p
              className={classNames(
                'text-text-color font-bold text-md leading-9 line-clamp-2 group-hover:text-primary duration-200 ease-in-out',
                titleClassName
              )}
            >
              {data?.title}
            </p>
            <p
              className={classNames(
                'text-text-color text-base leading-9 line-clamp-2 group-hover:text-primary duration-200 ease-in-out',
                shortContentClassName
              )}
            >
              {data?.short_content}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
