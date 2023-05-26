import { SWR_KEY } from '@/constants'
import { useAttributeMinor, useBanner } from '@/hooks'
import React from 'react'
import { ProductsByAttributeMinor } from './productsByAttributeMinor'
import { isArrayHasValue } from '@/helper'
import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'
import { ProductItemLoading } from '../product'

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

  console.log({ isValidating });
  
  // nếu 
  
  return (
    <div className={twMerge(classNames(``, className))}>
      {attributeMinorLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
          {Array.from({ length: 5 }).map((_, index) => (
            <ProductItemLoading key={index} />
          ))}
        </div>
      ) : isArrayHasValue(attributeMinors) ? (
        attributeMinors?.map((attribute) => (
          <ProductsByAttributeMinor
            className="mb-24"
            key={attribute?.attribute_id}
            atribute={attribute}
          />
        ))
      ) : null}
    </div>
  )
}
