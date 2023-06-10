import { PostCategory } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { InputCheckbox } from '../inputs'
import { RightIcon } from '@/assets'

interface PostCategoryOptionProps {
  data: PostCategory
  isChecked: boolean
  isExpand?: boolean
  onCheck: (data: PostCategory) => void
  className?: string
  onExpand?: (data: PostCategory) => void
}

export const PostCategoryOption = ({
  data,
  className,
  isChecked = false,
  isExpand = false,
  onCheck,
  onExpand,
}: PostCategoryOptionProps) => {
  return (
    <div className={classNames('', className)}>
      <div
        onClick={() => onExpand?.(data)}
        className={classNames('flex items-center m-8 justify-between cursor-pointer', className)}
      >
        <div className="flex gap-8">
          <InputCheckbox isChecked={isChecked} onCheck={() => onCheck?.(data)} />
          <p className="text-md">{data?.name}</p>
        </div>

        {data?.children_count > 0 && (
          <div>
            <RightIcon
              className={classNames('text-gray duration-200', isExpand ? 'rotate-90' : '')}
            />
          </div>
        )}
      </div>
    </div>
  )
}
