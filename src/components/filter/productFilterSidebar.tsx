import { TrashIconOutline } from '@/assets'
import { isObjectHasValue } from '@/helper'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { FilterByAttributeMinor } from './filterByAttributeMinor'
import { FilterByCategory } from './filterByCategory'
import { FilterByCategoryMinor } from './filterByCategoryMinor'
import { FilterByPrice } from './filterByPrice'

interface ProductFilterSidebarProps {
  className?: string
  price_max?: number
  price_min?: number
}

export const ProductFilterSidebar = ({
  className,
  price_max = 0,
  price_min = 0,
}: ProductFilterSidebarProps) => {
  const router = useRouter()

  const showResetFilterBtn = isObjectHasValue(router?.query)

  return (
    <div className={twMerge(classNames(``, className))}>
      {/* filter by category */}
      <div className="bg-white rounded-[10px] shadow-shadow-1 mb-16">
        <p className="text-text-color font-bold text-lg border-b border-gray-200 p-8">
          Danh Mục Dược Phẩm
        </p>

        <div className="p-8">
          <FilterByCategory />

          <FilterByCategoryMinor />
        </div>
      </div>

      {/* filter by attribute */}
      <div>
        <FilterByAttributeMinor />
      </div>

      <div className="mb-16">
        <FilterByPrice price_max={price_max} price_min={price_min} />
      </div>

      <div>
        {showResetFilterBtn ? (
          <Button
            title="Xóa bộ lọc"
            icon={<TrashIconOutline className="text-red text-base" />}
            className="bg-white p-8 rounded-lg shadow-shadow-1 w-full"
            textClassName="text-red text-base"
            onClick={() => {
              router.push('/search')
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
