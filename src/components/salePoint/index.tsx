import { StoreIcon } from '@/assets'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { useRouter } from 'next/router'

interface SalePointProps {
  className?: string
}

export const SalePoint = ({ className }: SalePointProps) => {
  const router = useRouter()
  return (
    <div
      onClick={() => {
        router.push('/drug-stores')
      }}
      className={twMerge(
        classNames(
          `min-w-header_tab_width h-header_tab_height flex p-8 gap-8 rounded-[8px] items-center shadow-shadow-1 cursor-pointer bg-background hover:bg-primary-100 group`,
          className
        )
      )}
    >
      <div className="">
        <StoreIcon className="text-gray w-20 h-20 group-hover:text-primary" />
      </div>

      <div className="hidden md:block">
        <p className="title !text-gray group-hover:!text-primary">Điểm bán</p>
      </div>
    </div>
  )
}
