import { companyIconSm } from '@/assets'
import { API_URL } from '@/constants'
import { isRemoteImageUrl } from '@/helper'
import { Category } from '@/types'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { Image } from '../image'

interface DropDownCategoryItemProps {
  data: Category
  className?: string
  iconClassName?: string
  labelClassName?: string
  isActive?: boolean
  activeClassName?: string
  activeLabelClassName?: string
  onClick?: (data: Category) => void
}

export const CategoryItem = ({
  data,
  className,
  iconClassName,
  labelClassName,
  isActive,
  activeClassName,
  activeLabelClassName,
  onClick: onExternalClick,
}: DropDownCategoryItemProps) => {
  return (
    <div
      onClick={() => onExternalClick?.(data)}
      className={twMerge(
        classNames(`flex items-center ${isActive ? activeClassName : ''}`, className)
      )}
    >
      <Image
        src={
          data?.icon?.url || data?.category_icon?.url
            ? isRemoteImageUrl(data?.icon?.url || data?.category_icon?.url || '')
              ? data?.icon?.url || data?.category_icon?.url
              : `${API_URL}${data?.icon?.url || data?.category_icon?.url || ''}`
            : companyIconSm
        }
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
