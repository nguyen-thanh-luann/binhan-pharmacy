import classNames from 'classnames'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface PostListPageContainerProps {
  children: ReactNode
  leftChildren?: ReactNode
  className?: string
}

export const PostListPageContainer = ({
  children,
  leftChildren,
  className,
}: PostListPageContainerProps) => {
  return (
    <div className={twMerge(classNames(`flex gap-24`, className))}>
      {leftChildren ? <div className="w-[300px] hidden md:block">{leftChildren}</div> : null}

      <div className="flex-1 overflow-scroll scrollbar-hide">{children}</div>
    </div>
  )
}
