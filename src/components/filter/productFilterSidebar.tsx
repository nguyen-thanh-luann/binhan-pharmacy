import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
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
  price_max = 100000,
  price_min = 0,
}: ProductFilterSidebarProps) => {

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
    </div>
  )
}
