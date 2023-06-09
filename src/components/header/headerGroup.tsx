import { twMerge } from 'tailwind-merge'
import { Header } from './header'
import { CategoryNav } from '../category/categoryNav'
import classNames from 'classnames'

interface HeaderGroupProps {
  className?: string
}

export const HeaderGroup = ({ className }: HeaderGroupProps) => {
  return (
    <div className={twMerge(classNames(`relative h-header_group_height`, className))}>
      <div className={`fixed top-0 left-0 right-0 z-50`}>
        <Header />
        <CategoryNav />
      </div>
    </div>
  )
}
