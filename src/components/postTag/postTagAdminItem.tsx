import { TagIcon } from '@/assets'
import { PostTag } from '@/types'
import classNames from 'classnames'
import React from 'react'
import Switch from 'react-switch'

interface PostTagAdminItemProps {
  data: PostTag
  className?: string
  labelClassName?: string
  onEdit?: (data: PostTag) => void
  onChangeActive?: (data: PostTag) => void
}

export const PostTagAdminItem = ({
  data,
  className,
  labelClassName,
  onEdit,
  onChangeActive,
}: PostTagAdminItemProps) => {
  return (
    <div
      className={classNames('relative border border-gray-200 p-8 rounded-md  min-w-fit', className)}
    >
      <div
        onClick={() => {
          onEdit?.(data)
        }}
        className="mr-12 cursor-pointer"
      >
        <div className="flex items-center">
          <TagIcon className="text-text-color w-[20px] h-[20px]" />

          <p className={classNames('ml-8 text-md text-text-color line-clamp-2', labelClassName)}>
            {data?.content}
          </p>
        </div>
        <div className="flex items-center">
          <div
            className={classNames(data?.active ? 'bg-green' : 'bg-gray', 'w-12 h-12 rounded-full')}
          ></div>
          <p className="text-base text-text-color ml-8 line-clamp-1">{`${
            data?.active ? 'Hiển thị trên web' : 'Không hiển thị trên web'
          }`}</p>
        </div>
      </div>

      <div onClick={() => {}} className="absolute top-12 right-12 cursor-pointer">
        <Switch
          onChange={() => {
            onChangeActive?.(data)
          }}
          checked={data?.active}
        />
      </div>
    </div>
  )
}
