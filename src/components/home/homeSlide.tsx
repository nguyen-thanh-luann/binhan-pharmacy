import classNames from 'classnames'
import { ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

interface HomeSlideProps {
  children: ReactElement
  isLoading?: boolean
  title?: string
  icon?: JSX.Element
  rightSection?: JSX.Element
  className?: string
  sectionClassName?: string
  iconClassName?: string
  titleClassName?: string
}

export const HomeSlide = ({
  children,
  className,
  title,
  icon,
  rightSection,
  sectionClassName,
  iconClassName,
  titleClassName,
}: HomeSlideProps) => {
  return (
    <div className={twMerge(classNames('', className))}>
      <div className={twMerge(classNames('flex flex-col md:flex-row md:justify-between md:items-center gap-12 mb-24', sectionClassName))}>
        <div className="flex items-center">
          <div className={twMerge(classNames('mr-12', iconClassName))}>{icon}</div>
          <p
            className={twMerge(
              classNames('text-text-color font-bold text-xl', titleClassName)
            )}
          >
            {title}
          </p>
        </div>

        <div className='md:max-w-[60%]'>{rightSection}</div>
      </div>
      {children}
    </div>
  )
}
