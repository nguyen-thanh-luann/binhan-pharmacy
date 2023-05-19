import { VisceraAttribute } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { CustomImage } from '../customImage'

interface VisceraAttributeItemProps {
  className?: string
  data: VisceraAttribute
  onClick?: (props: VisceraAttribute) => void
}

export const VisceraAttributeItem = ({ data, className, onClick }: VisceraAttributeItemProps) => {
  return (
    <div
      onClick={() => onClick?.(data)}
      className={twMerge(classNames('rounded-[10px] flex flex-col p-12', className))}
    >
      <div className="rounded-[10px] mb-12 h-[96px] w-[96px] mx-auto">
        <CustomImage
          src={data?.value_icon?.url}
          imageClassName="w-[96px] h-[96px] object-cover aspect-1 rounded-[10px]"
        />
      </div>
      <p className="line-clamp-2 text-text-color text-md text-center h-[48px]">
        {data?.value_name}
      </p>
    </div>
  )
}
