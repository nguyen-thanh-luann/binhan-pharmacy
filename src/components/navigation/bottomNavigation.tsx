import { bottomNavData } from '@/data'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface BottomNavigationProps {
  className?: string
}

export const BottomNavigation = ({ className }: BottomNavigationProps) => {
  const router = useRouter()
  return (
    <div
      className={twMerge(
        classNames(
          'h-bottom_nav_height bg-white border-t border-gray-100 flex fixed bottom-0 left-0 right-0 md:hidden z-90',
          className
        )
      )}
    >
      {bottomNavData.map((item, index) => {
        const isActive = item?.path === router.pathname

        return (
          <div
            key={index}
            className={classNames(
              'flex-1 flex flex-col items-center justify-center cursor-pointer',
              isActive ? 'text-primary' : ''
            )}
            onClick={() => {
              router.push(item.path)
            }}
          >
            <div className={classNames('mb-4', isActive ? 'text-primary' : 'text-text-color')}>
              {item.icon}
            </div>
            <p
              className={classNames(
                'text-sm text-text-color',
                isActive ? 'text-primary' : 'text-text-color'
              )}
            >
              {item.title}
            </p>
          </div>
        )
      })}
    </div>
  )
}
