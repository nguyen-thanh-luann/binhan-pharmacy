import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useAttributeMinor, useBanner } from '@/hooks'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { ProductSlideBanner } from '../banner'
import { ProductItemLoading } from '../product'
import { ProductsByAttributeMinor } from './productsByAttributeMinor'

interface ListProductByAttributeMinorProps {
  className?: string
}

export const ListProductByAttributeMinor = ({ className }: ListProductByAttributeMinorProps) => {
  const { attributeMinors, isValidating: attributeMinorLoading } = useAttributeMinor({
    key: SWR_KEY.get_attribute_minor_list,
    params: {
      view_state: 'home',
      limit: DEFAULT_LIMIT,
    },
  })

  const { data: bannerList, isValidating: isLoadingBanner } = useBanner({
    key: `${SWR_KEY.get_banner_list}`,
    params: {
      banner_size: '3:1',
    },
  })

  const [_, ...restAttributeMinors] = attributeMinors

  return (
    <div className={twMerge(classNames(``, className))}>
      {attributeMinorLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
          {Array.from({ length: 5 }).map((_, index) => (
            <ProductItemLoading key={index} />
          ))}
        </div>
      ) : isArrayHasValue(restAttributeMinors) ? (
        restAttributeMinors?.map((attribute, index) => (
          <div key={index}>
            <ProductsByAttributeMinor
              className="mb-24"
              key={attribute?.attribute_id}
              atribute={attribute}
            />

            {isLoadingBanner ? (
              <div className="animate-pulse bg-gray-200 hidden md:block aspect-[5/1] mt-24"></div>
            ) : (
              bannerList?.[index] && (
                <ProductSlideBanner data={bannerList?.[index]} className="hidden md:block" />
              )
            )}
          </div>
        ))
      ) : null}
    </div>
  )
}
