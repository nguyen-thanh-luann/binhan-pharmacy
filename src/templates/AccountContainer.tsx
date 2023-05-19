import { AccountNav } from '@/components'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface AccountContainerProps {
  children: ReactNode
  className?: string
}

export const AccountContainer = ({children, className}: AccountContainerProps) => {
  return (
    <div className={twMerge(classNames(`flex gap-24 mb-38 min-h-[60vh]`, className))}>
      <div className="w-[200px] min-w-[200px] hidden md:block">
        <AccountNav className="sticky top-header_group_height shadow-shadow-1 rounded-[10px]" />
      </div>

      <div className="flex-1 relative max-w-[100vw]">{children}</div>
    </div>
  )
}
