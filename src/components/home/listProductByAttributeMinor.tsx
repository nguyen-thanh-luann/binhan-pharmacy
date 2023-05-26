import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useAttributeMinor, useBanner } from '@/hooks'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { ProductItemLoading } from '../product'
import { ProductsByAttributeMinor } from './productsByAttributeMinor'
import { ProductSlideBanner } from '../banner'

interface ListProductByAttributeMinorProps {
  className?: string
}

export const ListProductByAttributeMinor = ({ className }: ListProductByAttributeMinorProps) => {
  const { attributeMinors, isValidating: attributeMinorLoading } = useAttributeMinor({
    key: SWR_KEY.get_attribute_minor_list,
    params: {},
  })

  const { data: bannerList, isValidating } = useBanner({
    key: `${SWR_KEY.get_banner_list}`,
    params: {
      banner_size: '3:1',
    },
  })

  console.log({ bannerList })

  console.log({ isValidating })

  return (
    <div className={twMerge(classNames(``, className))}>
      {attributeMinorLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
          {Array.from({ length: 5 }).map((_, index) => (
            <ProductItemLoading key={index} />
          ))}
        </div>
      ) : isArrayHasValue(attributeMinors) ? (
        attributeMinors?.map((attribute, index) => (
          <div>
            <ProductsByAttributeMinor
              className="mb-24"
              key={attribute?.attribute_id}
              atribute={attribute}
            />

            {bannerList?.[index] && (
              <ProductSlideBanner data={bannerList?.[index]} className="hidden md:block" />
            )}
          </div>
        ))
      ) : null}
    </div>
  )
}
