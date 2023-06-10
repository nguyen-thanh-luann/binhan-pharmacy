import { AccountNav, AccountNavMobile } from '@/components'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface AccountContainerProps {
  children: ReactNode
  className?: string
}

export const AccountContainer = ({ children, className }: AccountContainerProps) => {
  return (
    <div className={twMerge(classNames(`flex flex-col md:flex-row gap-24 mb-38 min-h-[80vh]`, className))}>
      <div className="w-fit min-w-[230px] hidden md:block">
        <AccountNav className="sticky top-header_group_height shadow-shadow-1 rounded-[10px]" />
      </div>

      <div className="flex-1 relative max-w-[100vw]">{children}</div>

      <div className="block md:hidden">
        <AccountNavMobile />
      </div>
    </div>
  )
}
