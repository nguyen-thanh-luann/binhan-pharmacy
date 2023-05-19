import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface DividerVerticalProps {
  className?: string
}

export const Divider = ({className}: DividerVerticalProps) => {
  return (
    <div className={twMerge(classNames(`border-l border-gray-300 h-[22px] mx-12`, className))}>
    </div>
  )
}
