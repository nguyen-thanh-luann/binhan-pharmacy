import classNames from 'classnames'
import React from 'react'

interface PostCategoryTagProps {
  data: string
  className?: string
  onClick?: () => void
}

export const PostCategoryTag = ({
  data,
  className,
  onClick: onExternalClick,
}: PostCategoryTagProps) => {
  if (!data) return null

  return (
    <div
      onClick={() => onExternalClick?.()}
      className={classNames(
        'border border-primary text-primary rounded-lg w-fit p-2 min-w-[100px] text-center',
        className
      )}
    >
      {data}
    </div>
  )
}
