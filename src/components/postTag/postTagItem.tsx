import { TagIcon } from '@/assets'
import { PostTagRes } from '@/types'
import classNames from 'classnames'

interface PostTagItemProps {
  data: PostTagRes
  className?: string
  labelClassName?: string
  onClick?: (data: PostTagRes) => void
}

export const PostTagItem = ({
  data,
  className,
  labelClassName,
  onClick: onExternalClick,
}: PostTagItemProps) => {
  return (
    <div
      onClick={() => {
        onExternalClick?.(data)
      }}
      className={classNames(
        'border border-gray p-4 rounded-md  min-w-fit',
        onExternalClick ? 'cursor-pointer' : '',
        className
      )}
    >
      <div className="flex items-center">
        <TagIcon className="text-text-color w-[18px] h-[18px]" />

        <p className={classNames('ml-8 text-base text-text-color line-clamp-2', labelClassName)}>
          {data?.tag_content}
        </p>
      </div>
    </div>
  )
}
