import { useClickOutside, useModal } from '@/hooks'
import classNames from 'classnames'
import React, { useRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type PopoverProps = {
  children: JSX.Element
  content: JSX.Element
  contentClassName?: string
  type?: 'hover' | 'click'
  placement?: "top" | "bottom"
}

export const Popover = ({ children, content, contentClassName, type = 'click', placement = "bottom" }: PopoverProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { closeModal, toggle, visible } = useModal()
  useClickOutside([ref], closeModal)


  const renderContent = () => {
    return (
      <div
        className={twMerge(
          classNames(
            'absolute p-4 bg-white overflow-hidden shadow-lg',
            {
              'hidden group-hover:block': type === 'hover',
            },
            contentClassName
          )
        )}
      >
        {content}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative group w-fit">
      {(type === 'hover' || visible) && placement === 'top' ? (
        renderContent()
      ) : null}

      <div onClick={type ? toggle : undefined} className="cursor-pointer">
        {children}
      </div>

      {(type === 'hover' || visible) && placement === 'bottom' ? (
        renderContent()
      ) : null}
    </div>
  )
}
