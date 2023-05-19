import classNames from 'classnames'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface ProductDetailPageContainerProps {
  children: ReactNode
  leftChildren?: ReactNode
  className?: string
}

export const ProductDetailPageContainer = ({
  children,
  leftChildren,
  className,
}: ProductDetailPageContainerProps) => {
  return (
    <div className={twMerge(classNames(`flex gap-24`, className))}>
      {leftChildren ? <div className="w-[300px] hidden md:block">{leftChildren}</div> : null}
      

      <div className="flex-1 bg-white overflow-scroll scrollbar-hide">{children}</div>
    </div>
  )
}
