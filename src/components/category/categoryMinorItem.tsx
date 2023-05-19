import { empty } from '@/assets'
import { API_URL } from '@/constants'
import { CategoryMinor } from '@/types'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { Image } from '../image'

interface DropDownCategoryMinorItemProps {
  data: CategoryMinor
  className?: string
  iconClassName?: string
  labelClassName?: string
  isActive?: boolean
  activeClassName?: string
  activeLabelClassName?: string
  onClick?: (data: CategoryMinor) => void
}

export const CategoryMinorItem = ({
  data,
  className,
  iconClassName,
  labelClassName,
  isActive,
  activeClassName,
  activeLabelClassName,
  onClick: onExternalClick
}: DropDownCategoryMinorItemProps) => {
  return (
    <div
      onClick={() => onExternalClick?.(data)}
      className={twMerge(
        classNames(
          `flex items-center border border-gray-200 w-fit p-10 rounded-full cursor-pointer hover:border-primary duration-200 ${isActive ? activeClassName : ''}`,
          className
        )
      )}
    >
      <Image
        src={data?.icon ? `${API_URL}${data?.icon || ''}` : empty}
        imageClassName={twMerge(classNames(`w-32 h-32 mr-10`, iconClassName))}
      />
      <p
        className={twMerge(
          classNames(
            `text-text-color font-medium text-md leading-9 ${isActive ? activeLabelClassName : ''}`,
            labelClassName
          )
        )}
      >
        {data?.category_name}
      </p>
    </div>
  )
}
